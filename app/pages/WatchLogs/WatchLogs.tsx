import { useTranslation } from 'react-i18next';

import { Box, Typography } from '@mui/material';

import type { Route } from './+types/WatchLogs';

import BackButton from '@/components/BackButton/BackButton';
import RainlogFilters from '@/components/RainlogFilters/RainlogFilters';
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

  const handleFilter = (data: WatchLogsFormData) => {
    console.log('Filter submitted:', data);
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
    </Box>
  );
}
