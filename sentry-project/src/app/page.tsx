export default function Home() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
          Sentry 모니터링 학습 프로젝트
        </h1>
        <p className="mt-3 text-lg text-gray-600 dark:text-gray-400">
          Next.js + Hono + Sentry를 활용한 에러 트래킹 & 성능 모니터링 학습
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card
          title="에러 트래킹"
          description="의도적인 에러를 발생시켜 Sentry가 에러를 캡처하는 과정을 학습합니다."
          href="/test/error"
          color="red"
        />
        <Card
          title="성능 모니터링"
          description="느린 API, 트랜잭션 추적 등 성능 모니터링 기능을 테스트합니다."
          href="/test/performance"
          color="blue"
        />
        <Card
          title="API 엔드포인트"
          description="Hono로 구축된 API 엔드포인트 목록과 테스트 도구입니다."
          href="/api/health"
          color="green"
        />
      </div>

      <div className="mt-12 rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          시작하기
        </h2>
        <ol className="mt-4 list-decimal space-y-2 pl-5 text-gray-600 dark:text-gray-400">
          <li>
            <a href="https://sentry.io" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">
              sentry.io
            </a>
            에서 계정을 만들고 Next.js 프로젝트를 생성합니다.
          </li>
          <li>
            프로젝트의 DSN을 복사하여 <code className="rounded bg-gray-100 px-1.5 py-0.5 text-sm dark:bg-gray-800">.env.local</code> 파일의{" "}
            <code className="rounded bg-gray-100 px-1.5 py-0.5 text-sm dark:bg-gray-800">NEXT_PUBLIC_SENTRY_DSN</code>에 붙여넣습니다.
          </li>
          <li>
            <code className="rounded bg-gray-100 px-1.5 py-0.5 text-sm dark:bg-gray-800">npm run dev</code>로 개발 서버를 시작합니다.
          </li>
          <li>위 카드를 클릭하여 다양한 Sentry 기능을 테스트해봅니다.</li>
        </ol>
      </div>
    </div>
  );
}

function Card({
  title,
  description,
  href,
  color,
}: {
  title: string;
  description: string;
  href: string;
  color: "red" | "blue" | "green";
}) {
  const colorMap = {
    red: "border-red-200 hover:border-red-400 dark:border-red-900 dark:hover:border-red-700",
    blue: "border-blue-200 hover:border-blue-400 dark:border-blue-900 dark:hover:border-blue-700",
    green: "border-green-200 hover:border-green-400 dark:border-green-900 dark:hover:border-green-700",
  };

  return (
    <a
      href={href}
      className={`block rounded-lg border-2 bg-white p-6 transition-colors dark:bg-gray-900 ${colorMap[color]}`}
    >
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
        {title}
      </h3>
      <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
        {description}
      </p>
    </a>
  );
}
