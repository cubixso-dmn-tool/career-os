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
import { 
  Shield,
  Flag,
  Users,
  Calendar,
  BarChart3,
  FileText,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Eye,
  Ban,
  MessageSquare,
  Activity,
  TrendingUp,
  Clock,
  UserX,
  Settings,
  Search,
  Filter,
  Download,
  Bell,
  Trash2,
  Edit,
  MoreHorizontal
} from "lucide-react";

export default function ModeratorDashboard() {
  const { data: moderatorData, isLoading } = useQuery({
    queryKey: ["/api/moderation/overview"],
    retry: false,
  });

  if (isLoading) {
    return (
      <Layout title="Moderator Dashboard">
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading moderator dashboard...</p>
          </div>
        </div>
      </Layout>
    );
  }

  // Use fallback data for demo
  const data = {
    stats: {
      flaggedPosts: moderatorData?.stats?.flaggedPosts || 23,
      pendingEvents: moderatorData?.stats?.pendingEvents || 7,
      activeUsers: moderatorData?.stats?.activeUsers || 1247,
      weeklyReports: moderatorData?.stats?.weeklyReports || 4
    },
    recentActivity: moderatorData?.recentActivity || []
  };

  const journeyStages = [
    {
      id: 1,
      title: "Role Assignment",
      description: "Moderator privileges assigned",
      icon: Shield,
      status: "completed",
      color: "green"
    },
    {
      id: 2,
      title: "Content Monitoring",
      description: "Review flagged content",
      icon: Flag,
      status: "current",
      color: "blue"
    },
    {
      id: 3,
      title: "User Management",
      description: "Manage community members",
      icon: Users,
      status: "current",
      color: "purple"
    },
    {
      id: 4,
      title: "Event Oversight",
      description: "Approve/reject events",
      icon: Calendar,
      status: "current",
      color: "orange"
    },
    {
      id: 5,
      title: "Analytics View",
      description: "Monitor community metrics",
      icon: BarChart3,
      status: "upcoming",
      color: "indigo"
    },
    {
      id: 6,
      title: "Internal Reporting",
      description: "Submit moderation reports",
      icon: FileText,
      status: "upcoming",
      color: "pink"
    }
  ];

  return (
    <Layout title="Moderator Dashboard">
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
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
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Shield className="h-8 w-8 text-blue-600" />
                  </div>
                  Moderator Dashboard
                </h1>
                <p className="text-gray-600 mt-2">
                  Keep the community safe and maintain high-quality content standards
                </p>
              </div>
              <div className="flex items-center gap-4">
                <Badge variant="secondary" className="px-3 py-1">
                  <Activity className="h-4 w-4 mr-1" />
                  Active Moderator
                </Badge>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="space-y-8">
            {/* Stats Overview */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="grid grid-cols-1 md:grid-cols-4 gap-6"
            >
              <Card className="shadow-lg border-0 bg-gradient-to-r from-red-500 to-red-600 text-white">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 mx-auto mb-4 bg-white/20 rounded-full flex items-center justify-center">
                    <Flag className="h-6 w-6" />
                  </div>
                  <h3 className="text-2xl font-bold">{data.stats.flaggedPosts}</h3>
                  <p className="text-red-100 text-sm">Flagged Posts</p>
                </CardContent>
              </Card>
              
              <Card className="shadow-lg border-0 bg-gradient-to-r from-orange-500 to-orange-600 text-white">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 mx-auto mb-4 bg-white/20 rounded-full flex items-center justify-center">
                    <Calendar className="h-6 w-6" />
                  </div>
                  <h3 className="text-2xl font-bold">{data.stats.pendingEvents}</h3>
                  <p className="text-orange-100 text-sm">Pending Events</p>
                </CardContent>
              </Card>
              
              <Card className="shadow-lg border-0 bg-gradient-to-r from-green-500 to-green-600 text-white">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 mx-auto mb-4 bg-white/20 rounded-full flex items-center justify-center">
                    <Users className="h-6 w-6" />
                  </div>
                  <h3 className="text-2xl font-bold">{data.stats.activeUsers}</h3>
                  <p className="text-green-100 text-sm">Active Users</p>
                </CardContent>
              </Card>
              
              <Card className="shadow-lg border-0 bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 mx-auto mb-4 bg-white/20 rounded-full flex items-center justify-center">
                    <FileText className="h-6 w-6" />
                  </div>
                  <h3 className="text-2xl font-bold">{data.stats.weeklyReports}</h3>
                  <p className="text-blue-100 text-sm">Weekly Reports</p>
                </CardContent>
              </Card>
            </motion.div>

            {/* Moderator Journey Progress */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="shadow-lg border-0">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-6 w-6 text-blue-600" />
                    Moderator Journey Progress
                  </CardTitle>
                  <CardDescription>
                    Track your moderation responsibilities and achievements
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    {journeyStages.map((stage) => (
                      <div
                        key={stage.id}
                        className={`relative p-4 rounded-lg border-2 transition-all ${
                          stage.status === 'completed' ? 'border-green-200 bg-green-50' :
                          stage.status === 'current' ? 'border-blue-200 bg-blue-50' 
                          : 'border-gray-200 bg-gray-50'
                        }`}
                      >
                        <div className="text-center">
                          <div className={`w-12 h-12 mx-auto mb-3 rounded-full flex items-center justify-center ${
                            stage.status === 'completed' ? 'bg-green-500' :
                            stage.status === 'current' ? 'bg-blue-500' : 'bg-gray-400'
                          }`}>
                            <stage.icon className="h-6 w-6 text-white" />
                          </div>
                          <h3 className="font-semibold text-sm text-gray-900 mb-1">{stage.title}</h3>
                          <p className="text-xs text-gray-600 mb-2">{stage.description}</p>
                          <Badge 
                            variant={stage.status === 'completed' ? 'default' : stage.status === 'current' ? 'secondary' : 'outline'}
                            className={`text-xs ${
                              stage.status === 'completed' ? 'bg-green-100 text-green-800' :
                              stage.status === 'current' ? 'bg-blue-100 text-blue-800' :
                              'bg-gray-100 text-gray-600'
                            }`}
                          >
                            {stage.status === 'completed' ? 'Complete' :
                             stage.status === 'current' ? 'Active' : 'Pending'}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Two Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column - Main Content */}
              <div className="lg:col-span-2 space-y-8">
                {/* Flagged Content Queue */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <Card className="shadow-lg border-0">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="flex items-center gap-2">
                            <Flag className="h-5 w-5 text-red-600" />
                            Flagged Content Queue
                          </CardTitle>
                          <CardDescription>Review and moderate flagged posts and comments</CardDescription>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Filter className="h-4 w-4 mr-2" />
                            Filter
                          </Button>
                          <Button variant="outline" size="sm">
                            <Search className="h-4 w-4 mr-2" />
                            Search
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        {[
                          {
                            id: 1,
                            type: "Post",
                            content: "Inappropriate language in discussion about React hooks...",
                            author: "john_doe",
                            reportedBy: "student_user",
                            reason: "Abusive language",
                            time: "2 hours ago",
                            severity: "high"
                          },
                          {
                            id: 2,
                            type: "Comment",
                            content: "Spam comment with promotional links...",
                            author: "spam_account",
                            reportedBy: "mentor_sarah",
                            reason: "Spam/Advertising",
                            time: "4 hours ago",
                            severity: "medium"
                          },
                          {
                            id: 3,
                            type: "Post",
                            content: "Off-topic discussion about personal issues...",
                            author: "confused_student",
                            reportedBy: "auto_mod",
                            reason: "Off-topic content",
                            time: "6 hours ago",
                            severity: "low"
                          }
                        ].map((item) => (
                          <div key={item.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <Badge variant="outline" className="text-xs">{item.type}</Badge>
                                  <Badge 
                                    variant="outline" 
                                    className={`text-xs ${
                                      item.severity === 'high' ? 'border-red-400 text-red-600' :
                                      item.severity === 'medium' ? 'border-orange-400 text-orange-600' :
                                      'border-yellow-400 text-yellow-600'
                                    }`}
                                  >
                                    {item.severity} priority
                                  </Badge>
                                  <span className="text-xs text-gray-500">{item.time}</span>
                                </div>
                                <p className="text-sm text-gray-900 mb-2">{item.content}</p>
                                <div className="text-xs text-gray-600">
                                  <span>By: <strong>{item.author}</strong></span> • 
                                  <span> Reported by: <strong>{item.reportedBy}</strong></span> • 
                                  <span> Reason: <strong>{item.reason}</strong></span>
                                </div>
                              </div>
                              <div className="flex gap-2 ml-4">
                                <Button size="sm" variant="outline">
                                  <Eye className="h-4 w-4 mr-1" />
                                  View
                                </Button>
                                <Button size="sm" variant="outline" className="text-green-600">
                                  <CheckCircle className="h-4 w-4 mr-1" />
                                  Approve
                                </Button>
                                <Button size="sm" variant="outline" className="text-red-600">
                                  <XCircle className="h-4 w-4 mr-1" />
                                  Remove
                                </Button>
                                <Button size="sm" variant="ghost">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="flex justify-between items-center mt-6 pt-4 border-t">
                        <span className="text-sm text-gray-600">23 items pending review</span>
                        <Button variant="ghost" size="sm">
                          View All Items
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Pending Events */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <Card className="shadow-lg border-0">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Calendar className="h-5 w-5 text-orange-600" />
                        Pending Event Approvals
                      </CardTitle>
                      <CardDescription>Review and approve student-created events</CardDescription>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        {[
                          {
                            title: "React Study Group Meetup",
                            organizer: "Priya Sharma",
                            date: "Dec 15, 2024",
                            time: "6:00 PM - 8:00 PM",
                            type: "Study Group",
                            attendees: 25,
                            description: "Weekly React study session covering hooks and state management"
                          },
                          {
                            title: "Career Fair Networking Event",
                            organizer: "Tech Club",
                            date: "Dec 20, 2024",
                            time: "2:00 PM - 5:00 PM",
                            type: "Networking",
                            attendees: 150,
                            description: "Connect with industry professionals and explore job opportunities"
                          }
                        ].map((event, index) => (
                          <div key={index} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <h4 className="font-semibold text-gray-900 mb-2">{event.title}</h4>
                                <p className="text-sm text-gray-600 mb-3">{event.description}</p>
                                <div className="grid grid-cols-2 gap-4 text-xs text-gray-600">
                                  <div>
                                    <span className="font-medium">Organizer:</span> {event.organizer}
                                  </div>
                                  <div>
                                    <span className="font-medium">Type:</span> {event.type}
                                  </div>
                                  <div>
                                    <span className="font-medium">Date:</span> {event.date}
                                  </div>
                                  <div>
                                    <span className="font-medium">Expected:</span> {event.attendees} attendees
                                  </div>
                                </div>
                              </div>
                              <div className="flex gap-2 ml-4">
                                <Button size="sm" variant="outline" className="text-green-600">
                                  <CheckCircle className="h-4 w-4 mr-1" />
                                  Approve
                                </Button>
                                <Button size="sm" variant="outline" className="text-red-600">
                                  <XCircle className="h-4 w-4 mr-1" />
                                  Reject
                                </Button>
                                <Button size="sm" variant="outline">
                                  <Edit className="h-4 w-4 mr-1" />
                                  Edit
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Quick Actions */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <Card className="shadow-lg border-0">
                    <CardHeader>
                      <CardTitle>Moderation Quick Actions</CardTitle>
                      <CardDescription>Common moderation tasks and tools</CardDescription>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Button className="h-auto p-4 flex flex-col items-center justify-center text-center bg-blue-600 hover:bg-blue-700">
                          <Flag className="h-8 w-8 mb-2" />
                          <div>
                            <div className="font-semibold">Review Reports</div>
                            <div className="text-xs opacity-90">Check flagged content</div>
                          </div>
                        </Button>
                        
                        <Button variant="outline" className="h-auto p-4 flex flex-col items-center justify-center text-center">
                          <Users className="h-8 w-8 mb-2 text-purple-600" />
                          <div>
                            <div className="font-semibold">Manage Users</div>
                            <div className="text-xs text-gray-600">Warning and ban tools</div>
                          </div>
                        </Button>
                        
                        <Button variant="outline" className="h-auto p-4 flex flex-col items-center justify-center text-center">
                          <FileText className="h-8 w-8 mb-2 text-green-600" />
                          <div>
                            <div className="font-semibold">Generate Report</div>
                            <div className="text-xs text-gray-600">Weekly moderation summary</div>
                          </div>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>

              {/* Right Column - Analytics & Tools */}
              <div className="space-y-6">
                {/* Community Analytics */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <Card className="shadow-lg border-0">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <BarChart3 className="h-5 w-5 text-indigo-600" />
                        Community Stats
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4">
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Active Threads</span>
                          <span className="font-semibold text-gray-900">847</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Daily Posts</span>
                          <span className="font-semibold text-gray-900">156</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Spam Reports</span>
                          <span className="font-semibold text-red-600">23</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">User Reports</span>
                          <span className="font-semibold text-orange-600">8</span>
                        </div>
                        <div className="pt-2 border-t">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm text-gray-600">Content Quality</span>
                            <span className="text-sm font-medium text-green-600">92%</span>
                          </div>
                          <Progress value={92} className="h-2" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Recent Moderator Actions */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <Card className="shadow-lg border-0">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <Activity className="h-5 w-5 text-blue-600" />
                        Recent Actions
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4">
                      <div className="space-y-4">
                        {[
                          {
                            action: "Post removed",
                            details: "Spam content by user_123",
                            time: "10 min ago",
                            icon: Trash2,
                            color: "text-red-600"
                          },
                          {
                            action: "User warned",
                            details: "Inappropriate language warning",
                            time: "1 hour ago",
                            icon: AlertTriangle,
                            color: "text-orange-600"
                          },
                          {
                            action: "Event approved",
                            details: "React Study Group meetup",
                            time: "2 hours ago",
                            icon: CheckCircle,
                            color: "text-green-600"
                          },
                          {
                            action: "Report reviewed",
                            details: "False report dismissed",
                            time: "3 hours ago",
                            icon: Eye,
                            color: "text-blue-600"
                          }
                        ].map((action, index) => (
                          <div key={index} className="flex items-start gap-3">
                            <div className={`p-2 rounded-lg bg-gray-100 ${action.color}`}>
                              <action.icon className="h-4 w-4" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900">{action.action}</p>
                              <p className="text-xs text-gray-600 truncate">{action.details}</p>
                              <p className="text-xs text-gray-400 mt-1">{action.time}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Moderation Tools */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <Card className="shadow-lg border-0">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <Settings className="h-5 w-5 text-purple-600" />
                        Moderation Tools
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4">
                      <div className="space-y-2">
                        {[
                          { name: "Bulk Content Review", icon: Flag },
                          { name: "User Behavior Analytics", icon: TrendingUp },
                          { name: "Automated Spam Detection", icon: Shield },
                          { name: "Report Management", icon: FileText },
                          { name: "Community Guidelines", icon: MessageSquare }
                        ].map((tool, index) => (
                          <Button key={index} variant="ghost" className="w-full justify-start text-sm h-auto p-2">
                            <tool.icon className="h-4 w-4 mr-2 text-gray-600" />
                            {tool.name}
                          </Button>
                        ))}
                      </div>
                      <Button variant="outline" size="sm" className="w-full mt-4">
                        <Download className="h-4 w-4 mr-2" />
                        Export Report
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}