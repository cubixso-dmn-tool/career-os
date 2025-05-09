import { useEffect, useState } from "react";
import { useParams, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Briefcase, 
  Calendar, 
  Github, 
  Globe, 
  ChevronLeft,
  User,
  Clock,
  ExternalLink,
  Share2,
  Eye,
  Smartphone
} from "lucide-react";
import { format } from "date-fns";
import { apiRequest } from "@/lib/queryClient";

// Types
interface PortfolioLink {
  id: number;
  userId: number;
  title: string;
  description: string | null;
  slug: string;
  isPublic: boolean;
  viewCount: number;
  createdAt: string;
  expiresAt: string | null;
  user: {
    name: string;
    username: string;
    avatar: string | null;
  };
}

interface Project {
  id: number;
  title: string;
  description: string;
  difficulty: string;
  skills: string[];
  careerTrack: string;
  thumbnail: string | null;
}

interface UserProject {
  id: number;
  projectId: number;
  progress: number;
  isCompleted: boolean;
  isPublic: boolean;
  completedAt: string | null;
  repoUrl: string | null;
  demoUrl: string | null;
  description: string | null;
  feedback: string | null;
  reflection: string | null;
  project: Project;
}

interface PortfolioData {
  portfolioLink: PortfolioLink;
  projects: UserProject[];
}

