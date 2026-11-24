"use client";

import { useEffect, useState } from "react";

// 개념: useEffect(setup, deps)
// - "렌더링이 끝난 후" 실행되는 부수효과(side effect)를 선언하는 훅.
// - deps 배열에 따라 언제 다시 실행할지 결정된다:
//     []            -> 마운트 시 1번만 실행 (componentDidMount와 비슷)
//     [a, b]        -> a 또는 b가 바뀔 때마다 실행
//     (배열 생략)    -> 매 렌더링마다 실행 (거의 쓸 일 없음)
// - setup 함수가 "cleanup 함수"를 반환하면, 다음 effect 실행 직전 또는
//   언마운트 시 그 cleanup이 호출된다. (componentWillUnmount와 비슷)
export default function EffectPage() {
  const [seconds, setSeconds] = useState(0);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("idle");

  // 1) 타이머: deps가 []이므로 마운트 시 한 번만 setInterval을 건다.
  //    cleanup에서 clearInterval을 안 하면, 페이지를 벗어나도 타이머가
  //    계속 돌거나(메모리 누수) 중복으로 여러 개가 쌓일 수 있다.
  useEffect(() => {
    const id = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, []);

  // 2) 디바운스된 "검색": query가 바뀔 때마다 effect가 재실행된다.
  //    매번 바로 요청하지 않고, 입력이 300ms 멈췄을 때만 요청하도록
  //    cleanup으로 이전 타이머를 취소한다. (실무에서 자주 쓰는 패턴)
  useEffect(() => {
    if (!query) {
      setStatus("idle");
      return;
    }
    setStatus("waiting...");
    const timeout = setTimeout(() => {
      setStatus(`"${query}" 검색 완료 (가짜 결과)`);
    }, 300);
    return () => clearTimeout(timeout);
  }, [query]);

  return (
    <>
      <h1>3. Effects (useEffect)</h1>

      <section className="card">
        <h2>경과 시간: {seconds}초</h2>
        <p style={{ opacity: 0.7 }}>
          deps = [] → 마운트될 때 interval을 한 번만 시작. 이 페이지를
          떠나면(언마운트) cleanup에서 clearInterval이 호출된다.
        </p>
      </section>

      <section className="card">
        <h2>디바운스 검색 흉내내기</h2>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="타이핑해보세요"
        />
        <p>상태: {status}</p>
        <p style={{ opacity: 0.7 }}>
          deps = [query] → query가 바뀔 때마다 effect가 재실행되고, 이전
          setTimeout은 cleanup으로 취소된다. 그래서 빠르게 타이핑해도 마지막
          글자 기준으로만 "검색"이 실행된다.
        </p>
      </section>
    </>
  );
}
