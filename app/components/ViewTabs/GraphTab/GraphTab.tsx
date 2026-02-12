import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { Box } from '@mui/material';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

import type { RainLog } from '@/types/rainlogger';

interface GraphTabProps {
  data: RainLog[];
  month: number;
  year: number;
}

interface ChartDataPoint {
  day: number;
  measurement: number;
}

export default function GraphTab({ data, month, year }: GraphTabProps) {
  const { t } = useTranslation();

  const chartData = useMemo<ChartDataPoint[]>(() => {
    const daysInMonth = new Date(year, month, 0).getDate();

    const dayMap = new Map<number, number>();
    for (const log of data) {
      const dayOfMonth = new Date(log.date).getUTCDate();
      const current = dayMap.get(dayOfMonth) ?? 0;
      dayMap.set(dayOfMonth, current + log.measurement);
    }

    return Array.from({ length: daysInMonth }, (_, i) => {
      const day = i + 1;
      return {
        day,
        measurement: dayMap.get(day) ?? 0
      };
    });
  }, [data, month, year]);

  return (
    <Box
      sx={{
        mt: 2,
        p: 2,
        borderRadius: 2,
        backgroundColor: 'background.paper',
        maxWidth: { xs: '100%', sm: 700 },
        width: '100%'
      }}
    >
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#3a4556" vertical={false} />
          <XAxis
            dataKey="day"
            stroke="#aaa"
            tick={{ fill: '#aaa', fontSize: 12 }}
            tickLine={{ stroke: '#aaa' }}
            axisLine={{ stroke: '#3a4556' }}
          />
          <YAxis
            stroke="#aaa"
            tick={{ fill: '#aaa', fontSize: 12 }}
            tickLine={{ stroke: '#aaa' }}
            axisLine={{ stroke: '#3a4556' }}
            allowDecimals={true}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#1a2332',
              border: '1px solid #3a4556',
              borderRadius: 8,
              color: '#fff'
            }}
            labelFormatter={(day) => `${t('pages.watchLogs.graph.tooltipDay')} ${day}`}
            formatter={(value: number | undefined) => [
              value ?? 0,
              t('pages.watchLogs.graph.tooltipMeasurement')
            ]}
            cursor={{ fill: 'rgba(65, 195, 251, 0.1)' }}
          />
          <Bar dataKey="measurement" fill="#41c3fb" radius={[4, 4, 0, 0]} maxBarSize={20} />
        </BarChart>
      </ResponsiveContainer>
    </Box>
  );
}
