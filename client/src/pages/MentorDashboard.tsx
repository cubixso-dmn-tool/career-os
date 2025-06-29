import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import Layout from "@/components/layout/Layout";
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
  FileText
} from "lucide-react";
import { motion } from "framer-motion";

export default function MentorDashboard() {
  const [selectedTimeframe, setSelectedTimeframe] = useState("this_week");
  
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

  if (sessionsLoading || communityLoading) {
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

  return (
    <Layout title="Mentor Dashboard">
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

        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Key Metrics */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
          >
            <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white border-0">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-100">Active Mentees</p>
                    <p className="text-3xl font-bold">47</p>
                  </div>
                  <Users className="h-10 w-10 text-purple-200" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white border-0">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100">Sessions This Week</p>
                    <p className="text-3xl font-bold">12</p>
                  </div>
                  <Video className="h-10 w-10 text-blue-200" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white border-0">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-100">Avg Rating</p>
                    <p className="text-3xl font-bold">4.9</p>
                  </div>
                  <Star className="h-10 w-10 text-green-200" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white border-0">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-orange-100">Impact Score</p>
                    <p className="text-3xl font-bold">856</p>
                  </div>
                  <Award className="h-10 w-10 text-orange-200" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Sessions & Schedule */}
            <div className="lg:col-span-2 space-y-6">
              {/* Upcoming Sessions */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Card className="shadow-lg border-0">
                  <CardHeader className="bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-t-lg">
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="h-5 w-5" />
                      Today's Sessions
                    </CardTitle>
                    <CardDescription className="text-purple-100">
                      Your mentoring sessions for today
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      {[
                        { 
                          id: 1, 
                          student: "Priya Sharma", 
                          topic: "React State Management", 
                          time: "3:00 PM - 4:00 PM", 
                          status: "upcoming",
                          avatar: "PS",
                          priority: "high"
                        },
                        { 
                          id: 2, 
                          student: "Rahul Kumar", 
                          topic: "Career Transition Strategy", 
                          time: "5:00 PM - 5:45 PM", 
                          status: "confirmed",
                          avatar: "RK",
                          priority: "medium"
                        },
                        { 
                          id: 3, 
                          student: "Anjali Patel", 
                          topic: "System Design Interview Prep", 
                          time: "6:30 PM - 7:30 PM", 
                          status: "upcoming",
                          avatar: "AP",
                          priority: "high"
                        }
                      ].map((session) => (
                        <div key={session.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                              {session.avatar}
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-900">{session.student}</h4>
                              <p className="text-sm text-gray-600">{session.topic}</p>
                              <div className="flex items-center gap-2 mt-1">
                                <Clock className="h-3 w-3 text-gray-400" />
                                <span className="text-xs text-gray-500">{session.time}</span>
                                <Badge 
                                  variant={session.priority === 'high' ? 'destructive' : 'secondary'}
                                  className="ml-2"
                                >
                                  {session.priority}
                                </Badge>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button size="sm" variant="outline">
                              <MessageSquare className="h-4 w-4 mr-1" />
                              Chat
                            </Button>
                            <Button size="sm" className="bg-green-600 hover:bg-green-700">
                              <Video className="h-4 w-4 mr-1" />
                              Join
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="mt-6 pt-4 border-t border-gray-200">
                      <Button variant="outline" className="w-full">
                        <Calendar className="h-4 w-4 mr-2" />
                        View Full Schedule
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Mentee Progress Tracking */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Card className="shadow-lg border-0">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="h-5 w-5 text-blue-600" />
                      Mentee Progress Updates
                    </CardTitle>
                    <CardDescription>
                      Recent achievements and milestones from your mentees
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      {[
                        {
                          student: "Priya Sharma",
                          achievement: "Completed React Advanced Course",
                          progress: 85,
                          timeAgo: "2 hours ago",
                          type: "course"
                        },
                        {
                          student: "Rahul Kumar", 
                          achievement: "Built first full-stack project",
                          progress: 100,
                          timeAgo: "1 day ago",
                          type: "project"
                        },
                        {
                          student: "Anjali Patel",
                          achievement: "System Design practice - 75% improvement",
                          progress: 75,
                          timeAgo: "3 days ago",
                          type: "skill"
                        }
                      ].map((update, index) => (
                        <div key={index} className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                          <div className={`p-2 rounded-lg ${
                            update.type === 'course' ? 'bg-green-100' :
                            update.type === 'project' ? 'bg-purple-100' : 'bg-blue-100'
                          }`}>
                            {update.type === 'course' ? (
                              <BookOpen className={`h-4 w-4 ${
                                update.type === 'course' ? 'text-green-600' :
                                update.type === 'project' ? 'text-purple-600' : 'text-blue-600'
                              }`} />
                            ) : update.type === 'project' ? (
                              <CheckCircle2 className="h-4 w-4 text-purple-600" />
                            ) : (
                              <Zap className="h-4 w-4 text-blue-600" />
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-start justify-between">
                              <div>
                                <h5 className="font-medium text-gray-900">{update.student}</h5>
                                <p className="text-sm text-gray-600">{update.achievement}</p>
                                <span className="text-xs text-gray-500">{update.timeAgo}</span>
                              </div>
                              <div className="text-right">
                                <div className="text-sm font-semibold text-blue-600">{update.progress}%</div>
                                <Progress value={update.progress} className="w-20 h-2 mt-1" />
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Right Column - Quick Actions & Insights */}
            <div className="space-y-6">
              {/* Quick Actions */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Card className="shadow-lg border-0">
                  <CardHeader className="bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-t-lg">
                    <CardTitle className="text-base">Mentor Tools</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 space-y-3">
                    <Button className="w-full justify-start bg-purple-600 hover:bg-purple-700" size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Schedule New Session
                    </Button>
                    <Button variant="outline" size="sm" className="w-full justify-start">
                      <FileText className="h-4 w-4 mr-2" />
                      Create Resource
                    </Button>
                    <Button variant="outline" size="sm" className="w-full justify-start">
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Community Post
                    </Button>
                    <Button variant="outline" size="sm" className="w-full justify-start">
                      <Settings className="h-4 w-4 mr-2" />
                      Set Availability
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Weekly Impact */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Card className="shadow-lg border-0">
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-green-600" />
                      This Week's Impact
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Sessions Completed</span>
                        <span className="font-semibold">8/12</span>
                      </div>
                      <Progress value={67} className="h-3" />
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Mentee Goals Achieved</span>
                        <span className="font-semibold">15/18</span>
                      </div>
                      <Progress value={83} className="h-3" />
                    </div>

                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Community Engagement</span>
                        <span className="font-semibold">92%</span>
                      </div>
                      <Progress value={92} className="h-3" />
                    </div>

                    <div className="pt-2 border-t border-gray-200">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">A+</div>
                        <div className="text-xs text-gray-500">Mentor Grade</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Recent Feedback */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Card className="shadow-lg border-0">
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <Heart className="h-4 w-4 text-red-500" />
                      Recent Feedback
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 space-y-3">
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
                      <div key={index} className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
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

              {/* Notifications */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
              >
                <Card className="shadow-lg border-0">
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <Bell className="h-4 w-4 text-blue-600" />
                      Notifications
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 space-y-2">
                    {[
                      { type: "session", message: "Priya requested a session for tomorrow", urgent: true },
                      { type: "achievement", message: "3 mentees completed their goals this week", urgent: false },
                      { type: "community", message: "Your post got 25+ likes", urgent: false }
                    ].map((notification, index) => (
                      <div key={index} className={`p-2 rounded-lg text-xs flex items-center gap-2 ${
                        notification.urgent ? 'bg-red-50 text-red-700' : 'bg-gray-50 text-gray-700'
                      }`}>
                        <div className={`w-2 h-2 rounded-full ${
                          notification.urgent ? 'bg-red-500' : 'bg-blue-500'
                        }`}></div>
                        {notification.message}
                      </div>
                    ))}
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