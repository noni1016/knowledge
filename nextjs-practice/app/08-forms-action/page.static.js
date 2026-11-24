// GitHub Pages용 정적 버전.
// Server Actions('use server')는 Next.js의 정적 export(output: "export")와
// 함께 쓸 수 없다 — 그 자체가 서버 실행을 전제로 하는 기능이기 때문이다.
// 그래서 이 페이지는 actions.js를 import하지 않고, 개념 설명만 보여준다.
export default function FormsActionStaticPage() {
  return (
    <>
      <h1>8. Forms & Server Actions</h1>
      <div className="card">
        <p>
          <strong>이 페이지는 정적 호스팅(GitHub Pages)에서는 동작하지
          않습니다.</strong> Server Actions는 서버에서 실행되는 함수라서,
          서버가 없는 정적 export 빌드 자체에 포함할 수 없습니다.
        </p>
        <p>
          로컬에서 <code>npm run dev</code>로 실행하면 폼을 제출해볼 수
          있습니다. 실제 코드는 저장소의{" "}
          <code>app/08-forms-action/actions.js</code>와{" "}
          <code>app/08-forms-action/page.js</code>를 참고하세요.
        </p>
      </div>
      <pre>{`"use server";

export async function submitFeedback(formData) {
  const message = formData.get("message");
  // ... 서버에서만 실행되는 로직 (DB 저장 등)
  return { ok: true };
}`}</pre>
    </>
  );
}
