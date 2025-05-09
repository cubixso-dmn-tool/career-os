import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { BarChart, Calendar, Info, TrendingUp, Award, AlertTriangle, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface ActivityDay {
  date: string; // ISO date string
  count: number; // activity count for that day
  streak: boolean; // whether day is part of a streak
  minutesSpent?: number; // optional minutes spent on that day
}

export default function ProgressHeatmap() {
  const [timeframe, setTimeframe] = useState("last30");
  
  const { data: activityData = [], isLoading } = useQuery<ActivityDay[]>({
    queryKey: ['/api/courses/activity', timeframe],
    // Using default queryFn from queryClient
  });
  
  const { data: stats } = useQuery<{
    currentStreak: number;
    longestStreak: number;
    totalDays: number;
    totalMinutes: number;
    averageMinutesPerDay: number;
  }>({
    queryKey: ['/api/courses/activity-stats', timeframe],
    // Using default queryFn from queryClient
  });
  
  // Generate calendar grid from activity data
  const generateCalendarData = () => {
    if (activityData.length === 0) return [];
    
    // Handle different timeframes
    let days: ActivityDay[] = [];
    const now = new Date();
    
    if (timeframe === "last30") {
      // Get last 30 days
      for (let i = 29; i >= 0; i--) {
        const date = new Date(now);
        date.setDate(now.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];
        
        // Find if we have data for this day
        const dayData = activityData.find(d => d.date === dateStr);
        
        days.push(dayData || {
          date: dateStr,
          count: 0,
          streak: false,
          minutesSpent: 0
        });
      }
    } else if (timeframe === "last90") {
      // Get last 90 days - fill every 3rd day for UI compactness
      for (let i = 89; i >= 0; i -= 3) {
        const date = new Date(now);
        date.setDate(now.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];
        
        // Get average for these 3 days
        const threeDaysData = [];
        for (let j = 0; j < 3; j++) {
          const innerDate = new Date(now);
          innerDate.setDate(now.getDate() - (i - j));
          const innerDateStr = innerDate.toISOString().split('T')[0];
          const dayData = activityData.find(d => d.date === innerDateStr);
          if (dayData) threeDaysData.push(dayData);
        }
        
        const avgCount = threeDaysData.length > 0 
          ? Math.round(threeDaysData.reduce((sum, d) => sum + d.count, 0) / threeDaysData.length) 
          : 0;
        
        const avgMinutes = threeDaysData.length > 0 
          ? Math.round(threeDaysData.reduce((sum, d) => sum + (d.minutesSpent || 0), 0) / threeDaysData.length) 
          : 0;
        
        days.push({
          date: dateStr,
          count: avgCount,
          streak: threeDaysData.some(d => d.streak),
          minutesSpent: avgMinutes
        });
      }
    }
    
    return days;
  };
  
  const calendar = generateCalendarData();
  
  // Function to determine cell color based on activity count
  const getCellColor = (count: number) => {
    if (count === 0) return "bg-gray-100";
    if (count < 2) return "bg-green-100";
    if (count < 4) return "bg-green-300";
    if (count < 6) return "bg-green-500";
    return "bg-green-700";
  };
  
  // Function to format date for display
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
  };
  
  if (isLoading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-6 bg-gray-200 rounded w-1/4"></div>
        <div className="flex gap-1 flex-wrap">
          {Array(30).fill(0).map((_, i) => (
            <div key={i} className="h-5 w-5 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    );
  }
  
  // If no activity data and not loading, show nothing
  if (!isLoading && activityData.length === 0) {
    return null;
  }

  return (
    <div className="my-8">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-xl font-semibold flex items-center">
          <BarChart className="mr-2 h-5 w-5 text-primary" />
          Learning Momentum
        </h2>
        
        <div className="flex items-center">
          <HoverCard>
            <HoverCardTrigger asChild>
              <Info className="h-4 w-4 text-gray-400 mr-3 cursor-help" />
            </HoverCardTrigger>
            <HoverCardContent className="w-80">
              <div className="space-y-2">
                <h4 className="font-medium">Your Learning Heatmap</h4>
                <p className="text-sm text-gray-600">
                  This visualization shows your learning activity over time. Darker squares indicate more activity on that day.
                </p>
                <div className="flex items-center gap-1 text-xs mt-2">
                  <div className="w-3 h-3 bg-gray-100"></div>
                  <div className="w-3 h-3 bg-green-100"></div>
                  <div className="w-3 h-3 bg-green-300"></div>
                  <div className="w-3 h-3 bg-green-500"></div>
                  <div className="w-3 h-3 bg-green-700"></div>
                  <span className="ml-1">Less → More activity</span>
                </div>
              </div>
            </HoverCardContent>
          </HoverCard>
          
          <Select value={timeframe} onValueChange={setTimeframe}>
            <SelectTrigger className="w-32 h-8 text-xs">
              <SelectValue placeholder="Time period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="last30">Last 30 days</SelectItem>
              <SelectItem value="last90">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <p className="text-gray-600 mb-4">
        Visual feedback on your course progress and learning patterns
      </p>
      
      <Card className="border border-gray-100">
        <CardContent className="p-5">
          <div className="flex flex-wrap gap-1 mb-4">
            <TooltipProvider>
              {calendar.map((day) => (
                <Tooltip key={day.date}>
                  <TooltipTrigger asChild>
                    <div 
                      className={cn(
                        "w-5 h-5 rounded-sm cursor-pointer relative",
                        getCellColor(day.count),
                        day.streak && "ring-1 ring-amber-500"
                      )}
                    >
                      {day.streak && (
                        <div className="absolute -top-1 -right-1 w-2 h-2 bg-amber-500 rounded-full" />
                      )}
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="bg-gray-800 text-white border-none p-2 text-xs">
                    <div>
                      <div className="font-medium">{formatDate(day.date)}</div>
                      <div className="text-gray-200">
                        {day.count === 0 
                          ? "No activity" 
                          : `${day.count} ${day.count === 1 ? 'activity' : 'activities'}`}
                      </div>
                      {day.minutesSpent !== undefined && day.minutesSpent > 0 && (
                        <div className="text-gray-200">{day.minutesSpent} minutes</div>
                      )}
                      {day.streak && (
                        <div className="text-amber-300 flex items-center mt-1">
                          <Award className="h-3 w-3 mr-1" /> Part of streak
                        </div>
                      )}
                    </div>
                  </TooltipContent>
                </Tooltip>
              ))}
            </TooltipProvider>
          </div>
          
          {/* Stats Section */}
          {stats && (
            <div className="mt-6 pt-4 border-t grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-gray-500 text-sm mb-1 flex items-center justify-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  Days Active
                </div>
                <div className="text-xl font-semibold">
                  {stats.totalDays}
                </div>
              </div>
              
              <div className="text-center">
                <div className="text-gray-500 text-sm mb-1 flex items-center justify-center">
                  <Award className="h-4 w-4 mr-1" />
                  Current Streak
                </div>
                <div className="text-xl font-semibold">
                  {stats.currentStreak} days
                </div>
              </div>
              
              <div className="text-center">
                <div className="text-gray-500 text-sm mb-1 flex items-center justify-center">
                  <Clock className="h-4 w-4 mr-1" />
                  Total Time
                </div>
                <div className="text-xl font-semibold">
                  {stats.totalMinutes >= 60 
                    ? `${Math.floor(stats.totalMinutes / 60)}h ${stats.totalMinutes % 60}m` 
                    : `${stats.totalMinutes}m`}
                </div>
              </div>
              
              <div className="text-center">
                <div className="text-gray-500 text-sm mb-1 flex items-center justify-center">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  Daily Average
                </div>
                <div className="text-xl font-semibold">
                  {stats.averageMinutesPerDay}m
                </div>
              </div>
            </div>
          )}
          
          {/* Motivation Message */}
          {stats && (
            <div className="mt-4 text-sm p-2 rounded bg-gray-50 flex items-start">
              {stats.currentStreak > 5 ? (
                <>
                  <Award className="h-4 w-4 text-amber-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>
                    <span className="font-medium">Great work!</span> Your {stats.currentStreak}-day streak shows amazing commitment. Keep it up!
                  </span>
                </>
              ) : stats.currentStreak > 0 ? (
                <>
                  <TrendingUp className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>
                    <span className="font-medium">Good progress!</span> You're on a {stats.currentStreak}-day streak. Consistency is key!
                  </span>
                </>
              ) : (
                <>
                  <AlertTriangle className="h-4 w-4 text-amber-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>
                    <span className="font-medium">Ready to learn?</span> Start a new streak today to build momentum!
                  </span>
                </>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}