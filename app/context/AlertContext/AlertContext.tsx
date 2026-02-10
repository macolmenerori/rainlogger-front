import { createContext, useCallback, useContext, useMemo, useState } from 'react';

import type { AlertColor } from '@mui/material';
import { Alert, Snackbar } from '@mui/material';

type AlertState = {
  open: boolean;
  message: string;
  severity: AlertColor;
};

type AlertContextType = {
  showAlert: (message: string, severity: AlertColor, duration?: number) => void;
};

const DEFAULT_DURATION = 5000;

const INITIAL_STATE: AlertState = {
  open: false,
  message: '',
  severity: 'info'
};

const AlertContext = createContext<AlertContextType | undefined>(undefined);

export function AlertProvider({ children }: { children: React.ReactNode }) {
  const [alert, setAlert] = useState<AlertState>(INITIAL_STATE);
  const [duration, setDuration] = useState(DEFAULT_DURATION);

  const showAlert = useCallback(
    (message: string, severity: AlertColor, autoHideDuration?: number) => {
      setAlert({ open: true, message, severity });
      setDuration(autoHideDuration ?? DEFAULT_DURATION);
    },
    []
  );

  const handleClose = useCallback((_event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') return;
    setAlert((prev) => ({ ...prev, open: false }));
  }, []);

  const value = useMemo(() => ({ showAlert }), [showAlert]);

  return (
    <AlertContext.Provider value={value}>
      {children}
      <Snackbar
        open={alert.open}
        autoHideDuration={duration}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={handleClose}
          severity={alert.severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {alert.message}
        </Alert>
      </Snackbar>
    </AlertContext.Provider>
  );
}

export function useAlert(): AlertContextType {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error('useAlert must be used within an AlertProvider');
  }
  return context;
}
