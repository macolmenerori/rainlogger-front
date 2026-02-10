import { useCallback, useEffect, useState } from 'react';

import { ApiError } from '@/services/apiClient';

export interface UseApiReturn<T> {
  data: T | null;
  loading: boolean;
  error: ApiError | null;
  refetch: () => Promise<void>;
}

export function useApi<T>(
  apiCall: () => Promise<T>,
  dependencies: unknown[] = [],
  skip: boolean = false
): UseApiReturn<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(!skip);
  const [error, setError] = useState<ApiError | null>(null);

  const fetchData = useCallback(async () => {
    if (skip) return;
    try {
      setLoading(true);
      setError(null);
      const result = await apiCall();
      setData(result);
    } catch (err) {
      const apiError =
        err instanceof ApiError
          ? err
          : new ApiError(err instanceof Error ? err.message : String(err), 0);
      setError(apiError);
    } finally {
      setLoading(false);
    }
  }, [apiCall, skip]);

  useEffect(() => {
    if (!skip) {
      fetchData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...dependencies, skip]);

  useEffect(() => {
    if (skip) {
      setData(null);
      setError(null);
      setLoading(false);
    }
  }, [skip]);

  return { data, loading, error, refetch: fetchData };
}
