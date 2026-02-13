import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { zodResolver } from '@hookform/resolvers/zod';
import CloseIcon from '@mui/icons-material/Close';
import {
  Box,
  Button,
  Checkbox,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  IconButton,
  TextField
} from '@mui/material';

import { useAlert } from '@/context/AlertContext/AlertContext';
import { ApiError } from '@/services/apiClient';
import { updateRainLog } from '@/services/rainloggerService';
import {
  createUpdateLogSchema,
  type UpdateLogFormData
} from '@/services/validations/updateLogValidationSchema';
import type { RainLog } from '@/types/rainlogger';

interface UpdateLogModalProps {
  open: boolean;
  log: RainLog;
  onClose: () => void;
  onDataChange?: () => Promise<void>;
}

export default function UpdateLogModal({ open, log, onClose, onDataChange }: UpdateLogModalProps) {
  const { t } = useTranslation();
  const { showAlert } = useAlert();
  const [submitting, setSubmitting] = useState(false);
  const updateLogSchema = createUpdateLogSchema(t);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isDirty, isValid }
  } = useForm<UpdateLogFormData>({
    resolver: zodResolver(updateLogSchema),
    defaultValues: {
      measurement: String(log.measurement),
      realReading: log.realReading
    },
    mode: 'onChange'
  });

  const onSubmit = async (data: UpdateLogFormData) => {
    setSubmitting(true);
    try {
      await updateRainLog({
        ...log,
        date: log.date.slice(0, 10),
        measurement: Number(data.measurement),
        realReading: data.realReading
      });
      showAlert(t('components.alert.updateLog.success'), 'success');
      await onDataChange?.();
      onClose();
    } catch (err) {
      const message = err instanceof ApiError ? err.message : t('components.alert.updateLog.error');
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
        {t('components.updateLogModal.title')}
        <IconButton aria-label="close" onClick={onClose} size="small" disabled={submitting}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        <Box
          component="form"
          id="update-log-form"
          onSubmit={handleSubmit(onSubmit)}
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            gap: 2,
            alignItems: { sm: 'center' },
            pt: 1
          }}
        >
          <TextField
            fullWidth
            type="number"
            label={t('components.updateLogModal.measurementLabel')}
            slotProps={{
              inputLabel: { shrink: true },
              input: { inputProps: { step: '0.01' } }
            }}
            error={!!errors.measurement}
            helperText={errors.measurement?.message}
            disabled={submitting}
            {...register('measurement')}
          />

          <Box sx={{ flex: 'none' }}>
            <Controller
              name="realReading"
              control={control}
              render={({ field: { value, onChange, ...field } }) => (
                <FormControlLabel
                  control={<Checkbox checked={value} onChange={onChange} {...field} />}
                  label={t('components.updateLogModal.realReadingLabel')}
                  disabled={submitting}
                />
              )}
            />
          </Box>
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} disabled={submitting}>
          {t('components.updateLogModal.cancelButton')}
        </Button>
        <Button
          type="submit"
          form="update-log-form"
          variant="contained"
          disabled={!isDirty || !isValid || submitting}
        >
          {submitting ? (
            <CircularProgress size={24} />
          ) : (
            t('components.updateLogModal.updateButton')
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
