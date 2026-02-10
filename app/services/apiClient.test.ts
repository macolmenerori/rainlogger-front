import { delay as mswDelay, http, HttpResponse } from 'msw';
import { afterEach, describe, expect, it } from 'vitest';

import { apiDelete, ApiError, apiGet, apiPatch, apiPost, apiPut } from '@/services/apiClient';
import { server } from '@/test/mocks/server';
import { tokenStorage } from '@/utils/tokenStorage';

const BASE_URL = 'http://localhost:3000/api';

describe('apiClient', () => {
  afterEach(() => {
    tokenStorage.removeToken();
  });

  describe('apiGet', () => {
    it('makes a GET request and returns parsed JSON', async () => {
      const mockResponse = { data: 'test', message: 'ok', success: true };
      server.use(
        http.get(`${BASE_URL}/v1/test/resource`, () => {
          return HttpResponse.json(mockResponse);
        })
      );

      const result = await apiGet(BASE_URL, '/v1/test/resource');
      expect(result).toEqual(mockResponse);
    });

    it('includes Authorization header when token exists', async () => {
      tokenStorage.setToken('test-jwt-token');
      server.use(
        http.get(`${BASE_URL}/v1/test/auth-check`, ({ request }) => {
          const authHeader = request.headers.get('Authorization');
          return HttpResponse.json({ hasAuth: authHeader === 'Bearer test-jwt-token' });
        })
      );

      const result = await apiGet<{ hasAuth: boolean }>(BASE_URL, '/v1/test/auth-check');
      expect(result.hasAuth).toBe(true);
    });

    it('does not include Authorization header when no token exists', async () => {
      server.use(
        http.get(`${BASE_URL}/v1/test/no-auth`, ({ request }) => {
          const authHeader = request.headers.get('Authorization');
          return HttpResponse.json({ hasAuth: !!authHeader });
        })
      );

      const result = await apiGet<{ hasAuth: boolean }>(BASE_URL, '/v1/test/no-auth');
      expect(result.hasAuth).toBe(false);
    });

    it('appends query params to URL', async () => {
      server.use(
        http.get(`${BASE_URL}/v1/test/search`, ({ request }) => {
          const url = new URL(request.url);
          return HttpResponse.json({
            page: url.searchParams.get('page'),
            limit: url.searchParams.get('limit')
          });
        })
      );

      const result = await apiGet<{ page: string; limit: string }>(BASE_URL, '/v1/test/search', {
        page: '1',
        limit: '10'
      });
      expect(result.page).toBe('1');
      expect(result.limit).toBe('10');
    });

    it('throws ApiError with message from response body on 4xx', async () => {
      server.use(
        http.get(`${BASE_URL}/v1/test/not-found`, () => {
          return HttpResponse.json({ message: 'Resource not found' }, { status: 404 });
        })
      );

      await expect(apiGet(BASE_URL, '/v1/test/not-found')).rejects.toThrow(ApiError);

      try {
        await apiGet(BASE_URL, '/v1/test/not-found');
      } catch (error) {
        expect(error).toBeInstanceOf(ApiError);
        expect((error as ApiError).status).toBe(404);
        expect((error as ApiError).message).toBe('Resource not found');
        expect((error as ApiError).data).toEqual({ message: 'Resource not found' });
      }
    });

    it('throws ApiError with fallback message when response has no message', async () => {
      server.use(
        http.get(`${BASE_URL}/v1/test/bad`, () => {
          return HttpResponse.json({ error: 'something' }, { status: 400 });
        })
      );

      try {
        await apiGet(BASE_URL, '/v1/test/bad');
      } catch (error) {
        expect(error).toBeInstanceOf(ApiError);
        expect((error as ApiError).message).toBe('Request failed with status 400');
      }
    });

    it('throws ApiError on 5xx', async () => {
      server.use(
        http.get(`${BASE_URL}/v1/test/server-error`, () => {
          return HttpResponse.json({ message: 'Internal server error' }, { status: 500 });
        })
      );

      await expect(apiGet(BASE_URL, '/v1/test/server-error')).rejects.toThrow(ApiError);
    });
  });

  describe('apiPost', () => {
    it('makes a POST request with JSON body and returns parsed JSON', async () => {
      server.use(
        http.post(`${BASE_URL}/v1/test/create`, async ({ request }) => {
          const body = await request.json();
          return HttpResponse.json({ created: true, received: body });
        })
      );

      const result = await apiPost<{ created: boolean; received: unknown }>(
        BASE_URL,
        '/v1/test/create',
        { name: 'test' }
      );
      expect(result.created).toBe(true);
      expect(result.received).toEqual({ name: 'test' });
    });

    it('sends Content-Type application/json header', async () => {
      server.use(
        http.post(`${BASE_URL}/v1/test/headers`, ({ request }) => {
          const contentType = request.headers.get('Content-Type');
          return HttpResponse.json({ contentType });
        })
      );

      const result = await apiPost<{ contentType: string }>(BASE_URL, '/v1/test/headers', {
        data: 'test'
      });
      expect(result.contentType).toBe('application/json');
    });

    it('works with no body', async () => {
      server.use(
        http.post(`${BASE_URL}/v1/test/no-body`, () => {
          return HttpResponse.json({ ok: true });
        })
      );

      const result = await apiPost<{ ok: boolean }>(BASE_URL, '/v1/test/no-body');
      expect(result.ok).toBe(true);
    });
  });

  describe('apiPut', () => {
    it('makes a PUT request with JSON body', async () => {
      server.use(
        http.put(`${BASE_URL}/v1/test/update`, async ({ request }) => {
          const body = await request.json();
          return HttpResponse.json({ updated: true, received: body });
        })
      );

      const result = await apiPut<{ updated: boolean; received: unknown }>(
        BASE_URL,
        '/v1/test/update',
        { name: 'updated' }
      );
      expect(result.updated).toBe(true);
      expect(result.received).toEqual({ name: 'updated' });
    });
  });

  describe('apiPatch', () => {
    it('makes a PATCH request with JSON body', async () => {
      server.use(
        http.patch(`${BASE_URL}/v1/test/patch`, async ({ request }) => {
          const body = await request.json();
          return HttpResponse.json({ patched: true, received: body });
        })
      );

      const result = await apiPatch<{ patched: boolean; received: unknown }>(
        BASE_URL,
        '/v1/test/patch',
        { field: 'value' }
      );
      expect(result.patched).toBe(true);
      expect(result.received).toEqual({ field: 'value' });
    });
  });

  describe('apiDelete', () => {
    it('makes a DELETE request', async () => {
      server.use(
        http.delete(`${BASE_URL}/v1/test/remove`, () => {
          return HttpResponse.json({ deleted: true });
        })
      );

      const result = await apiDelete<{ deleted: boolean }>(BASE_URL, '/v1/test/remove');
      expect(result.deleted).toBe(true);
    });
  });

  describe('custom headers', () => {
    it('allows adding custom headers', async () => {
      server.use(
        http.post(`${BASE_URL}/v1/test/custom-headers`, ({ request }) => {
          const customHeader = request.headers.get('authorizationType');
          return HttpResponse.json({ customHeader });
        })
      );

      const result = await apiPost<{ customHeader: string }>(
        BASE_URL,
        '/v1/test/custom-headers',
        { data: 'test' },
        { headers: { authorizationType: 'bearer' } }
      );
      expect(result.customHeader).toBe('bearer');
    });

    it('custom headers merge with defaults', async () => {
      tokenStorage.setToken('my-token');
      server.use(
        http.post(`${BASE_URL}/v1/test/merged-headers`, ({ request }) => {
          return HttpResponse.json({
            contentType: request.headers.get('Content-Type'),
            authorization: request.headers.get('Authorization'),
            custom: request.headers.get('X-Custom')
          });
        })
      );

      const result = await apiPost<{
        contentType: string;
        authorization: string;
        custom: string;
      }>(
        BASE_URL,
        '/v1/test/merged-headers',
        { data: 'test' },
        {
          headers: { 'X-Custom': 'custom-value' }
        }
      );
      expect(result.contentType).toBe('application/json');
      expect(result.authorization).toBe('Bearer my-token');
      expect(result.custom).toBe('custom-value');
    });
  });

  describe('timeout', () => {
    it('aborts request when timeout is exceeded', async () => {
      server.use(
        http.get(`${BASE_URL}/v1/test/slow`, async () => {
          await mswDelay(5000);
          return HttpResponse.json({ ok: true });
        })
      );

      await expect(apiGet(BASE_URL, '/v1/test/slow', undefined, { timeout: 10 })).rejects.toThrow();
    });
  });

  describe('retry logic', () => {
    it('retries on 500 and succeeds on subsequent attempt', async () => {
      let callCount = 0;
      server.use(
        http.get(`${BASE_URL}/v1/test/flaky`, () => {
          callCount++;
          if (callCount === 1) {
            return HttpResponse.json({ message: 'Server error' }, { status: 500 });
          }
          return HttpResponse.json({ data: 'success' });
        })
      );

      const result = await apiGet<{ data: string }>(BASE_URL, '/v1/test/flaky', undefined, {
        retries: 2,
        retryDelay: 10
      });
      expect(result.data).toBe('success');
      expect(callCount).toBe(2);
    });

    it('retries on 503 status', async () => {
      let callCount = 0;
      server.use(
        http.get(`${BASE_URL}/v1/test/unavailable`, () => {
          callCount++;
          if (callCount <= 2) {
            return HttpResponse.json({ message: 'Unavailable' }, { status: 503 });
          }
          return HttpResponse.json({ data: 'recovered' });
        })
      );

      const result = await apiGet<{ data: string }>(BASE_URL, '/v1/test/unavailable', undefined, {
        retries: 3,
        retryDelay: 10
      });
      expect(result.data).toBe('recovered');
      expect(callCount).toBe(3);
    });

    it('does NOT retry on 400 status', async () => {
      let callCount = 0;
      server.use(
        http.get(`${BASE_URL}/v1/test/bad-request`, () => {
          callCount++;
          return HttpResponse.json({ message: 'Bad request' }, { status: 400 });
        })
      );

      await expect(
        apiGet(BASE_URL, '/v1/test/bad-request', undefined, { retries: 2, retryDelay: 10 })
      ).rejects.toThrow(ApiError);
      expect(callCount).toBe(1);
    });

    it('does NOT retry on 401 status', async () => {
      let callCount = 0;
      server.use(
        http.get(`${BASE_URL}/v1/test/unauthorized`, () => {
          callCount++;
          return HttpResponse.json({ message: 'Unauthorized' }, { status: 401 });
        })
      );

      await expect(
        apiGet(BASE_URL, '/v1/test/unauthorized', undefined, { retries: 2, retryDelay: 10 })
      ).rejects.toThrow(ApiError);
      expect(callCount).toBe(1);
    });

    it('does NOT retry on 404 status', async () => {
      let callCount = 0;
      server.use(
        http.get(`${BASE_URL}/v1/test/missing`, () => {
          callCount++;
          return HttpResponse.json({ message: 'Not found' }, { status: 404 });
        })
      );

      await expect(
        apiGet(BASE_URL, '/v1/test/missing', undefined, { retries: 2, retryDelay: 10 })
      ).rejects.toThrow(ApiError);
      expect(callCount).toBe(1);
    });

    it('respects max retries count', async () => {
      let callCount = 0;
      server.use(
        http.get(`${BASE_URL}/v1/test/always-fails`, () => {
          callCount++;
          return HttpResponse.json({ message: 'Server error' }, { status: 500 });
        })
      );

      await expect(
        apiGet(BASE_URL, '/v1/test/always-fails', undefined, { retries: 2, retryDelay: 10 })
      ).rejects.toThrow(ApiError);
      // 1 initial + 2 retries = 3 total attempts
      expect(callCount).toBe(3);
    });
  });

  describe('ApiError', () => {
    it('has correct name, status, message, and data properties', () => {
      const error = new ApiError('Test error', 422, { field: 'invalid' });
      expect(error.name).toBe('ApiError');
      expect(error.status).toBe(422);
      expect(error.message).toBe('Test error');
      expect(error.data).toEqual({ field: 'invalid' });
      expect(error).toBeInstanceOf(Error);
    });
  });
});
