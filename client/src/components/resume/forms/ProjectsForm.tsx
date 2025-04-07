import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Card, 
  CardContent, 
  CardFooter, 
  CardHeader, 
  CardTitle, 
  CardDescription
} from '@/components/ui/card';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ArrowLeft, 
  ArrowRight, 
  Plus, 
  FolderGit2, 
  ExternalLink, 
  Github, 
  Globe, 
  Tag, 
  Calendar, 
  PenTool, 
  Trash, 
  Edit, 
  Save,
  X,
  ArrowUpRight,
  Code
} from 'lucide-react';
import { ResumeData } from '../ResumeTemplates';
import { Badge } from '@/components/ui/badge';

interface ProjectsFormProps {
  initialData: ResumeData['projects'];
  onSubmit: (data: ResumeData['projects']) => void;
  onBack: () => void;
}

type Project = ResumeData['projects'][0];

// Project types to choose from
const projectTypes = [
  'Web Application',
  'Mobile App',
  'Data Analysis',
  'Machine Learning',
  'IoT Project',
  'UI/UX Design',
  'Game Development',
  'API Development',
  'Blockchain',
  'Desktop Application',
  'Open Source Contribution',
  'Personal Website',
  'Other'
];

const ProjectsForm: React.FC<ProjectsFormProps> = ({ initialData, onSubmit, onBack }) => {
  const [projects, setProjects] = useState<Project[]>(initialData);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [newTechTag, setNewTechTag] = useState('');
  
  // Empty project template
  const emptyProject: Project = {
    id: '',
    title: '',
    description: '',
    technologies: [],
    link: '',
    github: '',
    image: '',
    date: '',
    type: ''
  };
  
  // Open dialog for adding a new project
  const handleAddProject = () => {
    setCurrentProject({
      ...emptyProject,
      id: `proj-${Date.now()}`
    });
    setEditIndex(null);
    setIsDialogOpen(true);
  };
  
  // Open dialog for editing an existing project
  const handleEditProject = (index: number) => {
    setCurrentProject({...projects[index]});
    setEditIndex(index);
    setIsDialogOpen(true);
  };
  
  // Delete a project
  const handleDeleteProject = (index: number) => {
    const newProjects = [...projects];
    newProjects.splice(index, 1);
    setProjects(newProjects);
  };
  
  // Save the current project (new or edited)
  const handleSaveProject = () => {
    if (!currentProject) return;
    
    const newProjects = [...projects];
    if (editIndex !== null) {
      newProjects[editIndex] = currentProject;
    } else {
      newProjects.push(currentProject);
    }
    
    setProjects(newProjects);
    setIsDialogOpen(false);
    setCurrentProject(null);
  };
  
  // Add a technology tag to the current project
  const handleAddTech = () => {
    if (!currentProject || !newTechTag.trim()) return;
    
    // Prevent duplicates
    if (currentProject.technologies.includes(newTechTag.trim())) {
      setNewTechTag('');
      return;
    }
    
    setCurrentProject({
      ...currentProject,
      technologies: [...currentProject.technologies, newTechTag.trim()]
    });
    setNewTechTag('');
  };
  
  // Remove a technology tag from the current project
  const handleRemoveTech = (tech: string) => {
    if (!currentProject) return;
    setCurrentProject({
      ...currentProject,
      technologies: currentProject.technologies.filter(t => t !== tech)
    });
  };
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(projects);
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-2">Projects & Portfolio</h2>
      <p className="text-gray-600 mb-6">
        Showcase your technical skills and achievements with relevant projects. Include personal projects, academic work, open-source contributions, or professional work (if shareable).
      </p>
      
      <div className="grid grid-cols-1 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-3">
            <div className="flex justify-between items-center">
              <CardTitle>Your Projects</CardTitle>
              <Button
                variant="outline" 
                size="sm"
                onClick={handleAddProject}
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Project
              </Button>
            </div>
            <CardDescription>
              Add projects that best showcase your skills and align with your career goals
            </CardDescription>
          </CardHeader>
          <CardContent>
            {projects.length === 0 ? (
              <div className="border-2 border-dashed border-gray-200 rounded-lg p-8 text-center">
                <FolderGit2 className="h-12 w-12 mx-auto text-gray-400 mb-3" />
                <h3 className="text-lg font-medium text-gray-900 mb-1">No projects added yet</h3>
                <p className="text-gray-500 mb-4">Add projects to showcase your technical skills and accomplishments</p>
                <Button onClick={handleAddProject}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Your First Project
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {projects.map((project, index) => (
                  <Card key={project.id} className="overflow-hidden border border-gray-200">
                    <div className="relative">
                      {project.image ? (
                        <div 
                          className="h-40 bg-cover bg-center" 
                          style={{ backgroundImage: `url(${project.image})` }}
                        />
                      ) : (
                        <div className="h-40 bg-gradient-to-r from-primary/10 to-primary/5 flex items-center justify-center">
                          <Code className="h-16 w-16 text-primary/40" />
                        </div>
                      )}
                      
                      {project.type && (
                        <Badge className="absolute top-2 right-2 bg-black/60 text-white hover:bg-black/70">
                          {project.type}
                        </Badge>
                      )}
                    </div>
                    
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-medium text-lg">{project.title}</h3>
                        <div className="flex space-x-1">
                          {project.github && (
                            <Button size="icon" variant="ghost" className="h-7 w-7" asChild>
                              <a href={project.github} target="_blank" rel="noopener noreferrer">
                                <Github className="h-4 w-4" />
                              </a>
                            </Button>
                          )}
                          
                          {project.link && (
                            <Button size="icon" variant="ghost" className="h-7 w-7" asChild>
                              <a href={project.link} target="_blank" rel="noopener noreferrer">
                                <ArrowUpRight className="h-4 w-4" />
                              </a>
                            </Button>
                          )}
                        </div>
                      </div>
                      
                      {project.date && (
                        <div className="flex items-center text-xs text-gray-500 mb-2">
                          <Calendar className="h-3 w-3 mr-1" />
                          {project.date}
                        </div>
                      )}
                      
                      <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                        {project.description}
                      </p>
                      
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {project.technologies.map((tech, i) => (
                          <Badge key={i} variant="outline" className="bg-primary/5">
                            {tech}
                          </Badge>
                        ))}
                      </div>
                      
                      <div className="flex justify-end space-x-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDeleteProject(index)}
                        >
                          <Trash className="h-4 w-4 mr-1" />
                          Delete
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEditProject(index)}
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      {/* Project Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editIndex !== null ? 'Edit Project' : 'Add Project'}</DialogTitle>
            <DialogDescription>
              Add details about your project to showcase your skills and achievements.
            </DialogDescription>
          </DialogHeader>
          
          {currentProject && (
            <Tabs defaultValue="details">
              <TabsList className="grid grid-cols-2 w-[400px] mb-4">
                <TabsTrigger value="details">Project Details</TabsTrigger>
                <TabsTrigger value="links">Links & Media</TabsTrigger>
              </TabsList>
              
              <TabsContent value="details" className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Project Title</label>
                  <Input
                    placeholder="e.g. E-commerce Website"
                    value={currentProject.title}
                    onChange={(e) => setCurrentProject({...currentProject, title: e.target.value})}
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Project Type</label>
                  <Select
                    value={currentProject.type}
                    onValueChange={(value) => setCurrentProject({...currentProject, type: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select project type" />
                    </SelectTrigger>
                    <SelectContent>
                      {projectTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Date Completed</label>
                  <Input
                    placeholder="e.g. May 2023 or Jan-Mar 2022"
                    value={currentProject.date}
                    onChange={(e) => setCurrentProject({...currentProject, date: e.target.value})}
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Description</label>
                  <Textarea
                    placeholder="Describe what the project does, your role, challenges solved, and impact/results"
                    value={currentProject.description}
                    onChange={(e) => setCurrentProject({...currentProject, description: e.target.value})}
                    rows={4}
                  />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="text-sm font-medium">Technologies Used</label>
                    <div className="flex space-x-2">
                      <Input
                        placeholder="e.g. React.js"
                        value={newTechTag}
                        onChange={(e) => setNewTechTag(e.target.value)}
                        className="w-40 h-8"
                      />
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={handleAddTech}
                        disabled={!newTechTag.trim()}
                      >
                        Add
                      </Button>
                    </div>
                  </div>
                  
                  {currentProject.technologies.length === 0 ? (
                    <p className="text-xs text-gray-500 italic mt-2">
                      Add technologies like programming languages, frameworks, or tools used in this project.
                    </p>
                  ) : (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {currentProject.technologies.map((tech, index) => (
                        <Badge key={index} variant="secondary" className="px-2 py-1 flex items-center gap-1">
                          {tech}
                          <button 
                            onClick={() => handleRemoveTech(tech)}
                            className="text-gray-400 hover:text-red-500"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="links" className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Live Demo URL</label>
                  <div className="flex items-center">
                    <Globe className="h-4 w-4 mr-2 text-gray-500" />
                    <Input
                      placeholder="https://example.com"
                      value={currentProject.link}
                      onChange={(e) => setCurrentProject({...currentProject, link: e.target.value})}
                    />
                  </div>
                  <p className="text-xs text-gray-500 italic">
                    The URL where a working version of your project can be viewed
                  </p>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">GitHub Repository</label>
                  <div className="flex items-center">
                    <Github className="h-4 w-4 mr-2 text-gray-500" />
                    <Input
                      placeholder="https://github.com/username/repo"
                      value={currentProject.github}
                      onChange={(e) => setCurrentProject({...currentProject, github: e.target.value})}
                    />
                  </div>
                  <p className="text-xs text-gray-500 italic">
                    Link to the source code repository
                  </p>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Project Image URL</label>
                  <div className="flex items-center">
                    <PenTool className="h-4 w-4 mr-2 text-gray-500" />
                    <Input
                      placeholder="https://example.com/image.jpg"
                      value={currentProject.image}
                      onChange={(e) => setCurrentProject({...currentProject, image: e.target.value})}
                    />
                  </div>
                  <p className="text-xs text-gray-500 italic">
                    A screenshot or image representing your project
                  </p>
                </div>
                
                {currentProject.image && (
                  <div className="border rounded-md overflow-hidden mt-4">
                    <div className="p-2 bg-gray-50 text-xs font-medium">Image Preview</div>
                    <div className="p-4 flex justify-center">
                      <img 
                        src={currentProject.image} 
                        alt="Project preview" 
                        className="max-h-32 object-contain" 
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                          (e.target as HTMLImageElement).nextSibling!.classList.remove('hidden');
                        }}
                      />
                      <div className="hidden text-xs text-red-500">
                        Unable to load image. Please check the URL.
                      </div>
                    </div>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          )}
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSaveProject}
              disabled={!currentProject?.title}
            >
              <Save className="h-4 w-4 mr-2" />
              Save Project
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <div className="bg-gray-50 p-5 rounded-lg border border-gray-200 mb-6">
        <h3 className="text-base font-medium mb-2">Project Tips:</h3>
        <ul className="space-y-2 text-sm text-gray-700 list-disc pl-4">
          <li>Include 3-5 of your best projects that showcase diverse skills</li>
          <li>For each project, highlight the problem it solves and your specific role</li>
          <li>Showcase technical skills relevant to your desired position</li>
          <li>Include links to live demos or repositories when possible</li>
          <li>Mention technologies used and methodologies applied</li>
          <li>Focus on impact and results, not just features</li>
          <li>For Indian students: Include projects related to local challenges or industries</li>
        </ul>
      </div>
      
      <form onSubmit={handleSubmit}>
        <div className="flex justify-between pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={onBack}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <Button type="submit">
            Next Step
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ProjectsForm;