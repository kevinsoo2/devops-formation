import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import * as schema from "./schema";

const url = process.env.TURSO_DATABASE_URL;
const authToken = process.env.TURSO_AUTH_TOKEN;

let db: ReturnType<typeof drizzle>;

if (url && authToken) {
  const client = createClient({ url, authToken });
  db = drizzle(client, { schema });
} else {
  // Fallback: create a dummy that won't crash at build time
  const client = createClient({ url: "file::memory:" });
  db = drizzle(client, { schema });
}

export { db };
