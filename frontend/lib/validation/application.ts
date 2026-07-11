import { z } from 'zod';

export const APPLICATION_STATUSES = [
  'SAVED',
  'APPLIED',
  'INTERVIEW',
  'OFFER',
  'REJECTED',
  'WITHDRAWN',
] as const;

export const APPLICATION_STATUS_LABELS: Record<(typeof APPLICATION_STATUSES)[number], string> = {
  SAVED: 'Saved',
  APPLIED: 'Applied',
  INTERVIEW: 'Interview',
  OFFER: 'Offer',
  REJECTED: 'Rejected',
  WITHDRAWN: 'Withdrawn',
};

export const createApplicationSchema = z.object({
  jobId: z.string().min(1, 'Select a job'),
  status: z.enum(APPLICATION_STATUSES),
  notes: z.string().trim().max(2000).optional(),
});

export type CreateApplicationFormValues = z.infer<typeof createApplicationSchema>;