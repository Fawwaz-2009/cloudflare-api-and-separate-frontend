// Environment variable helper for client and server
function getEnv(key: string): string | undefined {
  // Client-side: Use import.meta.env for VITE_ prefixed variables
  return process.env[key] || import.meta.env[key];
}

export const env = {
  VITE_SERVER_URL: getEnv("VITE_SERVER_URL"),
  VITE_BETTER_AUTH_URL: getEnv("VITE_BETTER_AUTH_URL"),
};
