import { Router } from 'express';
import { authenticate } from '../../middleware/auth.middleware';
import { uploadSingleAvatar } from '../../middleware/avatar-upload.middleware';
import {
  avatarRemovalRateLimiters,
  avatarUploadRateLimiters,
  enforceAvatarUploadCooldown,
  profileUpdateRateLimiters,
} from '../../middleware/profile-rate-limit.middleware';
import { validate } from '../../middleware/validate.middleware';
import { get, removeAvatar, update, uploadAvatar } from './profile.controller';
import { updateProfileSchema } from './profile.schema';

const router = Router();

router.use(authenticate);

router.get('/', get);
router.patch(
  '/',
  ...profileUpdateRateLimiters,
  validate({ body: updateProfileSchema }),
  update
);
router.post(
  '/avatar',
  ...avatarUploadRateLimiters,
  enforceAvatarUploadCooldown,
  uploadSingleAvatar,
  uploadAvatar
);
router.delete('/avatar', ...avatarRemovalRateLimiters, removeAvatar);

export default router;
