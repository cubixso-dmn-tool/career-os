import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { LightbulbIcon, Clock, CheckCircle2, Calendar, Trophy, Bookmark, Edit3 } from "lucide-react";
import { cn } from "@/lib/utils";

interface MicrolearningBite {
  id: number;
  title: string;
  description: string;
  category: string;
  estimatedMinutes: number;
  completed: boolean;
  date: string;  // ISO format date string
  badges?: {
    id: number;
    name: string;
    icon: string;
    earned: boolean;
  }[];
}

export default function MicrolearningBites() {
  const { data: bites = [], isLoading } = useQuery<MicrolearningBite[]>({
    queryKey: ['/api/courses/microlearning-bites'],
    // Using default queryFn from queryClient
  });
  
  // Current streak of daily bites
  const { data: streakData } = useQuery<{currentStreak: number, longestStreak: number}>({
    queryKey: ['/api/courses/streak'],
    // Using default queryFn from queryClient
  });
  
  const currentStreak = streakData?.currentStreak || 0;
  const longestStreak = streakData?.longestStreak || 0;

  // Check if today's bite has been completed
  const today = new Date().toISOString().split('T')[0];
  const todayBiteCompleted = bites.some(bite => 
    bite.date.startsWith(today) && bite.completed
  );
  
  // Calculate percentage of completed bites this week
  const thisWeekBites = bites.filter(bite => {
    const biteDate = new Date(bite.date);
    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    return biteDate >= startOfWeek;
  });
  
  const weeklyCompletionPercentage = thisWeekBites.length > 0
    ? Math.round((thisWeekBites.filter(bite => bite.completed).length / thisWeekBites.length) * 100)
    : 0;

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-6 bg-gray-200 rounded w-1/4"></div>
        <div className="h-40 bg-gray-200 rounded"></div>
      </div>
    );
  }

  if (bites.length === 0) {
    return null;
  }

  // Get today's bite or the latest one
  const todayBite = bites.find(bite => bite.date.startsWith(today)) || bites[0];

  return (
    <div className="my-8">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-xl font-semibold flex items-center">
          <LightbulbIcon className="mr-2 h-5 w-5 text-primary" />
          Daily Bytes
        </h2>
        
        <HoverCard>
          <HoverCardTrigger asChild>
            <div className="flex items-center text-amber-600 bg-amber-50 px-3 py-1 rounded-full text-sm cursor-help">
              <Trophy className="h-4 w-4 mr-1" />
              <span>{currentStreak} day streak</span>
            </div>
          </HoverCardTrigger>
          <HoverCardContent className="w-72">
            <div className="space-y-2">
              <h4 className="font-medium">Your Learning Streak</h4>
              <p className="text-sm text-gray-600">
                You've completed daily lessons for {currentStreak} consecutive days!
              </p>
              <div className="text-sm text-gray-600 pt-2 border-t">
                <div className="flex justify-between">
                  <span>Current streak:</span>
                  <span className="font-semibold">{currentStreak} days</span>
                </div>
                <div className="flex justify-between">
                  <span>Longest streak:</span>
                  <span className="font-semibold">{longestStreak} days</span>
                </div>
              </div>
            </div>
          </HoverCardContent>
        </HoverCard>
      </div>
      
      <p className="text-gray-600 mb-4">
        Quick, daily micro-lessons to build knowledge consistently
      </p>
      
      <div className="grid grid-cols-1 lg:grid-cols-7 gap-4">
        <Card className="lg:col-span-5 border border-gray-100">
          <CardContent className="p-5">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="font-medium text-lg">{todayBite.title}</h3>
                <div className="flex items-center text-sm text-gray-500 mt-1">
                  <Calendar className="h-4 w-4 mr-1" />
                  <span>Today's byte</span>
                  <span className="mx-2">•</span>
                  <Clock className="h-4 w-4 mr-1" />
                  <span>{todayBite.estimatedMinutes} min</span>
                </div>
              </div>
              
              {todayBite.completed ? (
                <Badge className="bg-green-100 text-green-800 flex items-center">
                  <CheckCircle2 className="h-3 w-3 mr-1" />
                  Completed
                </Badge>
              ) : (
                <Button size="sm" className="flex gap-2">
                  <span>Start Now</span>
                </Button>
              )}
            </div>
            
            <p className="text-gray-600 mb-4">{todayBite.description}</p>
            
            <div className="flex flex-wrap gap-2 mt-4">
              {todayBite.badges?.map(badge => (
                <HoverCard key={badge.id}>
                  <HoverCardTrigger asChild>
                    <div 
                      className={cn(
                        "flex items-center gap-1 px-2 py-1 rounded-full text-xs cursor-pointer",
                        badge.earned 
                          ? "bg-primary/10 text-primary" 
                          : "bg-gray-100 text-gray-500"
                      )}
                    >
                      {badge.icon === "edit" && <Edit3 className="h-3 w-3" />}
                      {badge.icon === "bookmark" && <Bookmark className="h-3 w-3" />}
                      {badge.icon === "trophy" && <Trophy className="h-3 w-3" />}
                      {badge.name}
                    </div>
                  </HoverCardTrigger>
                  <HoverCardContent className="w-64">
                    <div className="space-y-2">
                      <h4 className="font-medium">{badge.name} Badge</h4>
                      <p className="text-sm text-gray-600">
                        {badge.earned 
                          ? "You've earned this badge! Keep up the good work." 
                          : "Complete this daily byte to earn this badge."}
                      </p>
                    </div>
                  </HoverCardContent>
                </HoverCard>
              ))}
            </div>
          </CardContent>
        </Card>
        
        <Card className="lg:col-span-2 border border-gray-100">
          <CardContent className="p-5">
            <h3 className="font-medium mb-3">Weekly Progress</h3>
            
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>This week</span>
                  <span>{weeklyCompletionPercentage}%</span>
                </div>
                <Progress value={weeklyCompletionPercentage} className="h-2" />
              </div>
              
              <div className="text-sm text-gray-600 space-y-1">
                <div className="flex justify-between">
                  <span>Completed bytes:</span>
                  <span>{thisWeekBites.filter(b => b.completed).length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Total bytes:</span>
                  <span>{thisWeekBites.length}</span>
                </div>
              </div>
              
              <div className="pt-3 border-t">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Today's status:</span>
                  {todayBiteCompleted ? (
                    <Badge variant="outline" className="bg-green-50 border-green-200 text-green-700">
                      Complete
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="bg-amber-50 border-amber-200 text-amber-700">
                      Pending
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}