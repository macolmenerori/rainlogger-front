import type { TFunction } from 'i18next';
import { z } from 'zod';

export const createUpdateLogSchema = (t: TFunction) =>
  z.object({
    measurement: z
      .string()
      .min(1, t('components.updateLogModal.errors.measurementRequired'))
      .refine((val) => Number(val) >= 0, t('components.updateLogModal.errors.measurementMin'))
      .refine((val) => {
        const parts = val.split('.');
        return !parts[1] || parts[1].length <= 2;
      }, t('components.updateLogModal.errors.measurementDecimals')),
    realReading: z.boolean()
  });

export type UpdateLogFormData = z.infer<ReturnType<typeof createUpdateLogSchema>>;
