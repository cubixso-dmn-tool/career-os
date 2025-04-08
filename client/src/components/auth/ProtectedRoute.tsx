import { ReactNode, useEffect } from "react";
import { useLocation } from "wouter";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: "student" | "community_founder" | "admin";
}

export default function ProtectedRoute({ 
  children, 
  requiredRole 
}: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, user } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      setLocation("/login");
    } else if (!isLoading && isAuthenticated && requiredRole && user?.role !== requiredRole) {
      setLocation("/dashboard");
    }
  }, [isAuthenticated, isLoading, setLocation, requiredRole, user]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading...</span>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect in useEffect
  }

  if (requiredRole && user?.role !== requiredRole) {
    return null; // Will redirect in useEffect
  }

  return <>{children}</>;
}