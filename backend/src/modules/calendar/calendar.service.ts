import { prisma } from '../../config/database';

const INTERVIEW_TYPE_LABELS = {
  INITIAL: 'Initial interview',
  HR: 'HR interview',
  TECHNICAL: 'Technical interview',
  FINAL: 'Final interview',
  OTHER: 'Other interview',
} as const;

export async function getCalendarEvents(
  userId: string,
  from: string,
  to: string
) {
  const range = {
    gte: new Date(from),
    lte: new Date(to),
  };
  const isInRange = (date: Date | null): date is Date =>
    date !== null && date >= range.gte && date <= range.lte;

  const [applications, interviews] = await Promise.all([
    prisma.application.findMany({
      where: {
        userId,
        OR: [{ appliedAt: range }, { offeredAt: range }],
      },
      select: {
        id: true,
        status: true,
        appliedAt: true,
        offeredAt: true,
        job: {
          select: {
            title: true,
            company: true,
          },
        },
      },
    }),
    prisma.interview.findMany({
      where: {
        scheduledAt: range,
        application: {
          userId,
        },
      },
      select: {
        id: true,
        type: true,
        status: true,
        scheduledAt: true,
        applicationId: true,
        application: {
          select: {
            job: {
              select: {
                title: true,
                company: true,
              },
            },
          },
        },
      },
    }),
  ]);

  const events = [
    ...applications.flatMap((application) => {
      const applicationEvents = [];

      if (isInRange(application.appliedAt)) {
        applicationEvents.push({
          id: `application:${application.id}:applied`,
          category: 'APPLICATION' as const,
          startsAt: application.appliedAt,
          applicationId: application.id,
          title: `Applied — ${application.job.title}`,
          jobTitle: application.job.title,
          company: application.job.company,
          applicationStatus: application.status,
        });
      }

      if (isInRange(application.offeredAt)) {
        applicationEvents.push({
          id: `application:${application.id}:offer`,
          category: 'OFFER' as const,
          startsAt: application.offeredAt,
          applicationId: application.id,
          title: `Offer — ${application.job.title}`,
          jobTitle: application.job.title,
          company: application.job.company,
          applicationStatus: application.status,
        });
      }

      return applicationEvents;
    }),
    ...interviews.map((interview) => ({
      id: `interview:${interview.id}`,
      category: 'INTERVIEW_STAGE' as const,
      startsAt: interview.scheduledAt,
      applicationId: interview.applicationId,
      interviewId: interview.id,
      interviewType: interview.type,
      interviewStatus: interview.status,
      title: `${INTERVIEW_TYPE_LABELS[interview.type]} — ${interview.application.job.title}`,
      jobTitle: interview.application.job.title,
      company: interview.application.job.company,
    })),
  ];

  return events.sort(
    (left, right) => left.startsAt.getTime() - right.startsAt.getTime()
  );
}
