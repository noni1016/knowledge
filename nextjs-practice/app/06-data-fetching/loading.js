// 개념: loading.js — 라우트 세그먼트별 로딩 UI
//
// 같은 폴더(app/06-data-fetching/)에 "loading.js"라는 이름으로 파일을
// 두면, Next.js가 자동으로 이 폴더의 page.js를 <Suspense fallback={...}>
// 로 감싸준다. 별도로 상태(state)를 만들거나 if(loading) 분기를 짤 필요가
// 없다 — 파일 이름 규칙만으로 끝난다.
//
// 동작 순서:
//   1) 사용자가 /06-data-fetching으로 이동
//   2) page.js(비동기 서버 컴포넌트)가 await fetch(...)로 데이터를 가져오는
//      동안, 그 자리에 이 loading.js가 먼저 렌더링되어 보인다.
//   3) fetch가 끝나면 Next.js가 이 로딩 UI를 실제 page.js 결과로 교체한다.
//
// 주의(중요): 이 효과는 "요청이 올 때마다 서버가 실제로 기다리는" 상황에서만
// 보인다 — 즉 npm run dev, 또는 npm run start로 띄운 실제 서버에서 이
// 페이지가 "동적 렌더링"으로 동작할 때다. 반면 GitHub Pages처럼
// output: "export"로 정적으로 미리 구워버린 페이지는 fetch가 이미
// 빌드 시점에 끝나있어서, 배포된 사이트에서는 이 로딩 화면이 거의 보이지
// 않는다(너무 순식간이라 스킵된 것처럼 느껴짐). 로컬에서
// npm run dev로 확인하는 걸 추천한다.
export default function Loading() {
  return (
    <>
      <h1>6. Data Fetching (서버 컴포넌트)</h1>
      <p>로봇 상태를 불러오는 중입니다...</p>
      <div className="card">
        <div className="skeleton-bar" style={{ width: "60%", marginBottom: 8 }} />
      </div>
      <div className="card">
        <div className="skeleton-bar" style={{ width: "45%", marginBottom: 8 }} />
      </div>
      <div className="card">
        <div className="skeleton-bar" style={{ width: "70%", marginBottom: 8 }} />
      </div>
    </>
  );
}
