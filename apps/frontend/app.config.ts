import { defineConfig } from "@tanstack/react-start/config";
import tsConfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  server: {
    preset: "vercel",
  },
  tsr: {
    appDirectory: "src",
  },
  vite: {
    plugins: [
      tsConfigPaths({
        projects: ["./tsconfig.json"],
      }),
    ],
    define: {
      // Make Vercel environment variables available during build
      VITE_SERVER_URL: JSON.stringify(process.env.VITE_SERVER_URL),
      VITE_BETTER_AUTH_URL: JSON.stringify(process.env.VITE_BETTER_AUTH_URL),
    },
  },
});
