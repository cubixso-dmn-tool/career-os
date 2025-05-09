import { useState, useEffect } from "react";
import Layout from "@/components/layout/Layout";
import CareerRoadmap from "@/components/career/CareerRoadmap";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";

export default function CareerRoadmapPage() {
  // State to store the career path from localStorage or API
  const [careerPath, setCareerPath] = useState<string>("Software Engineer");
  const [isLoading, setIsLoading] = useState(true);
  
  // Fetch user profile/career data to get the career path
  const { data: userData, isSuccess, isError } = useQuery({
    queryKey: ['/api/users/profile']
  });
  
  // Update loading state when query completes
  useEffect(() => {
    if (isSuccess || isError) {
      setIsLoading(false);
    }
  }, [isSuccess, isError]);
  
  // Effect to load the career path from localStorage or API
  useEffect(() => {
    // Try to get career path from localStorage first (set by PathFinder)
    try {
      const storedCareerPath = localStorage.getItem('selectedCareerPath');
      if (storedCareerPath) {
        setCareerPath(storedCareerPath);
        console.log("Loaded career path from localStorage:", storedCareerPath);
      } else if (userData && typeof userData === 'object') {
        // If not in localStorage, try to get from API response
        // Safely check if the userData has the required properties
        const profile = userData as any; // Type assertion to bypass TypeScript check
        if (profile.careerPath && profile.careerPath.title) {
          setCareerPath(profile.careerPath.title);
          console.log("Loaded career path from API:", profile.careerPath.title);
        }
      }
    } catch (e) {
      console.error('Error loading career path from localStorage:', e);
    } finally {
      setIsLoading(false);
    }
  }, [userData]);

  return (
    <Layout>
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Career Roadmap</h1>
        <p className="text-gray-600 mt-1">Your personalized roadmap to career success</p>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="w-10 h-10 animate-spin text-primary" />
        </div>
      ) : (
        <CareerRoadmap careerPath={careerPath} />
      )}
    </Layout>
  );
}