"use client";

import { useState } from "react";

// 'use client' 선언이 있는 파일의 export는 전부 클라이언트 컴포넌트가 된다.
// 브라우저에 JS 번들로 내려가서, 거기서 실제로 state/이벤트를 처리한다.
export default function ClientCounter() {
  const [count, setCount] = useState(0);
  return (
    <div className="card">
      <p>클라이언트 컴포넌트 (여기엔 'use client' 선언 있음)</p>
      <button onClick={() => setCount((c) => c + 1)}>클릭: {count}</button>
    </div>
  );
}
