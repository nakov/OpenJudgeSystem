/* eslint-disable import/no-unused-modules */
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
// eslint-disable-next-line import/no-extraneous-dependencies
import monacoEditorPlugin from 'vite-plugin-monaco-editor';

export default defineConfig({
    plugins: [
        react(),
        // monacoEditorPlugin({ languages: [ 'python', 'javascript', 'csharp', 'java', 'cpp', 'go', 'php' ] }),
    ],
    server: { port: 5002 },
});
