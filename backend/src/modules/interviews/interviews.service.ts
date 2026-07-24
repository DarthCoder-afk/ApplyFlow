import { prisma } from '../../config/database';
import {
  CreateInterviewBody,
  UpdateInterviewBody,
} from './interviews.schema';

type CreateInterviewInput = CreateInterviewBody & {
  applicationId: string;
  userId: string;
};

type UpdateInterviewInput = UpdateInterviewBody & {
  applicationId: string;
  interviewId: string;
  userId: string;
};

type InterviewIdentity = {
  applicationId: string;
  interviewId: string;
  userId: string;
};

async function applicationBelongsToUser(
  applicationId: string,
  userId: string
) {
  return prisma.application.findFirst({
    where: {
      id: applicationId,
      userId,
    },
    select: {
      id: true,
    },
  });
}

export async function createInterview(
  input: CreateInterviewInput
) {
  const application = await applicationBelongsToUser(
    input.applicationId,
    input.userId
  );

  if (!application) {
    throw new Error('APPLICATION_NOT_FOUND');
  }

  return prisma.interview.create({
    data: {
      applicationId: input.applicationId,
      type: input.type,
      scheduledAt: new Date(input.scheduledAt),
      location: input.location,
      meetingUrl: input.meetingUrl,
      interviewer: input.interviewer,
      notes: input.notes,
    },
  });
}

export async function getInterviews(
  applicationId: string,
  userId: string
) {
  const application = await applicationBelongsToUser(
    applicationId,
    userId
  );

  if (!application) {
    throw new Error('APPLICATION_NOT_FOUND');
  }

  return prisma.interview.findMany({
    where: {
      applicationId,
    },
    orderBy: {
      scheduledAt: 'asc',
    },
  });
}

export async function getInterviewById(
  input: InterviewIdentity
) {
  return prisma.interview.findFirst({
    where: {
      id: input.interviewId,
      applicationId: input.applicationId,
      application: {
        userId: input.userId,
      },
    },
  });
}

export async function updateInterview(
  input: UpdateInterviewInput
) {
  const existingInterview = await getInterviewById(input);

  if (!existingInterview) {
    return null;
  }

  return prisma.interview.update({
    where: {
      id: input.interviewId,
    },
    data: {
      type: input.type,
      status: input.status,
      scheduledAt: input.scheduledAt
        ? new Date(input.scheduledAt)
        : undefined,
      completedAt:
        input.completedAt === undefined
          ? undefined
          : input.completedAt === null
            ? null
            : new Date(input.completedAt),
      location: input.location,
      meetingUrl: input.meetingUrl,
      interviewer: input.interviewer,
      notes: input.notes,
    },
  });
}

export async function deleteInterview(
  input: InterviewIdentity
) {
  const existingInterview = await getInterviewById(input);

  if (!existingInterview) {
    return false;
  }

  await prisma.interview.delete({
    where: {
      id: input.interviewId,
    },
  });

  return true;
}