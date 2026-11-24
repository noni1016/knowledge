"use client";

import { useState } from "react";

// 개념: 클라이언트 컴포넌트에서 내가 만든 API Route 호출하기
// - app/api/hello/route.js에 만들어둔 GET/POST 엔드포인트를 fetch로 호출.
// - 서버 컴포넌트(6번 예제)의 fetch와 다른 점: 이건 "버튼 클릭" 같은
//   브라우저 이벤트에 반응해서, 브라우저가 직접 네트워크 요청을 보낸다.
export default function ApiRoutePage() {
  const [result, setResult] = useState(null);
  const [name, setName] = useState("Noni");
  const [loading, setLoading] = useState(false);

  async function callGet() {
    setLoading(true);
    const res = await fetch(`/api/hello?name=${encodeURIComponent(name)}`);
    const data = await res.json();
    setResult(data);
    setLoading(false);
  }

  async function callPost() {
    setLoading(true);
    const res = await fetch("/api/hello", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, note: "POST 테스트" }),
    });
    const data = await res.json();
    setResult(data);
    setLoading(false);
  }

  return (
    <>
      <h1>7. API Route (route.js)</h1>
      <input value={name} onChange={(e) => setName(e.target.value)} />{" "}
      <button onClick={callGet} disabled={loading}>
        GET /api/hello 호출
      </button>{" "}
      <button onClick={callPost} disabled={loading}>
        POST /api/hello 호출
      </button>

      {result && (
        <pre>{JSON.stringify(result, null, 2)}</pre>
      )}

      <p style={{ opacity: 0.7 }}>
        이 패턴은 MLOps 쪽에서도 그대로 쓸 수 있습니다: 모델 서빙용 Python
        API(FastAPI 등)가 따로 있고, Next.js의 API Route는 그 앞단에서
        인증/가공을 하는 BFF(Backend for Frontend) 역할을 하는 구성이
        흔합니다.
      </p>
    </>
  );
}
