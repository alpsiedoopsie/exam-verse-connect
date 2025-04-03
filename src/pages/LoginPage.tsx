
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import LoginForm from "../components/LoginForm";

const LoginPage: React.FC = () => {
  const { currentUser } = useAuth();

  // Redirect if already logged in
  if (currentUser) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex flex-1 items-center justify-center p-4 py-12">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-exam-primary mb-2">
              Welcome to ExamVerse Connect
            </h1>
            <p className="text-exam-muted">Sign in to your account</p>
          </div>
          <LoginForm />
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
