"use client";

import { createContext, useContext, useState } from "react";

// 개념: Context API
// - 여러 컴포넌트가 props로 일일이 전달하지 않고도 같은 값을 공유하는 방법
//   ("props drilling" 회피).
// - 1) createContext로 context 객체를 만든다.
// - 2) <ThemeContext.Provider value={...}>로 값을 제공하는 영역을 감싼다.
// - 3) 하위 어디서든 useContext(ThemeContext)로 값을 꺼내 쓴다
//      (Provider와 사용하는 컴포넌트 사이의 중간 컴포넌트는 전혀 몰라도 됨).
const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState("dark");
  const toggle = () => setTheme((t) => (t === "dark" ? "light" : "dark"));

  // value로 넘기는 객체가 바뀔 때마다(참조가 바뀔 때마다) 하위의 소비자들이
  // 리렌더링된다. 자식이 많다면 value를 useMemo로 감싸 불필요한 리렌더링을
  // 줄이는 게 실무 관례.
  return (
    <ThemeContext.Provider value={{ theme, toggle }}>
      {children}
    </ThemeContext.Provider>
  );
}

// 커스텀 훅으로 감싸면, 사용하는 쪽에서 import { useContext, ThemeContext }를
// 반복할 필요 없이 useTheme()만 부르면 된다 (10번 커스텀 훅과 연결되는 패턴).
export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme은 ThemeProvider 내부에서만 사용 가능");
  return ctx;
}
