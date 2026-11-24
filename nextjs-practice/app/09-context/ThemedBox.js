"use client";

import { useTheme } from "./ThemeContext";

// 이 컴포넌트는 부모로부터 theme을 props로 받지 않았다.
// Provider만 자신의 상위 어딘가에 있으면, 아무리 깊이 중첩되어 있어도
// useTheme()으로 바로 값을 꺼낼 수 있다는 게 Context의 핵심.
export default function ThemedBox() {
  const { theme, toggle } = useTheme();
  return (
    <div
      className="card"
      style={{
        background: theme === "dark" ? "#161922" : "#f1f5f9",
        color: theme === "dark" ? "#e6e6e6" : "#111827",
      }}
    >
      <p>현재 테마: {theme}</p>
      <button onClick={toggle}>테마 전환</button>
    </div>
  );
}
