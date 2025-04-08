import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Loader2 } from "lucide-react";
import StudentDashboard from "@/components/dashboard/StudentDashboard";
import AdminDashboard from "@/components/dashboard/AdminDashboard";

export default function Dashboard() {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    // This should not happen due to protected route, but as a fallback
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Authentication Required</h2>
          <p className="mb-4">Please log in to access your dashboard.</p>
        </div>
      </div>
    );
  }

  // Render the appropriate dashboard based on user role
  const isAdmin = user.role === 'admin' || user.role === 'community_admin' || user.role === 'super_admin';
  
  return (
    <div className="min-h-screen bg-background">
      {isAdmin ? <AdminDashboard /> : <StudentDashboard />}
    </div>
  );
}