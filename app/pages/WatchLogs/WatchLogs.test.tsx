import { type UserEvent } from '@testing-library/user-event';
import { http, HttpResponse } from 'msw';

import WatchLogs from '@/pages/WatchLogs/WatchLogs';
import rainMonthlyData from '@/test/mocks/mockData/rainMontlyData.json';
import { server } from '@/test/mocks/server';
import { i18n, render, screen, userEvent, waitFor, within } from '@/test/utils/test-utils';
import { tokenStorage } from '@/utils/tokenStorage';

async function submitFilters(user: UserEvent) {
  const searchButton = screen.getByText(i18n.t('pages.watchLogs.filters.submitButton'));
  await user.click(searchButton);
}

async function submitAndWaitForData(user: UserEvent) {
  await submitFilters(user);
  await waitFor(() => {
    expect(screen.getByText(i18n.t('pages.watchLogs.tabs.table'))).toBeInTheDocument();
  });
}

describe('WatchLogs', () => {
  beforeEach(() => {
    tokenStorage.setToken('fake-jwt-token');
  });

  afterEach(() => {
    tokenStorage.removeToken();
  });

  describe('Rendering', () => {
    it('renders page title, back button, and filter form', () => {
      render(<WatchLogs />);

      expect(screen.getByText(i18n.t('pages.watchLogs.title'))).toBeInTheDocument();
      expect(screen.getByText(i18n.t('components.backButton.label'))).toBeInTheDocument();
      expect(
        screen.getByLabelText(i18n.t('pages.watchLogs.filters.monthLabel'))
      ).toBeInTheDocument();
      expect(
        screen.getByLabelText(i18n.t('pages.watchLogs.filters.yearLabel'))
      ).toBeInTheDocument();
      expect(
        screen.getByLabelText(i18n.t('pages.watchLogs.filters.locationLabel'))
      ).toBeInTheDocument();
      expect(
        screen.getByLabelText(i18n.t('pages.watchLogs.filters.realReadingLabel'))
      ).toBeInTheDocument();
      expect(screen.getByText(i18n.t('pages.watchLogs.filters.submitButton'))).toBeInTheDocument();
    });

    it('does not render tabs or data before submitting filters', () => {
      render(<WatchLogs />);

      expect(screen.queryByText(i18n.t('pages.watchLogs.tabs.table'))).not.toBeInTheDocument();
      expect(screen.queryByText(i18n.t('pages.watchLogs.tabs.calendar'))).not.toBeInTheDocument();
      expect(screen.queryByText(i18n.t('pages.watchLogs.tabs.graph'))).not.toBeInTheDocument();
      expect(
        screen.queryByText(i18n.t('pages.watchLogs.totalRainfall.label'))
      ).not.toBeInTheDocument();
    });
  });

  describe('Navigation', () => {
    it('back button links to home page', () => {
      render(<WatchLogs />);

      const backButton = screen.getByText(i18n.t('components.backButton.label')).closest('a');
      expect(backButton).toHaveAttribute('href', '/');
    });
  });

  describe('Data Fetching Flow', () => {
    it('submitting filters shows loading spinner then data', async () => {
      server.use(
        http.get(
          `${process.env.BASE_URL_RAINLOGGER}/v1/rainlogger/rainlog/filters`,
          async ({ request }) => {
            const authHeader = request.headers.get('Authorization');
            if (!authHeader || !authHeader.startsWith('Bearer ')) {
              return HttpResponse.json({ status: 'Unauthorized' }, { status: 401 });
            }
            await new Promise((resolve) => setTimeout(resolve, 100));
            return HttpResponse.json(rainMonthlyData);
          }
        )
      );

      const user = userEvent.setup();
      render(<WatchLogs />);

      await submitFilters(user);

      await waitFor(() => {
        expect(screen.getByRole('progressbar')).toBeInTheDocument();
      });

      await waitFor(
        () => {
          expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
          expect(screen.getByText(i18n.t('pages.watchLogs.tabs.table'))).toBeInTheDocument();
        },
        { timeout: 3000 }
      );
    });

    it('renders MonthlyRainfall summary after data loads', async () => {
      const user = userEvent.setup();
      render(<WatchLogs />);

      await submitAndWaitForData(user);

      expect(screen.getByText(i18n.t('pages.watchLogs.totalRainfall.label'))).toBeInTheDocument();
    });

    it('renders three tab labels with correct text', async () => {
      const user = userEvent.setup();
      render(<WatchLogs />);

      await submitAndWaitForData(user);

      expect(screen.getByText(i18n.t('pages.watchLogs.tabs.table'))).toBeInTheDocument();
      expect(screen.getByText(i18n.t('pages.watchLogs.tabs.calendar'))).toBeInTheDocument();
      expect(screen.getByText(i18n.t('pages.watchLogs.tabs.graph'))).toBeInTheDocument();
    });
  });

  describe('Tab Switching', () => {
    it('Table tab is active by default and shows table rows', async () => {
      const user = userEvent.setup();
      render(<WatchLogs />);

      await submitAndWaitForData(user);

      // Table headers visible
      expect(screen.getByText(i18n.t('pages.watchLogs.table.date'))).toBeInTheDocument();
      expect(screen.getByText(i18n.t('pages.watchLogs.table.amount'))).toBeInTheDocument();
      expect(screen.getByText(i18n.t('pages.watchLogs.table.actions'))).toBeInTheDocument();

      // Data rows present (header row + data rows)
      const rows = screen.getAllByRole('row');
      expect(rows.length).toBeGreaterThan(1);
    });

    it('switching to Calendar tab renders calendar', async () => {
      const user = userEvent.setup();
      render(<WatchLogs />);

      await submitAndWaitForData(user);

      const calendarTab = screen.getByText(i18n.t('pages.watchLogs.tabs.calendar'));
      await user.click(calendarTab);

      // Table should no longer be visible
      expect(screen.queryByText(i18n.t('pages.watchLogs.table.actions'))).not.toBeInTheDocument();

      // Calendar weekday headers should be visible
      expect(screen.getByText(i18n.t('pages.watchLogs.calendar.headers.mon'))).toBeInTheDocument();
    });

    it('switching to Graph tab hides table content', async () => {
      const user = userEvent.setup();
      render(<WatchLogs />);

      await submitAndWaitForData(user);

      const graphTab = screen.getByText(i18n.t('pages.watchLogs.tabs.graph'));
      await user.click(graphTab);

      // Table should no longer be visible
      expect(screen.queryByText(i18n.t('pages.watchLogs.table.actions'))).not.toBeInTheDocument();

      // Note: recharts doesn't render in jsdom without mocking ResponsiveContainer
      // Graph rendering is tested in GraphTab.test.tsx with proper mocks
    });

    it('switching back to Table tab shows table again', async () => {
      const user = userEvent.setup();
      render(<WatchLogs />);

      await submitAndWaitForData(user);

      // Switch to Calendar
      const calendarTab = screen.getByText(i18n.t('pages.watchLogs.tabs.calendar'));
      await user.click(calendarTab);

      // Switch back to Table
      const tableTab = screen.getByText(i18n.t('pages.watchLogs.tabs.table'));
      await user.click(tableTab);

      // Table should be visible again
      expect(screen.getByText(i18n.t('pages.watchLogs.table.actions'))).toBeInTheDocument();
      const rows = screen.getAllByRole('row');
      expect(rows.length).toBeGreaterThan(1);
    });
  });

  describe('Error Handling', () => {
    it('shows error alert when API fails', async () => {
      // Use 400 (non-retryable) to avoid retry delays
      server.use(
        http.get(`${process.env.BASE_URL_RAINLOGGER}/v1/rainlogger/rainlog/filters`, () => {
          return HttpResponse.json({ status: 'error', message: 'Bad request' }, { status: 400 });
        })
      );

      const user = userEvent.setup();
      render(<WatchLogs />);

      await submitFilters(user);

      // ApiError message from response is shown via onError callback
      await waitFor(
        () => {
          expect(screen.getByRole('alert')).toBeInTheDocument();
        },
        { timeout: 3000 }
      );
    });

    // Note: Network error test omitted because getRainLogsByMonth uses 3 retries
    // with exponential backoff (2s base), making it too slow for unit tests.
    // Network error handling is tested in useApi.test.tsx and apiClient.test.ts.
  });

  describe('Data Refresh', () => {
    it('table re-renders after successful delete', async () => {
      const user = userEvent.setup();
      render(<WatchLogs />);

      await submitAndWaitForData(user);

      // Get the first data row and click delete
      const rows = screen.getAllByRole('row');
      const firstDataRow = rows[1];
      const deleteButton = within(firstDataRow).getAllByRole('button')[1]; // Delete is second button
      await user.click(deleteButton);

      // Confirm deletion in the modal
      const deleteButtons = screen.getAllByText(
        i18n.t('components.confirmDeleteModal.deleteButton')
      );
      const confirmDeleteButton = deleteButtons[deleteButtons.length - 1];
      await user.click(confirmDeleteButton);

      // Wait for success alert and modal to close
      await waitFor(() => {
        expect(screen.getByText(i18n.t('components.alert.deleteLog.success'))).toBeInTheDocument();
      });

      // Verify the table still renders (data was refetched)
      await waitFor(() => {
        const updatedRows = screen.getAllByRole('row');
        expect(updatedRows.length).toBeGreaterThan(1);
      });
    });
  });
});
