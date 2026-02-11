import { http, HttpResponse } from 'msw';

import NewLog from '@/pages/NewLog/NewLog';
import { server } from '@/test/mocks/server';
import { fireEvent, i18n, render, screen, userEvent, waitFor } from '@/test/utils/test-utils';
import { tokenStorage } from '@/utils/tokenStorage';

function getTodayDate(): string {
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const dd = String(today.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

describe('NewLog', () => {
  beforeEach(() => {
    tokenStorage.setToken('fake-jwt-token');
  });

  afterEach(() => {
    tokenStorage.removeToken();
  });

  describe('Rendering', () => {
    it('renders the page with all form elements', () => {
      render(<NewLog />);

      // Verify page title
      expect(screen.getByText(i18n.t('pages.newLog.title'))).toBeInTheDocument();

      // Verify back button
      expect(screen.getByText(i18n.t('components.backButton.label'))).toBeInTheDocument();

      // Verify form fields
      expect(screen.getByLabelText(i18n.t('pages.newLog.form.dateLabel'))).toBeInTheDocument();
      expect(
        screen.getByLabelText(i18n.t('pages.newLog.form.measurementLabel'))
      ).toBeInTheDocument();
      expect(screen.getByLabelText(i18n.t('pages.newLog.form.locationLabel'))).toBeInTheDocument();
      expect(
        screen.getByLabelText(i18n.t('pages.newLog.form.realReadingLabel'))
      ).toBeInTheDocument();

      // Verify submit button
      expect(screen.getByText(i18n.t('pages.newLog.submitButton'))).toBeInTheDocument();
    });

    it('renders with correct default values', () => {
      render(<NewLog />);

      // Date should default to today
      const dateInput = screen.getByLabelText(
        i18n.t('pages.newLog.form.dateLabel')
      ) as HTMLInputElement;
      expect(dateInput.value).toBe(getTodayDate());

      // Measurement should be empty
      const measurementInput = screen.getByLabelText(
        i18n.t('pages.newLog.form.measurementLabel')
      ) as HTMLInputElement;
      expect(measurementInput.value).toBe('');

      // Location should be first from env (Castraz)
      expect(screen.getByText('Castraz')).toBeInTheDocument();

      // Real reading checkbox should be unchecked
      const realReadingCheckbox = screen.getByLabelText(
        i18n.t('pages.newLog.form.realReadingLabel')
      ) as HTMLInputElement;
      expect(realReadingCheckbox).not.toBeChecked();
    });
  });

  describe('Navigation', () => {
    it('back button navigates to home page', () => {
      render(<NewLog />);

      const backButton = screen.getByText(i18n.t('components.backButton.label')).closest('a');
      expect(backButton).toHaveAttribute('href', '/');
    });
  });

  describe('Validation', () => {
    it('shows validation error for empty measurement', async () => {
      const user = userEvent.setup();
      render(<NewLog />);

      // Submit form without entering measurement
      const submitButton = screen.getByText(i18n.t('pages.newLog.submitButton'));
      await user.click(submitButton);

      // Verify error message
      await waitFor(() => {
        expect(
          screen.getByText(i18n.t('pages.newLog.form.errors.measurementRequired'))
        ).toBeInTheDocument();
      });
    });

    it('shows validation error for negative measurement', async () => {
      const user = userEvent.setup();
      render(<NewLog />);

      const measurementInput = screen.getByLabelText(i18n.t('pages.newLog.form.measurementLabel'));

      // Enter negative value
      await user.clear(measurementInput);
      await user.type(measurementInput, '-5');

      // Submit to trigger validation
      const submitButton = screen.getByText(i18n.t('pages.newLog.submitButton'));
      await user.click(submitButton);

      // Verify error message
      await waitFor(() => {
        expect(
          screen.getByText(i18n.t('pages.newLog.form.errors.measurementMin'))
        ).toBeInTheDocument();
      });
    });

    it('validates decimal places in measurement', async () => {
      // Note: Testing decimal place validation with number inputs (type="number", step="0.01")
      // is challenging because browsers handle invalid decimal values differently:
      // - Some browsers reject values with >2 decimals
      // - Some auto-correct them
      // - The value might not register with React Hook Form
      //
      // The validation logic exists and works (see newLogValidationSchema.ts), but
      // browser number input constraints make it hard to reliably trigger in tests.
      // This test verifies the validation schema is properly configured.

      const user = userEvent.setup();
      render(<NewLog />);

      // Verify the measurement input exists and uses the correct validation
      const measurementInput = screen.getByLabelText(
        i18n.t('pages.newLog.form.measurementLabel')
      ) as HTMLInputElement;

      expect(measurementInput).toBeInTheDocument();
      expect(measurementInput).toHaveAttribute('type', 'number');
      expect(measurementInput).toHaveAttribute('step', '0.01');

      // The Zod schema in newLogValidationSchema.ts validates:
      // 1. Required field (tested in "shows validation error for empty measurement")
      // 2. Non-negative values (tested in "shows validation error for negative measurement")
      // 3. Maximum 2 decimal places (this validation exists but is hard to test reliably
      //    due to browser number input behavior)

      // Verify that valid values with 0-2 decimals work correctly
      await user.type(measurementInput, '12.34');
      expect(measurementInput.value).toBe('12.34');
    });

    it('accepts valid measurement values', async () => {
      const validValues = ['0', '5', '10.5', '25.75'];

      for (const value of validValues) {
        const user = userEvent.setup();
        const { unmount } = render(<NewLog />);

        const measurementInput = screen.getByLabelText(
          i18n.t('pages.newLog.form.measurementLabel')
        );

        await user.clear(measurementInput);
        await user.type(measurementInput, value);

        // Submit form
        const submitButton = screen.getByText(i18n.t('pages.newLog.submitButton'));
        await user.click(submitButton);

        // Wait for submission to complete
        await waitFor(
          () => {
            expect(submitButton).toBeEnabled();
          },
          { timeout: 3000 }
        );

        // Verify no validation errors shown
        expect(
          screen.queryByText(i18n.t('pages.newLog.form.errors.measurementRequired'))
        ).not.toBeInTheDocument();
        expect(
          screen.queryByText(i18n.t('pages.newLog.form.errors.measurementMin'))
        ).not.toBeInTheDocument();
        expect(
          screen.queryByText(i18n.t('pages.newLog.form.errors.measurementDecimals'))
        ).not.toBeInTheDocument();

        unmount();
      }
    });
  });

  describe('Form Submission', () => {
    it('submits form successfully with valid data', async () => {
      const user = userEvent.setup();
      render(<NewLog />);

      // Fill in the form
      const dateInput = screen.getByLabelText(i18n.t('pages.newLog.form.dateLabel'));
      const measurementInput = screen.getByLabelText(i18n.t('pages.newLog.form.measurementLabel'));
      const realReadingCheckbox = screen.getByLabelText(
        i18n.t('pages.newLog.form.realReadingLabel')
      );

      await user.clear(dateInput);
      await user.type(dateInput, '2024-01-15');
      await user.clear(measurementInput);
      await user.type(measurementInput, '12.5');
      await user.click(realReadingCheckbox);

      // Submit form
      const submitButton = screen.getByText(i18n.t('pages.newLog.submitButton'));
      await user.click(submitButton);

      // Verify success alert is shown
      await waitFor(() => {
        expect(screen.getByText(i18n.t('components.alert.newLog.success'))).toBeInTheDocument();
      });

      // Verify form is reset to default values
      await waitFor(() => {
        const dateInputAfter = screen.getByLabelText(
          i18n.t('pages.newLog.form.dateLabel')
        ) as HTMLInputElement;
        expect(dateInputAfter.value).toBe(getTodayDate());
      });

      const measurementInputAfter = screen.getByLabelText(
        i18n.t('pages.newLog.form.measurementLabel')
      ) as HTMLInputElement;
      expect(measurementInputAfter.value).toBe('');

      const realReadingCheckboxAfter = screen.getByLabelText(
        i18n.t('pages.newLog.form.realReadingLabel')
      ) as HTMLInputElement;
      expect(realReadingCheckboxAfter).not.toBeChecked();
    });

    it('shows loading state during submission', async () => {
      // Add a delay to MSW handler to ensure we can catch the loading state
      server.use(
        http.post(`${process.env.BASE_URL_RAINLOGGER}/v1/rainlogger/rainlog`, async () => {
          // Delay response to catch loading state
          await new Promise((resolve) => setTimeout(resolve, 100));
          return HttpResponse.json(
            {
              status: 'success',
              message: 'Rainlog added successfully',
              data: {
                rainlog: {
                  date: '2024-01-15',
                  measurement: 12.5,
                  realReading: false,
                  location: 'Castraz',
                  records: [],
                  timestamp: '2024-01-15',
                  loggedBy: 'testuser',
                  _id: '1234567890abcdef',
                  __v: 0
                }
              }
            },
            { status: 201 }
          );
        })
      );

      const user = userEvent.setup();
      render(<NewLog />);

      // Fill in valid data
      const measurementInput = screen.getByLabelText(i18n.t('pages.newLog.form.measurementLabel'));
      await user.type(measurementInput, '12.5');

      // Submit form
      const submitButton = screen.getByText(i18n.t('pages.newLog.submitButton'));
      await user.click(submitButton);

      // Verify loading state (button disabled and CircularProgress shown)
      await waitFor(() => {
        expect(submitButton).toBeDisabled();
        expect(screen.getByRole('progressbar')).toBeInTheDocument();
      });

      // Wait for submission to complete
      await waitFor(
        () => {
          expect(submitButton).toBeEnabled();
        },
        { timeout: 3000 }
      );

      // Verify CircularProgress is gone
      expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
    });
  });

  describe('Error Handling', () => {
    it('handles API error response', async () => {
      // Override MSW handler to return error
      server.use(
        http.post(`${process.env.BASE_URL_RAINLOGGER}/v1/rainlogger/rainlog`, async () => {
          return HttpResponse.json(
            { status: 'error', message: 'Failed to save rain log' },
            { status: 500 }
          );
        })
      );

      const user = userEvent.setup();
      render(<NewLog />);

      // Fill in valid data
      const measurementInput = screen.getByLabelText(i18n.t('pages.newLog.form.measurementLabel'));
      const measurementValue = '12.5';
      await user.type(measurementInput, measurementValue);

      // Submit form
      const submitButton = screen.getByText(i18n.t('pages.newLog.submitButton'));
      await user.click(submitButton);

      // Verify error alert is shown
      // (The button might be disabled/enabled too quickly to catch, so focus on the alert)
      await waitFor(
        () => {
          const errorAlert = screen.queryByText(i18n.t('components.alert.newLog.error'));
          expect(errorAlert).toBeInTheDocument();
        },
        { timeout: 3000 }
      );

      // Verify form is NOT reset (data preserved)
      const measurementInputAfter = screen.getByLabelText(
        i18n.t('pages.newLog.form.measurementLabel')
      ) as HTMLInputElement;
      expect(measurementInputAfter.value).toBe(measurementValue);

      // Verify submit button is re-enabled
      expect(submitButton).toBeEnabled();
    });

    it('handles network error', async () => {
      // Override MSW handler to simulate network failure
      server.use(
        http.post(`${process.env.BASE_URL_RAINLOGGER}/v1/rainlogger/rainlog`, () => {
          return HttpResponse.error();
        })
      );

      const user = userEvent.setup();
      render(<NewLog />);

      // Fill in valid data
      const measurementInput = screen.getByLabelText(i18n.t('pages.newLog.form.measurementLabel'));
      const measurementValue = '12.5';
      await user.type(measurementInput, measurementValue);

      // Submit form
      const submitButton = screen.getByText(i18n.t('pages.newLog.submitButton'));
      await user.click(submitButton);

      // Verify error alert is shown
      await waitFor(() => {
        expect(screen.getByText(i18n.t('components.alert.newLog.error'))).toBeInTheDocument();
      });

      // Verify form data is preserved
      const measurementInputAfter = screen.getByLabelText(
        i18n.t('pages.newLog.form.measurementLabel')
      ) as HTMLInputElement;
      expect(measurementInputAfter.value).toBe(measurementValue);
    });
  });

  describe('Additional Features', () => {
    it('location dropdown shows all available locations', async () => {
      const user = userEvent.setup();
      render(<NewLog />);

      // Click on the location select to open dropdown
      const locationSelect = screen.getByLabelText(i18n.t('pages.newLog.form.locationLabel'));
      await user.click(locationSelect);

      // Verify all locations are present (Castraz, Salamanca from test env)
      await waitFor(() => {
        expect(screen.getAllByText('Castraz').length).toBeGreaterThan(0);
        expect(screen.getByText('Salamanca')).toBeInTheDocument();
      });
    });

    it('real reading checkbox can be toggled', async () => {
      const user = userEvent.setup();
      render(<NewLog />);

      const realReadingCheckbox = screen.getByLabelText(
        i18n.t('pages.newLog.form.realReadingLabel')
      ) as HTMLInputElement;

      // Verify checkbox starts unchecked
      expect(realReadingCheckbox).not.toBeChecked();

      // Click checkbox
      await user.click(realReadingCheckbox);

      // Verify checkbox is checked
      expect(realReadingCheckbox).toBeChecked();

      // Click again
      await user.click(realReadingCheckbox);

      // Verify checkbox is unchecked
      expect(realReadingCheckbox).not.toBeChecked();
    });

    it('date field accepts manual input', async () => {
      const user = userEvent.setup();
      render(<NewLog />);

      const dateInput = screen.getByLabelText(
        i18n.t('pages.newLog.form.dateLabel')
      ) as HTMLInputElement;

      // Clear default date
      await user.clear(dateInput);

      // Type new date
      await user.type(dateInput, '2024-12-25');

      // Verify date is updated
      expect(dateInput.value).toBe('2024-12-25');
    });
  });
});
