import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Info as InfoIcon, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { CareerTipTooltip } from "@/components/ui/career-tip-tooltip";
import { TipCard } from "@/components/ui/tip-card";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface ResourcesProps {
  careerPath: string;
}

// Resources section component with API data fetching
function ResourcesSection({ careerPath }: ResourcesProps) {
  const [resources, setResources] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  
  useEffect(() => {
    async function fetchResources() {
      try {
        setLoading(true);
        const data = await apiRequest({
          url: `/api/career/roadmap/resources/${encodeURIComponent(careerPath)}`,
          method: "GET"
        });
        setResources(data);
        setError(false);
      } catch (err) {
        console.error("Error fetching resources:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    }
    
    fetchResources();
  }, [careerPath]);
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="text-center py-6 text-gray-500">
        <p>Unable to load resources. Please try again later.</p>
        <Button variant="outline" size="sm" className="mt-2" onClick={() => setLoading(true)}>
          Retry
        </Button>
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="p-4 border rounded-lg">
        <h4 className="font-medium">Recommended Reading</h4>
        <ul className="mt-2 space-y-1 text-sm text-gray-600">
          {resources?.recommendedBooks?.map((book: any, index: number) => (
            <li key={index}>• "{book.title}" by {book.author}</li>
          )) || (
            <>
              <li>• "The Pragmatic Programmer" by Andrew Hunt</li>
              <li>• "Clean Code" by Robert C. Martin</li>
              <li>• "Cracking the Coding Interview" by Gayle McDowell</li>
            </>
          )}
        </ul>
      </div>
      <div className="p-4 border rounded-lg">
        <h4 className="font-medium">Online Resources</h4>
        <ul className="mt-2 space-y-1 text-sm text-gray-600">
          {resources?.onlineResources?.map((resource: any, index: number) => (
            <li key={index}>• {resource.name} for {resource.description || "learning"}</li>
          )) || (
            <>
              <li>• LeetCode for coding practice</li>
              <li>• GitHub for portfolio projects</li>
              <li>• Stack Overflow for problem-solving</li>
            </>
          )}
        </ul>
      </div>
    </div>
  );
}

interface CareerRoadmapProps {
  careerPath?: string;
}

export default function CareerRoadmap({ careerPath = "Software Engineer" }: CareerRoadmapProps) {
  const { toast } = useToast();
  const [userProgress, setUserProgress] = useState({
    currentStep: 1,
    completedSteps: ["Introduction"],
    coursesCompleted: 0,
    projectsCompleted: 0
  });

  // Fetch user progress data
  useEffect(() => {
    const fetchUserProgress = async () => {
      try {
        const data = await apiRequest({
          url: "/api/career/roadmap/progress",
          method: "GET"
        });
        setUserProgress(data);
      } catch (error) {
        console.error("Error fetching user progress:", error);
      }
    };

    fetchUserProgress();
  }, []);

  // Mark a step as started
  const startStep = async (step: string) => {
    try {
      const updatedData = await apiRequest({
        url: "/api/career/roadmap/progress/step",
        method: "POST",
        body: {
          step,
          action: "start"
        }
      });
      
      toast({
        title: "Step started",
        description: `You've started the ${step} step in your career journey.`
      });
      
      setUserProgress(updatedData);
    } catch (error) {
      console.error("Error starting step:", error);
      toast({
        title: "Unable to start step",
        description: "Please complete the previous steps first.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="mx-auto max-w-5xl">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-primary/10 to-primary/5 border-b p-6">
          <h1 className="text-2xl font-bold">Your Career Roadmap</h1>
          <p className="text-gray-600 mt-2">Follow these steps to establish yourself as a {careerPath}</p>
        </div>
        
        <div className="p-6">
          <div className="bg-gradient-to-r from-primary/20 to-primary/5 rounded-xl p-6 mb-8 shadow-sm">
            <h3 className="text-xl font-bold flex items-center">
              <span className="mr-3 text-2xl">🎯</span>
              You're on the path to becoming a {careerPath} expert!
            </h3>
            <p className="text-sm text-gray-600 mt-2 ml-8">
              Progress: {userProgress.completedSteps.length}/6 checkpoints completed
            </p>
            <CareerTipTooltip
              tip="Your personalized career roadmap will guide you through all the steps needed to establish yourself in your chosen field"
              category="roadmap"
              className="mt-3 inline-block ml-8"
            >
              <Badge variant="outline" className="border-primary/50 text-primary bg-white cursor-help hover:bg-primary/5">
                How does this work?
              </Badge>
            </CareerTipTooltip>
          </div>
          
          <TipCard 
            context="pathfinder" 
            secondaryContext="results" 
            className="mb-8 shadow-sm"
            showRefresh={true}
          />
          
          <div className="bg-white rounded-lg p-6 border border-gray-100 shadow-sm mb-8">
            <h3 className="font-semibold text-lg mb-6">Your career journey roadmap</h3>
            
            <div className="relative ml-4 pl-6 border-l-2 border-dashed border-gray-300">
              {['Introduction', 'Skills', 'Courses', 'Projects', 'Resume', 'Network'].map((checkpoint, index) => {
                const isCompleted = userProgress.completedSteps.includes(checkpoint);
                const isActive = index === userProgress.completedSteps.length;
                
                return (
                  <div key={checkpoint} className="mb-10 relative">
                    <div className={cn(
                      "absolute -left-[28px] h-8 w-8 rounded-full border-2 flex items-center justify-center",
                      isCompleted 
                        ? "bg-primary border-primary text-white" 
                        : isActive
                          ? "bg-primary/10 border-primary text-primary"
                          : "bg-white border-gray-300"
                    )}>
                      {isCompleted ? '✓' : (index + 1)}
                    </div>
                    <div className={cn(
                      "p-5 rounded-lg border bg-white",
                      isCompleted 
                        ? "border-primary shadow-sm" 
                        : isActive
                          ? "border-primary/30"
                          : "border-gray-200"
                    )}>
                      <div className="flex items-center justify-between">
                        <h4 className="font-bold text-lg">{checkpoint}</h4>
                        <CareerTipTooltip
                          tip={
                            checkpoint === "Introduction" 
                              ? "The introduction helps you understand the basics of your chosen career path."
                              : checkpoint === "Skills" 
                                ? `This section will guide you through acquiring the essential skills needed for a ${careerPath} role.`
                                : checkpoint === "Courses" 
                                ? "Recommended learning resources to master the required skills for your career path."
                                : checkpoint === "Projects" 
                                ? "Hands-on projects to build your portfolio and demonstrate your capabilities."
                                : checkpoint === "Resume" 
                                ? "Create a tailored resume for your chosen career path with our guided builder."
                                : "Connect with mentors and peers to expand your professional network."
                          }
                          category={isCompleted ? "roadmap" : "skill"}
                          showIcon={true}
                        >
                          <InfoIcon className="h-4 w-4 text-gray-400 hover:text-primary cursor-help" />
                        </CareerTipTooltip>
                      </div>
                      <p className="text-gray-600 text-sm mt-2">
                        {isCompleted 
                          ? `Completed! ${checkpoint === 'Introduction' 
                              ? `You've started your journey toward a career in ${careerPath}.`
                              : checkpoint === 'Courses'
                              ? `You've completed ${userProgress.coursesCompleted} courses.`
                              : checkpoint === 'Projects'
                              ? `You've completed ${userProgress.projectsCompleted} projects.`
                              : 'Great job completing this milestone!'}`
                          : isActive
                          ? `This step is now available. Start exploring the ${checkpoint.toLowerCase()} section.`
                          : 'Unlock this section by completing previous steps.'}
                      </p>
                      
                      {isActive && (
                        <Button 
                          size="sm" 
                          className="mt-3" 
                          onClick={() => startStep(checkpoint)}
                        >
                          Start Learning
                        </Button>
                      )}
                      
                      {!isActive && !isCompleted && (
                        <Button size="sm" className="mt-3" variant="outline" disabled>
                          Locked
                        </Button>
                      )}
                      
                      {isCompleted && checkpoint !== 'Introduction' && (
                        <Button size="sm" className="mt-3" variant="outline">
                          Review
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-6 border border-gray-100 shadow-sm">
            <h3 className="font-semibold text-lg mb-4">Resources for your journey</h3>
            
            {/* Resources section with loading state */}
            <ResourcesSection careerPath={careerPath} />
          </div>
        </div>
      </div>
    </div>
  );
}