import type { NextFunction, Request, Response } from 'express';
import { ipKeyGenerator, rateLimit } from 'express-rate-limit';
import { AVATAR_UPLOAD_TOO_FREQUENT_MESSAGE } from '../modules/cloudinary/cloudinary.constants';

type LimitOptions = {
  windowMs: number;
  userLimit: number;
  ipLimit: number;
  message: string;
};

function limiterHandler(message: string) {
  return (_request: Request, response: Response) => {
    response.status(429).json({ success: false, message });
  };
}

function createLimiters({ windowMs, userLimit, ipLimit, message }: LimitOptions) {
  return [
    rateLimit({
      windowMs,
      limit: userLimit,
      standardHeaders: 'draft-8',
      legacyHeaders: false,
      keyGenerator: (request) => request.userId ?? ipKeyGenerator(request.ip ?? 'unknown'),
      handler: limiterHandler(message),
    }),
    rateLimit({
      windowMs,
      limit: ipLimit,
      standardHeaders: 'draft-8',
      legacyHeaders: false,
      keyGenerator: (request) => ipKeyGenerator(request.ip ?? 'unknown'),
      handler: limiterHandler(message),
    }),
  ];
}

export const avatarUploadRateLimiters = createLimiters({
  windowMs: 15 * 60 * 1000,
  userLimit: 5,
  ipLimit: 25,
  message: AVATAR_UPLOAD_TOO_FREQUENT_MESSAGE,
});

export const avatarRemovalRateLimiters = createLimiters({
  windowMs: 60 * 60 * 1000,
  userLimit: 10,
  ipLimit: 50,
  message: 'You are removing profile photos too frequently. Please wait before trying again.',
});

export const profileUpdateRateLimiters = createLimiters({
  windowMs: 15 * 60 * 1000,
  userLimit: 20,
  ipLimit: 100,
  message: 'You are updating your profile too frequently. Please wait before trying again.',
});

const AVATAR_SUCCESS_COOLDOWN_MS = 30 * 1000;
const lastSuccessfulAvatarUpload = new Map<string, number>();
const activeAvatarUploads = new Set<string>();

export function enforceAvatarUploadCooldown(req: Request, res: Response, next: NextFunction) {
  if (!req.userId) {
    res.status(401).json({ message: 'Unauthorized' });
    return;
  }

  const lastSuccess = lastSuccessfulAvatarUpload.get(req.userId);
  if (lastSuccess && Date.now() - lastSuccess < AVATAR_SUCCESS_COOLDOWN_MS) {
    res.status(429).json({
      success: false,
      message: AVATAR_UPLOAD_TOO_FREQUENT_MESSAGE,
    });
    return;
  }

  next();
}

export function markAvatarUploadSucceeded(userId: string) {
  lastSuccessfulAvatarUpload.set(userId, Date.now());
}

export function acquireAvatarUpload(userId: string): boolean {
  if (activeAvatarUploads.has(userId)) return false;
  activeAvatarUploads.add(userId);
  return true;
}

export function releaseAvatarUpload(userId: string) {
  activeAvatarUploads.delete(userId);
}

export function resetAvatarProtectionForTests() {
  lastSuccessfulAvatarUpload.clear();
  activeAvatarUploads.clear();
}

export { AVATAR_SUCCESS_COOLDOWN_MS };
