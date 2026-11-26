# knowledge

학습하면서 정리하는 개인 저장소입니다. 주제별로 폴더를 나눠서 쌓아갑니다.

## 폴더

| 폴더 | 내용 |
|---|---|
| [`nextjs-practice/`](./nextjs-practice) | Next.js(App Router) / React 핵심 개념 10가지를 실습 코드로 복습하는 프로젝트. [GitHub Pages로 데모 보기](https://noni1016.github.io/knowledge/nextjs-practice/) |
| [`video-classification/`](./video-classification) | 사전학습된 3D CNN(`r3d_18`)으로 UCF101 영상 일부를 파인튜닝하며 영상 데이터 학습 방법을 익히는 노트북 모음 |
| [`python-syntax/`](./python-syntax) | Python 문법을 주제별 12개 Jupyter 노트북으로 정리 (변수/타입부터 데코레이터, OOP, 제너레이터, 타입힌트, 동시성까지) |

## GitHub Pages 배포

`main`에 push되면 `.github/workflows/deploy-pages.yml`이 자동으로 정적
빌드 가능한 부분만 빌드해서 Pages로 배포합니다 (서버가 필요한 기능은
안내 페이지로 대체됩니다 — 각 프로젝트 README에 상세 설명 있음).
