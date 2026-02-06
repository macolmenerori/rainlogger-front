import type { Route } from './+types/MainPage';

export function meta(_args: Route.MetaArgs) {
  return [
    { title: 'Rainlogger' },
    { name: 'description', content: 'Log rainfall amounts accurately with Rainlogger.' }
  ];
}

export default function MainPage() {
  return <div>Rainlogger</div>;
}
