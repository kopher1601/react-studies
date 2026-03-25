import type { NextConfig } from "next";
import { withSentryConfig } from "@sentry/nextjs";

const nextConfig: NextConfig = {
  // postgres 모듈을 번들링하지 않고 Node.js가 직접 로드하도록 설정
  // → OpenTelemetry(Sentry)가 모듈을 패칭하여 DB 쿼리를 자동 추적할 수 있음
  serverExternalPackages: ["postgres"],
};

export default withSentryConfig(nextConfig, {
  // Sentry 조직 및 프로젝트 설정
  // 실제 사용 시 .env 파일의 값이 사용됩니다
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,

  // 소스맵 업로드 (디버깅 향상)
  sourcemaps: {
    deleteSourcemapsAfterUpload: true,
  },

  // 빌드 시 Sentry CLI 로그 표시
  silent: !process.env.CI,

  // 자동 계측 설정 (webpack 빌드용)
  webpack: {
    autoInstrumentServerFunctions: true,
    autoInstrumentMiddleware: true,
    autoInstrumentAppDirectory: true,
  },
});
