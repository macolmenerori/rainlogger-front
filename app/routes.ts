import { index, layout, route, type RouteConfig } from '@react-router/dev/routes';

export default [
  route('login', './pages/Login/Login.tsx'),
  layout('./ui/AuthGuard/AuthGuard.tsx', [
    index('./pages/MainPage/MainPage.tsx'),
    route('newlog', './pages/NewLog/NewLog.tsx'),
    route('watchlogs', './pages/WatchLogs/WatchLogs.tsx')
  ])
] satisfies RouteConfig;
