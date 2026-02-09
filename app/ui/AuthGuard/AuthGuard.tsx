import { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router';

import { Box, CircularProgress } from '@mui/material';

import Navbar from '@/components/Navbar/Navbar';
import { useUser } from '@/context/UserContext/UserContext';
import { isLoggedIn } from '@/services/authService';

export default function AuthGuard() {
  const { setUser } = useUser();
  const [auth, setAuth] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await isLoggedIn();
        setUser(response.data.user);
        setAuth(true);
      } catch {
        setAuth(false);
      }
    };

    checkAuth();
  }, [setUser]);

  if (auth === null) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh'
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return auth ? (
    <>
      <Navbar />
      <Outlet />
    </>
  ) : (
    <Navigate to="/login" replace />
  );
}
