/* eslint-disable import/no-unused-modules */
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
// eslint-disable-next-line import/no-extraneous-dependencies

export default defineConfig({
    plugins: [
        react(),
    ],
    server: { port: 5002 },
});
