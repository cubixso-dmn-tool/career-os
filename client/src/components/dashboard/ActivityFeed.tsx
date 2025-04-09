import React from 'react';
import { useDashboard } from '@/hooks/useDashboardContext';
import { useDashboardEvents } from '@/lib/dashboardEventBus';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Book, Code, Star, Award, Calendar, MessageSquare, Briefcase } from "lucide-react";
import { formatDistance } from 'date-fns';

// Function to get an icon based on activity type
function getActivityIcon(type: string) {
  switch (type) {
    case 'course':
      return <Book className="h-4 w-4" />;
    case 'project':
      return <Code className="h-4 w-4" />;
    case 'skill':
      return <Star className="h-4 w-4" />;
    case 'achievement':
      return <Award className="h-4 w-4" />;
    case 'event':
      return <Calendar className="h-4 w-4" />;
    case 'post':
      return <MessageSquare className="h-4 w-4" />;
    case 'job':
      return <Briefcase className="h-4 w-4" />;
    default:
      return <Star className="h-4 w-4" />;
  }
}

// Function to get the badge color based on activity type
function getActivityColor(type: string) {
  switch (type) {
    case 'course':
      return 'bg-blue-100 text-blue-800';
    case 'project':
      return 'bg-green-100 text-green-800';
    case 'skill':
      return 'bg-purple-100 text-purple-800';
    case 'achievement':
      return 'bg-yellow-100 text-yellow-800';
    case 'event':
      return 'bg-pink-100 text-pink-800';
    case 'post':
      return 'bg-indigo-100 text-indigo-800';
    case 'job':
      return 'bg-orange-100 text-orange-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}

// Activity item component
export const ActivityItem: React.FC<{
  activity: {
    type: string;
    title: string;
    date: string;
    isCompleted?: boolean;
    progress?: number;
    id: number | string;
    entityId?: number;
  };
  onClick?: (type: string, id: number) => void;
}> = ({ activity, onClick }) => {
  const { type, title, date, isCompleted, progress, entityId } = activity;
  const color = getActivityColor(type);
  const icon = getActivityIcon(type);
  const timeAgo = formatDistance(new Date(date), new Date(), { addSuffix: true });
  
  // Determine if and how to show progress
  const showProgress = typeof progress === 'number' && progress > 0 && !isCompleted;
  const progressText = showProgress ? `${progress}% complete` : '';
  const statusText = isCompleted ? 'Completed' : (showProgress ? progressText : 'Started');
  
  // Handle click to navigate to the specific item
  const handleClick = () => {
    if (onClick && entityId) {
      onClick(type, entityId);
    }
  };
  
  return (
    <div 
      className="flex items-start space-x-4 p-4 hover:bg-gray-50 rounded-md cursor-pointer transition-colors"
      onClick={handleClick}
    >
      <div className={`${color} p-2 rounded-full`}>{icon}</div>
      <div className="flex-1 space-y-1">
        <div className="flex items-center justify-between">
          <Badge variant="outline" className="capitalize">
            {type}
          </Badge>
          <span className="text-xs text-gray-500">{timeAgo}</span>
        </div>
        <h4 className="text-sm font-medium">{title}</h4>
        <div className="flex items-center">
          {isCompleted ? (
            <Badge variant="success" className="text-xs">Completed</Badge>
          ) : showProgress ? (
            <div className="w-full max-w-[200px]">
              <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary rounded-full" 
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <span className="text-xs text-gray-500 mt-1">{progressText}</span>
            </div>
          ) : (
            <Badge variant="outline" className="text-xs">In Progress</Badge>
          )}
        </div>
      </div>
    </div>
  );
};

// Main activity feed component
const ActivityFeed: React.FC<{
  title?: string;
  description?: string;
  maxItems?: number;
  filter?: string[];
  onActivityClick?: (type: string, id: number) => void;
}> = ({ 
  title = "Recent Activity", 
  description = "Your latest learning journey updates",
  maxItems = 5,
  filter,
  onActivityClick
}) => {
  // Get recent activities from the dashboard context
  const { recentActivities } = useDashboard();
  const { subscribe } = useDashboardEvents();
  
  // Filter activities if filter is provided
  const filteredActivities = filter 
    ? recentActivities.filter(activity => filter.includes(activity.type))
    : recentActivities;
    
  // Limit to max items
  const activitiesToShow = filteredActivities.slice(0, maxItems);
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-1 divide-y">
          {activitiesToShow.length > 0 ? (
            activitiesToShow.map((activity) => (
              <ActivityItem 
                key={`${activity.type}-${activity.id}`} 
                activity={activity}
                onClick={onActivityClick}
              />
            ))
          ) : (
            <div className="py-4 text-center text-sm text-gray-500">
              No recent activities yet. Start your learning journey!
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ActivityFeed;