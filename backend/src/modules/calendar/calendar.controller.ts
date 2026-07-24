import { Request, Response } from 'express';
import { getCalendarEvents } from './calendar.service';
import type { CalendarEventsQuery } from './calendar.schema';

export async function listEvents(req: Request, res: Response) {
  try {
    if (!req.userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const { from, to } = req.validatedQuery as CalendarEventsQuery;
    const events = await getCalendarEvents(req.userId, from, to);

    return res.status(200).json({
      count: events.length,
      events,
    });
  } catch (error) {
    console.error('List calendar events error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
