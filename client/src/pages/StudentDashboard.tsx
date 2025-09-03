import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  BookOpen, 
  Target, 
  Trophy, 
  Clock, 
  Star,
  ArrowRight,
  CheckCircle2,
  Play,
  Calendar,
  Users,
  MessageSquare,
  Zap,
  TrendingUp,
  Award,
  Brain,
  Code,
  Lightbulb,
  Heart,
  Flame,
  Gift,
  File
} from "lucide-react";
import { motion } from "framer-motion";

export default function StudentDashboard() {
  
  // Fetch dashboard metrics
  const { data: dashboardMetrics, isLoading: dashboardLoading } = useQuery({
    queryKey: ['/api/dashboard/metrics'],
  });

  // Fetch user progress
  const { data: progressData, isLoading: progressLoading } = useQuery({
    queryKey: ['/api/dashboard/progress'],
  });

  // Fetch user activity
  const { data: activityData, isLoading: activityLoading } = useQuery({
    queryKey: ['/api/dashboard/activity'],
  });

  // Fetch courses
  const { data: coursesData, isLoading: coursesLoading } = useQuery({
    queryKey: ['/api/courses'],
  });

  // Fetch projects
  const { data: projectsData, isLoading: projectsLoading } = useQuery({
    queryKey: ['/api/projects'],
  });

  // Fetch events
  const { data: eventsData, isLoading: eventsLoading } = useQuery({
    queryKey: ['/api/events'],
  });

  // Fetch achievements
  const { data: achievementsData, isLoading: achievementsLoading } = useQuery({
    queryKey: ['/api/achievements'],
  });

  // Fetch learning streak
  const { data: streakData, isLoading: streakLoading } = useQuery({
    queryKey: ['/api/courses/streak'],
  });

  const isLoading = dashboardLoading || progressLoading || activityLoading || 
                   coursesLoading || projectsLoading || eventsLoading || 
                   achievementsLoading || streakLoading;

  if (isLoading) {
    return (
      <Layout title="Student Dashboard">
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading your learning journey...</p>
          </div>
        </div>
      </Layout>
    );
  }

  // Extract data with safe defaults and proper typing
  const progress = progressData as any || {};
  const metrics = dashboardMetrics as any || {};
  const activity = Array.isArray(activityData) ? activityData : [];
  const courses = Array.isArray(coursesData) ? coursesData : [];
  const projects = Array.isArray(projectsData) ? projectsData : [];
  const events = Array.isArray(eventsData) ? eventsData : [];
  const achievements = Array.isArray(achievementsData) ? achievementsData : [];
  const streak = streakData as any || { currentStreak: 0, longestStreak: 0 };
  const activeStreak = streak.currentStreak || 0;

  return (
    <Layout title="Student Dashboard">
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        {/* Welcome Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-8">
          <div className="max-w-7xl mx-auto">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-between"
            >
              <div>
                <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Brain className="h-8 w-8 text-blue-600" />
                  </div>
                  Learning Journey
                </h1>
                <p className="text-gray-600 mt-2">
                  Welcome back! Ready to continue your path to becoming a Software Developer?
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-center">
                  <div className="flex items-center gap-1 text-orange-600">
                    <Flame className="h-5 w-5" />
                    <span className="text-2xl font-bold">{activeStreak}</span>
                  </div>
                  <div className="text-xs text-gray-500">Day Streak</div>
                </div>
                <Badge variant="secondary" className="bg-blue-100 text-blue-800 border-blue-200">
                  Active Learner
                </Badge>
              </div>
            </motion.div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Progress Overview */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
          >
            <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white border-0">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100">Overall Progress</p>
                    <p className="text-3xl font-bold">{progress.overallProgress || 0}%</p>
                  </div>
                  <Target className="h-10 w-10 text-blue-200" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white border-0">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-100">Courses Completed</p>
                    <p className="text-3xl font-bold">{progress.coursesCompleted || 0}</p>
                  </div>
                  <BookOpen className="h-10 w-10 text-green-200" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white border-0">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-100">Projects Built</p>
                    <p className="text-3xl font-bold">{progress.projectsCompleted || 0}</p>
                  </div>
                  <Code className="h-10 w-10 text-purple-200" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white border-0">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-orange-100">Achievements</p>
                    <p className="text-3xl font-bold">{achievements.length || 0}</p>
                  </div>
                  <Trophy className="h-10 w-10 text-orange-200" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Main Learning Dashboard */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Active Learning */}
            <div className="lg:col-span-2 space-y-6">
              {/* Current Learning Path */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Card className="shadow-lg border-0">
                  <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg">
                    <CardTitle className="flex items-center gap-2">
                      <Target className="h-5 w-5" />
                      Your Learning Roadmap
                    </CardTitle>
                    <CardDescription className="text-blue-100">
                      Continue your journey to become a Software Developer
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-6">
                    {/* Career Path Progress */}
                    <div className="mb-6">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Career Progress</span>
                        <span className="text-sm font-bold text-blue-600">{progress.overallProgress || 0}%</span>
                      </div>
                      <Progress value={progress.overallProgress || 0} className="h-3" />
                      <div className="text-xs text-gray-500 mt-1">Development Phase</div>
                    </div>

                    {/* Learning Milestones */}
                    {/* <div className="space-y-4">
                      <h4 className="font-semibold text-gray-900">Current Milestones</h4>
                      {(courses.slice(0, 2).map((course: any, index: number) => ({
                        title: course.title,
                        progress: Math.round(Math.random() * 100), // Will be replaced with real progress
                        status: "in_progress",
                        type: "course",
                        id: course.id
                      })).concat(
                        projects.slice(0, 1).map((project: any, index: number) => ({
                          title: project.title,
                          progress: Math.round(Math.random() * 100), // Will be replaced with real progress
                          status: "in_progress", 
                          type: "project",
                          id: project.id
                        }))
                      )).map((milestone, index) => (
                        <div key={index} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                          <div className={`p-2 rounded-lg ${
                            milestone.type === 'course' ? 'bg-blue-100' : 'bg-purple-100'
                          }`}>
                            {milestone.type === 'course' ? (
                              <BookOpen className={`h-4 w-4 ${
                                milestone.type === 'course' ? 'text-blue-600' : 'text-purple-600'
                              }`} />
                            ) : (
                              <Code className="h-4 w-4 text-purple-600" />
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <h5 className="font-medium text-gray-900">{milestone.title}</h5>
                              <Badge variant={
                                milestone.status === 'in_progress' ? 'default' : 'secondary'
                              }>
                                {milestone.status.replace('_', ' ')}
                              </Badge>
                            </div>
                            {milestone.progress > 0 && (
                              <div className="mt-2">
                                <Progress value={milestone.progress} className="h-2" />
                                <div className="text-xs text-gray-500 mt-1">{milestone.progress}% complete</div>
                              </div>
                            )}
                          </div>
                          <Button size="sm" variant={milestone.status === 'in_progress' ? 'default' : 'outline'}>
                            {milestone.status === 'in_progress' ? 'Continue' : 'Start'}
                          </Button>
                        </div>
                      ))}
                    </div> */}

                    <div className="mt-6 pt-4 border-t border-gray-200">
                      <Link href="/career-roadmap">
                        <Button className="w-full">
                          <Target className="h-4 w-4 mr-2" />
                          View Full Learning Path
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Today's Learning - Hidden for now */}
              {false && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Card className="shadow-lg border-0">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Lightbulb className="h-5 w-5 text-yellow-600" />
                      Today's Learning Focus
                    </CardTitle>
                    <CardDescription>
                      Recommended activities to keep your momentum going
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Daily Byte */}
                      <div className="p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border border-yellow-200">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="p-2 bg-yellow-100 rounded-lg">
                            <Zap className="h-4 w-4 text-yellow-600" />
                          </div>
                          <div>
                            <h5 className="font-medium text-gray-900">Daily Learning Byte</h5>
                            <p className="text-xs text-gray-600">5 min read</p>
                          </div>
                        </div>
                        <p className="text-sm text-gray-700 mb-3">
                          "Understanding React Hooks: useEffect Best Practices"
                        </p>
                        <Button size="sm" className="w-full bg-yellow-600 hover:bg-yellow-700">
                          Read Now
                        </Button>
                      </div>

                      {/* Practice Challenge */}
                      <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="p-2 bg-green-100 rounded-lg">
                            <Code className="h-4 w-4 text-green-600" />
                          </div>
                          <div>
                            <h5 className="font-medium text-gray-900">Coding Challenge</h5>
                            <p className="text-xs text-gray-600">15 min challenge</p>
                          </div>
                        </div>
                        <p className="text-sm text-gray-700 mb-3">
                          "Build a simple counter component with hooks"
                        </p>
                        <Button size="sm" variant="outline" className="w-full border-green-600 text-green-700 hover:bg-green-50">
                          Start Challenge
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
              )}

              {/* Recent Activity - Hidden for now */}
              {false && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Card className="shadow-lg border-0">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Clock className="h-5 w-5 text-blue-600" />
                      Recent Learning Activity
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="space-y-3">
                      {[
                        {
                          action: "Completed lesson",
                          item: "React Component Lifecycle",
                          time: "2 hours ago",
                          type: "course",
                          xp: 25
                        },
                        {
                          action: "Submitted project",
                          item: "Todo App with React",
                          time: "1 day ago", 
                          type: "project",
                          xp: 100
                        },
                        {
                          action: "Earned achievement",
                          item: "React Fundamentals Master",
                          time: "2 days ago",
                          type: "achievement",
                          xp: 50
                        }
                      ].map((activity, index) => (
                        <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                          <div className={`p-2 rounded-lg ${
                            activity.type === 'course' ? 'bg-blue-100' :
                            activity.type === 'project' ? 'bg-purple-100' : 'bg-yellow-100'
                          }`}>
                            {activity.type === 'course' ? (
                              <BookOpen className="h-4 w-4 text-blue-600" />
                            ) : activity.type === 'project' ? (
                              <Code className="h-4 w-4 text-purple-600" />
                            ) : (
                              <Trophy className="h-4 w-4 text-yellow-600" />
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-sm font-medium text-gray-900">
                                  {activity.action}: {activity.item}
                                </p>
                                <p className="text-xs text-gray-500">{activity.time}</p>
                              </div>
                              <div className="text-right">
                                <div className="text-sm font-bold text-green-600">+{activity.xp} XP</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
              )}
            </div>

            {/* Right Column - Stats & Quick Actions */}
            <div className="space-y-6">
              {/* Learning Stats - Hidden for now */}
              {false && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Card className="shadow-lg border-0">
                  <CardHeader className="bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-t-lg">
                    <CardTitle className="text-base">Learning Statistics</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Weekly Goal</span>
                        <span className="font-semibold">12/15 hours</span>
                      </div>
                      <Progress value={80} className="h-3" />
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Skill Progress</span>
                        <span className="font-semibold">Advanced</span>
                      </div>
                      <Progress value={75} className="h-3" />
                    </div>

                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Course Completion</span>
                        <span className="font-semibold">8/12</span>
                      </div>
                      <Progress value={67} className="h-3" />
                    </div>

                    <div className="pt-2 border-t border-gray-200 text-center">
                      <div className="text-2xl font-bold text-blue-600">Level 7</div>
                      <div className="text-xs text-gray-500">2,450 / 3,000 XP</div>
                      <Progress value={82} className="h-2 mt-1" />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
              )}

              {/* Quick Actions */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Card className="shadow-lg border-0">
                  <CardHeader>
                    <CardTitle className="text-base">Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 space-y-3">
                    <Link href="/career-guide" className="block">
                      <Button variant="outline" size="sm" className="w-full justify-start">
                        <Brain className="h-4 w-4 mr-2" />
                        Ask AI Coach
                      </Button>
                    </Link>
                    <Link href="/community" className="block">
                      <Button variant="outline" size="sm" className="w-full justify-start">
                        <Users className="h-4 w-4 mr-2" />
                        Events, Workshops & Webinars
                      </Button>
                    </Link>
                    <Link href="/resume-builder" className="block">
                      <Button variant="outline" size="sm" className="w-full justify-start">
                        <File className="h-4 w-4 mr-2" />
                        Build Resume
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Achievements - Hidden for now */}
              {false && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Card className="shadow-lg border-0">
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <Trophy className="h-4 w-4 text-yellow-600" />
                      Recent Achievements
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 space-y-3">
                    {[
                      { name: "React Master", description: "Completed all React courses", date: "Today", icon: "🚀" },
                      { name: "Code Warrior", description: "Built 5 projects", date: "2 days ago", icon: "⚔️" },
                      { name: "Learning Streak", description: "7 days in a row", date: "Today", icon: "🔥" }
                    ].map((achievement, index) => (
                      <div key={index} className="flex items-center gap-3 p-2 bg-yellow-50 rounded-lg border border-yellow-200">
                        <span className="text-lg">{achievement.icon}</span>
                        <div className="flex-1">
                          <div className="text-sm font-medium">{achievement.name}</div>
                          <div className="text-xs text-gray-500">{achievement.description}</div>
                          <div className="text-xs text-gray-400">{achievement.date}</div>
                        </div>
                      </div>
                    ))}
                    
                    <Link href="/achievements" className="block mt-3">
                      <Button variant="outline" size="sm" className="w-full">
                        View All Achievements
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </motion.div>
              )}

              {/* Motivational Quote */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
              >
                <Card className="shadow-lg border-0 bg-gradient-to-r from-pink-50 to-purple-50 border-pink-200">
                  <CardContent className="p-4 text-center">
                    <Heart className="h-8 w-8 text-pink-500 mx-auto mb-3" />
                    <blockquote className="text-sm italic text-gray-700 mb-2">
                      "The expert in anything was once a beginner."
                    </blockquote>
                    <div className="text-xs text-gray-500">- Helen Hayes</div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}