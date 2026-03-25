# Sentry 학습 가이드

Next.js + Hono + Sentry + Drizzle ORM으로 구성된 이 프로젝트를 통해 Sentry의 핵심 기능을 단계별로 학습합니다.

---

## 프로젝트 구조 파악

```
sentry-project/
├── docker-compose.yml          # PostgreSQL 로컬 DB
├── drizzle.config.ts            # Drizzle ORM 설정
├── sentry.client.config.ts      # 브라우저(클라이언트) Sentry 설정
├── sentry.server.config.ts      # Node.js 서버 Sentry 설정 (DB 추적 포함)
├── sentry.edge.config.ts        # Edge 런타임 Sentry 설정
├── next.config.ts               # withSentryConfig으로 래핑된 Next.js 설정
├── src/
│   ├── db/
│   │   ├── index.ts             # Drizzle DB 커넥션
│   │   └── schema.ts            # products, orders 테이블 스키마
│   ├── instrumentation.ts       # 서버/엣지 런타임별 Sentry 초기화
│   ├── app/
│   │   ├── layout.tsx           # 루트 레이아웃 (네비게이션)
│   │   ├── page.tsx             # 메인 페이지
│   │   ├── global-error.tsx     # 전역 에러 바운더리 → Sentry 전송
│   │   ├── test/
│   │   │   ├── error/
│   │   │   │   ├── page.tsx     # 에러 트래킹 테스트 페이지
│   │   │   │   └── error.tsx    # 라우트 레벨 에러 바운더리
│   │   │   ├── performance/
│   │   │   │   └── page.tsx     # 성능 모니터링 테스트 페이지
│   │   │   └── database/
│   │   │       └── page.tsx     # DB 쿼리 추적 테스트 페이지
│   │   └── api/
│   │       └── [[...route]]/
│   │           └── route.ts     # Hono API (에러/성능/DB 엔드포인트)
```

---

## 0단계: Sentry 가입 및 프로젝트 설정

테스트를 시작하기 전에 **Sentry 계정과 프로젝트**가 필요하다.

### 0-1. Sentry 가입

1. https://sentry.io 접속
2. **GitHub 계정으로 가입** (가장 빠름) 또는 이메일 가입
3. 무료 **Developer 플랜** 선택 (월 5,000 에러 이벤트, 10,000 트랜잭션 무료)

### 0-2. 프로젝트 생성

1. 가입 후 **Create Project** 클릭
2. 플랫폼: **Next.js** 선택
3. 프로젝트 이름 입력 (예: `sentry-study`)
4. **Create Project** 클릭

### 0-3. 필요한 값 수집

| 값 | 어디서 찾나 | 용도 |
|---|---|---|
| **DSN** | Project Settings > Client Keys (DSN) | 이벤트 전송 주소 **(필수)** |
| **Org Slug** | Organization Settings > General | 소스맵 업로드용 |
| **Project Slug** | Project Settings > General | 소스맵 업로드용 |
| **Auth Token** | Settings > Auth Tokens > Create New Token | 빌드 시 소스맵 업로드 인증 |

### 0-4. `.env.local` 파일 설정

```bash
# Sentry DSN (필수 - 이것만 있으면 에러 트래킹/성능 모니터링 동작)
NEXT_PUBLIC_SENTRY_DSN=https://examplePublicKey@o0.ingest.sentry.io/0

# 소스맵 업로드용 (프로덕션 빌드 시 필요, 개발 중에는 없어도 됨)
SENTRY_ORG=your-org-slug
SENTRY_PROJECT=your-project-slug
SENTRY_AUTH_TOKEN=sntrys_eyJpYX...

# Database
DATABASE_URL=postgresql://study:study1234@localhost:5432/sentry_study
```

> **DSN만 채우면 바로 시작 가능.** ORG/PROJECT/AUTH_TOKEN은 `npm run build` 시 소스맵 업로드에만 필요하다.

### 0-5. 로컬 DB 시작

```bash
# PostgreSQL 컨테이너 실행
docker compose up -d

# 테이블 생성 (Drizzle가 스키마 기반으로 DB에 push)
npm run db:push
```

---

## 1단계: Sentry란 무엇인가

Sentry는 **애플리케이션 모니터링 플랫폼**이다. 핵심 기능은 3가지:

