import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useLocation } from "wouter";
import LogoutButton from "@/components/auth/LogoutButton";
import MobileSidebar from "@/components/layout/MobileSidebar";
import MobileHeader from '@/components/ui/mobile-header';
import { useAuth } from '@/hooks/useAuth';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Shield, 
  Users, 
  Calendar, 
  Database, 
  BarChart3, 
  Settings, 
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Clock,
  TrendingUp,
  TrendingDown,
  Activity,
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
  Filter,
  Server,
  Zap,
  Monitor,
  HardDrive,
  Cpu,
  Wifi
} from "lucide-react";
import { motion } from "framer-motion";

export default function AdminDashboard() {
  const [selectedPeriod, setSelectedPeriod] = useState("24h");
  
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
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
        {/* Header Section */}
        <div className="bg-gray-800 border-b border-gray-700 px-6 py-8">
          <div className="max-w-7xl mx-auto">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-between"
            >
              <div>
                <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                  <div className="p-2 bg-red-600 rounded-lg">
                    <Shield className="h-8 w-8 text-white" />
                  </div>
                  System Control Center
                </h1>
                <p className="text-gray-300 mt-2">
                  Full platform oversight and administrative control
                </p>
              </div>
              <div className="flex items-center gap-4">
                <Badge variant="secondary" className="bg-red-600 text-white border-red-500">
                  Administrator
                </Badge>
                <Button size="sm" className="bg-red-600 hover:bg-red-700 text-white">
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  Emergency Mode
                </Button>
              </div>
            </motion.div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* System Status */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8"
          >
            <Card className="bg-green-600 text-white border-0">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-100 text-sm">System Status</p>
                    <p className="text-2xl font-bold">Online</p>
                  </div>
                  <CheckCircle2 className="h-8 w-8 text-green-200" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-blue-600 text-white border-0">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100 text-sm">Active Users</p>
                    <p className="text-2xl font-bold">2,847</p>
                  </div>
                  <Users className="h-8 w-8 text-blue-200" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-yellow-600 text-white border-0">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-yellow-100 text-sm">Pending Alerts</p>
                    <p className="text-2xl font-bold">7</p>
                  </div>
                  <AlertTriangle className="h-8 w-8 text-yellow-200" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-purple-600 text-white border-0">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-100 text-sm">Server Load</p>
                    <p className="text-2xl font-bold">23%</p>
                  </div>
                  <Server className="h-8 w-8 text-purple-200" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-orange-600 text-white border-0">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-orange-100 text-sm">DB Size</p>
                    <p className="text-2xl font-bold">8.2GB</p>
                  </div>
                  <Database className="h-8 w-8 text-orange-200" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Main Control Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Left Column - System Monitoring */}
            <div className="lg:col-span-3 space-y-6">
              {/* Real-time Monitoring */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Card className="bg-gray-800 text-white border-gray-700">
                  <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-t-lg">
                    <CardTitle className="flex items-center gap-2">
                      <Monitor className="h-5 w-5" />
                      Real-time System Monitoring
                    </CardTitle>
                    <CardDescription className="text-blue-100">
                      Live system performance and health metrics
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {/* CPU Usage */}
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Cpu className="h-4 w-4 text-blue-400" />
                            <span className="text-sm text-gray-300">CPU Usage</span>
                          </div>
                          <span className="text-lg font-bold text-green-400">23%</span>
                        </div>
                        <Progress value={23} className="h-3 bg-gray-700" />
                        <div className="text-xs text-gray-400">4 cores available</div>
                      </div>

                      {/* Memory Usage */}
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <HardDrive className="h-4 w-4 text-purple-400" />
                            <span className="text-sm text-gray-300">Memory</span>
                          </div>
                          <span className="text-lg font-bold text-yellow-400">67%</span>
                        </div>
                        <Progress value={67} className="h-3 bg-gray-700" />
                        <div className="text-xs text-gray-400">16GB total</div>
                      </div>

                      {/* Network */}
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Wifi className="h-4 w-4 text-green-400" />
                            <span className="text-sm text-gray-300">Network</span>
                          </div>
                          <span className="text-lg font-bold text-green-400">Active</span>
                        </div>
                        <Progress value={85} className="h-3 bg-gray-700" />
                        <div className="text-xs text-gray-400">156 active connections</div>
                      </div>
                    </div>

                    {/* Recent System Events */}
                    <div className="mt-6 pt-6 border-t border-gray-700">
                      <h4 className="text-sm font-semibold text-gray-300 mb-4">Recent System Events</h4>
                      <div className="space-y-2">
                        {[
                          { time: "14:23", event: "User authentication spike detected", status: "info" },
                          { time: "14:15", event: "Database backup completed successfully", status: "success" },
                          { time: "13:45", event: "Memory usage exceeded 80% threshold", status: "warning" },
                          { time: "13:30", event: "New deployment rolled out to production", status: "info" }
                        ].map((log, index) => (
                          <div key={index} className="flex items-center gap-3 text-sm">
                            <span className="text-gray-500 font-mono">{log.time}</span>
                            <div className={`w-2 h-2 rounded-full ${
                              log.status === 'success' ? 'bg-green-500' :
                              log.status === 'warning' ? 'bg-yellow-500' : 'bg-blue-500'
                            }`}></div>
                            <span className="text-gray-300">{log.event}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* User & Content Management */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* User Management */}
                  <Card className="bg-gray-800 text-white border-gray-700">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <Users className="h-5 w-5 text-blue-400" />
                        User Management
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="text-center p-3 bg-blue-900/50 rounded-lg">
                          <div className="text-2xl font-bold text-blue-400">2,534</div>
                          <div className="text-xs text-gray-400">Students</div>
                        </div>
                        <div className="text-center p-3 bg-purple-900/50 rounded-lg">
                          <div className="text-2xl font-bold text-purple-400">89</div>
                          <div className="text-xs text-gray-400">Mentors</div>
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <Button variant="outline" size="sm" className="w-full border-gray-600 text-gray-300 hover:bg-gray-700">
                          <UserPlus className="h-4 w-4 mr-2" />
                          Create User
                        </Button>
                        <Button variant="outline" size="sm" className="w-full border-gray-600 text-gray-300 hover:bg-gray-700">
                          <Edit3 className="h-4 w-4 mr-2" />
                          Manage Roles
                        </Button>
                        <Button variant="outline" size="sm" className="w-full border-gray-600 text-gray-300 hover:bg-gray-700">
                          <Download className="h-4 w-4 mr-2" />
                          Export Data
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Content Moderation */}
                  <Card className="bg-gray-800 text-white border-gray-700">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <Flag className="h-5 w-5 text-red-400" />
                        Content Moderation
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="space-y-4 mb-6">
                        {[
                          { type: "Flagged Posts", count: 7, color: "red" },
                          { type: "User Reports", count: 3, color: "yellow" },
                          { type: "Pending Reviews", count: 12, color: "blue" }
                        ].map((item, index) => (
                          <div key={index} className="flex items-center justify-between p-2 bg-gray-700/50 rounded-lg">
                            <span className="text-sm text-gray-300">{item.type}</span>
                            <Badge variant="secondary" className={`bg-${item.color}-600 text-white`}>
                              {item.count}
                            </Badge>
                          </div>
                        ))}
                      </div>
                      
                      <div className="space-y-3">
                        <Button variant="outline" size="sm" className="w-full border-gray-600 text-gray-300 hover:bg-gray-700">
                          <Eye className="h-4 w-4 mr-2" />
                          Review Queue
                        </Button>
                        <Button variant="outline" size="sm" className="w-full border-gray-600 text-gray-300 hover:bg-gray-700">
                          <Settings className="h-4 w-4 mr-2" />
                          Moderation Rules
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </motion.div>

              {/* Platform Analytics */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Card className="bg-gray-800 text-white border-gray-700">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="h-5 w-5 text-green-400" />
                      Platform Analytics Overview
                    </CardTitle>
                    <CardDescription className="text-gray-400">
                      Key performance indicators and growth metrics
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-green-400 mb-1">↑12%</div>
                        <div className="text-sm text-gray-400">User Growth</div>
                        <div className="text-xs text-green-400">vs last month</div>
                      </div>
                      <div className="text-center">
                        <div className="text-3xl font-bold text-blue-400 mb-1">1,234</div>
                        <div className="text-sm text-gray-400">Course Enrollments</div>
                        <div className="text-xs text-blue-400">this month</div>
                      </div>
                      <div className="text-center">
                        <div className="text-3xl font-bold text-purple-400 mb-1">85%</div>
                        <div className="text-sm text-gray-400">Session Success Rate</div>
                        <div className="text-xs text-purple-400">mentor sessions</div>
                      </div>
                      <div className="text-center">
                        <div className="text-3xl font-bold text-orange-400 mb-1">₹45.6k</div>
                        <div className="text-sm text-gray-400">Revenue</div>
                        <div className="text-xs text-orange-400">this month</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Right Column - Quick Actions & Alerts */}
            <div className="space-y-6">
              {/* Emergency Controls */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Card className="bg-red-900 text-white border-red-700">
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <Zap className="h-4 w-4" />
                      Emergency Controls
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 space-y-3">
                    <Button variant="destructive" size="sm" className="w-full bg-red-600 hover:bg-red-700">
                      <AlertTriangle className="h-4 w-4 mr-2" />
                      Emergency Shutdown
                    </Button>
                    <Button variant="outline" size="sm" className="w-full border-red-600 text-red-300 hover:bg-red-800">
                      <Settings className="h-4 w-4 mr-2" />
                      Maintenance Mode
                    </Button>
                    <Button variant="outline" size="sm" className="w-full border-red-600 text-red-300 hover:bg-red-800">
                      <Upload className="h-4 w-4 mr-2" />
                      Force Backup
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Active Alerts */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Card className="bg-gray-800 text-white border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-yellow-400" />
                      Active Alerts
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 space-y-3">
                    {[
                      { level: "warning", message: "High memory usage detected", time: "5m ago" },
                      { level: "info", message: "Database backup in progress", time: "15m ago" },
                      { level: "error", message: "Failed login attempts spike", time: "1h ago" }
                    ].map((alert, index) => (
                      <div key={index} className={`p-3 rounded-lg border-l-4 ${
                        alert.level === 'error' ? 'bg-red-900/30 border-red-500' :
                        alert.level === 'warning' ? 'bg-yellow-900/30 border-yellow-500' :
                        'bg-blue-900/30 border-blue-500'
                      }`}>
                        <div className="text-xs font-medium text-gray-300">{alert.message}</div>
                        <div className="text-xs text-gray-500 mt-1">{alert.time}</div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </motion.div>

              {/* Quick Actions */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Card className="bg-gray-800 text-white border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-base">Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 space-y-3">
                    <Button variant="outline" size="sm" className="w-full border-gray-600 text-gray-300 hover:bg-gray-700">
                      <Plus className="h-4 w-4 mr-2" />
                      Create Event
                    </Button>
                    <Button variant="outline" size="sm" className="w-full border-gray-600 text-gray-300 hover:bg-gray-700">
                      <FileText className="h-4 w-4 mr-2" />
                      Generate Report
                    </Button>
                    <Button variant="outline" size="sm" className="w-full border-gray-600 text-gray-300 hover:bg-gray-700">
                      <Database className="h-4 w-4 mr-2" />
                      Database Query
                    </Button>
                    <Button variant="outline" size="sm" className="w-full border-gray-600 text-gray-300 hover:bg-gray-700">
                      <Settings className="h-4 w-4 mr-2" />
                      System Config
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>

              {/* System Health */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
              >
                <Card className="bg-gray-800 text-white border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <Activity className="h-4 w-4 text-green-400" />
                      System Health
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-300">Uptime</span>
                        <span className="text-green-400 font-semibold">99.9%</span>
                      </div>
                      <Progress value={99.9} className="h-2 bg-gray-700" />
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-300">Response Time</span>
                        <span className="text-blue-400 font-semibold">245ms</span>
                      </div>
                      <Progress value={75} className="h-2 bg-gray-700" />
                    </div>

                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-300">Error Rate</span>
                        <span className="text-green-400 font-semibold">0.1%</span>
                      </div>
                      <Progress value={1} className="h-2 bg-gray-700" />
                    </div>

                    <div className="pt-2 border-t border-gray-700 text-center">
                      <div className="text-lg font-bold text-green-400">Excellent</div>
                      <div className="text-xs text-gray-500">Overall Health</div>
                    </div>
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