export type InterviewType =
  | 'INITIAL'
  | 'HR'
  | 'TECHNICAL'
  | 'FINAL'
  | 'OTHER';

export type InterviewStatus =
  | 'SCHEDULED'
  | 'COMPLETED'
  | 'CANCELLED'
  | 'RESCHEDULED';

export type Interview = {
  id: string;
  type: InterviewType;
  status: InterviewStatus;
  scheduledAt: string;
  completedAt: string | null;
  location: string | null;
  meetingUrl: string | null;
  interviewer: string | null;
  notes: string | null;
  applicationId: string;
  createdAt: string;
  updatedAt: string;
};

export type CreateInterviewPayload = {
  type: InterviewType;
  scheduledAt: string;
  location?: string;
  meetingUrl?: string;
  interviewer?: string;
  notes?: string;
};

export type UpdateInterviewPayload = {
  type?: InterviewType;
  status?: InterviewStatus;
  scheduledAt?: string;
  completedAt?: string | null;
  location?: string | null;
  meetingUrl?: string | null;
  interviewer?: string | null;
  notes?: string | null;
};