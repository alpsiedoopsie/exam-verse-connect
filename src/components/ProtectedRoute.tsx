
import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth, UserRole } from "../context/AuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  allowedRoles = ["user", "assessor", "admin"] 
}) => {
  const { currentUser, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    // Show loading state
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-exam-primary"></div>
      </div>
    );
  }

  // If not logged in, redirect to login page
  if (!currentUser) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If logged in but not authorized for this route, redirect to dashboard
  if (!allowedRoles.includes(currentUser.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  // Render children if authorized
  return <>{children}</>;
};

export default ProtectedRoute;
