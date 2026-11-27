# food101-classification

Food-101(101개 음식 카테고리, 101,000장 이미지)로 ImageNet 사전학습 ResNet-18을
전이학습(fine-tuning)한 노트북. `small-model-gpu-training` 단계(MNIST + TinyCNN)
다음으로 진행한, "실제 내 데이터로 더 깊이 들어가기"의 첫 단계.

`video-classification/`의 영상 분류 파이프라인이 바로 이 노트북의 구조(데이터 로딩 →
전이학습 모델 구성 → 학습 → 평가 → 추론)를 영상에 맞게 그대로 따라간 것이다.

## 내용

- [`food101_training.ipynb`](./food101_training.ipynb) — 데이터 로딩부터 추론까지 한 셀씩
  실행하며 결과(학습 곡선, 샘플 예측)를 바로 확인하는 노트북. 실제 실행 결과가 그대로 저장돼 있다.

## 설정 / 결과 요약

| 항목 | 값 |
|---|---|
| 데이터셋 | Food-101 (`torchvision.datasets.Food101`), train 75,750장 / test 25,250장, 101클래스 |
| 입력 크기 | 160x160 |
| 모델 | ResNet-18 (ImageNet 사전학습, `fc`만 101-way로 교체 후 전체 fine-tuning) |
| 배치 크기 | 32 |
| 에폭 | 5 |
| 옵티마이저 | AdamW + CosineAnnealingLR |
| **테스트 정확도** | **74.93%** |
| GPU | RTX 2060(6GB) — 학습 중 GPU 메모리 사용량 약 0.2GB대로 여유 있게 돌아감 |

## 실행 방법

```bash
pip install -r requirements.txt
jupyter notebook food101_training.ipynb
```

처음 실행하면 Food-101 데이터셋(약 4.65GB)과 ResNet-18 사전학습 가중치(약 45MB)를
자동으로 다운로드한다. `data/`, `checkpoints/`는 노트북과 같은 위치에 생기며
`.gitignore`로 커밋 대상에서 제외했다.

## 다음에 해볼 것

노트북 마지막 셀에 적어둔 대로:
- `EPOCHS`를 늘려서 정확도 변화 관찰 (지금은 5 epoch)
- 마지막 `fc`만 학습하는 freeze 방식과 지금의 전체 fine-tuning 비교
- 클래스별 정확도(confusion matrix)로 어떤 음식이 잘 헷갈리는지 분석
- 다음 단계인 영상 데이터 학습은 [`video-classification/`](../video-classification)에서 이어진다.
