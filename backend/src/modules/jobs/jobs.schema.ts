import { z } from 'zod';
import { JOB_SOURCES } from './jobs.constants';
import { isSafeExternalUrl, sanitizePlainText } from '../../utils/sanitize';

const plainText = () => z.string().trim().transform(sanitizePlainText);

export const createJobSchema = z.object({
  title: plainText().pipe(z.string().min(1, { message: 'Title is required' }).max(120)),
  company: plainText().pipe(z.string().min(1, { message: 'Company is required' }).max(120)),
  location: plainText().pipe(z.string().min(1, { message: 'Location is required' }).max(120)),
  description: plainText().pipe(
    z
      .string()
      .min(1, { message: 'Description is required' })
      .max(10_000, { message: 'Description must be 10,000 characters or fewer' })
  ),
  url: z
    .string()
    .trim()
    .min(1, { message: 'URL is required' })
    .url({ message: 'Invalid URL' })
    .refine(isSafeExternalUrl, { message: 'URL must use HTTP or HTTPS' }),
  source: z.enum(JOB_SOURCES),
  notes: plainText().pipe(z.string().max(1000)).optional(),
});

export const updateJobSchema = createJobSchema.partial();

export const jobIdParamSchema = z.object({
  id: z.string().min(1, { message: 'Job ID is required' }),
});

export const listJobsQuerySchema = z.object({
  search: plainText().optional(),
  source: z.enum(JOB_SOURCES).optional(),
  availableOnly: z.coerce.boolean().optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(10),
  sort: z.enum(['createdAt', 'updatedAt', 'title', 'company']).default('createdAt'),
  order: z.enum(['asc', 'desc']).default('desc'),
  fromDate: z.string().date().optional(),
  toDate: z.string().date().optional(),
});

export type ListJobsQuery = z.infer<typeof listJobsQuerySchema>;
