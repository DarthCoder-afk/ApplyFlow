import { Router } from 'express';
import { authenticate } from '../../middleware/auth.middleware';
import { validate } from '../../middleware/validate.middleware';
import { listEvents } from './calendar.controller';
import { calendarEventsQuerySchema } from './calendar.schema';

const router = Router();

router.get(
  '/events',
  authenticate,
  validate({ query: calendarEventsQuerySchema }),
  listEvents
);

export default router;
