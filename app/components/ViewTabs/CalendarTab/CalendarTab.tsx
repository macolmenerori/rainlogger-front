import { Typography } from '@mui/material';

import type { RainLog } from '@/types/rainlogger';

interface CalendarTabProps {
  data: RainLog[];
}

export default function CalendarTab({ data }: CalendarTabProps) {
  return <Typography>Calendar placeholder – {data.length} records</Typography>;
}
