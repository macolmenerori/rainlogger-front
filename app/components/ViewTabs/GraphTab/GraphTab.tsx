import { Typography } from '@mui/material';

import type { RainLog } from '@/types/rainlogger';

interface GraphTabProps {
  data: RainLog[];
}

export default function GraphTab({ data }: GraphTabProps) {
  return <Typography>Graph placeholder – {data.length} records</Typography>;
}
