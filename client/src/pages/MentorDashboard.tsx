import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useLocation } from "wouter";
import LogoutButton from "@/components/auth/LogoutButton";
import { useAuth } from '@/hooks/useAuth';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Users, 
  Calendar, 
  Video, 
  Star, 
  Clock, 
  Plus,
  ArrowRight,
  CheckCircle2,
  MessageSquare,
  Award,
  Settings,
  Bell,
  TrendingUp,
  Activity,
  Target,
  BookOpen,
  Timer,
  Heart,
  Zap,
  FileText,
  LayoutDashboard,
  Edit3,
  BarChart3,
  Send,
  Search,
  Filter,
  Download,
  AlertCircle,
  User
} from "lucide-react";
import { motion } from "framer-motion";

// Simplified sidebar component for mentor dashboard
function SimpleSidebar({ user }: { user: any }) {
  const [location] = useLocation();

  const navItems = [
    { path: "/mentor-dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { path: "/settings", icon: Settings, label: "Settings" }
  ];

  return (
    <aside className="hidden md:flex md:w-64 bg-white border-r border-gray-200 flex-col">
      <div className="flex-1 flex flex-col min-h-0">
        <div className="flex items-center justify-center h-16 px-4 bg-purple-600">
          <h2 className="text-xl font-bold text-white">CareerOS</h2>
        </div>
        
        <nav className="flex-1 px-4 py-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location === item.path;
            
            return (
              <Link key={item.path} href={item.path}>
                <div className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-purple-100 text-purple-900'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}>
                  <Icon className="h-5 w-5 mr-3" />
                  {item.label}
                </div>
              </Link>
            );
          })}
        </nav>
        
        <div className="p-4 border-t border-gray-200">
          <LogoutButton />
        </div>
      </div>
    </aside>
  );
}

