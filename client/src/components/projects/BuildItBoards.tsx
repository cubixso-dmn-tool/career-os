import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { 
  Tabs, 
  TabsList, 
  TabsTrigger, 
  TabsContent 
} from "@/components/ui/tabs";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  GitBranch, 
  Code, 
  Database, 
  PanelLeft, 
  LineChart, 
  Smartphone, 
  Laptop, 
  Bot, 
  Lock, 
  CloudCog,
  ChevronRight,
  GitBranchPlus
} from "lucide-react";
import ProjectCard from "./ProjectCard";
import { cn } from "@/lib/utils";

// Define the career tracks with their icons
const CAREER_TRACKS = [
  { 
    id: "frontend", 
    name: "Frontend Development", 
    icon: <PanelLeft className="h-5 w-5" />,
    color: "text-blue-500",
    description: "Build responsive and interactive user interfaces using modern frameworks"
  },
  { 
    id: "backend", 
    name: "Backend Development", 
    icon: <Database className="h-5 w-5" />,
    color: "text-green-500",
    description: "Create scalable server-side applications and robust APIs"
  },
  { 
    id: "fullstack", 
    name: "Full-Stack Development", 
    icon: <Code className="h-5 w-5" />,
    color: "text-purple-500",
    description: "Master both frontend and backend technologies for end-to-end solutions"
  },
  { 
    id: "mobile", 
    name: "Mobile Development", 
    icon: <Smartphone className="h-5 w-5" />,
    color: "text-orange-500",
    description: "Build native and cross-platform mobile applications"
  },
  { 
    id: "data", 
    name: "Data Science", 
    icon: <LineChart className="h-5 w-5" />,
    color: "text-red-500",
    description: "Analyze and visualize data to extract valuable insights"
  },
  { 
    id: "ai", 
    name: "AI & ML", 
    icon: <Bot className="h-5 w-5" />,
    color: "text-yellow-500",
    description: "Create intelligent systems with machine learning and AI algorithms"
  },
  { 
    id: "devops", 
    name: "DevOps", 
    icon: <CloudCog className="h-5 w-5" />,
    color: "text-teal-500",
    description: "Build and maintain deployment pipelines and infrastructure"
  },
  { 
    id: "security", 
    name: "Security", 
    icon: <Lock className="h-5 w-5" />,
    color: "text-amber-500",
    description: "Protect applications and systems from security vulnerabilities"
  }
];

// Difficulty levels with visual indicators
const DIFFICULTY_LEVELS = [
  { 
    id: "beginner", 
    name: "Beginner", 
    description: "Perfect for those new to programming",
    color: "bg-green-500"
  },
  { 
    id: "intermediate", 
    name: "Intermediate", 
    description: "For those with some programming experience",
    color: "bg-amber-500"
  },
  { 
    id: "advanced", 
    name: "Advanced", 
    description: "Challenging projects for experienced developers",
    color: "bg-red-500"
  }
];

// Career track component
interface CareerTrackProps {
  track: typeof CAREER_TRACKS[0];
  isSelected: boolean;
  onClick: () => void;
}

function CareerTrackButton({ track, isSelected, onClick }: CareerTrackProps) {
  return (
    <div
      className={cn(
        "border rounded-lg p-3 cursor-pointer transition-all",
        isSelected 
          ? "border-primary bg-primary/5" 
          : "border-gray-200 hover:border-gray-300"
      )}
      onClick={onClick}
    >
      <div className="flex items-center">
        <div className={cn("mr-3", track.color)}>
          {track.icon}
        </div>
        <div>
          <h3 className="font-medium">{track.name}</h3>
          <p className="text-xs text-gray-500 line-clamp-1">
            {track.description}
          </p>
        </div>
      </div>
    </div>
  );
}

