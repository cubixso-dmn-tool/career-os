import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BookOpen, 
  GitBranch, 
  Target, 
  Star, 
  Clock, 
  Users, 
  Award,
  Zap,
  Bot,
  ArrowRight,
  Play,
  CheckCircle2,
  Loader2,
  TrendingUp
} from "lucide-react";
import { motion } from "framer-motion";

export default function Learning() {
  const [activeTab, setActiveTab] = useState("roadmap");
  
  // Get career path from AI Career Guide or fallback
  const selectedCareerPath = localStorage.getItem('selectedCareerPath') || 'Software Developer';
  
  // Fetch current learning resources based on career path
  const { data: currentLearningResources, isLoading: isLearningLoading } = useQuery({
    queryKey: [`/api/learning-resources/${encodeURIComponent(selectedCareerPath)}/advanced-development`],
    queryFn: async ({ queryKey }) => {
      try {
        const response = await fetch(queryKey[0] as string, {
          credentials: "include",
        });
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }
        
        const data = await response.json();
        return data;
      } catch (error) {
        console.error("Learning resources fetch error:", error);
        throw error;
      }
    },
  });

  // Fetch complete learning path
  const { data: completeLearningPath, isLoading: isPathLoading } = useQuery({
    queryKey: [`/api/learning-resources/${encodeURIComponent(selectedCareerPath)}/complete-path`],
    queryFn: async ({ queryKey }) => {
      try {
        const response = await fetch(queryKey[0] as string, {
          credentials: "include",
        });
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }
        
        const data = await response.json();
        return data;
      } catch (error) {
        console.error("Complete learning path fetch error:", error);
        // Return fallback data structure
        return {
          success: true,
          data: {
            career: selectedCareerPath,
            phases: [
              {
                phaseKey: "programming-fundamentals",
                phase: "Programming Fundamentals",
                description: "Master core programming concepts and basic development tools",
                coursesCount: 3,
                projectsCount: 3
              },
              {
                phaseKey: "framework-tools-mastery", 
                phase: "Framework & Tools Mastery",
                description: "Learn frameworks, libraries, and development tools",
                coursesCount: 3,
                projectsCount: 3
              },
              {
                phaseKey: "advanced-development",
                phase: "Advanced Development", 
                description: "Dive into advanced concepts and specialization areas",
                coursesCount: 3,
                projectsCount: 3
              },
              {
                phaseKey: "professional-readiness",
                phase: "Professional Readiness",
                description: "Prepare for the job market and career advancement", 
                coursesCount: 3,
                projectsCount: 3
              }
            ],
            totalCourses: 12,
            totalProjects: 12
          }
        };
      }
    },
  });

  if (isLearningLoading || isPathLoading) {
    return (
      <Layout title="Learning">
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
            <p className="mt-4 text-gray-600">Loading your learning resources...</p>
          </div>
        </div>
      </Layout>
    );
  }

  const learningResources = currentLearningResources?.data;
  const learningPath = completeLearningPath?.data;

  return (
    <Layout title="Learning">
      <div className="px-4 py-6 md:px-8 pb-20 md:pb-6">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <BookOpen className="h-8 w-8 text-primary" />
                Learning Journey
              </h1>
              <p className="text-gray-600 mt-2">
                Courses and projects aligned with your {selectedCareerPath} roadmap
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-purple-600">65%</div>
              <div className="text-sm text-gray-500">Overall Progress</div>
            </div>
          </div>

          {/* Progress Overview */}
          <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span>Current Phase: Advanced Development</span>
                    <span className="font-medium">65%</span>
                  </div>
                  <Progress value={65} className="h-3" />
                </div>
                <Link href="/career-roadmap">
                  <Button variant="outline" size="sm">
                    <Target className="h-4 w-4 mr-2" />
                    View Roadmap
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="roadmap" className="flex items-center gap-2">
              <Target className="h-4 w-4" />
              Roadmap
            </TabsTrigger>
            <TabsTrigger value="current" className="flex items-center gap-2">
              <Zap className="h-4 w-4" />
              Current Phase
            </TabsTrigger>
            <TabsTrigger value="all-courses" className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              All Courses
            </TabsTrigger>
            <TabsTrigger value="all-projects" className="flex items-center gap-2">
              <GitBranch className="h-4 w-4" />
              All Projects
            </TabsTrigger>
          </TabsList>

          {/* Roadmap Overview Tab */}
          <TabsContent value="roadmap" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {learningPath?.phases?.map((phase: any, index: number) => (
                <motion.div
                  key={phase.phaseKey}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className={`hover:shadow-lg transition-shadow ${
                    phase.phase === "Advanced Development" ? "ring-2 ring-purple-500 bg-purple-50" : ""
                  }`}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center gap-2">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                            index === 0 ? "bg-green-500" : 
                            index === 1 ? "bg-green-500" : 
                            index === 2 ? "bg-purple-500" : "bg-gray-400"
                          }`}>
                            {index + 1}
                          </div>
                          {phase.phase}
                        </CardTitle>
                        {phase.phase === "Advanced Development" && (
                          <Badge variant="default" className="bg-purple-600">Current</Badge>
                        )}
                      </div>
                      <CardDescription>{phase.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className="text-center p-3 bg-blue-50 rounded-lg">
                          <div className="text-2xl font-bold text-blue-600">{phase.coursesCount}</div>
                          <div className="text-sm text-blue-600">Courses</div>
                        </div>
                        <div className="text-center p-3 bg-green-50 rounded-lg">
                          <div className="text-2xl font-bold text-green-600">{phase.projectsCount}</div>
                          <div className="text-sm text-green-600">Projects</div>
                        </div>
                      </div>
                      <Link href={`/learning?phase=${phase.phaseKey}`}>
                        <Button 
                          variant={phase.phase === "Advanced Development" ? "default" : "outline"} 
                          className="w-full"
                          onClick={() => setActiveTab("current")}
                        >
                          {phase.phase === "Advanced Development" ? "Continue Learning" : "View Phase"}
                          <ArrowRight className="h-4 w-4 ml-2" />
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Learning Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Learning Statistics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">{learningPath?.totalCourses || 12}</div>
                    <div className="text-sm text-purple-600">Total Courses</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">{learningPath?.totalProjects || 12}</div>
                    <div className="text-sm text-green-600">Total Projects</div>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">8</div>
                    <div className="text-sm text-blue-600">Completed</div>
                  </div>
                  <div className="text-center p-4 bg-orange-50 rounded-lg">
                    <div className="text-2xl font-bold text-orange-600">16</div>
                    <div className="text-sm text-orange-600">In Progress</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Current Phase Tab */}
          <TabsContent value="current" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Current Phase Resources */}
              <div className="lg:col-span-2 space-y-6">
                {/* Phase Courses */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BookOpen className="h-5 w-5" />
                      Recommended Courses
                    </CardTitle>
                    <CardDescription>
                      Courses for {learningResources?.phase || "Advanced Development"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {learningResources?.courses?.map((course: any, index: number) => (
                      <div key={course.id} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <h5 className="font-medium text-sm mb-1">{course.title}</h5>
                            <div className="flex items-center gap-2 text-xs text-gray-600 mb-2">
                              <span>{course.provider}</span>
                              <span>•</span>
                              <span>{course.duration}</span>
                              <span>•</span>
                              <Badge variant="outline" className="text-xs">
                                {course.level}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-4 text-xs text-gray-500">
                              <div className="flex items-center gap-1">
                                <Star className="h-3 w-3 text-yellow-500 fill-current" />
                                <span>{course.rating}</span>
                              </div>
                              <span>{course.students} students</span>
                              <span className="font-medium text-purple-600">{course.price}</span>
                            </div>
                          </div>
                        </div>
                        
                        {course.progress > 0 ? (
                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-xs">
                              <span>Progress: {course.progress}%</span>
                              <span className="text-purple-600">Next: {course.nextLesson}</span>
                            </div>
                            <Progress value={course.progress} className="h-2" />
                            <Button size="sm" className="w-full mt-2">
                              Continue Learning
                            </Button>
                          </div>
                        ) : (
                          <Button size="sm" className="w-full mt-2" variant="outline">
                            Start Course
                          </Button>
                        )}
                      </div>
                    )) || (
                      <div className="text-center py-8 text-gray-500">
                        <BookOpen className="h-8 w-8 mx-auto mb-2 opacity-50" />
                        <p>No courses found for this phase</p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Phase Projects */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <GitBranch className="h-5 w-5" />
                      Hands-on Projects
                    </CardTitle>
                    <CardDescription>
                      Build real-world projects to solidify your skills
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {learningResources?.projects?.map((project: any, index: number) => (
                      <div key={project.id} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h5 className="font-medium text-sm">{project.title}</h5>
                              <Badge variant="secondary" className="text-xs">
                                {project.difficulty}
                              </Badge>
                            </div>
                            <p className="text-xs text-gray-600 mb-2">{project.description}</p>
                            <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                              <Clock className="h-3 w-3" />
                              <span>{project.duration}</span>
                            </div>
                            <div className="flex flex-wrap gap-1 mb-2">
                              {project.tech?.map((tech: string, techIndex: number) => (
                                <Badge key={techIndex} variant="outline" className="text-xs">
                                  {tech}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                        
                        <Button size="sm" className="w-full mt-2" variant="outline">
                          Start Project
                        </Button>
                      </div>
                    )) || (
                      <div className="text-center py-8 text-gray-500">
                        <GitBranch className="h-8 w-8 mx-auto mb-2 opacity-50" />
                        <p>No projects found for this phase</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Quick Actions */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Link href="/ai-career-coach" className="block">
                      <Button variant="outline" size="sm" className="w-full justify-start">
                        <Bot className="h-4 w-4 mr-2" />
                        AI Career Coach
                      </Button>
                    </Link>
                    <Link href="/career-roadmap" className="block">
                      <Button variant="outline" size="sm" className="w-full justify-start">
                        <Target className="h-4 w-4 mr-2" />
                        Career Roadmap
                      </Button>
                    </Link>
                    <Link href="/achievements" className="block">
                      <Button variant="outline" size="sm" className="w-full justify-start">
                        <Award className="h-4 w-4 mr-2" />
                        Achievements
                      </Button>
                    </Link>
                  </CardContent>
                </Card>

                {/* Recent Achievements */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <Award className="h-4 w-4" />
                      Recent Achievements
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {[
                      { name: "Course Completionist", description: "Completed 5 courses", date: "2 days ago", icon: "🎓" },
                      { name: "Code Warrior", description: "Built 10 projects", date: "1 week ago", icon: "⚔️" },
                      { name: "Learning Streak", description: "7 days in a row", date: "Today", icon: "🔥" }
                    ].map((achievement, index) => (
                      <div key={index} className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
                        <span className="text-lg">{achievement.icon}</span>
                        <div className="flex-1">
                          <div className="text-sm font-medium">{achievement.name}</div>
                          <div className="text-xs text-gray-500">{achievement.description}</div>
                          <div className="text-xs text-gray-400">{achievement.date}</div>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* All Courses Tab */}
          <TabsContent value="all-courses" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>All Courses</CardTitle>
                <CardDescription>
                  Browse all courses across different learning phases
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-gray-500">
                  <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p className="text-lg mb-2">Comprehensive Course Catalog</p>
                  <p className="text-sm mb-4">Coming soon - browse all available courses</p>
                  <Button onClick={() => setActiveTab("current")}>
                    View Current Phase Courses
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* All Projects Tab */}
          <TabsContent value="all-projects" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>All Projects</CardTitle>
                <CardDescription>
                  Browse all hands-on projects across different learning phases
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-gray-500">
                  <GitBranch className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p className="text-lg mb-2">Project Portfolio Builder</p>
                  <p className="text-sm mb-4">Coming soon - browse all available projects</p>
                  <Button onClick={() => setActiveTab("current")}>
                    View Current Phase Projects
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}