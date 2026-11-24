import "./globals.css";
import Link from "next/link";

// 루트 레이아웃(Root Layout)
// - App Router에서는 반드시 app/layout.js 하나가 최상위에 있어야 하고,
//   <html>, <body> 태그를 여기서 직접 작성한다 (예전 pages/_document.js 역할 통합).
// - metadata export로 <head> 안의 title/description 등을 선언적으로 관리한다.
// - 이 레이아웃은 모든 페이지에서 공통으로 유지되며, 페이지 이동 시 재마운트되지 않는다.
export const metadata = {
  title: "Next.js / React 개념 복습",
  description: "오랜만에 Next.js, React를 다시 떠올리기 위한 실습 모음",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <body>
        <main>
          <p style={{ marginBottom: 24 }}>
            <Link href="/">← 목록으로</Link>
          </p>
          {children}
        </main>
      </body>
    </html>
  );
}
