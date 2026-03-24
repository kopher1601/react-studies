"use client";

import * as Sentry from "@sentry/nextjs";
import { useEffect } from "react";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 text-center">
      <div className="rounded-lg border-2 border-red-200 bg-red-50 p-8 dark:border-red-900 dark:bg-red-950">
        <h2 className="text-2xl font-bold text-red-800 dark:text-red-200">
          에러가 발생했습니다!
        </h2>
        <p className="mt-2 text-red-600 dark:text-red-400">
          {error.message}
        </p>
        <p className="mt-4 text-sm text-red-500">
          이 에러는 Sentry에 자동으로 보고되었습니다.
        </p>
        <button
          onClick={reset}
          className="mt-4 rounded-md bg-red-500 px-4 py-2 text-white hover:bg-red-600"
        >
          다시 시도
        </button>
      </div>
    </div>
  );
}
