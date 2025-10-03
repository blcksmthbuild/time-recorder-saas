import type { FastifyInstance } from "fastify";
import { PrismaClient } from "@prisma/client";
import type { Plugin } from "@prisma/client";
import { isAuthenticated, isAdmin } from "../utils/auth-hooks";
import type { PluginBody, PluginSuccessResponse } from "../types";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

const prisma = new PrismaClient();

export async function pluginRegistryRoutes(server: FastifyInstance) {
  // -------------------------------------------------------------------
  // 1. REGISTER PLUGIN (POST /api/v1/registry/plugins)
  // -------------------------------------------------------------------
  server.post("/plugins", { preHandler: [isAdmin] }, async (request, reply) => {
    const { key, name, remoteUrl, rolesAllowed } = request.body as PluginBody;

    try {
      const plugin: Plugin = await prisma.plugin.create({
        data: {
          key,
          name,
          remoteUrl,
          rolesAllowed: Array.isArray(rolesAllowed)
            ? rolesAllowed
            : [rolesAllowed],
          isActive: true,
        },
      });
      reply.status(201).send({
        message: "Plugin created successfully.",
        plugin,
      } as PluginSuccessResponse);
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === "P2002"
      ) {
        return reply
          .status(409)
          .send({ message: "Plugin key already exists." });
      }
      server.log.error(error);
      reply.status(500).send({ message: "Failed to register plugin." });
    }
  });

  // -------------------------------------------------------------------
  // 2. GET ALL ACTIVE PLUGINS (GET /api/v1/registry/plugins)
  // -------------------------------------------------------------------
  server.get(
    "/plugins",
    { preHandler: [isAuthenticated] },
    async (request, reply) => {
      try {
        const allActivePlugins = await prisma.plugin.findMany({
          where: {
            isActive: true,
          },
          select: {
            key: true,
            name: true,
            remoteUrl: true,
            rolesAllowed: true,
          },
        });

        const userRole = request.user.role;

        const filteredPlugins = allActivePlugins.filter((plugin) =>
          plugin.rolesAllowed.includes(userRole),
        );

        const registryMap = filteredPlugins.reduce(
          (acc, plugin) => {
            acc[plugin.key] = {
              name: plugin.name,
              remoteUrl: plugin.remoteUrl,
            };
            return acc;
          },
          {} as Record<string, { name: string; remoteUrl: string }>,
        );

        reply.status(200).send(registryMap);
      } catch (error) {
        server.log.error(error);
        reply.status(500).send({ message: "Failed to fetch plugins." });
      }
    },
  );
}
