import { useEffect } from "react";
import { useLocation } from "wouter";
import { useUserRole } from "@/hooks/use-user-role";
import StudentDashboard from "./StudentDashboard";
import MentorDashboard from "./MentorDashboard";
import AdminDashboard from "./AdminDashboard";
import Layout from "@/components/layout/Layout";

export default function DashboardRouter() {
  const { primaryRole, isLoading, refetch } = useUserRole();
  const [, navigate] = useLocation();

  console.log('🧭 DashboardRouter - Role:', primaryRole, 'Loading:', isLoading);

  useEffect(() => {
    // Force refetch role data on component mount to ensure fresh data
    console.log('🔄 DashboardRouter - Forcing role refetch');
    refetch();
  }, [refetch]);

  useEffect(() => {
    // Wait for role data to be fully loaded before redirecting
    if (!isLoading && primaryRole) {
      console.log(`🚀 DashboardRouter - Navigating to ${primaryRole} dashboard`);
      // Use requestAnimationFrame to ensure DOM is ready
      requestAnimationFrame(() => {
        switch (primaryRole) {
          case 'admin':
            console.log('📍 Navigating to /admin-dashboard');
            navigate('/admin-dashboard', { replace: true });
            break;
          case 'moderator':
            console.log('📍 Navigating to /moderator-dashboard');
            navigate('/moderator-dashboard', { replace: true });
            break;
          case 'mentor':
            console.log('📍 Navigating to /mentor-dashboard');
            navigate('/mentor-dashboard', { replace: true });
            break;
          case 'student':
          default:
            console.log('📍 Navigating to /student-dashboard');
            navigate('/student-dashboard', { replace: true });
            break;
        }
      });
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
export { StudentDashboard };
export { MentorDashboard };
export { AdminDashboard };