import type { ApplicationStatus } from './application';
import type { InterviewStatus, InterviewType } from './interview';

export type CalendarEventCategory =
  | 'APPLICATION'
  | 'INTERVIEW_STAGE'
  | 'OFFER';

export type CalendarEvent = {
  id: string;
  category: CalendarEventCategory;
  startsAt: string;
  applicationId: string;
  title: string;
  jobTitle: string;
  company: string;
  applicationStatus?: ApplicationStatus;
  interviewId?: string;
  interviewType?: InterviewType;
  interviewStatus?: InterviewStatus;
};

export type CalendarEventsResponse = {
  count: number;
  events: CalendarEvent[];
};
