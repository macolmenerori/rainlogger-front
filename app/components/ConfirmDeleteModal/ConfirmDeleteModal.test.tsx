import { http, HttpResponse } from 'msw';
import { vi } from 'vitest';

import ConfirmDeleteModal from './ConfirmDeleteModal';

import rainMonthlyData from '@/test/mocks/mockData/rainMontlyData.json';
import { server } from '@/test/mocks/server';
import { i18n, render, screen, userEvent, waitFor } from '@/test/utils/test-utils';
import type { RainLog } from '@/types/rainlogger';
import { tokenStorage } from '@/utils/tokenStorage';

const mockLog = rainMonthlyData.data.rainlogs[0] as RainLog;

describe('ConfirmDeleteModal', () => {
  let onClose: ReturnType<typeof vi.fn<() => void>>;
  let onDataChange: ReturnType<typeof vi.fn<() => Promise<void>>>;

  beforeEach(() => {
    tokenStorage.setToken('fake-jwt-token');
    onClose = vi.fn<() => void>();
    onDataChange = vi.fn<() => Promise<void>>();
  });

  afterEach(() => {
    tokenStorage.removeToken();
  });

  describe('Rendering', () => {
    it('renders dialog title, confirmation message, and buttons', () => {
      render(<ConfirmDeleteModal open log={mockLog} onClose={onClose} />);

      const day = mockLog.date.slice(8, 10);
      const monthNumber = String(Number(mockLog.date.slice(5, 7)));
      const month = i18n.t(`pages.watchLogs.filters.months.${monthNumber}`);
      expect(
        screen.getByText(i18n.t('components.confirmDeleteModal.message', { day, month }))
      ).toBeInTheDocument();

      expect(
        screen.getByText(i18n.t('components.confirmDeleteModal.cancelButton'))
      ).toBeInTheDocument();

      // "Delete" appears as title and button
      const deleteTexts = screen.getAllByText(i18n.t('components.confirmDeleteModal.deleteButton'));
      expect(deleteTexts.length).toBe(2);
    });

    it('renders close (X) button', () => {
      render(<ConfirmDeleteModal open log={mockLog} onClose={onClose} />);

      expect(screen.getByLabelText('close')).toBeInTheDocument();
    });
  });

  describe('Deletion', () => {
    it('successful delete shows success alert, calls onDataChange, and closes', async () => {
      const user = userEvent.setup();
      render(
        <ConfirmDeleteModal open log={mockLog} onClose={onClose} onDataChange={onDataChange} />
      );

      const deleteButtons = screen.getAllByText(
        i18n.t('components.confirmDeleteModal.deleteButton')
      );
      const deleteActionButton = deleteButtons[deleteButtons.length - 1];
      await user.click(deleteActionButton);

      await waitFor(() => {
        expect(screen.getByText(i18n.t('components.alert.deleteLog.success'))).toBeInTheDocument();
      });

      expect(onDataChange).toHaveBeenCalled();
      expect(onClose).toHaveBeenCalled();
    });

    it('shows loading state during deletion', async () => {
      server.use(
        http.delete(
          `${process.env.BASE_URL_RAINLOGGER}/v1/rainlogger/rainlog/delete/:id`,
          async () => {
            await new Promise((resolve) => setTimeout(resolve, 100));
            return new HttpResponse(null, { status: 204 });
          }
        )
      );

      const user = userEvent.setup();
      render(<ConfirmDeleteModal open log={mockLog} onClose={onClose} />);

      const deleteButtons = screen.getAllByText(
        i18n.t('components.confirmDeleteModal.deleteButton')
      );
      const deleteActionButton = deleteButtons[deleteButtons.length - 1];
      await user.click(deleteActionButton);

      await waitFor(() => {
        expect(screen.getByRole('progressbar')).toBeInTheDocument();
      });

      await waitFor(
        () => {
          expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
        },
        { timeout: 3000 }
      );
    });

    it('handles API error response', async () => {
      server.use(
        http.delete(`${process.env.BASE_URL_RAINLOGGER}/v1/rainlogger/rainlog/delete/:id`, () => {
          return HttpResponse.json(
            { status: 'error', message: 'Failed to delete rain log' },
            { status: 500 }
          );
        })
      );

      const user = userEvent.setup();
      render(<ConfirmDeleteModal open log={mockLog} onClose={onClose} />);

      const deleteButtons = screen.getAllByText(
        i18n.t('components.confirmDeleteModal.deleteButton')
      );
      const deleteActionButton = deleteButtons[deleteButtons.length - 1];
      await user.click(deleteActionButton);

      await waitFor(
        () => {
          expect(screen.getByText(i18n.t('components.alert.deleteLog.error'))).toBeInTheDocument();
        },
        { timeout: 3000 }
      );

      expect(onClose).not.toHaveBeenCalled();
    });

    it('handles network error', async () => {
      server.use(
        http.delete(`${process.env.BASE_URL_RAINLOGGER}/v1/rainlogger/rainlog/delete/:id`, () => {
          return HttpResponse.error();
        })
      );

      const user = userEvent.setup();
      render(<ConfirmDeleteModal open log={mockLog} onClose={onClose} />);

      const deleteButtons = screen.getAllByText(
        i18n.t('components.confirmDeleteModal.deleteButton')
      );
      const deleteActionButton = deleteButtons[deleteButtons.length - 1];
      await user.click(deleteActionButton);

      await waitFor(() => {
        expect(screen.getByText(i18n.t('components.alert.deleteLog.error'))).toBeInTheDocument();
      });

      expect(onClose).not.toHaveBeenCalled();
    });
  });

  describe('Close / Cancel', () => {
    it('cancel button calls onClose', async () => {
      const user = userEvent.setup();
      render(<ConfirmDeleteModal open log={mockLog} onClose={onClose} />);

      const cancelButton = screen.getByText(i18n.t('components.confirmDeleteModal.cancelButton'));
      await user.click(cancelButton);

      expect(onClose).toHaveBeenCalled();
    });

    it('close (X) button calls onClose', async () => {
      const user = userEvent.setup();
      render(<ConfirmDeleteModal open log={mockLog} onClose={onClose} />);

      const closeButton = screen.getByLabelText('close');
      await user.click(closeButton);

      expect(onClose).toHaveBeenCalled();
    });
  });
});
