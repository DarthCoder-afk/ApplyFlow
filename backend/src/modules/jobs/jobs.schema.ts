import { z } from 'zod';
import {
  JOB_PRIORITIES,
  JOB_SOURCES,
} from './jobs.constants';
import { isSafeExternalUrl, sanitizePlainText } from '../../utils/sanitize';

const plainText = () => z.string().trim().transform(sanitizePlainText);
const optionalJobUrl = z.preprocess(
  (value) => (typeof value === 'string' && value.trim() === '' ? null : value),
  z
    .string()
    .trim()
    .url({ message: 'Invalid URL' })
    .refine(isSafeExternalUrl, { message: 'URL must use HTTP or HTTPS' })
    .nullable()
    .optional()
);
const optionalDescription = z.preprocess(
  (value) => (typeof value === 'string' && value.trim() === '' ? null : value),
  plainText()
    .pipe(z.string().max(10_000, { message: 'Description must be 10,000 characters or fewer' }))
    .nullable()
    .optional()
);

export const createJobSchema = z.object({
  title: plainText().pipe(z.string().min(1, { message: 'Title is required' }).max(120)),
  company: plainText().pipe(z.string().min(1, { message: 'Company is required' }).max(120)),
  location: plainText().pipe(z.string().min(1, { message: 'Location is required' }).max(120)),
  description: optionalDescription,
  url: optionalJobUrl,
  source: z.enum(JOB_SOURCES),
  notes: plainText().pipe(z.string().max(1000)).optional(),
  priority: z.enum(JOB_PRIORITIES).optional(),
  deadline: z.union([z.string().date(), z.string().datetime()]).nullable().optional(),
  allowDuplicate: z.boolean().optional(),
});

export const updateJobSchema = createJobSchema.partial();

export const jobIdParamSchema = z.object({
  id: z.string().min(1, { message: 'Job ID is required' }),
});

export const listJobsQuerySchema = z.object({
  search: plainText().optional(),
  location: plainText().optional(),
  source: z.enum(JOB_SOURCES).optional(),
  priority: z.enum(JOB_PRIORITIES).optional(),
  hasApplication: z.enum(['true', 'false']).transform((value) => value === 'true').optional(),
  closingSoon: z.enum(['true', 'false']).transform((value) => value === 'true').optional(),
  availableOnly: z.coerce.boolean().optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(10),
  sort: z.enum(['createdAt', 'updatedAt', 'title', 'company', 'priority', 'deadline']).default('createdAt'),
  order: z.enum(['asc', 'desc']).default('desc'),
  fromDate: z.string().date().optional(),
  toDate: z.string().date().optional(),
});

export type ListJobsQuery = z.infer<typeof listJobsQuerySchema>;
