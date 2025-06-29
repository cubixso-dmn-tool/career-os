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
  LayoutDashboard
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
                  <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Schedule Session
                  </Button>
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
                              <Button size="sm" variant="outline">
                                <Video className="h-4 w-4 mr-1" />
                                Join
                              </Button>
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
          </div>
        </div>
      </main>
    </div>
  );
}