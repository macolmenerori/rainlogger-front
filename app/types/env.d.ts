/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly BASE_URL_AUTH: string;
  readonly BASE_URL_RAINLOGGER: string;
  readonly NODE_ENV: string;
  readonly LOCATION_NAMES: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
