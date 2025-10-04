import { PrismaClient } from "@prisma/client";
import { FastifyInstance } from "fastify";
import { ChatBody, ChatSuccessResponse } from "../types";

const prisma = new PrismaClient();

const AI_AGENT_HOST = process.env.AI_AGENT_HOST || "localhost";

export async function aiAgentRoutes(server: FastifyInstance) {
  server.post("/chat", async (request, reply) => {
    const { prompt, role, email } = request.body as ChatBody;

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return reply.status(401).send({ message: "Unauthorized" });
    }

    if (role !== user.role) {
      return reply.status(401).send({ message: "Unauthorized" });
    }

    console.log("--------------------------------");
    console.log("prompt", prompt);
    console.log("role", role);
    console.log("email", email);
    console.log("--------------------------------");

    try {
      const response = await fetch(`http://${AI_AGENT_HOST}:4000/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt,
          user_role: role,
          user_email: email,
        }),
      });

      console.log("--------------------------------");
      console.log("response", response);
      console.log("--------------------------------");

      if (!response.ok) {
        return reply.status(500).send({
          message:
            "AI service is currently unavailable. Please try again later.",
        });
      }

      const data: ChatSuccessResponse = await response.json();
      return reply.send(data);
    } catch (error) {
      console.error("AI service error:", error);
      return reply.status(500).send({
        message: "Unable to process your request. Please try again later.",
      });
    }
  });
}
