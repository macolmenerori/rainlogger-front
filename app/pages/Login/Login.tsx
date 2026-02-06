import type { Route } from './+types/Login';

export function meta(_args: Route.MetaArgs) {
  return [
    { title: 'Login - Rainlogger' },
    { name: 'description', content: 'Log in to your Rainlogger account.' }
  ];
}

export default function Login() {
  return <div>Login</div>;
}
