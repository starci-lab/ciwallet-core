import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';
import inject from '@rollup/plugin-inject';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    inject({
      Buffer: ['buffer', 'Buffer'],
    }),
  ],
  resolve: {
    alias: {
      '@ciwallet-sdk/types': path.resolve(__dirname, './packages/types'),
      '@ciwallet-sdk/components': path.resolve(
        __dirname,
        './packages/components',
      ),
      '@ciwallet-sdk/providers': path.resolve(
        __dirname,
        './packages/providers',
      ),
      '@ciwallet-sdk/utils': path.resolve(__dirname, './packages/utils'),
      '@ciwallet-sdk/classes': path.resolve(__dirname, './packages/classes'),
      '@ciwallet-sdk/hooks': path.resolve(__dirname, './packages/hooks'),
      '@ciwallet-sdk/misc': path.resolve(__dirname, './packages/misc'),
      '@ciwallet-sdk/constants': path.resolve(
        __dirname,
        './packages/constants',
      ),
      '@ciwallet-sdk/abi': path.resolve(__dirname, './packages/abi'),
      '@ciwallet-sdk/contracts': path.resolve(
        __dirname,
        './packages/contracts',
      ),
      '@': path.resolve(__dirname, './src'),
    },
  },
});
