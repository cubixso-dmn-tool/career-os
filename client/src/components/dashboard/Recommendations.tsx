import React from 'react';
import { useDashboard } from '@/hooks/useDashboardContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Code, Users, Sparkles, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

// Recommendation item component
const RecommendationItem: React.FC<{
  type: string;
  title: string;
  description: string;
  reason: string;
  onAction: () => void;
}> = ({ type, title, description, reason, onAction }) => {
  // Get the appropriate icon based on recommendation type
  const getIcon = () => {
    switch (type) {
      case 'course':
        return <BookOpen className="h-5 w-5 text-blue-600" />;
      case 'project':
        return <Code className="h-5 w-5 text-green-600" />;
      case 'community':
        return <Users className="h-5 w-5 text-purple-600" />;
      case 'skill':
        return <Sparkles className="h-5 w-5 text-yellow-600" />;
      default:
        return <ArrowRight className="h-5 w-5" />;
    }
  };
  
  // Get the appropriate action text based on recommendation type
  const getActionText = () => {
    switch (type) {
      case 'course':
        return 'Enroll Now';
      case 'project':
        return 'Start Project';
      case 'community':
        return 'Join Community';
      case 'skill':
        return 'Develop Skill';
      default:
        return 'View Details';
    }
  };
  
  return (
    <div className="p-4 border rounded-lg hover:border-primary/50 transition-all">
      <div className="flex items-start space-x-4">
        <div className="p-2 bg-primary/10 rounded-full">
          {getIcon()}
        </div>
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <h3 className="font-medium">{title}</h3>
            <Badge variant="outline" className="capitalize">{type}</Badge>
          </div>
          <p className="text-sm text-gray-500 mt-1">{description}</p>
          <div className="mt-3">
            <p className="text-xs text-gray-500 italic">
              <span className="font-medium">Why:</span> {reason}
            </p>
          </div>
          <Button 
            variant="outline" 
            size="sm"
            className="mt-3"
            onClick={onAction}
          >
            {getActionText()}
            <ArrowRight className="ml-2 h-3 w-3" />
          </Button>
        </div>
      </div>
    </div>
  );
};

// Recommendations component
const Recommendations: React.FC<{
  onRecommendationAction: (type: string, id: number) => void;
}> = ({ onRecommendationAction }) => {
  const { learningRecommendations } = useDashboard();
  
  // Handle recommendation action button click
  const handleAction = (type: string, id: number) => {
    onRecommendationAction(type, id);
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Personalized Recommendations</CardTitle>
        <CardDescription>
          Based on your learning activities and progress
        </CardDescription>
      </CardHeader>
      <CardContent>
        {learningRecommendations.length > 0 ? (
          <div className="space-y-4">
            {learningRecommendations.map((recommendation, index) => (
              <RecommendationItem
                key={`${recommendation.type}-${recommendation.id}-${index}`}
                type={recommendation.type}
                title={recommendation.title}
                description={recommendation.description}
                reason={recommendation.reason}
                onAction={() => handleAction(recommendation.type, recommendation.id)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Sparkles className="h-8 w-8 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">
              Complete more courses and projects to get personalized recommendations.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default Recommendations;