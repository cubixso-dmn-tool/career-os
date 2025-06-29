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
  Users, 
  Calendar, 
  MessageSquare, 
  Star, 
  Clock, 
  BookOpen,
  Award,
  Settings,
  Plus,
  ArrowRight,
  TrendingUp,
  CheckCircle2,
  Video,
  Heart,
  Eye,
  UserPlus,
  Edit3,
  BarChart3
} from "lucide-react";
import { motion } from "framer-motion";

export default function MentorDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  
  // Fetch mentor's profile data
  const { data: mentorProfile, isLoading: profileLoading } = useQuery({
    queryKey: ['/api/mentor/profile'],
    queryFn: async () => {
      const response = await fetch('/api/mentor/profile', {
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      return response.json();
    },
  });

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

  if (profileLoading || sessionsLoading || communityLoading) {
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
                <Users className="h-8 w-8 text-primary" />
                Mentor Dashboard
              </h1>
              <p className="text-gray-600 mt-2">
                Welcome back! Track your mentoring impact and manage your sessions.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                Active Mentor
              </Badge>
              <Link href="/settings">
                <Button variant="outline" size="sm">
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </Button>
              </Link>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Users className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-2xl font-bold text-blue-600">47</p>
                    <p className="text-sm text-gray-500">Active Mentees</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Calendar className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-2xl font-bold text-green-600">12</p>
                    <p className="text-sm text-gray-500">Sessions This Week</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-yellow-100 rounded-lg">
                    <Star className="h-6 w-6 text-yellow-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-2xl font-bold text-yellow-600">4.9</p>
                    <p className="text-sm text-gray-500">Average Rating</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <MessageSquare className="h-6 w-6 text-purple-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-2xl font-bold text-purple-600">156</p>
                    <p className="text-sm text-gray-500">Community Posts</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="sessions" className="flex items-center gap-2">
              <Video className="h-4 w-4" />
              Sessions
            </TabsTrigger>
            <TabsTrigger value="community" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Community
            </TabsTrigger>
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Analytics
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column - Recent Activity */}
              <div className="lg:col-span-2 space-y-6">
                {/* Upcoming Sessions */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="h-5 w-5" />
                      Upcoming Sessions
                    </CardTitle>
                    <CardDescription>
                      Your scheduled mentoring sessions for this week
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {[
                      { 
                        id: 1, 
                        student: "Priya Sharma", 
                        topic: "React State Management", 
                        time: "Today, 3:00 PM", 
                        type: "1-on-1",
                        avatar: "PS"
                      },
                      { 
                        id: 2, 
                        student: "Rahul Kumar", 
                        topic: "Career Transition to Full Stack", 
                        time: "Tomorrow, 10:00 AM", 
                        type: "Career Guidance",
                        avatar: "RK"
                      },
                      { 
                        id: 3, 
                        student: "Group Session", 
                        topic: "JavaScript Best Practices", 
                        time: "Friday, 2:00 PM", 
                        type: "Group",
                        avatar: "GS"
                      }
                    ].map((session) => (
                      <div key={session.id} className="flex items-center justify-between p-4 border rounded-lg hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white text-sm font-medium">
                            {session.avatar}
                          </div>
                          <div>
                            <h5 className="font-medium">{session.student}</h5>
                            <p className="text-sm text-gray-600">{session.topic}</p>
                            <p className="text-xs text-gray-500">{session.time}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">{session.type}</Badge>
                          <Button size="sm">Join</Button>
                        </div>
                      </div>
                    ))}
                    
                    <div className="pt-4 border-t">
                      <Link href="/mentor/sessions">
                        <Button variant="outline" className="w-full">
                          View All Sessions
                          <ArrowRight className="h-4 w-4 ml-2" />
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>

                {/* Recent Community Engagement */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MessageSquare className="h-5 w-5" />
                      Recent Community Activity
                    </CardTitle>
                    <CardDescription>
                      Your latest contributions to the community
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {[
                      {
                        id: 1,
                        type: "post",
                        title: "Best Practices for React Component Design",
                        engagement: "23 likes, 8 comments",
                        time: "2 hours ago"
                      },
                      {
                        id: 2,
                        type: "answer",
                        title: "Answered: How to handle API errors in React?",
                        engagement: "15 upvotes, 3 replies",
                        time: "1 day ago"
                      },
                      {
                        id: 3,
                        type: "post",
                        title: "Career Guide: From Junior to Senior Developer",
                        engagement: "45 likes, 12 comments",
                        time: "3 days ago"
                      }
                    ].map((activity) => (
                      <div key={activity.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                        <div className="p-2 bg-white rounded-lg">
                          {activity.type === 'post' ? (
                            <Edit3 className="h-4 w-4 text-blue-600" />
                          ) : (
                            <CheckCircle2 className="h-4 w-4 text-green-600" />
                          )}
                        </div>
                        <div className="flex-1">
                          <h6 className="font-medium text-sm">{activity.title}</h6>
                          <div className="flex items-center gap-4 mt-1 text-xs text-gray-500">
                            <span>{activity.engagement}</span>
                            <span>{activity.time}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>

              {/* Right Column - Quick Actions & Stats */}
              <div className="space-y-6">
                {/* Quick Actions */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Button className="w-full justify-start" size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Schedule New Session
                    </Button>
                    <Button variant="outline" size="sm" className="w-full justify-start">
                      <Edit3 className="h-4 w-4 mr-2" />
                      Create Community Post
                    </Button>
                    <Link href="/mentor/profile-edit" className="block">
                      <Button variant="outline" size="sm" className="w-full justify-start">
                        <Users className="h-4 w-4 mr-2" />
                        Update Profile
                      </Button>
                    </Link>
                    <Button variant="outline" size="sm" className="w-full justify-start">
                      <Calendar className="h-4 w-4 mr-2" />
                      Set Availability
                    </Button>
                  </CardContent>
                </Card>

                {/* This Week's Impact */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <TrendingUp className="h-4 w-4" />
                      This Week's Impact
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Sessions Completed</span>
                        <span>8/12</span>
                      </div>
                      <Progress value={67} className="h-2" />
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Community Engagement</span>
                        <span>85%</span>
                      </div>
                      <Progress value={85} className="h-2" />
                    </div>

                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Student Satisfaction</span>
                        <span>4.9/5.0</span>
                      </div>
                      <Progress value={98} className="h-2" />
                    </div>
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
                      { name: "Top Mentor", description: "Highest rated mentor this month", date: "Today", icon: "🏆" },
                      { name: "Community Leader", description: "50+ helpful community posts", date: "2 days ago", icon: "🌟" },
                      { name: "Session Master", description: "100 successful sessions", date: "1 week ago", icon: "📚" }
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

          {/* Sessions Tab */}
          <TabsContent value="sessions" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Session Management</CardTitle>
                <CardDescription>
                  Manage your mentoring sessions and availability
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-gray-500">
                  <Video className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p className="text-lg mb-2">Session Management</p>
                  <p className="text-sm mb-4">Schedule and manage your mentoring sessions</p>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Schedule New Session
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Community Tab */}
          <TabsContent value="community" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Community Engagement</CardTitle>
                <CardDescription>
                  Track your community contributions and engagement
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-gray-500">
                  <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p className="text-lg mb-2">Community Hub</p>
                  <p className="text-sm mb-4">Engage with students and fellow mentors</p>
                  <div className="flex gap-2 justify-center">
                    <Link href="/community">
                      <Button>View Community</Button>
                    </Link>
                    <Button variant="outline">
                      <Edit3 className="h-4 w-4 mr-2" />
                      Create Post
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Mentor Profile</CardTitle>
                <CardDescription>
                  Manage your mentor profile and expert directory listing
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-gray-500">
                  <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p className="text-lg mb-2">Profile Management</p>
                  <p className="text-sm mb-4">Update your mentor profile and expertise</p>
                  <Button>
                    <Edit3 className="h-4 w-4 mr-2" />
                    Edit Profile
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Mentoring Analytics</CardTitle>
                <CardDescription>
                  Track your mentoring impact and performance metrics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-gray-500">
                  <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p className="text-lg mb-2">Analytics Dashboard</p>
                  <p className="text-sm mb-4">View detailed mentoring analytics and insights</p>
                  <Button variant="outline">View Full Analytics</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}