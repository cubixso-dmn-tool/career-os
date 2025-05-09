import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { ChevronRight, Clock, Compass, LayersIcon, BookOpen, Award } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "wouter";

interface Track {
  id: number;
  title: string;
  description: string;
  courseCount: number;
  estimatedHours: number;
  targetCareer: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  image: string;
}

export default function LearningTracks() {
  const { data: tracks = [], isLoading } = useQuery<Track[]>({
    queryKey: ['/api/courses/tracks'],
    // Using default queryFn from queryClient
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "beginner": return "bg-green-100 text-green-700";
      case "intermediate": return "bg-blue-100 text-blue-700";
      case "advanced": return "bg-purple-100 text-purple-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  const getDifficultyIcon = (difficulty: string) => {
    switch (difficulty) {
      case "beginner": return <LayersIcon className="h-4 w-4 mr-1" />;
      case "intermediate": return <Compass className="h-4 w-4 mr-1" />;
      case "advanced": return <Award className="h-4 w-4 mr-1" />;
      default: return <LayersIcon className="h-4 w-4 mr-1" />;
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-64" />
        <div className="flex space-x-4 overflow-hidden">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-72 w-80 rounded-xl flex-shrink-0" />
          ))}
        </div>
      </div>
    );
  }

  // If no tracks, return nothing
  if (tracks.length === 0) {
    return null;
  }

  // Fallback data if API doesn't return all required fields
  const processedTracks = tracks.map(track => ({
    ...track,
    courseCount: track.courseCount || 3,
    estimatedHours: track.estimatedHours || 15,
    targetCareer: track.targetCareer || "Tech Professional",
    difficulty: track.difficulty || "intermediate",
    image: track.image || "https://placehold.co/400x225/e2e8f0/64748b?text=Learning+Track"
  }));

  return (
    <div className="my-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold flex items-center">
          <Compass className="mr-2 h-5 w-5 text-primary" />
          Learning Tracks
        </h2>
        <Link href="/courses/tracks">
          <Button variant="ghost" className="text-primary">
            View All <ChevronRight className="ml-1 h-4 w-4" />
          </Button>
        </Link>
      </div>
      
      <p className="text-gray-600 mb-4">
        Career-focused learning paths designed to help you achieve your professional goals
      </p>
      
      <ScrollArea className="pb-4">
        <div className="flex space-x-4 pb-4">
          {processedTracks.map((track) => (
            <Card key={track.id} className="w-80 flex-shrink-0 border border-gray-100 hover:shadow-md transition-shadow">
              <div className="relative">
                <img 
                  src={track.image} 
                  alt={track.title} 
                  className="h-36 w-full object-cover rounded-t-lg"
                />
                <div className="absolute bottom-0 right-0 m-2">
                  <Badge className={`${getDifficultyColor(track.difficulty)} flex items-center`}>
                    {getDifficultyIcon(track.difficulty)}
                    {track.difficulty.charAt(0).toUpperCase() + track.difficulty.slice(1)}
                  </Badge>
                </div>
              </div>
              
              <CardContent className="p-4">
                <div className="mb-2">
                  <h3 className="font-semibold text-gray-900">{track.title}</h3>
                  <p className="text-sm text-primary">For {track.targetCareer}</p>
                </div>
                
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">{track.description}</p>
                
                <div className="flex justify-between items-center text-sm text-gray-500 mb-4">
                  <div className="flex items-center">
                    <BookOpen className="mr-1" size={14} />
                    {track.courseCount} courses
                  </div>
                  <div className="flex items-center">
                    <Clock className="mr-1" size={14} />
                    {track.estimatedHours} hours
                  </div>
                </div>
                
                <Link href={`/courses/tracks/${track.id}`}>
                  <Button className="w-full">Start Track</Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
}