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
  Activity, 
  AlertTriangle, 
  Server, 
  Database, 
  Shield,
  Settings,
  LayoutDashboard,
  UserCheck,
  MessageSquare,
  FileText,
  TrendingUp,
  Zap,
  Clock
} from "lucide-react";
import { motion } from "framer-motion";

// Simplified sidebar component for admin dashboard
function SimpleSidebar({ user }: { user: any }) {
  const [location] = useLocation();

  const navItems = [
    { path: "/admin-dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { path: "/settings", icon: Settings, label: "Settings" }
  ];

  return (
    <aside className="hidden md:flex md:w-64 bg-gray-900 border-r border-gray-800 flex-col">
      <div className="flex-1 flex flex-col min-h-0">
        <div className="flex items-center justify-center h-16 px-4 bg-red-700">
          <h2 className="text-xl font-bold text-white">CareerOS Admin</h2>
        </div>
        
        <nav className="flex-1 px-4 py-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location === item.path;
            
            return (
              <Link key={item.path} href={item.path}>
                <div className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-red-800 text-white'
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                }`}>
                  <Icon className="h-5 w-5 mr-3" />
                  {item.label}
                </div>
              </Link>
            );
          })}
        </nav>
        
        <div className="p-4 border-t border-gray-800">
          <LogoutButton />
        </div>
      </div>
    </aside>
  );
}

export default function AdminDashboard() {
  const { user } = useAuth();

  const userWithDefaults = {
    name: user?.name || 'Admin',
    email: user?.email || 'admin@example.com',
    avatar: user?.avatar || 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6',
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-900">
      <SimpleSidebar user={userWithDefaults} />
      
      <main className="flex-1 md:ml-0">
        <div className="min-h-screen bg-gray-900 text-white">
          {/* Header Section */}
          <div className="bg-gray-800 border-b border-red-800 px-6 py-8">
            <div className="max-w-7xl mx-auto">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-between"
              >
                <div>
                  <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                    <div className="p-2 bg-red-700 rounded-lg">
                      <Shield className="h-8 w-8 text-white" />
                    </div>
                    System Control Center
                  </h1>
                  <p className="text-gray-400 mt-2">
                    Monitor, manage, and secure the CareerOS platform
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <Badge variant="secondary" className="bg-red-800 text-red-100 border-red-700">
                    System Admin
                  </Badge>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-sm text-gray-400">All Systems Operational</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Dashboard Content */}
          <div className="max-w-7xl mx-auto px-6 py-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* System Metrics - Full Width */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="lg:col-span-2"
              >
                <Card className="bg-gray-800 border-gray-700">
                  <CardHeader className="bg-gradient-to-r from-red-700 to-red-600 text-white rounded-t-lg">
                    <CardTitle className="flex items-center gap-2">
                      <Activity className="h-5 w-5" />
                      System Performance
                    </CardTitle>
                    <CardDescription className="text-red-100">
                      Real-time monitoring of platform health and performance
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Server Status */}
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="p-2 bg-green-900 rounded-lg">
                              <Server className="h-5 w-5 text-green-400" />
                            </div>
                            <div>
                              <p className="text-sm text-gray-400">Server Status</p>
                              <p className="text-lg font-bold text-white">Online</p>
                            </div>
                          </div>
                          <Badge className="bg-green-800 text-green-100">Healthy</Badge>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-400">CPU Usage</span>
                            <span className="text-white">23%</span>
                          </div>
                          <Progress value={23} className="h-2" />
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-400">Memory Usage</span>
                            <span className="text-white">67%</span>
                          </div>
                          <Progress value={67} className="h-2" />
                        </div>
                      </div>

                      {/* Database Status */}
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="p-2 bg-blue-900 rounded-lg">
                              <Database className="h-5 w-5 text-blue-400" />
                            </div>
                            <div>
                              <p className="text-sm text-gray-400">Database</p>
                              <p className="text-lg font-bold text-white">PostgreSQL</p>
                            </div>
                          </div>
                          <Badge className="bg-blue-800 text-blue-100">Connected</Badge>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-400">Query Performance</span>
                            <span className="text-white">12ms avg</span>
                          </div>
                          <Progress value={85} className="h-2" />
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-400">Active Connections</span>
                            <span className="text-white">45/100</span>
                          </div>
                          <Progress value={45} className="h-2" />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Quick Actions & Alerts */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="space-y-6"
              >
                {/* Platform Stats */}
                <Card className="bg-gray-800 border-gray-700">
                  <CardHeader className="bg-gradient-to-r from-blue-700 to-blue-600 text-white rounded-t-lg">
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5" />
                      Platform Stats
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-purple-900 rounded-lg">
                            <Users className="h-5 w-5 text-purple-400" />
                          </div>
                          <div>
                            <p className="text-sm text-gray-400">Total Users</p>
                            <p className="text-xl font-bold text-white">1,247</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-green-900 rounded-lg">
                            <UserCheck className="h-5 w-5 text-green-400" />
                          </div>
                          <div>
                            <p className="text-sm text-gray-400">Active Today</p>
                            <p className="text-xl font-bold text-white">423</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-yellow-900 rounded-lg">
                            <MessageSquare className="h-5 w-5 text-yellow-400" />
                          </div>
                          <div>
                            <p className="text-sm text-gray-400">Support Tickets</p>
                            <p className="text-xl font-bold text-white">12</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Recent Alerts */}
                <Card className="bg-gray-800 border-gray-700">
                  <CardHeader className="bg-gradient-to-r from-orange-700 to-red-600 text-white rounded-t-lg">
                    <CardTitle className="flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5" />
                      System Alerts
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 max-h-80 overflow-y-auto">
                    <div className="space-y-3">
                      <div className="p-3 bg-yellow-900/20 rounded-lg border border-yellow-800">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium text-sm text-yellow-400">Memory Warning</span>
                          <span className="text-xs text-gray-400">2 min ago</span>
                        </div>
                        <p className="text-xs text-gray-300">Server memory usage exceeded 80%</p>
                      </div>
                      
                      <div className="p-3 bg-blue-900/20 rounded-lg border border-blue-800">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium text-sm text-blue-400">Backup Complete</span>
                          <span className="text-xs text-gray-400">1 hour ago</span>
                        </div>
                        <p className="text-xs text-gray-300">Daily database backup completed successfully</p>
                      </div>
                      
                      <div className="p-3 bg-green-900/20 rounded-lg border border-green-800">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium text-sm text-green-400">Update Applied</span>
                          <span className="text-xs text-gray-400">3 hours ago</span>
                        </div>
                        <p className="text-xs text-gray-300">Security patches applied and system restarted</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-8"
            >
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <Zap className="h-5 w-5" />
                    Quick Actions
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Button className="bg-red-700 hover:bg-red-600 text-white">
                      <Users className="h-4 w-4 mr-2" />
                      Manage Users
                    </Button>
                    <Button className="bg-blue-700 hover:bg-blue-600 text-white">
                      <Database className="h-4 w-4 mr-2" />
                      Database Tools
                    </Button>
                    <Button className="bg-green-700 hover:bg-green-600 text-white">
                      <FileText className="h-4 w-4 mr-2" />
                      System Logs
                    </Button>
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