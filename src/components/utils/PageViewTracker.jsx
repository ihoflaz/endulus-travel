import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { captureUtm } from '../../lib/utm';
import { initAnalytics, trackPageView } from '../../lib/analytics';

// Listens for route changes and:
//   1. Captures any UTM/click-ids on the current URL
//   2. Lazy-initializes Pixel/GTM/GA4 (only once)
//   3. Fires a page_view event
//
// Mount this once near the root of the app, inside <BrowserRouter>.
const PageViewTracker = () => {
  const location = useLocation();

  useEffect(() => {
    initAnalytics();
  }, []);

  useEffect(() => {
    captureUtm();
    trackPageView(location.pathname + location.search);
  }, [location.pathname, location.search]);

  return null;
};

export default PageViewTracker;
