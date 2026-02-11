import { defineConfig } from 'vitepress';

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'rn-number-input',
  description: 'React Native-compatible number input component',
  base: '/react-fancy-number-input/',
  ignoreDeadLinks: true,
  themeConfig: {
    nav: [
      { text: 'Guide', link: '/guide/getting-started' },
      { text: 'API', link: '/api/props' },
    ],
    sidebar: [
      {
        text: 'Guide',
        items: [
          { text: 'Getting started', link: '/guide/getting-started' },
          { text: 'Display modes', link: '/guide/display-modes' },
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
      { icon: 'github', link: 'https://github.com/brianephraim/react-fancy-number-input' },
    ],
  },
});
