import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  test: {
    projects: [
      {
        extends: true,
        test: {
          name: 'web',
          environment: 'jsdom',
          include: ['src/**/__tests__/**/*.test.{ts,tsx}'],
          setupFiles: ['./src/test/setup.ts'],
          env: { VITE_API_URL: 'https://hub.test/api/forms' },
        },
      },
      {
        extends: true,
        test: {
          name: 'server',
          environment: 'node',
          include: ['server/**/__tests__/**/*.test.js'],
        },
      },
    ],
  },
});
