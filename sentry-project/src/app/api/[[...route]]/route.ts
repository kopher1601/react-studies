import { Hono } from "hono";
import { handle } from "hono/vercel";
import { logger } from "hono/logger";
import { HTTPException } from "hono/http-exception";

export const runtime = "nodejs";

const app = new Hono().basePath("/api");

// 미들웨어: 요청 로깅
app.use("*", logger());

// ──────────────────────────────────────────────
// 1. 기본 헬스체크
// ──────────────────────────────────────────────
app.get("/health", (c) => {
  return c.json({ status: "ok", timestamp: new Date().toISOString() });
});

// ──────────────────────────────────────────────
// 2. 사용자 목록 (정상 동작 예시)
// ──────────────────────────────────────────────
const users = [
  { id: 1, name: "Alice", email: "alice@example.com" },
  { id: 2, name: "Bob", email: "bob@example.com" },
  { id: 3, name: "Charlie", email: "charlie@example.com" },
];

app.get("/users", (c) => {
  return c.json({ users });
});

app.get("/users/:id", (c) => {
  const id = Number(c.req.param("id"));
  const user = users.find((u) => u.id === id);

  if (!user) {
    throw new HTTPException(404, { message: `User ${id} not found` });
  }

  return c.json({ user });
});

// ──────────────────────────────────────────────
// 3. 의도적 에러 엔드포인트 (Sentry 테스트용)
// ──────────────────────────────────────────────

// Unhandled Error - Sentry가 자동으로 캡처
app.get("/error/unhandled", () => {
  throw new Error("이것은 의도적인 Unhandled Error입니다! (Sentry 테스트)");
});

// Type Error
app.get("/error/type-error", () => {
  const obj: unknown = null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (obj as any).nonExistentMethod();
});

// Async Error
app.get("/error/async", async () => {
  await new Promise((resolve) => setTimeout(resolve, 100));
  throw new Error("비동기 작업 중 에러 발생! (Sentry 테스트)");
});

// ──────────────────────────────────────────────
// 4. 느린 엔드포인트 (성능 모니터링 테스트)
// ──────────────────────────────────────────────
app.get("/slow", async (c) => {
  const delay = Number(c.req.query("delay") || "3000");
  const clampedDelay = Math.min(Math.max(delay, 100), 10000);

  await new Promise((resolve) => setTimeout(resolve, clampedDelay));

  return c.json({
    message: "느린 응답 완료",
    delayMs: clampedDelay,
  });
});

// ──────────────────────────────────────────────
// 5. 주문 시뮬레이션 (트랜잭션 추적 테스트)
// ──────────────────────────────────────────────
app.post("/orders", async (c) => {
  const body = await c.req.json();

  // 재고 확인 시뮬레이션
  await new Promise((resolve) => setTimeout(resolve, 200));

  // 랜덤하게 실패하는 결제 시뮬레이션
  await new Promise((resolve) => setTimeout(resolve, 300));
  if (Math.random() < 0.3) {
    throw new Error("결제 처리 중 오류가 발생했습니다");
  }

  // 주문 생성 시뮬레이션
  await new Promise((resolve) => setTimeout(resolve, 100));

  return c.json({
    orderId: `ORD-${Date.now()}`,
    item: body.item || "unknown",
    status: "confirmed",
  });
});

// ──────────────────────────────────────────────
// 전역 에러 핸들러
// ──────────────────────────────────────────────
app.onError((err, c) => {
  if (err instanceof HTTPException) {
    return c.json({ error: err.message }, err.status);
  }

  console.error("Unhandled API error:", err);
  return c.json(
    { error: "Internal Server Error", message: err.message },
    500
  );
});

export const GET = handle(app);
export const POST = handle(app);
export const PUT = handle(app);
export const DELETE = handle(app);
