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
// 주의: 이 renderedAt이 새로고침마다 바뀌는지 아닌지는 "export냐 아니냐"가
// 아니라, 이 라우트가 "정적 렌더링"인지 "동적 렌더링"인지에 달려있다.
//
// Next.js App Router의 기본값은 "정적 렌더링(Static Rendering)"이다 —
// 이 컴포넌트가 cookies()/headers()/searchParams 같은 "동적 함수"를
// 전혀 쓰지 않으면, Next.js는 "이 페이지는 요청마다 달라질 이유가 없다"고
// 판단해서 **빌드 시점에 딱 한 번 렌더링**하고 그 결과를 재사용한다.
// new Date()는 그런 동적 함수가 아니라서, 이 페이지는 정적으로 취급된다.
//
//   - output: "export" (GitHub Pages 등 정적 호스팅)
//     → 서버 자체가 없음. 빌드 때 만든 HTML 파일을 그냥 그대로 서빙.
//   - npm run build && npm run start (Node.js 서버 실행, 예: 엔진엑스가
//     이 Node 프로세스로 리버스 프록시)
//     → 서버는 진짜로 살아있지만, 이 페이지는 여전히 "정적"으로 분류되어
//       빌드 시점에 만든 결과를 캐시해서 재사용한다. 즉 서버가 켜져 있어도
//       new Date()는 다시 계산되지 않는다 — 결과적으로 export와 동일하게
//       새로고침해도 시간이 고정되어 있다.
//
// 그런데 "npm run dev"로 로컬 개발할 때는 느낌이 다르다 — dev 모드는
// 캐싱을 하지 않고 매 요청마다 전부 새로 렌더링하기 때문에, 이 페이지가
// 마치 "동적"인 것처럼 매번 시간이 바뀌는 것처럼 보인다. 이게 착시를
// 일으키기 쉬운 부분: 실제 운영 배포(export든 start든)에서는 이 페이지가
// 정적이라는 게 진짜 동작이고, dev 모드의 "매번 새로 그림"은 개발 편의를
// 위한 예외다.
//
// 진짜로 요청마다 새 시간을 보고 싶다면(= 이 라우트를 동적으로 강제하려면):
//   export const dynamic = "force-dynamic";
// 을 추가하면 된다. 단, 이건 서버가 실제로 살아있어야 의미가 있어서
// output: "export"(서버 없음)와는 함께 쓸 수 없다 — 빌드 자체가 실패한다.
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
          <strong>npm run dev</strong>로 보고 있다면 새로고침마다 이 시간이
          바뀝니다 (dev 모드는 캐싱 없이 매번 새로 렌더링). 하지만 실제
          배포본(GitHub Pages의 정적 export든, <code>npm run start</code>로
          띄운 Node 서버든)에서는 이 값이 <strong>빌드 시점에 고정</strong>
          됩니다 — 이 페이지가 동적 함수를 쓰지 않아 "정적 렌더링"으로
          분류되기 때문입니다. 자세한 이유는 위 코드 주석 참고.
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
