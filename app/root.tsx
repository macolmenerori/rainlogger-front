// Initialize i18n (side-effect import must be first)
import { Outlet } from 'react-router';

import './ui/i18n/i18n';

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

import { UserProvider } from '@/context/UserContext/UserContext';
import { ErrorBoundary } from '@/ui/ErrorBoundary/ErrorBoundary';
import { Layout } from '@/ui/Layout/Layout';
import { ThemeProvider } from '@/ui/theme/ThemeContext';

// Re-export Layout and ErrorBoundary
export { ErrorBoundary, Layout };

export default function App() {
  return (
    <ThemeProvider>
      <UserProvider>
        <Outlet />
      </UserProvider>
    </ThemeProvider>
  );
}
