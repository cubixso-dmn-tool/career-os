import React from 'react';
import { useDashboard } from '@/hooks/useDashboardContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, Code, Award, Sparkles, Target } from "lucide-react";

// Progress category card component
const ProgressCategory: React.FC<{
  icon: React.ReactNode;
  title: string;
  completed: number;
  total: number;
  onClick?: () => void;
}> = ({ icon, title, completed, total, onClick }) => {
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
  
  return (
    <div 
      className="flex items-center space-x-4 p-4 bg-card rounded-md border cursor-pointer hover:border-primary/50 transition-colors"
      onClick={onClick}
    >
      <div className="p-2 bg-primary/10 text-primary rounded-full">
        {icon}
      </div>
      <div className="flex-1">
        <h4 className="text-sm font-medium">{title}</h4>
        <div className="flex items-center justify-between mt-2">
          <Progress value={percentage} className="h-2 w-full max-w-[100px]" />
          <span className="text-xs text-gray-500 ml-2">{completed}/{total}</span>
        </div>
      </div>
    </div>
  );
};

// Progress summary component
const ProgressSummary: React.FC<{
  onCategoryClick?: (category: string) => void;
}> = ({ onCategoryClick }) => {
  const { stats, enrollments, projects, softSkills, achievements } = useDashboard();
  
  const handleCategoryClick = (category: string) => {
    if (onCategoryClick) {
      onCategoryClick(category);
    }
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Learning Progress</CardTitle>
        <CardDescription>Track your progress across all learning areas</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="overview">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="details">Details</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-4 pt-4">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <h4 className="text-sm font-medium">Overall Progress</h4>
                <span className="text-sm text-gray-500">{stats.overallProgress}%</span>
              </div>
              <Progress value={stats.overallProgress} className="h-2" />
            </div>
            
            <div className="pt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-md">
                  <BookOpen className="h-5 w-5 mx-auto text-blue-600" />
                  <div className="mt-2 text-sm font-medium">Courses</div>
                  <div className="text-2xl font-bold text-blue-600">
                    {stats.completedCourses}
                  </div>
                  <div className="text-xs text-gray-500">completed</div>
                </div>
                
                <div className="text-center p-4 bg-green-50 rounded-md">
                  <Code className="h-5 w-5 mx-auto text-green-600" />
                  <div className="mt-2 text-sm font-medium">Projects</div>
                  <div className="text-2xl font-bold text-green-600">
                    {stats.completedProjects}
                  </div>
                  <div className="text-xs text-gray-500">completed</div>
                </div>
                
                <div className="text-center p-4 bg-purple-50 rounded-md">
                  <Sparkles className="h-5 w-5 mx-auto text-purple-600" />
                  <div className="mt-2 text-sm font-medium">Skills</div>
                  <div className="text-2xl font-bold text-purple-600">
                    {stats.masteredSkills}
                  </div>
                  <div className="text-xs text-gray-500">mastered</div>
                </div>
                
                <div className="text-center p-4 bg-yellow-50 rounded-md">
                  <Award className="h-5 w-5 mx-auto text-yellow-600" />
                  <div className="mt-2 text-sm font-medium">Achievements</div>
                  <div className="text-2xl font-bold text-yellow-600">
                    {stats.achievementCount}
                  </div>
                  <div className="text-xs text-gray-500">earned</div>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="details" className="space-y-4 pt-4">
            <div className="grid gap-4">
              <ProgressCategory
                icon={<BookOpen className="h-4 w-4" />}
                title="Courses"
                completed={stats.completedCourses}
                total={enrollments.length}
                onClick={() => handleCategoryClick('courses')}
              />
              
              <ProgressCategory
                icon={<Code className="h-4 w-4" />}
                title="Projects"
                completed={stats.completedProjects}
                total={projects.length}
                onClick={() => handleCategoryClick('projects')}
              />
              
              <ProgressCategory
                icon={<Sparkles className="h-4 w-4" />}
                title="Soft Skills"
                completed={stats.masteredSkills}
                total={softSkills.length}
                onClick={() => handleCategoryClick('skills')}
              />
              
              <ProgressCategory
                icon={<Target className="h-4 w-4" />}
                title="Career Path"
                completed={stats.hasCareerPath ? 1 : 0}
                total={1}
                onClick={() => handleCategoryClick('career')}
              />
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter>
        <p className="text-xs text-gray-500">
          {stats.overallProgress < 30 ? (
            "You're just getting started! Keep going to unlock more achievements."
          ) : stats.overallProgress < 70 ? (
            "You're making great progress on your learning journey!"
          ) : (
            "Impressive progress! You're well on your way to becoming an expert."
          )}
        </p>
      </CardFooter>
    </Card>
  );
};

export default ProgressSummary;