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
  const [activeTab, setActiveTab] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const sidebarItems = [
    {
      id: "overview",
      title: "Overview",
      icon: Home,
      description: "Journey progress & summary"
    },
    {
      id: "profile",
      title: "Profile Setup",
      icon: Settings,
      description: "Complete your mentor profile"
    },
    {
      id: "community",
      title: "Community",
      icon: MessageSquare,
      description: "Engage with students"
    },
    {
      id: "sessions",
      title: "Sessions",
      icon: Calendar,
      description: "Manage workshops & interviews"
    },
    {
      id: "mentorship",
      title: "Mentorship",
      icon: Users,
      description: "1:1 mentoring relationships"
    },
    {
      id: "analytics",
      title: "Analytics",
      icon: BarChart3,
      description: "Track your impact"
    },
    {
      id: "achievements",
      title: "Achievements",
      icon: Award,
      description: "Badges & recognition"
    }
  ];

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
              {sidebarItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === item.id
                      ? 'border-purple-500 text-purple-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <item.icon className="h-4 w-4" />
                    {item.title}
                  </div>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="max-w-7xl mx-auto px-6 py-8">
          {activeTab === "overview" && <OverviewContent journeyStages={journeyStages} />}
          {activeTab === "profile" && <ProfileContent />}
          {activeTab === "community" && <CommunityContent />}
          {activeTab === "sessions" && <SessionsContent />}
          {activeTab === "mentorship" && <MentorshipContent />}
          {activeTab === "analytics" && <AnalyticsContent />}
          {activeTab === "achievements" && <AchievementsContent />}
        </div>
      </div>
    </Layout>
  );
}

