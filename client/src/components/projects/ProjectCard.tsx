import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock } from "lucide-react";
import { Link } from "wouter";

interface Project {
  id: number;
  title: string;
  description: string;
  difficulty: string;
  duration: string;
  skills: string[];
  category: string;
}

interface ProjectCardProps {
  project: Project;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  const difficultyColor = {
    'Beginner': 'bg-green-500',
    'Intermediate': 'bg-amber-500',
    'Advanced': 'bg-red-500'
  }[project.difficulty] || 'bg-green-500';

  return (
    <Card className="overflow-hidden border border-gray-100 hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-medium text-gray-900">{project.title}</h3>
          <Badge className={`${difficultyColor} text-white`}>
            {project.difficulty}
          </Badge>
        </div>
        
        <p className="text-sm text-gray-600 mb-3">{project.description}</p>
        
        <div className="flex items-center text-sm text-gray-500 mb-3">
          <Clock className="mr-1" size={14} />
          <span>Est. completion: {project.duration}</span>
        </div>
        
        <div className="flex flex-wrap gap-2 mb-1">
          {project.skills.map((skill, index) => (
            <Badge key={index} variant="secondary" className="bg-gray-200 text-gray-700 border-none">
              {skill}
            </Badge>
          ))}
        </div>
      </CardContent>
      
      <CardFooter className="px-4 pb-4 pt-0">
        <Link href={`/projects/${project.id}`} className="w-full">
          <Button className="w-full bg-green-600 hover:bg-green-700">
            Start Project
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
