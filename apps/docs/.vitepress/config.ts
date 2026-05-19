import { defineConfig } from 'vitepress';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const coreSrcDir = path.resolve(__dirname, '../../../packages/core/src');

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'formatted-number-input',
  description: 'React Native-compatible number input component',
  base: '/formatted-number-input/',
  ignoreDeadLinks: true,
  vite: {
    resolve: {
      alias: {
        'react-native': 'react-native-web',
        'react-native$': 'react-native-web',
        'formatted-number-input': coreSrcDir,
      },
    },
    optimizeDeps: {
      include: ['react-native-web'],
      exclude: ['react-native'],
    },
    define: {
      __DEV__: JSON.stringify(true),
    },
  },
  themeConfig: {
    nav: [
      { text: 'Guide', link: '/guide/getting-started' },
      { text: 'API', link: '/api/props' },
      { text: 'Web Demo', link: '/web' },
      { text: 'Snack Demo', link: '/guide/expo-snack' },
    ],
    sidebar: [
      {
        text: 'Guide',
        items: [
          { text: 'Getting started', link: '/guide/getting-started' },
          { text: 'Display modes', link: '/guide/display-modes' },
          { text: 'Nuances', link: '/guide/nuances' },
          { text: 'Web demo', link: '/web' },
          { text: 'Expo Snack', link: '/guide/expo-snack' },
        ],
      },
      {
        text: 'API',
        items: [
          { text: 'Props', link: '/api/props' },
        ],
      },
    ],
    socialLinks: [
      { icon: 'github', link: 'https://github.com/brianephraim/formatted-number-input' },
    ],
  },
});
