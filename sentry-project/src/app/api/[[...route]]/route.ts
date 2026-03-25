import { Hono } from "hono";
import { handle } from "hono/vercel";
import { logger } from "hono/logger";
import { HTTPException } from "hono/http-exception";
import { db, dbQuery } from "@/db";
import { products, orders } from "@/db/schema";
import { eq } from "drizzle-orm";

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
// 6. 상품 CRUD (DB 쿼리 추적 테스트)
// ──────────────────────────────────────────────

// 상품 목록 조회
app.get("/products", async (c) => {
  const allProducts = await dbQuery("SELECT * FROM products", () =>
    db.select().from(products),
  );
  return c.json({ products: allProducts });
});

// 상품 상세 조회
app.get("/products/:id", async (c) => {
  const id = Number(c.req.param("id"));
  const [product] = await dbQuery("SELECT * FROM products WHERE id = $1", () =>
    db.select().from(products).where(eq(products.id, id)),
  );

  if (!product) {
    throw new HTTPException(404, { message: `Product ${id} not found` });
  }

  return c.json({ product });
});

// 상품 추가
app.post("/products", async (c) => {
  const body = await c.req.json();
  const [product] = await dbQuery("INSERT INTO products", () =>
    db
      .insert(products)
      .values({
        name: body.name,
        price: body.price,
        description: body.description || null,
        stock: body.stock || 0,
      })
      .returning(),
  );

  return c.json({ product }, 201);
});

// 상품 수정
app.put("/products/:id", async (c) => {
  const id = Number(c.req.param("id"));
  const body = await c.req.json();

  const [product] = await dbQuery("UPDATE products SET ... WHERE id = $1", () =>
    db
      .update(products)
      .set({
        name: body.name,
        price: body.price,
        description: body.description,
        stock: body.stock,
      })
      .where(eq(products.id, id))
      .returning(),
  );

  if (!product) {
    throw new HTTPException(404, { message: `Product ${id} not found` });
  }

  return c.json({ product });
});

// 상품 삭제
app.delete("/products/:id", async (c) => {
  const id = Number(c.req.param("id"));
  const [deleted] = await dbQuery("DELETE FROM products WHERE id = $1", () =>
    db.delete(products).where(eq(products.id, id)).returning(),
  );

  if (!deleted) {
    throw new HTTPException(404, { message: `Product ${id} not found` });
  }

  return c.json({ deleted: true });
});

// DB 주문 생성 (products + orders 테이블 조인 트랜잭션)
app.post("/db-orders", async (c) => {
  const body = await c.req.json();
  const productId = body.productId;
  const quantity = body.quantity || 1;

  // 상품 조회
  const [product] = await dbQuery("SELECT * FROM products WHERE id = $1", () =>
    db.select().from(products).where(eq(products.id, productId)),
  );
  if (!product) {
    throw new HTTPException(404, { message: `Product ${productId} not found` });
  }

  // 재고 확인
  if (product.stock < quantity) {
    throw new HTTPException(400, { message: `재고 부족: ${product.stock}개 남음` });
  }

  // 재고 차감
  await dbQuery("UPDATE products SET stock = $1 WHERE id = $2", () =>
    db
      .update(products)
      .set({ stock: product.stock - quantity })
      .where(eq(products.id, productId)),
  );

  // 주문 생성
  const [order] = await dbQuery("INSERT INTO orders", () =>
    db
      .insert(orders)
      .values({
        productId,
        quantity,
        totalPrice: product.price * quantity,
        status: "confirmed",
      })
      .returning(),
  );

  return c.json({ order, product: { ...product, stock: product.stock - quantity } }, 201);
});

// 주문 목록 조회
app.get("/db-orders", async (c) => {
  const allOrders = await dbQuery("SELECT * FROM orders", () =>
    db.select().from(orders),
  );
  return c.json({ orders: allOrders });
});

// DB 시드 데이터 삽입
app.post("/seed", async (c) => {
  const sampleProducts = [
    { name: "노트북", price: 1500000, description: "고성능 개발용 노트북", stock: 10 },
    { name: "키보드", price: 150000, description: "기계식 키보드", stock: 25 },
    { name: "모니터", price: 450000, description: "27인치 4K 모니터", stock: 15 },
    { name: "마우스", price: 89000, description: "무선 마우스", stock: 30 },
    { name: "헤드셋", price: 120000, description: "노이즈캔슬링 헤드셋", stock: 20 },
  ];

  const inserted = await dbQuery("INSERT INTO products (bulk seed)", () =>
    db.insert(products).values(sampleProducts).returning(),
  );
  return c.json({ message: `${inserted.length}개 상품 추가됨`, products: inserted }, 201);
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
