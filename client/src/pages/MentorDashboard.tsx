import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import Layout from "@/components/layout/Layout";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  UserCheck, 
  Settings, 
  MessageSquare, 
  Calendar, 
  Users, 
  BarChart3, 
  Award,
  Star,
  Target,
  CheckCircle2,
  ThumbsUp,
  Brain,
  Flame,
  Clock,
  Bell,
  BookOpen,
  TrendingUp,
  FileText,
  AlertCircle,
  Video,
  Send,
  Plus,
  ArrowRight,
  Activity
} from "lucide-react";

export default function MentorDashboard() {
  const { data: overview, isLoading } = useQuery({
    queryKey: ["/api/mentor-journey/overview"],
    retry: false,
  });

  if (isLoading) {
    return (
      <Layout title="Mentor Dashboard">
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading your mentor dashboard...</p>
          </div>
        </div>
      </Layout>
    );
  }

  const journeyStages = [
    {
      id: 1,
      title: "Signup & Verification",
      icon: UserCheck,
      status: "completed"
    },
    {
      id: 2,
      title: "Profile Setup",
      icon: Settings,
      status: "completed"
    },
    {
      id: 3,
      title: "Community Engagement",
      icon: MessageSquare,
      status: "current"
    },
    {
      id: 4,
      title: "Sessions Management",
      icon: Calendar,
      status: "upcoming"
    },
    {
      id: 5,
      title: "Mentorship Matching",
      icon: Users,
      status: "upcoming"
    },
    {
      id: 6,
      title: "Success Tracking",
      icon: BarChart3,
      status: "upcoming"
    },
    {
      id: 7,
      title: "Recognition",
      icon: Award,
      status: "upcoming"
    }
  ];

  // Use fallback data if API fails
  const overviewData = (overview as any)?.overview || {
    stats: {
      communityUpvotes: 127,
      sessionsHosted: 12,
      activeMentees: 3,
      overallRating: 4.8
    }
  };

  return (
    <Layout title="Mentor Dashboard">
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50">
        {/* Welcome Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-8 mb-8">
          <div className="max-w-7xl mx-auto">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-between"
            >
              <div>
                <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Brain className="h-8 w-8 text-purple-600" />
                  </div>
                  Mentor Dashboard
                </h1>
                <p className="text-gray-600 mt-2">
                  Welcome back, Alex! Ready to guide the next generation of learners?
                </p>
              </div>
              <div className="flex items-center gap-4">
                <Badge variant="secondary" className="px-3 py-1">
                  <Flame className="h-4 w-4 mr-1" />
                  Stage 3: Community
                </Badge>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="space-y-8">
            {/* Progress Overview */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow-xl border-0">
                <CardContent className="p-8">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="text-2xl font-bold mb-2">Mentor Journey Progress</h2>
                      <p className="text-purple-100">You're making great progress on your mentoring journey!</p>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold">43%</div>
                      <div className="text-purple-100">Complete</div>
                    </div>
                  </div>
                  <Progress value={43} className="h-3 bg-white/20" />
                  <p className="text-purple-100 text-sm mt-3">Stage 3 of 7 - Community Engagement</p>
                </CardContent>
              </Card>
            </motion.div>

            {/* Stats Cards */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="grid grid-cols-1 md:grid-cols-4 gap-6"
            >
              <Card className="shadow-lg border-0">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 mx-auto mb-4 bg-purple-100 rounded-full flex items-center justify-center">
                    <ThumbsUp className="h-6 w-6 text-purple-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">{overviewData.stats.communityUpvotes}</h3>
                  <p className="text-gray-600 text-sm">Community Upvotes</p>
                </CardContent>
              </Card>
              
              <Card className="shadow-lg border-0">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
                    <Calendar className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">{overviewData.stats.sessionsHosted}</h3>
                  <p className="text-gray-600 text-sm">Sessions Hosted</p>
                </CardContent>
              </Card>
              
              <Card className="shadow-lg border-0">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
                    <Users className="h-6 w-6 text-green-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">{overviewData.stats.activeMentees}</h3>
                  <p className="text-gray-600 text-sm">Active Mentees</p>
                </CardContent>
              </Card>
              
              <Card className="shadow-lg border-0">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 mx-auto mb-4 bg-yellow-100 rounded-full flex items-center justify-center">
                    <Star className="h-6 w-6 text-yellow-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">{overviewData.stats.overallRating}</h3>
                  <p className="text-gray-600 text-sm">Overall Rating</p>
                </CardContent>
              </Card>
            </motion.div>

            {/* Journey Stages */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="shadow-lg border-0">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-6 w-6 text-purple-600" />
                    Mentor Journey Stages
                  </CardTitle>
                  <CardDescription>
                    Complete each stage to unlock new mentoring opportunities
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {journeyStages.map((stage) => (
                      <div
                        key={stage.id}
                        className={`relative p-4 rounded-lg border-2 transition-all ${
                          stage.status === 'completed' ? 'border-green-200 bg-green-50' :
                          stage.status === 'current' ? 'border-purple-200 bg-purple-50' 
                          : 'border-gray-200 bg-gray-50'
                        }`}
                      >
                        <div className="text-center">
                          <div className={`w-12 h-12 mx-auto mb-3 rounded-full flex items-center justify-center ${
                            stage.status === 'completed' ? 'bg-green-500' :
                            stage.status === 'current' ? 'bg-purple-500' : 'bg-gray-400'
                          }`}>
                            <stage.icon className="h-6 w-6 text-white" />
                          </div>
                          <h3 className="font-semibold text-sm text-gray-900 mb-2">{stage.title}</h3>
                          <Badge 
                            variant={stage.status === 'completed' ? 'default' : stage.status === 'current' ? 'secondary' : 'outline'}
                            className={
                              stage.status === 'completed' ? 'bg-green-100 text-green-800' :
                              stage.status === 'current' ? 'bg-purple-100 text-purple-800' :
                              'bg-gray-100 text-gray-600'
                            }
                          >
                            {stage.status === 'completed' ? 'Completed' :
                             stage.status === 'current' ? 'In Progress' : 'Upcoming'}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Two Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column - Main Content */}
              <div className="lg:col-span-2 space-y-8">
                {/* Upcoming Sessions */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <Card className="shadow-lg border-0">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Calendar className="h-5 w-5 text-purple-600" />
                        Upcoming Sessions
                      </CardTitle>
                      <CardDescription>Your scheduled mentoring sessions</CardDescription>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        {[
                          {
                            title: "Mock Interview - Frontend Development",
                            student: "Priya Sharma",
                            time: "Today, 4:00 PM",
                            type: "1-on-1",
                            duration: "60 min"
                          },
                          {
                            title: "Career Guidance Session",
                            student: "Rahul Kumar",
                            time: "Tomorrow, 2:00 PM",
                            type: "1-on-1",
                            duration: "45 min"
                          },
                          {
                            title: "React Workshop",
                            student: "Group Session",
                            time: "Thu, 6:00 PM",
                            type: "Workshop",
                            duration: "90 min"
                          }
                        ].map((session, index) => (
                          <div key={index} className="flex items-center justify-between p-4 bg-purple-50 rounded-lg">
                            <div className="flex-1">
                              <h4 className="font-semibold text-gray-900">{session.title}</h4>
                              <p className="text-sm text-gray-600">{session.student}</p>
                              <div className="flex items-center gap-4 mt-2">
                                <span className="text-xs text-purple-600 font-medium">{session.time}</span>
                                <Badge variant="outline" className="text-xs">{session.type}</Badge>
                                <span className="text-xs text-gray-500">{session.duration}</span>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Button size="sm" variant="outline">
                                <Video className="h-4 w-4 mr-1" />
                                Join
                              </Button>
                              <Button size="sm" variant="ghost">
                                <MessageSquare className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="flex justify-between items-center mt-4 pt-4 border-t">
                        <span className="text-sm text-gray-600">3 sessions this week</span>
                        <Button variant="ghost" size="sm">
                          View All <ArrowRight className="h-4 w-4 ml-1" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Current Mentees */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <Card className="shadow-lg border-0">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Users className="h-5 w-5 text-green-600" />
                        Current Mentees
                      </CardTitle>
                      <CardDescription>Students you're actively mentoring</CardDescription>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {[
                          {
                            name: "Priya Sharma",
                            goal: "Frontend Developer",
                            progress: 75,
                            nextSession: "Today, 4:00 PM",
                            avatar: "PS"
                          },
                          {
                            name: "Rahul Kumar", 
                            goal: "Full Stack Developer",
                            progress: 60,
                            nextSession: "Tomorrow, 2:00 PM",
                            avatar: "RK"
                          },
                          {
                            name: "Anita Desai",
                            goal: "Data Scientist",
                            progress: 90,
                            nextSession: "Next Week",
                            avatar: "AD"
                          },
                          {
                            name: "Arjun Patel",
                            goal: "DevOps Engineer",
                            progress: 45,
                            nextSession: "Friday, 3:00 PM",
                            avatar: "AP"
                          }
                        ].map((mentee, index) => (
                          <div key={index} className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                            <div className="flex items-center gap-3 mb-3">
                              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                                {mentee.avatar}
                              </div>
                              <div className="flex-1">
                                <h4 className="font-semibold text-gray-900">{mentee.name}</h4>
                                <p className="text-sm text-gray-600">{mentee.goal}</p>
                              </div>
                            </div>
                            <div className="space-y-2">
                              <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-600">Progress</span>
                                <span className="text-sm font-medium text-gray-900">{mentee.progress}%</span>
                              </div>
                              <Progress value={mentee.progress} className="h-2" />
                              <div className="flex justify-between items-center text-xs">
                                <span className="text-gray-500">Next: {mentee.nextSession}</span>
                                <Button size="sm" variant="ghost" className="h-6 px-2">
                                  <MessageSquare className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Quick Actions */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <Card className="shadow-lg border-0">
                    <CardHeader>
                      <CardTitle>Quick Actions</CardTitle>
                      <CardDescription>Common mentoring tasks and activities</CardDescription>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Button className="h-auto p-4 flex flex-col items-center justify-center text-center bg-purple-600 hover:bg-purple-700">
                          <MessageSquare className="h-8 w-8 mb-2" />
                          <div>
                            <div className="font-semibold">Answer Questions</div>
                            <div className="text-xs opacity-90">Help students in community</div>
                          </div>
                        </Button>
                        
                        <Button variant="outline" className="h-auto p-4 flex flex-col items-center justify-center text-center">
                          <Calendar className="h-8 w-8 mb-2 text-blue-600" />
                          <div>
                            <div className="font-semibold">Schedule Session</div>
                            <div className="text-xs text-gray-600">Create a workshop or Q&A</div>
                          </div>
                        </Button>
                        
                        <Button variant="outline" className="h-auto p-4 flex flex-col items-center justify-center text-center">
                          <Plus className="h-8 w-8 mb-2 text-green-600" />
                          <div>
                            <div className="font-semibold">Add Resource</div>
                            <div className="text-xs text-gray-600">Share learning materials</div>
                          </div>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>

              {/* Right Column - Sidebar */}
              <div className="space-y-6">
                {/* Recent Activity */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <Card className="shadow-lg border-0">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <Activity className="h-5 w-5 text-blue-600" />
                        Recent Activity
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4">
                      <div className="space-y-4">
                        {[
                          {
                            action: "Session completed",
                            details: "Mock interview with Priya",
                            time: "2 hours ago",
                            icon: CheckCircle2,
                            color: "text-green-600"
                          },
                          {
                            action: "New message",
                            details: "Question from Rahul about React",
                            time: "4 hours ago",
                            icon: MessageSquare,
                            color: "text-blue-600"
                          },
                          {
                            action: "Workshop scheduled",
                            details: "React Fundamentals - Thu 6 PM",
                            time: "1 day ago",
                            icon: Calendar,
                            color: "text-purple-600"
                          },
                          {
                            action: "New mentee assigned",
                            details: "Arjun Patel - DevOps track",
                            time: "2 days ago",
                            icon: Users,
                            color: "text-orange-600"
                          }
                        ].map((activity, index) => (
                          <div key={index} className="flex items-start gap-3">
                            <div className={`p-2 rounded-lg bg-gray-100 ${activity.color}`}>
                              <activity.icon className="h-4 w-4" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                              <p className="text-xs text-gray-600 truncate">{activity.details}</p>
                              <p className="text-xs text-gray-400 mt-1">{activity.time}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Notifications */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <Card className="shadow-lg border-0">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <Bell className="h-5 w-5 text-orange-600" />
                        Notifications
                        <Badge variant="secondary" className="ml-auto">3</Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4">
                      <div className="space-y-3">
                        {[
                          {
                            type: "urgent",
                            message: "Session starting in 30 minutes",
                            time: "now"
                          },
                          {
                            type: "info",
                            message: "New community question needs your expertise",
                            time: "1h ago"
                          },
                          {
                            type: "reminder",
                            message: "Weekly mentor report due tomorrow",
                            time: "3h ago"
                          }
                        ].map((notification, index) => (
                          <div key={index} className={`p-3 rounded-lg border-l-4 ${
                            notification.type === 'urgent' ? 'border-red-400 bg-red-50' :
                            notification.type === 'info' ? 'border-blue-400 bg-blue-50' :
                            'border-yellow-400 bg-yellow-50'
                          }`}>
                            <p className="text-sm font-medium text-gray-900">{notification.message}</p>
                            <p className="text-xs text-gray-600 mt-1">{notification.time}</p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Quick Resources */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <Card className="shadow-lg border-0">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <BookOpen className="h-5 w-5 text-purple-600" />
                        Quick Resources
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4">
                      <div className="space-y-2">
                        {[
                          "Interview Question Bank",
                          "Resume Review Checklist",
                          "Career Roadmap Templates",
                          "Technical Assessment Guide",
                          "Mentoring Best Practices"
                        ].map((resource, index) => (
                          <Button key={index} variant="ghost" className="w-full justify-start text-sm h-auto p-2">
                            <FileText className="h-4 w-4 mr-2 text-gray-600" />
                            {resource}
                          </Button>
                        ))}
                      </div>
                      <Button variant="outline" size="sm" className="w-full mt-4">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Resource
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}