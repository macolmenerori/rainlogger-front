import type { TFunction } from 'i18next';
import { z } from 'zod';

export const createNewLogSchema = (t: TFunction) =>
  z.object({
    date: z.string().min(1, t('pages.newLog.form.errors.dateRequired')),
    measurement: z
      .string()
      .min(1, t('pages.newLog.form.errors.measurementRequired'))
      .refine((val) => Number(val) >= 0, t('pages.newLog.form.errors.measurementMin'))
      .refine((val) => {
        const parts = val.split('.');
        return !parts[1] || parts[1].length <= 2;
      }, t('pages.newLog.form.errors.measurementDecimals')),
    location: z.string().min(1, t('pages.newLog.form.errors.locationRequired')),
    realReading: z.boolean()
  });

export type NewLogFormData = z.infer<ReturnType<typeof createNewLogSchema>>;
