
import React, { createContext, useContext, useState, useEffect } from "react";

// User roles
export type UserRole = "user" | "assessor" | "admin";

// User interface
export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

// Auth context interface
interface AuthContextType {
  currentUser: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

// Mock users for demo
const MOCK_USERS = [
  {
    id: "1",
    name: "Admin User",
    email: "admin@example.com",
    password: "admin123",
    role: "admin" as UserRole,
  },
  {
    id: "2",
    name: "Student User",
    email: "student@example.com",
    password: "student123",
    role: "user" as UserRole,
  },
  {
    id: "3",
    name: "Assessor User",
    email: "assessor@example.com",
    password: "assessor123",
    role: "assessor" as UserRole,
  },
];

// Create auth context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Auth provider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("examVerseUser");
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  // Login function
  const login = async (email: string, password: string): Promise<void> => {
    setIsLoading(true);
    try {
      // Simulate API call with timeout
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Find user in mock data
      const user = MOCK_USERS.find(
        (u) => u.email === email && u.password === password
      );

      if (!user) {
        throw new Error("Invalid credentials");
      }

      // Create user object without password
      const { password: _, ...userWithoutPassword } = user;
      
      // Set user in state and localStorage
      setCurrentUser(userWithoutPassword);
      localStorage.setItem("examVerseUser", JSON.stringify(userWithoutPassword));
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem("examVerseUser");
  };

  return (
    <AuthContext.Provider value={{ currentUser, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
