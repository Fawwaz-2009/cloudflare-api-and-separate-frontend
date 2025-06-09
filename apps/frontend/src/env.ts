// src/env.mjs
import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const env = createEnv({
  /*
   * Serverside Environment variables, not available on the client.
   * Will throw if you access these variables on the client.
   */
  server: {},
  /*
   * Environment variables available on the client (and server).
   *
   * 💡 You'll get type errors if these are not prefixed with NEXT_PUBLIC_.
   */
  clientPrefix: "VITE_",
  client: {
    VITE_SERVER_URL: z.string().min(1),
    VITE_BETTER_AUTH_URL: z.string().min(1),
  },
  /*
   * Due to how Next.js bundles environment variables on Edge and Client,
   * we need to manually destructure them to make sure all are included in bundle.
   *
   * 💡 You'll get type errors if not all variables from `server` & `client` are included here.
   */
  runtimeEnv: {
    VITE_SERVER_URL: process.env.VITE_SERVER_URL || import.meta.env.VITE_SERVER_URL,
    VITE_BETTER_AUTH_URL: process.env.VITE_BETTER_AUTH_URL || import.meta.env.VITE_BETTER_AUTH_URL,
  },
});
