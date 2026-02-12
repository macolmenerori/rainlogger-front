import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import WaterDropIcon from '@mui/icons-material/WaterDrop';
import { Box, Paper, Typography } from '@mui/material';

import type { RainLog } from '@/types/rainlogger';

interface MonthlyRainfallProps {
  data: RainLog[];
}

export default function MonthlyRainfall({ data }: MonthlyRainfallProps) {
  const { t } = useTranslation();

  const totalRainfall = useMemo(
    () => parseFloat(data.reduce((sum, log) => sum + log.measurement, 0).toFixed(2)),
    [data]
  );

  return (
    <Paper
      elevation={1}
      sx={{
        mt: 3,
        px: 3,
        py: 2,
        borderRadius: 2,
        maxWidth: { xs: '100%', sm: 450 },
        width: '100%'
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 1
        }}
      >
        <WaterDropIcon color="primary" />
        <Typography variant="body1">{t('pages.watchLogs.totalRainfall.label')}</Typography>
        <Typography variant="h6" sx={{ fontWeight: 700, color: 'primary.main' }}>
          {totalRainfall} mm
        </Typography>
      </Box>
    </Paper>
  );
}
