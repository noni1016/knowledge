# fsd-world-model-toy

테슬라 FSD류의 end-to-end 자율주행 스택을 이해하기 위한 토이 프로젝트. 실제 멀티카메라
주행 데이터 대신, 완전히 합성(synthetic)한 2D 주행 시뮬레이터로 (1) 멀티카메라 퓨전,
(2) 시계열 모델링, (3) 재귀적 월드 모델(World Model) + imagination 롤아웃까지 직접 손으로
구현하며 원리를 익힌다. RTX 2060(6GB)에서 전체 파이프라인이 몇 분 안에 돈다.

## 노트북 순서

| 노트북 | 내용 |
|---|---|
| [`00_concepts_and_architecture.ipynb`](./00_concepts_and_architecture.ipynb) | 왜 멀티카메라/시계열/월드모델 세 축인지, 전체 로드맵 |
| [`01_sim_and_data.ipynb`](./01_sim_and_data.ipynb) | 합성 주행 시뮬레이터 + 3카메라(front/left/right) 렌더링 + `Dataset`/`DataLoader` |
| [`02_model_architecture.ipynb`](./02_model_architecture.ipynb) | 멀티카메라 인코더 → GRU 기반 재귀 월드모델 → 디코더 구조, 파라미터 수 확인 |
| [`03_train_world_model.ipynb`](./03_train_world_model.ipynb) | 학습 루프(재구성 loss + 임베딩 예측 loss), loss curve, 체크포인트 저장 |
| [`04_imagination_rollout_and_issue_discovery.ipynb`](./04_imagination_rollout_and_issue_discovery.ipynb) | 관측 없이 action만으로 굴리는 open-loop imagination 롤아웃, 오차 누적 시각화, 이슈 리포트 작성 연습 |

`wm_toy.py`는 모든 노트북이 공유하는 시뮬레이터 / Dataset / 모델 코드를 모아둔 모듈이다
(`video-classification/video_utils.py`와 같은 패턴).

## 환경

```bash
pip install -r requirements.txt
```

- GPU: RTX 2060(6GB) 기준. 모델은 약 100만 파라미터(`02` 노트북에서 확인 가능)라 배치 크기나
  해상도를 걱정할 일은 거의 없다. GPU 없이 CPU로도 `03` 학습 루프가 몇 분 안에 끝난다.
- 데이터는 다운로드가 전혀 필요 없다 — `wm_toy.py`의 `simulate_episode()`가 매번 그 자리에서
  세계를 생성한다 (고정 시드라 재현 가능).
- 체크포인트는 `checkpoints/world_model.pt`에 저장된다.
- `checkpoints/`, `__pycache__/`는 `.gitignore`에 추가해서 리포지토리에 커밋되지 않도록 했다.

## 실제 데이터로 넘어가고 싶다면

`WMSequenceDataset`과 `WorldModel`은 입력 shape(`(T, num_cams, 3, H, W)`, `(T, action_dim)`)만
맞으면 그대로 재사용 가능하다. `simulate_episode()`를 실제 멀티카메라 로그 + CAN 데이터를
읽는 함수로 바꾸고, `CamEncoder`/`CamDecoder`의 해상도와 채널 수를 조정하는 정도가 다음 단계다.
월드모델 쪽을 더 "제대로" 만들고 싶다면 `04` 노트북 마지막의 이슈 리포트에서 언급한
확률적 잠재변수(RSSM/Dreamer 스타일) 도입이 자연스러운 다음 걸음이다.