| 기능 | 설명 |
|------|------|
| **Error Tracking** | 런타임 에러를 자동 수집하고 스택트레이스, 컨텍스트 정보와 함께 대시보드에 표시 |
| **Performance Monitoring** | 페이지 로드, API 호출, DB 쿼리 등의 성능을 트랜잭션/스팬 단위로 추적 |
| **Session Replay** | 에러 발생 전후 사용자의 실제 화면 조작을 녹화하여 재현 |

### 왜 Sentry를 쓰는가?
- `console.log`로는 프로덕션 에러를 볼 수 없다
- 사용자가 "안 돼요"라고 했을 때, 정확히 어떤 에러가 어떤 상황에서 발생했는지 알 수 있다
- 에러 빈도, 영향 받는 사용자 수, 성능 병목 등을 데이터로 확인할 수 있다

---

## 2단계: 초기 설정 구조 이해하기

이 프로젝트는 `@sentry/nextjs` SDK를 사용한다. 설정 파일이 3개로 나뉘는 이유를 이해하는 것이 핵심.

### 2-1. 설정 파일이 3개인 이유

Next.js는 코드가 **3가지 런타임**에서 실행된다:

| 파일 | 런타임 | 실행 위치 |
|------|--------|----------|
| `sentry.client.config.ts` | 브라우저 | 사용자의 브라우저 |
| `sentry.server.config.ts` | Node.js | 서버 (SSR, API Routes) |
| `sentry.edge.config.ts` | Edge | Edge 미들웨어, Edge API Routes |

### 2-2. `sentry.client.config.ts` 읽어보기

```ts
Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,  // 이벤트를 보낼 Sentry 프로젝트 주소
  tracesSampleRate: 1.0,                     // 성능 트랜잭션 100% 수집 (프로덕션에선 0.1~0.3)
  replaysSessionSampleRate: 0.1,             // 일반 세션 10% 리플레이
  replaysOnErrorSampleRate: 1.0,             // 에러 세션 100% 리플레이
  integrations: [
    Sentry.replayIntegration(),              // Session Replay
    Sentry.browserTracingIntegration(),      // 브라우저 성능 추적
    Sentry.feedbackIntegration(),            // 사용자 피드백 위젯
  ],
  environment: process.env.NODE_ENV,         // development / production 구분
  debug: process.env.NODE_ENV === "development",
});
```

**핵심 개념:**
- **DSN (Data Source Name)**: Sentry 프로젝트의 고유 주소. 이벤트를 어디로 보낼지 결정
- **tracesSampleRate**: 1.0이면 모든 트랜잭션 수집. 프로덕션에서는 비용/성능 이유로 낮춰야 한다
- **Integration**: Sentry에 추가 기능을 붙이는 플러그인 시스템

### 2-3. `instrumentation.ts` 읽어보기

```ts
export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    await import("../sentry.server.config");
  }
  if (process.env.NEXT_RUNTIME === "edge") {
    await import("../sentry.edge.config");
  }
}

export const onRequestError = Sentry.captureRequestError;
```

- Next.js의 `instrumentation.ts`는 서버 시작 시 한 번 실행된다
- 런타임에 맞는 Sentry 설정을 동적으로 import한다
- `onRequestError`는 서버 컴포넌트/라우트 핸들러에서 발생한 에러를 Sentry에 자동 전달한다

### 2-4. `next.config.ts`의 `withSentryConfig`

```ts
export default withSentryConfig(nextConfig, {
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,
  sourcemaps: { deleteSourcemapsAfterUpload: true },
  webpack: {
    autoInstrumentServerFunctions: true,
    autoInstrumentMiddleware: true,
    autoInstrumentAppDirectory: true,
  },
});
```

- 빌드 시 **소스맵을 Sentry에 업로드**하여 minified 코드도 원본 소스로 매핑
- `autoInstrument*`: 서버 함수, 미들웨어, App Router 경로를 자동으로 성능 추적 대상에 포함

---

## 3단계: 에러 트래킹 학습

`/test/error` 페이지(`src/app/test/error/page.tsx`)에서 실습 가능.

### 3-1. 수동 에러 캡처: `captureException`

```ts
try {
  throw new Error("의도적 에러");
} catch (error) {
  Sentry.captureException(error);  // Sentry에 에러 전송
}
```

- `try/catch`로 잡은 에러를 명시적으로 Sentry에 보낸다
- 앱은 크래시하지 않지만 Sentry 대시보드에 기록된다

### 3-2. 자동 에러 캡처: Error Boundary

`src/app/test/error/error.tsx`와 `src/app/global-error.tsx`를 확인하자:

