import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSidebar } from "@/hooks/use-sidebar";
import Sidebar from "@/components/layout/Sidebar";
import MobileHeader from "@/components/ui/mobile-header";
import MobileNavigation from "@/components/layout/MobileNavigation";
import MobileSidebar from "@/components/layout/MobileSidebar";
import PathFinder from "@/components/career/PathFinder";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Compass, MessageCircle, Sparkles, Rocket } from "lucide-react";

// Mock user ID until authentication is implemented
const USER_ID = 1;

interface CareerGuideProps {}

export default function CareerGuide({}: CareerGuideProps) {
  const { isSidebarOpen, closeSidebar } = useSidebar();
  const [quizCompleted, setQuizCompleted] = useState<boolean>(false);

  // Fetch user data
  const { data: userData, isLoading: loadingUser } = useQuery({
    queryKey: [`/api/users/${USER_ID}`],
    queryFn: undefined, // Use default queryFn from queryClient
  });

  // Fetch quiz results
  const { data: quizResults, isLoading: loadingQuiz } = useQuery({
    queryKey: [`/api/users/${USER_ID}/quiz-results`],
    queryFn: undefined, // Use default queryFn from queryClient
  });

  // Close sidebar when navigating to this page
  useEffect(() => {
    closeSidebar();
  }, [closeSidebar]);

  // Check if user has completed the quiz
  useEffect(() => {
    if (quizResults && quizResults.length > 0) {
      setQuizCompleted(true);
    }
  }, [quizResults]);

  const isLoading = loadingUser || loadingQuiz;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
          <p className="mt-4 text-gray-600">Loading career guide...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Mobile Header */}
      <MobileHeader user={userData || { name: 'Ananya Singh', avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6' }} />

      {/* Sidebar */}
      <Sidebar user={userData || { name: 'Ananya Singh', email: 'ananya.s@example.com', avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6' }} />

      {/* Mobile Sidebar */}
      {isSidebarOpen && (
        <MobileSidebar 
          isOpen={isSidebarOpen} 
          onClose={closeSidebar} 
          user={userData || { name: 'Ananya Singh', email: 'ananya.s@example.com', avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6' }}
        />
      )}

      {/* Main Content */}
      <main className="flex-1 relative">
        <div className="px-4 py-6 md:px-8 pb-20 md:pb-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <Compass className="h-6 w-6 mr-2 text-primary" />
              <h1 className="text-2xl font-bold text-gray-900">Career Guide</h1>
            </div>
            <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30">
              <Rocket className="h-3.5 w-3.5 mr-1" />
              AI-Powered
            </Badge>
          </div>

          <Card className="mb-6 shadow-md overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/10 border-b">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center">
                    <Sparkles className="h-5 w-5 mr-2 text-primary" />
                    PathFinder: Your AI Career Buddy
                  </CardTitle>
                  <CardDescription>
                    Chat with our AI to discover your perfect career path based on your interests and goals
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="p-0">
              <div className="p-4 bg-white">
                <div className="flex items-start space-x-4">
                  <div className="bg-primary/10 rounded-full p-3 shadow-sm flex-shrink-0">
                    <MessageCircle className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium text-lg">How PathFinder Works</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Tell me about your interests, skills, and goals, and I'll help you discover the perfect career path for you. I'll analyze your preferences and provide personalized recommendations just for you.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="border-t" style={{ height: '75vh' }}>
                <PathFinder />
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Mobile Navigation */}
        <MobileNavigation />
      </main>
    </div>
  );
}