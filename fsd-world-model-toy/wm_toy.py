"""
wm_toy.py — shared library for the FSD-v15-style world model toy project.

This module is intentionally self-contained and dependency-light (numpy,
PIL, torch) so every notebook in this folder can just do:

    from wm_toy import simulate_episode, WMSequenceDataset, CamEncoder, WorldModel

It has three parts:
  1. A tiny procedural driving simulator + multi-camera renderer
     (SimConfig, simulate_episode, render helpers)
  2. A PyTorch Dataset that turns simulated episodes into (frames, actions)
     training sequences (WMSequenceDataset)
  3. The world model itself: a shared-weight multi-camera encoder, a
     recurrent latent dynamics core (GRU-based, Dreamer/World-Models style
     but deterministic for simplicity), and a multi-camera decoder
     (CamEncoder, WorldModelCore, CamDecoder, WorldModel)

See 00_concepts_and_architecture.ipynb for the "why" behind this design.
"""
from __future__ import annotations

import dataclasses
import io
import math
from dataclasses import dataclass, field
from typing import List, Tuple

import numpy as np
import torch
import torch.nn as nn
import torch.nn.functional as F
from PIL import Image, ImageDraw

# --------------------------------------------------------------------------
# 1. Simulator + multi-camera renderer
# --------------------------------------------------------------------------

PANO_W, PANO_H = 192, 64       # one shared "ground truth" panorama of the scene
CAM_W, CAM_H = 64, 64          # each camera's crop out of the panorama
NUM_CAMS = 3                   # front, left-repeater, right-repeater
CAM_NAMES = ["front", "left", "right"]
ACTION_DIM = 2                 # (steer, throttle)
STATE_DIM = 6                  # ego_lane, ego_speed, lead1_lane, lead1_dist, lead2_lane, lead2_dist


@dataclass
class SimConfig:
    T: int = 40                 # episode length (timesteps)
    dt: float = 0.25
    steer_gain: float = 0.9
    throttle_gain: float = 1.2
    ego_speed_min: float = 0.2
    ego_speed_max: float = 1.4
    target_headway: float = 0.55   # desired normalized distance to a lead car
    lane_noise: float = 0.03
    action_noise: float = 0.08
    seed: int = 0


def _scripted_action(state: np.ndarray, target_lane: float, rng: np.random.Generator, cfg: SimConfig):
    """A crude ACC + lane-centering 'autopilot' used only to generate varied,
    semi-realistic training trajectories. This is NOT the world model — it's
    just a data-generating policy, same role real logged driving data plays
    for a real AV stack."""
    ego_lane, ego_speed, lead1_lane, lead1_dist, lead2_lane, lead2_dist = state

    # lane-centering steer: drive ego_lane toward target_lane
    steer = np.clip((target_lane - ego_lane) * 2.5, -1, 1)

    # adaptive-cruise-style throttle: slow down if the nearer same-ish-lane
    # lead car is closer than the target headway, speed up otherwise
    nearest_dist = min(lead1_dist if abs(lead1_lane - ego_lane) < 0.5 else 10.0,
                        lead2_dist if abs(lead2_lane - ego_lane) < 0.5 else 10.0)
    headway_error = nearest_dist - cfg.target_headway
    throttle = np.clip(headway_error * 1.8, -1, 1)

    steer += rng.normal(0, cfg.action_noise)
    throttle += rng.normal(0, cfg.action_noise)
    return np.clip(np.array([steer, throttle], dtype=np.float32), -1, 1)


