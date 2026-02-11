import type { TFunction } from 'i18next';
import { z } from 'zod';

export const createWatchLogsSchema = (t: TFunction) =>
  z.object({
    month: z.string().min(1, t('pages.watchLogs.filters.errors.monthRequired')),
    year: z
      .string()
      .min(1, t('pages.watchLogs.filters.errors.yearMin'))
      .refine((val) => Number(val) >= 1970, t('pages.watchLogs.filters.errors.yearMin')),
    location: z.string().min(1, t('pages.watchLogs.filters.errors.locationRequired')),
    realReading: z.boolean()
  });

export type WatchLogsFormData = z.infer<ReturnType<typeof createWatchLogsSchema>>;
