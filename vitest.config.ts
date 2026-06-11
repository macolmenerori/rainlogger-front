import react from '@vitejs/plugin-react';
import viteTsconfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [react(), viteTsconfigPaths()],
  resolve: {
    alias: {
      // MUI v9.1.0 imports 'react-transition-group/TransitionGroupContext' (bare subpath)
      // but RTG 4.x has no `exports` field, so Node ESM can't resolve the directory import.
      // Map it explicitly to the ESM file so vitest can load @mui/material transitions.
      'react-transition-group/TransitionGroupContext':
        'react-transition-group/esm/TransitionGroupContext.js'
    }
  },
  define: {
    'import.meta.env.BASE_URL_AUTH': JSON.stringify('http://localhost:3000/api'),
    'import.meta.env.BASE_URL_RAINLOGGER': JSON.stringify('http://localhost:3000/rainlogger-api'),
    'import.meta.env.NODE_ENV': JSON.stringify('test'),
    'import.meta.env.LOCATION_NAMES': JSON.stringify('Castraz,Salamanca'),
    __APP_VERSION__: JSON.stringify('0.0.0-test')
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./app/test/setup.ts'],
    include: ['app/**/*.test.{ts,tsx}'],
    css: false,
    server: {
      deps: {
        // MUI v9.1.0 imports 'react-transition-group/TransitionGroupContext' (bare subpath).
        // RTG 4.x has no `exports` field so Node ESM can't resolve directory imports.
        // Inlining @mui/material forces it through Vite's resolver which handles the
        // subdirectory package.json `module` field correctly.
        inline: [/@mui\/material/]
      }
    },
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov', 'html'],
      include: ['app/**/*.{ts,tsx}'],
      exclude: ['app/test/**', 'app/types/**', 'app/**/*.d.ts', 'app/routes.ts', 'app/root.tsx']
    }
  }
});
