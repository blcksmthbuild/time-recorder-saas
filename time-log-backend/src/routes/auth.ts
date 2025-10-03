import { PrismaClient } from "@prisma/client";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import bcrypt from "bcryptjs";
import type { FastifyInstance } from "fastify";
import type {
  LoginBody,
  LoginErrorResponse,
  LoginSuccessResponse,
  RegisterBody,
  RegisterErrorResponse,
  RegisterSuccessResponse,
} from "../types.ts";
import type { Role } from "../types.ts";
import { isAuthenticated } from "../utils/auth-hooks.ts";

const prisma = new PrismaClient();

const HASH_ROUNDS = 10;

export async function authRoutes(server: FastifyInstance) {
  // -------------------------------------------------------------------
  // 1. REGISTRATION (POST /api/v1/auth/register)
  // -------------------------------------------------------------------
  server.post("/register", async (request, reply) => {
    const { email, password, role } = request.body as RegisterBody;

    console.log("--------------------------------");
    console.log(email, password, role);
    console.log("--------------------------------");

    if (!email) {
      return reply.status(400).send({
        message: "Email is required",
      });
    }

    if (!password) {
      return reply.status(400).send({
        message: "Password is required",
      });
    }

    const hashedPassword = await bcrypt.hash(password, HASH_ROUNDS);

    try {
      const user = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          role: role === "admin" ? "admin" : "user",
        },
      });

      console.log("--------------------------------");
      console.log(user);
      console.log("--------------------------------");

      return reply.status(201).send({
        message: "User created successfully.",
        user,
      } as RegisterSuccessResponse);
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === "P2002"
      ) {
        return reply.status(400).send({
          message: "Email already exists.",
        } as RegisterErrorResponse);
      }

      server.log.error({ error }, "Error creating user.");
      return reply.status(500).send({
        message: "Registration failed.",
      } as RegisterErrorResponse);
    }
  });

  // -------------------------------------------------------------------
  // 2. LOGIN (POST /api/v1/auth/login)
  // -------------------------------------------------------------------
  server.post("/login", async (request, reply) => {
    const { email, password } = request.body as LoginBody;

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return reply.status(401).send({
        message: "Invalid credentials.",
      } as LoginErrorResponse);
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return reply.status(401).send({
        message: "Invalid password.",
      } as LoginErrorResponse);
    }

    const token = server.jwt.sign({
      id: user.id,
      role: user.role as Role,
    });

    reply.status(200).send({
      message: "Login successful.",
      user: {
        token,
        userId: user.id,
        role: user.role,
      },
    });
  });

  // -------------------------------------------------------------------
  // 3. GET ENTITIES (GET /api/v1/auth/entities)
  // -------------------------------------------------------------------
  server.get(
    "/entities",
    { preHandler: [isAuthenticated] },
    async (request, reply) => {
      const userId = request.user.id;

      const entities = await prisma.entity.findMany({
        where: {
          users: {
            some: { userId: userId },
          },
        },
        select: {
          id: true,
          name: true,
        },
      });

      return reply.send({
        entities,
        message: "Entities fetched successfully.",
      });
    },
  );

  // -------------------------------------------------------------------
  // 4. ADD ENTITY (POST /api/v1/auth/entities)
  // -------------------------------------------------------------------
  server.post(
    "/entities",
    { preHandler: [isAuthenticated] },
    async (request, reply) => {
      const { name } = request.body as { name: string };

      const entity = await prisma.entity.create({
        data: {
          name,
        },
      });

      return reply.send({
        entity,
        message: "Entity created successfully.",
      });
    },
  );
  // 5. ADD USER TO ENTITY (POST /api/v1/auth/entities/:entityId/users)
  server.put(
    "/entities/:entityId/users",
    { preHandler: [isAuthenticated] },
    async (request, reply) => {
      const { entityId } = request.params as { entityId: string };
      const { userId } = request.body as { userId: number };

      try {
        // Check if the entity exists
        const entity = await prisma.entity.findUnique({
          where: { id: parseInt(entityId, 10) },
        });

        if (!entity) {
          return reply.code(404).send({ message: "Entity not found." });
        }

        // Check if the user exists
        const user = await prisma.user.findUnique({
          where: { id: userId },
        });

        if (!user) {
          return reply.code(404).send({ message: "User not found." });
        }

        // Add the user to the entity
        const userEntity = await prisma.userEntity.create({
          data: {
            userId: userId,
            entityId: parseInt(entityId, 10),
          },
        });

        return reply.send({
          userEntity,
          message: "User added to entity successfully.",
        });
      } catch (error) {
        request.log.error(error);
        return reply
          .code(500)
          .send({ message: "Internal server error. " + error });
      }
    },
  );
}
