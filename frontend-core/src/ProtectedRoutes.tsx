import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./auth/useAuth";

export const ProtectedRoute = () => {
  const { token } = useAuth();
  console.log("--------------------------------");
  console.log("PROTECTED ROUTE - isAuthenticated:", token);
  console.log("--------------------------------");

  if (!token) return <Navigate to="/login" />;
  return <Outlet />;
};
