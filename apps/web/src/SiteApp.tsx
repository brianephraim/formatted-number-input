import SiteLayout from './components/SiteLayout';
import { getCurrentPageId, getPageDescription, getPageTitle } from './lib/site';
import ApiPropsPage from './pages/ApiPropsPage';
import DisplayModesPage from './pages/DisplayModesPage';
import ExpoSnackPage from './pages/ExpoSnackPage';
import GettingStartedPage from './pages/GettingStartedPage';
import HomePage from './pages/HomePage';
import NuancesPage from './pages/NuancesPage';
import WebDemoPage from './pages/WebDemoPage';

export default function SiteApp() {
  const pageId = getCurrentPageId();
  const title = getPageTitle(pageId);
  const description = getPageDescription(pageId);

  let content: JSX.Element;
  let currentPath: string;

  switch (pageId) {
    case 'guide-getting-started':
      content = <GettingStartedPage />;
      currentPath = 'guide/getting-started.html';
      break;
    case 'guide-display-modes':
      content = <DisplayModesPage />;
      currentPath = 'guide/display-modes.html';
      break;
    case 'guide-nuances':
      content = <NuancesPage />;
      currentPath = 'guide/nuances.html';
      break;
    case 'guide-expo-snack':
      content = <ExpoSnackPage />;
      currentPath = 'guide/expo-snack.html';
      break;
    case 'api-props':
      content = <ApiPropsPage />;
      currentPath = 'api/props.html';
      break;
    case 'web-demo':
      content = <WebDemoPage />;
      currentPath = 'web.html';
      break;
    case 'home':
    default:
      content = <HomePage />;
      currentPath = '';
      break;
  }

  return (
    <SiteLayout
      title={title}
      description={description}
      currentPath={currentPath}
    >
      {content}
    </SiteLayout>
  );
}
