import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import svgr from 'vite-plugin-svgr';
import { visualizer } from "rollup-plugin-visualizer";
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
        visualizer({ open: true, filename: 'bundle-analysis.html' }),
    ],
    server: { port: 5002 },
});
