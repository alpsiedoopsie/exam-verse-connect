
import React from "react";
import { useAuth } from "../context/AuthContext";
import AdminDashboard from "../components/dashboards/AdminDashboard";
import UserDashboard from "../components/dashboards/UserDashboard";
import AssessorDashboard from "../components/dashboards/AssessorDashboard";

const DashboardPage: React.FC = () => {
  const { currentUser } = useAuth();

  // Render different dashboard based on user role
  const renderDashboard = () => {
    if (!currentUser) return null;

    switch (currentUser.role) {
      case "admin":
        return <AdminDashboard />;
      case "assessor":
        return <AssessorDashboard />;
      case "user":
      default:
        return <UserDashboard />;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {renderDashboard()}
    </div>
  );
};

export default DashboardPage;
