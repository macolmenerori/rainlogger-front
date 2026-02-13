import { http, HttpResponse } from 'msw';
import { vi } from 'vitest';

import UpdateLogModal from './UpdateLogModal';

import rainMonthlyData from '@/test/mocks/mockData/rainMontlyData.json';
import { server } from '@/test/mocks/server';
import { i18n, render, screen, userEvent, waitFor } from '@/test/utils/test-utils';
import type { RainLog } from '@/types/rainlogger';
import { tokenStorage } from '@/utils/tokenStorage';

const mockLog = rainMonthlyData.data.rainlogs[0] as RainLog;

describe('UpdateLogModal', () => {
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
    it('renders dialog title, field labels, and buttons', () => {
      render(<UpdateLogModal open log={mockLog} onClose={onClose} />);

      expect(screen.getByText(i18n.t('components.updateLogModal.title'))).toBeInTheDocument();
      expect(
        screen.getByLabelText(i18n.t('components.updateLogModal.measurementLabel'))
      ).toBeInTheDocument();
      expect(
        screen.getByLabelText(i18n.t('components.updateLogModal.realReadingLabel'))
      ).toBeInTheDocument();
      expect(
        screen.getByText(i18n.t('components.updateLogModal.cancelButton'))
      ).toBeInTheDocument();
      expect(
        screen.getByText(i18n.t('components.updateLogModal.updateButton'))
      ).toBeInTheDocument();
    });

    it('prefills form fields with log values', () => {
      render(<UpdateLogModal open log={mockLog} onClose={onClose} />);

      const measurementInput = screen.getByLabelText(
        i18n.t('components.updateLogModal.measurementLabel')
      ) as HTMLInputElement;
      expect(measurementInput.value).toBe(String(mockLog.measurement));

      const realReadingCheckbox = screen.getByLabelText(
        i18n.t('components.updateLogModal.realReadingLabel')
      ) as HTMLInputElement;
      expect(realReadingCheckbox).toBeChecked();
    });
  });

  describe('Update Button State', () => {
    it('update button is disabled initially (form not dirty)', () => {
      render(<UpdateLogModal open log={mockLog} onClose={onClose} />);

      const updateButton = screen.getByText(i18n.t('components.updateLogModal.updateButton'));
      expect(updateButton).toBeDisabled();
    });

    it('update button is enabled after changing measurement', async () => {
      const user = userEvent.setup();
      render(<UpdateLogModal open log={mockLog} onClose={onClose} />);

      const measurementInput = screen.getByLabelText(
        i18n.t('components.updateLogModal.measurementLabel')
      );
      await user.clear(measurementInput);
      await user.type(measurementInput, '10');

      const updateButton = screen.getByText(i18n.t('components.updateLogModal.updateButton'));
      expect(updateButton).toBeEnabled();
    });

    it('update button is enabled after toggling realReading', async () => {
      const user = userEvent.setup();
      render(<UpdateLogModal open log={mockLog} onClose={onClose} />);

      const realReadingCheckbox = screen.getByLabelText(
        i18n.t('components.updateLogModal.realReadingLabel')
      );
      await user.click(realReadingCheckbox);

      const updateButton = screen.getByText(i18n.t('components.updateLogModal.updateButton'));
      expect(updateButton).toBeEnabled();
    });

    it('update button is disabled when measurement is cleared', async () => {
      const user = userEvent.setup();
      render(<UpdateLogModal open log={mockLog} onClose={onClose} />);

      const measurementInput = screen.getByLabelText(
        i18n.t('components.updateLogModal.measurementLabel')
      );
      await user.clear(measurementInput);

      await waitFor(() => {
        const updateButton = screen.getByText(i18n.t('components.updateLogModal.updateButton'));
        expect(updateButton).toBeDisabled();
      });
    });
  });

  describe('Form Submission', () => {
    it('successful update shows success alert and calls onClose and onDataChange', async () => {
      const user = userEvent.setup();
      render(<UpdateLogModal open log={mockLog} onClose={onClose} onDataChange={onDataChange} />);

      const measurementInput = screen.getByLabelText(
        i18n.t('components.updateLogModal.measurementLabel')
      );
      await user.clear(measurementInput);
      await user.type(measurementInput, '25');

      const updateButton = screen.getByText(i18n.t('components.updateLogModal.updateButton'));
      await user.click(updateButton);

      await waitFor(() => {
        expect(screen.getByText(i18n.t('components.alert.updateLog.success'))).toBeInTheDocument();
      });

      expect(onDataChange).toHaveBeenCalled();
      expect(onClose).toHaveBeenCalled();
    });

    it('shows loading state during submission', async () => {
      server.use(
        http.put(`${process.env.BASE_URL_RAINLOGGER}/v1/rainlogger/rainlog`, async () => {
          await new Promise((resolve) => setTimeout(resolve, 100));
          return HttpResponse.json({
            status: 'success',
            message: 'Rainlog updated successfully',
            data: { rainlog: mockLog }
          });
        })
      );

      const user = userEvent.setup();
      render(<UpdateLogModal open log={mockLog} onClose={onClose} />);

      const measurementInput = screen.getByLabelText(
        i18n.t('components.updateLogModal.measurementLabel')
      );
      await user.clear(measurementInput);
      await user.type(measurementInput, '25');

      const updateButton = screen.getByText(i18n.t('components.updateLogModal.updateButton'));
      await user.click(updateButton);

      await waitFor(() => {
        expect(updateButton).toBeDisabled();
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
        http.put(`${process.env.BASE_URL_RAINLOGGER}/v1/rainlogger/rainlog`, async () => {
          return HttpResponse.json(
            { status: 'error', message: 'Failed to update rain log' },
            { status: 500 }
          );
        })
      );

      const user = userEvent.setup();
      render(<UpdateLogModal open log={mockLog} onClose={onClose} />);

      const measurementInput = screen.getByLabelText(
        i18n.t('components.updateLogModal.measurementLabel')
      );
      await user.clear(measurementInput);
      await user.type(measurementInput, '25');

      const updateButton = screen.getByText(i18n.t('components.updateLogModal.updateButton'));
      await user.click(updateButton);

      await waitFor(
        () => {
          expect(screen.getByText(i18n.t('components.alert.updateLog.error'))).toBeInTheDocument();
        },
        { timeout: 3000 }
      );

      // Form data preserved
      const measurementInputAfter = screen.getByLabelText(
        i18n.t('components.updateLogModal.measurementLabel')
      ) as HTMLInputElement;
      expect(measurementInputAfter.value).toBe('25');

      // Modal stays open
      expect(onClose).not.toHaveBeenCalled();
    });

    it('handles network error', async () => {
      server.use(
        http.put(`${process.env.BASE_URL_RAINLOGGER}/v1/rainlogger/rainlog`, () => {
          return HttpResponse.error();
        })
      );

      const user = userEvent.setup();
      render(<UpdateLogModal open log={mockLog} onClose={onClose} />);

      const measurementInput = screen.getByLabelText(
        i18n.t('components.updateLogModal.measurementLabel')
      );
      await user.clear(measurementInput);
      await user.type(measurementInput, '25');

      const updateButton = screen.getByText(i18n.t('components.updateLogModal.updateButton'));
      await user.click(updateButton);

      await waitFor(() => {
        expect(screen.getByText(i18n.t('components.alert.updateLog.error'))).toBeInTheDocument();
      });

      // Form data preserved
      const measurementInputAfter = screen.getByLabelText(
        i18n.t('components.updateLogModal.measurementLabel')
      ) as HTMLInputElement;
      expect(measurementInputAfter.value).toBe('25');
    });
  });

  describe('Close / Cancel', () => {
    it('cancel button calls onClose', async () => {
      const user = userEvent.setup();
      render(<UpdateLogModal open log={mockLog} onClose={onClose} />);

      const cancelButton = screen.getByText(i18n.t('components.updateLogModal.cancelButton'));
      await user.click(cancelButton);

      expect(onClose).toHaveBeenCalled();
    });

    it('close (X) button calls onClose', async () => {
      const user = userEvent.setup();
      render(<UpdateLogModal open log={mockLog} onClose={onClose} />);

      const closeButton = screen.getByLabelText('close');
      await user.click(closeButton);

      expect(onClose).toHaveBeenCalled();
    });
  });
});
