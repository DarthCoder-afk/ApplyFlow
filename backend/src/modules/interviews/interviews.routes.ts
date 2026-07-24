import { Router } from 'express';
import { authenticate } from '../../middleware/auth.middleware';
import { validate } from '../../middleware/validate.middleware';
import {
  create,
  getOne,
  list,
  remove,
  update,
} from './interviews.controller';
import {
  applicationIdParamSchema,
  createInterviewSchema,
  interviewParamsSchema,
  updateInterviewSchema,
} from './interviews.schema';

const router = Router({
  mergeParams: true,
});

router.use(authenticate);

router.get(
  '/',
  validate({
    params: applicationIdParamSchema,
  }),
  list
);

router.post(
  '/',
  validate({
    params: applicationIdParamSchema,
    body: createInterviewSchema,
  }),
  create
);

router.get(
  '/:interviewId',
  validate({
    params: interviewParamsSchema,
  }),
  getOne
);

router.put(
  '/:interviewId',
  validate({
    params: interviewParamsSchema,
    body: updateInterviewSchema,
  }),
  update
);

router.delete(
  '/:interviewId',
  validate({
    params: interviewParamsSchema,
  }),
  remove
);

export default router;