// Build-It Boards Component
export default function BuildItBoards() {
  const [selectedTrack, setSelectedTrack] = useState<string>("frontend");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>(null);
  
  // Fetch projects from API
  const { data: projects = [], isLoading } = useQuery({
    queryKey: ['/api/content-management/projects', { careerTrack: selectedTrack, difficulty: selectedDifficulty }],
    queryFn: undefined, // Use default queryFn from queryClient
  });
  
  // Filter projects by career track and difficulty
  const filteredProjects = projects.filter((project: any) => {
    const matchesCareerTrack = project.careerTrack === selectedTrack;
    const matchesDifficulty = !selectedDifficulty || project.difficulty.toLowerCase() === selectedDifficulty;
    
    return matchesCareerTrack && matchesDifficulty;
  });
  
  // Projects grouped by difficulty
  const beginnerProjects = projects.filter((project: any) => 
    project.careerTrack === selectedTrack && project.difficulty.toLowerCase() === 'beginner'
  );
  
  const intermediateProjects = projects.filter((project: any) => 
    project.careerTrack === selectedTrack && project.difficulty.toLowerCase() === 'intermediate'
  );
  
  const advancedProjects = projects.filter((project: any) => 
    project.careerTrack === selectedTrack && project.difficulty.toLowerCase() === 'advanced'
  );
  
  // Featured or popular projects
  const popularProjects = projects.filter((project: any) => 
    project.isPopular === true && project.careerTrack === selectedTrack
  ).slice(0, 3);
  
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center text-gray-900">
            <GitBranchPlus className="mr-2 h-6 w-6 text-primary" />
            Build-It Boards
          </h2>
          <p className="text-gray-600 mt-1">
            Discover projects tailored to your career path and skill level
          </p>
        </div>
      </div>
      
      {/* Career Track Selector */}
      <div className="bg-gray-50 rounded-xl p-6">
        <h3 className="text-lg font-medium mb-4">Choose Your Career Track</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {CAREER_TRACKS.map(track => (
            <CareerTrackButton
              key={track.id}
              track={track}
              isSelected={selectedTrack === track.id}
              onClick={() => setSelectedTrack(track.id)}
            />
          ))}
        </div>
      </div>
      
      {popularProjects.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold flex items-center">
              <span className="relative mr-2">
                🔥
                <span className="animate-ping absolute -top-1 -right-1 h-3 w-3 rounded-full bg-amber-400 opacity-75"></span>
              </span>
              Popular Projects in {CAREER_TRACKS.find(t => t.id === selectedTrack)?.name}
            </h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {popularProjects.map((project: any) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </div>
      )}
      
      {/* Project Boards By Difficulty */}
      <Tabs defaultValue="beginner" className="space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <TabsList className="h-auto p-1">
            {DIFFICULTY_LEVELS.map(level => (
              <TabsTrigger
                key={level.id}
                value={level.id}
                className="data-[state=active]:text-white relative h-9 px-4"
                style={{
                  ['--difficulty-color' as any]: level.color,
                }}
              >
                <span className="flex items-center">
                  <span 
                    className={`h-2 w-2 rounded-full ${level.color} mr-2`}
                  ></span>
                  {level.name}
                </span>
                
                {/* Count Badge */}
                {level.id === 'beginner' && beginnerProjects.length > 0 && (
                  <Badge variant="secondary" className="ml-2 text-xs">
                    {beginnerProjects.length}
                  </Badge>
                )}
                {level.id === 'intermediate' && intermediateProjects.length > 0 && (
                  <Badge variant="secondary" className="ml-2 text-xs">
                    {intermediateProjects.length}
                  </Badge>
                )}
                {level.id === 'advanced' && advancedProjects.length > 0 && (
                  <Badge variant="secondary" className="ml-2 text-xs">
                    {advancedProjects.length}
                  </Badge>
                )}
              </TabsTrigger>
            ))}
          </TabsList>
          
          <div className="text-sm text-gray-500 hidden md:block">
            Showing projects for <span className="font-semibold text-primary">
              {CAREER_TRACKS.find(t => t.id === selectedTrack)?.name}
            </span>
          </div>
        </div>
        
        {/* Beginner Projects Board */}
        <TabsContent value="beginner" className="m-0">
          <Card>
            <CardHeader className="bg-gradient-to-r from-green-50 to-green-100 border-b">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-green-800">Beginner Projects</CardTitle>
                  <CardDescription className="text-green-700">
                    Projects for those just starting out - build a solid foundation
                  </CardDescription>
                </div>
                <div className={`h-10 w-10 rounded-full flex items-center justify-center bg-green-500 text-white`}>
                  <span className="font-bold">{beginnerProjects.length}</span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              {isLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="bg-gray-100 animate-pulse rounded-lg h-60"></div>
                  ))}
                </div>
              ) : beginnerProjects.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {beginnerProjects.map((project: any) => (
                    <ProjectCard key={project.id} project={project} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 border-2 border-dashed rounded-lg">
                  <GitBranch className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No beginner projects found</h3>
                  <p className="text-gray-600 mb-4">
                    We couldn't find any beginner projects for {CAREER_TRACKS.find(t => t.id === selectedTrack)?.name}.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Intermediate Projects Board */}
        <TabsContent value="intermediate" className="m-0">
          <Card>
            <CardHeader className="bg-gradient-to-r from-amber-50 to-amber-100 border-b">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-amber-800">Intermediate Projects</CardTitle>
                  <CardDescription className="text-amber-700">
                    Projects that require some experience - expand your skillset
                  </CardDescription>
                </div>
                <div className={`h-10 w-10 rounded-full flex items-center justify-center bg-amber-500 text-white`}>
                  <span className="font-bold">{intermediateProjects.length}</span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              {isLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="bg-gray-100 animate-pulse rounded-lg h-60"></div>
                  ))}
                </div>
              ) : intermediateProjects.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {intermediateProjects.map((project: any) => (
                    <ProjectCard key={project.id} project={project} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 border-2 border-dashed rounded-lg">
                  <GitBranch className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No intermediate projects found</h3>
                  <p className="text-gray-600 mb-4">
                    We couldn't find any intermediate projects for {CAREER_TRACKS.find(t => t.id === selectedTrack)?.name}.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Advanced Projects Board */}
        <TabsContent value="advanced" className="m-0">
          <Card>
            <CardHeader className="bg-gradient-to-r from-red-50 to-red-100 border-b">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-red-800">Advanced Projects</CardTitle>
                  <CardDescription className="text-red-700">
                    Complex projects that demonstrate mastery - showcase your expertise
                  </CardDescription>
                </div>
                <div className={`h-10 w-10 rounded-full flex items-center justify-center bg-red-500 text-white`}>
                  <span className="font-bold">{advancedProjects.length}</span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              {isLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="bg-gray-100 animate-pulse rounded-lg h-60"></div>
                  ))}
                </div>
              ) : advancedProjects.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {advancedProjects.map((project: any) => (
                    <ProjectCard key={project.id} project={project} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 border-2 border-dashed rounded-lg">
                  <GitBranch className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No advanced projects found</h3>
                  <p className="text-gray-600 mb-4">
                    We couldn't find any advanced projects for {CAREER_TRACKS.find(t => t.id === selectedTrack)?.name}.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Career Path Progression */}
      <div className="mt-10">
        <h3 className="text-lg font-semibold mb-4">Career Path Progression</h3>
        <Card>
          <CardContent className="p-6">
            <div className="relative">
              {/* Progress Path */}
              <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-200 -translate-y-1/2"></div>
              
              <div className="flex justify-between relative">
                {DIFFICULTY_LEVELS.map((level, index) => (
                  <div key={level.id} className="flex flex-col items-center relative z-10">
                    <div className={`h-10 w-10 rounded-full flex items-center justify-center ${level.color} text-white`}>
                      {index + 1}
                    </div>
                    <span className="mt-2 font-medium text-gray-900">{level.name}</span>
                    <span className="text-xs text-gray-500 mt-1 text-center max-w-[120px]">
                      {level.description}
                    </span>
                    
                    {/* Show right arrow for all except the last item */}
                    {index < DIFFICULTY_LEVELS.length - 1 && (
                      <ChevronRight className="absolute -right-8 top-3 text-gray-400" />
                    )}
                  </div>
                ))}
              </div>
            </div>
            
            <div className="text-center mt-8 text-sm text-gray-600">
              Complete projects of increasing difficulty to advance your skills and build a comprehensive portfolio
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}