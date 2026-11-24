"use client";

import { useEffect, useState } from "react";

// 개념: Custom Hooks
// - 이름이 "use"로 시작하는 평범한 JS 함수. 내부에서 다른 훅(useState,
//   useEffect 등)을 자유롭게 조합할 수 있다.
// - 목적: 여러 컴포넌트에서 반복되는 "state + effect 로직"을 재사용하기.
//   컴포넌트를 재사용하는 게 아니라 "로직"만 재사용한다는 점이 핵심.
export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    if (typeof window === "undefined") return initialValue; // SSR 안전장치
    try {
      const saved = window.localStorage.getItem(key);
      return saved !== null ? JSON.parse(saved) : initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // 저장 공간이 꽉 찼거나 비공개 모드인 경우 등 — 조용히 무시
    }
  }, [key, value]);

  return [value, setValue];
}
