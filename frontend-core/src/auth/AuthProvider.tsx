import { useQueryClient } from "@tanstack/react-query";
import { AuthContext, loadInitialUser, type UserData } from "./AuthContext";
import { useState } from "react";
import { useLoginData } from "./useLoginData";

const AUTH_STORAGE_KEY = import.meta.env.VITE_AUTH_STORAGE_KEY;

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const queryClient = useQueryClient();
  const [authData, setAuthData] = useState(loadInitialUser);

  const loginMutation = useLoginData({
    mutationKey: ["user"],
    onSuccess: (data) => {
      const { token, userId, role } = data.data.user;
      console.log("--------------------------------");
      console.log("LOGIN MUTATION DATA", data.data);
      console.log("--------------------------------");

      setAuthData({
        user: {
          id: userId,
          role: role as "admin" | "user",
          selectedEntityId: null,
          token,
        },
      });

      localStorage.setItem(
        AUTH_STORAGE_KEY,
        JSON.stringify({
          user: {
            id: userId,
            role: role as "admin" | "user",
            selectedEntityId: null,
            token,
          },
          token,
        })
      );

      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
    onError: () => {
      setAuthData({ user: null });
      localStorage.removeItem(AUTH_STORAGE_KEY);
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });

  const logout = () => {
    setAuthData({ user: null });
    localStorage.removeItem(AUTH_STORAGE_KEY);
    queryClient.invalidateQueries({ queryKey: ["user"] });
  };

  const value = {
    user: authData.user,
    loginMutation,
    setAuthData: (value: UserData) => {
      setAuthData({
        user: value,
      });
    },
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
