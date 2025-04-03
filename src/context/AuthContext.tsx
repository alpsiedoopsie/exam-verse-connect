
import React, { createContext, useContext, useState, useEffect } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "../integrations/supabase/client";
import { Database } from "../integrations/supabase/types";

// User roles
export type UserRole = "user" | "assessor" | "admin";

// User interface
export interface UserWithRole {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar_url?: string;
}

// Auth context interface
interface AuthContextType {
  currentUser: UserWithRole | null;
  session: Session | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, fullName: string) => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
}

// Create auth context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Auth provider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<UserWithRole | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Function to fetch user roles from the database
  const fetchUserRoles = async (userId: string): Promise<UserRole[]> => {
    const { data, error } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', userId);
    
    if (error) {
      console.error("Error fetching user roles:", error);
      return ["user"]; // Default role if error
    }
    
    return data.map(row => row.role as UserRole);
  };

  // Function to fetch user profile from the database
  const fetchUserProfile = async (userId: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (error) {
      console.error("Error fetching user profile:", error);
      return null;
    }
    
    return data;
  };

  // Function to set up the user with role
  const setupUser = async (user: User) => {
    if (!user) {
      setCurrentUser(null);
      return;
    }

    setIsLoading(true);
    try {
      // Fetch user roles and profile in parallel
      const [roles, profile] = await Promise.all([
        fetchUserRoles(user.id),
        fetchUserProfile(user.id)
      ]);

      // Get the first role or default to "user"
      const role = roles.length > 0 ? roles[0] : "user";

      setCurrentUser({
        id: user.id,
        email: user.email || "",
        name: profile?.full_name || user.email?.split('@')[0] || "User",
        role: role,
        avatar_url: profile?.avatar_url
      });
    } catch (error) {
      console.error("Error setting up user:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Check for existing session and set up auth state change listener
  useEffect(() => {
    // First, set up the auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        
        if (session?.user) {
          // Use setTimeout to prevent potential deadlocks with Supabase client
          setTimeout(() => {
            setupUser(session.user);
          }, 0);
        } else {
          setCurrentUser(null);
          setIsLoading(false);
        }
      }
    );

    // Then check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      
      if (session?.user) {
        setupUser(session.user);
      } else {
        setIsLoading(false);
      }
    });

    // Clean up subscription on unmount
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Login function
  const login = async (email: string, password: string): Promise<void> => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        throw error;
      }
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Signup function
  const signup = async (email: string, password: string, fullName: string): Promise<void> => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName
          }
        }
      });

      if (error) {
        throw error;
      }
    } catch (error) {
      console.error("Signup error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = async (): Promise<void> => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        throw error;
      }
      setCurrentUser(null);
    } catch (error) {
      console.error("Logout error:", error);
      throw error;
    }
  };

  // Provide the auth context
  return (
    <AuthContext.Provider value={{ currentUser, session, login, signup, logout, isLoading }}>
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

