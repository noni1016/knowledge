import ClientCounter from "./ClientCounter";

// 개념: Server Components vs Client Components (App Router의 핵심 변화)
//
// 이 파일(page.js)에는 'use client'가 없다 -> 기본값인 "서버 컴포넌트".
// 서버 컴포넌트는:
//   - 서버에서만 렌더링되고, 그 결과(HTML)만 브라우저로 전송된다.
//   - 브라우저 JS 번들 크기에 포함되지 않는다 (가볍다).
//   - useState/useEffect/onClick 같은 "브라우저 전용" 훅/이벤트를 쓸 수 없다.
//   - DB 접근, 파일 시스템, 비밀 API 키 사용이 안전하다 (서버에서만 실행되므로).
//
// 반면 아래에서 import한 ClientCounter.js 맨 위에는 'use client'가 있다.
//   - 그 파일은 브라우저로 내려가서 실제로 하이드레이션(hydration)된다.
//   - 상호작용(클릭, 입력, state)이 필요한 "잎(leaf) 컴포넌트"에만 붙이는 게
//     번들 크기 관점에서 유리하다 (페이지 전체를 client로 만들지 않는다).
export default function ServerClientPage() {
  const renderedAt = new Date().toISOString();

  return (
    <>
      <h1>4. Server vs Client Components</h1>

      <div className="card">
        <p>이 블록은 서버 컴포넌트입니다.</p>
        <p>
          서버에서 렌더링된 시각: <code>{renderedAt}</code>
        </p>
        <p style={{ opacity: 0.7 }}>
          새로고침할 때마다 이 시간이 바뀝니다 — 매번 서버에서 새로 렌더링해서
          보내주기 때문입니다. (브라우저 state가 아님)
        </p>
      </div>

      <ClientCounter />

      <p style={{ opacity: 0.7 }}>
        정리: "상호작용이 필요하면 'use client', 아니면 기본(서버)으로 둔다."
        서버 컴포넌트 안에 클라이언트 컴포넌트를 넣는 건 되지만, 그 반대로
        클라이언트 컴포넌트 안에서 서버 컴포넌트를 import해서 직접 쓰는 건
        안 된다 (대신 children으로 넘기는 패턴을 쓴다).
      </p>
    </>
  );
}
