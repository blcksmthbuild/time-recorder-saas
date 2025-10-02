import { createContext } from "react";
import type { useLoginMutation } from "./useLoginMutation";
import type { useRegisterMutation } from "./useRegisterMutation";

const AUTH_STORAGE_KEY = "userAuth";

interface UserData {
  id: number;
  email: string;
  role: "admin" | "user";
  entityId: number | null;
}

export interface AuthResponse {
  user: UserData & { token: string }; // A Fastify login válaszának formátuma
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  password: string;
  role?: "admin" | "user";
}

interface AuthContextType {
  user: UserData | null;
  token: string | null;
  isAuthenticated: boolean;
  loginMutation: ReturnType<typeof useLoginMutation>; // A Tanstack Mutation hook
  registerMutation: ReturnType<typeof useRegisterMutation>; // A Tanstack Mutation hook
  logout: () => void;
  mode: "login" | "register";
  setMode: (mode: "login" | "register") => void;
  // ... ide jöhetne a setCurrentEntityId, ha multi-tenant rendszert építenénk
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

// Hook a localStorage-ból való kezdeti állapot betöltésére
export const loadInitialUser = (): {
  user: UserData | null;
  token: string | null;
} => {
  try {
    const storedAuth = localStorage.getItem(AUTH_STORAGE_KEY);
    if (storedAuth) {
      const { user, token } = JSON.parse(storedAuth);
      return { user, token };
    }
  } catch (error) {
    console.error("Failed to load user from localStorage:", error);
  }
  return { user: null, token: null };
};
