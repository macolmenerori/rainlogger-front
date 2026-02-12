import { Typography } from '@mui/material';

import type { RainLog } from '@/types/rainlogger';

interface TableTabProps {
  data: RainLog[];
}

export default function TableTab({ data }: TableTabProps) {
  return <Typography>Table placeholder – {data.length} records</Typography>;
}
