# Next.js / React 핵심 개념 복습

오랜만에 Next.js + React를 다시 쓰기 전에, 핵심 개념을 짧게 실습해보는
프로젝트입니다. App Router(Next.js 13+/14) 기준입니다.

## 실행 방법

```bash
cd nextjs-practice
npm install
npm run dev
```

브라우저에서 `http://localhost:3000` 접속 → 홈 화면에서 1~10번 항목을
순서대로(또는 기억 안 나는 것부터) 열어보면 됩니다.

## 구성

| 폴더 | 개념 | 한 줄 요약 |
|---|---|---|
| `app/01-props` | Props & Components | 컴포넌트 = props를 받는 함수. 단방향 데이터 흐름, 리스트 렌더링의 `key` |
| `app/02-state` | useState | 컴포넌트의 "기억". set함수로만 바꿔야 리렌더링됨. 제어 컴포넌트(input) |
| `app/03-effect` | useEffect | 렌더링 이후 실행되는 부수효과. deps 배열, cleanup 함수 |
| `app/04-server-client` | Server vs Client Components | App Router의 가장 큰 변화. 기본은 서버, `'use client'`로 전환 |
| `app/05-dynamic-route/[id]` | Dynamic Routing | 폴더명 `[id]`로 URL 파라미터 받기 |
| `app/06-data-fetching` | 서버 컴포넌트에서 fetch | `async function` 컴포넌트, fetch 캐싱 옵션(`no-store`, `revalidate`) |
| `app/api/hello` + `app/07-api-route` | API Route (route.js) | 내 백엔드 엔드포인트 직접 만들기, 클라이언트에서 fetch로 호출 |
| `app/08-forms-action` | Server Actions | `'use server'` 함수를 폼 action으로 직접 연결, useFormState/useFormStatus |
| `app/09-context` | Context API | props drilling 없이 상태 공유 (Provider → useContext) |
| `app/10-custom-hook` | Custom Hooks | `use`로 시작하는 함수로 state+effect 로직 재사용 (localStorage 예시) |

## 기억이 흐릿할 때 특히 다시 볼 것

- **서버 vs 클라이언트 컴포넌트 (04번)**: pages 라우터 시절에는 없던 개념이라
  가장 헷갈리기 쉬운 부분입니다. "상호작용(state, 이벤트, 브라우저 API)이
  필요하면 `'use client'`, 아니면 기본값(서버)"이 기본 원칙입니다.
- **데이터 페칭 (06번)**: `useEffect` + `fetch` + `useState("loading")`
  패턴을 서버 컴포넌트의 `await fetch(...)`가 많이 대체합니다.
- **Server Actions (08번)**: pages 라우터에는 없던 기능으로, API Route를
  따로 안 만들어도 폼 제출을 서버 함수로 바로 처리할 수 있습니다.

## 다음에 더 해볼만한 것

- `loading.js` / `error.js` 로 라우트별 로딩/에러 UI 자동 연결해보기
- `middleware.js`로 요청 가로채기(인증 체크 등)
- 이 프로젝트를 MLOps 쪽 결과물(학습 로그, 추론 결과)을 보여주는 간단한
  대시보드로 확장해보기 — 06/07번 패턴을 그대로 가져다 쓰면 됩니다.
