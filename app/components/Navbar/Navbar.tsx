import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router';

import LogoutIcon from '@mui/icons-material/Logout';
import MenuIcon from '@mui/icons-material/Menu';
import {
  AppBar,
  Box,
  Button,
  Drawer,
  IconButton,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme
} from '@mui/material';

import LanguageSwitcher from '@/components/LanguageSwitcher/LanguageSwitcher';
import { useUser } from '@/context/UserContext/UserContext';

export default function Navbar() {
  const { t } = useTranslation();
  const { logout } = useUser();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleDrawer = (open: boolean) => () => {
    setDrawerOpen(open);
  };

  return (
    <AppBar
      position="sticky"
      sx={{
        backgroundColor: 'background.paper',
        backgroundImage: 'none'
      }}
    >
      <Toolbar>
        <Link to="/" style={{ textDecoration: 'none' }}>
          <Typography variant="h6" sx={{ color: 'primary.main', fontWeight: 700 }}>
            {t('components.navbar.title')}
          </Typography>
        </Link>

        <Box sx={{ flexGrow: 1 }} />

        {isMobile ? (
          <>
            <IconButton color="inherit" aria-label="menu" onClick={toggleDrawer(true)}>
              <MenuIcon />
            </IconButton>
            <Drawer anchor="right" open={drawerOpen} onClose={toggleDrawer(false)}>
              <Box
                sx={{
                  width: 250,
                  p: 3,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 3
                }}
              >
                <LanguageSwitcher />
                <Button
                  variant="outlined"
                  startIcon={<LogoutIcon />}
                  onClick={handleLogout}
                  fullWidth
                >
                  {t('components.navbar.logout')}
                </Button>
              </Box>
            </Drawer>
          </>
        ) : (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <LanguageSwitcher />
            <Button
              variant="text"
              color="primary"
              startIcon={<LogoutIcon />}
              onClick={handleLogout}
            >
              {t('components.navbar.logout')}
            </Button>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
}
