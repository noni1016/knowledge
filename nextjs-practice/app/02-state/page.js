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
