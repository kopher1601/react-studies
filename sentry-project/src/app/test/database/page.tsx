"use client";

import { useState } from "react";

type Product = {
  id: number;
  name: string;
  price: number;
  description: string | null;
  stock: number;
  createdAt: string;
};

type Order = {
  id: number;
  productId: number;
  quantity: number;
  totalPrice: number;
  status: string;
  createdAt: string;
};

export default function DatabaseTestPage() {
  const [results, setResults] = useState<string[]>([]);
  const [productsList, setProductsList] = useState<Product[]>([]);
  const [ordersList, setOrdersList] = useState<Order[]>([]);
  const [loading, setLoading] = useState<string | null>(null);

  function addResult(message: string) {
    setResults((prev) => [
      `[${new Date().toLocaleTimeString()}] ${message}`,
      ...prev,
    ]);
  }

  // 시드 데이터 삽입
  async function seedData() {
    setLoading("seed");
    try {
      const res = await fetch("/api/seed", { method: "POST" });
      const data = await res.json();
      if (res.ok) {
        addResult(`시드 완료: ${data.message}`);
        await fetchProducts();
      } else {
        addResult(`시드 실패: ${data.error || data.message}`);
      }
    } catch (err) {
      addResult(`시드 에러: ${err}`);
    }
    setLoading(null);
  }

  // 상품 목록 조회
  async function fetchProducts() {
    setLoading("products");
    try {
      const res = await fetch("/api/products");
      const data = await res.json();
      setProductsList(data.products);
      addResult(`상품 조회: ${data.products.length}개 (SELECT)`);
    } catch (err) {
      addResult(`상품 조회 실패: ${err}`);
    }
    setLoading(null);
  }

  // 상품 추가
  async function addProduct() {
    setLoading("add");
    const names = ["USB 허브", "웹캠", "마이크", "태블릿", "SSD"];
    const name = names[Math.floor(Math.random() * names.length)];
    const price = Math.floor(Math.random() * 200000) + 30000;

    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, price, description: `${name} 상품`, stock: 10 }),
      });
      const data = await res.json();
      if (res.ok) {
        addResult(`상품 추가: ${data.product.name} (₩${data.product.price.toLocaleString()}) (INSERT)`);
        await fetchProducts();
      } else {
        addResult(`상품 추가 실패: ${data.error || data.message}`);
      }
    } catch (err) {
      addResult(`상품 추가 에러: ${err}`);
    }
    setLoading(null);
  }

  // 상품 수정
  async function updateProduct(product: Product) {
    setLoading(`update-${product.id}`);
    const newPrice = product.price + 10000;
    try {
      const res = await fetch(`/api/products/${product.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...product, price: newPrice }),
      });
      const data = await res.json();
      if (res.ok) {
        addResult(`상품 수정: ${data.product.name} 가격 → ₩${newPrice.toLocaleString()} (UPDATE)`);
        await fetchProducts();
      } else {
        addResult(`수정 실패: ${data.error || data.message}`);
      }
    } catch (err) {
      addResult(`수정 에러: ${err}`);
    }
    setLoading(null);
  }

  // 상품 삭제
  async function deleteProduct(id: number) {
    setLoading(`delete-${id}`);
    try {
      const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (res.ok) {
        addResult(`상품 삭제: ID ${id} (DELETE)`);
        await fetchProducts();
      } else {
        addResult(`삭제 실패: ${data.error || data.message}`);
      }
    } catch (err) {
      addResult(`삭제 에러: ${err}`);
    }
    setLoading(null);
  }

  // 주문 생성
  async function createOrder(productId: number) {
    setLoading(`order-${productId}`);
    try {
      const res = await fetch("/api/db-orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, quantity: 1 }),
      });
      const data = await res.json();
      if (res.ok) {
        addResult(
          `주문 생성: 주문#${data.order.id} - ₩${data.order.totalPrice.toLocaleString()} (SELECT + UPDATE + INSERT)`
        );
        await fetchProducts();
        await fetchOrders();
      } else {
        addResult(`주문 실패: ${data.error || data.message}`);
      }
    } catch (err) {
      addResult(`주문 에러: ${err}`);
    }
    setLoading(null);
  }

  // 주문 목록 조회
  async function fetchOrders() {
    try {
      const res = await fetch("/api/db-orders");
      const data = await res.json();
      setOrdersList(data.orders);
    } catch {
      // ignore
    }
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
        DB 쿼리 추적 테스트
      </h1>
      <p className="mt-2 text-gray-600 dark:text-gray-400">
        Drizzle ORM + PostgreSQL 쿼리가 Sentry Performance에서 어떻게 추적되는지 확인해보세요.
      </p>

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {/* 데이터 초기화 */}
        <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
          <h2 className="mb-3 text-lg font-semibold text-gray-900 dark:text-white">
            데이터 관리
          </h2>
          <div className="flex flex-col gap-2">
            <button
              onClick={seedData}
              disabled={loading === "seed"}
              className="rounded-md bg-green-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-green-600 disabled:bg-green-300"
            >
              {loading === "seed" ? "실행 중..." : "시드 데이터 삽입 (INSERT 5건)"}
            </button>
            <button
              onClick={fetchProducts}
              disabled={loading === "products"}
              className="rounded-md bg-blue-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-600 disabled:bg-blue-300"
            >
              {loading === "products" ? "실행 중..." : "상품 목록 조회 (SELECT)"}
            </button>
            <button
              onClick={addProduct}
              disabled={loading === "add"}
              className="rounded-md bg-indigo-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-600 disabled:bg-indigo-300"
            >
              {loading === "add" ? "실행 중..." : "랜덤 상품 추가 (INSERT)"}
            </button>
          </div>
        </div>

        {/* 안내 */}
        <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
          <h2 className="mb-3 text-lg font-semibold text-gray-900 dark:text-white">
            Sentry에서 확인할 것
          </h2>
          <ul className="space-y-1.5 text-sm text-gray-600 dark:text-gray-400">
            <li>1. Performance &gt; 트랜잭션 상세에서 db 스팬 확인</li>
            <li>2. 각 스팬에 SQL 쿼리문이 표시됨</li>
            <li>3. 쿼리 실행 시간(ms) 확인</li>
            <li>4. 주문 생성 시 여러 쿼리가 연쇄 실행되는 워터폴 확인</li>
          </ul>
        </div>
      </div>

      {/* 상품 목록 */}
      {productsList.length > 0 && (
        <div className="mt-6 rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
          <h3 className="mb-3 text-sm font-semibold text-gray-500 dark:text-gray-400">
            상품 목록 ({productsList.length}개)
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-gray-200 text-gray-500 dark:border-gray-700">
                <tr>
                  <th className="pb-2 pr-4">ID</th>
                  <th className="pb-2 pr-4">이름</th>
                  <th className="pb-2 pr-4">가격</th>
                  <th className="pb-2 pr-4">재고</th>
                  <th className="pb-2">액션</th>
                </tr>
              </thead>
              <tbody className="text-gray-700 dark:text-gray-300">
                {productsList.map((p) => (
                  <tr key={p.id} className="border-b border-gray-100 dark:border-gray-800">
                    <td className="py-2 pr-4">{p.id}</td>
                    <td className="py-2 pr-4">{p.name}</td>
                    <td className="py-2 pr-4">₩{p.price.toLocaleString()}</td>
                    <td className="py-2 pr-4">{p.stock}</td>
                    <td className="flex gap-1 py-2">
                      <button
                        onClick={() => updateProduct(p)}
                        disabled={loading === `update-${p.id}`}
                        className="rounded bg-yellow-500 px-2 py-1 text-xs text-white hover:bg-yellow-600"
                      >
                        +₩10,000
                      </button>
                      <button
                        onClick={() => createOrder(p.id)}
                        disabled={loading === `order-${p.id}` || p.stock === 0}
                        className="rounded bg-purple-500 px-2 py-1 text-xs text-white hover:bg-purple-600 disabled:bg-gray-300"
                      >
                        주문
                      </button>
                      <button
                        onClick={() => deleteProduct(p.id)}
                        disabled={loading === `delete-${p.id}`}
                        className="rounded bg-red-500 px-2 py-1 text-xs text-white hover:bg-red-600"
                      >
                        삭제
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 주문 목록 */}
      {ordersList.length > 0 && (
        <div className="mt-4 rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
          <h3 className="mb-3 text-sm font-semibold text-gray-500 dark:text-gray-400">
            주문 내역 ({ordersList.length}건)
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-gray-200 text-gray-500 dark:border-gray-700">
                <tr>
                  <th className="pb-2 pr-4">주문ID</th>
                  <th className="pb-2 pr-4">상품ID</th>
                  <th className="pb-2 pr-4">수량</th>
                  <th className="pb-2 pr-4">총액</th>
                  <th className="pb-2">상태</th>
                </tr>
              </thead>
              <tbody className="text-gray-700 dark:text-gray-300">
                {ordersList.map((o) => (
                  <tr key={o.id} className="border-b border-gray-100 dark:border-gray-800">
                    <td className="py-2 pr-4">#{o.id}</td>
                    <td className="py-2 pr-4">{o.productId}</td>
                    <td className="py-2 pr-4">{o.quantity}</td>
                    <td className="py-2 pr-4">₩{o.totalPrice.toLocaleString()}</td>
                    <td className="py-2">{o.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 실행 로그 */}
      <div className="mt-6 rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
        <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400">
          실행 로그 (SQL 쿼리 타입 표시)
        </h3>
        <div className="mt-2 max-h-64 overflow-y-auto font-mono text-sm">
          {results.length === 0 ? (
            <p className="text-gray-400">
              먼저 &quot;시드 데이터 삽입&quot;을 클릭하여 테스트 데이터를 넣어보세요.
            </p>
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
