import "@fastify/jwt";
import type { FastifyReply, FastifyRequest } from "fastify";

export const isAuthenticated = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  try {
    await request.jwtVerify();
  } catch (error) {
    reply
      .code(401)
      .send({ message: "Authorization token is missing or invalid." });
  }
};

export const isAdmin = async (request: FastifyRequest, reply: FastifyReply) => {
  await isAuthenticated(request, reply);

  if (request.user && request.user.role !== "admin") {
    reply.code(403).send({ message: "Access denied: Requires Admin role." });
  }
};
