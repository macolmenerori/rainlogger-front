import { http, HttpResponse } from 'msw';

export const rainlogHandlers = [
  // POST /v1/rainlogger/rainlog
  http.post(`${process.env.BASE_URL_RAINLOGGER}/v1/rainlogger/rainlog`, async ({ request }) => {
    const authHeader = request.headers.get('Authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return HttpResponse.json({ status: 'Unauthorized' }, { status: 401 });
    }

    const body = (await request.json()) as {
      date: string;
      measurement: number;
      realReading: boolean;
      location: string;
    };

    if (body.measurement < 0) {
      return HttpResponse.json({ message: 'Measurement must be non-negative.' }, { status: 400 });
    }

    return HttpResponse.json(
      {
        status: 'success',
        message: 'Rainlog added successfully',
        data: {
          rainlog: {
            ...body,
            records: [],
            timestamp: body.date,
            loggedBy: 'testuser',
            _id: '1234567890abcdef',
            __v: 0
          }
        }
      },
      { status: 201 }
    );
  })
];
