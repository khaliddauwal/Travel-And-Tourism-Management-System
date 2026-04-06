import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import LoadingSpinner from "./LoadingSpinner";

interface RoleBasedRouteProps {
  children: React.ReactNode;
  allowedRoles: string[];
}

/**
 * RoleBasedRoute - Redirects users based on their role
 * - If user is not logged in, redirect to login
 * - If user's role is not in allowedRoles, redirect to their dashboard
 */
const RoleBasedRoute: React.FC<RoleBasedRouteProps> = ({
  children,
  allowedRoles,
}) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner text="Loading..." />;
  }

  // Not logged in - redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Check if user's role is allowed
  const userRoleStr = user.role as string;
  const isAllowed =
    allowedRoles.includes(user.role) ||
    allowedRoles.includes(userRoleStr) ||
    (userRoleStr === "administrator" && allowedRoles.includes("admin"));

  if (!isAllowed) {
    // Redirect to user's appropriate dashboard
    if (user.role === "admin" || userRoleStr === "administrator") {
      return <Navigate to="/admin/dashboard" replace />;
    } else {
      return <Navigate to="/tourist/dashboard" replace />;
    }
  }

  return <>{children}</>;
};

export default RoleBasedRoute;
