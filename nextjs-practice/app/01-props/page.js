import Card from "./components/Card";

// 개념: Props
// - 부모 -> 자식으로만 흐르는 단방향 데이터. 자식은 props를 직접 수정하지 못한다(읽기 전용).
// - 리스트를 렌더링할 때는 반드시 각 항목에 고유한 key를 줘야 한다 (React가 변경分을 추적하는 기준).
const robots = [
  { id: "r1", name: "Dishwasher-bot", status: "idle" },
  { id: "r2", name: "Chopping-arm", status: "running" },
  { id: "r3", name: "Plating-bot", status: "error" },
];

export default function PropsPage() {
  return (
    <>
      <h1>1. Props & Components</h1>
      <p>
        <code>Card</code> 컴포넌트는 <code>title</code>, <code>tag</code>,{" "}
        <code>children</code> 세 가지 props를 받습니다. 같은 컴포넌트를 다른
        데이터로 재사용하는 것이 핵심입니다.
      </p>

      <Card title="기본 사용" tag="basic">
        children으로 들어온 이 문장이 Card 내부에 렌더링됩니다.
      </Card>

      <h2>리스트 렌더링 + key</h2>
      {robots.map((r) => (
        <Card key={r.id} title={r.name} tag={r.status}>
          로봇 ID: {r.id}
        </Card>
      ))}

      <p style={{ opacity: 0.7 }}>
        key를 id 대신 index로 주면, 배열 중간에 항목이 추가/삭제될 때 React가
        엉뚱한 항목을 재사용해서 state가 꼬일 수 있습니다. 가능하면 안정적인
        고유 id를 쓰세요.
      </p>
    </>
  );
}
