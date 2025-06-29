import { useState } from "react";
import { motion } from "framer-motion";
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
  UserCheck, 
  Settings, 
  MessageSquare, 
  Calendar, 
  Users, 
  BarChart3, 
  Award,
  Mail,
  Shield,
  User,
  BookOpen,
  Clock,
  Star,
  TrendingUp,
  Target,
  CheckCircle2,
  ArrowRight,
  Trophy,
  ThumbsUp,
  MessageCircle,
  Video,
  FileText,
  Heart,
  Zap,
  Crown,
  Gift
} from "lucide-react";

export default function MentorJourney() {
  const [currentStage, setCurrentStage] = useState(1);
  
  const journeyStages = [
    {
      id: 1,
      title: "Signup & Verification",
      description: "Get verified as a mentor/expert",
      icon: UserCheck,
      color: "from-blue-500 to-cyan-500",
      status: "completed"
    },
    {
      id: 2,
      title: "Profile Setup",
      description: "Add expertise and availability",
      icon: Settings,
      color: "from-green-500 to-emerald-500",
      status: "completed"
    },
    {
      id: 3,
      title: "Community Engagement",
      description: "Answer questions and build trust",
      icon: MessageSquare,
      color: "from-purple-500 to-pink-500",
      status: "current"
    },
    {
      id: 4,
      title: "Sessions Management",
      description: "Host workshops and interviews",
      icon: Calendar,
      color: "from-orange-500 to-red-500",
      status: "upcoming"
    },
    {
      id: 5,
      title: "Mentorship Matching",
      description: "Get matched with mentees",
      icon: Users,
      color: "from-indigo-500 to-purple-500",
      status: "upcoming"
    },
    {
      id: 6,
      title: "Success Tracking",
      description: "Monitor feedback and ratings",
      icon: BarChart3,
      color: "from-teal-500 to-cyan-500",
      status: "upcoming"
    },
    {
      id: 7,
      title: "Recognition",
      description: "Earn badges and top mentor status",
      icon: Award,
      color: "from-yellow-500 to-orange-500",
      status: "upcoming"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Your Mentor Journey
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Navigate through your mentoring stages and unlock new opportunities to impact students' careers
          </p>
        </motion.div>

        {/* Journey Progress */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <Card className="shadow-lg border-0">
            <CardHeader className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-t-lg">
              <CardTitle className="flex items-center gap-2">
                <Target className="h-6 w-6" />
                Journey Progress
              </CardTitle>
              <CardDescription className="text-indigo-100">
                Stage 3 of 7 - Community Engagement
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">Overall Progress</span>
                  <span className="text-sm font-bold text-gray-900">43%</span>
                </div>
                <Progress value={43} className="h-3" />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
                {journeyStages.map((stage, index) => (
                  <div
                    key={stage.id}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      stage.status === 'completed' 
                        ? 'border-green-200 bg-green-50' 
                        : stage.status === 'current'
                        ? 'border-purple-200 bg-purple-50 ring-2 ring-purple-200'
                        : 'border-gray-200 bg-gray-50'
                    }`}
                    onClick={() => setCurrentStage(stage.id)}
                  >
                    <div className="text-center">
                      <div className={`w-12 h-12 mx-auto mb-2 rounded-full flex items-center justify-center bg-gradient-to-r ${stage.color}`}>
                        <stage.icon className="h-6 w-6 text-white" />
                      </div>
                      <h3 className="font-semibold text-sm text-gray-900 mb-1">{stage.title}</h3>
                      <p className="text-xs text-gray-600 mb-2">{stage.description}</p>
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
        </motion.div>

        {/* Stage Details */}
        <Tabs value={currentStage.toString()} onValueChange={(value) => setCurrentStage(parseInt(value))}>
          {/* Stage 1: Signup & Verification */}
          <TabsContent value="1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-8"
            >
              <Card className="shadow-lg border-0">
                <CardHeader className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-t-lg">
                  <CardTitle className="flex items-center gap-2">
                    <UserCheck className="h-5 w-5" />
                    Verification Status
                  </CardTitle>
                  <CardDescription className="text-blue-100">
                    Your mentor profile verification details
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                      <div className="flex items-center space-x-3">
                        <CheckCircle2 className="h-5 w-5 text-green-600" />
                        <div>
                          <p className="font-medium text-gray-900">Email Verified</p>
                          <p className="text-sm text-gray-600">mentor@example.com</p>
                        </div>
                      </div>
                      <Badge className="bg-green-100 text-green-800">Verified</Badge>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                      <div className="flex items-center space-x-3">
                        <Shield className="h-5 w-5 text-green-600" />
                        <div>
                          <p className="font-medium text-gray-900">Admin Approval</p>
                          <p className="text-sm text-gray-600">Profile reviewed and approved</p>
                        </div>
                      </div>
                      <Badge className="bg-green-100 text-green-800">Approved</Badge>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <div className="flex items-center space-x-3">
                        <User className="h-5 w-5 text-blue-600" />
                        <div>
                          <p className="font-medium text-gray-900">Mentor Role Assigned</p>
                          <p className="text-sm text-gray-600">Full access to mentor features</p>
                        </div>
                      </div>
                      <Badge className="bg-blue-100 text-blue-800">Active</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-lg border-0">
                <CardHeader className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-t-lg">
                  <CardTitle className="flex items-center gap-2">
                    <ArrowRight className="h-5 w-5" />
                    Next Steps
                  </CardTitle>
                  <CardDescription className="text-indigo-100">
                    Complete your mentor profile setup
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <Button 
                      className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                      onClick={() => setCurrentStage(2)}
                    >
                      <Settings className="h-4 w-4 mr-2" />
                      Setup Your Profile
                    </Button>
                    
                    <div className="text-center text-sm text-gray-600">
                      <p>✅ Email verification completed</p>
                      <p>✅ Admin approval received</p>
                      <p>🎯 Ready for profile setup</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          {/* Stage 2: Profile Setup */}
          <TabsContent value="2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-8"
            >
              <Card className="shadow-lg border-0">
                <CardHeader className="bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-t-lg">
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5" />
                    Expertise & Domains
                  </CardTitle>
                  <CardDescription className="text-green-100">
                    Your areas of expertise and specialization
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Primary Domains</h4>
                      <div className="flex flex-wrap gap-2">
                        <Badge className="bg-blue-100 text-blue-800">Artificial Intelligence</Badge>
                        <Badge className="bg-green-100 text-green-800">Product Management</Badge>
                        <Badge className="bg-purple-100 text-purple-800">Frontend Development</Badge>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Experience Level</h4>
                      <Badge className="bg-orange-100 text-orange-800">8+ Years Senior Level</Badge>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Skills</h4>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="outline">React</Badge>
                        <Badge variant="outline">Python</Badge>
                        <Badge variant="outline">Machine Learning</Badge>
                        <Badge variant="outline">Team Leadership</Badge>
                        <Badge variant="outline">Strategy</Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-lg border-0">
                <CardHeader className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-t-lg">
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Availability & Preferences
                  </CardTitle>
                  <CardDescription className="text-blue-100">
                    When and how you prefer to mentor
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Weekly Availability</h4>
                      <p className="text-sm text-gray-600 mb-2">10 hours per week</p>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Monday - Friday</span>
                          <span className="text-sm text-gray-600">6:00 PM - 8:00 PM</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Saturday</span>
                          <span className="text-sm text-gray-600">10:00 AM - 2:00 PM</span>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Mentoring Preferences</h4>
                      <div className="space-y-2">
                        <Badge className="bg-purple-100 text-purple-800">1:1 Sessions</Badge>
                        <Badge className="bg-blue-100 text-blue-800">Group Workshops</Badge>
                        <Badge className="bg-green-100 text-green-800">Mock Interviews</Badge>
                      </div>
                    </div>
                    
                    <Button 
                      className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                      onClick={() => setCurrentStage(3)}
                    >
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Start Community Engagement
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          {/* Stage 3: Community Engagement */}
          <TabsContent value="3">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              {/* Current Activity */}
              <Card className="shadow-lg border-0">
                <CardHeader className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-t-lg">
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5" />
                    Community Engagement Activity
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
                    <h4 className="font-semibold text-gray-900">Recent Community Activities</h4>
                    {[
                      {
                        type: "answer",
                        title: "How to transition from Frontend to Full Stack?",
                        upvotes: 23,
                        time: "2 hours ago",
                        category: "Career Advice"
                      },
                      {
                        type: "post",
                        title: "Best Practices for React Performance Optimization",
                        upvotes: 45,
                        time: "1 day ago",
                        category: "Technical"
                      },
                      {
                        type: "answer",
                        title: "Salary negotiation tips for fresh graduates",
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
                        <div className="flex items-center space-x-2">
                          <div className="flex items-center text-sm text-gray-600">
                            <ThumbsUp className="h-4 w-4 mr-1" />
                            {activity.upvotes}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Community Leaderboard */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card className="shadow-lg border-0">
                  <CardHeader className="bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-t-lg">
                    <CardTitle className="flex items-center gap-2">
                      <Trophy className="h-5 w-5" />
                      Community Leaderboard
                    </CardTitle>
                    <CardDescription className="text-orange-100">
                      Your ranking among mentors this month
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                        <div className="flex items-center space-x-3">
                          <Crown className="h-6 w-6 text-yellow-600" />
                          <div>
                            <p className="font-medium text-gray-900">Your Rank</p>
                            <p className="text-sm text-gray-600">#3 out of 127 mentors</p>
                          </div>
                        </div>
                        <Badge className="bg-yellow-100 text-yellow-800">Top 3%</Badge>
                      </div>
                      
                      <div className="space-y-2">
                        <h4 className="font-medium text-gray-900">Top Contributors</h4>
                        {[
                          { name: "Rajesh Kumar", score: 892, rank: 1 },
                          { name: "Priya Sharma", score: 756, rank: 2 },
                          { name: "You", score: 684, rank: 3, highlight: true },
                          { name: "Amit Singh", score: 612, rank: 4 },
                          { name: "Neha Patel", score: 589, rank: 5 }
                        ].map((mentor, index) => (
                          <div key={index} className={`flex items-center justify-between p-2 rounded ${mentor.highlight ? 'bg-purple-50 border border-purple-200' : 'bg-gray-50'}`}>
                            <div className="flex items-center space-x-3">
                              <span className="text-sm font-medium text-gray-600">#{mentor.rank}</span>
                              <span className={`text-sm ${mentor.highlight ? 'font-semibold text-purple-900' : 'text-gray-900'}`}>{mentor.name}</span>
                            </div>
                            <span className="text-sm font-medium text-gray-900">{mentor.score} pts</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="shadow-lg border-0">
                  <CardHeader className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-t-lg">
                    <CardTitle className="flex items-center gap-2">
                      <Target className="h-5 w-5" />
                      Engagement Goals
                    </CardTitle>
                    <CardDescription className="text-indigo-100">
                      Progress toward next milestone
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium text-gray-700">Monthly Answers Goal</span>
                          <span className="text-sm font-bold text-gray-900">43/50</span>
                        </div>
                        <Progress value={86} className="h-2" />
                        <p className="text-xs text-gray-600 mt-1">7 more answers to unlock Sessions Management</p>
                      </div>
                      
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium text-gray-700">Community Rating</span>
                          <span className="text-sm font-bold text-gray-900">4.8/5.0</span>
                        </div>
                        <Progress value={96} className="h-2" />
                        <p className="text-xs text-gray-600 mt-1">Excellent rating achieved!</p>
                      </div>
                      
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium text-gray-700">Total Upvotes</span>
                          <span className="text-sm font-bold text-gray-900">127/150</span>
                        </div>
                        <Progress value={85} className="h-2" />
                        <p className="text-xs text-gray-600 mt-1">23 more upvotes for featured mentor badge</p>
                      </div>
                    </div>
                    
                    <Button 
                      className="w-full mt-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                      onClick={() => setCurrentStage(4)}
                    >
                      <Calendar className="h-4 w-4 mr-2" />
                      Unlock Sessions Management
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          </TabsContent>

          {/* Stage 4: Sessions Management */}
          <TabsContent value="4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              <Card className="shadow-lg border-0">
                <CardHeader className="bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-t-lg">
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Sessions Management Hub
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
            </motion.div>
          </TabsContent>

          {/* Continue with other stages... */}
          <TabsContent value="5">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-12"
            >
              <Users className="h-16 w-16 text-indigo-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Mentorship Matching</h2>
              <p className="text-gray-600 mb-4">Get matched with mentees based on your expertise</p>
              <Badge className="bg-yellow-100 text-yellow-800">Coming Soon</Badge>
            </motion.div>
          </TabsContent>

          <TabsContent value="6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-12"
            >
              <BarChart3 className="h-16 w-16 text-teal-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Success Tracking</h2>
              <p className="text-gray-600 mb-4">Monitor feedback and ratings from students</p>
              <Badge className="bg-yellow-100 text-yellow-800">Coming Soon</Badge>
            </motion.div>
          </TabsContent>

          <TabsContent value="7">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-12"
            >
              <Award className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Recognition & Rewards</h2>
              <p className="text-gray-600 mb-4">Earn badges and appear in top mentors list</p>
              <Badge className="bg-yellow-100 text-yellow-800">Coming Soon</Badge>
            </motion.div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}