import { vi } from 'vitest';

import TableTab from './TableTab';

import rainMonthlyData from '@/test/mocks/mockData/rainMontlyData.json';
import { i18n, render, screen, userEvent, within } from '@/test/utils/test-utils';

const mockData = rainMonthlyData.data.rainlogs;

describe('TableTab', () => {
  describe('Rendering', () => {
    it('renders table headers with translated text', () => {
      render(<TableTab data={mockData} />);

      expect(screen.getByText(i18n.t('pages.watchLogs.table.date'))).toBeInTheDocument();
      expect(screen.getByText(i18n.t('pages.watchLogs.table.amount'))).toBeInTheDocument();
      expect(screen.getByText(i18n.t('pages.watchLogs.table.actions'))).toBeInTheDocument();
    });

    it('renders correct number of rows', () => {
      render(<TableTab data={mockData} />);

      const rows = screen.getAllByRole('row');
      // 1 header row + 31 data rows
      expect(rows).toHaveLength(mockData.length + 1);
    });

    it('renders dates in YYYY-MM-DD format', () => {
      render(<TableTab data={mockData} />);

      expect(screen.getByText('2026-01-01')).toBeInTheDocument();
      expect(screen.queryByText('2026-01-01T00:00:00.000Z')).not.toBeInTheDocument();
    });

    it('renders measurement values', () => {
      render(<TableTab data={mockData} />);

      expect(screen.getByText('0.5')).toBeInTheDocument();
      expect(screen.getByText('27')).toBeInTheDocument();
    });

    it('renders edit and delete buttons for each row', () => {
      render(<TableTab data={mockData} />);

      const buttons = screen.getAllByRole('button');
      // 2 buttons (edit + delete) per row
      expect(buttons).toHaveLength(mockData.length * 2);
    });
  });

  describe('Sorting', () => {
    it('sorts data by date ascending', () => {
      render(<TableTab data={mockData} />);

      const rows = screen.getAllByRole('row');
      // First data row (index 1) should be the earliest date
      const firstDataRow = rows[1];
      expect(within(firstDataRow).getByText('2026-01-01')).toBeInTheDocument();

      // Last data row should be the latest date
      const lastDataRow = rows[rows.length - 1];
      expect(within(lastDataRow).getByText('2026-01-31')).toBeInTheDocument();
    });
  });

  describe('Empty state', () => {
    it('renders table headers but no rows when data is empty', () => {
      render(<TableTab data={[]} />);

      expect(screen.getByText(i18n.t('pages.watchLogs.table.date'))).toBeInTheDocument();

      const rows = screen.getAllByRole('row');
      // Only the header row
      expect(rows).toHaveLength(1);
    });
  });

  describe('Actions', () => {
    let consoleSpy: ReturnType<typeof vi.spyOn>;

    beforeEach(() => {
      consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    });

    afterEach(() => {
      consoleSpy.mockRestore();
    });

    it('opens update modal on edit button click', async () => {
      const user = userEvent.setup();
      render(<TableTab data={mockData} />);

      // Click the first edit button (first row after sorting = 2026-01-01)
      const rows = screen.getAllByRole('row');
      const firstDataRow = rows[1];
      const buttons = within(firstDataRow).getAllByRole('button');
      await user.click(buttons[0]); // Edit is the first button

      expect(screen.getByText(i18n.t('components.updateLogModal.title'))).toBeInTheDocument();
    });

    it('logs delete with correct id on delete button click', async () => {
      const user = userEvent.setup();
      render(<TableTab data={mockData} />);

      const rows = screen.getAllByRole('row');
      const firstDataRow = rows[1];
      const buttons = within(firstDataRow).getAllByRole('button');
      await user.click(buttons[1]); // Delete is the second button

      expect(consoleSpy).toHaveBeenCalledWith('Delete:', '698444e22823b85ab6af9d8a');
    });
  });
});
