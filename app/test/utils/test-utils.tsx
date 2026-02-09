import type { ReactElement } from 'react';
import { MemoryRouter } from 'react-router';

import type { RenderOptions } from '@testing-library/react';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { UserProvider } from '@/context/UserContext/UserContext';
import { ThemeProvider } from '@/ui/theme/ThemeContext';

function AllProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <UserProvider>
        <MemoryRouter>{children}</MemoryRouter>
      </UserProvider>
    </ThemeProvider>
  );
}

function customRender(ui: ReactElement, options?: Omit<RenderOptions, 'wrapper'>) {
  return render(ui, { wrapper: AllProviders, ...options });
}

// Re-export everything from @testing-library/react
export * from '@testing-library/react';

// Override the default render with the custom one
export { customRender as render };

// Export userEvent setup helper
export { userEvent };

// Export i18n for use in test assertions
export { default as i18n } from '@/ui/i18n/i18n';
