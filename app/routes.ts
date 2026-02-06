import { index, route, type RouteConfig } from '@react-router/dev/routes';

export default [
  index('./pages/MainPage/MainPage.tsx'),
  route('newlog', './pages/NewLog/NewLog.tsx'),
  route('watchlogs', './pages/WatchLogs/WatchLogs.tsx'),
  route('login', './pages/Login/Login.tsx')
] satisfies RouteConfig;
