import { FC, lazy, LazyExoticComponent, Suspense } from 'react';
import { isMobile } from 'react-device-detect';
import LoadingScreen from './components/LoadingScreen';
import { Navigate } from 'react-router-dom';


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
    element: (isMobile) ? (
      <Navigate to="/report" />
    ) : (
      <Navigate to="/camera" />
    )
  }, {
    path: '/camera',
    element: (isMobile) ? (
      <Navigate to="/report" />
    ) : (
      <Camera />
    ),
  }, {
    path: '/report',
    element: (isMobile) ? (
      <Report />
    ) : (
      <Navigate to="/camera" />
    )
  }, {
    path: '*',
    element: <Error />
  }
];

export default routes;