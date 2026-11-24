"use client";
// 이 페이지는 useState(브라우저 상호작용)를 쓰므로 'use client'가 필요하다.
// App Router 기본값은 서버 컴포넌트이고, 훅/이벤트핸들러를 쓰려면 명시적으로
// 클라이언트 컴포넌트로 선언해야 한다. (04번 페이지에서 더 자세히)

import { useState } from "react";

export default function StatePage() {
  // useState(초기값) -> [현재값, 값을 바꾸는 함수]
  const [count, setCount] = useState(0);
  const [name, setName] = useState("");

  // setCount(count + 1) 대신 함수형 업데이트를 쓰면 안전하다.
  // 이전 state 값(prev)을 기준으로 다음 값을 계산하므로,
  // 같은 이벤트 안에서 여러 번 호출해도(batch) 누락되지 않는다.
  const increment = () => setCount((prev) => prev + 1);
  const decrement = () => setCount((prev) => prev - 1);
  const reset = () => setCount(0);

  // --- 함정 비교용: count + 1 (버그) vs prev => prev + 1 (안전) ---
  const [buggyCount, setBuggyCount] = useState(0);
  const [safeCount, setSafeCount] = useState(0);

  // ❌ 한 이벤트 안에서 두 번 호출해도 "count"는 이 렌더링 시점의 같은
  //    값으로 고정돼 있다. 그래서 setCount(count + 1)을 두 번 불러도
  //    둘 다 "0 + 1"을 계산해서 setCount(1)을 두 번 호출한 셈이 되고,
  //    결과적으로 1씩만 증가한다 (+2를 기대했지만 +1만 됨).
  const buggyAddTwo = () => {
    setBuggyCount(buggyCount + 1);
    setBuggyCount(buggyCount + 1);
  };

  // ✅ prev => prev + 1은 "직전 업데이트 결과"를 이어받아 계산하므로,
  //    같은 이벤트 안에서 두 번 호출하면 정말로 0 -> 1 -> 2로 누적된다.
  const safeAddTwo = () => {
    setSafeCount((prev) => prev + 1);
    setSafeCount((prev) => prev + 1);
  };

  return (
    <>
      <h1>2. State (useState)</h1>

      <section className="card">
        <h2>카운터</h2>
        <p style={{ fontSize: "2em" }}>{count}</p>
        <button onClick={decrement}>-1</button>{" "}
        <button onClick={increment}>+1</button>{" "}
        <button onClick={reset}>리셋</button>
        <p style={{ opacity: 0.7 }}>
          버튼을 누르면 setCount가 state를 바꾸고, React가 이 컴포넌트를
          "다시 렌더링"해서 화면의 숫자가 바뀐다. 변수를 직접 바꾸는 게
          아니라, 항상 set함수를 통해서만 바꿔야 React가 변경을 감지한다.
        </p>
      </section>

      <section className="card">
        <h2>함정: count + 1 vs prev =&gt; prev + 1</h2>
        <p>
          두 버튼 모두 클릭 한 번에 "2씩 증가"를 의도한 코드입니다. 눌러서
          결과를 비교해보세요.
        </p>

        <p>
          버그 있는 버전 (<code>setCount(count + 1)</code> 두 번):{" "}
          <strong style={{ fontSize: "1.3em" }}>{buggyCount}</strong>
        </p>
        <button onClick={buggyAddTwo}>+2 클릭 (버그)</button>

        <p style={{ marginTop: 16 }}>
          안전한 버전 (<code>setCount(prev =&gt; prev + 1)</code> 두 번):{" "}
          <strong style={{ fontSize: "1.3em" }}>{safeCount}</strong>
        </p>
        <button onClick={safeAddTwo}>+2 클릭 (안전)</button>

        <p style={{ opacity: 0.7, marginTop: 12 }}>
          버그 버전은 몇 번을 눌러도 1씩만 증가합니다 — 두 번의 호출이 같은
          렌더링에서 캡처된 같은 <code>buggyCount</code> 값을 참조해서,
          결국 <code>setBuggyCount(이전값 + 1)</code>을 중복 호출한 것과
          같아지기 때문입니다. 안전 버전은 매번 정확히 2씩 증가합니다 —
          두 번째 호출이 "방금 첫 번째 호출이 계산한 값"을 이어받기
          때문입니다. <code>setTimeout</code>이나 <code>useEffect</code>{" "}
          안에서 지연 후 state를 갱신할 때도 같은 이유로 함수형 업데이트를
          쓰는 게 안전합니다 (그 시점엔 effect가 실행됐을 때의 옛날 값이
          클로저에 갇혀있을 수 있으므로).
        </p>
      </section>

      <section className="card">
        <h2>제어 컴포넌트(Controlled Input)</h2>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="이름을 입력하세요"
        />
        <p>안녕하세요, {name || "____"}님!</p>
        <p style={{ opacity: 0.7 }}>
          input의 value가 항상 state에서 오고, onChange가 state를 갱신한다.
          그래서 "제어(controlled)" 컴포넌트라고 부른다 — 입력값의 소스는
          DOM이 아니라 React state다.
        </p>
      </section>
    </>
  );
}
