import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import type { Variables } from "../index";
import { superheroes } from "../db";
import { superheroesInsertSchema } from "../types";

export const superHeroesRoutes = new Hono<{ Bindings: CloudflareBindings; Variables: Variables }>()
  .get("/", async (c) => {
    const db = c.get("DrizzleDB");
    const superHeroes = await db.query.superheroes.findMany();
    return c.json(superHeroes);
  })
  .post("/", zValidator("json", superheroesInsertSchema.pick({ name: true })), async (c) => {
    const db = c.get("DrizzleDB");
    const { name } = c.req.valid("json");

    if (!name) {
      return c.json({ error: "Name is required" }, 400);
    }

    const newHero = await db
      .insert(superheroes)
      .values({
        name,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning()
      .get();

    return c.json(newHero);
  });
