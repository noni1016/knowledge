# video-classification

Food101 이미지 분류 파인튜닝에 이어서, **영상(video) 데이터를 학습시키는 방법**을 익히기 위한
노트북 모음. 전체 UCF101을 받지 않고 10개 클래스/500개 영상짜리 작은 서브셋으로 사전학습된
3D CNN(`r3d_18`)을 파인튜닝하는 파이프라인을 처음부터 끝까지 따라가 본다.

## 노트북 순서

| 노트북 | 내용 |
|---|---|
| [`01_video_io_and_frame_sampling.ipynb`](./01_video_io_and_frame_sampling.ipynb) | UCF101 10개 클래스 서브셋 다운로드, OpenCV로 영상 읽기, 균등 프레임 샘플링 + 시각화 |
| [`02_pytorch_video_dataset.ipynb`](./02_pytorch_video_dataset.ipynb) | 커스텀 `Dataset`/`DataLoader`로 영상 클립을 배치 텐서로 불러오기 |
| [`03_pretrained_video_models.ipynb`](./03_pretrained_video_models.ipynb) | `r3d_18` / `mc3_18` / `r2plus1d_18` 비교, 분류 head 교체, freeze 설정 |
| [`04_finetune_video_classifier.ipynb`](./04_finetune_video_classifier.ipynb) | 실제 파인튜닝 학습/평가 루프, 체크포인트 저장, 학습 곡선 시각화 |
| [`05_inference_demo.ipynb`](./05_inference_demo.ipynb) | 저장된 체크포인트로 새 영상 추론 + 클래스별 확률 시각화 |

`video_utils.py`는 모든 노트북이 공유하는 프레임 샘플링 / 텐서 변환 / `Dataset` 코드를 모아둔
모듈이다 (노트북끼리 코드 중복을 줄이기 위함).

## 환경

```bash
pip install -r requirements.txt
```

- GPU: RTX 2060(6GB) 기준으로 `batch_size=4`, `num_frames=16`, 해상도 112x112 조합을 기본값으로 뒀다.
  OOM이 나면 `batch_size`부터 줄이기.
- 데이터는 `01_video_io_and_frame_sampling.ipynb`를 실행하면 `data/UCF101_subset/`에 자동으로
  받아진다. 공식 TensorFlow 튜토리얼과 같은 10개 클래스 서브셋(클래스당 30/10/10 = train/val/test,
  총 500개 영상, 약 171MB)을 Hugging Face 미러(`sayakpaul/ucf101-subset`)에서 받는다 — 원래 쓰려던
  구글 클라우드 스토리지 버킷(`storage.googleapis.com/thumos14_files/...`)이 환경에 따라 막혀 있어서
  더 안정적인 경로로 바꿨다. 원하는 클래스를 직접 고르고 싶다면 01 노트북 맨 아래 "참고" 섹션 참고.
- 체크포인트는 `checkpoints/r3d18_ucf101_subset.pt`에 저장된다.
- `data/`, `checkpoints/`는 `.gitignore`에 추가해서 리포지토리에 커밋되지 않도록 했다.

## 다음 단계

분류를 넘어서 "시간 순서/절차가 중요한" 문제로 넘어가고 싶다면, 요리 절차 영상 데이터셋인
YouCook2 쪽으로 확장하는 것이 다음 자연스러운 단계다 (각 노트북 끝에 메모해 둠).
