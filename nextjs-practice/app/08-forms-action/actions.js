"use server";

// 개념: Server Actions
// - 파일 맨 위 'use server'를 쓰면, 이 안의 함수들은 "서버에서만 실행되는
//   함수"가 되고, 클라이언트(폼)에서 action={함수}로 직접 호출할 수 있다.
// - 브라우저는 이 함수의 소스코드를 받지 않는다 — 대신 Next.js가 자동으로
//   네트워크 요청으로 바꿔서 서버에서 실행하고 결과만 돌려준다.
// - 전통적인 "폼 제출 -> 전체 페이지 새로고침" 없이도, 심지어 클라이언트
//   JS 이벤트 핸들러 없이도 폼이 동작한다 (progressive enhancement).
const submissions = []; // 데모용 인메모리 저장소

export async function submitFeedback(formData) {
  const message = formData.get("message");

  if (!message || message.trim().length === 0) {
    return { ok: false, error: "메시지를 입력해주세요." };
  }

  // 실제로는 여기서 DB에 저장하거나 외부 API를 호출한다.
  submissions.push({ message, at: new Date().toISOString() });

  return { ok: true, count: submissions.length };
}
