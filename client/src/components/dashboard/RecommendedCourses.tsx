import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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

interface RecommendedCoursesProps {
  courses: Course[];
}

export default function RecommendedCourses({ courses }: RecommendedCoursesProps) {
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
    <div className="mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Recommended Courses</h2>
        <Link href="/courses">
          <a className="text-sm text-primary font-medium hover:underline cursor-pointer">
            View All
          </a>
        </Link>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {courses.map((course) => (
          <Card key={course.id} className="overflow-hidden border border-gray-100 hover:shadow-md transition-shadow">
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
            
            <div className="p-4">
              <div className="flex justify-between items-start">
                <h3 className="font-medium text-gray-900 mb-1">{course.title}</h3>
                <span className="flex items-center text-sm">
                  <Star className="text-amber-400 mr-1" size={14} />
                  {formatRating(course.rating)}
                </span>
              </div>
              
              <p className="text-sm text-gray-600 mb-3 line-clamp-2">{course.description}</p>
              
              <div className="flex justify-between items-center mb-3">
                <span className="text-primary font-semibold">
                  {course.isFree ? "Free" : `₹${course.price}`}
                </span>
                <div className="flex items-center text-sm text-gray-500">
                  <Users className="mr-1" size={14} />
                  {formatEnrolledCount(course.enrolledCount)} enrolled
                </div>
              </div>
              
              <Link href={`/courses/${course.id}`}>
                <Button className="w-full bg-primary hover:bg-primary/90" size="sm">
                  {course.isFree ? "Enroll Now" : "View Course"}
                </Button>
              </Link>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
