/* eslint-disable testing-library/no-container */
import { type ReactNode } from 'react';

import GraphTab from './GraphTab';

import rainMonthlyData from '@/test/mocks/mockData/rainMontlyData.json';
import { i18n, render } from '@/test/utils/test-utils';

// Mock ResponsiveContainer to render children with fixed dimensions (jsdom has no layout engine)
vi.mock('recharts', async () => {
  const actual = await vi.importActual<typeof import('recharts')>('recharts');
  return {
    ...actual,
    ResponsiveContainer: ({ children }: { children: ReactNode }) => (
      <div style={{ width: 600, height: 300 }}>{children}</div>
    )
  };
});

const mockData = rainMonthlyData.data.rainlogs;

// Note: recharts does not render SVG content (bars, axes, ticks) in jsdom
// because it relies on browser layout APIs for dimension calculations.
// These tests verify component mounting and the wrapper structure.
// Visual rendering is verified manually via the dev server.

describe('GraphTab', () => {
  it('renders the recharts wrapper', () => {
    const { container } = render(<GraphTab data={mockData} month={1} year={2026} />);

    expect(container.querySelector('.recharts-wrapper')).toBeInTheDocument();
  });

  it('renders without crashing with empty data', () => {
    const { container } = render(<GraphTab data={[]} month={1} year={2026} />);

    expect(container.querySelector('.recharts-wrapper')).toBeInTheDocument();
  });

  it('renders without crashing for February non-leap year', () => {
    const { container } = render(<GraphTab data={[]} month={2} year={2025} />);

    expect(container.querySelector('.recharts-wrapper')).toBeInTheDocument();
  });

  it('renders without crashing for February leap year', () => {
    const { container } = render(<GraphTab data={[]} month={2} year={2028} />);

    expect(container.querySelector('.recharts-wrapper')).toBeInTheDocument();
  });

  it('renders without crashing with multiple logs on same day', () => {
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

    const { container } = render(<GraphTab data={twoLogsOnSameDay} month={3} year={2026} />);

    expect(container.querySelector('.recharts-wrapper')).toBeInTheDocument();
  });

  describe('Translations', () => {
    it('has tooltip translation keys defined', () => {
      expect(i18n.t('pages.watchLogs.graph.tooltipDay')).toBeTruthy();
      expect(i18n.t('pages.watchLogs.graph.tooltipMeasurement')).toBeTruthy();
    });

    it('tooltip keys do not return the key itself (translations exist)', () => {
      expect(i18n.t('pages.watchLogs.graph.tooltipDay')).not.toBe(
        'pages.watchLogs.graph.tooltipDay'
      );
      expect(i18n.t('pages.watchLogs.graph.tooltipMeasurement')).not.toBe(
        'pages.watchLogs.graph.tooltipMeasurement'
      );
    });
  });
});
