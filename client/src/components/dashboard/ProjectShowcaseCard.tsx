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

interface ProjectShowcaseCardProps {
  project: Project | null;
}

export default function ProjectShowcaseCard({ project }: ProjectShowcaseCardProps) {
  if (!project) {
    return (
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">No Projects Available</h2>
          <p className="text-gray-600 mb-4">
            Complete your career assessment to get personalized project recommendations.
          </p>
        </div>
      </div>
    );
  }

  const difficultyColor = {
    'Beginner': 'bg-green-500',
    'Intermediate': 'bg-amber-500',
    'Advanced': 'bg-red-500'
  }[project.difficulty] || 'bg-green-500';

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-2">Recommended Project</h2>
        <div className="bg-gray-50 rounded-lg p-4 mb-4">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-medium text-gray-900">{project.title}</h3>
            <Badge className={`${difficultyColor} text-white`}>
              {project.difficulty}
            </Badge>
          </div>
          <p className="text-sm text-gray-600 mb-3">{project.description}</p>
          <div className="flex items-center text-sm text-gray-500 mb-2">
            <Clock className="mr-1" size={14} />
            <span>Est. completion: {project.duration}</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {project.skills.map((skill, index) => (
              <Badge key={index} variant="secondary" className="bg-gray-200 text-gray-700 border-none">
                {skill}
              </Badge>
            ))}
          </div>
        </div>
        <Link href={`/projects/${project.id}`}>
          <Button className="bg-green-600 text-white hover:bg-green-700 w-full">
            Start Project
          </Button>
        </Link>
      </div>
    </div>
  );
}
