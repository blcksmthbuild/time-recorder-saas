import { PrismaClient, type TimeLog } from "@prisma/client";

const prisma = new PrismaClient();

export const getReportsByUser = async (
  from: Date,
  to: Date,
  requestedUserId: number,
): Promise<{
  logs: TimeLog[];
}> => {
  const where: any = { userId: requestedUserId };
  if (from || to) {
    where.date = {} as any;
    if (from) (where.date as any).gte = new Date(from);
    if (to) (where.date as any).lte = new Date(to);
  }

  // Lekérdezzük a logokat
  const logs = await prisma.timeLog.findMany({
    where,
    orderBy: { date: "desc" },
  });

  return { logs };
};

export const getDailyReport = async (
  from: Date,
  to: Date,
): Promise<{
  logs: TimeLog[];
  byUser: Record<number, number>;
  byProject: Record<string, number>;
  total: number;
}> => {
  const logs = await prisma.timeLog.findMany({
    where: { date: { gte: from, lte: to } },
  });

  const byUser = logs.reduce(
    (acc, log) => {
      acc[log.userId] = (acc[log.userId] || 0) + log.durationHours;
      return acc;
    },
    {} as Record<number, number>,
  );

  const byProject = logs.reduce(
    (acc, log) => {
      acc[log.projectIdentifier] =
        (acc[log.projectIdentifier] || 0) + log.durationHours;
      return acc;
    },
    {} as Record<string, number>,
  );

  const total = logs.reduce((acc, log) => acc + log.durationHours, 0);

  return { logs, byUser, byProject, total };
};
