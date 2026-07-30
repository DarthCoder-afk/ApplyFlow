export const MAX_AVATAR_FILE_SIZE = 5 * 1024 * 1024;
export const MAX_AVATAR_FILES_PER_REQUEST = 1;

export const ALLOWED_AVATAR_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
] as const;

export type AllowedAvatarMimeType = (typeof ALLOWED_AVATAR_MIME_TYPES)[number];

export const AVATAR_TRANSFORMATION = {
  width: 512,
  height: 512,
  crop: 'fill',
  gravity: 'auto',
  quality: 'auto',
  fetch_format: 'auto',
} as const;

export const AVATAR_UPLOAD_TOO_FREQUENT_MESSAGE =
  'You are uploading too frequently. Please wait before trying again.';
