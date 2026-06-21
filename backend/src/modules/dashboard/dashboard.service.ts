import { prisma } from '../../config/database';
import { APPLICATION_STATUSES } from '../applications/applications.constants';

export async function getDashboardStats(userId: string) {
  const [totalJobs, totalApplications, statusGroups, recentApplications] = await Promise.all([
    prisma.job.count({ where: { userId } }),

    prisma.application.count({ where: { userId } }),

    prisma.application.groupBy({
      by: ['status'],
      where: { userId },
      _count: { status: true },
    }),

    prisma.application.findMany({
      where: { userId },
      orderBy: { updatedAt: 'desc' },
      take: 5,
      include: {
        job: {
          select: {
            id: true,
            title: true,
            company: true,
          },
        },
      },
    }),
  ]);

  const applicationsByStatus = APPLICATION_STATUSES.reduce(
    (acc, status) => {
      const found = statusGroups.find((g) => g.status === status);
      acc[status] = found?._count.status ?? 0;
      return acc;
    },
    {} as Record<string, number>
  );

  const activeApplications =
    applicationsByStatus.APPLIED + applicationsByStatus.INTERVIEW + applicationsByStatus.SAVED;

  return {
    totalJobs,
    totalApplications,
    activeApplications,
    applicationsByStatus,
    recentApplications,
  };
}
