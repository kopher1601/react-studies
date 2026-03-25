import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as Sentry from "@sentry/nextjs";
import * as schema from "./schema";

const connectionString = process.env.DATABASE_URL || "postgresql://study:study1234@localhost:5432/sentry_study";

const client = postgres(connectionString);
export const db = drizzle(client, { schema });

/**
 * DB 쿼리를 Sentry 스팬으로 감싸서 추적하는 헬퍼 함수.
 *
 * 사용 예:
 *   const products = await dbQuery("SELECT * FROM products", () =>
 *     db.select().from(products)
 *   );
 */
export function dbQuery<T>(queryName: string, fn: () => Promise<T>): Promise<T> {
  return Sentry.startSpan(
    { name: queryName, op: "db.query", attributes: { "db.system": "postgresql" } },
    () => fn(),
  );
}
