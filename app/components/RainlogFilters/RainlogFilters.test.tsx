import RainlogFilters from '@/components/RainlogFilters/RainlogFilters';
import { i18n, render, screen, userEvent, waitFor } from '@/test/utils/test-utils';

describe('RainlogFilters', () => {
  const mockOnSubmit = vi.fn();

  beforeEach(() => {
    mockOnSubmit.mockClear();
  });

  describe('Rendering', () => {
    it('renders all form elements', () => {
      render(<RainlogFilters onSubmit={mockOnSubmit} />);

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

    it('renders with correct default values', () => {
      render(<RainlogFilters onSubmit={mockOnSubmit} />);

      // Month should default to current month (translated name)
      const currentMonth = String(new Date().getMonth() + 1);
      const currentMonthName = i18n.t(`pages.watchLogs.filters.months.${currentMonth}`);
      expect(screen.getByText(currentMonthName)).toBeInTheDocument();

      // Year should default to current year
      const yearInput = screen.getByLabelText(
        i18n.t('pages.watchLogs.filters.yearLabel')
      ) as HTMLInputElement;
      expect(yearInput.value).toBe(String(new Date().getFullYear()));

      // Location should default to first from env (Castraz)
      expect(screen.getByText('Castraz')).toBeInTheDocument();

      // Real reading checkbox should be unchecked
      const realReadingCheckbox = screen.getByLabelText(
        i18n.t('pages.watchLogs.filters.realReadingLabel')
      ) as HTMLInputElement;
      expect(realReadingCheckbox).not.toBeChecked();
    });
  });

  describe('Validation', () => {
    it('shows validation error for year below 1970', async () => {
      const user = userEvent.setup();
      render(<RainlogFilters onSubmit={mockOnSubmit} />);

      const yearInput = screen.getByLabelText(i18n.t('pages.watchLogs.filters.yearLabel'));
      await user.clear(yearInput);
      await user.type(yearInput, '1969');

      const submitButton = screen.getByText(i18n.t('pages.watchLogs.filters.submitButton'));
      await user.click(submitButton);

      await waitFor(() => {
        expect(
          screen.getByText(i18n.t('pages.watchLogs.filters.errors.yearMin'))
        ).toBeInTheDocument();
      });

      expect(mockOnSubmit).not.toHaveBeenCalled();
    });

    it('shows validation error for empty year', async () => {
      const user = userEvent.setup();
      render(<RainlogFilters onSubmit={mockOnSubmit} />);

      const yearInput = screen.getByLabelText(i18n.t('pages.watchLogs.filters.yearLabel'));
      await user.clear(yearInput);

      const submitButton = screen.getByText(i18n.t('pages.watchLogs.filters.submitButton'));
      await user.click(submitButton);

      await waitFor(() => {
        expect(
          screen.getByText(i18n.t('pages.watchLogs.filters.errors.yearMin'))
        ).toBeInTheDocument();
      });

      expect(mockOnSubmit).not.toHaveBeenCalled();
    });

    it('does not call onSubmit when validation fails', async () => {
      const user = userEvent.setup();
      render(<RainlogFilters onSubmit={mockOnSubmit} />);

      const yearInput = screen.getByLabelText(i18n.t('pages.watchLogs.filters.yearLabel'));
      await user.clear(yearInput);
      await user.type(yearInput, '0');

      const submitButton = screen.getByText(i18n.t('pages.watchLogs.filters.submitButton'));
      await user.click(submitButton);

      await waitFor(() => {
        expect(
          screen.getByText(i18n.t('pages.watchLogs.filters.errors.yearMin'))
        ).toBeInTheDocument();
      });

      expect(mockOnSubmit).not.toHaveBeenCalled();
    });
  });

  describe('Form Submission', () => {
    it('calls onSubmit with default values when submitted without changes', async () => {
      const user = userEvent.setup();
      render(<RainlogFilters onSubmit={mockOnSubmit} />);

      const submitButton = screen.getByText(i18n.t('pages.watchLogs.filters.submitButton'));
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalledWith(
          {
            month: String(new Date().getMonth() + 1),
            year: String(new Date().getFullYear()),
            location: 'Castraz',
            realReading: false
          },
          expect.anything()
        );
      });
    });

    it('calls onSubmit with modified data after changing fields', async () => {
      const user = userEvent.setup();
      render(<RainlogFilters onSubmit={mockOnSubmit} />);

      // Change year
      const yearInput = screen.getByLabelText(i18n.t('pages.watchLogs.filters.yearLabel'));
      await user.clear(yearInput);
      await user.type(yearInput, '2024');

      // Change location
      const locationSelect = screen.getByLabelText(i18n.t('pages.watchLogs.filters.locationLabel'));
      await user.click(locationSelect);
      await waitFor(() => {
        expect(screen.getByText('Salamanca')).toBeInTheDocument();
      });
      await user.click(screen.getByText('Salamanca'));

      // Toggle real reading
      const realReadingCheckbox = screen.getByLabelText(
        i18n.t('pages.watchLogs.filters.realReadingLabel')
      );
      await user.click(realReadingCheckbox);

      // Submit
      const submitButton = screen.getByText(i18n.t('pages.watchLogs.filters.submitButton'));
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalledWith(
          expect.objectContaining({
            year: '2024',
            location: 'Salamanca',
            realReading: true
          }),
          expect.anything()
        );
      });
    });
  });

  describe('Interactive Features', () => {
    it('month dropdown shows all 12 translated month names', async () => {
      const user = userEvent.setup();
      render(<RainlogFilters onSubmit={mockOnSubmit} />);

      const monthSelect = screen.getByLabelText(i18n.t('pages.watchLogs.filters.monthLabel'));
      await user.click(monthSelect);

      await waitFor(() => {
        for (let m = 1; m <= 12; m++) {
          const monthName = i18n.t(`pages.watchLogs.filters.months.${m}`);
          expect(screen.getAllByText(monthName).length).toBeGreaterThan(0);
        }
      });
    });

    it('location dropdown shows all available locations', async () => {
      const user = userEvent.setup();
      render(<RainlogFilters onSubmit={mockOnSubmit} />);

      const locationSelect = screen.getByLabelText(i18n.t('pages.watchLogs.filters.locationLabel'));
      await user.click(locationSelect);

      await waitFor(() => {
        expect(screen.getAllByText('Castraz').length).toBeGreaterThan(0);
        expect(screen.getByText('Salamanca')).toBeInTheDocument();
      });
    });

    it('real reading checkbox can be toggled', async () => {
      const user = userEvent.setup();
      render(<RainlogFilters onSubmit={mockOnSubmit} />);

      const realReadingCheckbox = screen.getByLabelText(
        i18n.t('pages.watchLogs.filters.realReadingLabel')
      ) as HTMLInputElement;

      expect(realReadingCheckbox).not.toBeChecked();

      await user.click(realReadingCheckbox);
      expect(realReadingCheckbox).toBeChecked();

      await user.click(realReadingCheckbox);
      expect(realReadingCheckbox).not.toBeChecked();
    });

    it('year field accepts manual input', async () => {
      const user = userEvent.setup();
      render(<RainlogFilters onSubmit={mockOnSubmit} />);

      const yearInput = screen.getByLabelText(
        i18n.t('pages.watchLogs.filters.yearLabel')
      ) as HTMLInputElement;

      await user.clear(yearInput);
      await user.type(yearInput, '2000');

      expect(yearInput.value).toBe('2000');
    });
  });
});
