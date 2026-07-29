import 'dotenv/config';
import { z } from 'zod';

const optionalCredential = z.preprocess(
  (value) => (typeof value === 'string' && value.trim() === '' ? undefined : value),
  z.string().trim().min(1).optional()
);

const environmentSchema = z
  .object({
    PORT: z.coerce.number().int().positive().default(4000),
    NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
    FRONTEND_URL: z.url().default('http://localhost:3000'),
    JWT_ACCESS_SECRET: z.string().min(1),
    JWT_REFRESH_SECRET: z.string().min(1),
    JWT_ACCESS_EXPIRES_IN: z.string().min(1).default('15m'),
    JWT_REFRESH_EXPIRES_IN: z.string().min(1).default('7d'),
    CLOUDINARY_CLOUD_NAME: optionalCredential,
    CLOUDINARY_API_KEY: optionalCredential,
    CLOUDINARY_API_SECRET: optionalCredential,
    CLOUDINARY_AVATAR_FOLDER: z.string().trim().min(1).default('applyflow/avatars'),
  })
  .superRefine((value, context) => {
    if (value.NODE_ENV !== 'production') return;

    for (const key of [
      'CLOUDINARY_CLOUD_NAME',
      'CLOUDINARY_API_KEY',
      'CLOUDINARY_API_SECRET',
    ] as const) {
      if (!value[key]) {
        context.addIssue({
          code: 'custom',
          path: [key],
          message: `${key} is required in production`,
        });
      }
    }
  });

const parsedEnvironment = environmentSchema.safeParse(process.env);

if (!parsedEnvironment.success) {
  const issues = parsedEnvironment.error.issues
    .map((issue) => `${issue.path.join('.')}: ${issue.message}`)
    .join(', ');
  throw new Error(`Invalid environment configuration: ${issues}`);
}

const environment = parsedEnvironment.data;

export const env = {
  port: environment.PORT,
  nodeEnv: environment.NODE_ENV,
  frontendUrl: environment.FRONTEND_URL,
  jwt: {
    accessSecret: environment.JWT_ACCESS_SECRET,
    refreshSecret: environment.JWT_REFRESH_SECRET,
    accessExpiresIn: environment.JWT_ACCESS_EXPIRES_IN,
    refreshExpiresIn: environment.JWT_REFRESH_EXPIRES_IN,
  },
  cloudinary: {
    cloudName: environment.CLOUDINARY_CLOUD_NAME,
    apiKey: environment.CLOUDINARY_API_KEY,
    apiSecret: environment.CLOUDINARY_API_SECRET,
    avatarFolder: environment.CLOUDINARY_AVATAR_FOLDER.replace(/^\/+|\/+$/g, ''),
  },
};
