/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly BASE_URL_AUTH: string;
  readonly NODE_ENV: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
