import { createContext } from "react";
import type { useLoginData } from "./useLoginData";

const AUTH_STORAGE_KEY = "userAuth";

export interface UserData {
  id: number;
  role: "admin" | "user";
  email: string;
  selectedEntityId: number | null;
  token: string;
}

export interface AuthResponse {
  user: UserData;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

interface AuthContextType {
  user: UserData | null;
  loginMutation: ReturnType<typeof useLoginData>;
  setAuthData: (value: UserData) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export const loadInitialUser = (): {
  user: UserData | null;
} => {
  try {
    const storedAuth = localStorage.getItem(AUTH_STORAGE_KEY);
    if (storedAuth) {
      const { user } = JSON.parse(storedAuth);
      return { user };
    }
  } catch (error) {
    console.error("Failed to load user from localStorage:", error);
  }
  return { user: null };
};
