import MonthlyRainfall from './MonthlyRainfall';

import rainMonthlyData from '@/test/mocks/mockData/rainMontlyData.json';
import { i18n, render, screen } from '@/test/utils/test-utils';
import type { RainLog } from '@/types/rainlogger';

const mockData = rainMonthlyData.data.rainlogs as unknown as RainLog[];

describe('MonthlyRainfall', () => {
  describe('Rendering', () => {
    it('renders the translated label', () => {
      render(<MonthlyRainfall data={mockData} />);

      expect(screen.getByText(i18n.t('pages.watchLogs.totalRainfall.label'))).toBeInTheDocument();
    });

    it('renders the total rainfall value with mm unit', () => {
      render(<MonthlyRainfall data={mockData} />);

      expect(screen.getByText('128.4 mm')).toBeInTheDocument();
    });

    it('renders the water drop icon', () => {
      render(<MonthlyRainfall data={mockData} />);

      expect(screen.getByTestId('WaterDropIcon')).toBeInTheDocument();
    });
  });

  describe('Calculation', () => {
    it('renders 0 mm when all measurements are zero', () => {
      const zeroData: RainLog[] = [
        {
          _id: '1',
          date: '2026-01-01T00:00:00.000Z',
          measurement: 0,
          realReading: true,
          location: 'Castraz',
          timestamp: '2026-01-01T08:00:00.000Z',
          loggedBy: 'test@test.com'
        }
      ];

      render(<MonthlyRainfall data={zeroData} />);

      expect(screen.getByText('0 mm')).toBeInTheDocument();
    });

    it('renders correct value for a single entry', () => {
      const singleEntry: RainLog[] = [
        {
          _id: '1',
          date: '2026-03-10T00:00:00.000Z',
          measurement: 7.5,
          realReading: true,
          location: 'Castraz',
          timestamp: '2026-03-10T08:00:00.000Z',
          loggedBy: 'test@test.com'
        }
      ];

      render(<MonthlyRainfall data={singleEntry} />);

      expect(screen.getByText('7.5 mm')).toBeInTheDocument();
    });

    it('correctly sums multiple entries', () => {
      const multipleEntries: RainLog[] = [
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
          date: '2026-03-11T00:00:00.000Z',
          measurement: 3.5,
          realReading: false,
          location: 'Castraz',
          timestamp: '2026-03-11T09:00:00.000Z',
          loggedBy: 'test@test.com'
        }
      ];

      render(<MonthlyRainfall data={multipleEntries} />);

      expect(screen.getByText('10.5 mm')).toBeInTheDocument();
    });
  });

  describe('Empty state', () => {
    it('renders 0 mm when data array is empty', () => {
      render(<MonthlyRainfall data={[]} />);

      expect(screen.getByText('0 mm')).toBeInTheDocument();
      expect(screen.getByText(i18n.t('pages.watchLogs.totalRainfall.label'))).toBeInTheDocument();
    });
  });

  describe('Translations', () => {
    it('has the label translation key defined', () => {
      expect(i18n.t('pages.watchLogs.totalRainfall.label')).not.toBe(
        'pages.watchLogs.totalRainfall.label'
      );
    });
  });
});
