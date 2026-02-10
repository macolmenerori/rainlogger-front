import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';

import { Box, Button, Typography } from '@mui/material';

import type { Route } from './+types/MainPage';

import i18n from '@/ui/i18n/i18n';

export function meta(_args: Route.MetaArgs) {
  return [
    { title: `${i18n.t('pages.mainPage.title')} - Rainlogger` },
    { name: 'description', content: 'Log rainfall amounts accurately with Rainlogger.' }
  ];
}

export default function MainPage() {
  const { t } = useTranslation();

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 'calc(100vh - 64px)',
        px: 2,
        gap: 4
      }}
    >
      <Typography variant="h3" component="h1" sx={{ fontWeight: 700 }}>
        {t('pages.mainPage.title')}
      </Typography>
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          gap: 2
        }}
      >
        <Button variant="contained" size="large" component={Link} to="/newlog">
          {t('pages.mainPage.buttons.newLog')}
        </Button>
        <Button variant="contained" size="large" component={Link} to="/watchlogs">
          {t('pages.mainPage.buttons.watchLogs')}
        </Button>
      </Box>
    </Box>
  );
}
