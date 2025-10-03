import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import Fastify from "fastify";
import fastifyJwt, { type Secret } from "@fastify/jwt";
import fastifyCors from "@fastify/cors";
import { authRoutes } from "./routes/auth";
import { pluginRegistryRoutes } from "./routes/pluginRegistry";
import { timelogRoutes } from "./routes/timelog";
import { startDailyReportJob } from "./jobs/dailyReport";

const prisma = new PrismaClient();

const PORT = parseInt(process.env.PORT || "3000", 10);

const startServer = async () => {
  const server = Fastify({ logger: true });

  server.register(fastifyCors, {
    origin: true,
    credentials: true,
  });

  server.register(fastifyJwt, {
    secret: process.env.JWT_SECRET as Secret,
  });

  server.register(authRoutes, { prefix: "/api/v1/auth" });
  server.register(pluginRegistryRoutes, { prefix: "/api/v1/registry" });
  server.register(timelogRoutes, { prefix: "/api/v1/timelog" });

  server.get("/api/v1/health", async (request, reply) => {
    try {
      await prisma.$queryRaw`SELECT 1`;
      return {
        status: "ok",
        service: "Time Log Backend.",
        database: "connected",
      };
    } catch (err) {
      server.log.error({ err }, "Database connection failed");
      reply.status(503).send({
        status: "error",
        service: "Time Log Backend.",
        database: "disconnected",
      });
    }
  });

  try {
    await prisma.$connect();
    server.log.info("Database connection successful.");

    // Start scheduled jobs after server is ready
    startDailyReportJob(server);

    await server.listen({ port: PORT, host: "0.0.0.0" });
    server.log.info(`Time Log Backend listening on port ${PORT}.`);
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

startServer();
