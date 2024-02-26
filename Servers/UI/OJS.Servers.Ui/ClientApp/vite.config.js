import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import svgr from 'vite-plugin-svgr';
/// <reference types="vite-plugin-svgr/client" />

export default defineConfig({
    build: {
        rollupOptions: {
        onwarn(warning, warn) {
          if (warning.code === 'MODULE_LEVEL_DIRECTIVE') {
            return
          }
          warn(warning)
        }}
      },
    plugins: [
        react(),
        svgr(),
    ],
    server: { port: 5002 },
});
