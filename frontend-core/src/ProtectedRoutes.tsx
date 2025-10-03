import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./auth/useAuth";

export const ProtectedRoute = () => {
  const { user } = useAuth();
  console.log("--------------------------------");
  console.log("PROTECTED ROUTE - isAuthenticated:", user?.token);
  console.log("--------------------------------");

  if (!user?.token) return <Navigate to="/login" />;
  return (
    <Outlet />
  );
};
