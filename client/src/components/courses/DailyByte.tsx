import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LightbulbIcon, BrainCircuitIcon, CheckCircleIcon, FlameIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { DailyByte } from "@shared/schema";

interface DailyByteProps {
  userId: number;
  dailyByte: DailyByte & { completed?: boolean };
  streak: number;
}

export function DailyByte({ userId, dailyByte, streak }: DailyByteProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const completeDailyByteMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch("/api/user-daily-bytes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: userId,
          dailyByteId: dailyByte.id,
          notes: ""  // Initially empty, could be updated later
        })
      });
      
      if (!response.ok) {
        throw new Error("Failed to complete daily byte");
      }
      
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/users/${userId}/dashboard`] });
      toast({
        title: "Daily Byte Completed!",
        description: "You've earned points and continued your learning streak.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to complete the daily byte. Please try again.",
        variant: "destructive",
      });
    }
  });

  const handleComplete = () => {
    setIsLoading(true);
    completeDailyByteMutation.mutate();
    setIsLoading(false);
  };

  // Determine difficulty level color - default to easy (green)
  const difficultyLevel = dailyByte.type || "easy";
  let difficultyColor = "bg-green-100 text-green-800";
  
  if (difficultyLevel.toLowerCase() === "medium") {
    difficultyColor = "bg-yellow-100 text-yellow-800";
  } else if (difficultyLevel.toLowerCase() === "hard") {
    difficultyColor = "bg-red-100 text-red-800";
  }

  return (
    <Card className="w-full mb-8 border-t-4 border-t-primary shadow-md">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl flex items-center gap-2">
            <LightbulbIcon className="h-5 w-5 text-primary" />
            Daily Byte
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className={difficultyColor}>
              {difficultyLevel.charAt(0).toUpperCase() + difficultyLevel.slice(1)}
            </Badge>
            {streak > 0 && (
              <Badge variant="outline" className="bg-orange-100 text-orange-800 flex items-center gap-1">
                <FlameIcon className="h-3 w-3" /> 
                {streak} day streak
              </Badge>
            )}
          </div>
        </div>
        <CardDescription>
          Quick learning, delivered daily
        </CardDescription>
      </CardHeader>
      <CardContent className="py-2">
        <h3 className="font-semibold text-lg mb-2">{dailyByte.title}</h3>
        <div className="prose prose-sm dark:prose-invert mb-4 max-w-none">
          <div dangerouslySetInnerHTML={{ __html: dailyByte.content }} />
        </div>
      </CardContent>
      <CardFooter className="flex justify-between pt-2">
        {dailyByte.completed ? (
          <div className="flex items-center text-green-600 gap-2">
            <CheckCircleIcon className="h-5 w-5" /> 
            <span>Completed today</span>
          </div>
        ) : (
          <Button 
            onClick={handleComplete} 
            disabled={isLoading || dailyByte.completed}
            className="gap-2"
          >
            <BrainCircuitIcon className="h-4 w-4" />
            {isLoading ? "Marking as completed..." : "Complete & Earn Points"}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}