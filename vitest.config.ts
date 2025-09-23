import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['tests/**/*.test.ts'],
    exclude: ['node_modules', 'dist'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: ['src/**/*.ts'],
      exclude: ['src/**/*.d.ts', 'src/**/*.test.ts'],
      all: true,
      ignoreEmptyLines: true,
      skipFull: false,
      perFile: true,
      clean: true,
      cleanOnRerun: true,
      thresholds: {
        global: {
          branches: 0,
          functions: 0,
          lines: 0,
          statements: 0
        }
      }
    },
  },
  resolve: {
    alias: {
      '@': './src',
    },
  },
});

