import { Hono } from "hono";
import { cors } from "hono/cors";
import { createDb, DrizzleDB } from "./db";

type Variables = {
  DrizzleDB: DrizzleDB;
};

const app = new Hono<{ Bindings: CloudflareBindings; Variables: Variables }>();

app.use(
  "*",
  cors({
    origin: ["http://localhost:3000", "https://cloudflare-vercel-mix-web.vercel.app"],
    allowHeaders: ["X-Custom-Header", "Upgrade-Insecure-Requests"],
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

export default app;
