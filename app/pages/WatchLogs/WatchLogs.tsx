import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import EqualizerIcon from '@mui/icons-material/Equalizer';
import TableRowsIcon from '@mui/icons-material/TableRows';
import { Box, CircularProgress, Tab, Tabs, Typography } from '@mui/material';

import type { Route } from './+types/WatchLogs';

import BackButton from '@/components/BackButton/BackButton';
import RainlogFilters from '@/components/RainlogFilters/RainlogFilters';
import CalendarTab from '@/components/ViewTabs/CalendarTab/CalendarTab';
import GraphTab from '@/components/ViewTabs/GraphTab/GraphTab';
import TableTab from '@/components/ViewTabs/TableTab/TableTab';
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
  const [activeTab, setActiveTab] = useState(0);

  const { data, loading } = useApi(
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

  const rainLogs = data?.data.rainlog ?? [];

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

      {data && (
        <>
          <Tabs value={activeTab} onChange={(_, v) => setActiveTab(v)} sx={{ mt: 3 }}>
            <Tab
              icon={<TableRowsIcon />}
              iconPosition="start"
              label={t('pages.watchLogs.tabs.table')}
            />
            <Tab
              icon={<CalendarMonthIcon />}
              iconPosition="start"
              label={t('pages.watchLogs.tabs.calendar')}
            />
            <Tab
              icon={<EqualizerIcon />}
              iconPosition="start"
              label={t('pages.watchLogs.tabs.graph')}
            />
          </Tabs>

          {activeTab === 0 && <TableTab data={rainLogs} />}
          {activeTab === 1 && <CalendarTab data={rainLogs} />}
          {activeTab === 2 && <GraphTab data={rainLogs} />}
        </>
      )}
    </Box>
  );
}