def simulate_episode(cfg: SimConfig = None) -> Tuple[np.ndarray, np.ndarray, np.ndarray]:
    """Simulate one episode.

    Returns
    -------
    frames : float32 array (T, NUM_CAMS, 3, CAM_H, CAM_W) in [0, 1]
    actions: float32 array (T, ACTION_DIM)   action applied *before* step t
    states : float32 array (T, STATE_DIM)    ego/lead state *after* step t
    """
    cfg = cfg or SimConfig()
    rng = np.random.default_rng(cfg.seed)

    ego_lane = rng.uniform(-0.3, 0.3)
    ego_speed = rng.uniform(cfg.ego_speed_min, cfg.ego_speed_max)
    lead1_lane = rng.uniform(-1, 1)
    lead1_dist = rng.uniform(0.3, 1.0)
    lead2_lane = rng.uniform(-1, 1)
    lead2_dist = rng.uniform(0.3, 1.0)

    # the scripted policy slowly changes its desired lane, like a lane change
    target_lane = ego_lane
    target_change_every = rng.integers(10, 25)

    frames = np.zeros((cfg.T, NUM_CAMS, 3, CAM_H, CAM_W), dtype=np.float32)
    actions = np.zeros((cfg.T, ACTION_DIM), dtype=np.float32)
    states = np.zeros((cfg.T, STATE_DIM), dtype=np.float32)

    for t in range(cfg.T):
        if t % target_change_every == 0:
            target_lane = np.clip(target_lane + rng.uniform(-0.6, 0.6), -0.9, 0.9)

        state = np.array([ego_lane, ego_speed, lead1_lane, lead1_dist, lead2_lane, lead2_dist],
                          dtype=np.float32)
        action = _scripted_action(state, target_lane, rng, cfg)

        # --- physics update ---
        ego_lane = float(np.clip(ego_lane + action[0] * cfg.steer_gain * cfg.dt, -1, 1))
        ego_speed = float(np.clip(ego_speed + action[1] * cfg.throttle_gain * cfg.dt,
                                   cfg.ego_speed_min, cfg.ego_speed_max))
        lead1_speed = 0.7 + 0.2 * math.sin(0.3 * t + cfg.seed)
        lead2_speed = 0.7 + 0.2 * math.sin(0.2 * t + 1.7 + cfg.seed)
        lead1_dist = float(np.clip(lead1_dist + (lead1_speed - ego_speed) * cfg.dt * 0.6, 0.05, 1.2))
        lead2_dist = float(np.clip(lead2_dist + (lead2_speed - ego_speed) * cfg.dt * 0.6, 0.05, 1.2))
        lead1_lane = float(np.clip(lead1_lane + rng.normal(0, cfg.lane_noise), -1, 1))
        lead2_lane = float(np.clip(lead2_lane + rng.normal(0, cfg.lane_noise), -1, 1))

        new_state = np.array([ego_lane, ego_speed, lead1_lane, lead1_dist, lead2_lane, lead2_dist],
                              dtype=np.float32)

        pano = render_panorama(new_state)
        cams = crop_cameras(pano)  # (NUM_CAMS, 3, CAM_H, CAM_W) in [0,1]

        frames[t] = cams
        actions[t] = action
        states[t] = new_state

    return frames, actions, states


def render_panorama(state: np.ndarray) -> Image.Image:
    """Draw one wide 'ground truth world' frame: road, lane lines, two lead
    vehicles. Ego motion is rendered as a horizontal shift of the whole scene
    (ego-centric view), the same convention every camera crop shares."""
    ego_lane, ego_speed, lead1_lane, lead1_dist, lead2_lane, lead2_dist = state

    img = Image.new("RGB", (PANO_W, PANO_H), (120, 170, 230))  # sky
    draw = ImageDraw.Draw(img)
    horizon = PANO_H // 2
    draw.rectangle([0, horizon, PANO_W, PANO_H], fill=(60, 60, 65))  # road

    # ego-motion compensation: ego_lane shifts the whole road sideways
    cx = PANO_W / 2 - ego_lane * (PANO_W / 2.2)

    for lane_edge in (-1.0, -0.33, 0.33, 1.0):
        x = cx + lane_edge * (PANO_W / 2.2)
        dash_h = 5
        for y in range(horizon, PANO_H, dash_h * 2):
            draw.line([(x, y), (x, y + dash_h)], fill=(230, 230, 230), width=2)

    for lane, dist, color in ((lead1_lane, lead1_dist, (210, 60, 60)),
                               (lead2_lane, lead2_dist, (60, 160, 90))):
        # near distance -> big box lower in the frame; far -> small, near horizon
        scale = 1.0 - 0.85 * dist
        if scale <= 0.03:
            continue
        box_w, box_h = 18 * scale, 14 * scale
        bx = cx + (lane - ego_lane) * (PANO_W / 2.2) * (1.0 - 0.4 * dist)
        by = PANO_H - 4 - (PANO_H - horizon - 10) * dist
        draw.rectangle([bx - box_w / 2, by - box_h, bx + box_w / 2, by], fill=color)

    return img