```ts
useEffect(() => {
  Sentry.captureException(error);
}, [error]);
```

- Next.js의 `error.tsx`는 라우트 레벨 에러 바운더리 역할
- `global-error.tsx`는 루트 레이아웃까지 포함한 최상위 에러 바운더리
- Unhandled Error가 발생하면 자동으로 이 컴포넌트가 렌더링되고, Sentry에 보고된다

### 3-3. 메시지 전송: `captureMessage`

```ts
Sentry.captureMessage("커스텀 메시지", "info");
```

- 에러가 아닌 **정보성 이벤트**를 보낼 때 사용
- 레벨: `fatal`, `error`, `warning`, `info`, `debug`

### 3-4. Breadcrumb (사용자 행동 추적)

```ts
Sentry.addBreadcrumb({
  category: "user-action",
  message: "장바구니에 상품 추가",
  level: "info",
  data: { amount: 29900 },
});
```

- 에러가 발생하기 **전에** 사용자가 무엇을 했는지 기록
- 에러 이벤트에 자동으로 첨부되어 Sentry 대시보드에서 타임라인으로 확인 가능
- 네트워크 요청, 콘솔 로그 등은 SDK가 자동으로 Breadcrumb에 추가

### 3-5. 컨텍스트 (사용자 정보, 태그, 추가 데이터)

```ts
// 사용자 정보 설정 → 에러가 어떤 사용자에게 발생했는지 추적
Sentry.setUser({ id: "user-123", email: "test@example.com" });

// 태그 → 에러 필터링/검색에 사용
Sentry.setTag("page", "error-test");

// 추가 데이터 → 디버깅용 상세 정보
Sentry.setExtra("testScenario", "user-context-error");
```

### 3-6. 서버 사이드 에러

`src/app/api/[[...route]]/route.ts`에 정의된 에러 엔드포인트:

| 엔드포인트 | 설명 |
|-----------|------|
| `GET /api/error/unhandled` | Unhandled Error → Sentry 자동 캡처 |
| `GET /api/error/type-error` | TypeError (null 참조) |
| `GET /api/error/async` | 비동기 작업 중 에러 |

서버 에러는 `instrumentation.ts`의 `onRequestError`를 통해 Sentry에 자동 전송된다.

---

## 4단계: 성능 모니터링 학습

`/test/performance` 페이지(`src/app/test/performance/page.tsx`)에서 실습 가능.

### 4-1. 핵심 개념: Transaction과 Span

```
Transaction: "GET /api/orders"          ← 하나의 작업 단위
  └─ Span: "validate-cart"    (150ms)   ← 세부 단계
  └─ Span: "process-payment"  (300ms)
  └─ Span: "confirm-order"    (100ms)
```

- **Transaction**: 하나의 요청이나 페이지 로드 같은 최상위 작업
- **Span**: 트랜잭션 내부의 세부 작업 단위
- Sentry 대시보드에서 각 스팬의 소요 시간을 워터폴 차트로 확인 가능

### 4-2. 자동 추적

`browserTracingIntegration()`이 자동으로 추적하는 것들:
- 페이지 로드 시간 (LCP, FCP, TTFB 등 Web Vitals)
- 페이지 전환 (SPA navigation)
- XHR/Fetch 요청

서버 측 `autoInstrumentServerFunctions`이 자동으로 추적하는 것들:
- Server Component 렌더링
- API Route 핸들러 실행
- 미들웨어 실행

### 4-3. 커스텀 트랜잭션 생성

```ts
Sentry.startSpan(
  { name: "custom-checkout-flow", op: "transaction" },
  (span) => {
    Sentry.startSpan({ name: "validate-cart", op: "task" }, () => {
      // 장바구니 검증 로직
    });

    Sentry.startSpan({ name: "process-payment", op: "task" }, () => {
      // 결제 처리 로직
    });

    return span;
  }
);
```

- `Sentry.startSpan`으로 커스텀 트랜잭션/스팬을 만들 수 있다
- 비즈니스 로직의 병목 구간을 정확히 측정할 때 유용

### 4-4. 느린 API 테스트

`GET /api/slow?delay=3000` 엔드포인트로 의도적으로 느린 응답을 만들어서 Sentry Performance 대시보드에서 확인할 수 있다.

---

## 5단계: DB 쿼리 추적 학습 (Drizzle ORM + PostgreSQL)

`/test/database` 페이지(`src/app/test/database/page.tsx`)에서 실습 가능.

