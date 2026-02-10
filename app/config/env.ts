export const env = {
  baseUrlAuth: import.meta.env.BASE_URL_AUTH,
  baseUrlRainlogger: import.meta.env.BASE_URL_RAINLOGGER,
  nodeEnv: import.meta.env.NODE_ENV,
  isDevelopment: import.meta.env.DEV,
  isProduction: import.meta.env.PROD,
  locationNames: import.meta.env.LOCATION_NAMES?.split(',') ?? []
} as const;
