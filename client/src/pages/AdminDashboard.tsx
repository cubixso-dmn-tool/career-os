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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Crown,
  Users,
  Calendar,
  Shield,
  FileText,
  BarChart3,
  Settings,
  UserCheck,
  UserX,
  Eye,
  Edit,
  Trash2,
  Plus,
  Filter,
  Download,
  ToggleLeft,
  ToggleRight,
  Activity,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  Globe,
  Zap,
  Database,
  Bell
} from "lucide-react";

export default function AdminDashboard() {
  const { data: analyticsData, isLoading: analyticsLoading } = useQuery({
    queryKey: ["/api/admin/analytics"],
    queryFn: async () => {
      const response = await fetch('/api/admin/analytics', {
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      return response.json();
    },
    retry: false,
  });

  const { data: usersData, isLoading: usersLoading } = useQuery({
    queryKey: ["/api/admin/users"],
    queryFn: async () => {
      const response = await fetch('/api/admin/users', {
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      return response.json();
    },
    retry: false,
  });

  const { data: moderationData, isLoading: moderationLoading } = useQuery({
    queryKey: ["/api/admin/moderation-queue"],
    queryFn: async () => {
      const response = await fetch('/api/admin/moderation-queue', {
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      return response.json();
    },
    retry: false,
  });

  const isLoading = analyticsLoading || usersLoading || moderationLoading;

  if (isLoading) {
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

  // Use real analytics data
  const analytics = analyticsData?.data || {};
  const users = usersData?.data || {};
  const moderation = moderationData?.data || {};

  const data = {
    stats: {
      totalUsers: users.stats?.totalUsers || analytics.users?.total || 0,
      activeToday: analytics.users?.activeUsers || 0,
      totalEvents: analytics.engagement?.totalSessions || 0,
      pendingModeration: moderation.stats?.pendingReviews || 0
    },
    metrics: {
      conversionRate: `${analytics.revenue?.conversionRate || 0}%`,
      growthRate: `${analytics.users?.growthRate || 0}%`, 
      retentionRate: `${analytics.users?.retentionRate || 0}%`,
      engagementRate: `${analytics.engagement?.avgSessionDuration || 0}min`
    }
  };

  const adminJourneyStages = [
    {
      id: 1,
      title: "System Access",
      description: "Full admin privileges",
      icon: Crown,
      status: "completed",
      color: "green"
    },
    {
      id: 2,
      title: "Role Management",
      description: "User role assignments",
      icon: Users,
      status: "active",
      color: "blue"
    },
    {
      id: 3,
      title: "Event Oversight", 
      description: "Calendar & notifications",
      icon: Calendar,
      status: "active",
      color: "purple"
    },
    {
      id: 4,
      title: "Community Moderation",
      description: "Mod oversight & escalations",
      icon: Shield,
      status: "active",
      color: "orange"
    },
    {
      id: 5,
      title: "Content Management",
      description: "Official content approval",
      icon: FileText,
      status: "active",
      color: "indigo"
    },
    {
      id: 6,
      title: "Analytics & KPIs",
      description: "Platform metrics monitoring",
      icon: BarChart3,
      status: "active",
      color: "pink"
    },
    {
      id: 7,
      title: "Feature Toggles",
      description: "Feature flag management",
      icon: Settings,
      status: "active",
      color: "cyan"
    }
  ];

  return (
    <Layout title="Admin Dashboard">
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
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
                  <div className="p-2 bg-indigo-100 rounded-lg">
                    <Crown className="h-8 w-8 text-indigo-600" />
                  </div>
                  Admin Dashboard
                </h1>
                <p className="text-gray-600 mt-2">
                  Complete platform oversight and management control
                </p>
              </div>
              <div className="flex items-center gap-4">
                <Badge variant="secondary" className="px-3 py-1 bg-indigo-100 text-indigo-800">
                  <Globe className="h-4 w-4 mr-1" />
                  Super Admin
                </Badge>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="space-y-8">
            {/* Platform Stats Overview */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="grid grid-cols-1 md:grid-cols-4 gap-6"
            >
              <Card className="shadow-lg border-0 bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 mx-auto mb-4 bg-white/20 rounded-full flex items-center justify-center">
                    <Users className="h-6 w-6" />
                  </div>
                  <h3 className="text-2xl font-bold">{data.stats.totalUsers.toLocaleString()}</h3>
                  <p className="text-blue-100 text-sm">Total Users</p>
                </CardContent>
              </Card>
              
              <Card className="shadow-lg border-0 bg-gradient-to-r from-green-500 to-green-600 text-white">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 mx-auto mb-4 bg-white/20 rounded-full flex items-center justify-center">
                    <Activity className="h-6 w-6" />
                  </div>
                  <h3 className="text-2xl font-bold">{data.stats.activeToday.toLocaleString()}</h3>
                  <p className="text-green-100 text-sm">Active Today</p>
                </CardContent>
              </Card>
              
              <Card className="shadow-lg border-0 bg-gradient-to-r from-purple-500 to-purple-600 text-white">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 mx-auto mb-4 bg-white/20 rounded-full flex items-center justify-center">
                    <Calendar className="h-6 w-6" />
                  </div>
                  <h3 className="text-2xl font-bold">{data.stats.totalEvents}</h3>
                  <p className="text-purple-100 text-sm">Total Events</p>
                </CardContent>
              </Card>
              
              <Card className="shadow-lg border-0 bg-gradient-to-r from-orange-500 to-orange-600 text-white">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 mx-auto mb-4 bg-white/20 rounded-full flex items-center justify-center">
                    <AlertTriangle className="h-6 w-6" />
                  </div>
                  <h3 className="text-2xl font-bold">{data.stats.pendingModeration}</h3>
                  <p className="text-orange-100 text-sm">Pending Review</p>
                </CardContent>
              </Card>
            </motion.div>

            {/* Admin Journey Progress */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="shadow-lg border-0">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Crown className="h-6 w-6 text-indigo-600" />
                    Admin Control Center
                  </CardTitle>
                  <CardDescription>
                    Complete platform management and oversight capabilities
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-7 gap-4">
                    {adminJourneyStages.map((stage) => (
                      <div
                        key={stage.id}
                        className={`relative p-4 rounded-lg border-2 transition-all cursor-pointer hover:shadow-md ${
                          stage.status === 'completed' ? 'border-green-200 bg-green-50' :
                          stage.status === 'active' ? 'border-indigo-200 bg-indigo-50' 
                          : 'border-gray-200 bg-gray-50'
                        }`}
                      >
                        <div className="text-center">
                          <div className={`w-12 h-12 mx-auto mb-3 rounded-full flex items-center justify-center ${
                            stage.status === 'completed' ? 'bg-green-500' :
                            stage.status === 'active' ? 'bg-indigo-500' : 'bg-gray-400'
                          }`}>
                            <stage.icon className="h-6 w-6 text-white" />
                          </div>
                          <h3 className="font-semibold text-sm text-gray-900 mb-1">{stage.title}</h3>
                          <p className="text-xs text-gray-600 mb-2">{stage.description}</p>
                          <Badge 
                            variant={stage.status === 'completed' ? 'default' : stage.status === 'active' ? 'secondary' : 'outline'}
                            className={`text-xs ${
                              stage.status === 'completed' ? 'bg-green-100 text-green-800' :
                              stage.status === 'active' ? 'bg-indigo-100 text-indigo-800' :
                              'bg-gray-100 text-gray-600'
                            }`}
                          >
                            {stage.status === 'completed' ? 'Complete' :
                             stage.status === 'active' ? 'Active' : 'Pending'}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Admin Management Tabs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Tabs defaultValue="users" className="space-y-6">
                <TabsList className="grid w-full grid-cols-7">
                  <TabsTrigger value="users">Users</TabsTrigger>
                  <TabsTrigger value="events">Events</TabsTrigger>
                  <TabsTrigger value="moderation">Moderation</TabsTrigger>
                  <TabsTrigger value="content">Content</TabsTrigger>
                  <TabsTrigger value="analytics">Analytics</TabsTrigger>
                  <TabsTrigger value="features">Features</TabsTrigger>
                  <TabsTrigger value="system">System</TabsTrigger>
                </TabsList>

                {/* User Management Tab */}
                <TabsContent value="users">
                  <Card className="shadow-lg border-0">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="flex items-center gap-2">
                            <Users className="h-5 w-5 text-blue-600" />
                            User & Role Management
                          </CardTitle>
                          <CardDescription>Manage user accounts and role assignments</CardDescription>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Filter className="h-4 w-4 mr-2" />
                            Filter
                          </Button>
                          <Button variant="outline" size="sm">
                            <Download className="h-4 w-4 mr-2" />
                            Export
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        {users.data?.data?.length === 0 ? (
                          <div className="text-center py-8 text-gray-500">
                            <Users className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                            <p className="text-lg font-medium">No users found</p>
                            <p className="text-sm">Users will appear here as they register</p>
                          </div>
                        ) : users.data?.data?.map((user: any) => (
                          <div key={user.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                            <div className="flex items-center justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                  <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                                    {(user.name || user.username).split(' ').map((n: string) => n[0]).join('').toUpperCase()}
                                  </div>
                                  <div>
                                    <h4 className="font-semibold text-gray-900">{user.name || user.username}</h4>
                                    <p className="text-sm text-gray-600">{user.email}</p>
                                  </div>
                                  <Badge 
                                    variant={user.status === 'active' ? 'default' : 'secondary'}
                                    className={user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}
                                  >
                                    {user.status}
                                  </Badge>
                                </div>
                                <div className="grid grid-cols-3 gap-4 text-xs text-gray-600">
                                  <div>
                                    <span className="font-medium">Role:</span> {user.role}
                                  </div>
                                  <div>
                                    <span className="font-medium">Last Active:</span> {user.lastActive ? new Date(user.lastActive).toLocaleDateString() : 'Never'}
                                  </div>
                                  <div>
                                    <span className="font-medium">Joined:</span> {user.joinedAt ? new Date(user.joinedAt).toLocaleDateString() : 'Unknown'}
                                  </div>
                                </div>
                              </div>
                              <div className="flex gap-2 ml-4">
                                <Button size="sm" variant="outline">
                                  <Eye className="h-4 w-4 mr-1" />
                                  View
                                </Button>
                                <Button size="sm" variant="outline">
                                  <Edit className="h-4 w-4 mr-1" />
                                  Edit Roles
                                </Button>
                                <Button size="sm" variant="outline" className="text-red-600">
                                  <UserX className="h-4 w-4 mr-1" />
                                  Suspend
                                </Button>
                              </div>
                            </div>
                          </div>
                        )) || []}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Analytics Tab */}
                <TabsContent value="analytics">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card className="shadow-lg border-0">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <BarChart3 className="h-5 w-5 text-indigo-600" />
                          Platform Metrics
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-6">
                        <div className="space-y-4">
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Daily Active Users</span>
                            <span className="font-semibold text-gray-900">{analytics.users?.activeUsers?.toLocaleString() || '0'}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Weekly Retention</span>
                            <span className="font-semibold text-green-600">{analytics.users?.retentionRate || 0}%</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Course Completion</span>
                            <span className="font-semibold text-blue-600">{analytics.engagement?.courseCompletions || 0}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">System Uptime</span>
                            <span className="font-semibold text-purple-600">{analytics.performance?.systemUptime || 0}%</span>
                          </div>
                          <div className="pt-2 border-t">
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-sm text-gray-600">Platform Health</span>
                              <span className="text-sm font-medium text-green-600">{analytics.performance?.systemUptime || 0}%</span>
                            </div>
                            <Progress value={analytics.performance?.systemUptime || 0} className="h-2" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="shadow-lg border-0">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <TrendingUp className="h-5 w-5 text-green-600" />
                          Growth Metrics
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-6">
                        <div className="space-y-4">
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">New Users (30d)</span>
                            <span className="font-semibold text-gray-900">+{analytics.users?.newThisMonth?.toLocaleString() || '0'}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Total Content</span>
                            <span className="font-semibold text-blue-600">{analytics.content?.totalCourses || 0}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Monthly Revenue</span>
                            <span className="font-semibold text-purple-600">${analytics.revenue?.monthlyRevenue?.toLocaleString() || '0'}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Community Posts</span>
                            <span className="font-semibold text-orange-600">{analytics.content?.totalPosts?.toLocaleString() || '0'}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                {/* Feature Toggles Tab */}
                <TabsContent value="features">
                  <Card className="shadow-lg border-0">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Zap className="h-5 w-5 text-yellow-600" />
                        Feature Flag Management
                      </CardTitle>
                      <CardDescription>Control feature rollouts and availability</CardDescription>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        {[
                          {
                            name: "AI Career Coach Beta",
                            description: "Advanced AI-powered career guidance",
                            enabled: true,
                            cohort: "Premium Users",
                            usage: "87% adoption"
                          },
                          {
                            name: "Live Video Sessions",
                            description: "Real-time mentor video calls",
                            enabled: true,
                            cohort: "All Users",
                            usage: "64% adoption"
                          },
                          {
                            name: "Advanced Analytics",
                            description: "Detailed learning progress tracking",
                            enabled: false,
                            cohort: "Beta Testers",
                            usage: "Testing phase"
                          },
                          {
                            name: "Mobile App Push Notifications",
                            description: "Real-time mobile notifications",
                            enabled: true,
                            cohort: "Mobile Users",
                            usage: "92% adoption"
                          }
                        ].map((feature, index) => (
                          <div key={index} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                            <div className="flex items-center justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                  <div className="flex items-center">
                                    {feature.enabled ? (
                                      <ToggleRight className="h-6 w-6 text-green-500" />
                                    ) : (
                                      <ToggleLeft className="h-6 w-6 text-gray-400" />
                                    )}
                                  </div>
                                  <div>
                                    <h4 className="font-semibold text-gray-900">{feature.name}</h4>
                                    <p className="text-sm text-gray-600">{feature.description}</p>
                                  </div>
                                  <Badge variant="outline" className="ml-auto">
                                    {feature.enabled ? 'Enabled' : 'Disabled'}
                                  </Badge>
                                </div>
                                <div className="grid grid-cols-2 gap-4 text-xs text-gray-600">
                                  <div>
                                    <span className="font-medium">Cohort:</span> {feature.cohort}
                                  </div>
                                  <div>
                                    <span className="font-medium">Usage:</span> {feature.usage}
                                  </div>
                                </div>
                              </div>
                              <div className="flex gap-2 ml-4">
                                <Button size="sm" variant="outline">
                                  <Edit className="h-4 w-4 mr-1" />
                                  Configure
                                </Button>
                                <Button size="sm" variant={feature.enabled ? "outline" : "default"}>
                                  {feature.enabled ? 'Disable' : 'Enable'}
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* System Tab */}
                <TabsContent value="system">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card className="shadow-lg border-0">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Database className="h-5 w-5 text-blue-600" />
                          System Health
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-6">
                        <div className="space-y-4">
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Server Uptime</span>
                            <span className="font-semibold text-green-600">99.9%</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Database Health</span>
                            <span className="font-semibold text-green-600">Optimal</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">API Response Time</span>
                            <span className="font-semibold text-blue-600">127ms</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Storage Usage</span>
                            <span className="font-semibold text-orange-600">67%</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="shadow-lg border-0">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Bell className="h-5 w-5 text-orange-600" />
                          System Alerts
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-6">
                        <div className="space-y-3">
                          {[
                            {
                              type: "info",
                              message: "Scheduled maintenance: Dec 25, 2AM-4AM",
                              time: "2h ago"
                            },
                            {
                              type: "warning",
                              message: "High traffic detected - auto-scaling initiated",
                              time: "1d ago"
                            },
                            {
                              type: "success",
                              message: "Database backup completed successfully",
                              time: "2d ago"
                            }
                          ].map((alert, index) => (
                            <div key={index} className={`p-3 rounded-lg border-l-4 ${
                              alert.type === 'info' ? 'border-blue-400 bg-blue-50' :
                              alert.type === 'warning' ? 'border-orange-400 bg-orange-50' :
                              'border-green-400 bg-green-50'
                            }`}>
                              <p className="text-sm font-medium text-gray-900">{alert.message}</p>
                              <p className="text-xs text-gray-600 mt-1">{alert.time}</p>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                {/* Quick placeholders for other tabs */}
                <TabsContent value="events">
                  <Card className="shadow-lg border-0">
                    <CardHeader>
                      <CardTitle>Event Management</CardTitle>
                      <CardDescription>Manage platform events and notifications</CardDescription>
                    </CardHeader>
                    <CardContent className="p-6">
                      <p className="text-gray-600">Event management interface coming soon...</p>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="moderation">
                  <Card className="shadow-lg border-0">
                    <CardHeader>
                      <CardTitle>Moderation Oversight</CardTitle>
                      <CardDescription>Monitor and manage moderation activities</CardDescription>
                    </CardHeader>
                    <CardContent className="p-6">
                      <p className="text-gray-600">Moderation oversight interface coming soon...</p>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="content">
                  <Card className="shadow-lg border-0">
                    <CardHeader>
                      <CardTitle>Content Management</CardTitle>
                      <CardDescription>Approve and manage official platform content</CardDescription>
                    </CardHeader>
                    <CardContent className="p-6">
                      <p className="text-gray-600">Content management interface coming soon...</p>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </motion.div>
          </div>
        </div>
      </div>
    </Layout>
  );
}