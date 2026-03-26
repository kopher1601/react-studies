import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

const connectionString = process.env.DATABASE_URL || "postgresql://study:study1234@localhost:5432/sentry_study";

const client = postgres(connectionString);

export const db = drizzle(client, { schema });
