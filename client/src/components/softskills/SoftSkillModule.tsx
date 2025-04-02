import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Check, Play, Award, BookOpen, Video, FileText, Download } from "lucide-react";

interface SoftSkill {
  id: number;
  title: string;
  description: string;
  type: string;
  content: string;
}

interface UserSoftSkill {
  id: number;
  userId: number;
  softSkillId: number;
  progress: number;
  isCompleted: boolean;
}

interface SoftSkillModuleProps {
  softSkill: SoftSkill;
  userSoftSkill?: UserSoftSkill;
  userId: number;
}

export default function SoftSkillModule({ softSkill, userSoftSkill, userId }: SoftSkillModuleProps) {
  const [activeTab, setActiveTab] = useState("overview");
  const [progress, setProgress] = useState(userSoftSkill?.progress || 0);
  const queryClient = useQueryClient();

  // Parse content from JSON string (assuming content is stored as JSON)
  const content = JSON.parse(softSkill.content || '{"overview":"","materials":[],"exercises":[],"quiz":[]}');

  const updateProgressMutation = useMutation({
    mutationFn: async (newProgress: number) => {
      if (userSoftSkill) {
        // Update existing user soft skill
        const response = await apiRequest("PATCH", `/api/user-soft-skills/${userSoftSkill.id}`, {
          progress: newProgress,
          isCompleted: newProgress === 100
        });
        return response.json();
      } else {
        // Create new user soft skill
        const response = await apiRequest("POST", "/api/user-soft-skills", {
          userId,
          softSkillId: softSkill.id,
          progress: newProgress,
          isCompleted: newProgress === 100
        });
        return response.json();
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/users/${userId}/user-soft-skills`] });
    }
  });

  const markAsCompleted = () => {
    updateProgressMutation.mutate(100);
    setProgress(100);
  };

  const updateProgress = (newProgress: number) => {
    if (newProgress > progress) {
      updateProgressMutation.mutate(newProgress);
      setProgress(newProgress);
    }
  };

  // Render module icon based on type
  const renderTypeIcon = () => {
    switch (softSkill.type.toLowerCase()) {
      case 'communication':
        return <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 2a8 8 0 100 16 8 8 0 000-16zm0 14a6 6 0 110-12 6 6 0 010 12zm-1-5a1 1 0 011-1h.01a1 1 0 010 2H10a1 1 0 01-1-1zm-3-4a1 1 0 011-1h4a1 1 0 110 2H7a1 1 0 01-1-1z" clipRule="evenodd" />
        </svg>;
      case 'interview':
        return <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
        </svg>;
      case 'leadership':
        return <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401z" clipRule="evenodd" />
        </svg>;
      case 'time-management':
        return <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
        </svg>;
      default:
        return <BookOpen className="h-5 w-5 mr-2" />;
    }
  };

  // Determine module status
  const getModuleStatus = () => {
    if (progress === 100) {
      return <span className="bg-green-100 text-green-800 text-xs font-semibold px-2.5 py-0.5 rounded-full flex items-center"><Check className="h-3 w-3 mr-1" /> Completed</span>;
    } else if (progress > 0) {
      return <span className="bg-amber-100 text-amber-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">In Progress</span>;
    } else {
      return <span className="bg-gray-100 text-gray-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">Not Started</span>;
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            {renderTypeIcon()}
            <CardTitle>{softSkill.title}</CardTitle>
          </div>
          {getModuleStatus()}
        </div>
        <div className="mt-2">
          <Progress value={progress} className="h-2" />
          <p className="text-right text-xs text-gray-500 mt-1">{progress}% complete</p>
        </div>
      </CardHeader>
      
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="materials">Materials</TabsTrigger>
            <TabsTrigger value="exercises">Exercises</TabsTrigger>
            <TabsTrigger value="quiz">Quiz</TabsTrigger>
          </TabsList>
          
          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-4">
            <div className="prose prose-sm max-w-none">
              <p>{softSkill.description}</p>
              <div dangerouslySetInnerHTML={{ __html: content.overview }} />
            </div>
            
            <div className="border rounded-md p-4 bg-indigo-50">
              <h3 className="text-sm font-medium text-indigo-800 mb-2">What you'll learn</h3>
              <ul className="space-y-1">
                {content.learningObjectives?.map((objective: string, index: number) => (
                  <li key={index} className="flex items-start">
                    <Check className="h-4 w-4 text-primary mr-2 mt-0.5" />
                    <span className="text-sm">{objective}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            {progress === 0 && (
              <Button 
                onClick={() => updateProgress(10)} 
                className="w-full bg-primary"
              >
                <Play className="h-4 w-4 mr-2" /> Start Learning
              </Button>
            )}
          </TabsContent>
          
          {/* Materials Tab */}
          <TabsContent value="materials" className="space-y-4">
            <div className="grid gap-4">
              {content.materials?.map((material: any, index: number) => (
                <div key={index} className="border rounded-md p-4 hover:shadow-sm transition-shadow">
                  <div className="flex justify-between items-start">
                    <div className="flex items-start space-x-3">
                      {material.type === 'video' ? (
                        <Video className="h-5 w-5 text-red-500 mt-0.5" />
                      ) : (
                        <FileText className="h-5 w-5 text-blue-500 mt-0.5" />
                      )}
                      <div>
                        <h3 className="font-medium">{material.title}</h3>
                        <p className="text-sm text-gray-600">{material.description}</p>
                      </div>
                    </div>
                    
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="text-primary" 
                      onClick={() => updateProgress(Math.min(progress + 15, 50))}
                    >
                      {material.type === 'video' ? (
                        <Play className="h-4 w-4 mr-1" />
                      ) : (
                        <Download className="h-4 w-4 mr-1" />
                      )}
                      {material.type === 'video' ? 'Watch' : 'Download'}
                    </Button>
                  </div>
                  {material.duration && (
                    <p className="text-xs text-gray-500 mt-2 ml-8">Duration: {material.duration}</p>
                  )}
                </div>
              ))}
            </div>
          </TabsContent>
          
          {/* Exercises Tab */}
          <TabsContent value="exercises" className="space-y-4">
            <div className="grid gap-4">
              {content.exercises?.map((exercise: any, index: number) => (
                <div key={index} className="border rounded-md p-4">
                  <h3 className="font-medium">{exercise.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">{exercise.description}</p>
                  <div className="mt-3">
                    <Button 
                      onClick={() => updateProgress(Math.min(progress + 10, 75))}
                      className="bg-primary"
                      size="sm"
                    >
                      Complete Exercise
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
          
          {/* Quiz Tab */}
          <TabsContent value="quiz" className="space-y-4">
            <div className="border rounded-md p-4">
              <h3 className="font-medium mb-2">Module Assessment</h3>
              <p className="text-sm text-gray-600 mb-4">Complete this quiz to test your understanding of {softSkill.title}.</p>
              
              {content.quiz?.map((question: any, index: number) => (
                <div key={index} className="mb-4 p-3 rounded-md bg-gray-50">
                  <p className="font-medium mb-2">{index + 1}. {question.question}</p>
                  <div className="space-y-2">
                    {question.options.map((option: string, optionIndex: number) => (
                      <label key={optionIndex} className="flex items-center space-x-2 text-sm">
                        <input type="radio" name={`question-${index}`} className="rounded-full" />
                        <span>{option}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
              
              <Button 
                onClick={markAsCompleted}
                className="w-full bg-primary mt-4"
              >
                Submit Quiz & Complete Module
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      
      <CardFooter className="border-t pt-4 flex justify-between">
        <div className="flex items-center text-sm text-gray-600">
          <Award className="h-4 w-4 mr-1 text-amber-500" />
          <span>Earn a badge by completing this module</span>
        </div>
        {progress > 0 && progress < 100 && (
          <Button variant="outline" onClick={markAsCompleted}>
            Mark as Completed
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
