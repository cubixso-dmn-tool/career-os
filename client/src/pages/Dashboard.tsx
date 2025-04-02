import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSidebar } from "@/hooks/use-sidebar";
import Sidebar from "@/components/layout/Sidebar";
import MobileHeader from "@/components/ui/mobile-header";
import MobileNavigation from "@/components/layout/MobileNavigation";
import MobileSidebar from "@/components/layout/MobileSidebar";
import Header from "@/components/ui/header";
import ProgressSection from "@/components/dashboard/ProgressSection";
import CareerRecommendationCard from "@/components/dashboard/CareerRecommendationCard";
import AchievementsCard from "@/components/dashboard/AchievementsCard";
import RecommendedCourses from "@/components/dashboard/RecommendedCourses";
import CareerQuizCard from "@/components/dashboard/CareerQuizCard";
import ProjectShowcaseCard from "@/components/dashboard/ProjectShowcaseCard";
import CommunitySection from "@/components/dashboard/CommunitySection";
import UpcomingEvents from "@/components/dashboard/UpcomingEvents";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

// Mock user ID until authentication is implemented
const USER_ID = 1;

export default function Dashboard() {
  const { isSidebarOpen, closeSidebar } = useSidebar();

  // Add debugging
  useEffect(() => {
    const testFetch = async () => {
      try {
        console.log("Attempting to fetch dashboard data...");
        const response = await fetch(`/api/users/${USER_ID}/dashboard`);
        console.log("Dashboard fetch response status:", response.status);
        if (!response.ok) {
          console.error("Dashboard fetch error:", await response.text());
        } else {
          console.log("Dashboard data received successfully");
        }
      } catch (error) {
        console.error("Dashboard fetch exception:", error);
      }
    };
    
    testFetch();
  }, []);

  // Fetch dashboard data
  const { data: dashboardData, isLoading, error } = useQuery({
    queryKey: [`/api/users/${USER_ID}/dashboard`],
    queryFn: async ({ queryKey }) => {
      try {
        console.log("TanStack Query attempting to fetch:", queryKey[0]);
        const response = await fetch(queryKey[0] as string, {
          credentials: "include",
        });
        console.log("TanStack Query response status:", response.status);
        if (!response.ok) {
          const errorText = await response.text();
          console.error("TanStack Query error:", errorText);
          throw new Error(`${response.status}: ${errorText || response.statusText}`);
        }
        const data = await response.json();
        console.log("TanStack Query data received successfully", data);
        return data;
      } catch (error) {
        console.error("TanStack Query exception:", error);
        throw error;
      }
    },
  });

  // Close sidebar when navigating to this page
  useEffect(() => {
    closeSidebar();
  }, [closeSidebar]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
          <p className="mt-4 text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-red-600 mb-2">Error Loading Dashboard</h2>
          <p className="text-gray-600 mb-4">We encountered an issue while loading your dashboard data.</p>
          <Button className="bg-primary">Retry</Button>
        </div>
      </div>
    );
  }

  const { 
    user, 
    progress, 
    careerPath, 
    achievements,
    recommendedCourses,
    recommendedProject,
    upcomingEvents,
    communityPosts
  } = dashboardData || {};

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Mobile Header */}
      <MobileHeader user={user || { name: 'Ananya Singh', avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6' }} />

      {/* Sidebar */}
      <Sidebar user={user || { name: 'Ananya Singh', email: 'ananya.s@example.com', avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6' }} />

      {/* Mobile Sidebar */}
      {isSidebarOpen && (
        <MobileSidebar 
          isOpen={isSidebarOpen} 
          onClose={closeSidebar} 
          user={user || { name: 'Ananya Singh', email: 'ananya.s@example.com', avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6' }}
        />
      )}

      {/* Main Content */}
      <main className="flex-1 relative">
        <div className="px-4 py-6 md:px-8 pb-20 md:pb-6">
          {/* Dashboard Header */}
          <Header userName={user?.name?.split(' ')[0] || 'Ananya'} />
          
          {/* Progress Section */}
          <ProgressSection progress={progress || { 
            percentage: 70, 
            careerAssessment: true, 
            nicheSelection: true, 
            coreCourses: { completed: 3, total: 5 }, 
            projects: { completed: 0, total: 2 }
          }} />
          
          {/* Dashboard Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            {/* Career Path */}
            <CareerRecommendationCard careerPath={careerPath} />
            
            {/* Achievements */}
            <AchievementsCard achievements={achievements || []} />
          </div>
          
          {/* Recommended Courses */}
          <RecommendedCourses courses={recommendedCourses || []} />
          
          {/* Career Quiz + Project Showcase */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <CareerQuizCard />
            <ProjectShowcaseCard project={recommendedProject} />
          </div>
          
          {/* Community Section */}
          <CommunitySection 
            posts={communityPosts || []} 
            currentUser={user || { id: 1, name: 'Ananya Singh', avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6' }}
          />
          
          {/* Upcoming Events */}
          <UpcomingEvents events={upcomingEvents || []} />
        </div>
      </main>

      {/* Mobile Navigation */}
      <MobileNavigation />
    </div>
  );
}
