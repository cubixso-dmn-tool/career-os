import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, Users } from "lucide-react";
import { Link } from "wouter";

interface Course {
  id: number;
  title: string;
  description: string;
  thumbnail: string;
  price: number;
  isFree: boolean;
  rating: number;
  enrolledCount: number;
  category: string;
  tags?: string[];
  isFeatured?: boolean;
}

interface CourseCardProps {
  course: Course;
}

export default function CourseCard({ course }: CourseCardProps) {
  // Format rating to display as X.Y out of 5
  const formatRating = (rating: number) => (rating / 10).toFixed(1);
  
  // Format enrolled count
  const formatEnrolledCount = (count: number) => {
    if (count >= 1000) {
      return `${Math.floor(count / 1000)}K+`;
    }
    return count.toString();
  };

  return (
    <Card className="overflow-hidden border border-gray-100 hover:shadow-md transition-shadow">
      <div className="relative">
        <img 
          className="w-full h-40 object-cover" 
          src={course.thumbnail} 
          alt={course.title} 
        />
        {course.isFeatured && (
          <span className="absolute top-2 right-2 bg-amber-500 text-white text-xs px-2 py-1 rounded">
            {course.isFree ? "Bestseller" : "Recommended"}
          </span>
        )}
      </div>
      
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <h3 className="font-medium text-gray-900 mb-1">{course.title}</h3>
          <span className="flex items-center text-sm">
            <Star className="text-amber-400 mr-1" size={14} />
            {formatRating(course.rating)}
          </span>
        </div>
        
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{course.description}</p>
        
        <div className="flex flex-wrap gap-2 mb-3">
          {course.tags && course.tags.slice(0, 3).map((tag, index) => (
            <Badge key={index} variant="secondary" className="bg-gray-100 text-gray-700 border-none">
              {tag}
            </Badge>
          ))}
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-primary font-semibold">
            {course.isFree ? "Free" : `₹${course.price}`}
          </span>
          <div className="flex items-center text-sm text-gray-500">
            <Users className="mr-1" size={14} />
            {formatEnrolledCount(course.enrolledCount)} enrolled
          </div>
        </div>
        
        <Link href={`/courses/${course.id}`}>
          <Button className="w-full mt-3 bg-primary hover:bg-primary/90">
            {course.isFree ? "Enroll Now" : "View Course"}
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}
