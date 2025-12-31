import { RouterProvider } from 'react-router-dom';

// routing
import router from 'routes';

// project imports
import NavigationScroll from 'layout/NavigationScroll';
import PWAInstallPrompt from 'ui-component/PWAInstallPrompt';

import ThemeCustomization from 'themes';

// auth provider

// ==============================|| APP ||============================== //

export default function App() {
  return (
    <ThemeCustomization>
      <NavigationScroll>
        <>
          <RouterProvider router={router} />
          <PWAInstallPrompt />
        </>
      </NavigationScroll>
    </ThemeCustomization>
  );
}
