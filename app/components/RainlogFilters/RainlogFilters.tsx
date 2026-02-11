import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { zodResolver } from '@hookform/resolvers/zod';
import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  TextField
} from '@mui/material';

import { env } from '@/config/env';
import {
  createWatchLogsSchema,
  type WatchLogsFormData
} from '@/services/validations/watchLogsValidationSchema';

interface RainlogFiltersProps {
  onSubmit: (data: WatchLogsFormData) => void;
}

const MONTHS = Array.from({ length: 12 }, (_, i) => String(i + 1));

export default function RainlogFilters({ onSubmit }: RainlogFiltersProps) {
  const { t } = useTranslation();
  const watchLogsSchema = createWatchLogsSchema(t);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors }
  } = useForm<WatchLogsFormData>({
    resolver: zodResolver(watchLogsSchema),
    defaultValues: {
      month: String(new Date().getMonth() + 1),
      year: String(new Date().getFullYear()),
      location: env.locationNames[0] ?? '',
      realReading: false
    }
  });

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 3,
        width: '100%',
        maxWidth: 800
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          gap: 2
        }}
      >
        <Controller
          name="month"
          control={control}
          render={({ field }) => (
            <FormControl sx={{ flex: 1 }} error={!!errors.month}>
              <InputLabel id="month-select-label">
                {t('pages.watchLogs.filters.monthLabel')}
              </InputLabel>
              <Select
                labelId="month-select-label"
                id="month-select"
                label={t('pages.watchLogs.filters.monthLabel')}
                {...field}
              >
                {MONTHS.map((m) => (
                  <MenuItem key={m} value={m}>
                    {t(`pages.watchLogs.filters.months.${m}`)}
                  </MenuItem>
                ))}
              </Select>
              {errors.month && <FormHelperText>{errors.month.message}</FormHelperText>}
            </FormControl>
          )}
        />

        <TextField
          sx={{ flex: 1 }}
          type="number"
          label={t('pages.watchLogs.filters.yearLabel')}
          slotProps={{ inputLabel: { shrink: true } }}
          error={!!errors.year}
          helperText={errors.year?.message}
          {...register('year')}
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
            <FormControl sx={{ flex: 1 }} error={!!errors.location}>
              <InputLabel id="location-select-label">
                {t('pages.watchLogs.filters.locationLabel')}
              </InputLabel>
              <Select
                labelId="location-select-label"
                id="location-select"
                label={t('pages.watchLogs.filters.locationLabel')}
                {...field}
              >
                {env.locationNames.map((name) => (
                  <MenuItem key={name} value={name}>
                    {name}
                  </MenuItem>
                ))}
              </Select>
              {errors.location && <FormHelperText>{errors.location.message}</FormHelperText>}
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
                label={t('pages.watchLogs.filters.realReadingLabel')}
              />
            )}
          />
        </Box>
      </Box>

      <Button type="submit" variant="contained" size="large" fullWidth>
        {t('pages.watchLogs.filters.submitButton')}
      </Button>
    </Box>
  );
}
