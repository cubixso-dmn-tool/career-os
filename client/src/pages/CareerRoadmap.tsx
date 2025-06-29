import { useState, useEffect } from "react";
import Layout from "@/components/layout/Layout";
import { useQuery } from "@tanstack/react-query";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import {
  Target,
  BookOpen,
  Code,
  Users,
  FileText,
  Briefcase,
  CheckCircle,
  Circle,
  Play,
  Lock,
  RotateCcw,
  Loader2,
  Trophy,
  Calendar,
  Clock,
  Star,
  ChevronRight,
  Lightbulb,
  TrendingUp,
  Award,
  Zap,
  ExternalLink,
  Download,
  Share
} from "lucide-react";

export default function CareerRoadmapPage() {
  const { toast } = useToast();
  const [careerPath, setCareerPath] = useState<string>("Software Engineer");
  const [isLoading, setIsLoading] = useState(true);
  const [userProgress, setUserProgress] = useState({
    currentStep: 1,
    completedSteps: ["Introduction"],
    coursesCompleted: 0,
    projectsCompleted: 0,
    totalSteps: 6,
    progressPercentage: 16
  });
  const [resources, setResources] = useState<any>(null);
  const [resourcesLoading, setResourcesLoading] = useState(false);
  
  // Fetch user profile/career data
  const { data: userData, isSuccess, isError } = useQuery({
    queryKey: ['/api/users/profile']
  });
  
  // Roadmap steps with enhanced metadata
  const roadmapSteps = [
    {
      id: "introduction",
      title: "Introduction",
      icon: Target,
      description: "Understand your career path fundamentals",
      estimatedTime: "1-2 hours",
      difficulty: "Beginner",
      tasks: ["Complete career overview", "Set learning goals", "Understand industry basics"]
    },
    {
      id: "skills",
      title: "Core Skills",
      icon: Zap,
      description: "Master essential technical and soft skills",
      estimatedTime: "2-4 weeks",
      difficulty: "Intermediate",
      tasks: ["Learn programming languages", "Practice problem solving", "Develop communication skills"]
    },
    {
      id: "courses",
      title: "Learning Path",
      icon: BookOpen,
      description: "Complete structured courses and certifications",
      estimatedTime: "3-6 months",
      difficulty: "Intermediate",
      tasks: ["Complete core courses", "Earn certifications", "Build knowledge base"]
    },
    {
      id: "projects",
      title: "Portfolio Projects",
      icon: Code,
      description: "Build impressive projects to showcase your skills",
      estimatedTime: "2-4 months",
      difficulty: "Advanced",
      tasks: ["Create personal projects", "Contribute to open source", "Document your work"]
    },
    {
      id: "resume",
      title: "Professional Resume",
      icon: FileText,
      description: "Craft a compelling resume that stands out",
      estimatedTime: "1-2 weeks",
      difficulty: "Beginner",
      tasks: ["Write compelling content", "Format professionally", "Tailor for jobs"]
    },
    {
      id: "network",
      title: "Professional Network",
      icon: Users,
      description: "Connect with industry professionals and mentors",
      estimatedTime: "Ongoing",
      difficulty: "Intermediate",
      tasks: ["Join communities", "Attend events", "Find mentors"]
    }
  ];

  // Load career path and fetch progress
  useEffect(() => {
    const loadCareerData = async () => {
      try {
        // Load career path from localStorage or API
        const storedCareerPath = localStorage.getItem('selectedCareerPath');
        if (storedCareerPath) {
          setCareerPath(storedCareerPath);
        } else if (userData && typeof userData === 'object') {
          const profile = userData as any;
          if (profile.careerPath?.title) {
            setCareerPath(profile.careerPath.title);
          }
        }

        // Fetch user progress
        const progressData = await apiRequest({
          url: "/api/career/roadmap/progress",
          method: "GET"
        });
        
        const completedCount = progressData.completedSteps?.length || 1;
        const progressPercentage = Math.round((completedCount / 6) * 100);
        
        setUserProgress({
          ...progressData,
          totalSteps: 6,
          progressPercentage
        });

      } catch (error) {
        console.error("Error loading career data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (isSuccess || isError) {
      loadCareerData();
    }
  }, [isSuccess, isError, userData]);

  // Fetch resources
  useEffect(() => {
    const fetchResources = async () => {
      if (!careerPath) return;
      
      try {
        setResourcesLoading(true);
        const data = await apiRequest({
          url: `/api/career/roadmap/resources/${encodeURIComponent(careerPath)}`,
          method: "GET"
        });
        setResources(data);
      } catch (error) {
        console.error("Error fetching resources:", error);
      } finally {
        setResourcesLoading(false);
      }
    };

    fetchResources();
  }, [careerPath]);

  // Start a roadmap step
  const startStep = async (stepId: string) => {
    try {
      const updatedData = await apiRequest({
        url: "/api/career/roadmap/progress/step",
        method: "POST",
        body: { step: stepId, action: "start" }
      });
      
      setUserProgress(prev => ({
        ...updatedData,
        totalSteps: 6,
        progressPercentage: Math.round(((updatedData.completedSteps?.length || 0) / 6) * 100)
      }));
      
      toast({
        title: "Step started",
        description: `You've started the ${roadmapSteps.find(s => s.id === stepId)?.title} step.`
      });
    } catch (error) {
      toast({
        title: "Unable to start step",
        description: "Please complete the previous steps first.",
        variant: "destructive"
      });
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-100 text-green-700';
      case 'Intermediate': return 'bg-yellow-100 text-yellow-700';
      case 'Advanced': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Header Section */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Career Roadmap</h1>
            <p className="text-gray-600 mt-1">Your personalized journey to becoming a {careerPath}</p>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="text-sm">
              <Trophy className="w-4 h-4 mr-1" />
              {userProgress.progressPercentage}% Complete
            </Badge>
            <Button variant="outline" size="sm">
              <Share className="w-4 h-4 mr-2" />
              Share Progress
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Progress Overview Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="w-5 h-5" />
                  <span>Your Progress</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Overall Progress */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Overall Progress</span>
                    <span className="text-sm text-gray-500">{userProgress.progressPercentage}%</span>
                  </div>
                  <Progress value={userProgress.progressPercentage} className="h-2" />
                  <p className="text-xs text-gray-500 mt-1">
                    {userProgress.completedSteps?.length || 0} of {userProgress.totalSteps} steps completed
                  </p>
                </div>

                <Separator />

                {/* Quick Stats */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Courses Completed</span>
                    <Badge variant="secondary">{userProgress.coursesCompleted}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Projects Built</span>
                    <Badge variant="secondary">{userProgress.projectsCompleted}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Current Step</span>
                    <Badge variant="outline">{userProgress.currentStep}/6</Badge>
                  </div>
                </div>

                <Separator />

                {/* Next Milestone */}
                <div className="p-3 bg-primary/5 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <Target className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium">Next Milestone</span>
                  </div>
                  <p className="text-xs text-gray-600">
                    Complete {roadmapSteps[userProgress.currentStep - 1]?.title || "current step"} to unlock new opportunities
                  </p>
                </div>

                {/* Career Path Info */}
                <div className="p-3 bg-gray-50 rounded-lg">
                  <h4 className="text-sm font-medium mb-2">{careerPath}</h4>
                  <p className="text-xs text-gray-600">
                    You're on track to master the skills needed for this career path.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Career Journey Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Briefcase className="w-5 h-5" />
                  <span>Your Career Journey</span>
                </CardTitle>
                <CardDescription>
                  Follow these structured steps to build expertise in {careerPath}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {roadmapSteps.map((step, index) => {
                    const isCompleted = userProgress.completedSteps?.includes(step.title) || false;
                    const isActive = index === (userProgress.currentStep - 1);
                    const isLocked = index > (userProgress.currentStep - 1);
                    const StepIcon = step.icon;

                    return (
                      <div key={step.id} className="relative">
                        {index < roadmapSteps.length - 1 && (
                          <div className="absolute left-6 top-16 w-0.5 h-16 bg-gray-200" />
                        )}
                        
                        <div className={cn(
                          "flex items-start space-x-4 p-4 rounded-lg border transition-all duration-200",
                          isCompleted ? "bg-green-50 border-green-200" :
                          isActive ? "bg-blue-50 border-blue-200" :
                          "bg-white border-gray-200 opacity-75"
                        )}>
                          {/* Step Icon */}
                          <div className={cn(
                            "flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center transition-colors",
                            isCompleted ? "bg-green-100 text-green-600" :
                            isActive ? "bg-blue-100 text-blue-600" :
                            "bg-gray-100 text-gray-400"
                          )}>
                            {isCompleted ? (
                              <CheckCircle className="w-6 h-6" />
                            ) : isLocked ? (
                              <Lock className="w-6 h-6" />
                            ) : (
                              <StepIcon className="w-6 h-6" />
                            )}
                          </div>

                          {/* Step Content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center space-x-3">
                                <h3 className="text-lg font-semibold">{step.title}</h3>
                                <Badge 
                                  variant="secondary" 
                                  className={getDifficultyColor(step.difficulty)}
                                >
                                  {step.difficulty}
                                </Badge>
                              </div>
                              <div className="flex items-center space-x-2 text-sm text-gray-500">
                                <Clock className="w-4 h-4" />
                                <span>{step.estimatedTime}</span>
                              </div>
                            </div>

                            <p className="text-gray-600 mb-3">{step.description}</p>

                            {/* Task List */}
                            <div className="mb-4">
                              <h4 className="text-sm font-medium mb-2">Key Tasks:</h4>
                              <ul className="text-sm text-gray-600 space-y-1">
                                {step.tasks.map((task, taskIndex) => (
                                  <li key={taskIndex} className="flex items-center space-x-2">
                                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full" />
                                    <span>{task}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex items-center space-x-3">
                              {isCompleted ? (
                                <div className="flex items-center space-x-2">
                                  <Badge variant="default" className="bg-green-600">
                                    <CheckCircle className="w-3 h-3 mr-1" />
                                    Completed
                                  </Badge>
                                  <Button variant="outline" size="sm">
                                    <RotateCcw className="w-4 h-4 mr-2" />
                                    Review
                                  </Button>
                                </div>
                              ) : isActive ? (
                                <Button onClick={() => startStep(step.title)} className="bg-blue-600 hover:bg-blue-700">
                                  <Play className="w-4 h-4 mr-2" />
                                  Start Learning
                                </Button>
                              ) : (
                                <Button variant="outline" disabled>
                                  <Lock className="w-4 h-4 mr-2" />
                                  Locked
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Learning Resources */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Lightbulb className="w-5 h-5" />
                  <span>Learning Resources</span>
                </CardTitle>
                <CardDescription>
                  Curated resources to accelerate your {careerPath} journey
                </CardDescription>
              </CardHeader>
              <CardContent>
                {resourcesLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-6 h-6 animate-spin" />
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Recommended Books */}
                    <div className="space-y-4">
                      <div className="flex items-center space-x-2">
                        <BookOpen className="w-5 h-5 text-blue-600" />
                        <h4 className="font-semibold">Recommended Reading</h4>
                      </div>
                      <div className="space-y-3">
                        {resources?.recommendedBooks?.map((book: any, index: number) => (
                          <div key={index} className="p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                            <h5 className="font-medium text-sm">"{book.title}"</h5>
                            <p className="text-xs text-gray-600">by {book.author}</p>
                            <Button variant="ghost" size="sm" className="mt-2 h-6 text-xs">
                              <ExternalLink className="w-3 h-3 mr-1" />
                              View
                            </Button>
                          </div>
                        )) || (
                          <>
                            <div className="p-3 border rounded-lg">
                              <h5 className="font-medium text-sm">"The Pragmatic Programmer"</h5>
                              <p className="text-xs text-gray-600">by Andrew Hunt</p>
                            </div>
                            <div className="p-3 border rounded-lg">
                              <h5 className="font-medium text-sm">"Clean Code"</h5>
                              <p className="text-xs text-gray-600">by Robert C. Martin</p>
                            </div>
                            <div className="p-3 border rounded-lg">
                              <h5 className="font-medium text-sm">"Cracking the Coding Interview"</h5>
                              <p className="text-xs text-gray-600">by Gayle McDowell</p>
                            </div>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Online Resources */}
                    <div className="space-y-4">
                      <div className="flex items-center space-x-2">
                        <Code className="w-5 h-5 text-green-600" />
                        <h4 className="font-semibold">Online Platforms</h4>
                      </div>
                      <div className="space-y-3">
                        {resources?.onlineResources?.map((resource: any, index: number) => (
                          <div key={index} className="p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                            <h5 className="font-medium text-sm">{resource.name}</h5>
                            <p className="text-xs text-gray-600">{resource.description || "Learning platform"}</p>
                            <Button variant="ghost" size="sm" className="mt-2 h-6 text-xs">
                              <ExternalLink className="w-3 h-3 mr-1" />
                              Visit
                            </Button>
                          </div>
                        )) || (
                          <>
                            <div className="p-3 border rounded-lg">
                              <h5 className="font-medium text-sm">LeetCode</h5>
                              <p className="text-xs text-gray-600">Coding practice and interviews</p>
                            </div>
                            <div className="p-3 border rounded-lg">
                              <h5 className="font-medium text-sm">GitHub</h5>
                              <p className="text-xs text-gray-600">Portfolio and open source projects</p>
                            </div>
                            <div className="p-3 border rounded-lg">
                              <h5 className="font-medium text-sm">Stack Overflow</h5>
                              <p className="text-xs text-gray-600">Problem solving community</p>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Achievement & Motivation */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Award className="w-5 h-5" />
                  <span>Your Achievements</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <Star className="w-6 h-6 text-blue-600" />
                    </div>
                    <h4 className="font-semibold text-sm">Steps Completed</h4>
                    <p className="text-2xl font-bold text-blue-600">{userProgress.completedSteps?.length || 0}</p>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <BookOpen className="w-6 h-6 text-green-600" />
                    </div>
                    <h4 className="font-semibold text-sm">Courses Done</h4>
                    <p className="text-2xl font-bold text-green-600">{userProgress.coursesCompleted}</p>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <Code className="w-6 h-6 text-purple-600" />
                    </div>
                    <h4 className="font-semibold text-sm">Projects Built</h4>
                    <p className="text-2xl font-bold text-purple-600">{userProgress.projectsCompleted}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}