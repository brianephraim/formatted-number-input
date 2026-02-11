import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';

// react-native-web setup for Vite
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      'react-native': 'react-native-web',
      'react-native$': 'react-native-web',
      // Import package source directly for fast iteration
      '@formatted-number-input/core': path.resolve(__dirname, '../../packages/core/src')
    },
    extensions: ['.web.tsx', '.web.ts', '.tsx', '.ts', '.jsx', '.js']
  },
  optimizeDeps: {
    include: ['react-native-web'],
    exclude: ['react-native']
  },
  define: {
    __DEV__: JSON.stringify(true)
  }
});
