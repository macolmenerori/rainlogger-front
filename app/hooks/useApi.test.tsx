import { act, renderHook, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { useApi } from './useApi';

import { ApiError } from '@/services/apiClient';

describe('useApi', () => {
  it('fetches data and returns it', async () => {
    const mockData = { id: 1, name: 'Test' };
    const apiCall = vi.fn().mockResolvedValue(mockData);

    const { result } = renderHook(() => useApi(apiCall));

    expect(result.current.loading).toBe(true);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.data).toEqual(mockData);
    expect(result.current.error).toBeNull();
    expect(apiCall).toHaveBeenCalledOnce();
  });

  it('sets error state when API call fails with ApiError', async () => {
    const apiError = new ApiError('Not found', 404);
    const apiCall = vi.fn().mockRejectedValue(apiError);

    const { result } = renderHook(() => useApi(apiCall));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.data).toBeNull();
    expect(result.current.error).toBe(apiError);
    expect(result.current.error?.status).toBe(404);
  });

  it('wraps non-ApiError errors into ApiError with status 0', async () => {
    const apiCall = vi.fn().mockRejectedValue(new Error('Network failure'));

    const { result } = renderHook(() => useApi(apiCall));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBeInstanceOf(ApiError);
    expect(result.current.error?.message).toBe('Network failure');
    expect(result.current.error?.status).toBe(0);
  });

  it('skips fetching when skip is true', async () => {
    const apiCall = vi.fn().mockResolvedValue({ data: 'test' });

    const { result } = renderHook(() => useApi(apiCall, [], true));

    expect(result.current.loading).toBe(false);
    expect(result.current.data).toBeNull();
    expect(apiCall).not.toHaveBeenCalled();
  });

  it('refetch re-calls the API', async () => {
    const apiCall = vi.fn().mockResolvedValueOnce({ count: 1 }).mockResolvedValueOnce({ count: 2 });

    const { result } = renderHook(() => useApi(apiCall));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.data).toEqual({ count: 1 });

    await act(() => result.current.refetch());

    await waitFor(() => {
      expect(result.current.data).toEqual({ count: 2 });
    });
    expect(apiCall).toHaveBeenCalledTimes(2);
  });

  it('clears previous error on successful refetch', async () => {
    const apiCall = vi
      .fn()
      .mockRejectedValueOnce(new ApiError('Server error', 500))
      .mockResolvedValueOnce({ data: 'recovered' });

    const { result } = renderHook(() => useApi(apiCall));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBeInstanceOf(ApiError);

    await act(() => result.current.refetch());

    await waitFor(() => {
      expect(result.current.error).toBeNull();
    });
    expect(result.current.data).toEqual({ data: 'recovered' });
  });

  it('resets state when skip changes to true', async () => {
    const apiCall = vi.fn().mockResolvedValue({ data: 'test' });

    const { result, rerender } = renderHook(({ skip }) => useApi(apiCall, [], skip), {
      initialProps: { skip: false }
    });

    await waitFor(() => {
      expect(result.current.data).toEqual({ data: 'test' });
    });

    rerender({ skip: true });

    expect(result.current.data).toBeNull();
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });
});
