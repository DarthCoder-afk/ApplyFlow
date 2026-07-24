import { calendarEventsQuerySchema } from './calendar.schema';

describe('calendar events query schema', () => {
  it('accepts a valid ISO datetime range', () => {
    expect(
      calendarEventsQuerySchema.safeParse({
        from: '2026-08-01T00:00:00.000Z',
        to: '2026-08-31T23:59:59.999Z',
      }).success
    ).toBe(true);
  });

  it('rejects a reversed date range', () => {
    expect(
      calendarEventsQuerySchema.safeParse({
        from: '2026-09-01T00:00:00.000Z',
        to: '2026-08-01T00:00:00.000Z',
      }).success
    ).toBe(false);
  });
});
