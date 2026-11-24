import { NextResponse } from "next/server";

// 개념: Route Handlers (API Routes)
// - app/api/hello/route.js 처럼 "route.js"라는 특별한 파일명을 쓰면,
//   /api/hello 경로에 대한 백엔드 엔드포인트가 된다 (page.js와 공존 불가,
//   같은 세그먼트에 둘 다 둘 수 없음).
// - HTTP 메서드 이름 그대로 export하면 그 메서드를 처리한다: GET, POST, PUT,
//   PATCH, DELETE 등.
// - 여기서 하는 모든 작업은 서버에서만 실행된다 (DB 접근, 비밀 키 사용에 안전).
let memoryCounter = 0; // 데모용 — 서버 재시작하면 초기화됨, 실제로는 DB를 써야 함

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const name = searchParams.get("name") || "world";
  return NextResponse.json({ message: `Hello, ${name}!`, hits: ++memoryCounter });
}

export async function POST(request) {
  const body = await request.json();
  return NextResponse.json({ received: body, echoedAt: new Date().toISOString() });
}
