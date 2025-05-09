import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, ExternalLink, Github, Check } from "lucide-react";
import { Link } from "wouter";
import { Project } from "@shared/schema";

interface ProjectCardProps {
  project: Project;
  compact?: boolean;
}

export default function ProjectCard({ project, compact = false }: ProjectCardProps) {
  // Handle skills using the updated schema where skills is always an array
  const skillsArray = project.skills || [];
  
  const difficultyColor = project.difficulty 
    ? {
        'beginner': 'bg-green-500',
        'intermediate': 'bg-amber-500',
        'advanced': 'bg-red-500'
      }[project.difficulty.toLowerCase()] || 'bg-green-500'
    : 'bg-green-500';

  // Get career track display name
  const getCareerTrackName = (trackId: string) => {
    const trackMap: Record<string, string> = {
      'frontend': 'Frontend',
      'backend': 'Backend',
      'fullstack': 'Full-Stack',
      'mobile': 'Mobile',
      'data': 'Data Science',
      'ai': 'AI & ML',
      'devops': 'DevOps',
      'security': 'Security'
    };
    return trackMap[trackId] || trackId;
  };

  return (
    <Card className={`overflow-hidden border border-gray-200 hover:shadow-md transition-all ${project.isPopular ? 'border-yellow-300 shadow-sm' : ''}`}>
      {project.thumbnail && (
        <div 
          className="h-36 w-full bg-cover bg-center" 
          style={{ backgroundImage: `url(${project.thumbnail})` }}
        >
          {project.isPopular && (
            <div className="bg-yellow-400 text-yellow-900 text-xs font-medium px-2 py-1 rounded-br-md inline-flex items-center">
              <span className="mr-1">🔥</span> Popular
            </div>
          )}
        </div>
      )}
      
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-medium text-gray-900">{project.title}</h3>
          <Badge className={`${difficultyColor} text-white`}>
            {project.difficulty}
          </Badge>
        </div>
        
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{project.description}</p>
        
        <div className="flex flex-wrap gap-1 items-center text-xs text-gray-500 mb-3">
          <div className="flex items-center">
            <Clock className="mr-1" size={12} />
            <span>
              {project.estimatedHours 
                ? `${project.estimatedHours}h` 
                : project.duration}
            </span>
          </div>
          
          {project.careerTrack && (
            <>
              <span className="mx-1">•</span>
              <span>{getCareerTrackName(project.careerTrack)}</span>
            </>
          )}
        </div>
        
        {!compact && (
          <div className="flex flex-wrap gap-1.5 mb-1 mt-3">
            {skillsArray.slice(0, 5).map((skill: string, index: number) => (
              <Badge key={index} variant="secondary" className="bg-gray-100 text-gray-700 border-none text-xs px-2 py-0.5">
                {skill}
              </Badge>
            ))}
            {skillsArray.length > 5 && (
              <Badge variant="secondary" className="bg-gray-100 text-gray-700 border-none text-xs px-2 py-0.5">
                +{skillsArray.length - 5} more
              </Badge>
            )}
          </div>
        )}
      </CardContent>
      
      <CardFooter className={`px-4 ${compact ? 'pb-3 pt-0' : 'pb-4 pt-0'} gap-2`}>
        <Link href={`/projects/${project.id}`} className="flex-1">
          <Button className="w-full bg-green-600 hover:bg-green-700 flex items-center">
            <Check className="mr-1.5 h-4 w-4" />
            Start Project
          </Button>
        </Link>
        
        {project.githubRepo && (
          <Button variant="outline" size="icon" asChild>
            <a href={project.githubRepo} target="_blank" rel="noopener noreferrer">
              <Github className="h-4 w-4" />
            </a>
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
