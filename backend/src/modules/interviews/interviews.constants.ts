export const INTERVIEW_TYPES = [
    'INITIAL',
    'HR',
    'TECHNICAL',
    'FINAL',
    'OTHER',
] as const;
  
export const INTERVIEW_STATUSES = [
    'SCHEDULED',
    'COMPLETED',
    'CANCELLED',
    'RESCHEDULED',
] as const;

export type InterviewType = (typeof INTERVIEW_TYPES)[number];
export type InterviewStatus = (typeof INTERVIEW_STATUSES)[number];

export const INTERVIEW_TYPE_LABELS: Record<InterviewType, string> = {
    INITIAL: 'Initial interview',
    HR: 'HR interview',
    TECHNICAL: 'Technical interview',
    FINAL: 'Final interview',
    OTHER: 'Other interview',
};

export const INTERVIEW_STATUS_LABELS: Record<InterviewStatus, string> = {
    SCHEDULED: 'Scheduled',
    COMPLETED: 'Completed',
    CANCELLED: 'Cancelled',
    RESCHEDULED: 'Rescheduled',
};