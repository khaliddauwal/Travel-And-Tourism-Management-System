import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import LoadingSpinner from "../components/LoadingSpinner";

/**
 * RootRedirect - Handles the root route (/)
 * - If not logged in: Show public homepage (Home component will be rendered)
 * - If logged in as admin: Redirect to /admin/dashboard
 * - If logged in as tourist: Show public homepage (they can browse)
 */
const RootRedirect: React.FC = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user) {
      // Only redirect admins away from homepage
      const roleStr = user.role as string;
      if (user.role === "admin" || roleStr === "administrator") {
        navigate("/admin/dashboard", { replace: true });
      }
      // Tourists can stay on homepage - they'll see the public interface
    }
  }, [user, loading, navigate]);

  if (loading) {
    return <LoadingSpinner text="Loading..." />;
  }

  // If not logged in or is tourist, return null to let Home component render
  return null;
};

export default RootRedirect;
