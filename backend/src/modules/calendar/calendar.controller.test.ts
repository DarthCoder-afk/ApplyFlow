jest.mock('./calendar.service', () => ({
  getCalendarEvents: jest.fn(),
}));

import type { Request, Response } from 'express';
import { listEvents } from './calendar.controller';
import { getCalendarEvents } from './calendar.service';

const mockedGetCalendarEvents = getCalendarEvents as jest.Mock;

function createResponseMock() {
  const response = {
    status: jest.fn(),
    json: jest.fn(),
  };

  response.status.mockReturnValue(response);
  return response as unknown as Response;
}

describe('calendar controller', () => {
  it('returns 401 when the user is not authenticated', async () => {
    const req = { validatedQuery: {} } as unknown as Request;
    const res = createResponseMock();

    await listEvents(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: 'Unauthorized' });
    expect(mockedGetCalendarEvents).not.toHaveBeenCalled();
  });

  it('returns normalized events for the requested range', async () => {
    const events = [
      {
        id: 'interview:stage-1',
        category: 'INTERVIEW_STAGE',
        startsAt: new Date('2026-08-10T02:00:00.000Z'),
      },
    ];
    mockedGetCalendarEvents.mockResolvedValue(events);

    const req = {
      userId: 'user-1',
      validatedQuery: {
        from: '2026-08-01T00:00:00.000Z',
        to: '2026-08-31T23:59:59.999Z',
      },
    } as unknown as Request;
    const res = createResponseMock();

    await listEvents(req, res);

    expect(mockedGetCalendarEvents).toHaveBeenCalledWith(
      'user-1',
      '2026-08-01T00:00:00.000Z',
      '2026-08-31T23:59:59.999Z'
    );
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ count: 1, events });
  });
});
