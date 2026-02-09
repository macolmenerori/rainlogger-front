export const env = {
  baseUrlAuth: import.meta.env.BASE_URL_AUTH,
  nodeEnv: import.meta.env.NODE_ENV,
  isDevelopment: import.meta.env.DEV,
  isProduction: import.meta.env.PROD
} as const;
