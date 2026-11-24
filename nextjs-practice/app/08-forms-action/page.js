"use client";

import { useFormState, useFormStatus } from "react-dom";
import { submitFeedback } from "./actions";

// 개념: useFormState + useFormStatus (react-dom)
// - useFormState(action, initialState)는 Server Action의 리턴값을 받아서
//   화면에 반영할 수 있게 해주는 훅. [state, formAction] 반환.
// - useFormStatus()는 "가장 가까운 상위 <form>"이 제출 중인지(pending)를
//   알려주는 훅 — 꼭 <form> 내부의 "자식 컴포넌트"에서 써야 값이 잡힌다.
function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending}>
      {pending ? "전송 중..." : "보내기"}
    </button>
  );
}

const initialState = { ok: null };

export default function FormsActionPage() {
  const [state, formAction] = useFormState(submitFeedback, initialState);

  return (
    <>
      <h1>8. Forms & Server Actions</h1>
      <form action={formAction} className="card">
        <label>
          메시지:{" "}
          <input type="text" name="message" placeholder="한 줄 남겨보세요" />
        </label>
        <div style={{ marginTop: 8 }}>
          <SubmitButton />
        </div>
      </form>

      {state.ok === true && (
        <p>제출 성공! 지금까지 총 {state.count}건.</p>
      )}
      {state.ok === false && <p>에러: {state.error}</p>}

      <p style={{ opacity: 0.7 }}>
        actions.js 맨 위의 'use server' 선언이 핵심입니다. formData.get(...)
        으로 폼 필드를 읽고, 서버에서만 접근 가능한 로직(DB 저장 등)을
        그대로 쓸 수 있습니다. JS가 아예 꺼져 있어도 이 폼은 동작합니다
        (useFormState 없이 action={`{submitFeedback}`} 만 써도 됨 — 다만 그러면
        결과를 화면에 표시하려면 redirect/revalidatePath 같은 다른 방법이
        필요합니다).
      </p>
    </>
  );
}
