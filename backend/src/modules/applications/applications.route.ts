import { Router } from 'express';
import { authenticate } from '../../middleware/auth.middleware';
import { create, listApplications, getOne, update, remove } from './applications.controller';
import { validate } from '../../middleware/validate.middleware';
import {
  createApplicationSchema,
  updateApplicationSchema,
  applicationIdParamSchema,
  listApplicationsQuerySchema,
} from './applications.schema';
import interviewRoutes from '../interviews/interviews.routes';

const router = Router();

router.get('/', authenticate, validate({ query: listApplicationsQuerySchema }), listApplications);
router.use('/:applicationId/interviews', interviewRoutes);
router.get('/:id', authenticate, validate({ params: applicationIdParamSchema }), getOne);
router.post('/', authenticate, validate({ body: createApplicationSchema }), create);
router.put(
  '/:id',
  authenticate,
  validate({ params: applicationIdParamSchema, body: updateApplicationSchema }),
  update
);
router.delete('/:id', authenticate, validate({ params: applicationIdParamSchema }), remove);
export default router;
