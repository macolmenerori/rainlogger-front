import { readFileSync } from 'node:fs';

import { reactRouter } from '@react-router/dev/vite';
import viteTsconfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

const pkg = JSON.parse(readFileSync('./package.json', 'utf-8')) as {
  version: string;
};

export default defineConfig({
  resolve: {
    alias: {
      // MUI v9.1.0 imports 'react-transition-group/TransitionGroupContext' (bare subpath).
      // RTG 4.x has no `exports` field so Node ESM can't resolve directory imports.
      // Alias to the explicit ESM file; ssr.noExternal ensures the server build
      // routes MUI through Vite's resolver where this alias applies.
      'react-transition-group/TransitionGroupContext':
        'react-transition-group/esm/TransitionGroupContext.js'
    }
  },
  ssr: {
    // Force @mui/material to be bundled (not externalized) in the server build so
    // Vite's resolver handles the react-transition-group subpath lookup correctly.
    noExternal: ['@mui/material']
  },
  plugins: [
    reactRouter(),
    viteTsconfigPaths(),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: false,
      manifest: false,
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff,woff2}'],
        navigateFallback: '/index.html',
        navigateFallbackDenylist: [/^\/api/, /^\/rainlogger-api/]
      },
      devOptions: {
        enabled: true,
        type: 'module'
      }
    })
  ],
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
    'import.meta.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
    'import.meta.env.LOCATION_NAMES': JSON.stringify(process.env.LOCATION_NAMES),
    __APP_VERSION__: JSON.stringify(pkg.version)
  }
});
