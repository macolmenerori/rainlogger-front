import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Box, CircularProgress, Typography } from '@mui/material';

import type { Route } from './+types/WatchLogs';

import BackButton from '@/components/BackButton/BackButton';
import RainlogFilters from '@/components/RainlogFilters/RainlogFilters';
import { useAlert } from '@/context/AlertContext/AlertContext';
import { useApi } from '@/hooks/useApi';
import { ApiError } from '@/services/apiClient';
import { getRainLogsByMonth } from '@/services/rainloggerService';
import type { WatchLogsFormData } from '@/services/validations/watchLogsValidationSchema';
import i18n from '@/ui/i18n/i18n';

export function meta(_args: Route.MetaArgs) {
  return [
    { title: `${i18n.t('pages.watchLogs.title')} - Rainlogger` },
    { name: 'description', content: 'View and browse rainfall log entries.' }
  ];
}

export default function WatchLogs() {
  const { t } = useTranslation();
  const { showAlert } = useAlert();
  const [filterParams, setFilterParams] = useState<WatchLogsFormData | null>(null);

  const { loading } = useApi(
    () =>
      getRainLogsByMonth(
        Number(filterParams!.month),
        Number(filterParams!.year),
        filterParams!.location,
        filterParams!.realReading
      ),
    [filterParams],
    {
      skip: !filterParams,
      onError: (err) => {
        const message =
          err instanceof ApiError ? err.message : t('components.alert.watchLogs.error');
        showAlert(message, 'error');
      }
    }
  );

  const handleFilter = (data: WatchLogsFormData) => {
    setFilterParams(data);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        minHeight: 'calc(100vh - 64px)',
        px: 2,
        py: 3
      }}
    >
      <Box sx={{ alignSelf: 'flex-start' }}>
        <BackButton to="/" />
      </Box>

      <Typography variant="h3" component="h1" sx={{ fontWeight: 700, mb: 4 }}>
        {t('pages.watchLogs.title')}
      </Typography>

      <RainlogFilters onSubmit={handleFilter} />

      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      )}
    </Box>
  );
}