### 5-1. 어떻게 SQL이 추적되는가?

`sentry.server.config.ts`에 `postgresJsIntegration`을 추가하면 끝:

```ts
Sentry.init({
  integrations: [
    Sentry.postgresJsIntegration(),  // postgres.js 드라이버 자동 추적
  ],
});
```

이후 Drizzle ORM을 통한 모든 쿼리가 Sentry Performance에 스팬으로 자동 기록된다:

```
Transaction: "POST /api/db-orders"           (250ms)
  └─ db.query: SELECT * FROM products ...    (3ms)    ← 자동 추적
  └─ db.query: UPDATE products SET stock ... (5ms)    ← 자동 추적
  └─ db.query: INSERT INTO orders ...        (4ms)    ← 자동 추적
```

### 5-2. DB 스키마 구조

`src/db/schema.ts`에 2개 테이블이 정의되어 있다:

```ts
// 상품 테이블
products: { id, name, price, description, stock, createdAt }

// 주문 테이블
orders: { id, productId (→ products.id), quantity, totalPrice, status, createdAt }
```

### 5-3. 테스트 가능한 DB 작업

| 엔드포인트 | SQL 타입 | 설명 |
|-----------|---------|------|
| `POST /api/seed` | INSERT (5건) | 샘플 상품 데이터 삽입 |
| `GET /api/products` | SELECT | 상품 목록 조회 |
| `POST /api/products` | INSERT | 상품 추가 |
| `PUT /api/products/:id` | UPDATE | 상품 수정 |
| `DELETE /api/products/:id` | DELETE | 상품 삭제 |
| `POST /api/db-orders` | SELECT + UPDATE + INSERT | 주문 생성 (복합 쿼리) |
| `GET /api/db-orders` | SELECT | 주문 목록 조회 |

### 5-4. Sentry에서 확인할 것

1. **Performance > 트랜잭션 목록**에서 API 엔드포인트 클릭
2. **워터폴 뷰**에서 `db.query` 스팬 확인
3. 각 스팬에 **실행된 SQL 쿼리문**이 표시됨 (파라미터는 `$1`, `$2`로 마스킹)
4. 주문 생성(`POST /api/db-orders`)은 3개의 쿼리가 순차 실행 → 워터폴로 확인

### 5-5. Sentry가 지원하는 DB/ORM Integration 목록

| 라이브러리 | Integration | 설명 |
|-----------|------------|------|
| postgres (postgres.js) | `postgresJsIntegration()` | 이 프로젝트에서 사용 |
| pg (node-postgres) | `postgresIntegration()` | 전통적인 pg 드라이버 |
| Prisma | `prismaIntegration()` | Prisma ORM |
| Knex | `knexIntegration()` | Knex 쿼리 빌더 |
| MySQL | `mysqlIntegration()` | MySQL 드라이버 |
| MySQL2 | `mysql2Integration()` | MySQL2 드라이버 |
| MongoDB | `mongoIntegration()` | MongoDB 드라이버 |
| Redis | `redisIntegration()` | Redis 클라이언트 |

---

## 6단계: Session Replay 학습

`sentry.client.config.ts`에 이미 설정되어 있다:

```ts
Sentry.replayIntegration()
```

- `replaysSessionSampleRate: 0.1` → 일반 세션의 10%를 녹화
- `replaysOnErrorSampleRate: 1.0` → 에러 발생 세션은 100% 녹화

### Replay에서 확인할 수 있는 것
- 에러 발생 전후 사용자의 실제 클릭, 스크롤, 입력
- DOM 변화 (요소가 어떻게 변했는지)
- 네트워크 요청 타이밍
- 콘솔 로그

### 민감 정보 보호
Replay는 기본적으로 텍스트 입력값을 마스킹한다. 추가적인 프라이버시 설정이 필요하면 `maskAllText`, `blockAllMedia` 등의 옵션을 사용한다.

---

## 7단계: Sentry 대시보드 활용법

Sentry 웹 대시보드에서 확인해야 할 핵심 메뉴:

| 메뉴 | 용도 |
|------|------|
| **Issues** | 수집된 에러 목록. 동일 에러는 그룹핑되어 횟수/영향 사용자 수 표시 |
| **Performance** | 트랜잭션별 응답 시간, p50/p95/p99, 처리량 |
| **Queries** | DB 쿼리별 실행 시간, 빈도, 느린 쿼리 목록 |
| **Replays** | 세션 리플레이 영상 목록 |
| **Alerts** | 에러 빈도/성능 임계값 기반 알림 설정 |
| **Releases** | 배포 버전별 에러 추적, 회귀 감지 |
| **Discover** | 커스텀 쿼리로 이벤트 데이터 분석 |