export default function MentorDashboard() {
  const [selectedTimeframe, setSelectedTimeframe] = useState("this_week");
  const { user } = useAuth();
  
  // Fetch mentor's sessions data
  const { data: sessionsData, isLoading: sessionsLoading } = useQuery({
    queryKey: ['/api/mentor/sessions'],
    queryFn: async () => {
      const response = await fetch('/api/mentor/sessions', {
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      return response.json();
    },
  });

  // Fetch community engagement metrics
  const { data: communityMetrics, isLoading: communityLoading } = useQuery({
    queryKey: ['/api/mentor/community-metrics'],
    queryFn: async () => {
      const response = await fetch('/api/mentor/community-metrics', {
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      return response.json();
    },
  });

  const userWithDefaults = {
    name: user?.name || 'Mentor',
    email: user?.email || 'mentor@example.com',
    avatar: user?.avatar || 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6',
  };

  if (sessionsLoading || communityLoading) {
    return (
      <div className="min-h-screen flex flex-col md:flex-row bg-gray-50">
        <SimpleSidebar user={userWithDefaults} />
        
        <main className="flex-1 md:ml-0">
          <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading your mentor dashboard...</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-50">
      <SimpleSidebar user={userWithDefaults} />
      
      <main className="flex-1 md:ml-0">
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-green-50">
          {/* Header Section */}
          <div className="bg-white border-b border-gray-200 px-6 py-8">
            <div className="max-w-7xl mx-auto">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-between"
              >
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <Users className="h-8 w-8 text-purple-600" />
                    </div>
                    Mentor Command Center
                  </h1>
                  <p className="text-gray-600 mt-2">
                    Empower the next generation of developers through mentorship
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <Badge variant="secondary" className="bg-purple-100 text-purple-800 border-purple-200">
                    Active Mentor
                  </Badge>
                  <div className="flex items-center gap-3">
                    <Button size="sm" variant="outline" className="border-purple-600 text-purple-600 hover:bg-purple-50">
                      <Calendar className="h-4 w-4 mr-2" />
                      View Calendar
                    </Button>
                    <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
                      <Plus className="h-4 w-4 mr-2" />
                      Schedule Session
                    </Button>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Dashboard Content */}
          <div className="max-w-7xl mx-auto px-6 py-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Today's Sessions - Full Width */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="lg:col-span-2"
              >
                <Card className="shadow-lg border-0">
                  <CardHeader className="bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-t-lg">
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="h-5 w-5" />
                      Today's Sessions
                    </CardTitle>
                    <CardDescription className="text-purple-100">
                      Upcoming mentoring sessions scheduled for today
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      {sessionsData?.data?.upcoming?.slice(0, 3).map((session: any, index: number) => (
                        <div key={session.id} className="p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border border-purple-200">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center">
                                <span className="text-white font-semibold text-sm">
                                  {session.studentName?.charAt(0) || 'S'}
                                </span>
                              </div>
                              <div>
                                <h4 className="font-semibold text-gray-900">{session.title}</h4>
                                <p className="text-sm text-gray-600">
                                  with {session.studentName} • {session.duration} mins
                                </p>
                                <div className="flex items-center mt-1">
                                  <Clock className="h-4 w-4 text-gray-400 mr-1" />
                                  <span className="text-sm text-gray-500">{session.scheduledTime}</span>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Badge 
                                variant={session.priority === 'high' ? 'destructive' : 
                                        session.priority === 'medium' ? 'default' : 'secondary'}
                              >
                                {session.priority} priority
                              </Badge>
                              <div className="flex items-center space-x-1">
                                <Button size="sm" variant="outline" className="h-8 w-8 p-0">
                                  <Edit3 className="h-3 w-3" />
                                </Button>
                                <Button size="sm" variant="outline" className="h-8 w-8 p-0">
                                  <FileText className="h-3 w-3" />
                                </Button>
                                <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
                                  <Video className="h-4 w-4 mr-1" />
                                  Join
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                      
                      {(!sessionsData?.data?.upcoming || sessionsData.data.upcoming.length === 0) && (
                        <div className="text-center py-8 text-gray-500">
                          <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                          <p>No sessions scheduled for today</p>
                          <Button className="mt-4" variant="outline">
                            <Plus className="h-4 w-4 mr-2" />
                            Schedule New Session
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Impact Metrics */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="space-y-6"
              >
                {/* Quick Stats */}
                <Card className="shadow-lg border-0">
                  <CardHeader className="bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-t-lg">
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5" />
                      Your Impact
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-blue-100 rounded-lg">
                            <Users className="h-5 w-5 text-blue-600" />
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Total Mentees</p>
                            <p className="text-xl font-bold text-gray-900">
                              {communityMetrics?.data?.totalMentees || 0}
                            </p>
                          </div>
                        </div>
                        <ArrowRight className="h-4 w-4 text-gray-400" />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-green-100 rounded-lg">
                            <CheckCircle2 className="h-5 w-5 text-green-600" />
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Sessions Completed</p>
                            <p className="text-xl font-bold text-gray-900">
                              {communityMetrics?.data?.completedSessions || 0}
                            </p>
                          </div>
                        </div>
                        <ArrowRight className="h-4 w-4 text-gray-400" />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-yellow-100 rounded-lg">
                            <Star className="h-5 w-5 text-yellow-600" />
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Avg Rating</p>
                            <p className="text-xl font-bold text-gray-900">
                              {communityMetrics?.data?.averageRating || '4.8'}
                            </p>
                          </div>
                        </div>
                        <ArrowRight className="h-4 w-4 text-gray-400" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Recent Feedback */}
                <Card className="shadow-lg border-0">
                  <CardHeader className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-t-lg">
                    <CardTitle className="flex items-center gap-2">
                      <MessageSquare className="h-5 w-5" />
                      Recent Feedback
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 max-h-80 overflow-y-auto">
                    {[
                      { 
                        student: "Priya S.", 
                        feedback: "Sarah's guidance was incredible! The React concepts finally clicked.", 
                        rating: 5,
                        time: "2 hours ago"
                      },
                      { 
                        student: "Rahul K.", 
                        feedback: "Amazing mentor. Helped me land my first job!", 
                        rating: 5,
                        time: "1 day ago"
                      },
                      { 
                        student: "Anjali P.", 
                        feedback: "System design sessions were exactly what I needed.", 
                        rating: 5,
                        time: "3 days ago"
                      }
                    ].map((feedback, index) => (
                      <div key={index} className="p-3 bg-yellow-50 rounded-lg border border-yellow-200 mb-3">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium text-sm">{feedback.student}</span>
                          <div className="flex items-center">
                            {[...Array(feedback.rating)].map((_, i) => (
                              <Star key={i} className="h-3 w-3 text-yellow-500 fill-current" />
                            ))}
                          </div>
                        </div>
                        <p className="text-xs text-gray-700 leading-relaxed">{feedback.feedback}</p>
                        <span className="text-xs text-gray-500">{feedback.time}</span>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Mentee Management Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mt-8"
            >
              <Card className="shadow-lg border-0">
                <CardHeader className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-t-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <User className="h-5 w-5" />
                        Active Mentees
                      </CardTitle>
                      <CardDescription className="text-indigo-100">
                        Track progress and manage individual mentoring relationships
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="outline" className="border-white text-white hover:bg-white hover:text-indigo-600">
                        <Search className="h-4 w-4 mr-2" />
                        Search
                      </Button>
                      <Button size="sm" variant="outline" className="border-white text-white hover:bg-white hover:text-indigo-600">
                        <Filter className="h-4 w-4 mr-2" />
                        Filter
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[
                      {
                        name: "Arjun Patel",
                        role: "Frontend Developer",
                        progress: 75,
                        nextSession: "Tomorrow 2:00 PM",
                        goals: ["Master React Hooks", "Build Portfolio", "Interview Prep"],
                        status: "On Track",
                        avatar: "AP"
                      },
                      {
                        name: "Priya Sharma",
                        role: "Full Stack Developer", 
                        progress: 60,
                        nextSession: "Friday 10:00 AM",
                        goals: ["Learn Node.js", "Database Design", "API Development"],
                        status: "Needs Support",
                        avatar: "PS"
                      },
                      {
                        name: "Rohan Kumar",
                        role: "Data Scientist",
                        progress: 90,
                        nextSession: "Next Monday 3:00 PM",
                        goals: ["Machine Learning", "Python Advanced", "Deploy ML Models"],
                        status: "Excellent",
                        avatar: "RK"
                      }
                    ].map((mentee, index) => (
                      <div key={index} className="p-4 bg-gradient-to-br from-purple-50 to-indigo-50 rounded-lg border border-purple-200">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center">
                              <span className="text-white font-semibold text-sm">{mentee.avatar}</span>
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-900">{mentee.name}</h4>
                              <p className="text-sm text-gray-600">{mentee.role}</p>
                            </div>
                          </div>
                          <Badge 
                            variant={mentee.status === 'Excellent' ? 'default' : 
                                    mentee.status === 'On Track' ? 'secondary' : 'destructive'}
                            className={
                              mentee.status === 'Excellent' ? 'bg-green-100 text-green-800' :
                              mentee.status === 'On Track' ? 'bg-blue-100 text-blue-800' : 
                              'bg-yellow-100 text-yellow-800'
                            }
                          >
                            {mentee.status}
                          </Badge>
                        </div>
                        
                        <div className="space-y-3">
                          <div>
                            <div className="flex justify-between items-center mb-1">
                              <span className="text-sm text-gray-600">Overall Progress</span>
                              <span className="text-sm font-semibold text-gray-900">{mentee.progress}%</span>
                            </div>
                            <Progress value={mentee.progress} className="h-2" />
                          </div>
                          
                          <div>
                            <p className="text-sm text-gray-600 mb-2">Current Goals:</p>
                            <div className="space-y-1">
                              {mentee.goals.slice(0, 2).map((goal, goalIndex) => (
                                <div key={goalIndex} className="flex items-center text-xs text-gray-700">
                                  <Target className="h-3 w-3 mr-1 text-purple-500" />
                                  {goal}
                                </div>
                              ))}
                              {mentee.goals.length > 2 && (
                                <div className="text-xs text-gray-500">+{mentee.goals.length - 2} more goals</div>
                              )}
                            </div>
                          </div>
                          
                          <div className="flex items-center text-sm text-gray-600">
                            <Clock className="h-4 w-4 mr-1" />
                            Next: {mentee.nextSession}
                          </div>
                          
                          <div className="flex items-center space-x-2 pt-2">
                            <Button size="sm" variant="outline" className="h-8 flex-1">
                              <MessageSquare className="h-3 w-3 mr-1" />
                              Message
                            </Button>
                            <Button size="sm" variant="outline" className="h-8 flex-1">
                              <FileText className="h-3 w-3 mr-1" />
                              Notes
                            </Button>
                            <Button size="sm" className="h-8 bg-purple-600 hover:bg-purple-700 text-white">
                              <BarChart3 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Quick Actions & Resource Library */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8"
            >
              {/* Resource Library */}
              <Card className="shadow-lg border-0">
                <CardHeader className="bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-t-lg">
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5" />
                    Resource Library
                  </CardTitle>
                  <CardDescription className="text-green-100">
                    Share materials and templates with mentees
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {[
                      { name: "React Best Practices Guide", type: "PDF", downloads: 23, icon: FileText },
                      { name: "Interview Questions Template", type: "DOC", downloads: 15, icon: FileText },
                      { name: "Career Roadmap Template", type: "PDF", downloads: 31, icon: Target },
                      { name: "Code Review Checklist", type: "PDF", downloads: 18, icon: CheckCircle2 }
                    ].map((resource, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-green-100 rounded-lg">
                            <resource.icon className="h-4 w-4 text-green-600" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{resource.name}</p>
                            <p className="text-sm text-gray-600">{resource.type} • {resource.downloads} downloads</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button size="sm" variant="outline" className="h-8 w-8 p-0">
                            <Send className="h-3 w-3" />
                          </Button>
                          <Button size="sm" variant="outline" className="h-8 w-8 p-0">
                            <Download className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <Button className="w-full mt-4 bg-green-600 hover:bg-green-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Upload New Resource
                  </Button>
                </CardContent>
              </Card>

              {/* Communication Center */}
              <Card className="shadow-lg border-0">
                <CardHeader className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-t-lg">
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5" />
                    Communication Center
                  </CardTitle>
                  <CardDescription className="text-blue-100">
                    Messages and announcements for your mentees
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                          <Bell className="h-4 w-4 text-white" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">Unread Messages</p>
                          <p className="text-sm text-gray-600">3 new messages from mentees</p>
                        </div>
                      </div>
                      <Badge className="bg-blue-600 text-white">3</Badge>
                    </div>
                    
                    <div className="space-y-2">
                      <Button className="w-full bg-blue-600 hover:bg-blue-700" variant="default">
                        <Send className="h-4 w-4 mr-2" />
                        Send Group Announcement
                      </Button>
                      <Button className="w-full" variant="outline">
                        <MessageSquare className="h-4 w-4 mr-2" />
                        View All Messages
                      </Button>
                    </div>
                    
                    <div className="pt-4 border-t border-gray-200">
                      <h4 className="font-medium text-gray-900 mb-2">Quick Templates</h4>
                      <div className="space-y-2">
                        {["Session Reminder", "Goal Update", "Resource Share", "Motivational Message"].map((template, index) => (
                          <Button key={index} size="sm" variant="outline" className="w-full justify-start">
                            <FileText className="h-3 w-3 mr-2" />
                            {template}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
}