import { Progress } from "@/components/ui/progress";
import { Check } from "lucide-react";

interface ProgressData {
  percentage: number;
  careerAssessment: boolean;
  nicheSelection: boolean;
  coreCourses: {
    completed: number;
    total: number;
  };
  projects: {
    completed: number;
    total: number;
  };
}

interface ProgressSectionProps {
  progress: ProgressData;
}

export default function ProgressSection({ progress }: ProgressSectionProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Your Career Journey</h2>
        <span className="text-sm font-medium text-primary">{progress.percentage}% Completed</span>
      </div>
      
      <Progress value={progress.percentage} className="h-2.5 mb-4" />
      
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className={`${progress.careerAssessment ? 'bg-indigo-50' : 'bg-gray-100'} p-3 rounded-lg flex flex-col items-center`}>
          <div className={`w-10 h-10 ${progress.careerAssessment ? 'bg-primary/20' : 'bg-gray-200'} rounded-full flex items-center justify-center mb-2`}>
            {progress.careerAssessment ? (
              <Check className="text-primary" size={16} />
            ) : (
              <span className="text-gray-500 font-medium">0/1</span>
            )}
          </div>
          <span className="text-xs font-medium text-gray-600 text-center">Career Assessment</span>
        </div>
        
        <div className={`${progress.nicheSelection ? 'bg-indigo-50' : 'bg-gray-100'} p-3 rounded-lg flex flex-col items-center`}>
          <div className={`w-10 h-10 ${progress.nicheSelection ? 'bg-primary/20' : 'bg-gray-200'} rounded-full flex items-center justify-center mb-2`}>
            {progress.nicheSelection ? (
              <Check className="text-primary" size={16} />
            ) : (
              <span className="text-gray-500 font-medium">0/1</span>
            )}
          </div>
          <span className="text-xs font-medium text-gray-600 text-center">Niche Selection</span>
        </div>
        
        <div className={`${progress.coreCourses.completed > 0 ? 'bg-indigo-50' : 'bg-gray-100'} p-3 rounded-lg flex flex-col items-center`}>
          <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center mb-2">
            <span className="text-gray-500 font-medium">{progress.coreCourses.completed}/{progress.coreCourses.total}</span>
          </div>
          <span className="text-xs font-medium text-gray-600 text-center">Core Courses</span>
        </div>
        
        <div className={`${progress.projects.completed > 0 ? 'bg-indigo-50' : 'bg-gray-100'} p-3 rounded-lg flex flex-col items-center`}>
          <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center mb-2">
            <span className="text-gray-500 font-medium">{progress.projects.completed}/{progress.projects.total}</span>
          </div>
          <span className="text-xs font-medium text-gray-600 text-center">Projects</span>
        </div>
      </div>
    </div>
  );
}
