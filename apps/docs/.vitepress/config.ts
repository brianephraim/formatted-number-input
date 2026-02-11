import { defineConfig } from 'vitepress';

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'formatted-number-input',
  description: 'React Native-compatible number input component',
  base: '/formatted-number-input/',
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
          { text: 'Nuances', link: '/guide/nuances' },
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
