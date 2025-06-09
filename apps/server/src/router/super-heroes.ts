import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import type { Variables } from "../index";
import { superheroesTable } from "../db";
import { superheroesInsertSchema } from "../types";
import { createRuntime } from "../runtime";
import { superheroRepo } from "../repos/clients";

export const superHeroesRoutes = new Hono<{ Bindings: CloudflareBindings; Variables: Variables }>()
  .get("/", async (c) => {
    const superHeroes = await createRuntime(c).runPromise(superheroRepo.getSuperheroes());
    return c.json(superHeroes);
  })
  .post("/", zValidator("json", superheroesInsertSchema.pick({ name: true })), async (c) => {
    const { name } = c.req.valid("json");

    const newHero = await createRuntime(c).runPromise(
      superheroRepo.saveSuperhero({
        name,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
    );

    return c.json(newHero);
  });
