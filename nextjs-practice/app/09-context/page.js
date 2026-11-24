import { ThemeProvider } from "./ThemeContext";
import ThemedBox from "./ThemedBox";

// page.js 자체는 서버 컴포넌트지만, ThemeProvider/ThemedBox는 각각
// 'use client' 선언이 있으므로 문제없이 조합된다.
export default function ContextPage() {
  return (
    <>
      <h1>9. Context API</h1>
      <p>
        ThemeProvider가 감싼 영역 안에서는 몇 단계를 거치든 ThemedBox가 props
        없이 바로 theme 값을 읽고 바꿀 수 있습니다.
      </p>
      <ThemeProvider>
        <div style={{ paddingLeft: 16, borderLeft: "2px solid #2a2e37" }}>
          <p style={{ opacity: 0.7 }}>(중간 래퍼 — theme을 모름)</p>
          <ThemedBox />
        </div>
      </ThemeProvider>
    </>
  );
}
