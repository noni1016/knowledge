"use client";

import { useLocalStorage } from "./useLocalStorage";

export default function CustomHookPage() {
  // useState를 쓰듯이 그대로 쓰지만, 내부적으로 localStorage에 자동 저장된다.
  const [notes, setNotes] = useLocalStorage("practice-notes", "");
  const [fontSize, setFontSize] = useLocalStorage("practice-font-size", 16);

  return (
    <>
      <h1>10. Custom Hooks</h1>
      <p>
        <code>useLocalStorage</code>는 useState와 똑같이 쓰지만, 값이 바뀔
        때마다 브라우저의 localStorage에도 저장합니다. 새로고침해도 아래
        내용이 남아있는지 확인해보세요.
      </p>

      <div className="card">
        <label>
          글자 크기: {fontSize}px{" "}
          <input
            type="range"
            min="12"
            max="28"
            value={fontSize}
            onChange={(e) => setFontSize(Number(e.target.value))}
          />
        </label>
        <textarea
          style={{ width: "100%", fontSize: `${fontSize}px`, marginTop: 8 }}
          rows={4}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="아무거나 적어보고 새로고침 해보세요"
        />
      </div>

      <p style={{ opacity: 0.7 }}>
        같은 훅을 fontSize와 notes 두 군데에서 재사용했습니다. 컴포넌트
        자체가 아니라 "state + effect 로직 한 덩어리"를 재사용한 것이 핵심
        포인트입니다. 9번(Context)과 결합하면, 커스텀 훅 안에서
        useContext까지 함께 캡슐화하는 패턴으로 발전시킬 수 있습니다.
      </p>
    </>
  );
}
