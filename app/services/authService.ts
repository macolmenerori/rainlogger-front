import { env } from '@/config/env';
import type { IsLoggedInResponse, LoginRequest, LoginResponse } from '@/types/auth';
import { tokenStorage } from '@/utils/tokenStorage';

const buildHeaders = (includeAuth: boolean = false): HeadersInit => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json'
  };

  if (includeAuth) {
    const token = tokenStorage.getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

  return headers;
};

export async function login(credentials: LoginRequest): Promise<LoginResponse> {
  const response = await fetch(`${env.baseUrlAuth}/v1/users/login`, {
    method: 'POST',
    headers: {
      ...buildHeaders(),
      authorizationType: 'bearer'
    },
    body: JSON.stringify(credentials)
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Login failed');
  }

  return response.json();
}

export async function isLoggedIn(): Promise<IsLoggedInResponse> {
  const response = await fetch(`${env.baseUrlAuth}/v1/users/isloggedin`, {
    method: 'GET',
    headers: buildHeaders(true)
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Not authenticated');
  }

  return response.json();
}
