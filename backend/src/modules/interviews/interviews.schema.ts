import { z } from 'zod';
import {
  INTERVIEW_STATUSES,
  INTERVIEW_TYPES,
} from './interviews.constants';
import {
  isSafeExternalUrl,
  sanitizePlainText,
} from '../../utils/sanitize';

const plainText = (maximum: number) =>
  z
    .string()
    .trim()
    .transform(sanitizePlainText)
    .pipe(z.string().max(maximum));

const externalUrl = z
  .string()
  .trim()
  .url('Meeting URL must be a valid URL')
  .refine(isSafeExternalUrl, {
    message: 'Meeting URL must use HTTP or HTTPS',
  });

export const applicationIdParamSchema = z.object({
  applicationId: z.string().min(1, 'Application id is required'),
});

export const interviewParamsSchema = z.object({
  applicationId: z.string().min(1, 'Application id is required'),
  interviewId: z.string().min(1, 'Interview id is required'),
});

export const createInterviewSchema = z.object({
  type: z.enum(INTERVIEW_TYPES),
  scheduledAt: z.string().datetime({
    message: 'Scheduled date must be a valid ISO datetime',
  }),
  location: plainText(200).optional(),
  meetingUrl: externalUrl.optional(),
  interviewer: plainText(200).optional(),
  notes: plainText(2000).optional(),
});

export const updateInterviewSchema = z
  .object({
    type: z.enum(INTERVIEW_TYPES).optional(),
    status: z.enum(INTERVIEW_STATUSES).optional(),
    scheduledAt: z
      .string()
      .datetime({
        message: 'Scheduled date must be a valid ISO datetime',
      })
      .optional(),
    completedAt: z
      .string()
      .datetime({
        message: 'Completed date must be a valid ISO datetime',
      })
      .nullable()
      .optional(),
    location: plainText(200).nullable().optional(),
    meetingUrl: externalUrl.nullable().optional(),
    interviewer: plainText(200).nullable().optional(),
    notes: plainText(2000).nullable().optional(),
  })
  .refine(
    (data) =>
      Object.values(data).some((value) => value !== undefined),
    {
      message: 'At least one field is required',
    }
  );

export type CreateInterviewBody = z.infer<
  typeof createInterviewSchema
>;

export type UpdateInterviewBody = z.infer<
  typeof updateInterviewSchema
>;