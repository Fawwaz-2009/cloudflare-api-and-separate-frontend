import { betterAuth } from "better-auth";
import { DrizzleDB, schema } from "../db";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { TRUSTED_ORIGINS } from "./constants";

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
  });
