import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  // Le même alias que tsconfig. Sans lui, tout module applicatif important
  // `@/...` est hors de portée des tests, ce qui pousse à ne tester que les
  // modules feuilles — soit exactement ceux qui cassent le moins.
  resolve: {
    alias: { '@': fileURLToPath(new URL('.', import.meta.url)) },
  },
  test: {
    environment: 'node',
    include: ['tests/**/*.test.ts'],
  },
});
