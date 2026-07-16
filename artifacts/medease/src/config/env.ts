export const env = {
  baseUrl: import.meta.env.BASE_URL.replace(/\/$/, ''),
  isDev: import.meta.env.DEV,
  isProd: import.meta.env.PROD,
} as const;
