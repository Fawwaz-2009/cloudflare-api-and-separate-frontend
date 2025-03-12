import { betterAuth } from "better-auth";
import { DrizzleDB, schema } from "../db";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { TRUSTED_ORIGINS } from "./constants";
import { createAuthMiddleware } from "better-auth/api";

function parseCookies(cookieHeader: string) {
	const cookies = cookieHeader.split(";");
	const cookieMap = new Map<string, string>();

	cookies.forEach((cookie) => {
		const [name, value] = cookie.trim().split("=");
		cookieMap.set(name, decodeURIComponent(value));
	});
	return Object.fromEntries(cookieMap.entries());
}

export const getAuth = ({ BETTER_AUTH_SECRET, drizzleDB }: { BETTER_AUTH_SECRET: string; drizzleDB: DrizzleDB }) =>
  betterAuth({
    secret: BETTER_AUTH_SECRET,
    trustedOrigins: TRUSTED_ORIGINS,
    database: drizzleAdapter(drizzleDB, {
      provider: "sqlite",
      schema,
    }),
    emailAndPassword: {
      enabled: true,
    },
    onAPIError: {
      throw: true,
      onError: (error, ctx) => {
        // Custom error handling
        console.error("Auth error:", error);
      },
    },
    hooks: {
      before: createAuthMiddleware(async (ctx) => {
        console.log(ctx, "BEFORE__________________");
        const sessionCookieToken = await ctx.getSignedCookie(
					ctx.context.authCookies.sessionToken.name,
          ctx.context.secret,
        );
        console.log(sessionCookieToken, "SESSION_COOKIE_TOKEN_BEFORE__________________");
        const cookies = parseCookies(ctx.request?.headers.get("Cookie") || "");
        console.log(JSON.stringify(cookies), "COOKIES_BEFORE__________________");
        const session = sessionCookieToken ? await ctx.context.internalAdapter.findSession(sessionCookieToken) : null;
        console.log(session, "SESSION_BEFORE__________________");
      }),
      after: createAuthMiddleware(async (ctx) => {
        console.log(ctx, "AFTER__________________");
        const sessionCookieToken = await ctx.getSignedCookie(
          ctx.context.authCookies.sessionToken.name,
          ctx.context.secret,
        );
        const session = sessionCookieToken ? await ctx.context.internalAdapter.findSession(sessionCookieToken) : null;
        console.log(session, "SESSION_AFTER__________________");
        console.log(sessionCookieToken, "SESSION_COOKIE_TOKEN_AFTER__________________");
        console.log(ctx.context.authCookies.sessionToken.name, "SESSION_COOKIE_NAME_AFTER__________________");
        console.log(ctx.context.secret, "SESSION_COOKIE_SECRET_AFTER__________________");
        const cookies = parseCookies(ctx.request?.headers.get("Cookie") || "");
        console.log(JSON.stringify(cookies), "COOKIES_AFTER__________________");
      }),
    },
  });
