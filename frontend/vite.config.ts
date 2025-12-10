import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [react()],
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    target: 'esnext',
    outDir: 'dist',
  },
  server: {
    host: true,
    port: 3000,
    strictPort: true,
    open: false,
    allowedHosts: true, // Разрешаем доступ по любым хостам (для Docker)

    // 👇 ГЛАВНАЯ ЧАСТЬ: ПРОКСИРОВАНИЕ ЗАПРОСОВ НА БЭКЕНД
    proxy: {
      '/api': {
        target: 'http://web:8000', // 'web' - это имя сервиса Django в docker-compose
        changeOrigin: true,
        secure: false,
      },
      // Также проксируем пути авторизации (Allauth)
      '/accounts': {
        target: 'http://web:8000',
        changeOrigin: true,
        secure: false,
      }
    },
  },
});