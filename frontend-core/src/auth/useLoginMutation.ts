import { useMutation } from "@tanstack/react-query";
import type { AuthResponse, LoginCredentials } from "./AuthContext";
import axios from "axios";

const FASTIFY_API_URL = import.meta.env.VITE_FASTIFY_API_URL;

export const useLoginMutation = () => {
  return useMutation({
    mutationFn: async (
      credentials: LoginCredentials
    ): Promise<AuthResponse> => {
      const response = await axios.post(
        `${FASTIFY_API_URL}/auth/login`,
        credentials
      );
      return response.data;
    },
    onSuccess: (data: AuthResponse): AuthResponse => {
      return data;
    },
  });
};
