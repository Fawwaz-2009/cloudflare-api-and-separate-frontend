import { Hono } from "hono";
import { cors } from "hono/cors";
import { createDb, DrizzleDB, superheroes } from "./db";
import { getAuth } from "./lib/auth";
import { TRUSTED_ORIGINS } from "./lib/constants";
import { superHeroesRoutes } from "./router/super-heroes";

export type Variables = {
  DrizzleDB: DrizzleDB;
  auth: ReturnType<typeof getAuth>;
};

const app = new Hono<{ Bindings: CloudflareBindings; Variables: Variables }>();

app.use(
  "*",
  cors({
    origin: TRUSTED_ORIGINS,
    allowHeaders: ["Content-Type", "Authorization", "Access-Control-Allow-Origin"],
    allowMethods: ["POST", "GET", "OPTIONS", "PUT", "DELETE"],
    exposeHeaders: ["Content-Length", "Access-Control-Allow-Origin"],
    maxAge: 600,
    credentials: true,
  })
);

// Logging middleware
app.use("*", async (c, next) => {
  const requestId = crypto.randomUUID();
  // Log request details
  console.log(`[Request-${requestId}] Path: ${c.req.path}`);
  console.log(`[Request-${requestId}] Origin: ${c.req.header("origin") || "No origin"}`);
  console.log(`[Request-${requestId}] Headers:`, Object.fromEntries(c.req.raw.headers.entries()));

  await next();

  // Log response details
  console.log(`[Response-${requestId}] Headers:`, Object.fromEntries(c.res.headers.entries()));

  // Try to log response body if it exists and is JSON or text
  const contentType = c.res.headers.get("content-type");
  console.log(`content type - ${requestId}: ${contentType}`);
  if (contentType) {
    if (contentType.includes("application/json")) {
      const clone = c.res.clone();
      const body = await clone.json();
      console.log(`[Response-${requestId}] Body:`, body);
    } else if (contentType.includes("text")) {
      const clone = c.res.clone();
      const body = await clone.text();
      console.log(`[Response-${requestId}] Body:`, body);
    } else {
      console.log(`[Response-${requestId}] weird content type: ${contentType}`);
    }
  }
});

// DB and Auth middleware
app.use("*", async (c, next) => {
  c.set("DrizzleDB", createDb(c.env.DB));
  c.set("auth", getAuth({ BETTER_AUTH_SECRET: c.env.BETTER_AUTH_SECRET, BASE_BETTER_AUTH_URL: c.env.BASE_BETTER_AUTH_URL, drizzleDB: c.get("DrizzleDB") }));
  await next();
});

app.on(["POST", "GET"], "/api/auth/**", (c) => {
  return c
    .get("auth")
    .handler(c.req.raw)
    .then((res) => {
      c.var.auth.api.getSession;
      return res;
    })
    .catch((err) => {
      return c.json({ error: "Unauthorized" }, 401);
    });
});

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

const rpcRouter = app.route("/api/super-heroes", superHeroesRoutes);

export default {
  fetch: app.fetch,
};

export type AppType = typeof rpcRouter;
