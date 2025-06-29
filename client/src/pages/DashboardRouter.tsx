import { useEffect } from "react";
import { useLocation } from "wouter";
import { useUserRole } from "@/hooks/use-user-role";
import Dashboard from "./Dashboard";
import MentorDashboard from "./MentorDashboard";
import AdminDashboard from "./AdminDashboard";
import Layout from "@/components/layout/Layout";

export default function DashboardRouter() {
  const { primaryRole, isLoading } = useUserRole();
  const [, navigate] = useLocation();

  useEffect(() => {
    if (!isLoading && primaryRole) {
      // Auto-redirect based on primary role
      switch (primaryRole) {
        case 'admin':
          navigate('/admin-dashboard', { replace: true });
          break;
        case 'moderator':
          navigate('/admin-dashboard', { replace: true }); // Moderators use admin dashboard
          break;
        case 'mentor':
          navigate('/mentor-dashboard', { replace: true });
          break;
        case 'student':
        default:
          navigate('/student-dashboard', { replace: true });
          break;
      }
    }
  }, [primaryRole, isLoading, navigate]);

  if (isLoading) {
    return (
      <Layout title="Dashboard">
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading your dashboard...</p>
          </div>
        </div>
      </Layout>
    );
  }

  // This component acts as a router, the actual dashboards are rendered via direct routes
  return null;
}

// Export role-specific dashboard components
export { Dashboard as StudentDashboard };
export { MentorDashboard };
export { AdminDashboard };