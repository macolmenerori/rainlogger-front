import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { Box, Button, Card, TextField, Typography } from '@mui/material';

import type { Route } from './+types/Login';

import i18n from '@/ui/i18n/i18n';

interface LoginFormData {
  username: string;
  password: string;
}

export function meta(_args: Route.MetaArgs) {
  return [
    { title: `${i18n.t('pages.login.title')} - Rainlogger` },
    { name: 'description', content: 'Log in to your Rainlogger account.' }
  ];
}

export default function Login() {
  const { t } = useTranslation();
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<LoginFormData>();

  const handleLogin = (data: LoginFormData) => {
    console.log(data);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        px: 2
      }}
    >
      <Typography variant="h4" sx={{ mb: 3 }}>
        {t('pages.login.title')}
      </Typography>

      <Card sx={{ p: 4, width: '100%', maxWidth: 400 }}>
        <Box
          component="form"
          onSubmit={handleSubmit(handleLogin)}
          sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
        >
          <TextField
            fullWidth
            label={t('pages.login.loginCard.usernameLabel')}
            {...register('username', { minLength: 3 })}
            error={!!errors.username}
            helperText={errors.username ? t('pages.login.loginCard.errors.requiredField') : ''}
          />

          <TextField
            fullWidth
            type="password"
            label={t('pages.login.loginCard.passwordLabel')}
            {...register('password', { minLength: 3 })}
            error={!!errors.password}
            helperText={errors.password ? t('pages.login.loginCard.errors.requiredField') : ''}
          />

          <Button type="submit" variant="contained" fullWidth>
            {t('pages.login.loginCard.loginButton')}
          </Button>
        </Box>
      </Card>
    </Box>
  );
}
