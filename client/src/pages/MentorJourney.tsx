import { useState, useEffect } from "react";
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
  UserCheck, 
  Settings, 
  MessageSquare, 
  Calendar, 
  Users, 
  BarChart3, 
  Award,
  User,
  BookOpen,
  Clock,
  Star,
  Target,
  CheckCircle2,
  ThumbsUp,
  MessageCircle,
  Video,
  FileText,
  Trophy,
  Crown,
  Home,
  Search,
  Filter,
  Download,
  Send,
  Plus,
  Bell,
  Menu,
  X,
  ChevronRight,
  Brain,
  Flame
} from "lucide-react";

export default function MentorJourney() {
  const [activeTab, setActiveTab] = useState("dashboard");

  const journeyStages = [
    {
      id: 1,
      title: "Signup & Verification",
      icon: UserCheck,
      status: "completed"
    },
    {
      id: 2,
      title: "Profile Setup",
      icon: Settings,
      status: "completed"
    },
    {
      id: 3,
      title: "Community Engagement",
      icon: MessageSquare,
      status: "current"
    },
    {
      id: 4,
      title: "Sessions Management",
      icon: Calendar,
      status: "upcoming"
    },
    {
      id: 5,
      title: "Mentorship Matching",
      icon: Users,
      status: "upcoming"
    },
    {
      id: 6,
      title: "Success Tracking",
      icon: BarChart3,
      status: "upcoming"
    },
    {
      id: 7,
      title: "Recognition",
      icon: Award,
      status: "upcoming"
    }
  ];

  return (
    <Layout title="Mentor Journey">
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50">
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
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Brain className="h-8 w-8 text-purple-600" />
                  </div>
                  Mentor Journey
                </h1>
                <p className="text-gray-600 mt-2">
                  Welcome back, Alex! Ready to guide the next generation of learners?
                </p>
              </div>
              <div className="flex items-center gap-4">
                <Badge variant="secondary" className="px-3 py-1">
                  <Flame className="h-4 w-4 mr-1" />
                  Stage 3: Community
                </Badge>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
          <div className="max-w-7xl mx-auto">
            <nav className="flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab("dashboard")}
                className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === "dashboard"
                    ? 'border-purple-500 text-purple-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-2">
                  <BarChart3 className="h-4 w-4" />
                  Dashboard
                </div>
              </button>
              <button
                onClick={() => setActiveTab("settings")}
                className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === "settings"
                    ? 'border-purple-500 text-purple-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Settings className="h-4 w-4" />
                  Settings
                </div>
              </button>
            </nav>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="max-w-7xl mx-auto px-6 py-8">
          {activeTab === "dashboard" && <DashboardContent journeyStages={journeyStages} />}
          {activeTab === "settings" && <SettingsContent />}
        </div>
      </div>
    </Layout>
  );
}

