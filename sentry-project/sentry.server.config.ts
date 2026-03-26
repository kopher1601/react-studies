import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  // 성능 모니터링
  tracesSampleRate: 1.0,

  // 프로파일링: 성능 프로파일 수집
  profilesSampleRate: 1.0,

  integrations: [
    // postgres.js (drizzle-orm 드라이버) SQL 쿼리 자동 추적
    Sentry.postgresJsIntegration(),
  ],

  // 환경 구분
  environment: process.env.NODE_ENV,

  // 디버그 모드
  debug: process.env.NODE_ENV === "development",
});
