import type { NextFunction, Request, Response } from 'express';
import multer from 'multer';
import {
  ALLOWED_AVATAR_MIME_TYPES,
  MAX_AVATAR_FILE_SIZE,
  type AllowedAvatarMimeType,
} from '../modules/cloudinary/cloudinary.constants';

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: MAX_AVATAR_FILE_SIZE,
    files: 1,
  },
  fileFilter: (_request, file, callback) => {
    if (!ALLOWED_AVATAR_MIME_TYPES.includes(file.mimetype as AllowedAvatarMimeType)) {
      callback(new Error('UNSUPPORTED_AVATAR_TYPE'));
      return;
    }
    callback(null, true);
  },
});

export function uploadSingleAvatar(req: Request, res: Response, next: NextFunction) {
  upload.single('avatar')(req, res, (error: unknown) => {
    if (!error) {
      next();
      return;
    }

    if (error instanceof multer.MulterError) {
      if (error.code === 'LIMIT_FILE_SIZE') {
        res.status(413).json({
          success: false,
          message: 'The image must be 5 MB or smaller.',
        });
        return;
      }

      res.status(400).json({
        success: false,
        message:
          error.code === 'LIMIT_UNEXPECTED_FILE' || error.code === 'LIMIT_FILE_COUNT'
            ? 'Upload one profile image using the avatar field.'
            : 'The image could not be uploaded. Please try again.',
      });
      return;
    }

    res.status(400).json({
      success: false,
      message:
        error instanceof Error && error.message === 'UNSUPPORTED_AVATAR_TYPE'
          ? 'Only JPEG, PNG, and WebP images are supported.'
          : 'The image could not be uploaded. Please try again.',
    });
  });
}
