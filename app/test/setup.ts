import { afterAll, afterEach, beforeAll, vi } from 'vitest';

import '@testing-library/jest-dom/vitest';
import '@/ui/i18n/i18n';

import { server } from './mocks/server';

// Start MSW server before all tests
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));

// Reset handlers after each test (cleanup is handled automatically by vitest)
afterEach(() => {
  server.resetHandlers();
});

// Close MSW server after all tests
afterAll(() => server.close());

// Mock window.matchMedia (required by MUI's useMediaQuery hook)
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn()
  }))
});
