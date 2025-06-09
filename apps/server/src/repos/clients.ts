import { superheroesTable } from "../db";
import { DbService } from "../runtime/db-service";
import { Superhero } from "../types";
import { Effect } from "effect";
import { DbError } from "../errors";
import { eq } from "drizzle-orm";

const getSuperheroById = (id: string) =>
  Effect.gen(function* () {
    const db = yield* DbService;
    const result = yield* Effect.tryPromise({
      try: () =>
        db
          .select()
          .from(superheroesTable)
          .where(eq(superheroesTable.id, parseInt(id)))
          .get(),
      catch: (error) => new DbError({ message: error instanceof Error ? error.message : "Unknown error" }),
    });
    return result;
  });
const getSuperheroes = () =>
  Effect.gen(function* () {
    const db = yield* DbService;
    const result = yield* Effect.tryPromise({
      try: () => db.select().from(superheroesTable),
      catch: (error) => new DbError({ message: error instanceof Error ? error.message : "Unknown error" }),
    });
    return result;
  });

const saveSuperhero = (superhero: Superhero) =>
  Effect.gen(function* () {
    const db = yield* DbService;
    const result = yield* Effect.tryPromise({
      try: () =>
        db
          .insert(superheroesTable)
          .values(superhero)
          .onConflictDoUpdate({
            target: [superheroesTable.id],
            set: superhero,
          })
          .returning()
          .get(),
      catch: (error) => new DbError({ message: error instanceof Error ? error.message : "Unknown error" }),
    });
    return result;
  });

export const superheroRepo = {
  getSuperheroById,
  getSuperheroes,
  saveSuperhero,
};
