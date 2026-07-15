import { z } from 'zod';
import { JOB_SOURCES } from './jobs.constants';

export const createJobSchema = z.object({
  title: z.string().trim().min(1, { message: 'Title is required' }).max(120),
  company: z.string().trim().min(1, { message: 'Company is required' }).max(120),
  location: z.string().trim().min(1, { message: 'Location is required' }).max(120),
  description: z
    .string()
    .trim()
    .min(1, { message: 'Description is required' })
    .max(10_000, { message: 'Description must be 10,000 characters or fewer' }),
  url: z.string().trim().min(1, { message: 'URL is required' }).url({ message: 'Invalid URL' }),
  source: z.enum(JOB_SOURCES),
  notes: z.string().trim().max(1000).optional(),
});

export const updateJobSchema = createJobSchema.partial();

export const jobIdParamSchema = z.object({
  id: z.string().min(1, { message: 'Job ID is required' }),
});

export const listJobsQuerySchema = z.object({
  search: z.string().trim().optional(),
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
