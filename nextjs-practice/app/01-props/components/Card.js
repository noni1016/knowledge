// 가장 기본: 컴포넌트는 "props(객체 하나)를 받아 JSX를 반환하는 함수"다.
// - 구조분해 할당으로 필요한 값만 꺼내 쓰는 게 관례.
// - children은 특별한 prop: <Card>이 안쪽 내용</Card> 처럼 태그 사이에 쓴 것이 들어온다.
export default function Card({ title, tag, children }) {
  return (
    <div className="card">
      <h3>
        {title}
        {tag && <span className="badge">{tag}</span>}
      </h3>
      <div>{children}</div>
    </div>
  );
}
