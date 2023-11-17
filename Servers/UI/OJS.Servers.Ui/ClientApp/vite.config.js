/* eslint-disable import/no-unused-modules */
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
// eslint-disable-next-line import/no-extraneous-dependencies
import svgr from 'vite-plugin-svgr';
/// <reference types="vite-plugin-svgr/client" />

export default defineConfig({
    plugins: [
        react(),
        svgr(),
    ],
    server: { port: 5002 },
});
