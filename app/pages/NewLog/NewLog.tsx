import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography
} from '@mui/material';

import type { Route } from './+types/NewLog';

import BackButton from '@/components/BackButton/BackButton';
import { env } from '@/config/env';
import i18n from '@/ui/i18n/i18n';

interface NewLogFormData {
  date: string;
  measurement: string;
  location: string;
  realReading: boolean;
}

function getTodayDate(): string {
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const dd = String(today.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

export function meta(_args: Route.MetaArgs) {
  return [
    { title: `${i18n.t('pages.newLog.title')} - Rainlogger` },
    { name: 'description', content: 'Create a new rainfall log entry.' }
  ];
}

export default function NewLog() {
  const { t } = useTranslation();

  const { register, handleSubmit, control } = useForm<NewLogFormData>({
    defaultValues: {
      date: getTodayDate(),
      measurement: '',
      location: env.locationNames[0] ?? '',
      realReading: false
    }
  });

  const newRainlogHandler = (data: NewLogFormData) => {
    console.log('New rain log:', data);
  };

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
        {t('pages.newLog.title')}
      </Typography>

      <Box
        component="form"
        onSubmit={handleSubmit(newRainlogHandler)}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 3,
          width: '100%',
          maxWidth: 600
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            gap: 2
          }}
        >
          <TextField
            fullWidth
            type="date"
            label={t('pages.newLog.form.dateLabel')}
            slotProps={{ inputLabel: { shrink: true } }}
            {...register('date')}
          />
          <TextField
            fullWidth
            type="number"
            label={t('pages.newLog.form.measurementLabel')}
            slotProps={{ inputLabel: { shrink: true }, input: { inputProps: { step: '0.01' } } }}
            {...register('measurement')}
          />
        </Box>

        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            gap: 2,
            alignItems: { sm: 'center' }
          }}
        >
          <Controller
            name="location"
            control={control}
            render={({ field }) => (
              <FormControl sx={{ flex: 1 }}>
                <InputLabel id="location-select-label">
                  {t('pages.newLog.form.locationLabel')}
                </InputLabel>
                <Select
                  labelId="location-select-label"
                  id="location-select"
                  label={t('pages.newLog.form.locationLabel')}
                  {...field}
                >
                  {env.locationNames.map((name) => (
                    <MenuItem key={name} value={name}>
                      {name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
          />
          <Box sx={{ flex: 1 }}>
            <Controller
              name="realReading"
              control={control}
              render={({ field: { value, onChange, ...field } }) => (
                <FormControlLabel
                  control={<Checkbox checked={value} onChange={onChange} {...field} />}
                  label={t('pages.newLog.form.realReadingLabel')}
                />
              )}
            />
          </Box>
        </Box>

        <Button type="submit" variant="contained" size="large" fullWidth>
          {t('pages.newLog.submitButton')}
        </Button>
      </Box>
    </Box>
  );
}
