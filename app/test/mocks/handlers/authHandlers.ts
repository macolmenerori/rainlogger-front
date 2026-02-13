import { http, HttpResponse } from 'msw';

import mockData from '../mockData/authData.json';

const BASE_URL = 'http://localhost:3000/api';

export const authHandlers = [
  // POST /v1/users/login
  http.post(`${BASE_URL}/v1/users/login`, async ({ request }) => {
    const body = (await request.json()) as { email: string; password: string };

    if (body.email === 'wrong@example.com' || body.password === 'wrongpass') {
      return HttpResponse.json(mockData.authErrorResponse, { status: 401 });
    }

    return HttpResponse.json(mockData.loginResponse);
  }),

  // GET /v1/users/isloggedin
  http.get(`${BASE_URL}/v1/users/isloggedin`, ({ request }) => {
    const authHeader = request.headers.get('Authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return HttpResponse.json(mockData.authErrorResponse, { status: 401 });
    }

    return HttpResponse.json(mockData.isLoggedInResponse);
  })
];
