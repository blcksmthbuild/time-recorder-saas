import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./auth/useAuth";

export const ProtectedRoute = () => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Outlet /> : <Navigate to="/" />;
};
