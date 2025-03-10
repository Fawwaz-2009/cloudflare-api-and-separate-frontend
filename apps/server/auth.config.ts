import { betterAuth, BetterAuthOptions } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import path from "path";
import fs from "fs";

import { createSQLiteDB } from "@miniflare/shared";
import { D1Database, D1DatabaseAPI } from "@miniflare/d1";
import type { D1Database as D1DatabaseType } from "@cloudflare/workers-types";
import { drizzle } from "drizzle-orm/d1";
import { schema } from "./src/db";

const local_db = await createSQLiteDB(getLocalD1DB()!);
const db = new D1Database(new D1DatabaseAPI(local_db)) as unknown as D1DatabaseType;

export const betterAuthConfig: BetterAuthOptions = {
  emailAndPassword: {
    enabled: true,
  },
  database: drizzleAdapter(drizzle(db, { schema }), {
    provider: "sqlite", // or "mysql", "sqlite"
  }),
  plugins: [],
};
export const auth = betterAuth(betterAuthConfig);

function getLocalD1DB() {
  try {
    const basePath = path.resolve(".wrangler");
    const dbFile = fs.readdirSync(basePath, { encoding: "utf-8", recursive: true }).find((f) => f.endsWith(".sqlite"));

    if (!dbFile) {
      throw new Error(`.sqlite file not found in ${basePath}`);
    }

    const url = path.resolve(basePath, dbFile);
    return url;
  } catch (err: any) {
    console.log(`Error  ${err.message}`);
  }
}
