import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
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
  Bell,
  FolderOpen
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
                <TabsList className="flex items-center justify-between">
                  <TabsTrigger value="users">Users</TabsTrigger>
                  <TabsTrigger value="experts">Experts</TabsTrigger>
                  <TabsTrigger value="sessions">Sessions</TabsTrigger>
                  <TabsTrigger value="careers">Careers</TabsTrigger>
                  <TabsTrigger value="community">Community</TabsTrigger>
                  <TabsTrigger value="content">Content</TabsTrigger>
                  <TabsTrigger value="analytics">Analytics</TabsTrigger>
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

                {/* Expert Management Tab */}
                <TabsContent value="experts">
                  <Card className="shadow-lg border-0">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="flex items-center gap-2">
                            <Users className="h-5 w-5 text-purple-600" />
                            Expert Network Management
                          </CardTitle>
                          <CardDescription>Manage industry experts, sessions, and networking events</CardDescription>
                        </div>
                        <Link href="/experts">
                          <Button className="bg-purple-600 hover:bg-purple-700">
                            <Users className="h-4 w-4 mr-2" />
                            Manage Experts
                          </Button>
                        </Link>
                      </div>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg p-6 text-white">
                          <h3 className="text-lg font-semibold mb-2">Total Experts</h3>
                          <p className="text-3xl font-bold">0</p>
                          <p className="text-purple-100 text-sm mt-2">Industry professionals</p>
                        </div>
                        <div className="bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg p-6 text-white">
                          <h3 className="text-lg font-semibold mb-2">Active Sessions</h3>
                          <p className="text-3xl font-bold">0</p>
                          <p className="text-blue-100 text-sm mt-2">Upcoming expert sessions</p>
                        </div>
                        <div className="bg-gradient-to-br from-green-500 to-teal-500 rounded-lg p-6 text-white">
                          <h3 className="text-lg font-semibold mb-2">Success Stories</h3>
                          <p className="text-3xl font-bold">0</p>
                          <p className="text-green-100 text-sm mt-2">Career transformation stories</p>
                        </div>
                      </div>
                      <div className="mt-8 text-center">
                        <p className="text-gray-600 mb-4">Start building your expert network by adding industry professionals</p>
                        <Link href="/experts">
                          <Button size="lg" className="bg-purple-600 hover:bg-purple-700">
                            Get Started with Expert Management
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Session Management Tab */}
                <TabsContent value="sessions">
                  <Card className="shadow-lg border-0">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="flex items-center gap-2">
                            <Calendar className="h-5 w-5 text-orange-600" />
                            Session & Event Management
                          </CardTitle>
                          <CardDescription>Manage expert sessions and networking events</CardDescription>
                        </div>
                        <Link href="/sessions">
                          <Button className="bg-orange-600 hover:bg-orange-700">
                            <Calendar className="h-4 w-4 mr-2" />
                            Manage Sessions
                          </Button>
                        </Link>
                      </div>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div className="space-y-3">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-100 rounded-lg">
                              <Users className="h-5 w-5 text-blue-600" />
                            </div>
                            <div>
                              <p className="text-sm text-gray-600">Expert Sessions</p>
                              <p className="text-lg font-semibold">Create & Manage</p>
                            </div>
                          </div>
                          <p className="text-sm text-gray-500">One-on-one mentoring, group sessions, and workshops</p>
                        </div>

                        <div className="space-y-3">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-green-100 rounded-lg">
                              <Calendar className="h-5 w-5 text-green-600" />
                            </div>
                            <div>
                              <p className="text-sm text-gray-600">Networking Events</p>
                              <p className="text-lg font-semibold">Schedule & Track</p>
                            </div>
                          </div>
                          <p className="text-sm text-gray-500">Webinars, conferences, and networking meetups</p>
                        </div>

                        <div className="space-y-3">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-purple-100 rounded-lg">
                              <BarChart3 className="h-5 w-5 text-purple-600" />
                            </div>
                            <div>
                              <p className="text-sm text-gray-600">Event Analytics</p>
                              <p className="text-lg font-semibold">Performance Insights</p>
                            </div>
                          </div>
                          <p className="text-sm text-gray-500">Attendance tracking and engagement metrics</p>
                        </div>
                      </div>

                      <div className="mt-6 p-4 bg-orange-50 rounded-lg border border-orange-200">
                        <div className="flex items-start gap-3">
                          <Calendar className="h-5 w-5 text-orange-600 mt-0.5" />
                          <div>
                            <h4 className="font-medium text-orange-900">Session Management Features</h4>
                            <p className="text-sm text-orange-700 mt-1">
                              Create expert-led sessions, schedule networking events, manage participants, 
                              and track engagement metrics. Set up pricing, manage registrations, and 
                              monitor event success.
                            </p>
                            <ul className="text-sm text-orange-600 mt-2 space-y-1">
                              <li>• Expert session scheduling and management</li>
                              <li>• Networking event creation and tracking</li>
                              <li>• Participant management and notifications</li>
                              <li>• Event analytics and performance metrics</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Career Management Tab */}
                <TabsContent value="careers">
                  <Card className="shadow-lg border-0">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="flex items-center gap-2">
                            <BarChart3 className="h-5 w-5 text-green-600" />
                            Career Path Management
                          </CardTitle>
                          <CardDescription>Manage career options, assessments, and roadmaps</CardDescription>
                        </div>
                        <Link href="/careers">
                          <Button className="bg-green-600 hover:bg-green-700">
                            <BarChart3 className="h-4 w-4 mr-2" />
                            Manage Careers
                          </Button>
                        </Link>
                      </div>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div className="space-y-3">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-100 rounded-lg">
                              <BarChart3 className="h-5 w-5 text-blue-600" />
                            </div>
                            <div>
                              <p className="text-sm text-gray-600">Career Options</p>
                              <p className="text-lg font-semibold">Create & Manage</p>
                            </div>
                          </div>
                          <p className="text-sm text-gray-500">Add and manage available career paths for students</p>
                        </div>

                        <div className="space-y-3">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-green-100 rounded-lg">
                              <FileText className="h-5 w-5 text-green-600" />
                            </div>
                            <div>
                              <p className="text-sm text-gray-600">Career Roadmaps</p>
                              <p className="text-lg font-semibold">Skills & Resources</p>
                            </div>
                          </div>
                          <p className="text-sm text-gray-500">Define skills, courses, and resources for each career path</p>
                        </div>

                        <div className="space-y-3">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-purple-100 rounded-lg">
                              <Users className="h-5 w-5 text-purple-600" />
                            </div>
                            <div>
                              <p className="text-sm text-gray-600">Assessments</p>
                              <p className="text-lg font-semibold">Career Matching</p>
                            </div>
                          </div>
                          <p className="text-sm text-gray-500">Configure assessment questions and career matching logic</p>
                        </div>
                      </div>

                      <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
                        <div className="flex items-start gap-3">
                          <BarChart3 className="h-5 w-5 text-green-600 mt-0.5" />
                          <div>
                            <h4 className="font-medium text-green-900">Career Management Features</h4>
                            <p className="text-sm text-green-700 mt-1">
                              Create and manage career options that will be recommended to students. Define 
                              comprehensive roadmaps with skills, courses, projects, and resources for each career path.
                            </p>
                            <ul className="text-sm text-green-600 mt-2 space-y-1">
                              <li>• Dynamic career options with salary ranges</li>
                              <li>• Skill-based career roadmaps</li>
                              <li>• Assessment questions and matching algorithms</li>
                              <li>• Course and resource recommendations</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Community Management Tab */}
                <TabsContent value="community">
                  <Card className="shadow-lg border-0">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="flex items-center gap-2">
                            <Users className="h-5 w-5 text-purple-600" />
                            Community Feature Management
                          </CardTitle>
                          <CardDescription>Manage community cards displayed to users</CardDescription>
                        </div>
                        <Link href="/admin/community">
                          <Button className="bg-purple-600 hover:bg-purple-700">
                            <Users className="h-4 w-4 mr-2" />
                            Manage Community
                          </Button>
                        </Link>
                      </div>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="space-y-3">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-100 rounded-lg">
                              <Users className="h-5 w-5 text-blue-600" />
                            </div>
                            <div>
                              <p className="text-sm text-gray-600">Communities</p>
                              <p className="text-lg font-semibold">Manage Cards</p>
                            </div>
                          </div>
                          <p className="text-sm text-gray-500">Create and manage community group cards</p>
                        </div>

                        <div className="space-y-3">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-green-100 rounded-lg">
                              <FolderOpen className="h-5 w-5 text-green-600" />
                            </div>
                            <div>
                              <p className="text-sm text-gray-600">Projects</p>
                              <p className="text-lg font-semibold">Project Cards</p>
                            </div>
                          </div>
                          <p className="text-sm text-gray-500">Manage collaborative project opportunities</p>
                        </div>

                        <div className="space-y-3">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-orange-100 rounded-lg">
                              <Calendar className="h-5 w-5 text-orange-600" />
                            </div>
                            <div>
                              <p className="text-sm text-gray-600">Events</p>
                              <p className="text-lg font-semibold">Event Cards</p>
                            </div>
                          </div>
                          <p className="text-sm text-gray-500">Create and promote community events</p>
                        </div>

                        <div className="space-y-3">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-purple-100 rounded-lg">
                              <Crown className="h-5 w-5 text-purple-600" />
                            </div>
                            <div>
                              <p className="text-sm text-gray-600">Competitions</p>
                              <p className="text-lg font-semibold">Contest Cards</p>
                            </div>
                          </div>
                          <p className="text-sm text-gray-500">Showcase competitions and challenges</p>
                        </div>
                      </div>

                      <div className="mt-6 p-4 bg-purple-50 rounded-lg border border-purple-200">
                        <div className="flex items-start gap-3">
                          <Users className="h-5 w-5 text-purple-600 mt-0.5" />
                          <div>
                            <h4 className="font-medium text-purple-900">Community Management Features</h4>
                            <p className="text-sm text-purple-700 mt-1">
                              Create and manage community feature cards that redirect users to external platforms. 
                              Each card can have a title, description, image, and redirect URL that opens in a new tab.
                            </p>
                            <ul className="text-sm text-purple-600 mt-2 space-y-1">
                              <li>• Community group cards with external links</li>
                              <li>• Project collaboration opportunities</li>
                              <li>• Event promotion and registration</li>
                              <li>• Competition and challenge showcases</li>
                            </ul>
                          </div>
                        </div>
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

                {/* Other tabs remain the same... */}
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

                <TabsContent value="features">
                  <Card className="shadow-lg border-0">
                    <CardHeader>
                      <CardTitle>Feature Management</CardTitle>
                      <CardDescription>Control feature rollouts and availability</CardDescription>
                    </CardHeader>
                    <CardContent className="p-6">
                      <p className="text-gray-600">Feature management interface coming soon...</p>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="system">
                  <Card className="shadow-lg border-0">
                    <CardHeader>
                      <CardTitle>System Status</CardTitle>
                      <CardDescription>Monitor system health and performance</CardDescription>
                    </CardHeader>
                    <CardContent className="p-6">
                      <p className="text-gray-600">System monitoring interface coming soon...</p>
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