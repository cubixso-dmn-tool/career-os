import { useQuery } from "@tanstack/react-query";
import Layout from "@/components/layout/Layout";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BarChart3,
  Users,
  TrendingUp,
  DollarSign,
  Activity,
  Globe,
  Zap,
  Target,
  Clock,
  Database,
  BookOpen,
  MessageSquare,
  Award
} from "lucide-react";

export default function AdminAnalytics() {
  const { data: analyticsData, isLoading, error } = useQuery({
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

  const analytics = analyticsData?.data || {};

  if (isLoading) {
    return (
      <Layout title="Analytics Dashboard">
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading analytics data...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout title="Analytics Dashboard">
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <p className="text-red-600">Error loading analytics data. Please check your permissions.</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Analytics Dashboard">
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-8 mb-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <BarChart3 className="h-8 w-8 text-purple-600" />
                  </div>
                  Analytics Dashboard
                </h1>
                <p className="text-gray-600 mt-2">
                  Comprehensive platform metrics and insights
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-sm text-gray-600">
                  Last updated: {new Date().toLocaleDateString()}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-8">
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="users">Users</TabsTrigger>
              <TabsTrigger value="content">Content</TabsTrigger>
              <TabsTrigger value="engagement">Engagement</TabsTrigger>
              <TabsTrigger value="performance">Performance</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                  <CardContent className="p-6 text-center">
                    <div className="w-12 h-12 mx-auto mb-4 bg-white/20 rounded-full flex items-center justify-center">
                      <Users className="h-6 w-6" />
                    </div>
                    <h3 className="text-2xl font-bold">{analytics.users?.total?.toLocaleString() || '0'}</h3>
                    <p className="text-blue-100 text-sm">Total Users</p>
                  </CardContent>
                </Card>
                
                <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
                  <CardContent className="p-6 text-center">
                    <div className="w-12 h-12 mx-auto mb-4 bg-white/20 rounded-full flex items-center justify-center">
                      <Activity className="h-6 w-6" />
                    </div>
                    <h3 className="text-2xl font-bold">{analytics.users?.activeUsers?.toLocaleString() || '0'}</h3>
                    <p className="text-green-100 text-sm">Active Users</p>
                  </CardContent>
                </Card>
                
                <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
                  <CardContent className="p-6 text-center">
                    <div className="w-12 h-12 mx-auto mb-4 bg-white/20 rounded-full flex items-center justify-center">
                      <BookOpen className="h-6 w-6" />
                    </div>
                    <h3 className="text-2xl font-bold">{analytics.content?.totalCourses || '0'}</h3>
                    <p className="text-purple-100 text-sm">Total Courses</p>
                  </CardContent>
                </Card>
                
                <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
                  <CardContent className="p-6 text-center">
                    <div className="w-12 h-12 mx-auto mb-4 bg-white/20 rounded-full flex items-center justify-center">
                      <DollarSign className="h-6 w-6" />
                    </div>
                    <h3 className="text-2xl font-bold">${analytics.revenue?.monthlyRevenue?.toLocaleString() || '0'}</h3>
                    <p className="text-orange-100 text-sm">Monthly Revenue</p>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-green-600" />
                      Growth Metrics
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">User Growth Rate</span>
                        <span className="font-semibold text-green-600">+{analytics.users?.growthRate || 0}%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">New Users (30d)</span>
                        <span className="font-semibold text-gray-900">{analytics.users?.newThisMonth?.toLocaleString() || '0'}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Retention Rate</span>
                        <span className="font-semibold text-blue-600">{analytics.users?.retentionRate || 0}%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Conversion Rate</span>
                        <span className="font-semibold text-purple-600">{analytics.revenue?.conversionRate || 0}%</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Globe className="h-5 w-5 text-blue-600" />
                      Platform Health
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm text-gray-600">System Uptime</span>
                          <span className="text-sm font-medium text-green-600">{analytics.performance?.systemUptime || 0}%</span>
                        </div>
                        <Progress value={analytics.performance?.systemUptime || 0} className="h-2" />
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Avg Response Time</span>
                        <span className="font-semibold text-gray-900">{analytics.performance?.avgResponseTime || 0}ms</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Error Rate</span>
                        <span className="font-semibold text-red-600">{analytics.performance?.errorRate || 0}%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Database Size</span>
                        <span className="font-semibold text-gray-900">{analytics.performance?.databaseSize || 0} GB</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Users Tab */}
            <TabsContent value="users">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <Card>
                  <CardContent className="p-6 text-center">
                    <div className="w-12 h-12 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
                      <Users className="h-6 w-6 text-blue-600" />
                    </div>
                    <h3 className="text-2xl font-bold">{analytics.users?.total?.toLocaleString() || '0'}</h3>
                    <p className="text-gray-600 text-sm">Total Users</p>
                    <p className="text-xs text-green-600 mt-1">+{analytics.users?.growthRate || 0}% growth</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-6 text-center">
                    <div className="w-12 h-12 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
                      <Activity className="h-6 w-6 text-green-600" />
                    </div>
                    <h3 className="text-2xl font-bold">{analytics.users?.activeUsers?.toLocaleString() || '0'}</h3>
                    <p className="text-gray-600 text-sm">Active Users</p>
                    <p className="text-xs text-blue-600 mt-1">{analytics.users?.retentionRate || 0}% retention</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-6 text-center">
                    <div className="w-12 h-12 mx-auto mb-4 bg-purple-100 rounded-full flex items-center justify-center">
                      <TrendingUp className="h-6 w-6 text-purple-600" />
                    </div>
                    <h3 className="text-2xl font-bold">{analytics.users?.newThisMonth?.toLocaleString() || '0'}</h3>
                    <p className="text-gray-600 text-sm">New This Month</p>
                    <p className="text-xs text-purple-600 mt-1">Monthly growth</p>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>User Demographics & Behavior</CardTitle>
                  <CardDescription>Detailed user analytics and engagement patterns</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h4 className="font-medium text-gray-900">User Growth</h4>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Daily Active Users</span>
                          <span className="font-medium">{analytics.users?.activeUsers?.toLocaleString() || '0'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Weekly Retention</span>
                          <span className="font-medium">{analytics.users?.retentionRate || 0}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Monthly Growth</span>
                          <span className="font-medium text-green-600">+{analytics.users?.growthRate || 0}%</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <h4 className="font-medium text-gray-900">User Engagement</h4>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Avg Session Duration</span>
                          <span className="font-medium">{analytics.engagement?.avgSessionDuration || 0} min</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Total Sessions</span>
                          <span className="font-medium">{analytics.engagement?.totalSessions?.toLocaleString() || '0'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Course Completions</span>
                          <span className="font-medium">{analytics.engagement?.courseCompletions?.toLocaleString() || '0'}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Content Tab */}
            <TabsContent value="content">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <Card>
                  <CardContent className="p-6 text-center">
                    <div className="w-12 h-12 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
                      <BookOpen className="h-6 w-6 text-blue-600" />
                    </div>
                    <h3 className="text-2xl font-bold">{analytics.content?.totalCourses || '0'}</h3>
                    <p className="text-gray-600 text-sm">Total Courses</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-6 text-center">
                    <div className="w-12 h-12 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
                      <Target className="h-6 w-6 text-green-600" />
                    </div>
                    <h3 className="text-2xl font-bold">{analytics.content?.totalProjects || '0'}</h3>
                    <p className="text-gray-600 text-sm">Total Projects</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-6 text-center">
                    <div className="w-12 h-12 mx-auto mb-4 bg-purple-100 rounded-full flex items-center justify-center">
                      <MessageSquare className="h-6 w-6 text-purple-600" />
                    </div>
                    <h3 className="text-2xl font-bold">{analytics.content?.totalPosts?.toLocaleString() || '0'}</h3>
                    <p className="text-gray-600 text-sm">Community Posts</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-6 text-center">
                    <div className="w-12 h-12 mx-auto mb-4 bg-orange-100 rounded-full flex items-center justify-center">
                      <Award className="h-6 w-6 text-orange-600" />
                    </div>
                    <h3 className="text-2xl font-bold">{analytics.content?.approvedContent || '0'}%</h3>
                    <p className="text-gray-600 text-sm">Approved Content</p>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Content Performance</CardTitle>
                  <CardDescription>Content creation and engagement metrics</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-medium text-gray-900 mb-3">Content Library</h4>
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Total Courses</span>
                            <span className="font-medium">{analytics.content?.totalCourses || '0'}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Total Projects</span>
                            <span className="font-medium">{analytics.content?.totalProjects || '0'}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Community Posts</span>
                            <span className="font-medium">{analytics.content?.totalPosts?.toLocaleString() || '0'}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-medium text-gray-900 mb-3">Content Quality</h4>
                        <div className="space-y-3">
                          <div>
                            <div className="flex justify-between items-center mb-1">
                              <span className="text-sm text-gray-600">Approved Content</span>
                              <span className="text-sm font-medium">{analytics.content?.approvedContent || 0}%</span>
                            </div>
                            <Progress value={analytics.content?.approvedContent || 0} className="h-2" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Engagement Tab */}
            <TabsContent value="engagement">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <Card>
                  <CardContent className="p-6 text-center">
                    <div className="w-12 h-12 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
                      <Clock className="h-6 w-6 text-blue-600" />
                    </div>
                    <h3 className="text-2xl font-bold">{analytics.engagement?.avgSessionDuration || '0'}</h3>
                    <p className="text-gray-600 text-sm">Avg Session (min)</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-6 text-center">
                    <div className="w-12 h-12 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
                      <Activity className="h-6 w-6 text-green-600" />
                    </div>
                    <h3 className="text-2xl font-bold">{analytics.engagement?.totalSessions?.toLocaleString() || '0'}</h3>
                    <p className="text-gray-600 text-sm">Total Sessions</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-6 text-center">
                    <div className="w-12 h-12 mx-auto mb-4 bg-purple-100 rounded-full flex items-center justify-center">
                      <BookOpen className="h-6 w-6 text-purple-600" />
                    </div>
                    <h3 className="text-2xl font-bold">{analytics.engagement?.courseCompletions?.toLocaleString() || '0'}</h3>
                    <p className="text-gray-600 text-sm">Course Completions</p>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>User Engagement Details</CardTitle>
                  <CardDescription>Detailed engagement metrics and user behavior</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-medium text-gray-900 mb-3">Session Analytics</h4>
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Total Sessions</span>
                            <span className="font-medium">{analytics.engagement?.totalSessions?.toLocaleString() || '0'}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Avg Session Duration</span>
                            <span className="font-medium">{analytics.engagement?.avgSessionDuration || 0} minutes</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Course Completions</span>
                            <span className="font-medium">{analytics.engagement?.courseCompletions?.toLocaleString() || '0'}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-medium text-gray-900 mb-3">Community Engagement</h4>
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Community Posts</span>
                            <span className="font-medium">{analytics.engagement?.communityPosts?.toLocaleString() || '0'}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Total Content</span>
                            <span className="font-medium">{analytics.content?.totalPosts?.toLocaleString() || '0'}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Performance Tab */}
            <TabsContent value="performance">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <Card>
                  <CardContent className="p-6 text-center">
                    <div className="w-12 h-12 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
                      <Zap className="h-6 w-6 text-green-600" />
                    </div>
                    <h3 className="text-2xl font-bold">{analytics.performance?.systemUptime || '0'}%</h3>
                    <p className="text-gray-600 text-sm">System Uptime</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-6 text-center">
                    <div className="w-12 h-12 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
                      <Clock className="h-6 w-6 text-blue-600" />
                    </div>
                    <h3 className="text-2xl font-bold">{analytics.performance?.avgResponseTime || '0'}ms</h3>
                    <p className="text-gray-600 text-sm">Response Time</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-6 text-center">
                    <div className="w-12 h-12 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
                      <Activity className="h-6 w-6 text-red-600" />
                    </div>
                    <h3 className="text-2xl font-bold">{analytics.performance?.errorRate || '0'}%</h3>
                    <p className="text-gray-600 text-sm">Error Rate</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-6 text-center">
                    <div className="w-12 h-12 mx-auto mb-4 bg-purple-100 rounded-full flex items-center justify-center">
                      <Database className="h-6 w-6 text-purple-600" />
                    </div>
                    <h3 className="text-2xl font-bold">{analytics.performance?.databaseSize || '0'} GB</h3>
                    <p className="text-gray-600 text-sm">Database Size</p>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>System Performance</CardTitle>
                  <CardDescription>Detailed system health and performance metrics</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">System Health</h4>
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm text-gray-600">System Uptime</span>
                            <span className="text-sm font-medium text-green-600">{analytics.performance?.systemUptime || 0}%</span>
                          </div>
                          <Progress value={analytics.performance?.systemUptime || 0} className="h-2" />
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Response Time</span>
                            <span className="font-medium">{analytics.performance?.avgResponseTime || 0}ms</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Error Rate</span>
                            <span className="font-medium text-red-600">{analytics.performance?.errorRate || 0}%</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Database Size</span>
                            <span className="font-medium">{analytics.performance?.databaseSize || 0} GB</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
}