import { z } from 'zod';
import { sanitizePlainText } from '../../utils/sanitize';

function requiredPlainText(label: string, maximum: number) {
  return z
    .string()
    .trim()
    .transform(sanitizePlainText)
    .pipe(
      z
        .string()
        .min(1, `${label} is required`)
        .max(maximum, `${label} must be ${maximum} characters or fewer`)
    );
}

function optionalPlainText(label: string, maximum: number) {
  return z
    .union([z.string(), z.null()])
    .transform((value) => (value === null ? '' : sanitizePlainText(value.trim())))
    .pipe(z.string().max(maximum, `${label} must be ${maximum} characters or fewer`))
    .transform((value) => value || null);
}

function optionalHttpsUrl(label: string) {
  return z
    .union([z.string(), z.null()])
    .transform((value) => (value === null ? '' : value.trim()))
    .pipe(
      z
        .union([
          z.literal(''),
          z
            .url(`${label} must be a valid URL`)
            .max(500, `${label} must be 500 characters or fewer`)
            .refine(
              (value) => {
                try {
                  return new URL(value).protocol === 'https:';
                } catch {
                  return false;
                }
              },
              { message: `${label} must use HTTPS` }
            ),
        ])
    )
    .transform((value) => value || null);
}

export const updateProfileSchema = z
  .object({
    firstName: requiredPlainText('First name', 100).optional(),
    middleName: optionalPlainText('Middle name', 100).optional(),
    lastName: requiredPlainText('Last name', 100).optional(),
    suffix: optionalPlainText('Suffix', 20).optional(),
    headline: optionalPlainText('Professional headline', 160).optional(),
    phone: optionalPlainText('Phone', 30).optional(),
    location: optionalPlainText('Location', 160).optional(),
    linkedinUrl: optionalHttpsUrl('LinkedIn URL').optional(),
    githubUrl: optionalHttpsUrl('GitHub URL').optional(),
    portfolioUrl: optionalHttpsUrl('Portfolio URL').optional(),
  })
  .strict()
  .refine((value) => Object.keys(value).length > 0, {
    message: 'Provide at least one profile field to update',
  });

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
