import { defineConfig } from 'vite';
import { resolve } from 'path';

// https://vitejs.dev/config
export default defineConfig({
    resolve: {
        alias: {
            '~bootstrap': resolve(__dirname, 'node_modules/bootstrap'),
        }
    },
    build: {
        rollupOptions: {
            input: {
                about: resolve(__dirname, 'about.html'),
                main: resolve(__dirname, 'index.html'),
                404: resolve(__dirname, '404.html'),
            }
        }
    }
});
