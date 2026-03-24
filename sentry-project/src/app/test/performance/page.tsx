"use client";

import * as Sentry from "@sentry/nextjs";
import { useState } from "react";

export default function PerformanceTestPage() {
  const [results, setResults] = useState<string[]>([]);
  const [loading, setLoading] = useState<string | null>(null);

  function addResult(message: string) {
    setResults((prev) => [
      `[${new Date().toLocaleTimeString()}] ${message}`,
      ...prev,
    ]);
  }

  // 1. 느린 API 호출
  async function testSlowApi(delay: number) {
    setLoading(`slow-${delay}`);
    const start = Date.now();
    try {
      const res = await fetch(`/api/slow?delay=${delay}`);
      const data = await res.json();
      const elapsed = Date.now() - start;
      addResult(`Slow API (${delay}ms): ${elapsed}ms 소요 - ${data.message}`);
    } catch (err) {
      addResult(`Slow API 실패: ${err}`);
    }
    setLoading(null);
  }

  // 2. 커스텀 트랜잭션
  async function testCustomTransaction() {
    setLoading("transaction");

    const result = Sentry.startSpan(
      { name: "custom-checkout-flow", op: "transaction" },
      (span) => {
        // 장바구니 검증 단계
        Sentry.startSpan(
          { name: "validate-cart", op: "task" },
          () => {
            const start = Date.now();
            while (Date.now() - start < 150) {
              /* 시뮬레이션 */
            }
          }
        );

        // 결제 처리 단계
        Sentry.startSpan(
          { name: "process-payment", op: "task" },
          () => {
            const start = Date.now();
            while (Date.now() - start < 300) {
              /* 시뮬레이션 */
            }
          }
        );

        // 주문 확정 단계
        Sentry.startSpan(
          { name: "confirm-order", op: "task" },
          () => {
            const start = Date.now();
            while (Date.now() - start < 100) {
              /* 시뮬레이션 */
            }
          }
        );

        return span;
      }
    );

    addResult(
      `커스텀 트랜잭션 완료: checkout-flow (3개 스팬 포함) - traceId: ${result?.spanContext().traceId?.slice(0, 8)}...`
    );
    setLoading(null);
  }

  // 3. 주문 API 호출 (성공/실패 랜덤)
  async function testOrderApi() {
    setLoading("order");
    const start = Date.now();
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ item: "테스트 상품", quantity: 1 }),
      });
      const data = await res.json();
      const elapsed = Date.now() - start;

      if (res.ok) {
        addResult(`주문 성공: ${data.orderId} (${elapsed}ms)`);
      } else {
        addResult(`주문 실패: ${data.error || data.message} (${elapsed}ms)`);
      }
    } catch (err) {
      addResult(`주문 API 에러: ${err}`);
    }
    setLoading(null);
  }

  // 4. 다수의 동시 요청
  async function testConcurrentRequests() {
    setLoading("concurrent");
    const start = Date.now();

    const promises = Array.from({ length: 5 }, (_, i) =>
      fetch(`/api/users/${i + 1}`)
        .then((r) => r.json())
        .then((d) => ({ index: i, data: d, ok: true }))
        .catch((err) => ({ index: i, error: err, ok: false }))
    );

    const results = await Promise.all(promises);
    const elapsed = Date.now() - start;
    const successes = results.filter((r) => r.ok).length;

    addResult(
      `동시 요청 5개: ${successes}개 성공, ${5 - successes}개 실패 (총 ${elapsed}ms)`
    );
    setLoading(null);
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
        성능 모니터링 테스트
      </h1>
      <p className="mt-2 text-gray-600 dark:text-gray-400">
        API 지연, 커스텀 트랜잭션, 동시 요청 등을 테스트하고 Sentry Performance 탭에서 확인해보세요.
      </p>

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {/* 느린 API */}
        <Section title="느린 API 테스트">
          <Button
            onClick={() => testSlowApi(1000)}
            loading={loading === "slow-1000"}
            color="blue"
          >
            1초 지연 API
          </Button>
          <Button
            onClick={() => testSlowApi(3000)}
            loading={loading === "slow-3000"}
            color="blue"
          >
            3초 지연 API
          </Button>
          <Button
            onClick={() => testSlowApi(5000)}
            loading={loading === "slow-5000"}
            color="blue"
          >
            5초 지연 API
          </Button>
        </Section>

        {/* 트랜잭션 & 스팬 */}
        <Section title="트랜잭션 & 스팬">
          <Button
            onClick={testCustomTransaction}
            loading={loading === "transaction"}
            color="indigo"
          >
            커스텀 Checkout 트랜잭션
          </Button>
          <Button
            onClick={testOrderApi}
            loading={loading === "order"}
            color="indigo"
          >
            주문 API (30% 확률 실패)
          </Button>
        </Section>

        {/* 동시 요청 */}
        <Section title="동시 요청 테스트">
          <Button
            onClick={testConcurrentRequests}
            loading={loading === "concurrent"}
            color="teal"
          >
            5개 동시 요청
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
  loading,
  color,
  children,
}: {
  onClick: () => void;
  loading?: boolean;
  color: string;
  children: React.ReactNode;
}) {
  const colorMap: Record<string, string> = {
    blue: "bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300",
    indigo: "bg-indigo-500 hover:bg-indigo-600 disabled:bg-indigo-300",
    teal: "bg-teal-500 hover:bg-teal-600 disabled:bg-teal-300",
  };

  return (
    <button
      onClick={onClick}
      disabled={loading}
      className={`rounded-md px-4 py-2 text-sm font-medium text-white transition-colors ${colorMap[color] || "bg-gray-500"}`}
    >
      {loading ? "실행 중..." : children}
    </button>
  );
}
