import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { superheroes } from "./db";
import { z } from "zod/v4";

export type { AppType } from "./";

// superheroes
export const superheroesInsertSchema = createInsertSchema(superheroes);
export type SuperheroesInsert = z.infer<typeof superheroesInsertSchema>;
export const superheroesSchema = superheroesInsertSchema;
export type Superheroes = z.infer<typeof superheroesSchema>;
