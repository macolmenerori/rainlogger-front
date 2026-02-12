import CalendarTab from './CalendarTab';

import rainMonthlyData from '@/test/mocks/mockData/rainMontlyData.json';
import { i18n, render, screen } from '@/test/utils/test-utils';

const mockData = rainMonthlyData.data.rainlogs;

describe('CalendarTab', () => {
  describe('Rendering', () => {
    it('renders translated weekday headers', () => {
      render(<CalendarTab data={mockData} month={1} year={2026} />);

      expect(screen.getByText(i18n.t('pages.watchLogs.calendar.headers.sun'))).toBeInTheDocument();
      expect(screen.getByText(i18n.t('pages.watchLogs.calendar.headers.mon'))).toBeInTheDocument();
      expect(screen.getByText(i18n.t('pages.watchLogs.calendar.headers.tue'))).toBeInTheDocument();
      expect(screen.getByText(i18n.t('pages.watchLogs.calendar.headers.wed'))).toBeInTheDocument();
      expect(screen.getByText(i18n.t('pages.watchLogs.calendar.headers.thu'))).toBeInTheDocument();
      expect(screen.getByText(i18n.t('pages.watchLogs.calendar.headers.fri'))).toBeInTheDocument();
      expect(screen.getByText(i18n.t('pages.watchLogs.calendar.headers.sat'))).toBeInTheDocument();
    });

    it('renders measurement annotations for days with data', () => {
      render(<CalendarTab data={mockData} month={1} year={2026} />);

      // Unique decimal values that don't collide with day numbers
      expect(screen.getByText('0.5')).toBeInTheDocument();
      expect(screen.getByText('17.5')).toBeInTheDocument();
      expect(screen.getByText('0.1')).toBeInTheDocument();
      expect(screen.getByText('5.2')).toBeInTheDocument();
      expect(screen.getByText('3.5')).toBeInTheDocument();
      expect(screen.getByText('1.5')).toBeInTheDocument();
      expect(screen.getByText('5.1')).toBeInTheDocument();
    });
  });

  describe('Summing', () => {
    it('sums measurements for days with multiple logs', () => {
      const twoLogsOnSameDay = [
        {
          _id: '1',
          date: '2026-03-10T00:00:00.000Z',
          measurement: 7,
          realReading: true,
          location: 'Castraz',
          timestamp: '2026-03-10T08:00:00.000Z',
          loggedBy: 'test@test.com'
        },
        {
          _id: '2',
          date: '2026-03-10T00:00:00.000Z',
          measurement: 3.5,
          realReading: false,
          location: 'Castraz',
          timestamp: '2026-03-10T09:00:00.000Z',
          loggedBy: 'test@test.com'
        }
      ];

      render(<CalendarTab data={twoLogsOnSameDay} month={3} year={2026} />);

      // 7 + 3.5 = 10.5 (unique decimal, won't collide with day numbers)
      expect(screen.getByText('10.5')).toBeInTheDocument();
    });
  });

  describe('Empty state', () => {
    it('renders calendar with headers but no measurement annotations when data is empty', () => {
      render(<CalendarTab data={[]} month={1} year={2026} />);

      // Headers should still render
      expect(screen.getByText(i18n.t('pages.watchLogs.calendar.headers.mon'))).toBeInTheDocument();

      // No measurement annotations should be present
      expect(screen.queryByText('0.5')).not.toBeInTheDocument();
      expect(screen.queryByText('17.5')).not.toBeInTheDocument();
    });
  });

  describe('Different months', () => {
    it('renders correct number of days for February in non-leap year', () => {
      render(<CalendarTab data={[]} month={2} year={2025} />);

      expect(screen.getByText('28')).toBeInTheDocument();
      expect(screen.queryByText('29')).not.toBeInTheDocument();
    });

    it('renders correct number of days for February in leap year', () => {
      render(<CalendarTab data={[]} month={2} year={2028} />);

      expect(screen.getByText('29')).toBeInTheDocument();
    });
  });
});