export default function Portfolio() {
  const { slug } = useParams<{ slug: string }>();
  const [copied, setCopied] = useState(false);
  
  // Fetch portfolio data
  const { data, isLoading, error } = useQuery<PortfolioData>({
    queryKey: [`/api/portfolio/${slug}`],
    queryFn: async () => {
      // Also increment view count
      const response = await apiRequest("GET", `/api/portfolio/${slug}`);
      if (!response.ok) {
        throw new Error("Failed to fetch portfolio");
      }
      return response.json();
    },
  });
  
  useEffect(() => {
    // Reset the copied state after 2 seconds
    if (copied) {
      const timeout = setTimeout(() => setCopied(false), 2000);
      return () => clearTimeout(timeout);
    }
  }, [copied]);
  
  const copyShareableLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
  };
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  if (error || !data) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-4">
        <div className="text-center max-w-md">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Portfolio Not Found</h1>
          <p className="text-gray-600 mb-6">
            The portfolio you're looking for doesn't exist or has been made private.
          </p>
          <Button asChild>
            <Link href="/">
              <ChevronLeft className="mr-2 h-4 w-4" />
              Return Home
            </Link>
          </Button>
        </div>
      </div>
    );
  }
  
  const { portfolioLink, projects } = data;
  const user = portfolioLink.user;
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-6 max-w-7xl">
          <div className="flex justify-between items-center">
            <Link href="/">
              <a className="flex items-center">
                <div className="h-8 w-8 bg-primary rounded-md flex items-center justify-center text-white font-bold mr-2">
                  CP
                </div>
                <span className="text-lg font-bold">CareerOS</span>
              </a>
            </Link>
            
            <Button variant="outline" size="sm" onClick={copyShareableLink}>
              {copied ? (
                <>
                  <Check className="mr-1 h-4 w-4" />
                  Copied!
                </>
              ) : (
                <>
                  <Share2 className="mr-1 h-4 w-4" />
                  Share
                </>
              )}
            </Button>
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="max-w-5xl mx-auto">
          {/* Portfolio Header */}
          <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
            <div className="flex flex-col md:flex-row md:items-start gap-4 md:gap-6">
              <div className="flex-shrink-0">
                <div className="h-16 w-16 md:h-20 md:w-20 bg-primary/10 rounded-full flex items-center justify-center">
                  {user.avatar ? (
                    <img 
                      src={user.avatar} 
                      alt={user.name} 
                      className="h-full w-full rounded-full object-cover"
                    />
                  ) : (
                    <Briefcase className="h-8 w-8 md:h-10 md:w-10 text-primary" />
                  )}
                </div>
              </div>
              
              <div className="flex-1">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                  {portfolioLink.title}
                </h1>
                
                <div className="flex items-center text-sm text-gray-600 mb-3">
                  <User className="h-4 w-4 mr-1" />
                  <span>{user.name}</span>
                  <span className="mx-2">•</span>
                  <Eye className="h-4 w-4 mr-1" />
                  <span>{portfolioLink.viewCount} {portfolioLink.viewCount === 1 ? 'view' : 'views'}</span>
                  <span className="mx-2">•</span>
                  <Calendar className="h-4 w-4 mr-1" />
                  <span>
                    {format(new Date(portfolioLink.createdAt), 'MMM d, yyyy')}
                  </span>
                </div>
                
                {portfolioLink.description && (
                  <p className="text-gray-700">
                    {portfolioLink.description}
                  </p>
                )}
              </div>
            </div>
          </div>
          
          {/* Projects Grid */}
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-gray-900 flex items-center">
              <Briefcase className="h-5 w-5 mr-2 text-primary" />
              Completed Projects ({projects.length})
            </h2>
            
            {projects.length === 0 ? (
              <div className="bg-white border rounded-lg p-8 text-center">
                <p className="text-gray-600">No public projects available.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {projects.map((userProject) => (
                  <Card key={userProject.id} className="hover:shadow-md transition-shadow overflow-hidden">
                    {userProject.project.thumbnail && (
                      <div 
                        className="h-40 w-full bg-cover bg-center" 
                        style={{ backgroundImage: `url(${userProject.project.thumbnail})` }}
                      />
                    )}
                    
                    <CardHeader className={!userProject.project.thumbnail ? 'pt-6' : 'pt-4'}>
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-lg">{userProject.project.title}</CardTitle>
                        <Badge className="text-xs">
                          {userProject.project.difficulty}
                        </Badge>
                      </div>
                      
                      <CardDescription>
                        {userProject.description || userProject.project.description}
                      </CardDescription>
                    </CardHeader>
                    
                    <CardContent className="space-y-3">
                      {/* Skills */}
                      <div className="flex flex-wrap gap-1">
                        {userProject.project.skills?.map((skill, i) => (
                          <Badge key={i} variant="secondary" className="bg-gray-100">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                      
                      {/* Completion date */}
                      {userProject.completedAt && (
                        <div className="flex items-center text-xs text-gray-500">
                          <Clock className="h-3 w-3 mr-1" />
                          Completed on {format(new Date(userProject.completedAt), 'MMMM d, yyyy')}
                        </div>
                      )}
                      
                      {/* Project links */}
                      {(userProject.repoUrl || userProject.demoUrl) && (
                        <div className="flex flex-wrap gap-3">
                          {userProject.repoUrl && (
                            <a 
                              href={userProject.repoUrl} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="inline-flex items-center text-xs text-blue-600 hover:underline"
                            >
                              <Github className="h-3 w-3 mr-1" />
                              Repository
                            </a>
                          )}
                          
                          {userProject.demoUrl && (
                            <a 
                              href={userProject.demoUrl} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="inline-flex items-center text-xs text-blue-600 hover:underline"
                            >
                              <Smartphone className="h-3 w-3 mr-1" />
                              Live Demo
                            </a>
                          )}
                        </div>
                      )}
                      
                      {/* Reflection */}
                      {userProject.reflection && (
                        <div>
                          <Separator className="my-2" />
                          <h4 className="text-sm font-medium text-gray-900 mb-1">Learning Reflection</h4>
                          <p className="text-sm text-gray-600">{userProject.reflection}</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
      
      {/* Footer */}
      <footer className="bg-white border-t mt-12 py-6">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <div className="h-8 w-8 bg-primary rounded-md flex items-center justify-center text-white font-bold mr-2">
                CP
              </div>
              <span className="text-gray-600">
                Powered by <span className="font-semibold">CareerOS</span>
              </span>
            </div>
            
            <div className="flex items-center space-x-3">
              <Button variant="outline" size="sm" asChild>
                <Link href="/">
                  <ChevronLeft className="mr-1 h-4 w-4" />
                  Return to CareerOS
                </Link>
              </Button>
              
              <Button size="sm" onClick={copyShareableLink}>
                {copied ? "Copied!" : "Share Portfolio"}
              </Button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}