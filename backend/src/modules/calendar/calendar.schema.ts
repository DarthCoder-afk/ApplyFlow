import { z } from 'zod';

export const calendarEventsQuerySchema = z
  .object({
    from: z.string().datetime(),
    to: z.string().datetime(),
  })
  .refine((query) => new Date(query.from) <= new Date(query.to), {
    message: '"from" must be before or equal to "to"',
    path: ['from'],
  });

export type CalendarEventsQuery = z.infer<typeof calendarEventsQuerySchema>;
