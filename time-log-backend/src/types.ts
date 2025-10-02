import type { Plugin, User } from "@prisma/client";

export type Role = "admin" | "user";

export interface JwtUserPayload {
  id: number;
  role: Role;
}

declare module "@fastify/jwt" {
  interface FastifyJWT {
    payload: JwtUserPayload;
    user: JwtUserPayload;
  }
}

export type UserOnRegister = {
  id: number;
  email: string;
  password: string;
  role: Role;
};

export type RegisterBody = {
  email: string;
  password: string;
  role: Role;
};

export type RegisterSuccessResponse = {
  message: string;
  user: User;
};

export type RegisterErrorResponse = {
  message: string;
};

export type LoginBody = {
  email: string;
  password: string;
};

export type LoginErrorResponse = {
  message: string;
};

export type LoginSuccessResponse = {
  message: string;
  user: User;
};

export type PluginBody = {
  key: string;
  name: string;
  remoteUrl: string;
  rolesAllowed: Role[];
};

export type PluginSuccessResponse = {
  message: string;
  plugin: Plugin;
};

export type GetPluginSuccessResponse = {
  message: string;
  plugin: Omit<Plugin, "id" | "isActive" | "rolesAllowed">[];
};

export type PluginErrorResponse = {
  message: string;
};

export type ProjectBody = {
  name: string;
  clientId: string;
};

export type TaskBody = {
  taskName: string;
  projectName: string;
  description: string;
};

export type TimeLogBody = {
  // Preferred new fields
  projectIdentifier: string;
  taskIdentifier: string;

  // Monday.com client reference kept (clients live in Monday)
  mondayClientId?: string;

  // Optional legacy name if creating task on the fly
  taskName?: string;

  durationHours: number;
};
