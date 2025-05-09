import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CodeIcon, CheckCircle, PenToolIcon, BrainCircuit, Timer } from "lucide-react";
import { cn } from "@/lib/utils";

interface PracticeItem {
  id: number;
  title: string;
  description: string;
  type: "coding" | "quiz" | "scenario";
  difficulty: "easy" | "medium" | "hard";
  timeEstimate: number; // in minutes
  completionRate: number; // percentage of users who complete successfully
  language?: string; // for coding challenges
  questionCount?: number; // for quizzes
}

// Practice component for interactive learning exercises
export default function IntegratedPractice() {
  const [activeTab, setActiveTab] = useState<string>("coding");
  const { data: practiceItems = [], isLoading } = useQuery<PracticeItem[]>({
    queryKey: ['/api/courses/practice-items'],
    // Using default queryFn from queryClient
  });

  // Filter practice items by type
  const codingChallenges = practiceItems.filter(item => item.type === "coding");
  const quizzes = practiceItems.filter(item => item.type === "quiz");
  const scenarios = practiceItems.filter(item => item.type === "scenario");

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy": return "bg-green-100 text-green-700";
      case "medium": return "bg-amber-100 text-amber-700";
      case "hard": return "bg-red-100 text-red-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "coding": return <CodeIcon className="h-5 w-5" />;
      case "quiz": return <CheckCircle className="h-5 w-5" />;
      case "scenario": return <BrainCircuit className="h-5 w-5" />;
      default: return <PenToolIcon className="h-5 w-5" />;
    }
  };

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-6 bg-gray-200 rounded w-1/4"></div>
        <div className="h-8 bg-gray-200 rounded"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-64 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  if (practiceItems.length === 0) {
    return null;
  }

  return (
    <div className="my-8">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-xl font-semibold flex items-center">
          <PenToolIcon className="mr-2 h-5 w-5 text-primary" />
          Practice & Apply
        </h2>
      </div>
      
      <p className="text-gray-600 mb-4">
        Interactive exercises and challenges to reinforce your learning
      </p>

      <Tabs defaultValue="coding" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="coding" className="flex items-center">
            <CodeIcon className="h-4 w-4 mr-1" />
            Coding
            {codingChallenges.length > 0 && (
              <Badge variant="secondary" className="ml-2 h-5 min-w-5 px-1">{codingChallenges.length}</Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="quiz" className="flex items-center">
            <CheckCircle className="h-4 w-4 mr-1" />
            Quizzes
            {quizzes.length > 0 && (
              <Badge variant="secondary" className="ml-2 h-5 min-w-5 px-1">{quizzes.length}</Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="scenario" className="flex items-center">
            <BrainCircuit className="h-4 w-4 mr-1" />
            Scenarios
            {scenarios.length > 0 && (
              <Badge variant="secondary" className="ml-2 h-5 min-w-5 px-1">{scenarios.length}</Badge>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="coding" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {codingChallenges.map(challenge => (
              <PracticeCard 
                key={challenge.id} 
                item={challenge} 
                type="coding"
              />
            ))}
            {codingChallenges.length === 0 && (
              <div className="col-span-full p-8 text-center bg-gray-50 rounded-lg">
                <CodeIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-1">No coding challenges available</h3>
                <p className="text-gray-600 mb-4">Check back later for new challenges</p>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="quiz" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {quizzes.map(quiz => (
              <PracticeCard 
                key={quiz.id} 
                item={quiz} 
                type="quiz"
              />
            ))}
            {quizzes.length === 0 && (
              <div className="col-span-full p-8 text-center bg-gray-50 rounded-lg">
                <CheckCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-1">No quizzes available</h3>
                <p className="text-gray-600 mb-4">Check back later for new quizzes</p>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="scenario" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {scenarios.map(scenario => (
              <PracticeCard 
                key={scenario.id} 
                item={scenario} 
                type="scenario"
              />
            ))}
            {scenarios.length === 0 && (
              <div className="col-span-full p-8 text-center bg-gray-50 rounded-lg">
                <BrainCircuit className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-1">No scenarios available</h3>
                <p className="text-gray-600 mb-4">Check back later for new scenario challenges</p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Individual practice card component
function PracticeCard({ item, type }: { item: PracticeItem, type: string }) {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy": return "bg-green-100 text-green-700";
      case "medium": return "bg-amber-100 text-amber-700";
      case "hard": return "bg-red-100 text-red-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <Card className="border border-gray-100 hover:shadow-md transition-shadow overflow-hidden">
      <CardHeader className="p-4 pb-2">
        <CardTitle className="text-base font-medium flex justify-between">
          <span className="line-clamp-1">{item.title}</span>
          <Badge 
            className={cn("ml-2 whitespace-nowrap", getDifficultyColor(item.difficulty))}
          >
            {item.difficulty.charAt(0).toUpperCase() + item.difficulty.slice(1)}
          </Badge>
        </CardTitle>
        <CardDescription className="line-clamp-2">{item.description}</CardDescription>
      </CardHeader>
      <CardContent className="p-4 pt-2 text-sm text-gray-600">
        <div className="flex justify-between mb-3">
          <div className="flex items-center">
            <Timer className="h-4 w-4 mr-1 text-gray-500" />
            <span>{item.timeEstimate} mins</span>
          </div>
          
          {type === "coding" && item.language && (
            <div className="flex items-center">
              <CodeIcon className="h-4 w-4 mr-1 text-gray-500" />
              <span>{item.language}</span>
            </div>
          )}
          
          {type === "quiz" && item.questionCount && (
            <div className="flex items-center">
              <CheckCircle className="h-4 w-4 mr-1 text-gray-500" />
              <span>{item.questionCount} questions</span>
            </div>
          )}
        </div>
        
        <div className="space-y-1">
          <div className="flex justify-between text-xs">
            <span>Completion rate</span>
            <span>{item.completionRate}%</span>
          </div>
          <Progress value={item.completionRate} className="h-1.5" />
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button className="w-full" size="sm">
          {type === "coding" ? "Start Coding" : type === "quiz" ? "Take Quiz" : "Try Scenario"}
        </Button>
      </CardFooter>
    </Card>
  );
}