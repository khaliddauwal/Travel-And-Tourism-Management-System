import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import PublicHomepage from "./PublicHomepage";
import LoadingSpinner from "../components/LoadingSpinner";

/**
 * PublicHome - Wrapper that redirects logged-in users
 * - Not logged in: Show public homepage (marketing content)
 * - Logged in as tourist: Redirect to tourist dashboard
 * - Logged in as admin: Redirect to admin dashboard
 */
const PublicHome: React.FC = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user) {
      // Redirect ALL logged-in users to their respective dashboards
      const roleStr = user.role as string;
      if (user.role === "admin" || roleStr === "administrator") {
        navigate("/admin/dashboard", { replace: true });
      } else if (user.role === "tourist") {
        navigate("/tourist/dashboard", { replace: true });
      }
    }
  }, [user, loading, navigate]);

  if (loading) {
    return <LoadingSpinner text="Loading..." />;
  }

  // Show PURE marketing homepage ONLY for visitors (not logged in)
  return <PublicHomepage />;
};

export default PublicHome;
