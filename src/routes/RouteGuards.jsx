import { Navigate, Outlet, useLocation } from "react-router-dom";
import useAuth from "../hooks/accounts/useAuth";

// Protects admin screens from unauthenticated visitors
export function ProtectedRoute() {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    // Preserve the intended destination so you can redirect back post-login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
}

// Blocks authenticated users from returning to /login
export function PublicOnlyRoute() {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}