import { v2 as cloudinary } from 'cloudinary';
import { env } from '../../config/env';

let configured = false;

export function getCloudinaryClient() {
  if (!env.cloudinary.cloudName || !env.cloudinary.apiKey || !env.cloudinary.apiSecret) {
    throw new Error('CLOUDINARY_NOT_CONFIGURED');
  }

  if (!configured) {
    cloudinary.config({
      cloud_name: env.cloudinary.cloudName,
      api_key: env.cloudinary.apiKey,
      api_secret: env.cloudinary.apiSecret,
      secure: true,
    });
    configured = true;
  }

  return cloudinary;
}
