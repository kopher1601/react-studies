"use client";

import * as Sentry from "@sentry/nextjs";
import { useState } from "react";

export default function ErrorTestPage() {
  const [results, setResults] = useState<string[]>([]);

  function addResult(message: string) {
    setResults((prev) => [
      `[${new Date().toLocaleTimeString()}] ${message}`,
      ...prev,
    ]);
  }

  // 1. 클라이언트 사이드 에러
  function triggerClientError() {
    try {
      throw new Error("클라이언트에서 발생한 의도적 에러!");
    } catch (error) {
      Sentry.captureException(error);
      addResult("클라이언트 에러 → Sentry에 전송됨");
    }
  }

  // 2. Unhandled 에러 (ErrorBoundary에서 캡처)
  function triggerUnhandledError() {
    addResult("Unhandled 에러 발생 예정...");
    throw new Error("이것은 Unhandled 클라이언트 에러입니다!");
  }

  // 3. 커스텀 메시지 전송
  function sendCustomMessage() {
    Sentry.captureMessage("사용자가 커스텀 메시지 테스트를 실행했습니다", "info");
    addResult("커스텀 메시지 → Sentry에 전송됨 (info 레벨)");
  }

  // 4. Breadcrumb 추가 후 에러 전송
  function triggerWithBreadcrumbs() {
    Sentry.addBreadcrumb({
      category: "user-action",
      message: "사용자가 장바구니에 상품을 추가함",
      level: "info",
    });

    Sentry.addBreadcrumb({
      category: "user-action",
      message: "사용자가 결제 버튼을 클릭함",
      level: "info",
    });

    Sentry.addBreadcrumb({
      category: "api",
      message: "결제 API 호출",
      level: "info",
      data: { amount: 29900, currency: "KRW" },
    });

    Sentry.captureException(
      new Error("결제 처리 중 에러 발생 (Breadcrumb 포함)")
    );

    addResult("Breadcrumb 3개 + 에러 → Sentry에 전송됨");
  }

  // 5. 사용자 컨텍스트 설정 후 에러
  function triggerWithUserContext() {
    Sentry.setUser({
      id: "user-123",
      email: "test@example.com",
      username: "tester",
    });

    Sentry.setTag("page", "error-test");
    Sentry.setExtra("testScenario", "user-context-error");

    Sentry.captureException(
      new Error("사용자 컨텍스트가 포함된 에러")
    );

    addResult("사용자 컨텍스트 + 태그 + 에러 → Sentry에 전송됨");
  }

  // 6. 서버 API 에러 호출
  async function triggerServerError(endpoint: string) {
    try {
      const res = await fetch(`/api/error/${endpoint}`);
      const data = await res.json();
      addResult(`서버 에러 (${endpoint}): ${data.error || data.message}`);
    } catch (err) {
      addResult(`서버 에러 (${endpoint}): 요청 실패 - ${err}`);
    }
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
        에러 트래킹 테스트
      </h1>
      <p className="mt-2 text-gray-600 dark:text-gray-400">
        다양한 종류의 에러를 발생시키고 Sentry 대시보드에서 확인해보세요.
      </p>

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {/* 클라이언트 에러 */}
        <Section title="클라이언트 사이드 에러">
          <Button onClick={triggerClientError} color="red">
            captureException 테스트
          </Button>
          <Button onClick={triggerUnhandledError} color="red">
            Unhandled Error (페이지 크래시)
          </Button>
          <Button onClick={sendCustomMessage} color="yellow">
            captureMessage 테스트
          </Button>
        </Section>

        {/* 컨텍스트 & Breadcrumb */}
        <Section title="컨텍스트 & Breadcrumb">
          <Button onClick={triggerWithBreadcrumbs} color="purple">
            Breadcrumb + 에러
          </Button>
          <Button onClick={triggerWithUserContext} color="purple">
            User Context + 에러
          </Button>
        </Section>

        {/* 서버 API 에러 */}
        <Section title="서버 API 에러 (Hono)">
          <Button onClick={() => triggerServerError("unhandled")} color="orange">
            Unhandled Server Error
          </Button>
          <Button onClick={() => triggerServerError("type-error")} color="orange">
            Type Error
          </Button>
          <Button onClick={() => triggerServerError("async")} color="orange">
            Async Error
          </Button>
        </Section>
      </div>

      {/* 결과 로그 */}
      <div className="mt-8 rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
        <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400">
          실행 로그
        </h3>
        <div className="mt-2 max-h-64 overflow-y-auto font-mono text-sm">
          {results.length === 0 ? (
            <p className="text-gray-400">버튼을 클릭하면 결과가 여기에 표시됩니다.</p>
          ) : (
            results.map((r, i) => (
              <p key={i} className="border-b border-gray-100 py-1 dark:border-gray-800">
                {r}
              </p>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
      <h2 className="mb-3 text-lg font-semibold text-gray-900 dark:text-white">
        {title}
      </h2>
      <div className="flex flex-col gap-2">{children}</div>
    </div>
  );
}

function Button({
  onClick,
  color,
  children,
}: {
  onClick: () => void;
  color: string;
  children: React.ReactNode;
}) {
  const colorMap: Record<string, string> = {
    red: "bg-red-500 hover:bg-red-600",
    yellow: "bg-yellow-500 hover:bg-yellow-600",
    purple: "bg-purple-500 hover:bg-purple-600",
    orange: "bg-orange-500 hover:bg-orange-600",
  };

  return (
    <button
      onClick={onClick}
      className={`rounded-md px-4 py-2 text-sm font-medium text-white transition-colors ${colorMap[color] || "bg-gray-500 hover:bg-gray-600"}`}
    >
      {children}
    </button>
  );
}
