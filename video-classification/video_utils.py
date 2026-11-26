"""
video-classification 프로젝트에서 공통으로 쓰는 유틸 함수 모음.

- 영상 파일에서 프레임을 균등 샘플링해서 (T, H, W, C) 클립으로 만들고
- PyTorch Dataset/DataLoader에 바로 넣을 수 있는 (C, T, H, W) 텐서로 변환한다.

torchvision.io.read_video는 버전에 따라 API가 자주 바뀌어서(실제로 이 노트북을
준비하면서 torchvision 0.29에서는 아예 사라진 것을 확인했다), 여기서는 더 안정적인
OpenCV(cv2.VideoCapture)만으로 프레임을 읽는다.
"""
from pathlib import Path

import cv2
import numpy as np
import torch
from torch.utils.data import Dataset

# torchvision의 Kinetics-400 사전학습 3D 모델들이 기대하는 입력 정규화 통계값
# (r3d_18 / mc3_18 / r2plus1d_18 전부 동일한 값을 사용)
KINETICS_MEAN = torch.tensor([0.43216, 0.394666, 0.37645]).view(3, 1, 1, 1)
KINETICS_STD = torch.tensor([0.22803, 0.22145, 0.216989]).view(3, 1, 1, 1)


def sample_frames_uniform(video_path, num_frames: int = 16, size: int = 112):
    """영상 전체 길이에서 num_frames장을 균등 간격으로 뽑아 (T, H, W, C) uint8 배열로 반환.

    Food101 노트북에서 "이미지 한 장 -> 텐서" 였다면, 영상에서는
    "프레임 여러 장을 시간축으로 쌓은 덩어리(clip) -> 텐서" 가 입력 단위가 된다.
    """
    cap = cv2.VideoCapture(str(video_path))
    if not cap.isOpened():
        raise RuntimeError(f"영상을 열 수 없습니다: {video_path}")

    total = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    if total <= 0:
        cap.release()
        raise RuntimeError(f"프레임 수를 읽을 수 없습니다: {video_path}")

    # 0 ~ total-1 구간에서 num_frames개 인덱스를 균등하게 뽑는다.
    target_idxs = np.linspace(0, total - 1, num_frames).astype(int)
    wanted = sorted(set(target_idxs.tolist()))

    collected = {}
    cur_idx = 0
    want_iter = iter(wanted)
    next_want = next(want_iter, None)

    while next_want is not None:
        ok, frame = cap.read()
        if not ok:
            break
        if cur_idx == next_want:
            frame = cv2.resize(frame, (size, size))
            collected[cur_idx] = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            next_want = next(want_iter, None)
        cur_idx += 1
    cap.release()

    if len(collected) < len(wanted):
        # 코덱 문제 등으로 끝까지 못 읽은 경우, 마지막으로 읽은 프레임을 반복해서 채운다.
        last = next(reversed(collected.values())) if collected else np.zeros(
            (size, size, 3), dtype=np.uint8
        )
        for idx in wanted:
            collected.setdefault(idx, last)

    frames = [collected[idx] for idx in target_idxs]
    return np.stack(frames, axis=0)  # (T, H, W, C), uint8, RGB


def clip_to_tensor(clip: np.ndarray) -> torch.Tensor:
    """(T, H, W, C) uint8 클립을 정규화된 (C, T, H, W) float 텐서로 변환."""
    t = torch.from_numpy(clip).permute(3, 0, 1, 2).float() / 255.0
    return (t - KINETICS_MEAN) / KINETICS_STD


class VideoClipDataset(Dataset):
    """(영상 경로, 라벨) 목록을 받아 (clip_tensor, label) 쌍을 돌려주는 Dataset.

    Food101 노트북의 ImageFolder 역할을 영상에 맞게 대체한 버전이라고 보면 된다.
    """

    def __init__(self, paths, labels, num_frames: int = 16, size: int = 112):
        assert len(paths) == len(labels)
        self.paths = [Path(p) for p in paths]
        self.labels = labels
        self.num_frames = num_frames
        self.size = size

    def __len__(self):
        return len(self.paths)

    def __getitem__(self, idx):
        clip = sample_frames_uniform(self.paths[idx], self.num_frames, self.size)
        return clip_to_tensor(clip), self.labels[idx]


def denormalize_for_display(tensor_chw: torch.Tensor) -> np.ndarray:
    """clip_to_tensor로 정규화된 한 프레임(C,H,W)을 다시 0~1 범위 (H,W,C)로 되돌린다(시각화용)."""
    t = tensor_chw * KINETICS_STD[:, 0] + KINETICS_MEAN[:, 0]
    t = t.clamp(0, 1).permute(1, 2, 0).numpy()
    return t
