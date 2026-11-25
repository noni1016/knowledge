// 개념: Server Components에서의 Data Fetching
// - 서버 컴포넌트는 async 함수일 수 있고, 그 안에서 바로 await fetch(...)를
//   할 수 있다. useEffect + useState로 fetch하던 예전 패턴이 필요 없어진다.
// - Next.js의 fetch는 기본적으로 결과를 캐싱한다. 옵션으로 캐시 전략을 조절:
//     fetch(url)                                -> 기본 캐싱 (force-cache에 가까움)
//     fetch(url, { cache: "no-store" })          -> 매 요청마다 새로 가져옴 (SSR)
//     fetch(url, { next: { revalidate: 60 } })   -> 60초마다 재검증 (ISR)
// - 아래는 네트워크 없이도 동작하도록 "가짜 fetch"를 흉내낸다.
async function fakeFetchRobotStatus() {
  // 실제로는: const res = await fetch("https://api.example.com/robots", { cache: "no-store" });
  //          const data = await res.json();
  await new Promise((r) => setTimeout(r, 1200)); // 네트워크 지연 흉내 (loading.js가 눈에 보이도록 넉넉하게)
  return [
    { id: "r1", name: "Dishwasher-bot", battery: 82 },
    { id: "r2", name: "Chopping-arm", battery: 45 },
    { id: "r3", name: "Plating-bot", battery: 12 },
  ];
}

export default async function DataFetchingPage() {
  const robots = await fakeFetchRobotStatus();

  return (
    <>
      <h1>6. Data Fetching (서버 컴포넌트)</h1>
      <p>
        이 페이지는 <code>export default async function</code> 서버
        컴포넌트입니다. 렌더링 도중 <code>await</code>로 데이터를 가져온
        뒤에야 HTML이 만들어져 클라이언트로 전송됩니다.
      </p>

      {robots.map((r) => (
        <div className="card" key={r.id}>
          <strong>{r.name}</strong> — 배터리 {r.battery}%
        </div>
      ))}

      <p style={{ opacity: 0.7 }}>
        같은 폴더의 <code>loading.js</code> 파일이 바로 이 페이지의 로딩
        UI입니다 — 파일 이름 규칙만으로 Next.js가 자동으로 Suspense
        경계를 만들어준 것이라, 이 페이지 코드 어디에도 "로딩 중" 상태를
        직접 다루는 코드가 없습니다. <code>npm run dev</code>로 실행하고
        이 페이지로 이동해보면 스켈레톤 UI가 먼저 보였다가(지금은 1.2초
        지연) 실제 데이터로 바뀌는 걸 확인할 수 있습니다. (GitHub
        Pages처럼 정적으로 미리 구워둔 배포본에서는 fetch가 이미 빌드
        시점에 끝나있어서 이 로딩 화면이 사실상 보이지 않습니다.)
      </p>
    </>
  );
}
