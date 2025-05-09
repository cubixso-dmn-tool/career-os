import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
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
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Project, UserProject } from "@shared/schema";
import { 
  Briefcase, 
  ExternalLink, 
  Github, 
  Globe, 
  Image, 
  Link2, 
  Lock, 
  Plus,
  Share2,
  Smartphone
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import ProjectCard from "./ProjectCard";

// Define the form schema for creating/editing portfolio link
const portfolioLinkSchema = z.object({
  title: z.string().min(3, {
    message: "Title must be at least 3 characters.",
  }),
  description: z.string().optional(),
  slug: z.string().min(3, {
    message: "Slug must be at least 3 characters.",
  }).regex(/^[a-z0-9-]+$/, {
    message: "Slug can only contain lowercase letters, numbers, and hyphens.",
  }),
  isPublic: z.boolean().default(true),
  expiresAt: z.string().optional()
});

const projectDetailsSchema = z.object({
  repoUrl: z.string().url({ message: "Please enter a valid URL" }).optional().or(z.literal("")),
  demoUrl: z.string().url({ message: "Please enter a valid URL" }).optional().or(z.literal("")),
  description: z.string().optional(),
  reflection: z.string().optional(),
  isPublic: z.boolean().default(false)
});

interface PortfolioLinkData {
  id: number;
  title: string;
  description: string | null;
  slug: string;
  isPublic: boolean;
  viewCount: number;
  createdAt: string;
  expiresAt: string | null;
}

export default function ProjectWallet() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("completed");
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null);
  const [isPortfolioDialogOpen, setIsPortfolioDialogOpen] = useState(false);
  const [isProjectDetailsDialogOpen, setIsProjectDetailsDialogOpen] = useState(false);
  
  // Fetch user projects from the server
  const { data: userProjects = [], isLoading: isLoadingProjects } = useQuery<UserProject[]>({
    queryKey: ["/api/user/projects"],
    queryFn: undefined, // Use default queryFn from queryClient
  });
  
  // Fetch projects from the server
  const { data: projects = [], isLoading: isLoadingProjectDetails } = useQuery<Project[]>({
    queryKey: ["/api/projects"],
    queryFn: undefined, // Use default queryFn from queryClient
  });
  
  // Fetch portfolio links
  const { data: portfolioLinks = [], isLoading: isLoadingPortfolio } = useQuery<PortfolioLinkData[]>({
    queryKey: ["/api/portfolio-links"],
    queryFn: undefined, // Use default queryFn from queryClient
  });
  
  // Create portfolio link mutation
  const createPortfolioLinkMutation = useMutation({
    mutationFn: async (data: z.infer<typeof portfolioLinkSchema>) => {
      const response = await apiRequest({
        url: "/api/portfolio-links",
        method: "POST",
        body: data
      });
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/portfolio-links"] });
      toast({
        title: "Success!",
        description: "Your portfolio link has been created.",
      });
      setIsPortfolioDialogOpen(false);
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  // Update project details mutation
  const updateProjectDetailsMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number, data: z.infer<typeof projectDetailsSchema> }) => {
      const response = await apiRequest({
        url: `/api/user/projects/${id}`,
        method: "PATCH",
        body: data
      });
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/user/projects"] });
      toast({
        title: "Success!",
        description: "Your project details have been updated.",
      });
      setIsProjectDetailsDialogOpen(false);
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  // Portfolio form
  const portfolioForm = useForm<z.infer<typeof portfolioLinkSchema>>({
    resolver: zodResolver(portfolioLinkSchema),
    defaultValues: {
      title: "",
      description: "",
      slug: "",
      isPublic: true,
    },
  });
  
  // Project details form
  const projectDetailsForm = useForm<z.infer<typeof projectDetailsSchema>>({
    resolver: zodResolver(projectDetailsSchema),
    defaultValues: {
      repoUrl: "",
      demoUrl: "",
      description: "",
      reflection: "",
      isPublic: false,
    },
  });
  
  const onPortfolioFormSubmit = (values: z.infer<typeof portfolioLinkSchema>) => {
    createPortfolioLinkMutation.mutate(values);
  };
  
  const onProjectDetailsFormSubmit = (values: z.infer<typeof projectDetailsSchema>) => {
    if (selectedProjectId) {
      updateProjectDetailsMutation.mutate({
        id: selectedProjectId,
        data: values,
      });
    }
  };
  
  const handleEditProjectDetails = (projectId: number) => {
    setSelectedProjectId(projectId);
    const userProject = userProjects.find(p => p.id === projectId);
    
    if (userProject) {
      projectDetailsForm.reset({
        repoUrl: userProject.repoUrl || "",
        demoUrl: userProject.demoUrl || "",
        description: userProject.description || "",
        reflection: userProject.reflection || "",
        isPublic: userProject.isPublic || false,
      });
    }
    
    setIsProjectDetailsDialogOpen(true);
  };
  
  const completedProjects = userProjects.filter(project => project.isCompleted);
  const inProgressProjects = userProjects.filter(project => !project.isCompleted);
  
  const copyShareableLink = (slug: string) => {
    const url = `${window.location.origin}/portfolio/${slug}`;
    navigator.clipboard.writeText(url);
    
    toast({
      title: "Link copied!",
      description: "The portfolio link has been copied to your clipboard.",
    });
  };
  
  if (isLoadingProjects || isLoadingProjectDetails || isLoadingPortfolio) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Briefcase className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-bold">Project Wallet</h2>
        </div>
        
        <Dialog open={isPortfolioDialogOpen} onOpenChange={setIsPortfolioDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary">
              <Plus className="mr-2 h-4 w-4" />
              Create Portfolio Link
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Create Portfolio Link</DialogTitle>
              <DialogDescription>
                Create a sharable link that showcases your projects to potential employers or colleagues.
              </DialogDescription>
            </DialogHeader>
            
            <Form {...portfolioForm}>
              <form onSubmit={portfolioForm.handleSubmit(onPortfolioFormSubmit)} className="space-y-4">
                <FormField
                  control={portfolioForm.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input placeholder="My Career Projects" {...field} />
                      </FormControl>
                      <FormDescription>
                        This title will be displayed on your portfolio page.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={portfolioForm.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="A collection of my web development projects completed in 2023."
                          className="resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        A brief description of your portfolio.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={portfolioForm.control}
                  name="slug"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Slug</FormLabel>
                      <FormControl>
                        <div className="flex items-center">
                          <span className="text-sm text-muted-foreground mr-2">
                            {window.location.origin}/portfolio/
                          </span>
                          <Input placeholder="my-projects" {...field} />
                        </div>
                      </FormControl>
                      <FormDescription>
                        This will be used in the URL of your portfolio.
                        Use only lowercase letters, numbers, and hyphens.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={portfolioForm.control}
                  name="isPublic"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                      <div className="space-y-0.5">
                        <FormLabel>Public Portfolio</FormLabel>
                        <FormDescription>
                          Anyone with the link can view your portfolio.
                        </FormDescription>
                      </div>
                      <FormControl>
                        <input
                          type="checkbox"
                          checked={field.value}
                          onChange={field.onChange}
                          className="peer form-checkbox h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <DialogFooter>
                  <DialogClose asChild>
                    <Button type="button" variant="outline">Cancel</Button>
                  </DialogClose>
                  <Button 
                    type="submit" 
                    disabled={createPortfolioLinkMutation.isPending}
                  >
                    {createPortfolioLinkMutation.isPending ? "Creating..." : "Create Link"}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>
      
      {/* Portfolio Links Section */}
      {portfolioLinks.length > 0 && (
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-6">
          <h3 className="text-lg font-medium mb-3">Your Portfolio Links</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {portfolioLinks.map((link) => (
              <Card key={link.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{link.title}</CardTitle>
                    <Badge variant={link.isPublic ? "default" : "secondary"}>
                      {link.isPublic ? "Public" : "Private"}
                    </Badge>
                  </div>
                  <CardDescription className="line-clamp-2">
                    {link.description || "No description provided."}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Globe className="mr-1 h-4 w-4" />
                    <span className="truncate">
                      {window.location.origin}/portfolio/{link.slug}
                    </span>
                  </div>
                  <div className="flex items-center mt-1 text-sm">
                    <span className="text-muted-foreground">
                      {link.viewCount} {link.viewCount === 1 ? "view" : "views"}
                    </span>
                  </div>
                </CardContent>
                <CardFooter className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1"
                    onClick={() => copyShareableLink(link.slug)}
                  >
                    <Share2 className="mr-1 h-4 w-4" />
                    Share
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1"
                    asChild
                  >
                    <a href={`/portfolio/${link.slug}`} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="mr-1 h-4 w-4" />
                      View
                    </a>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      )}
      
      {/* Project Lists */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="completed">
            Completed Projects ({completedProjects.length})
          </TabsTrigger>
          <TabsTrigger value="in-progress">
            In Progress ({inProgressProjects.length})
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="completed">
          {completedProjects.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <Briefcase className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No completed projects yet</h3>
              <p className="text-gray-600 mb-4">
                Complete projects to showcase them in your portfolio.
              </p>
              <Button 
                onClick={() => setActiveTab("in-progress")}
                className="bg-primary"
              >
                View In-Progress Projects
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {completedProjects.map((userProject) => {
                const project = projects.find((p) => p.id === userProject.projectId);
                if (!project) return null;
                
                return (
                  <Card key={userProject.id} className="hover:shadow-md transition-shadow">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-lg">{project.title}</CardTitle>
                        {userProject.isPublic ? (
                          <Badge className="bg-green-500 hover:bg-green-600">Public</Badge>
                        ) : (
                          <Badge variant="outline" className="text-gray-500">
                            <Lock className="h-3 w-3 mr-1" />
                            Private
                          </Badge>
                        )}
                      </div>
                      <CardDescription>
                        {userProject.description || project.description}
                      </CardDescription>
                    </CardHeader>
                    
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex flex-wrap gap-1 mb-2">
                          {project.skills?.slice(0, 3).map((skill, i) => (
                            <Badge key={i} variant="secondary" className="bg-gray-100">
                              {skill}
                            </Badge>
                          ))}
                          {project.skills && project.skills.length > 3 && (
                            <Badge variant="secondary" className="bg-gray-100">
                              +{project.skills.length - 3} more
                            </Badge>
                          )}
                        </div>
                        
                        {(userProject.repoUrl || userProject.demoUrl) && (
                          <div className="flex gap-2 mt-2">
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
                      </div>
                    </CardContent>
                    
                    <CardFooter className="flex justify-between gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="flex-1"
                        onClick={() => handleEditProjectDetails(userProject.id)}
                      >
                        Edit Details
                      </Button>
                      
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="flex-1"
                        asChild
                      >
                        <a href={`/projects/${project.id}`}>
                          View Project
                        </a>
                      </Button>
                    </CardFooter>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="in-progress">
          {inProgressProjects.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <Briefcase className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No projects in progress</h3>
              <p className="text-gray-600 mb-4">
                Start a new project to track your progress.
              </p>
              <Button className="bg-primary" asChild>
                <a href="/projects">Browse Projects</a>
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {inProgressProjects.map((userProject) => {
                const project = projects.find((p) => p.id === userProject.projectId);
                if (!project) return null;
                
                return (
                  <ProjectCard key={userProject.id} project={project} />
                );
              })}
            </div>
          )}
        </TabsContent>
      </Tabs>
      
      {/* Project Details Dialog */}
      <Dialog open={isProjectDetailsDialogOpen} onOpenChange={setIsProjectDetailsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Project Details</DialogTitle>
            <DialogDescription>
              Update details about your completed project. This information will be visible in your portfolio.
            </DialogDescription>
          </DialogHeader>
          
          <Form {...projectDetailsForm}>
            <form onSubmit={projectDetailsForm.handleSubmit(onProjectDetailsFormSubmit)} className="space-y-4">
              <FormField
                control={projectDetailsForm.control}
                name="repoUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Repository URL</FormLabel>
                    <FormControl>
                      <div className="flex items-center">
                        <Github className="mr-2 h-4 w-4 text-muted-foreground" />
                        <Input placeholder="https://github.com/yourusername/project" {...field} />
                      </div>
                    </FormControl>
                    <FormDescription>
                      Link to your code repository (GitHub, GitLab, etc.)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={projectDetailsForm.control}
                name="demoUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Live Demo URL</FormLabel>
                    <FormControl>
                      <div className="flex items-center">
                        <Globe className="mr-2 h-4 w-4 text-muted-foreground" />
                        <Input placeholder="https://your-project-demo.com" {...field} />
                      </div>
                    </FormControl>
                    <FormDescription>
                      Link to your live demo, if available
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={projectDetailsForm.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Project Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe what you built and the technologies you used..."
                        className="resize-none min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Describe your project in your own words, highlighting your contributions and the technologies used.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={projectDetailsForm.control}
                name="reflection"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Learning Reflection</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="What did you learn from this project? What challenges did you overcome?"
                        className="resize-none min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Reflect on what you learned and the challenges you overcame.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={projectDetailsForm.control}
                name="isPublic"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                    <div className="space-y-0.5">
                      <FormLabel>Make Public</FormLabel>
                      <FormDescription>
                        Allow this project to be included in your public portfolio links
                      </FormDescription>
                    </div>
                    <FormControl>
                      <input
                        type="checkbox"
                        checked={field.value}
                        onChange={field.onChange}
                        className="peer form-checkbox h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <DialogClose asChild>
                  <Button type="button" variant="outline">Cancel</Button>
                </DialogClose>
                <Button 
                  type="submit" 
                  disabled={updateProjectDetailsMutation.isPending}
                >
                  {updateProjectDetailsMutation.isPending ? "Saving..." : "Save Details"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}