import { apiFetch } from './client';
import type { CalendarEventsResponse } from '@/lib/types/calendar';

export async function getCalendarEvents(params: {
  from: string;
  to: string;
}) {
  const query = new URLSearchParams({
    from: params.from,
    to: params.to,
  });

  return apiFetch<CalendarEventsResponse>(
    `/api/calendar/events?${query.toString()}`
  );
}