def crop_cameras(pano: Image.Image) -> np.ndarray:
    """Front/left/right camera crops out of one shared panorama, mimicking
    a surround rig: same world, three different mounting positions/FOVs."""
    arr = np.asarray(pano, dtype=np.float32) / 255.0  # (PANO_H, PANO_W, 3)
    cx = PANO_W // 2
    front = arr[:, cx - CAM_W // 2: cx + CAM_W // 2, :]
    left = arr[:, 0:CAM_W, :]
    right = arr[:, PANO_W - CAM_W:PANO_W, :][:, ::-1, :]  # repeater mirror convention

    cams = np.stack([front, left, right], axis=0)          # (3, H, W, 3)
    cams = np.transpose(cams, (0, 3, 1, 2))                 # (3, 3, H, W) = (cam, C, H, W)
    return cams.astype(np.float32)


def frame_to_uint8(img_chw: np.ndarray) -> np.ndarray:
    """(3,H,W) float [0,1] -> (H,W,3) uint8, for quick visualization."""
    img = np.clip(img_chw, 0, 1)
    return (np.transpose(img, (1, 2, 0)) * 255).astype(np.uint8)


# --------------------------------------------------------------------------
# 2. Dataset
# --------------------------------------------------------------------------

class WMSequenceDataset(torch.utils.data.Dataset):
    """Generates `num_episodes` fixed episodes up front (deterministic seeds),
    each of length `T`. One dataset item = one full episode:
        frames : (T, NUM_CAMS, 3, CAM_H, CAM_W) float32 in [0,1]
        actions: (T, ACTION_DIM) float32
    """

    def __init__(self, num_episodes: int = 64, T: int = 40, base_seed: int = 1000):
        self.episodes = []
        for i in range(num_episodes):
            cfg = SimConfig(T=T, seed=base_seed + i)
            frames, actions, states = simulate_episode(cfg)
            self.episodes.append((frames, actions, states))

    def __len__(self):
        return len(self.episodes)

    def __getitem__(self, idx):
        frames, actions, states = self.episodes[idx]
        return (torch.from_numpy(frames), torch.from_numpy(actions), torch.from_numpy(states))


# --------------------------------------------------------------------------
# 3. Model: shared multi-camera encoder -> recurrent world model -> decoder
# --------------------------------------------------------------------------

EMBED_PER_CAM = 32
OBS_EMBED_DIM = EMBED_PER_CAM * NUM_CAMS   # fused multi-camera embedding
HIDDEN_DIM = 128


class CamEncoder(nn.Module):
    """One small CNN, shared across all cameras (weight sharing = the model
    doesn't need to 're-learn' what a lane line looks like per camera)."""

    def __init__(self, embed_dim: int = EMBED_PER_CAM):
        super().__init__()
        self.net = nn.Sequential(
            nn.Conv2d(3, 16, 4, stride=2, padding=1), nn.ReLU(),   # 64 -> 32
            nn.Conv2d(16, 32, 4, stride=2, padding=1), nn.ReLU(),  # 32 -> 16
            nn.Conv2d(32, 32, 4, stride=2, padding=1), nn.ReLU(),  # 16 -> 8
            nn.Flatten(),
            nn.Linear(32 * 8 * 8, embed_dim),
        )

    def forward(self, cams: torch.Tensor) -> torch.Tensor:
        # cams: (B, NUM_CAMS, 3, H, W) -> fuse into one embedding per batch item
        B, N, C, H, W = cams.shape
        flat = cams.reshape(B * N, C, H, W)
        emb = self.net(flat).reshape(B, N * self.net[-1].out_features)
        return emb  # (B, OBS_EMBED_DIM)


class CamDecoder(nn.Module):
    """Mirror of CamEncoder: hidden state -> all NUM_CAMS images at once."""

    def __init__(self, hidden_dim: int = HIDDEN_DIM):
        super().__init__()
        self.fc = nn.Linear(hidden_dim, 32 * 8 * 8 * NUM_CAMS)
        self.deconv = nn.Sequential(
            nn.ConvTranspose2d(32, 32, 4, stride=2, padding=1), nn.ReLU(),  # 8 -> 16
            nn.ConvTranspose2d(32, 16, 4, stride=2, padding=1), nn.ReLU(),  # 16 -> 32
            nn.ConvTranspose2d(16, 3, 4, stride=2, padding=1), nn.Sigmoid(),  # 32 -> 64
        )

    def forward(self, h: torch.Tensor) -> torch.Tensor:
        B = h.shape[0]
        x = self.fc(h).reshape(B * NUM_CAMS, 32, 8, 8)
        img = self.deconv(x).reshape(B, NUM_CAMS, 3, CAM_H, CAM_W)
        return img


class WorldModel(nn.Module):
    """Deterministic recurrent world model (a simplified RSSM / World-Models
    core): fuses multi-camera observations with actions into a recurrent
    hidden state, and can be rolled forward WITHOUT observations
    ("imagination") by predicting its own next embedding.

    posterior step (training, teacher-forced):
        obs_embed_t = encoder(frames_t)
        h_t = gru(cat(obs_embed_t, action_t), h_{t-1})

    prior / imagination step (no frames_t available):
        pred_embed_t = embed_head(h_{t-1})      # "what I expect to see"
        h_t = gru(cat(pred_embed_t, action_t), h_{t-1})
    """

    def __init__(self):
        super().__init__()
        self.encoder = CamEncoder()
        self.decoder = CamDecoder()
        self.gru = nn.GRUCell(OBS_EMBED_DIM + ACTION_DIM, HIDDEN_DIM)
        self.embed_head = nn.Sequential(
            nn.Linear(HIDDEN_DIM, HIDDEN_DIM), nn.ReLU(),
            nn.Linear(HIDDEN_DIM, OBS_EMBED_DIM),
        )

    def init_hidden(self, batch_size: int, device) -> torch.Tensor:
        return torch.zeros(batch_size, HIDDEN_DIM, device=device)

    def posterior_step(self, h, frames_t, action_t):
        obs_embed = self.encoder(frames_t)
        h_new = self.gru(torch.cat([obs_embed, action_t], dim=-1), h)
        recon = self.decoder(h_new)
        return h_new, recon, obs_embed

    def prior_step(self, h, action_t):
        pred_embed = self.embed_head(h)
        h_new = self.gru(torch.cat([pred_embed, action_t], dim=-1), h)
        recon = self.decoder(h_new)
        return h_new, recon, pred_embed

    def num_params(self) -> int:
        return sum(p.numel() for p in self.parameters())
