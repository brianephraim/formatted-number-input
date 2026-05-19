import DefaultTheme from 'vitepress/theme';
import type { Theme } from 'vitepress';
import PageQrCode from './components/PageQrCode.vue';
import SnackEmbed from './components/SnackEmbed.vue';
import WebDemoMount from './components/WebDemoMount.vue';

const theme: Theme = {
  ...DefaultTheme,
  enhanceApp({ app }) {
    app.component('PageQrCode', PageQrCode);
    app.component('SnackEmbed', SnackEmbed);
    app.component('WebDemoMount', WebDemoMount);
  },
};

export default theme;
