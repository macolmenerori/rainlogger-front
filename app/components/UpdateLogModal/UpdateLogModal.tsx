import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { zodResolver } from '@hookform/resolvers/zod';
import CloseIcon from '@mui/icons-material/Close';
import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  IconButton,
  TextField
} from '@mui/material';

import {
  createUpdateLogSchema,
  type UpdateLogFormData
} from '@/services/validations/updateLogValidationSchema';
import type { RainLog } from '@/types/rainlogger';

interface UpdateLogModalProps {
  open: boolean;
  log: RainLog;
  onClose: () => void;
}

export default function UpdateLogModal({ open, log, onClose }: UpdateLogModalProps) {
  const { t } = useTranslation();
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

  const onSubmit = (data: UpdateLogFormData) => {
    console.log('Update:', log._id, data);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        {t('components.updateLogModal.title')}
        <IconButton aria-label="close" onClick={onClose} size="small">
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
                />
              )}
            />
          </Box>
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>{t('components.updateLogModal.cancelButton')}</Button>
        <Button
          type="submit"
          form="update-log-form"
          variant="contained"
          disabled={!isDirty || !isValid}
        >
          {t('components.updateLogModal.updateButton')}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
