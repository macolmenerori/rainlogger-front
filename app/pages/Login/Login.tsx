import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';

import { Alert, Box, Button, Card, CircularProgress, TextField, Typography } from '@mui/material';

import type { Route } from './+types/Login';

import { useUser } from '@/context/UserContext/UserContext';
import { login } from '@/services/authService';
import i18n from '@/ui/i18n/i18n';
import { tokenStorage } from '@/utils/tokenStorage';

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
  const { setUser } = useUser();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<LoginFormData>();

  const handleLogin = async (data: LoginFormData) => {
    setLoading(true);
    setError(null);

    try {
      const response = await login({ email: data.username, password: data.password });

      tokenStorage.setToken(response.token);
      setUser(response.data.user);
      navigate('/');
    } catch (err) {
      setError(
        err instanceof Error ? err.message : t('pages.login.loginCard.errors.invalidCredentials')
      );
    } finally {
      setLoading(false);
    }
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

          {error && <Alert severity="error">{error}</Alert>}

          <Button type="submit" variant="contained" fullWidth disabled={loading}>
            {loading ? <CircularProgress size={24} /> : t('pages.login.loginCard.loginButton')}
          </Button>
        </Box>
      </Card>
    </Box>
  );
}