// Dashboard Content Component
function DashboardContent({ journeyStages }: { journeyStages: any[] }) {
  const { data: overview, isLoading, error } = useQuery({
    queryKey: ["/api/mentor-journey/overview"],
    retry: false,
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-64 bg-gray-200 rounded-lg"></div>
        </div>
      </div>
    );
  }

  // Use fallback data if API fails (for demo purposes)
  const overviewData = (overview as any)?.overview || {
    stats: {
      communityUpvotes: 127,
      sessionsHosted: 12,
      activeMentees: 3,
      overallRating: 4.8
    },
    journeyStages: journeyStages
  };

  return (
    <div className="space-y-8">
      {/* Progress Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow-xl border-0">
          <CardContent className="p-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold mb-2">Mentor Journey Progress</h2>
                <p className="text-purple-100">You're making great progress on your mentoring journey!</p>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold">43%</div>
                <div className="text-purple-100">Complete</div>
              </div>
            </div>
            <Progress value={43} className="h-3 bg-white/20" />
            <p className="text-purple-100 text-sm mt-3">Stage 3 of 7 - Community Engagement</p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-6"
      >
        <Card className="shadow-lg border-0">
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 mx-auto mb-4 bg-purple-100 rounded-full flex items-center justify-center">
              <ThumbsUp className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900">{overviewData.stats.communityUpvotes}</h3>
            <p className="text-gray-600 text-sm">Community Upvotes</p>
          </CardContent>
        </Card>
        
        <Card className="shadow-lg border-0">
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
              <Calendar className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900">{overviewData.stats.sessionsHosted}</h3>
            <p className="text-gray-600 text-sm">Sessions Hosted</p>
          </CardContent>
        </Card>
        
        <Card className="shadow-lg border-0">
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
              <Users className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900">{overviewData.stats.activeMentees}</h3>
            <p className="text-gray-600 text-sm">Active Mentees</p>
          </CardContent>
        </Card>
        
        <Card className="shadow-lg border-0">
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 mx-auto mb-4 bg-yellow-100 rounded-full flex items-center justify-center">
              <Star className="h-6 w-6 text-yellow-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900">{overviewData.stats.overallRating}</h3>
            <p className="text-gray-600 text-sm">Overall Rating</p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Journey Stages */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card className="shadow-lg border-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-6 w-6 text-purple-600" />
              Mentor Journey Stages
            </CardTitle>
            <CardDescription>
              Complete each stage to unlock new mentoring opportunities
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {journeyStages.map((stage) => (
                <div
                  key={stage.id}
                  className={`relative p-4 rounded-lg border-2 transition-all ${
                    stage.status === 'completed' ? 'border-green-200 bg-green-50' :
                    stage.status === 'current' ? 'border-purple-200 bg-purple-50' 
                    : 'border-gray-200 bg-gray-50'
                  }`}
                >
                  <div className="text-center">
                    <div className={`w-12 h-12 mx-auto mb-3 rounded-full flex items-center justify-center ${
                      stage.status === 'completed' ? 'bg-green-500' :
                      stage.status === 'current' ? 'bg-purple-500' : 'bg-gray-400'
                    }`}>
                      {stage.icon && <stage.icon className="h-6 w-6 text-white" />}
                      {!stage.icon && (
                        <>
                          {stage.id === 1 && <UserCheck className="h-6 w-6 text-white" />}
                          {stage.id === 2 && <Settings className="h-6 w-6 text-white" />}
                          {stage.id === 3 && <MessageSquare className="h-6 w-6 text-white" />}
                          {stage.id === 4 && <Calendar className="h-6 w-6 text-white" />}
                          {stage.id === 5 && <Users className="h-6 w-6 text-white" />}
                          {stage.id === 6 && <BarChart3 className="h-6 w-6 text-white" />}
                          {stage.id === 7 && <Award className="h-6 w-6 text-white" />}
                        </>
                      )}
                    </div>
                    <h3 className="font-semibold text-sm text-gray-900 mb-2">{stage.title}</h3>
                    <Badge 
                      variant={stage.status === 'completed' ? 'default' : stage.status === 'current' ? 'secondary' : 'outline'}
                      className={
                        stage.status === 'completed' ? 'bg-green-100 text-green-800' :
                        stage.status === 'current' ? 'bg-purple-100 text-purple-800' :
                        'bg-gray-100 text-gray-600'
                      }
                    >
                      {stage.status === 'completed' ? 'Completed' :
                       stage.status === 'current' ? 'In Progress' : 'Upcoming'}
                    </Badge>
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
        transition={{ delay: 0.4 }}
      >
        <Card className="shadow-lg border-0">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common mentoring tasks and activities</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button className="h-auto p-4 flex flex-col items-center justify-center text-center bg-purple-600 hover:bg-purple-700">
                <MessageSquare className="h-8 w-8 mb-2" />
                <div>
                  <div className="font-semibold">Answer Questions</div>
                  <div className="text-xs opacity-90">Help students in community</div>
                </div>
              </Button>
              
              <Button variant="outline" className="h-auto p-4 flex flex-col items-center justify-center text-center">
                <Calendar className="h-8 w-8 mb-2 text-blue-600" />
                <div>
                  <div className="font-semibold">Schedule Session</div>
                  <div className="text-xs text-gray-600">Create a workshop or Q&A</div>
                </div>
              </Button>
              
              <Button variant="outline" className="h-auto p-4 flex flex-col items-center justify-center text-center">
                <Users className="h-8 w-8 mb-2 text-green-600" />
                <div>
                  <div className="font-semibold">Find Mentees</div>
                  <div className="text-xs text-gray-600">Connect with students</div>
                </div>
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

// Settings Content Component
function SettingsContent() {
  return (
    <div className="space-y-6">
      <Card className="shadow-lg border-0">
        <CardHeader className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-t-lg">
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-6 w-6" />
            Mentor Settings
          </CardTitle>
          <CardDescription className="text-indigo-100">
            Manage your mentoring preferences and profile settings
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-4">Expertise Domains</h4>
                <div className="flex flex-wrap gap-2">
                  {['Artificial Intelligence', 'Product Management', 'Frontend Development'].map((domain: string, index: number) => (
                    <Badge key={index} className="bg-indigo-100 text-indigo-800 px-3 py-1">
                      {domain}
                    </Badge>
                  ))}
                  <Button size="sm" variant="outline" className="h-8">
                    <Plus className="h-3 w-3 mr-1" />
                    Add Domain
                  </Button>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 mb-4">Experience Level</h4>
                <Badge className="bg-green-100 text-green-800 px-3 py-2 text-sm font-medium">
                  8+ Years Senior Level
                </Badge>
              </div>
            </div>
            
            <div className="space-y-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-4">Weekly Availability</h4>
                <p className="text-sm text-gray-600 mb-3">10 hours per week</p>
                <div className="space-y-2">
                  <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                    <span className="text-sm">Monday - Friday</span>
                    <span className="text-sm text-gray-600">6:00 PM - 8:00 PM</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                    <span className="text-sm">Saturday</span>
                    <span className="text-sm text-gray-600">10:00 AM - 2:00 PM</span>
                  </div>
                </div>
                <Button size="sm" variant="outline" className="mt-3">
                  <Settings className="h-3 w-3 mr-1" />
                  Edit Schedule
                </Button>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 mb-4">Mentoring Preferences</h4>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Badge className="bg-purple-100 text-purple-800">1:1 Sessions</Badge>
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className="bg-blue-100 text-blue-800">Group Workshops</Badge>
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className="bg-green-100 text-green-800">Mock Interviews</Badge>
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-8 pt-6 border-t border-gray-200">
            <Button className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700">
              <Settings className="h-4 w-4 mr-2" />
              Update Settings
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}