### Issues 화면에서 확인할 것
1. **스택트레이스** → 에러가 발생한 정확한 코드 위치 (소스맵 업로드 필요)
2. **Breadcrumbs 탭** → 에러 발생 전 사용자 행동 타임라인
3. **Tags 탭** → 브라우저, OS, URL 등으로 필터링
4. **Events 탭** → 같은 에러의 개별 발생 건 확인

---

## 8단계: 프로덕션 적용 시 고려사항

### 샘플 레이트 조정
```ts
// 개발: 모든 이벤트 수집
tracesSampleRate: 1.0

// 프로덕션: 비용과 성능 고려
tracesSampleRate: 0.1        // 트랜잭션 10%만 수집
replaysSessionSampleRate: 0.01  // 세션 1%만 리플레이
```

### 환경(Environment) 분리
```ts
environment: process.env.NODE_ENV  // "development" vs "production"
```
- Sentry 대시보드에서 환경별로 필터링 가능
- 개발 중 에러와 프로덕션 에러를 구분

### 릴리스(Release) 태깅
```ts
Sentry.init({
  release: "my-app@1.2.3",  // 배포 버전
});
```
- 어떤 배포에서 에러가 처음 발생했는지 추적
- Commit과 연동하면 에러를 유발한 코드 변경을 자동으로 찾아준다

### 민감 정보 필터링
```ts
Sentry.init({
  beforeSend(event) {
    // PII(개인정보) 제거
    if (event.user) {
      delete event.user.email;
    }
    return event;
  },
});
```

---

## 실습 순서 (추천)

### 사전 준비
```bash
docker compose up -d    # PostgreSQL 시작
npm run db:push         # 테이블 생성
npm run dev             # 개발 서버 시작
```

### 학습 순서
1. **Sentry 가입 & DSN 설정** → `.env.local`에 DSN 입력
2. **에러 트래킹 실습** → `/test/error`에서 버튼 하나씩 클릭 → Sentry Issues 확인
3. **성능 모니터링 실습** → `/test/performance`에서 버튼 클릭 → Sentry Performance 확인
4. **DB 쿼리 추적 실습** → `/test/database`에서 CRUD 조작 → Performance의 db 스팬 확인
5. **대시보드 탐색** → 각 이벤트의 상세 정보 (스택트레이스, Breadcrumb, Tags) 확인
6. **Session Replay 확인** → Replays 메뉴에서 녹화된 세션 재생
7. **Alert 설정** → 특정 에러가 N회 이상 발생하면 Slack/이메일 알림 보내기

### DB 관련 유용한 명령어
```bash
npm run db:push      # 스키마를 DB에 즉시 반영 (개발용)
npm run db:generate  # 마이그레이션 SQL 파일 생성
npm run db:migrate   # 마이그레이션 실행 (프로덕션용)
npm run db:studio    # Drizzle Studio (DB GUI) 실행
```

---

## 주요 API 요약

| API | 용도 | 사용 예 |
|-----|------|--------|
| `Sentry.captureException(error)` | 에러 전송 | catch 블록 내에서 |
| `Sentry.captureMessage(msg, level)` | 메시지 전송 | 정보성 이벤트 로깅 |
| `Sentry.addBreadcrumb({...})` | 행동 기록 | 에러 발생 전 맥락 추가 |
| `Sentry.setUser({...})` | 사용자 설정 | 로그인 후 |
| `Sentry.setTag(key, value)` | 태그 추가 | 필터링용 메타데이터 |
| `Sentry.setExtra(key, value)` | 추가 데이터 | 디버깅용 상세 정보 |
| `Sentry.startSpan({...}, callback)` | 커스텀 스팬 | 성능 측정 구간 정의 |
| `Sentry.setContext(name, data)` | 구조화된 컨텍스트 | 에러에 부가 정보 첨부 |

---

## 더 알아볼 주제

- **Source Maps**: 프로덕션 빌드에서 원본 소스 매핑
- **Crons Monitoring**: 크론잡 실행 모니터링
- **Profiling**: `profilesSampleRate`로 서버 코드 프로파일링
- **Feature Flags**: Sentry와 피처 플래그 연동
- **GitHub/Slack Integration**: 에러를 이슈로 자동 생성, 알림 연동
