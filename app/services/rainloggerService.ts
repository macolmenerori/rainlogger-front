import { apiGet, apiPost } from './apiClient';

import { env } from '@/config/env';
import type { ApiResponse } from '@/types/api';
import type { RainLog } from '@/types/rainlogger';

export async function getRainLogs(
  startDate: string,
  endDate: string,
  location: string,
  realReading: boolean
): Promise<ApiResponse<{ rainlog: RainLog[] }>> {
  const params = {
    dateFrom: startDate,
    dateTo: endDate,
    location,
    realReading: String(realReading)
  };

  return apiGet<ApiResponse<{ rainlog: RainLog[] }>>(
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
): Promise<ApiResponse<{ rainlog: RainLog[] }>> {
  const params = {
    date,
    location,
    realReading: String(realReading)
  };

  return apiGet<ApiResponse<{ rainlog: RainLog[] }>>(
    env.baseUrlRainlogger,
    '/v1/rainlogger/rainlog/filters',
    params,
    { retries: 3, retryDelay: 2000 }
  );
}

export async function getRainLogsByMonth(
  month: number,
  year: number,
  location: string,
  realReading: boolean
): Promise<ApiResponse<{ rainlog: RainLog[] }>> {
  const firstDay = new Date(year, month - 1, 1);
  const lastDay = new Date(year, month, 0);

  const pad = (n: number) => String(n).padStart(2, '0');

  const dateFrom = `${firstDay.getFullYear()}-${pad(firstDay.getMonth() + 1)}-${pad(firstDay.getDate())}`;
  const dateTo = `${lastDay.getFullYear()}-${pad(lastDay.getMonth() + 1)}-${pad(lastDay.getDate())}`;

  const params: Record<string, string> = {
    dateFrom,
    dateTo,
    location
  };

  if (realReading) {
    params.realReading = String(realReading);
  }

  return apiGet<ApiResponse<{ rainlog: RainLog[] }>>(
    env.baseUrlRainlogger,
    '/v1/rainlogger/rainlog/filters',
    params,
    { retries: 3, retryDelay: 2000 }
  );
}

export async function postRainLog(
  rainlog: Omit<RainLog, '_id' | 'timestamp' | 'loggedBy'>
): Promise<ApiResponse<{ rainlog: RainLog }>> {
  return apiPost<ApiResponse<{ rainlog: RainLog }>>(
    env.baseUrlRainlogger,
    '/v1/rainlogger/rainlog',
    rainlog
  );
}
