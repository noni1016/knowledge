import Link from "next/link";

// 개념: Dynamic Routes
// - 폴더명을 대괄호로 감싸면 ([id]) 그 부분이 URL 파라미터가 된다.
// - 예: /05-dynamic-route/42 로 접속하면 params.id === "42"
// - Next.js 13+/14 App Router에서 서버 컴포넌트는 params를 prop으로 받는다.
//   (주의: 최신 Next.js 15부터는 params가 Promise가 되어 await이 필요해지는
//    변경이 있었다 — 버전 바뀔 때 꼭 공식 문서로 재확인할 것.)
const fakeDb = {
  1: { name: "Food-101 분류기", desc: "이미지 분류, 다음 학습 대상" },
  42: { name: "TinyCNN on MNIST", desc: "97.8% 정확도로 완료한 첫 end-to-end 실습" },
};

// generateStaticParams: 이 동적 라우트에 대해 "빌드 시점에 미리 만들어 둘
// 파라미터 목록"을 알려준다. 정적 export(GitHub Pages 등 서버 없는 호스팅)
// 에서는 이 목록에 없는 id는 애초에 HTML 파일 자체가 생성되지 않으므로
// 404가 된다 (서버가 없어서 "요청 시점에 즉석으로 렌더링"이 불가능하기
// 때문). npm run dev로 로컬에서 띄울 때는 이 목록이 없어도 모든 id가
// 동작하지만(서버가 그때그때 렌더링해주므로), 정적 배포에서는 필수다.
export function generateStaticParams() {
  return Object.keys(fakeDb).map((id) => ({ id }));
}

export default function DynamicRoutePage({ params }) {
  const { id } = params;
  const item = fakeDb[id];

  return (
    <>
      <h1>5. Dynamic Routing</h1>
      <p>
        현재 URL 파라미터 <code>id</code> = <code>{id}</code>
      </p>

      {item ? (
        <div className="card">
          <h2>{item.name}</h2>
          <p>{item.desc}</p>
        </div>
      ) : (
        <p>해당 id({id})에 대한 데이터가 없습니다. (가짜 DB에는 1, 42만 있음)</p>
      )}

      <p>
        다른 id로 이동: <Link href="/05-dynamic-route/1">1번</Link>{" "}
        <Link href="/05-dynamic-route/42">42번</Link>{" "}
        <Link href="/05-dynamic-route/999">999번(없음)</Link>
      </p>

      <p style={{ opacity: 0.7 }}>
        폴더 이름 패턴 참고: [id] 하나짜리 값, [...slug]는 여러 세그먼트를
        배열로 받는 catch-all, [[...slug]]는 그 경로가 아예 없어도(= 루트)
        매칭되는 optional catch-all.
      </p>
    </>
  );
}
