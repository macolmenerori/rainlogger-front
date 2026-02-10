import { apiGet } from './apiClient';

import { env } from '@/config/env';
import type { ApiResponse } from '@/types/api';
import type { RainLog } from '@/types/rainlogger';

type RainLogResponse = {
  rainlogs: RainLog[];
};

export async function getRainLogs(
  startDate: string,
  endDate: string,
  location: string,
  realReading: boolean
): Promise<ApiResponse<RainLogResponse>> {
  const params = {
    dateFrom: startDate,
    dateTo: endDate,
    location,
    realReading: String(realReading)
  };

  return apiGet<ApiResponse<RainLogResponse>>(
    env.baseUrlRainlogger,
    '/v1/rainlogger/rainlog/filters',
    params,
    { retries: 3, retryDelay: 2000 }
  );
}

export async function getRainLogsByDay(
  date: string,
  location: string,
  realReading: boolean
): Promise<ApiResponse<RainLogResponse>> {
  const params = {
    date,
    location,
    realReading: String(realReading)
  };

  return apiGet<ApiResponse<RainLogResponse>>(
    env.baseUrlRainlogger,
    '/v1/rainlogger/rainlog/filters',
    params,
    { retries: 3, retryDelay: 2000 }
  );
}
