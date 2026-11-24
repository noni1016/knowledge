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
  await new Promise((r) => setTimeout(r, 300)); // 네트워크 지연 흉내
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
        로딩 상태를 보여주고 싶다면, 같은 폴더에 <code>loading.js</code>를
        만들면 Next.js가 Suspense로 자동 연결해서 데이터가 준비될 때까지
        그 UI를 먼저 보여준다. (이 데모에는 생략했지만 폴더 README 참고)
      </p>
    </>
  );
}
