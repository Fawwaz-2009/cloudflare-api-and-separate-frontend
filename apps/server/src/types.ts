import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { superheroesTable } from "./db";
import { z } from "zod/v4";

export type { AppType } from "./";

// superheroes
export const superheroesInsertSchema = createInsertSchema(superheroesTable);
export type SuperheroesInsert = z.infer<typeof superheroesInsertSchema>;
export const superheroSchema = superheroesInsertSchema;
export type Superhero = z.infer<typeof superheroSchema>;
