import { useQueryClient } from "@tanstack/react-query";
import { AuthContext, loadInitialUser } from "./AuthContext";
import { useLoginMutation } from "./useLoginMutation";
import { useRegisterMutation } from "./useRegisterMutation";
import { useEffect, useState } from "react";

const AUTH_STORAGE_KEY = import.meta.env.VITE_AUTH_STORAGE_KEY;

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const queryClient = useQueryClient();
  const [authData, setAuthData] = useState(loadInitialUser);
  const [mode, setMode] = useState<"login" | "register">("login");
  const isAuthenticated = !!authData.user;
  const loginMutation = useLoginMutation();
  const registerMutation = useRegisterMutation();

  useEffect(() => {
    if (loginMutation.isSuccess) {
      const { token, id, email, role, entityId } = loginMutation.data.user;

      setAuthData({ user: { id, email, role, entityId }, token });

      localStorage.setItem(
        AUTH_STORAGE_KEY,
        JSON.stringify({ user: { id, email, role, entityId }, token })
      );

      queryClient.invalidateQueries({ queryKey: ["user"] });
    }

    if (loginMutation.isError) {
      setAuthData({ user: null, token: null });
      localStorage.removeItem(AUTH_STORAGE_KEY);
      queryClient.invalidateQueries({ queryKey: ["user"] });
    }
  }, [
    loginMutation.isSuccess,
    loginMutation.isError,
    queryClient,
    loginMutation.data,
    loginMutation.error,
  ]);

  useEffect(() => {
    if (registerMutation.isSuccess) {
      setMode("login");
    }
  }, [registerMutation.isSuccess]);

  const logout = () => {
    setAuthData({ user: null, token: null });
    localStorage.removeItem(AUTH_STORAGE_KEY);
    queryClient.invalidateQueries({ queryKey: ["user"] });
  };

  const value = {
    user: authData.user,
    token: authData.token,
    isAuthenticated,
    loginMutation,
    registerMutation,
    logout,
    mode,
    setMode,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
