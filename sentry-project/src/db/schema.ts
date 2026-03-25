import { pgTable, serial, varchar, integer, timestamp, text } from "drizzle-orm/pg-core";

export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  price: integer("price").notNull(), // 원 단위
  description: text("description"),
  stock: integer("stock").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  productId: integer("product_id").references(() => products.id).notNull(),
  quantity: integer("quantity").notNull(),
  totalPrice: integer("total_price").notNull(),
  status: varchar("status", { length: 50 }).notNull().default("pending"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
