import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const superheroesTable = sqliteTable("superheroes", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull().default(new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull().default(new Date()),
});
