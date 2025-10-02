import { useMutation } from "@tanstack/react-query";
import type { AuthResponse, RegisterCredentials } from "./AuthContext";
import axios from "axios";

const FASTIFY_API_URL = import.meta.env.VITE_FASTIFY_API_URL;

export const useRegisterMutation = () => {
  return useMutation({
    mutationFn: async (
      credentials: RegisterCredentials
    ): Promise<AuthResponse> => {
      const response = await axios.post(
        `${FASTIFY_API_URL}/auth/register`,
        credentials
      );
      return response.data;
    },
  });
};
