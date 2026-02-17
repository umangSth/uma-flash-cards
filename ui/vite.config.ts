import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({mode}) => {
    return {
        base: '/zz/space/uma-flash-cards/',
        plugins: [
            react()
        ]
    }
})