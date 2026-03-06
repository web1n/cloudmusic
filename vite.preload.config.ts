import { defineConfig } from 'vite';

// https://vitejs.dev/config
export default defineConfig({
    define: {
        'process.env.SAVE_RESOURCES': JSON.stringify(process.env.SAVE_RESOURCES)
    }
});
