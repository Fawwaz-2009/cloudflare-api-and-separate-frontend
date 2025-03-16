import { betterAuth } from "better-auth";
import { DrizzleDB, schema } from "../db";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { TRUSTED_ORIGINS } from "./constants";

export const getAuth = ({ BETTER_AUTH_SECRET, drizzleDB, BASE_BETTER_AUTH_URL }: { BETTER_AUTH_SECRET: string; BASE_BETTER_AUTH_URL: string; drizzleDB: DrizzleDB }) =>
  betterAuth({
    baseURL: BASE_BETTER_AUTH_URL,
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
    advanced: {
      crossSubDomainCookies: {
        enabled: true,
      },
    },
  });
