import { drizzle, DrizzleD1Database } from "drizzle-orm/d1";

import * as schema from "./schema";
export * from "./schema";

// eslint-disable-next-line import/no-unused-modules
export type DrizzleDB = DrizzleD1Database<typeof schema>;

export function createDb(DB: CloudflareBindings["DB"]) {
  return drizzle(DB, {
    schema: {
      ...schema,
    },
  });
}
