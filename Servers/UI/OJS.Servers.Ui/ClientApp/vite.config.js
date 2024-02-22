import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import svgr from 'vite-plugin-svgr';
/// <reference types="vite-plugin-svgr/client" />

export default defineConfig({
    plugins: [
        react(),
        svgr(),
    ],
    server: { port: 5002 },
});
