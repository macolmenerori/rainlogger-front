// Initialize i18n (side-effect import must be first)
import { Outlet } from 'react-router';

import './ui/i18n/i18n';

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

import ServiceWorkerRegistration from '@/components/ServiceWorkerRegistration/ServiceWorkerRegistration';
import { AlertProvider } from '@/context/AlertContext/AlertContext';
import { UserProvider } from '@/context/UserContext/UserContext';
import { ErrorBoundary } from '@/ui/ErrorBoundary/ErrorBoundary';
import { Layout } from '@/ui/Layout/Layout';
import { ThemeProvider } from '@/ui/theme/ThemeContext';

// Re-export Layout and ErrorBoundary
export { ErrorBoundary, Layout };

export function HydrateFallback() {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: '#1a2332'
      }}
    />
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AlertProvider>
        <UserProvider>
          <ServiceWorkerRegistration />
          <Outlet />
        </UserProvider>
      </AlertProvider>
    </ThemeProvider>
  );
}
