/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SERVER_URL: string;
  readonly VITE_BETTER_AUTH_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
} 