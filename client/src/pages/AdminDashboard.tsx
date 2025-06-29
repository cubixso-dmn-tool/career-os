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
  Shield, 
  Users, 
  Calendar, 
  MessageSquare, 
  BarChart3, 
  Settings, 
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Clock,
  TrendingUp,
  TrendingDown,
  Activity,
  Database,
  FileText,
  UserPlus,
  Trash2,
  Edit3,
  Eye,
  Flag,
  Plus,
  Download,
  Upload,
  Search,
  Filter
} from "lucide-react";
import { motion } from "framer-motion";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  
  // Fetch platform analytics
  const { data: platformAnalytics, isLoading: analyticsLoading } = useQuery({
    queryKey: ['/api/admin/analytics'],
    queryFn: async () => {
      const response = await fetch('/api/admin/analytics', {
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      return response.json();
    },
  });

  // Fetch moderation queue
  const { data: moderationQueue, isLoading: moderationLoading } = useQuery({
    queryKey: ['/api/admin/moderation-queue'],
    queryFn: async () => {
      const response = await fetch('/api/admin/moderation-queue', {
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      return response.json();
    },
  });

  // Fetch user management data
  const { data: usersData, isLoading: usersLoading } = useQuery({
    queryKey: ['/api/admin/users'],
    queryFn: async () => {
      const response = await fetch('/api/admin/users', {
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      return response.json();
    },
  });

  if (analyticsLoading || moderationLoading || usersLoading) {
    return (
      <Layout title="Admin Dashboard">
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading admin dashboard...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Admin Dashboard">
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
                <Shield className="h-8 w-8 text-primary" />
                Admin Dashboard
              </h1>
              <p className="text-gray-600 mt-2">
                Manage platform operations, users, and content moderation.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="secondary" className="bg-red-100 text-red-800">
                Admin Access
              </Badge>
              <Link href="/settings">
                <Button variant="outline" size="sm">
                  <Settings className="h-4 w-4 mr-2" />
                  System Settings
                </Button>
              </Link>
            </div>
          </div>

          {/* System Health Overview */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                  </div>
                  <div className="ml-3">
                    <p className="text-lg font-bold text-green-600">99.9%</p>
                    <p className="text-xs text-gray-500">System Uptime</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Users className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="ml-3">
                    <p className="text-lg font-bold text-blue-600">2,847</p>
                    <p className="text-xs text-gray-500">Total Users</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center">
                  <div className="p-2 bg-yellow-100 rounded-lg">
                    <AlertTriangle className="h-5 w-5 text-yellow-600" />
                  </div>
                  <div className="ml-3">
                    <p className="text-lg font-bold text-yellow-600">7</p>
                    <p className="text-xs text-gray-500">Pending Reports</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Activity className="h-5 w-5 text-purple-600" />
                  </div>
                  <div className="ml-3">
                    <p className="text-lg font-bold text-purple-600">156</p>
                    <p className="text-xs text-gray-500">Active Sessions</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <Database className="h-5 w-5 text-orange-600" />
                  </div>
                  <div className="ml-3">
                    <p className="text-lg font-bold text-orange-600">8.2GB</p>
                    <p className="text-xs text-gray-500">Database Size</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Users
            </TabsTrigger>
            <TabsTrigger value="moderation" className="flex items-center gap-2">
              <Flag className="h-4 w-4" />
              Moderation
            </TabsTrigger>
            <TabsTrigger value="content" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Content
            </TabsTrigger>
            <TabsTrigger value="events" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Events
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
                {/* Platform Activity */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Activity className="h-5 w-5" />
                      Recent Platform Activity
                    </CardTitle>
                    <CardDescription>
                      Latest system events and user activities
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {[
                      {
                        id: 1,
                        type: "user_registration",
                        description: "25 new users registered today",
                        time: "2 minutes ago",
                        status: "success"
                      },
                      {
                        id: 2,
                        type: "content_flagged",
                        description: "Community post flagged for review",
                        time: "15 minutes ago",
                        status: "warning"
                      },
                      {
                        id: 3,
                        type: "expert_session",
                        description: "Expert session completed successfully",
                        time: "1 hour ago",
                        status: "success"
                      },
                      {
                        id: 4,
                        type: "system_backup",
                        description: "Daily system backup completed",
                        time: "3 hours ago",
                        status: "success"
                      }
                    ].map((activity) => (
                      <div key={activity.id} className="flex items-center gap-3 p-3 border rounded-lg">
                        <div className={`p-2 rounded-lg ${
                          activity.status === 'success' ? 'bg-green-100' :
                          activity.status === 'warning' ? 'bg-yellow-100' : 'bg-red-100'
                        }`}>
                          {activity.status === 'success' ? (
                            <CheckCircle2 className={`h-4 w-4 ${activity.status === 'success' ? 'text-green-600' : ''}`} />
                          ) : (
                            <AlertTriangle className={`h-4 w-4 ${activity.status === 'warning' ? 'text-yellow-600' : 'text-red-600'}`} />
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">{activity.description}</p>
                          <p className="text-xs text-gray-500">{activity.time}</p>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Quick Stats */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="h-5 w-5" />
                      Platform Statistics
                    </CardTitle>
                    <CardDescription>
                      Key metrics for the past 30 days
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <div className="flex items-center justify-center gap-1 mb-2">
                          <TrendingUp className="h-4 w-4 text-blue-600" />
                          <span className="text-2xl font-bold text-blue-600">847</span>
                        </div>
                        <div className="text-sm text-blue-600">New Users</div>
                        <div className="text-xs text-green-600">+12% vs last month</div>
                      </div>
                      
                      <div className="text-center p-4 bg-green-50 rounded-lg">
                        <div className="flex items-center justify-center gap-1 mb-2">
                          <CheckCircle2 className="h-4 w-4 text-green-600" />
                          <span className="text-2xl font-bold text-green-600">1,234</span>
                        </div>
                        <div className="text-sm text-green-600">Course Enrollments</div>
                        <div className="text-xs text-green-600">+8% vs last month</div>
                      </div>
                      
                      <div className="text-center p-4 bg-purple-50 rounded-lg">
                        <div className="flex items-center justify-center gap-1 mb-2">
                          <MessageSquare className="h-4 w-4 text-purple-600" />
                          <span className="text-2xl font-bold text-purple-600">456</span>
                        </div>
                        <div className="text-sm text-purple-600">Community Posts</div>
                        <div className="text-xs text-red-600">-3% vs last month</div>
                      </div>
                      
                      <div className="text-center p-4 bg-orange-50 rounded-lg">
                        <div className="flex items-center justify-center gap-1 mb-2">
                          <Calendar className="h-4 w-4 text-orange-600" />
                          <span className="text-2xl font-bold text-orange-600">89</span>
                        </div>
                        <div className="text-sm text-orange-600">Expert Sessions</div>
                        <div className="text-xs text-green-600">+15% vs last month</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Right Column - Quick Actions & Alerts */}
              <div className="space-y-6">
                {/* Quick Actions */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Button className="w-full justify-start" size="sm">
                      <UserPlus className="h-4 w-4 mr-2" />
                      Create User Account
                    </Button>
                    <Button variant="outline" size="sm" className="w-full justify-start">
                      <Calendar className="h-4 w-4 mr-2" />
                      Schedule Event
                    </Button>
                    <Button variant="outline" size="sm" className="w-full justify-start">
                      <FileText className="h-4 w-4 mr-2" />
                      Moderate Content
                    </Button>
                    <Button variant="outline" size="sm" className="w-full justify-start">
                      <Download className="h-4 w-4 mr-2" />
                      Export Data
                    </Button>
                  </CardContent>
                </Card>

                {/* Pending Reviews */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4" />
                      Pending Reviews
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {[
                      { type: "User Report", count: 3, urgency: "high" },
                      { type: "Content Flags", count: 7, urgency: "medium" },
                      { type: "Expert Applications", count: 2, urgency: "low" },
                      { type: "Course Submissions", count: 4, urgency: "medium" }
                    ].map((item, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                        <div>
                          <div className="text-sm font-medium">{item.type}</div>
                          <div className="text-xs text-gray-500">{item.count} pending</div>
                        </div>
                        <Badge variant={
                          item.urgency === 'high' ? 'destructive' :
                          item.urgency === 'medium' ? 'default' : 'secondary'
                        }>
                          {item.urgency}
                        </Badge>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* System Health */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <Database className="h-4 w-4" />
                      System Health
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Server Load</span>
                        <span>23%</span>
                      </div>
                      <Progress value={23} className="h-2" />
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Database Usage</span>
                        <span>67%</span>
                      </div>
                      <Progress value={67} className="h-2" />
                    </div>

                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Memory Usage</span>
                        <span>45%</span>
                      </div>
                      <Progress value={45} className="h-2" />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">User Management</h3>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  <Search className="h-4 w-4 mr-2" />
                  Search Users
                </Button>
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
                <Button size="sm">
                  <UserPlus className="h-4 w-4 mr-2" />
                  Add User
                </Button>
              </div>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>User Statistics</CardTitle>
                <CardDescription>
                  Overview of user roles and activity
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">2,534</div>
                    <div className="text-sm text-blue-600">Students</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">89</div>
                    <div className="text-sm text-green-600">Mentors</div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">45</div>
                    <div className="text-sm text-purple-600">Experts</div>
                  </div>
                  <div className="text-center p-4 bg-orange-50 rounded-lg">
                    <div className="text-2xl font-bold text-orange-600">12</div>
                    <div className="text-sm text-orange-600">Moderators</div>
                  </div>
                </div>

                <div className="text-center py-8 text-gray-500">
                  <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p className="text-lg mb-2">User Management Interface</p>
                  <p className="text-sm mb-4">Search, filter, and manage user accounts and roles</p>
                  <Link href="/settings">
                    <Button variant="outline">Manage User Roles</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Moderation Tab */}
          <TabsContent value="moderation" className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Content Moderation</h3>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  <Eye className="h-4 w-4 mr-2" />
                  Review Queue
                </Button>
                <Button variant="outline" size="sm">
                  <Settings className="h-4 w-4 mr-2" />
                  Moderation Rules
                </Button>
              </div>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Moderation Queue</CardTitle>
                <CardDescription>
                  Review flagged content and user reports
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-gray-500">
                  <Flag className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p className="text-lg mb-2">Content Moderation</p>
                  <p className="text-sm mb-4">Review and moderate community content</p>
                  <div className="flex gap-2 justify-center">
                    <Button>Review Flagged Content</Button>
                    <Button variant="outline">View Reports</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Content Tab */}
          <TabsContent value="content" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Content Management</CardTitle>
                <CardDescription>
                  Manage courses, projects, and platform content
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-gray-500">
                  <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p className="text-lg mb-2">Content Management</p>
                  <p className="text-sm mb-4">Create and manage platform content</p>
                  <div className="flex gap-2 justify-center">
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Content
                    </Button>
                    <Button variant="outline">Manage Library</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Events Tab */}
          <TabsContent value="events" className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Event Management</h3>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Create Event
              </Button>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Platform Events</CardTitle>
                <CardDescription>
                  Manage workshops, webinars, and community events
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-gray-500">
                  <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p className="text-lg mb-2">Event Management</p>
                  <p className="text-sm mb-4">Schedule and manage platform events</p>
                  <div className="flex gap-2 justify-center">
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Create Event
                    </Button>
                    <Button variant="outline">View Calendar</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Platform Analytics</CardTitle>
                <CardDescription>
                  Comprehensive analytics and reporting dashboard
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-gray-500">
                  <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p className="text-lg mb-2">Analytics Dashboard</p>
                  <p className="text-sm mb-4">View detailed platform analytics and insights</p>
                  <div className="flex gap-2 justify-center">
                    <Button>View Full Analytics</Button>
                    <Button variant="outline">
                      <Download className="h-4 w-4 mr-2" />
                      Export Report
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}