import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { User } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";

// Custom type for API responses
interface AuthStatusResponse {
  isAuthenticated: boolean;
  user: User | null;
}

interface AuthUserResponse {
  message: string;
  user: User;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (credentials: { username: string; password: string }) => Promise<any>;
  register: (credentials: { username: string; password: string; email: string; name: string }) => Promise<any>;
  logout: () => Promise<void>;
  checkAuthStatus: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const checkAuthStatus = async (): Promise<void> => {
    try {
      setLoading(true);
      const response = await apiRequest({
        url: "/api/auth/status",
        method: "GET",
      }) as AuthStatusResponse;

      setIsAuthenticated(response.isAuthenticated);
      setUser(response.user);
    } catch (err: any) {
      setError(err.message || "Failed to check authentication status");
      setIsAuthenticated(false);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials: { username: string; password: string }) => {
    try {
      setLoading(true);
      const response = await apiRequest({
        url: "/api/auth/login",
        method: "POST",
        body: credentials,
      }) as AuthUserResponse;

      setIsAuthenticated(true);
      setUser(response.user);
      return response;
    } catch (err: any) {
      const errorMessage = err.message || "Login failed";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const register = async (credentials: { username: string; password: string; email: string; name: string }) => {
    try {
      setLoading(true);
      const response = await apiRequest({
        url: "/api/auth/register",
        method: "POST",
        body: credentials,
      }) as AuthUserResponse;

      setIsAuthenticated(true);
      setUser(response.user);
      return response;
    } catch (err: any) {
      const errorMessage = err.message || "Registration failed";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      setLoading(true);
      await apiRequest({
        url: "/api/auth/logout",
        method: "POST",
      });

      setIsAuthenticated(false);
      setUser(null);
    } catch (err: any) {
      setError(err.message || "Logout failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const value: AuthContextType = {
    isAuthenticated,
    user,
    loading,
    error,
    login,
    register,
    logout,
    checkAuthStatus,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return context;
}