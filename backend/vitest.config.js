import { defineConfig } from 'vitest/config';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';

export default defineConfig({
  plugins: [vue()],
  test: {
    // Test environment
    environment: 'jsdom',
    globals: true,
    
    // Test discovery
    include: ['src/**/*.{test,spec}.js'],
    
    // Coverage configuration
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      exclude: [
        'node_modules/',
        'src/main.js',
        '**/*.config.js',
      ],
      lines: 70,
      functions: 70,
      branches: 70,
      statements: 70,
    },
    
    // Test timeout
    testTimeout: 10000,
    
    // Setup files
    setupFiles: ['./src/test/setup.js'],
  },
  
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
});
