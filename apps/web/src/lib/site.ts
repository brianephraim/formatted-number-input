export type PageId =
  | 'home'
  | 'guide-getting-started'
  | 'guide-display-modes'
  | 'guide-nuances'
  | 'guide-expo-snack'
  | 'api-props'
  | 'web-demo';

export function sitePath(path = '') {
  return `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}`;
}

export function getCurrentPageId(): PageId {
  const page = document.body.dataset.page as PageId | undefined;
  return page ?? 'home';
}

export function getPageTitle(pageId: PageId) {
  switch (pageId) {
    case 'home':
      return 'formatted-number-input';
    case 'guide-getting-started':
      return 'Getting started';
    case 'guide-display-modes':
      return 'Display modes';
    case 'guide-nuances':
      return 'Nuances and edge cases';
    case 'guide-expo-snack':
      return 'Expo Snack';
    case 'api-props':
      return 'Props';
    case 'web-demo':
      return 'Web Demo';
  }
}

export function getPageDescription(pageId: PageId) {
  switch (pageId) {
    case 'home':
      return 'Drop-in formatted number input for React and React Native.';
    case 'guide-getting-started':
      return 'Install and use formatted-number-input on web and React Native.';
    case 'guide-display-modes':
      return 'Understand overlay mode and live formatting mode.';
    case 'guide-nuances':
      return 'Edge cases, parsing behavior, and platform differences.';
    case 'guide-expo-snack':
      return 'Live Expo Snack demo built from repository source files.';
    case 'api-props':
      return 'API reference for FormattedNumberInput and FormattedNumberInputHtmlLike.';
    case 'web-demo':
      return 'Interactive browser playground for formatted-number-input.';
  }
}
