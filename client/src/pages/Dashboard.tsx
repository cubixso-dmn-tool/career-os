import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import Layout from "@/components/layout/Layout";
import MobileNavigation from "@/components/layout/MobileNavigation";
import Header from "@/components/ui/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Loader2, 
  TrendingUp, 
  Target, 
  BookOpen, 
  Users, 
  Calendar, 
  Award, 
  Zap,
  ArrowRight,
  Play,
  Bot,
  FileText,
  MessageSquare,
  GitBranch,
  Star,
  Clock,
  CheckCircle2,
  AlertCircle,
  PlusCircle,
  Eye,
  Heart,
  MessageCircle
} from "lucide-react";
import { motion } from "framer-motion";

// Mock user ID until authentication is implemented
const USER_ID = 1;

export default function Dashboard() {
  // Add debugging
  useEffect(() => {
    const testFetch = async () => {
      try {
        console.log("Attempting to fetch dashboard data...");
        const response = await fetch(`/api/users/${USER_ID}/dashboard`);
        console.log("Dashboard fetch response status:", response.status);
        if (!response.ok) {
          console.error("Dashboard fetch error:", await response.text());
        } else {
          console.log("Dashboard data received successfully");
        }
      } catch (error) {
        console.error("Dashboard fetch exception:", error);
      }
    };
    
    testFetch();
  }, []);

  // Fetch dashboard data
  const { data: dashboardData, isLoading, error } = useQuery({
    queryKey: [`/api/users/${USER_ID}/dashboard`],
    queryFn: async ({ queryKey }) => {
      try {
        console.log("TanStack Query attempting to fetch:", queryKey[0]);
        const response = await fetch(queryKey[0] as string, {
          credentials: "include",
        });
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error("Fetch error response:", errorText);
          throw new Error(`HTTP ${response.status}: ${errorText}`);
        }
        
        const data = await response.json();
        console.log("Dashboard data received:", data);
        return data;
      } catch (error) {
        console.error("TanStack Query exception:", error);
        throw error;
      }
    },
  });

  if (isLoading) {
    return (
      <Layout title="Dashboard">
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
            <p className="mt-4 text-gray-600">Loading your dashboard...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout title="Dashboard">
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-red-600 mb-2">Error Loading Dashboard</h2>
            <p className="text-gray-600 mb-4">We encountered an issue while loading your dashboard data.</p>
            <Button className="bg-primary">Retry</Button>
          </div>
        </div>
      </Layout>
    );
  }

  const { 
    user, 
    progress, 
    careerPath, 
    achievements,
    recommendedCourses,
    recommendedProject,
    upcomingEvents,
    communityPosts,
    dailyByte,
    dailyByteStreak
  } = dashboardData || {};

  // Quick actions for easy access
  const quickActions = [
    {
      title: "AI Career Coach",
      description: "Get personalized career guidance",
      icon: <Bot className="h-6 w-6" />,
      href: "/ai-career-coach",
      color: "from-blue-500 to-purple-600",
      badge: "AI Powered"
    },
    {
      title: "Expert Network",
      description: "Connect with industry leaders",
      icon: <Users className="h-6 w-6" />,
      href: "/industry-experts",
      color: "from-purple-500 to-pink-600",
      badge: "Live Sessions"
    },
    {
      title: "Career Assessment",
      description: "Discover your ideal career path",
      icon: <Target className="h-6 w-6" />,
      href: "/career-guide",
      color: "from-green-500 to-blue-600",
      badge: "Personalized"
    },
    {
      title: "Browse Courses",
      description: "Explore learning opportunities",
      icon: <BookOpen className="h-6 w-6" />,
      href: "/courses",
      color: "from-orange-500 to-red-600",
      badge: "300+ Courses"
    }
  ];

  // Current progress overview
  const progressStats = [
    {
      label: "Career Assessment",
      completed: progress?.careerAssessment || false,
      icon: <CheckCircle2 className="h-5 w-5" />,
      color: "text-green-600"
    },
    {
      label: "Courses Completed",
      completed: `${progress?.coreCourses?.completed || 0}/${progress?.coreCourses?.total || 5}`,
      icon: <BookOpen className="h-5 w-5" />,
      color: "text-blue-600"
    },
    {
      label: "Projects Built",
      completed: `${progress?.projects?.completed || 0}/${progress?.projects?.total || 2}`,
      icon: <GitBranch className="h-5 w-5" />,
      color: "text-purple-600"
    },
    {
      label: "Overall Progress",
      completed: `${progress?.percentage || 70}%`,
      icon: <TrendingUp className="h-5 w-5" />,
      color: "text-orange-600"
    }
  ];

  // Sample data for demonstration
  const todayHighlights = [
    {
      type: "session",
      title: "Product Management Q&A with Zomato VP",
      time: "2:00 PM",
      icon: <Users className="h-4 w-4" />,
      action: "Join Session"
    },
    {
      type: "course",
      title: "Complete React Fundamentals Module 3",
      time: "Due today",
      icon: <BookOpen className="h-4 w-4" />,
      action: "Continue Learning"
    },
    {
      type: "interview",
      title: "Mock Interview Practice Scheduled",
      time: "4:30 PM",
      icon: <Bot className="h-4 w-4" />,
      action: "Start Practice"
    }
  ];

  const recentActivity = [
    {
      type: "achievement",
      content: "Earned 'Course Completion' badge",
      time: "2 hours ago",
      icon: <Award className="h-4 w-4 text-yellow-600" />
    },
    {
      type: "community",
      content: "Commented on 'Career Transition Tips'",
      time: "5 hours ago",
      icon: <MessageCircle className="h-4 w-4 text-blue-600" />
    },
    {
      type: "course",
      content: "Started 'Advanced JavaScript' course",
      time: "1 day ago",
      icon: <Play className="h-4 w-4 text-green-600" />
    }
  ];

  const upcomingSessions = [
    {
      title: "Breaking into Tech: Google Engineer's Journey",
      expert: "Priya Sharma",
      company: "Google",
      time: "Tomorrow, 6:30 PM",
      attendees: 67,
      type: "lecture"
    },
    {
      title: "Product Management Workshop",
      expert: "Rahul Gupta",
      company: "Zomato",
      time: "Jan 18, 7:00 PM",
      attendees: 32,
      type: "workshop"
    }
  ];

  return (
    <>
      <Layout title="Dashboard">
        {/* Welcome Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Welcome back, {user?.name?.split(' ')[0] || 'Ananya'}! 👋
              </h1>
              <p className="text-gray-600 mt-1">
                Ready to take the next step in your career journey?
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-purple-600">{progress?.percentage || 70}%</div>
              <div className="text-sm text-gray-500">Profile Complete</div>
            </div>
          </div>

          {/* Overall Progress Bar */}
          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-gray-900">Your Progress</h3>
              <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                Level {Math.floor((progress?.percentage || 70) / 25) + 1}
              </Badge>
            </div>
            <Progress value={progress?.percentage || 70} className="h-3 mb-4" />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {progressStats.map((stat, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className={stat.color}>{stat.icon}</div>
                  <div>
                    <div className="text-sm font-medium">{stat.completed}</div>
                    <div className="text-xs text-gray-500">{stat.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Quick Actions Grid */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          {quickActions.map((action, index) => (
            <Link key={index} href={action.href}>
              <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer border-0 bg-gradient-to-br from-white to-gray-50">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 rounded-full bg-gradient-to-r ${action.color} text-white group-hover:scale-110 transition-transform duration-300`}>
                      {action.icon}
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {action.badge}
                    </Badge>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">{action.title}</h3>
                  <p className="text-sm text-gray-600 mb-3">{action.description}</p>
                  <div className="flex items-center text-sm font-medium text-purple-600 group-hover:text-purple-700">
                    Get Started <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </motion.div>

        {/* Main Content Tabs */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Tabs defaultValue="today" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="today" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Today
              </TabsTrigger>
              <TabsTrigger value="learning" className="flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                Learning
              </TabsTrigger>
              <TabsTrigger value="community" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Community
              </TabsTrigger>
              <TabsTrigger value="career" className="flex items-center gap-2">
                <Target className="h-4 w-4" />
                Career
              </TabsTrigger>
            </TabsList>

            <TabsContent value="today" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Today's Schedule */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Clock className="h-5 w-5" />
                      Today's Schedule
                    </CardTitle>
                    <CardDescription>Your activities for today</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {todayHighlights.map((item, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-white rounded-full shadow-sm">
                            {item.icon}
                          </div>
                          <div>
                            <div className="font-medium text-sm">{item.title}</div>
                            <div className="text-xs text-gray-500">{item.time}</div>
                          </div>
                        </div>
                        <Link href={item.type === 'session' ? '/industry-experts' : item.type === 'course' ? '/courses' : '/ai-career-coach'}>
                          <Button size="sm" variant="outline">
                            {item.action}
                          </Button>
                        </Link>
                      </div>
                    ))}
                    {todayHighlights.length === 0 && (
                      <div className="text-center py-8 text-gray-500">
                        <Calendar className="h-8 w-8 mx-auto mb-2 opacity-50" />
                        <p>No activities scheduled for today</p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Recent Activity */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Zap className="h-5 w-5" />
                      Recent Activity
                    </CardTitle>
                    <CardDescription>Your latest interactions</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {recentActivity.map((activity, index) => (
                      <div key={index} className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                        {activity.icon}
                        <div className="flex-1">
                          <div className="text-sm font-medium">{activity.content}</div>
                          <div className="text-xs text-gray-500">{activity.time}</div>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>

              {/* Upcoming Expert Sessions */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Users className="h-5 w-5" />
                      Upcoming Expert Sessions
                    </div>
                    <Link href="/industry-experts">
                      <Button variant="outline" size="sm">View All</Button>
                    </Link>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {upcomingSessions.map((session, index) => (
                      <div key={index} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between mb-3">
                          <h4 className="font-medium text-sm line-clamp-2">{session.title}</h4>
                          <Badge variant={session.type === 'workshop' ? 'secondary' : 'outline'} className="text-xs">
                            {session.type}
                          </Badge>
                        </div>
                        <div className="text-sm text-gray-600 mb-2">
                          with {session.expert} from {session.company}
                        </div>
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span>{session.time}</span>
                          <span>{session.attendees} registered</span>
                        </div>
                        <Link href="/industry-experts">
                          <Button size="sm" className="w-full mt-3">Register</Button>
                        </Link>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="learning" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recommended Courses */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BookOpen className="h-5 w-5" />
                      Recommended for You
                    </CardTitle>
                    <CardDescription>Courses tailored to your career path</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {(recommendedCourses || [
                      { id: 1, title: "Advanced React Development", progress: 65, instructor: "Sarah Wilson", rating: 4.8 },
                      { id: 2, title: "System Design Fundamentals", progress: 0, instructor: "Mike Chen", rating: 4.9 },
                      { id: 3, title: "Data Structures & Algorithms", progress: 30, instructor: "Alex Kumar", rating: 4.7 }
                    ]).slice(0, 3).map((course: any, index: number) => (
                      <div key={index} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-sm">{course.title}</h4>
                          <div className="flex items-center gap-1">
                            <Star className="h-3 w-3 text-yellow-500 fill-current" />
                            <span className="text-xs">{course.rating}</span>
                          </div>
                        </div>
                        <p className="text-xs text-gray-600 mb-3">by {course.instructor}</p>
                        {course.progress > 0 ? (
                          <div className="mb-3">
                            <div className="flex justify-between text-xs mb-1">
                              <span>Progress</span>
                              <span>{course.progress}%</span>
                            </div>
                            <Progress value={course.progress} className="h-2" />
                          </div>
                        ) : null}
                        <Link href="/courses">
                          <Button size="sm" className="w-full">
                            {course.progress > 0 ? 'Continue' : 'Start Course'}
                          </Button>
                        </Link>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Daily Learning Byte */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Zap className="h-5 w-5" />
                      Daily Learning Byte
                    </CardTitle>
                    <CardDescription>
                      Streak: {dailyByteStreak || 5} days 🔥
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
                      <h4 className="font-medium mb-2">
                        {dailyByte?.title || "What is the difference between let, const, and var in JavaScript?"}
                      </h4>
                      <p className="text-sm text-gray-600 mb-4">
                        {dailyByte?.content || "Learn about variable declarations and their scoping rules in modern JavaScript development."}
                      </p>
                      <Link href="/courses">
                        <Button size="sm">
                          Take Today's Challenge
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="community" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Community Posts */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MessageSquare className="h-5 w-5" />
                      Latest Discussions
                    </CardTitle>
                    <CardDescription>What the community is talking about</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {(communityPosts || [
                      { id: 1, title: "Tips for Technical Interviews at FAANG", author: "Priya S.", likes: 42, comments: 18, timeAgo: "2 hours ago" },
                      { id: 2, title: "My Journey from Support to Product Manager", author: "Rahul K.", likes: 38, comments: 12, timeAgo: "5 hours ago" },
                      { id: 3, title: "Best Resources for Learning System Design", author: "Anjali M.", likes: 55, comments: 24, timeAgo: "1 day ago" }
                    ]).slice(0, 3).map((post: any, index: number) => (
                      <div key={index} className="p-4 border rounded-lg hover:shadow-md transition-shadow cursor-pointer">
                        <h4 className="font-medium text-sm mb-2 line-clamp-2">{post.title}</h4>
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span>by {post.author}</span>
                          <span>{post.timeAgo}</span>
                        </div>
                        <div className="flex items-center gap-4 mt-3 text-xs text-gray-600">
                          <div className="flex items-center gap-1">
                            <Heart className="h-3 w-3" />
                            {post.likes}
                          </div>
                          <div className="flex items-center gap-1">
                            <MessageCircle className="h-3 w-3" />
                            {post.comments}
                          </div>
                        </div>
                      </div>
                    ))}
                    <Link href="/community">
                      <Button variant="outline" className="w-full">
                        <PlusCircle className="h-4 w-4 mr-2" />
                        Start a Discussion
                      </Button>
                    </Link>
                  </CardContent>
                </Card>

                {/* Your Achievements */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Award className="h-5 w-5" />
                      Your Achievements
                    </CardTitle>
                    <CardDescription>Milestones you've unlocked</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {(achievements || [
                      { name: "First Course Completed", description: "Completed your first course", earned: true, icon: "🎓" },
                      { name: "Community Contributor", description: "Made 5 helpful posts", earned: true, icon: "💬" },
                      { name: "Interview Ready", description: "Completed mock interview", earned: false, icon: "🎯" },
                      { name: "Project Builder", description: "Built 3 projects", earned: false, icon: "🚀" }
                    ]).map((achievement: any, index: number) => (
                      <div key={index} className={`p-3 rounded-lg border ${achievement.earned ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'}`}>
                        <div className="flex items-center gap-3">
                          <div className="text-2xl">{achievement.icon}</div>
                          <div className="flex-1">
                            <h4 className={`font-medium text-sm ${achievement.earned ? 'text-green-800' : 'text-gray-500'}`}>
                              {achievement.name}
                            </h4>
                            <p className={`text-xs ${achievement.earned ? 'text-green-600' : 'text-gray-500'}`}>
                              {achievement.description}
                            </p>
                          </div>
                          {achievement.earned && (
                            <CheckCircle2 className="h-5 w-5 text-green-600" />
                          )}
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="career" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Career Path Progress */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="h-5 w-5" />
                      Career Path: {careerPath?.title || "Full Stack Developer"}
                    </CardTitle>
                    <CardDescription>Your personalized roadmap to success</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-green-600" />
                          <span className="text-sm">Frontend Fundamentals</span>
                        </div>
                        <Badge variant="secondary" className="bg-green-100 text-green-800">Complete</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="h-4 w-4 rounded-full bg-blue-600 flex items-center justify-center">
                            <div className="h-2 w-2 bg-white rounded-full"></div>
                          </div>
                          <span className="text-sm font-medium">Backend Development</span>
                        </div>
                        <Badge variant="secondary" className="bg-blue-100 text-blue-800">In Progress</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="h-4 w-4 rounded-full border-2 border-gray-300"></div>
                          <span className="text-sm text-gray-500">Database Design</span>
                        </div>
                        <Badge variant="outline">Upcoming</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="h-4 w-4 rounded-full border-2 border-gray-300"></div>
                          <span className="text-sm text-gray-500">System Design</span>
                        </div>
                        <Badge variant="outline">Upcoming</Badge>
                      </div>
                    </div>
                    <Link href="/career-roadmap">
                      <Button className="w-full mt-4">
                        View Full Roadmap
                      </Button>
                    </Link>
                  </CardContent>
                </Card>

                {/* Resume & Interview Prep */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      Job Readiness
                    </CardTitle>
                    <CardDescription>Prepare for your dream job</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg text-center">
                        <FileText className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                        <h4 className="font-medium text-sm mb-1">Resume Builder</h4>
                        <p className="text-xs text-gray-600 mb-3">ATS-optimized templates</p>
                        <Link href="/resume-builder">
                          <Button size="sm" variant="outline" className="w-full">
                            Build Resume
                          </Button>
                        </Link>
                      </div>
                      <div className="p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg text-center">
                        <Bot className="h-8 w-8 mx-auto mb-2 text-purple-600" />
                        <h4 className="font-medium text-sm mb-1">Mock Interviews</h4>
                        <p className="text-xs text-gray-600 mb-3">AI-powered practice</p>
                        <Link href="/ai-career-coach">
                          <Button size="sm" variant="outline" className="w-full">
                            Practice Now
                          </Button>
                        </Link>
                      </div>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-medium text-sm mb-2">Interview Readiness Score</h4>
                      <div className="flex items-center gap-2 mb-2">
                        <Progress value={75} className="flex-1 h-2" />
                        <span className="text-sm font-medium">75%</span>
                      </div>
                      <p className="text-xs text-gray-600">Complete 2 more mock interviews to reach 90%</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </Layout>

      {/* Mobile Navigation */}
      <MobileNavigation />
    </>
  );
}