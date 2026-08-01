import { z } from 'zod';

export const JOB_SOURCES = [
  'LINKEDIN',
  'INDEED',
  'JOBSTREET',
  'GLASSDOOR',
  'COMPANY_WEBSITE',
  'REFERRAL',
  'OTHER',
] as const;

export const JOB_SOURCE_LABELS: Record<(typeof JOB_SOURCES)[number], string> = {
  LINKEDIN: 'LinkedIn',
  INDEED: 'Indeed',
  JOBSTREET: 'JobStreet',
  GLASSDOOR: 'Glassdoor',
  COMPANY_WEBSITE: 'Company Website',
  REFERRAL: 'Referral',
  OTHER: 'Other',
};

export const JOB_PRIORITIES = ['HIGH', 'MEDIUM', 'LOW', 'NONE'] as const;
export const JOB_PRIORITY_LABELS: Record<(typeof JOB_PRIORITIES)[number], string> = {
  HIGH: 'High',
  MEDIUM: 'Medium',
  LOW: 'Low',
  NONE: 'None',
};

export const createJobSchema = z.object({
  title: z.string().trim().min(1, 'Title is required').max(120),
  company: z.string().trim().min(1, 'Company is required').max(120),
  location: z.string().trim().min(1, 'Location is required').max(120),
  description: z
    .string()
    .trim()
    .max(10_000, 'Description must be 10,000 characters or fewer')
    .optional(),
  url: z
    .string()
    .trim()
    .pipe(z.union([z.literal(''), z.url('Enter a valid URL')])),
  source: z.enum(JOB_SOURCES),
  notes: z.string().trim().max(1000).optional(),
  priority: z.enum(JOB_PRIORITIES).optional(),
  deadline: z.string().optional(),
});

export type CreateJobFormValues = z.infer<typeof createJobSchema>;
