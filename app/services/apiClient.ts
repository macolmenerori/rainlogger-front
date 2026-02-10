import { tokenStorage } from '@/utils/tokenStorage';

/**
 * Request configuration options
 */
export interface RequestConfig extends RequestInit {
  timeout?: number;
  retries?: number;
  retryDelay?: number;
}

/**
 * Custom error class for API errors with status code and response data
 */
export class ApiError extends Error {
  public status: number;
  public data: unknown;

  constructor(message: string, status: number, data?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

/**
 * Default timeout for API requests (30 seconds)
 */
const DEFAULT_TIMEOUT = 30_000;

/**
 * Default number of retry attempts
 */
const DEFAULT_RETRIES = 0;

/**
 * Default delay between retries (1 second)
 */
const DEFAULT_RETRY_DELAY = 1_000;

/**
 * Retryable HTTP status codes
 */
const RETRYABLE_STATUSES = [408, 429, 500, 502, 503, 504];

const buildUrl = (baseUrl: string, endpoint: string, params?: Record<string, string>): string => {
  const url = `${baseUrl}${endpoint}`;
  if (!params) return url;

  const queryString = new URLSearchParams(params).toString();
  return queryString ? `${url}?${queryString}` : url;
};

const buildHeaders = (customHeaders?: HeadersInit): Record<string, string> => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json'
  };

  const token = tokenStorage.getToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  if (customHeaders) {
    const entries =
      customHeaders instanceof Headers
        ? Array.from(customHeaders.entries())
        : Array.isArray(customHeaders)
          ? customHeaders
          : Object.entries(customHeaders);
    for (const [key, value] of entries) {
      headers[key] = value;
    }
  }

  return headers;
};

/**
 * Handles HTTP response and throws ApiError for non-ok responses
 */
const handleResponse = async <T>(response: Response): Promise<T> => {
  if (!response.ok) {
    let data: unknown;
    try {
      data = await response.json();
    } catch {
      // Response body is not JSON
    }

    const message =
      (data &&
      typeof data === 'object' &&
      'message' in data &&
      typeof (data as { message: unknown }).message === 'string'
        ? (data as { message: string }).message
        : undefined) ?? `Request failed with status ${response.status}`;

    throw new ApiError(message, response.status, data);
  }

  // Handle empty responses (204 No Content, etc.)
  const contentType = response.headers.get('content-type');
  const contentLength = response.headers.get('content-length');

  if (
    response.status === 204 ||
    contentLength === '0' ||
    !contentType?.includes('application/json')
  ) {
    return undefined as T;
  }

  return (await response.json()) as T;
};

/**
 * Creates a fetch request with timeout support using AbortController
 */
const fetchWithTimeout = (
  url: string,
  options: RequestInit,
  timeout: number
): Promise<Response> => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  return fetch(url, { ...options, signal: controller.signal }).finally(() => {
    clearTimeout(timeoutId);
  });
};

const delay = (ms: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

const shouldRetry = (error: unknown): boolean => {
  if (error instanceof ApiError) {
    return RETRYABLE_STATUSES.includes(error.status);
  }

  // Network errors (TypeError: Failed to fetch) and abort errors
  return error instanceof TypeError || error instanceof DOMException;
};

/**
 * Core API request function with retry logic and timeout support
 */
const apiRequest = async <T>(url: string, config: RequestConfig = {}): Promise<T> => {
  const {
    timeout = DEFAULT_TIMEOUT,
    retries = DEFAULT_RETRIES,
    retryDelay = DEFAULT_RETRY_DELAY,
    headers: customHeaders,
    ...fetchOptions
  } = config;

  const mergedHeaders = buildHeaders(customHeaders as HeadersInit | undefined);
  let lastError: unknown;

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const response = await fetchWithTimeout(
        url,
        { ...fetchOptions, headers: mergedHeaders },
        timeout
      );
      return await handleResponse<T>(response);
    } catch (error) {
      lastError = error;

      if (attempt < retries && shouldRetry(error)) {
        const backoff = retryDelay * Math.pow(2, attempt);
        await delay(backoff);
        continue;
      }

      throw error;
    }
  }

  // This should never be reached, but TypeScript needs it
  throw lastError;
};

// --- Exported API Methods ---

export const apiGet = async <T>(
  baseUrl: string,
  endpoint: string,
  params?: Record<string, string>,
  config?: RequestConfig
): Promise<T> => {
  const url = buildUrl(baseUrl, endpoint, params);
  return apiRequest<T>(url, {
    ...config,
    method: 'GET'
  });
};

export const apiPost = async <T>(
  baseUrl: string,
  endpoint: string,
  data?: unknown,
  config?: RequestConfig
): Promise<T> => {
  const url = buildUrl(baseUrl, endpoint);
  return apiRequest<T>(url, {
    ...config,
    method: 'POST',
    body: data ? JSON.stringify(data) : undefined
  });
};

export const apiPut = async <T>(
  baseUrl: string,
  endpoint: string,
  data?: unknown,
  config?: RequestConfig
): Promise<T> => {
  const url = buildUrl(baseUrl, endpoint);
  return apiRequest<T>(url, {
    ...config,
    method: 'PUT',
    body: data ? JSON.stringify(data) : undefined
  });
};

export const apiPatch = async <T>(
  baseUrl: string,
  endpoint: string,
  data?: unknown,
  config?: RequestConfig
): Promise<T> => {
  const url = buildUrl(baseUrl, endpoint);
  return apiRequest<T>(url, {
    ...config,
    method: 'PATCH',
    body: data ? JSON.stringify(data) : undefined
  });
};

export const apiDelete = async <T>(
  baseUrl: string,
  endpoint: string,
  config?: RequestConfig
): Promise<T> => {
  const url = buildUrl(baseUrl, endpoint);
  return apiRequest<T>(url, {
    ...config,
    method: 'DELETE'
  });
};
