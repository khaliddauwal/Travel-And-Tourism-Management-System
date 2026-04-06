import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import LoadingSpinner from "../components/LoadingSpinner";

const Dashboard: React.FC = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user) {
      // Redirect to role-specific dashboard
      // Handle both "admin" and "administrator" role names from backend
      const roleStr = user.role as string;
      if (roleStr === "admin" || roleStr === "administrator") {
        navigate("/admin/dashboard", { replace: true });
      } else if (user.role === "tourist") {
        navigate("/tourist/dashboard", { replace: true });
      }
    }
  }, [user, loading, navigate]);

  if (loading) {
    return <LoadingSpinner text="Loading dashboard..." />;
  }

  if (!user) {
    return (
      <section className="section">
        <div className="container">
          <div className="text-center">
            <h2>Please login to access your dashboard</h2>
          </div>
        </div>
      </section>
    );
  }

  return <LoadingSpinner text="Redirecting to your dashboard..." />;
};

export default Dashboard;
