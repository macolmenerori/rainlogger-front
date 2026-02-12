import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { MonthlyCalendar } from '@macolmenerori/component-library/monthly-calendar';
import { Box } from '@mui/material';

import type { RainLog } from '@/types/rainlogger';

interface CalendarTabProps {
  data: RainLog[];
  month: number;
  year: number;
}

export default function CalendarTab({ data, month, year }: CalendarTabProps) {
  const { t } = useTranslation();

  const headers: [string, string, string, string, string, string, string] = [
    t('pages.watchLogs.calendar.headers.sun'),
    t('pages.watchLogs.calendar.headers.mon'),
    t('pages.watchLogs.calendar.headers.tue'),
    t('pages.watchLogs.calendar.headers.wed'),
    t('pages.watchLogs.calendar.headers.thu'),
    t('pages.watchLogs.calendar.headers.fri'),
    t('pages.watchLogs.calendar.headers.sat')
  ];

  const annotations = useMemo(() => {
    const daysInMonth = new Date(year, month, 0).getDate();

    const dayMap = new Map<number, number>();

    const sortedData = [...data].sort((a, b) => a.date.localeCompare(b.date));

    for (const log of sortedData) {
      const dayOfMonth = new Date(log.date).getUTCDate();
      const current = dayMap.get(dayOfMonth) ?? 0;
      dayMap.set(dayOfMonth, current + log.measurement);
    }

    return Array.from({ length: daysInMonth }, (_, i) => {
      const day = i + 1;
      const measurement = dayMap.get(day);

      if (measurement === undefined) return null;

      return (
        <span
          key={day}
          style={{
            fontSize: '0.7rem',
            fontWeight: measurement > 0 ? 600 : 400,
            color: measurement > 0 ? '#41c3fb' : '#888'
          }}
        >
          {measurement}
        </span>
      );
    });
  }, [data, month, year]);

  return (
    <Box
      sx={{
        mt: 2,
        p: 2,
        borderRadius: 2,
        backgroundColor: 'background.paper',
        maxWidth: { xs: '100%', sm: 450 }
      }}
    >
      <MonthlyCalendar
        year={year}
        month={month}
        headers={headers}
        darkMode={true}
        annotations={annotations}
      />
    </Box>
  );
}
