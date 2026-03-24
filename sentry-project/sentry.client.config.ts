import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  // 성능 모니터링: 트랜잭션 샘플 비율 (1.0 = 100%)
  // 프로덕션에서는 낮은 값 권장 (0.1 ~ 0.3)
  tracesSampleRate: 1.0,

  // Session Replay: 에러 발생 시 세션 리플레이 캡처
  replaysSessionSampleRate: 0.1, // 일반 세션의 10%
  replaysOnErrorSampleRate: 1.0, // 에러 발생 세션의 100%

  integrations: [
    Sentry.replayIntegration(),
    Sentry.browserTracingIntegration(),
    Sentry.feedbackIntegration({
      colorScheme: "system",
    }),
  ],

  // 개발 환경 구분
  environment: process.env.NODE_ENV,

  // 디버그 모드 (개발 시 유용)
  debug: process.env.NODE_ENV === "development",
});
