import { z } from 'zod';
import { sanitizePlainText } from '../../utils/sanitize';

const requiredName = (label: string) =>
  z
    .string()
    .trim()
    .transform(sanitizePlainText)
    .pipe(
      z
        .string()
        .min(1, `${label} is required`)
        .max(100, `${label} must be 100 characters or fewer`)
    );

const optionalName = (label: string, maximum: number) =>
  z
    .union([z.string(), z.null(), z.undefined()])
    .transform((value) => (typeof value === 'string' ? sanitizePlainText(value.trim()) : ''))
    .pipe(z.string().max(maximum, `${label} must be ${maximum} characters or fewer`))
    .transform((value) => value || null);

export const registerSchema = z
  .object({
    firstName: requiredName('First name'),
    middleName: optionalName('Middle name', 100),
    lastName: requiredName('Last name'),
    suffix: optionalName('Suffix', 20),
    email: z.string().trim().toLowerCase().email('Invalid email address'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .max(100, 'Password is too long'),
  })
  .strict();

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});