// Overview Content Component
function OverviewContent({ journeyStages }: { journeyStages: any[] }) {
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
    <div className="space-y-6">
      {/* Journey Stages Overview */}
      <Card className="shadow-lg border-0">
        <CardHeader className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-t-lg">
          <CardTitle className="flex items-center gap-2">
            <Target className="h-6 w-6" />
            Your Mentor Journey Progress
          </CardTitle>
          <CardDescription className="text-indigo-100">
            Complete each stage to unlock new mentoring opportunities
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-7 gap-4">
            {(overviewData.journeyStages || journeyStages).map((stage: any, index: number) => (
              <div
                key={stage.id}
                className={`p-4 rounded-lg border-2 transition-all ${
                  stage.status === 'completed' 
                    ? 'border-green-200 bg-green-50' 
                    : stage.status === 'current'
                    ? 'border-purple-200 bg-purple-50 ring-2 ring-purple-200'
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
                    {stage.status === 'completed' ? 'Done' : stage.status === 'current' ? 'Active' : 'Pending'}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200">
          <CardContent className="p-6 text-center">
            <ThumbsUp className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">{overviewData.stats.communityUpvotes}</p>
            <p className="text-sm text-gray-600">Community Upvotes</p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200">
          <CardContent className="p-6 text-center">
            <Calendar className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">{overviewData.stats.sessionsHosted}</p>
            <p className="text-sm text-gray-600">Sessions Hosted</p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200">
          <CardContent className="p-6 text-center">
            <Users className="h-8 w-8 text-purple-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">{overviewData.stats.activeMentees}</p>
            <p className="text-sm text-gray-600">Active Mentees</p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-orange-50 to-yellow-50 border border-orange-200">
          <CardContent className="p-6 text-center">
            <Star className="h-8 w-8 text-orange-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">{overviewData.stats.overallRating}</p>
            <p className="text-sm text-gray-600">Overall Rating</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Profile Content Component
function ProfileContent() {
  return (
    <div className="space-y-6">
      <Card className="shadow-lg border-0">
        <CardHeader className="bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-t-lg">
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-6 w-6" />
            Complete Your Mentor Profile
          </CardTitle>
          <CardDescription className="text-green-100">
            Set up your expertise and availability to get discovered
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-4">Primary Domains</h4>
                <div className="flex flex-wrap gap-2">
                  <Badge className="bg-blue-100 text-blue-800">Artificial Intelligence</Badge>
                  <Badge className="bg-green-100 text-green-800">Product Management</Badge>
                  <Badge className="bg-purple-100 text-purple-800">Frontend Development</Badge>
                  <Button size="sm" variant="outline" className="h-6">
                    <Plus className="h-3 w-3" />
                  </Button>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 mb-4">Experience Level</h4>
                <Badge className="bg-orange-100 text-orange-800">8+ Years Senior Level</Badge>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 mb-4">Skills</h4>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline">React</Badge>
                  <Badge variant="outline">Python</Badge>
                  <Badge variant="outline">Machine Learning</Badge>
                  <Badge variant="outline">Team Leadership</Badge>
                  <Badge variant="outline">Strategy</Badge>
                  <Button size="sm" variant="outline" className="h-6">
                    <Plus className="h-3 w-3" />
                  </Button>
                </div>
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
              Update Profile
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Community Content Component
function CommunityContent() {
  return (
    <div className="space-y-6">
      <Card className="shadow-lg border-0">
        <CardHeader className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-t-lg">
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-6 w-6" />
            Community Engagement
          </CardTitle>
          <CardDescription className="text-purple-100">
            Build trust and visibility through community participation
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <ThumbsUp className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-900">127</p>
              <p className="text-sm text-gray-600">Total Upvotes</p>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <MessageCircle className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-900">43</p>
              <p className="text-sm text-gray-600">Answers Posted</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <Star className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-900">4.8</p>
              <p className="text-sm text-gray-600">Community Rating</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-900">Recent Activities</h4>
            {[
              {
                title: "How to transition from Frontend to Full Stack?",
                upvotes: 23,
                time: "2 hours ago",
                category: "Career Advice"
              },
              {
                title: "Best Practices for React Performance",
                upvotes: 45,
                time: "1 day ago",
                category: "Technical"
              },
              {
                title: "Salary negotiation tips for graduates",
                upvotes: 31,
                time: "2 days ago",
                category: "Career Advice"
              }
            ].map((activity, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <MessageCircle className="h-4 w-4 text-purple-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{activity.title}</p>
                    <p className="text-sm text-gray-600">{activity.category} • {activity.time}</p>
                  </div>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <ThumbsUp className="h-4 w-4 mr-1" />
                  {activity.upvotes}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Sessions Content Component
function SessionsContent() {
  return (
    <div className="space-y-6">
      <Card className="shadow-lg border-0">
        <CardHeader className="bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-t-lg">
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-6 w-6" />
            Sessions Management
          </CardTitle>
          <CardDescription className="text-orange-100">
            Host workshops, mock interviews, and Q&A sessions
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <Video className="h-8 w-8 text-orange-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-900">12</p>
              <p className="text-sm text-gray-600">Sessions Hosted</p>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <Users className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-900">89</p>
              <p className="text-sm text-gray-600">Students Reached</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <Star className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-900">4.9</p>
              <p className="text-sm text-gray-600">Session Rating</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Upcoming Sessions</h4>
              <div className="space-y-3">
                {[
                  {
                    title: "React Interview Preparation",
                    type: "Mock Interview",
                    date: "Tomorrow",
                    time: "2:00 PM - 3:00 PM",
                    participants: 5
                  },
                  {
                    title: "Career Guidance Workshop",
                    type: "Group Session",
                    date: "Friday",
                    time: "6:00 PM - 7:30 PM",
                    participants: 15
                  }
                ].map((session, index) => (
                  <div key={index} className="p-3 bg-orange-50 rounded-lg border border-orange-200">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h5 className="font-medium text-gray-900">{session.title}</h5>
                        <p className="text-sm text-gray-600">{session.type}</p>
                      </div>
                      <Badge className="bg-orange-100 text-orange-800">{session.participants} joined</Badge>
                    </div>
                    <p className="text-sm text-gray-600">{session.date} • {session.time}</p>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Quick Actions</h4>
              <div className="space-y-3">
                <Button className="w-full justify-start bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700">
                  <Video className="h-4 w-4 mr-2" />
                  Schedule New Session
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <FileText className="h-4 w-4 mr-2" />
                  View Session Templates
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Calendar className="h-4 w-4 mr-2" />
                  Manage Calendar Integration
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Other content components
function MentorshipContent() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Mentorship Matching</CardTitle>
          <CardDescription>Get matched with mentees based on your expertise</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Mentorship matching features coming soon...</p>
        </CardContent>
      </Card>
    </div>
  );
}

function AnalyticsContent() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Success Tracking</CardTitle>
          <CardDescription>Monitor feedback and ratings from students</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Analytics and tracking features coming soon...</p>
        </CardContent>
      </Card>
    </div>
  );
}

function AchievementsContent() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Achievements & Recognition</CardTitle>
          <CardDescription>Earn badges and appear in top mentors list</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Achievements and recognition features coming soon...</p>
        </CardContent>
      </Card>
    </div>
  );
}