import react from '@vitejs/plugin-react';
import viteTsconfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [react(), viteTsconfigPaths()],
  define: {
    'import.meta.env.BASE_URL_AUTH': JSON.stringify('http://localhost:3000/api'),
    'import.meta.env.NODE_ENV': JSON.stringify('test')
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./app/test/setup.ts'],
    include: ['app/test/**/*.test.{ts,tsx}'],
    css: false,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov', 'html'],
      include: ['app/**/*.{ts,tsx}'],
      exclude: ['app/test/**', 'app/types/**', 'app/**/*.d.ts', 'app/routes.ts', 'app/root.tsx']
    }
  }
});
