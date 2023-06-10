import { FC, lazy, LazyExoticComponent, Suspense } from 'react';
import { BrowserView, MobileView } from 'react-device-detect';
import LoadingScreen from './components/LoadingScreen';


const loadable = (Component: LazyExoticComponent<FC>) => (props: any) => (
  <Suspense fallback={<LoadingScreen />}>
    <Component {...props} />
  </Suspense>
);

const Camera = loadable(lazy(() => import('./pages/Camera')));
const Report = loadable(lazy(() => import('./pages/Report')));
const Error = loadable(lazy(() => import('./pages/404')));

const routes = [
  {
    exact: true,
    path: '/',
    element: (
      <>
        <BrowserView>
          <Camera />
        </BrowserView>
        <MobileView>
          <Report />
        </MobileView>
      </>
    )
  }, {
    path: '*',
    element: <Error />
  }
];

export default routes;