import type { FastifyInstance } from "fastify";
import { isAdmin, isAuthenticated } from "../utils/auth-hooks";
import type { ProjectBody, TaskBody, TimeLogBody } from "../types";
import { PrismaClient } from "@prisma/client";
import { getReportsByUser } from "../module/reports";

const prisma = new PrismaClient();

export async function timelogRoutes(server: FastifyInstance) {
  // -------------------------------------------------------------------
  // 1. CREATE NEW PROJECT (POST /api/v1/timelog/projects) - MONDAY.COM ONLY
  // -------------------------------------------------------------------
  server.post(
    "/projects",
    { preHandler: [isAdmin] },
    async (request, reply) => {
      const { name, clientId } = request.body as ProjectBody;

      if (!name)
        return reply
          .status(400)
          .send({ message: "Project name is required (for Monday.com)." });
      if (!clientId)
        return reply
          .status(400)
          .send({ message: "Client ID is required (for Monday.com)." });

      // 💡 Nincs DB írás. A projekt feltételezzük, hogy létrejön a Monday.com-ban.
      return reply.status(201).send({
        message: "Project creation command successful.",
        data: { name, clientId, externalStatus: "Pending on Monday.com" },
      });
    },
  );

  // -------------------------------------------------------------------
  // 2. CREATE NEW TASK (POST /api/v1/timelog/tasks) - MONDAY.COM ONLY
  // -------------------------------------------------------------------
  server.post("/tasks", { preHandler: [isAdmin] }, async (request, reply) => {
    const { taskName, projectName, description } = request.body as TaskBody;

    if (!taskName)
      return reply
        .status(400)
        .send({ message: "Task name is required (for Monday.com)." });
    if (!projectName)
      return reply
        .status(400)
        .send({ message: "Project name is required (for Monday.com)." });

    // 💡 Nincs DB írás. A feladat feltételezzük, hogy létrejön a Monday.com-ban.
    return reply.status(201).send({
      message: "Task creation command successful.",
      data: {
        taskName,
        projectName,
        description,
        externalStatus: "Pending on Monday.com",
      },
    });
  });

  // -------------------------------------------------------------------
  // 3. LOG TIME (POST /api/v1/timelog/log-time)
  // -------------------------------------------------------------------
  server.post(
    "/log-time",
    { preHandler: [isAuthenticated] },
    async (request, reply) => {
      const {
        projectIdentifier,
        taskIdentifier,
        mondayClientId,
        durationHours,
      } = request.body as TimeLogBody;

      const userId = request.user.id;

      if (!projectIdentifier)
        return reply.status(400).send({
          message: "Project identifier is required for time logging.",
        });
      if (typeof durationHours !== "number" || durationHours <= 0)
        return reply
          .status(400)
          .send({ message: "Duration must be a positive number." });

      try {
        const newLog = await prisma.timeLog.create({
          data: {
            userId,
            durationHours: parseFloat(durationHours.toString()),
            projectIdentifier: projectIdentifier,
            taskIdentifier: taskIdentifier ?? null,
            mondayClientId: mondayClientId ?? null,
          },
        });

        return reply.status(200).send({
          message: "Time logged successfully.",
          data: newLog,
        });
      } catch (error) {
        server.log.error(error);
        return reply.status(500).send({ message: "Failed to log time." });
      }
    },
  );

  // -------------------------------------------------------------------
  // 4. REPORTS (Admin) - /reports
  // -------------------------------------------------------------------
  server.get(
    "/reports",
    { preHandler: [isAuthenticated] },
    async (request, reply) => {
      const { from, to, userId } = (request.query || {}) as {
        from?: string;
        to?: string;
        userId?: string;
      };

      const requestedUserId = userId ? parseInt(userId, 10) : request.user.id;
      const callerId = request.user.id;

      // Jogosultsági ellenőrzés: Csak Admin kérhet le más user-t
      if (requestedUserId !== callerId && request.user.role !== "admin") {
        return reply.status(403).send({
          message: "Access denied. Only Admins can view other users' reports.",
        });
      }

      const fromDate = from ? new Date(from) : new Date();
      const toDate = to
        ? new Date(to)
        : new Date(new Date().setDate(new Date().getDate() + 1));

      const { logs } = await getReportsByUser(
        fromDate,
        toDate,
        requestedUserId,
      );

      return reply.send({
        message: "Time logs retrieved successfully.",
        data: logs,
      });
    },
  );

  // -------------------------------------------------------------------
  // 5. TOP PROJECT REPORT (GET /api/v1/timelog/reports/top-project)
  // -------------------------------------------------------------------
  server.get(
    "/reports/top-project",
    { preHandler: [isAdmin] }, // Admin jogkör szükséges
    async (request, reply) => {
      const { from, to } = (request.query || {}) as {
        from?: string;
        to?: string;
      };

      const where: any = {};
      if (from || to) {
        where.date = {} as any;
        if (from) (where.date as any).gte = new Date(from);
        if (to) (where.date as any).lte = new Date(to);
      }

      const topProject = await prisma.timeLog.groupBy({
        by: ["projectIdentifier"],
        where,
        _sum: {
          durationHours: true,
        },
        orderBy: {
          _sum: {
            durationHours: "desc", // Csökkenő sorrend
          },
        },
        take: 1,
      });

      if (topProject.length === 0 || !topProject[0]?._sum.durationHours) {
        return reply.send({ project: "N/A", totalHours: 0 });
      }

      return reply.send({
        project: topProject[0].projectIdentifier,
        totalHours: topProject[0]._sum.durationHours,
      });
    },
  );
}
