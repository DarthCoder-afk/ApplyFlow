import { z } from 'zod';

export const INTERVIEW_TYPES = [
  'INITIAL',
  'HR',
  'TECHNICAL',
  'FINAL',
  'OTHER',
] as const;

export const INTERVIEW_TYPE_LABELS: Record<
  (typeof INTERVIEW_TYPES)[number],
  string
> = {
  INITIAL: 'Initial interview',
  HR: 'HR interview',
  TECHNICAL: 'Technical interview',
  FINAL: 'Final interview',
  OTHER: 'Other interview',
};

export const createInterviewSchema = z.object({
  type: z.enum(INTERVIEW_TYPES),
  scheduledAt: z
    .string()
    .min(1, 'Select the interview date and time'),
  location: z.string().trim().max(200).optional(),
  meetingUrl: z.union([
    z.literal(''),
    z.url('Enter a valid meeting URL'),
  ]),
  interviewer: z.string().trim().max(200).optional(),
  notes: z.string().trim().max(2000).optional(),
});

export type CreateInterviewFormValues = z.infer<
  typeof createInterviewSchema
>;