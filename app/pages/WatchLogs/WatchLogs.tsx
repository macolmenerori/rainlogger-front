import type { Route } from './+types/WatchLogs';

export function meta(_args: Route.MetaArgs) {
  return [
    { title: 'Watch Logs - Rainlogger' },
    { name: 'description', content: 'View and browse rainfall log entries.' }
  ];
}

export default function WatchLogs() {
  return <div>Watch Logs</div>;
}
