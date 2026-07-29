import { randomUUID } from 'node:crypto';
import type { UploadApiErrorResponse, UploadApiResponse } from 'cloudinary';
import { env } from '../../config/env';
import { getCloudinaryClient } from './cloudinary.config';
import {
  ALLOWED_AVATAR_MIME_TYPES,
  AVATAR_TRANSFORMATION,
  type AllowedAvatarMimeType,
} from './cloudinary.constants';

export type UploadedAvatar = {
  avatarUrl: string;
  avatarPublicId: string;
};

function buildAvatarPublicId(userId: string): string {
  return `${env.cloudinary.avatarFolder}/${userId}/${randomUUID()}`;
}

export function hasValidAvatarSignature(
  buffer: Buffer,
  mimeType: string
): mimeType is AllowedAvatarMimeType {
  if (!ALLOWED_AVATAR_MIME_TYPES.includes(mimeType as AllowedAvatarMimeType)) {
    return false;
  }

  if (mimeType === 'image/jpeg') {
    return buffer.length >= 3 && buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff;
  }

  if (mimeType === 'image/png') {
    return (
      buffer.length >= 8 &&
      buffer.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))
    );
  }

  return (
    buffer.length >= 12 &&
    buffer.subarray(0, 4).toString('ascii') === 'RIFF' &&
    buffer.subarray(8, 12).toString('ascii') === 'WEBP'
  );
}

export async function uploadAvatar(userId: string, buffer: Buffer): Promise<UploadedAvatar> {
  const cloudinary = getCloudinaryClient();
  const publicId = buildAvatarPublicId(userId);

  const result = await new Promise<UploadApiResponse>((resolve, reject) => {
    const upload = cloudinary.uploader.upload_stream(
      {
        public_id: publicId,
        overwrite: false,
        resource_type: 'image',
        allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
        transformation: [AVATAR_TRANSFORMATION],
      },
      (error: UploadApiErrorResponse | undefined, response: UploadApiResponse | undefined) => {
        if (error || !response) {
          reject(error ?? new Error('CLOUDINARY_UPLOAD_FAILED'));
          return;
        }
        resolve(response);
      }
    );

    upload.end(buffer);
  });

  if (!result.secure_url || !result.public_id) {
    throw new Error('CLOUDINARY_UPLOAD_FAILED');
  }

  return {
    avatarUrl: result.secure_url,
    avatarPublicId: result.public_id,
  };
}

export async function deleteAvatar(publicId: string): Promise<void> {
  const cloudinary = getCloudinaryClient();
  await cloudinary.uploader.destroy(publicId, {
    resource_type: 'image',
    invalidate: true,
  });
}

export function buildAvatarTransformationUrl(publicId: string): string {
  return getCloudinaryClient().url(publicId, {
    secure: true,
    transformation: [AVATAR_TRANSFORMATION],
  });
}
