import type { Request, Response } from 'express';
import {
  acquireAvatarUpload,
  markAvatarUploadSucceeded,
  releaseAvatarUpload,
} from '../../middleware/profile-rate-limit.middleware';
import { hasValidAvatarSignature } from '../cloudinary/cloudinary.service';
import {
  getProfile,
  removeProfileAvatar,
  replaceProfileAvatar,
  updateProfile,
} from './profile.service';

function handleProfileError(error: unknown, response: Response, operation: string) {
  if (error instanceof Error && error.message === 'USER_NOT_FOUND') {
    return response.status(404).json({ success: false, message: 'User not found' });
  }

  if (error instanceof Error && error.message === 'CLOUDINARY_NOT_CONFIGURED') {
    console.error(`${operation}: Cloudinary is not configured`);
  } else {
    console.error(`${operation}:`, error);
  }

  return response.status(500).json({
    success: false,
    message:
      operation === 'Upload avatar'
        ? 'The image could not be uploaded. Please try again.'
        : 'Your profile could not be updated. Please try again.',
  });
}

export async function get(req: Request, res: Response) {
  if (!req.userId) {
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }

  try {
    const profile = await getProfile(req.userId);
    if (!profile) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    return res.status(200).json({ success: true, profile });
  } catch (error) {
    return handleProfileError(error, res, 'Get profile');
  }
}

export async function update(req: Request, res: Response) {
  if (!req.userId) {
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }

  try {
    const profile = await updateProfile(req.userId, req.body);
    return res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      profile,
    });
  } catch (error) {
    return handleProfileError(error, res, 'Update profile');
  }
}

export async function uploadAvatar(req: Request, res: Response) {
  if (!req.userId) {
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }

  if (!req.file) {
    return res.status(400).json({ success: false, message: 'Choose an image to upload.' });
  }

  if (!hasValidAvatarSignature(req.file.buffer, req.file.mimetype)) {
    return res.status(400).json({
      success: false,
      message: 'Only valid JPEG, PNG, and WebP images are supported.',
    });
  }

  if (!acquireAvatarUpload(req.userId)) {
    return res.status(429).json({
      success: false,
      message: 'You are uploading too frequently. Please wait before trying again.',
    });
  }

  try {
    const profile = await replaceProfileAvatar(req.userId, req.file.buffer);
    markAvatarUploadSucceeded(req.userId);
    return res.status(200).json({
      success: true,
      message: 'Profile photo updated',
      profile,
    });
  } catch (error) {
    return handleProfileError(error, res, 'Upload avatar');
  } finally {
    releaseAvatarUpload(req.userId);
  }
}

export async function removeAvatar(req: Request, res: Response) {
  if (!req.userId) {
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }

  try {
    const profile = await removeProfileAvatar(req.userId);
    return res.status(200).json({
      success: true,
      message: 'Profile photo removed',
      profile,
    });
  } catch (error) {
    return handleProfileError(error, res, 'Remove avatar');
  }
}
