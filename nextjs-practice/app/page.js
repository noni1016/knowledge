import Link from "next/link";

// next/link를 쓰는 이유: 일반 <a href="/01-props">를 쓰면, GitHub Pages처럼
// basePath(예: /nextjs-practice)가 붙는 배포 환경에서 링크가 깨진다
// (브라우저가 그대로 도메인 루트의 /01-props로 보내버림). next/link의
// <Link>는 next.config.js의 basePath를 자동으로 앞에 붙여주고, 페이지
// 전환도 풀 리로드 없이 클라이언트에서 처리해준다.
const modules = [
  {
    href: "/01-props",
    title: "1. Props & Components",
    desc: "컴포넌트는 함수다. props로 데이터를 아래로 흘려보낸다.",
  },
  {
    href: "/02-state",
    title: "2. State (useState)",
    desc: "컴포넌트 자신의 기억. state가 바뀌면 리렌더링된다.",
  },
  {
    href: "/03-effect",
    title: "3. Effects (useEffect)",
    desc: "렌더링 이후에 실행되는 '부수효과'. 타이머, 구독, cleanup.",
  },
  {
    href: "/04-server-client",
    title: "4. Server vs Client Components",
    desc: "App Router의 핵심. 기본은 서버 컴포넌트, 'use client'로 전환.",
  },
  {
    href: "/05-dynamic-route/42",
    title: "5. Dynamic Routing",
    desc: "폴더명 [id] 로 URL 파라미터를 받는다. (예: /05-dynamic-route/42)",
  },
  {
    href: "/06-data-fetching",
    title: "6. Data Fetching (서버에서 fetch)",
    desc: "서버 컴포넌트에서 async/await로 바로 데이터를 가져온다.",
  },
  {
    href: "/07-api-route",
    title: "7. API Route (route.js)",
    desc: "app/api/.../route.js로 백엔드 엔드포인트를 직접 만든다.",
  },
  {
    href: "/08-forms-action",
    title: "8. Forms & Server Actions",
    desc: "'use server' 함수로 클라이언트 JS 없이 폼을 처리한다.",
  },
  {
    href: "/09-context",
    title: "9. Context API",
    desc: "props drilling 없이 여러 컴포넌트가 상태를 공유한다.",
  },
  {
    href: "/10-custom-hook",
    title: "10. Custom Hooks",
    desc: "use로 시작하는 함수로 로직(state+effect)을 재사용한다.",
  },
];

export default function HomePage() {
  return (
    <>
      <h1>Next.js / React 핵심 개념 복습</h1>
      <p>
        각 폴더가 하나의 개념을 연습하는 독립된 페이지입니다. 순서대로 봐도
        되고, 기억 안 나는 것부터 봐도 됩니다. 각 페이지 상단에 핵심 설명과
        &quot;왜 이게 중요한가&quot;가 코드 주석으로 들어있습니다.
      </p>
      <ul className="nav-list">
        {modules.map((m) => (
          <li key={m.href}>
            <Link href={m.href}>
              <strong>{m.title}</strong>
              <div style={{ opacity: 0.7, fontSize: "0.9em" }}>{m.desc}</div>
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}
