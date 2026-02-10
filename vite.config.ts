import { reactRouter } from '@react-router/dev/vite';
import viteTsconfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from 'vite';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

export default defineConfig({
  plugins: [reactRouter(), viteTsconfigPaths()],
  server: {
    port: 3000,
    open: false,
    host: true
  },
  preview: {
    port: 3000
  },
  build: {
    outDir: 'dist',
    sourcemap: false
  },
  publicDir: 'public',
  define: {
    'import.meta.env.BASE_URL_AUTH': JSON.stringify(process.env.BASE_URL_AUTH),
    'import.meta.env.BASE_URL_RAINLOGGER': JSON.stringify(process.env.BASE_URL_RAINLOGGER),
    'import.meta.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
  }
});
