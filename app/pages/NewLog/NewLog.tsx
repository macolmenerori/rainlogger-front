import type { Route } from './+types/NewLog';

export function meta(_args: Route.MetaArgs) {
  return [
    { title: 'New Log - Rainlogger' },
    { name: 'description', content: 'Create a new rainfall log entry.' }
  ];
}

export default function NewLog() {
  return <div>New Log</div>;
}
