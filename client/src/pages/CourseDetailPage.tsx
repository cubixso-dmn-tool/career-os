import React, { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useParams } from 'wouter';
import { useCourseIntegration } from '@/hooks/useDashboardIntegration';
import { useDashboardEvents } from '@/lib/dashboardEventBus';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle, BookOpen, Video, FileText, MessageSquare, Clock, Award, Lock, Play } from 'lucide-react';
import ActivityFeed from '@/components/dashboard/ActivityFeed';
import DashboardLayout from '@/components/dashboard/DashboardLayout';

// Course module component
const CourseModule: React.FC<{
  title: string;
  description: string;
  lessons: {
    id: number;
    title: string;
    duration: string;
    type: 'video' | 'reading' | 'quiz';
    isCompleted: boolean;
    isLocked: boolean;
  }[];
  isActive: boolean;
  onLessonSelect: (lessonId: number) => void;
}> = ({ title, description, lessons, isActive, onLessonSelect }) => {
  return (
    <Card className={`mb-4 ${isActive ? 'border-primary' : ''}`}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {lessons.map((lesson) => {
            // Determine the icon based on lesson type
            let icon;
            switch (lesson.type) {
              case 'video':
                icon = <Video className="h-4 w-4" />;
                break;
              case 'reading':
                icon = <FileText className="h-4 w-4" />;
                break;
              case 'quiz':
                icon = <MessageSquare className="h-4 w-4" />;
                break;
            }
            
            return (
              <div 
                key={lesson.id}
                className={`
                  flex items-center justify-between p-3 rounded-md
                  ${lesson.isCompleted ? 'bg-green-50' : 'bg-gray-50'} 
                  ${lesson.isLocked ? 'opacity-50' : 'cursor-pointer hover:bg-gray-100'}
                `}
                onClick={() => !lesson.isLocked && onLessonSelect(lesson.id)}
              >
                <div className="flex items-center space-x-3">
                  <div className="text-gray-500">
                    {lesson.isCompleted ? (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    ) : lesson.isLocked ? (
                      <Lock className="h-5 w-5" />
                    ) : (
                      icon
                    )}
                  </div>
                  <div>
                    <h3 className="text-sm font-medium">{lesson.title}</h3>
                    <div className="flex items-center text-xs text-gray-500 mt-1">
                      <Clock className="h-3 w-3 mr-1" />
                      <span>{lesson.duration}</span>
                    </div>
                  </div>
                </div>
                
                {!lesson.isCompleted && !lesson.isLocked && (
                  <Button variant="ghost" size="sm" className="gap-1">
                    <Play className="h-3 w-3" />
                    <span>Start</span>
                  </Button>
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

// Main course detail page
const CourseDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const courseId = parseInt(id);
  const { user } = useAuth();
  const { toast } = useToast();
  const { enrollInCourseMutation, updateCourseProgressMutation } = useCourseIntegration();
  const { publish, eventNames } = useDashboardEvents();
  
  const [activeTab, setActiveTab] = useState('curriculum');
  const [selectedLessonId, setSelectedLessonId] = useState<number | null>(null);
  
  // Fetch course details
  const { data: course, isLoading: isLoadingCourse } = useQuery({
    queryKey: [`/api/courses/${courseId}`],
    enabled: !isNaN(courseId),
  });
  
  // Fetch user's enrollment for this course
  const { data: enrollment, isLoading: isLoadingEnrollment } = useQuery({
    queryKey: [`/api/users/${user?.id}/enrollments/course/${courseId}`],
    enabled: !!user?.id && !isNaN(courseId),
  });
  
  // Determine if user is enrolled
  const isEnrolled = !!enrollment;
  
  // Handle enrollment
  const handleEnroll = async () => {
    try {
      await enrollInCourseMutation.mutateAsync({ courseId });
      
      // Publish event that the user enrolled in a course
      publish(eventNames.COURSE_ENROLLED, { 
        courseId, 
        courseTitle: course?.title 
      });
      
    } catch (error) {
      console.error('Failed to enroll:', error);
    }
  };
  
  // Handle lesson completion
  const handleLessonComplete = async (lessonId: number) => {
    if (!enrollment) return;
    
    // Calculate new progress percentage
    // This is a simplified calculation - in a real implementation,
    // you'd need to know how many lessons there are in total
    const totalLessons = course?.modules?.reduce(
      (acc, module) => acc + module.lessons.length, 
      0
    ) || 10;
    const completedLessons = enrollment.completedLessons?.length || 0;
    const newProgress = Math.min(
      Math.round(((completedLessons + 1) / totalLessons) * 100),
      100
    );
    
    // Determine if the course is now completed
    const isCompleted = newProgress === 100;
    
    try {
      await updateCourseProgressMutation.mutateAsync({
        enrollmentId: enrollment.id,
        progress: newProgress,
        isCompleted
      });
      
      // Publish progress update event
      publish(
        isCompleted 
          ? eventNames.COURSE_COMPLETED 
          : eventNames.COURSE_PROGRESS_UPDATED, 
        { 
          courseId, 
          courseTitle: course?.title,
          lessonId,
          progress: newProgress
        }
      );
      
      toast({
        title: isCompleted ? 'Course Completed!' : 'Progress Saved',
        description: isCompleted 
          ? 'Congratulations on completing this course!' 
          : 'Your progress has been saved.',
        variant: isCompleted ? 'default' : 'success',
      });
      
    } catch (error) {
      console.error('Failed to update progress:', error);
    }
  };
  
  // Handle lesson selection
  const handleLessonSelect = (lessonId: number) => {
    setSelectedLessonId(lessonId);
    setActiveTab('lesson');
  };
  
  // Loading state
  if (isLoadingCourse || isLoadingEnrollment) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </DashboardLayout>
    );
  }
  
  // Handle missing course
  if (!course) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold">Course not found</h2>
          <p className="text-gray-500 mt-2">The course you're looking for doesn't exist or has been removed.</p>
          <Button className="mt-4" asChild>
            <a href="/dashboard/courses">Back to Courses</a>
          </Button>
        </div>
      </DashboardLayout>
    );
  }
  
  // Example course data structure
  const courseData = {
    id: courseId,
    title: course.title || 'Web Development Fundamentals',
    description: course.description || 'Learn the fundamentals of web development with HTML, CSS, and JavaScript.',
    instructor: course.instructor || 'John Developer',
    rating: course.rating || 4.8,
    reviewCount: course.reviewCount || 245,
    enrolledCount: course.enrolledCount || 1256,
    thumbnail: course.thumbnail || 'https://example.com/webdev.jpg',
    duration: course.duration || '12 hours',
    level: course.level || 'Beginner',
    modules: course.modules || [
      {
        id: 1,
        title: 'Introduction to Web Development',
        description: 'Get started with the basics of web development.',
        lessons: [
          {
            id: 101,
            title: 'Welcome to the Course',
            duration: '5 min',
            type: 'video',
            isCompleted: enrollment?.completedLessons?.includes(101) || false,
            isLocked: false,
          },
          {
            id: 102,
            title: 'How the Web Works',
            duration: '15 min',
            type: 'video',
            isCompleted: enrollment?.completedLessons?.includes(102) || false,
            isLocked: false,
          },
          {
            id: 103,
            title: 'Setting Up Your Environment',
            duration: '10 min',
            type: 'reading',
            isCompleted: enrollment?.completedLessons?.includes(103) || false,
            isLocked: false,
          },
          {
            id: 104,
            title: 'Module Quiz',
            duration: '10 min',
            type: 'quiz',
            isCompleted: enrollment?.completedLessons?.includes(104) || false,
            isLocked: !enrollment?.completedLessons?.includes(103),
          },
        ],
      },
      {
        id: 2,
        title: 'HTML Fundamentals',
        description: 'Learn the building blocks of web pages.',
        lessons: [
          {
            id: 201,
            title: 'HTML Document Structure',
            duration: '12 min',
            type: 'video',
            isCompleted: enrollment?.completedLessons?.includes(201) || false,
            isLocked: !enrollment?.completedLessons?.includes(104),
          },
          {
            id: 202,
            title: 'Text Elements & Attributes',
            duration: '18 min',
            type: 'video',
            isCompleted: enrollment?.completedLessons?.includes(202) || false,
            isLocked: !enrollment?.completedLessons?.includes(201),
          },
          {
            id: 203,
            title: 'Links and Images',
            duration: '15 min',
            type: 'video',
            isCompleted: enrollment?.completedLessons?.includes(203) || false,
            isLocked: !enrollment?.completedLessons?.includes(202),
          },
          {
            id: 204,
            title: 'HTML Practice Exercise',
            duration: '20 min',
            type: 'reading',
            isCompleted: enrollment?.completedLessons?.includes(204) || false,
            isLocked: !enrollment?.completedLessons?.includes(203),
          },
          {
            id: 205,
            title: 'Module Quiz',
            duration: '10 min',
            type: 'quiz',
            isCompleted: enrollment?.completedLessons?.includes(205) || false,
            isLocked: !enrollment?.completedLessons?.includes(204),
          },
        ],
      },
      {
        id: 3,
        title: 'CSS Basics',
        description: 'Style your web pages with CSS.',
        lessons: [
          {
            id: 301,
            title: 'Introduction to CSS',
            duration: '10 min',
            type: 'video',
            isCompleted: enrollment?.completedLessons?.includes(301) || false,
            isLocked: !enrollment?.completedLessons?.includes(205),
          },
          {
            id: 302,
            title: 'Selectors and Properties',
            duration: '15 min',
            type: 'video',
            isCompleted: enrollment?.completedLessons?.includes(302) || false,
            isLocked: !enrollment?.completedLessons?.includes(301),
          },
          {
            id: 303,
            title: 'Box Model',
            duration: '12 min',
            type: 'video',
            isCompleted: enrollment?.completedLessons?.includes(303) || false,
            isLocked: !enrollment?.completedLessons?.includes(302),
          },
          {
            id: 304,
            title: 'CSS Layout Techniques',
            duration: '20 min',
            type: 'video',
            isCompleted: enrollment?.completedLessons?.includes(304) || false,
            isLocked: !enrollment?.completedLessons?.includes(303),
          },
          {
            id: 305,
            title: 'CSS Practice Exercise',
            duration: '25 min',
            type: 'reading',
            isCompleted: enrollment?.completedLessons?.includes(305) || false,
            isLocked: !enrollment?.completedLessons?.includes(304),
          },
          {
            id: 306,
            title: 'Module Quiz',
            duration: '10 min',
            type: 'quiz',
            isCompleted: enrollment?.completedLessons?.includes(306) || false,
            isLocked: !enrollment?.completedLessons?.includes(305),
          },
        ],
      },
    ],
  };
  
  // Calculate progress
  const completedLessons = enrollment?.completedLessons?.length || 0;
  const totalLessons = courseData.modules.reduce(
    (acc, module) => acc + module.lessons.length, 
    0
  );
  const progress = isEnrolled 
    ? Math.round((completedLessons / totalLessons) * 100)
    : 0;
  
  // Selected lesson data
  const selectedLesson = selectedLessonId 
    ? courseData.modules
        .flatMap(module => module.lessons)
        .find(lesson => lesson.id === selectedLessonId)
    : null;
  
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Course header */}
        <div className="bg-white rounded-lg border p-6">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="w-full md:w-2/3">
              <h1 className="text-2xl font-bold">{courseData.title}</h1>
              <p className="text-gray-500 mt-2">{courseData.description}</p>
              
              <div className="flex flex-wrap items-center gap-4 mt-4">
                <div className="flex items-center gap-1">
                  <BookOpen className="h-4 w-4 text-gray-500" />
                  <span className="text-sm">{courseData.level}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4 text-gray-500" />
                  <span className="text-sm">{courseData.duration}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Award className="h-4 w-4 text-gray-500" />
                  <span className="text-sm">Certificate Available</span>
                </div>
              </div>
              
              <Separator className="my-4" />
              
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                {isEnrolled ? (
                  <>
                    <div className="flex-1">
                      <div className="flex justify-between text-sm mb-1">
                        <span>Your progress</span>
                        <span>{progress}%</span>
                      </div>
                      <Progress value={progress} className="h-2" />
                    </div>
                    
                    <Button>Continue Learning</Button>
                  </>
                ) : (
                  <Button onClick={handleEnroll} disabled={enrollInCourseMutation.isPending}>
                    {enrollInCourseMutation.isPending ? 'Enrolling...' : 'Enroll Now'}
                  </Button>
                )}
              </div>
            </div>
            
            <div className="w-full md:w-1/3">
              <div className="bg-gray-100 rounded-lg p-4">
                <h3 className="font-medium">What you'll learn</h3>
                <ul className="mt-2 space-y-2">
                  <li className="flex items-start">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 mr-2" />
                    <span className="text-sm">HTML document structure and semantics</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 mr-2" />
                    <span className="text-sm">CSS styling and layout techniques</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 mr-2" />
                    <span className="text-sm">JavaScript fundamentals and DOM manipulation</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 mr-2" />
                    <span className="text-sm">Responsive design principles</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        
        {/* Course content */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="curriculum">Curriculum</TabsTrigger>
            <TabsTrigger value="lesson" disabled={!selectedLesson}>
              Current Lesson
            </TabsTrigger>
            <TabsTrigger value="discussion">Discussion</TabsTrigger>
          </TabsList>
          
          {/* Curriculum tab */}
          <TabsContent value="curriculum" className="space-y-6 pt-6">
            <div className="grid md:grid-cols-[3fr_1fr] gap-6">
              <div className="space-y-6">
                {courseData.modules.map((module) => (
                  <CourseModule
                    key={module.id}
                    title={module.title}
                    description={module.description}
                    lessons={module.lessons}
                    isActive={false}
                    onLessonSelect={handleLessonSelect}
                  />
                ))}
              </div>
              
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Course Resources</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <Button variant="outline" className="w-full justify-start">
                        <FileText className="mr-2 h-4 w-4" />
                        Course Slides
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        <FileText className="mr-2 h-4 w-4" />
                        Code Examples
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        <FileText className="mr-2 h-4 w-4" />
                        Exercise Files
                      </Button>
                    </div>
                  </CardContent>
                </Card>
                
                <ActivityFeed 
                  title="Learning Activity"
                  description="Your progress in this course"
                  filter={['course']}
                  maxItems={5}
                />
              </div>
            </div>
          </TabsContent>
          
          {/* Lesson tab */}
          <TabsContent value="lesson" className="space-y-6 pt-6">
            {selectedLesson && (
              <div className="grid md:grid-cols-[3fr_1fr] gap-6">
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>{selectedLesson.title}</CardTitle>
                      <CardDescription>
                        {selectedLesson.type === 'video' ? 'Video Lesson' : 
                         selectedLesson.type === 'reading' ? 'Reading Material' : 'Quiz'}
                        {' • '}{selectedLesson.duration}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="aspect-video bg-gray-100 rounded-md flex items-center justify-center mb-6">
                        {selectedLesson.type === 'video' ? (
                          <div className="text-center">
                            <Play className="h-12 w-12 text-gray-400 mx-auto" />
                            <p className="mt-2 text-gray-500">Video player would be displayed here</p>
                          </div>
                        ) : selectedLesson.type === 'reading' ? (
                          <div className="text-center">
                            <FileText className="h-12 w-12 text-gray-400 mx-auto" />
                            <p className="mt-2 text-gray-500">Reading material would be displayed here</p>
                          </div>
                        ) : (
                          <div className="text-center">
                            <MessageSquare className="h-12 w-12 text-gray-400 mx-auto" />
                            <p className="mt-2 text-gray-500">Quiz would be displayed here</p>
                          </div>
                        )}
                      </div>
                      
                      {/* Placeholder content */}
                      <div className="space-y-4">
                        <h3 className="text-lg font-medium">Lesson Content</h3>
                        <p className="text-gray-600">
                          This is where the main content of the lesson would be displayed.
                          This could include text explanations, code examples, images, and interactive elements.
                        </p>
                        <p className="text-gray-600">
                          For the purpose of this demo, we're showing a placeholder. In a real implementation,
                          this would contain the actual lesson content fetched from your API or content management system.
                        </p>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between border-t pt-6">
                      <Button variant="outline">Previous Lesson</Button>
                      <Button 
                        onClick={() => handleLessonComplete(selectedLesson.id)}
                        disabled={selectedLesson.isCompleted || updateCourseProgressMutation.isPending}
                      >
                        {selectedLesson.isCompleted ? 'Completed' : 
                         updateCourseProgressMutation.isPending ? 'Saving...' : 'Mark as Complete'}
                      </Button>
                    </CardFooter>
                  </Card>
                </div>
                
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Module Lessons</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {/* Find the module that contains the selected lesson */}
                        {courseData.modules.find(module => 
                          module.lessons.some(lesson => lesson.id === selectedLesson.id)
                        )?.lessons.map(lesson => (
                          <div 
                            key={lesson.id}
                            className={`
                              p-2 rounded-md text-sm cursor-pointer
                              ${lesson.id === selectedLesson.id ? 'bg-primary/10 border border-primary/50' : 'hover:bg-gray-100'}
                              ${lesson.isCompleted ? 'text-green-600' : ''}
                              ${lesson.isLocked ? 'opacity-50 cursor-not-allowed' : ''}
                            `}
                            onClick={() => !lesson.isLocked && handleLessonSelect(lesson.id)}
                          >
                            <div className="flex items-center">
                              {lesson.isCompleted ? (
                                <CheckCircle className="h-4 w-4 mr-2" />
                              ) : lesson.isLocked ? (
                                <Lock className="h-4 w-4 mr-2" />
                              ) : lesson.type === 'video' ? (
                                <Video className="h-4 w-4 mr-2" />
                              ) : lesson.type === 'reading' ? (
                                <FileText className="h-4 w-4 mr-2" />
                              ) : (
                                <MessageSquare className="h-4 w-4 mr-2" />
                              )}
                              <span>{lesson.title}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle>Your Progress</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Course completion</span>
                            <span>{progress}%</span>
                          </div>
                          <Progress value={progress} className="h-2" />
                        </div>
                        
                        <div className="pt-2">
                          <div className="flex justify-between text-sm">
                            <span>Lessons completed</span>
                            <span>{completedLessons}/{totalLessons}</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}
          </TabsContent>
          
          {/* Discussion tab */}
          <TabsContent value="discussion" className="space-y-6 pt-6">
            <Card>
              <CardHeader>
                <CardTitle>Course Discussion</CardTitle>
                <CardDescription>
                  Engage with other students and the instructor
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <MessageSquare className="h-12 w-12 mx-auto text-gray-400" />
                  <h3 className="font-medium mt-4">Join the discussion</h3>
                  <p className="text-gray-500 mt-2">
                    Ask questions, share insights, and connect with fellow learners
                  </p>
                  <Button className="mt-4">Start a Discussion</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default CourseDetailPage;