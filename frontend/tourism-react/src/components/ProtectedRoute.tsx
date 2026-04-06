import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { UserRole, RolePermissions } from "../types/roles";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: UserRole;
  requiredPermission?: keyof RolePermissions;
  fallbackPath?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRole,
  requiredPermission,
  fallbackPath = "/login",
}) => {
  const { user, hasPermission, isRole } = useAuth();

  // Check if user is logged in
  if (!user) {
    return <Navigate to={fallbackPath} replace />;
  }

  // Check specific role requirement
  if (requiredRole && !isRole(requiredRole)) {
    return (
      <UnauthorizedAccess userRole={user.role} requiredRole={requiredRole} />
    );
  }

  // Check permission requirement
  if (requiredPermission && !hasPermission(requiredPermission)) {
    return (
      <UnauthorizedAccess
        userRole={user.role}
        requiredPermission={requiredPermission}
      />
    );
  }

  return <>{children}</>;
};

interface UnauthorizedAccessProps {
  userRole: UserRole;
  requiredRole?: UserRole;
  requiredPermission?: keyof RolePermissions;
}

const UnauthorizedAccess: React.FC<UnauthorizedAccessProps> = ({
  userRole,
  requiredRole,
  requiredPermission,
}) => {
  return (
    <section className="section">
      <div className="container">
        <div className="unauthorized-access">
          <div className="unauthorized-icon">🚫</div>
          <h2>Access Denied</h2>
          <p>You don't have permission to access this page.</p>
          <div className="access-details">
            <p>
              <strong>Your Role:</strong> {userRole}
            </p>
            {requiredRole && (
              <p>
                <strong>Required Role:</strong> {requiredRole}
              </p>
            )}
            {requiredPermission && (
              <p>
                <strong>Required Permission:</strong> {requiredPermission}
              </p>
            )}
          </div>
          <div className="unauthorized-actions">
            <button
              onClick={() => window.history.back()}
              className="btn btn-outline"
            >
              Go Back
            </button>
            <a href="/dashboard" className="btn btn-primary">
              Go to Dashboard
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProtectedRoute;
