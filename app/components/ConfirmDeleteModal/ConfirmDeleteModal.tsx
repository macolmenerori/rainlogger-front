import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import CloseIcon from '@mui/icons-material/Close';
import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography
} from '@mui/material';

import { useAlert } from '@/context/AlertContext/AlertContext';
import { ApiError } from '@/services/apiClient';
import { deleteRainLog } from '@/services/rainloggerService';
import type { RainLog } from '@/types/rainlogger';

interface ConfirmDeleteModalProps {
  open: boolean;
  log: RainLog;
  onClose: () => void;
  onDataChange?: () => Promise<void>;
}

export default function ConfirmDeleteModal({
  open,
  log,
  onClose,
  onDataChange
}: ConfirmDeleteModalProps) {
  const { t } = useTranslation();
  const { showAlert } = useAlert();
  const [submitting, setSubmitting] = useState(false);

  const day = log.date.slice(8, 10);
  const monthNumber = String(Number(log.date.slice(5, 7)));
  const month = t(`pages.watchLogs.filters.months.${monthNumber}`);

  const handleDelete = async () => {
    setSubmitting(true);
    try {
      await deleteRainLog(log._id);
      showAlert(t('components.alert.deleteLog.success'), 'success');
      await onDataChange?.();
      onClose();
    } catch (err) {
      const message = err instanceof ApiError ? err.message : t('components.alert.deleteLog.error');
      showAlert(message, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onClose={submitting ? undefined : onClose} fullWidth maxWidth="sm">
      <DialogTitle
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        {t('components.confirmDeleteModal.deleteButton')}
        <IconButton aria-label="close" onClick={onClose} size="small" disabled={submitting}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        <Typography>{t('components.confirmDeleteModal.message', { day, month })}</Typography>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} disabled={submitting}>
          {t('components.confirmDeleteModal.cancelButton')}
        </Button>
        <Button variant="contained" color="error" onClick={handleDelete} disabled={submitting}>
          {submitting ? (
            <CircularProgress size={24} />
          ) : (
            t('components.confirmDeleteModal.deleteButton')
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
