import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSidebar } from "@/hooks/use-sidebar";
import Sidebar from "@/components/layout/Sidebar";
import MobileHeader from "@/components/ui/mobile-header";
import MobileNavigation from "@/components/layout/MobileNavigation";
import MobileSidebar from "@/components/layout/MobileSidebar";
import ProjectCard from "@/components/projects/ProjectCard";
import BuildItBoards from "@/components/projects/BuildItBoards";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { GitBranch, Search, X, BookOpen } from "lucide-react";
import { Project, UserProject, User } from "@shared/schema";

// Default user data when user is not authenticated
const defaultUser: User = {
  id: 0,
  username: 'guest',
  name: 'Ananya Singh',
  email: 'ananya.s@example.com',
  password: '',
  bio: null,
  avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6',
  createdAt: new Date()
};

// Mock user ID until authentication is implemented
const USER_ID = 1;

interface ProjectsProps {}

export default function Projects({}: ProjectsProps) {
  const { isSidebarOpen, closeSidebar } = useSidebar();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [difficultyFilter, setDifficultyFilter] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"classic" | "boards">("classic");

  // Fetch projects from projects API
  const { data: projects = [], isLoading } = useQuery<Project[]>({
    queryKey: ['/api/projects', { careerTrack: selectedCategory, difficulty: difficultyFilter }],
    queryFn: undefined, // Use default queryFn from queryClient
  });

  // Fetch user data
  const { data: userData } = useQuery<User>({
    queryKey: [`/api/users/${USER_ID}`],
    queryFn: undefined, // Use default queryFn from queryClient
  });

  // Fetch user projects
  const { data: userProjects = [] } = useQuery<UserProject[]>({
    queryKey: [`/api/users/${USER_ID}/user-projects`],
    queryFn: undefined, // Use default queryFn from queryClient
  });

  // Close sidebar when navigating to this page
  useEffect(() => {
    closeSidebar();
  }, [closeSidebar]);

  // Filter projects based on search term, category and difficulty
  const filteredProjects = projects.filter((project: Project) => {
    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         project.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = !selectedCategory || project.careerTrack === selectedCategory;
    
    const matchesDifficulty = !difficultyFilter || difficultyFilter === "all" || 
                             project.difficulty === difficultyFilter;
                             
    return matchesSearch && matchesCategory && matchesDifficulty;
  });

  // Get all available career tracks from projects
  const categoriesSet = new Set<string>();
  projects.forEach((project: Project) => {
    if (project.careerTrack) {
      categoriesSet.add(project.careerTrack);
    }
  });
  const categories = Array.from(categoriesSet);

  // Find in-progress projects
  const inProgressProjects = userProjects.filter((userProject: UserProject) => 
    !userProject.isCompleted
  );

  // Find completed projects
  const completedProjects = userProjects.filter((userProject: UserProject) => 
    userProject.isCompleted
  );

  // Clear all filters
  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCategory(null);
    setDifficultyFilter(null);
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Mobile Header */}
      <MobileHeader user={userData || defaultUser} />

      {/* Sidebar */}
      <Sidebar user={userData || defaultUser} />

      {/* Mobile Sidebar */}
      {isSidebarOpen && (
        <MobileSidebar 
          isOpen={isSidebarOpen} 
          onClose={closeSidebar} 
          user={userData || defaultUser}
        />
      )}

      {/* Main Content */}
      <main className="flex-1 relative">
        <div className="px-4 py-6 md:px-8 pb-20 md:pb-6">
          <div className="flex flex-col md:flex-row justify-between md:items-center mb-6 gap-3">
            <div className="flex items-center">
              <GitBranch className="h-6 w-6 mr-2 text-primary" />
              <h1 className="text-2xl font-bold text-gray-900">Projects</h1>
            </div>
            
            {/* View Mode Toggle */}
            <Tabs
              value={viewMode}
              onValueChange={(value) => setViewMode(value as "classic" | "boards")}
              className="w-full md:w-auto"
            >
              <TabsList className="grid w-full md:w-auto grid-cols-2">
                <TabsTrigger value="classic" className="text-xs md:text-sm">
                  <BookOpen className="mr-1 h-4 w-4" />
                  Classic View
                </TabsTrigger>
                <TabsTrigger value="boards" className="text-xs md:text-sm">
                  <GitBranch className="mr-1 h-4 w-4" />
                  Build-It Boards
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {/* My Projects Section */}
          {viewMode === "classic" && (inProgressProjects.length > 0 || completedProjects.length > 0) && (
            <div className="mb-8">
              <h2 className="text-lg font-semibold mb-4">My Projects</h2>
              
              <Tabs defaultValue="in-progress" className="w-full">
                <TabsList className="w-full md:w-auto justify-start mb-4">
                  <TabsTrigger value="in-progress">In Progress ({inProgressProjects.length})</TabsTrigger>
                  <TabsTrigger value="completed">Completed ({completedProjects.length})</TabsTrigger>
                </TabsList>
                
                <TabsContent value="in-progress">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {inProgressProjects.length > 0 ? (
                      inProgressProjects.map((userProject: UserProject) => {
                        const project = projects.find((p: Project) => p.id === userProject.projectId);
                        return project ? <ProjectCard key={userProject.id} project={project} /> : null;
                      })
                    ) : (
                      <div className="col-span-full text-center py-8 bg-gray-50 rounded-lg">
                        <p className="text-gray-600 mb-4">
                          You don't have any projects in progress.
                        </p>
                        <Button className="bg-primary">Start a New Project</Button>
                      </div>
                    )}
                  </div>
                </TabsContent>
                
                <TabsContent value="completed">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {completedProjects.length > 0 ? (
                      completedProjects.map((userProject: UserProject) => {
                        const project = projects.find((p: Project) => p.id === userProject.projectId);
                        return project ? <ProjectCard key={userProject.id} project={project} /> : null;
                      })
                    ) : (
                      <div className="col-span-full text-center py-8 bg-gray-50 rounded-lg">
                        <p className="text-gray-600 mb-4">
                          You haven't completed any projects yet.
                        </p>
                        <Button className="bg-primary">Explore Projects</Button>
                      </div>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          )}

          {/* Build-It Boards View */}
          {viewMode === "boards" ? (
            <BuildItBoards />
          ) : (
            <>
              {/* Classic View - Search and Filter Bar */}
              <div className="mb-6 space-y-4">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    <Input
                      placeholder="Search projects..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-9"
                    />
                    {searchTerm && (
                      <button 
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        onClick={() => setSearchTerm("")}
                      >
                        <X size={18} />
                      </button>
                    )}
                  </div>
                  
                  <div className="flex gap-2">
                    <Select value={difficultyFilter || ""} onValueChange={setDifficultyFilter}>
                      <SelectTrigger className="w-36">
                        <SelectValue placeholder="Difficulty" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Levels</SelectItem>
                        <SelectItem value="Beginner">Beginner</SelectItem>
                        <SelectItem value="Intermediate">Intermediate</SelectItem>
                        <SelectItem value="Advanced">Advanced</SelectItem>
                      </SelectContent>
                    </Select>
                    
                    {(selectedCategory || difficultyFilter) && (
                      <Button 
                        variant="ghost" 
                        onClick={clearFilters}
                        className="text-primary"
                      >
                        Clear Filters
                      </Button>
                    )}
                  </div>
                </div>
                
                {/* Desktop Category Tabs */}
                <div>
                  <Tabs defaultValue="all" className="w-full">
                    <TabsList className="w-full justify-start">
                      <TabsTrigger 
                        value="all"
                        onClick={() => setSelectedCategory(null)}
                        className={!selectedCategory ? "data-[state=active]:bg-primary data-[state=active]:text-primary-foreground" : ""}
                      >
                        All Projects
                      </TabsTrigger>
                      {categories.map((category: string) => (
                        <TabsTrigger 
                          key={category}
                          value={category}
                          onClick={() => setSelectedCategory(category)}
                          className={selectedCategory === category ? "data-[state=active]:bg-primary data-[state=active]:text-primary-foreground" : ""}
                        >
                          {category}
                        </TabsTrigger>
                      ))}
                    </TabsList>
                  </Tabs>
                </div>
                
                {/* Applied Filters */}
                {(selectedCategory || difficultyFilter) && (
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500">Filters:</span>
                    {selectedCategory && (
                      <Badge 
                        variant="secondary"
                        className="gap-1"
                      >
                        {selectedCategory}
                        <button onClick={() => setSelectedCategory(null)}>
                          <X size={14} />
                        </button>
                      </Badge>
                    )}
                    
                    {difficultyFilter && (
                      <Badge 
                        variant="secondary"
                        className="gap-1"
                      >
                        {difficultyFilter}
                        <button onClick={() => setDifficultyFilter(null)}>
                          <X size={14} />
                        </button>
                      </Badge>
                    )}
                  </div>
                )}
              </div>
              
              {/* Project Listing */}
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold">
                    {selectedCategory ? `${selectedCategory} Projects` : 'Available Projects'}
                  </h2>
                  <p className="text-sm text-gray-500">{filteredProjects.length} projects</p>
                </div>
                
                {isLoading ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                      <div key={i} className="bg-gray-100 animate-pulse rounded-lg h-60"></div>
                    ))}
                  </div>
                ) : filteredProjects.length === 0 ? (
                  <div className="text-center py-12 bg-gray-50 rounded-lg">
                    <GitBranch className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No projects found</h3>
                    <p className="text-gray-600 mb-4">
                      We couldn't find any projects matching your filters.
                    </p>
                    <Button onClick={clearFilters}>Clear Filters</Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredProjects.map((project: Project) => (
                      <ProjectCard key={project.id} project={project} />
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </main>

      {/* Mobile Navigation */}
      <MobileNavigation />
    </div>
  );
}
