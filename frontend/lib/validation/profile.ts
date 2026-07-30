import { z } from 'zod';

function optionalHttpsUrl(label: string) {
  return z
    .string()
    .trim()
    .max(500, `${label} must be 500 characters or fewer`)
    .refine(
      (value) => {
        if (!value) return true;
        try {
          return new URL(value).protocol === 'https:';
        } catch {
          return false;
        }
      },
      `${label} must be a valid HTTPS URL`
    );
}

export const profileSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(1, 'First name is required')
    .max(100, 'First name must be 100 characters or fewer'),
  middleName: z
    .string()
    .trim()
    .max(100, 'Middle name must be 100 characters or fewer'),
  lastName: z
    .string()
    .trim()
    .min(1, 'Last name is required')
    .max(100, 'Last name must be 100 characters or fewer'),
  suffix: z.string().trim().max(20, 'Suffix must be 20 characters or fewer'),
  headline: z
    .string()
    .trim()
    .max(160, 'Professional headline must be 160 characters or fewer'),
  phone: z.string().trim().max(30, 'Phone must be 30 characters or fewer'),
  location: z.string().trim().max(160, 'Location must be 160 characters or fewer'),
  linkedinUrl: optionalHttpsUrl('LinkedIn URL'),
  githubUrl: optionalHttpsUrl('GitHub URL'),
  portfolioUrl: optionalHttpsUrl('Portfolio URL'),
});

export type ProfileFormValues = z.infer<typeof profileSchema>;
