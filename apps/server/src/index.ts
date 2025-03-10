import { Hono } from "hono";
import { cors } from "hono/cors";
import { createDb, DrizzleDB, superheroes } from "./db";

type Variables = {
  DrizzleDB: DrizzleDB;
};

const app = new Hono<{ Bindings: CloudflareBindings; Variables: Variables }>();

app.use(
  "*",
  cors({
    origin: ["http://localhost:3000", "https://cloudflare-vercel-mix-web.vercel.app"],
    allowHeaders: ["X-Custom-Header", "Upgrade-Insecure-Requests", "Content-Type"],
    allowMethods: ["POST", "GET", "OPTIONS", "PUT", "DELETE"],
    exposeHeaders: ["Content-Length", "X-Kuma-Revision"],
    maxAge: 600,
    credentials: true,
  })
);

app.use("*", async (c, next) => {
  c.set("DrizzleDB", createDb(c.env.DB));
  await next();
});

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

app.get("/super-heroes", async (c) => {
  const db = c.get("DrizzleDB");
  const superHeroes = await db.query.superheroes.findMany();
  return c.json(superHeroes);
});

app.post("/super-heroes", async (c) => {
  const db = c.get("DrizzleDB");
  const { name } = await c.req.json();

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

export default app;
