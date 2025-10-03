import { useMutation, type UseMutationOptions } from "@tanstack/react-query";
import axios, { type AxiosResponse } from "axios";
import type { LoginCredentials } from "./AuthContext";

const FASTIFY_API_URL = import.meta.env.VITE_FASTIFY_API_URL;

interface LoginData {
  token: string;
  userId: number;
  role: string;
}

interface LoginResponse {
  message: string;
  user: LoginData;
}

const loginUser = (
  credentials: LoginCredentials
): Promise<AxiosResponse<LoginResponse>> => {
  const response = axios.post<LoginResponse>(
    `${FASTIFY_API_URL}/auth/login`,
    credentials
  );

  return response;
};

export const useLoginData = (
  options?: UseMutationOptions<
    AxiosResponse<LoginResponse>,
    Error,
    LoginCredentials
  >
) => {
  return useMutation({
    mutationFn: loginUser,
    ...options,
  });
};
