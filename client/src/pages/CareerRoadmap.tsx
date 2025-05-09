import Layout from "@/components/layout/Layout";
import CareerRoadmap from "@/components/career/CareerRoadmap";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";

export default function CareerRoadmapPage() {
  // Fetch user profile/career data to get the career path
  const { data: userData, isLoading } = useQuery<{careerPath?: {title: string}}|null>({
    queryKey: ['/api/users/profile'],
    retry: false
  });

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
        <CareerRoadmap careerPath={userData?.careerPath?.title || "Software Engineer"} />
      )}
    </Layout>
  );
}