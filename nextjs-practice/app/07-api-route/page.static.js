// GitHub Pages용 정적 버전.
// GitHub Pages는 정적 파일만 서빙하므로 실제 서버(API Route)가 없다.
// 그래서 이 페이지에서 fetch("/api/hello")를 호출할 서버 자체가 존재하지
// 않는다 -> 로컬에서 `npm run dev`로 실행했을 때만 동작하는 실제 버전을
// 대신, 코드와 설명만 보여주는 안내 페이지로 교체한다.
// (배포 워크플로가 빌드 시에만 이 파일로 page.js를 덮어쓰고, 로컬 개발용
//  원본 page.js는 그대로 저장소에 남아있다.)
export default function ApiRouteStaticPage() {
  return (
    <>
      <h1>7. API Route (route.js)</h1>
      <div className="card">
        <p>
          <strong>이 페이지는 정적 호스팅(GitHub Pages)에서는 동작하지
          않습니다.</strong> API Route는 서버가 있어야 실행되는 기능이라,
          서버가 없는 정적 사이트에서는 호출할 대상이 없습니다.
        </p>
        <p>
          로컬에서 <code>npm run dev</code>로 실행하면 버튼을 눌러 직접
          API를 호출해볼 수 있습니다. 실제 코드는 저장소의{" "}
          <code>app/api/hello/route.js</code>와{" "}
          <code>app/07-api-route/page.js</code>를 참고하세요.
        </p>
      </div>
      <pre>{`export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const name = searchParams.get("name") || "world";
  return NextResponse.json({ message: \`Hello, \${name}!\` });
}`}</pre>
    </>
  );
}
