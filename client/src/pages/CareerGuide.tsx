import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSidebar } from "@/hooks/use-sidebar";
import Sidebar from "@/components/layout/Sidebar";
import MobileHeader from "@/components/ui/mobile-header";
import MobileNavigation from "@/components/layout/MobileNavigation";
import MobileSidebar from "@/components/layout/MobileSidebar";
import CareerQuiz from "@/components/career/CareerQuiz";
import PathFinder from "@/components/career/PathFinder";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Compass, CheckCircle, ArrowRight, BarChart, Brain, Cpu, LineChart, MessageCircle } from "lucide-react";

// Mock user ID until authentication is implemented
const USER_ID = 1;

interface CareerGuideProps {}

export default function CareerGuide({}: CareerGuideProps) {
  const { isSidebarOpen, closeSidebar } = useSidebar();
  const [activeTab, setActiveTab] = useState<string>("pathfinder");
  const [quizCompleted, setQuizCompleted] = useState<boolean>(false);
  const queryClient = useQueryClient();

  // Fetch user data
  const { data: userData, isLoading: loadingUser } = useQuery({
    queryKey: [`/api/users/${USER_ID}`],
    queryFn: undefined, // Use default queryFn from queryClient
  });

  // Fetch quiz results
  const { data: quizResults, isLoading: loadingQuiz } = useQuery({
    queryKey: [`/api/users/${USER_ID}/quiz-results`],
    queryFn: undefined, // Use default queryFn from queryClient
  });

  // Close sidebar when navigating to this page
  useEffect(() => {
    closeSidebar();
  }, [closeSidebar]);

  // Check if user has completed the quiz
  useEffect(() => {
    if (quizResults && quizResults.length > 0) {
      setQuizCompleted(true);
    }
  }, [quizResults]);

  const handleQuizComplete = (result: any) => {
    setQuizCompleted(true);
    setActiveTab("results");
    queryClient.invalidateQueries({ queryKey: [`/api/users/${USER_ID}/quiz-results`] });
  };

  const isLoading = loadingUser || loadingQuiz;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
          <p className="mt-4 text-gray-600">Loading career guide...</p>
        </div>
      </div>
    );
  }

  const latestQuizResult = quizResults && quizResults.length > 0 ? quizResults[0] : null;

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Mobile Header */}
      <MobileHeader user={userData || { name: 'Ananya Singh', avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6' }} />

      {/* Sidebar */}
      <Sidebar user={userData || { name: 'Ananya Singh', email: 'ananya.s@example.com', avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6' }} />

      {/* Mobile Sidebar */}
      {isSidebarOpen && (
        <MobileSidebar 
          isOpen={isSidebarOpen} 
          onClose={closeSidebar} 
          user={userData || { name: 'Ananya Singh', email: 'ananya.s@example.com', avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6' }}
        />
      )}

      {/* Main Content */}
      <main className="flex-1 relative">
        <div className="px-4 py-6 md:px-8 pb-20 md:pb-6">
          <div className="flex items-center mb-6">
            <Compass className="h-6 w-6 mr-2 text-primary" />
            <h1 className="text-2xl font-bold text-gray-900">Career Guide</h1>
          </div>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Discover Your Ideal Career Path</CardTitle>
              <CardDescription>
                Our AI-powered career assessment takes into account your skills, interests, and personality to recommend the best career path for you.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="pathfinder" className="flex items-center gap-1">
                    <MessageCircle className="h-4 w-4" />
                    PathFinder Chat
                  </TabsTrigger>
                  <TabsTrigger value="results" disabled={!quizCompleted}>Your Roadmap</TabsTrigger>
                </TabsList>
                
                <TabsContent value="pathfinder" className="space-y-4">
                  <div className="bg-gradient-to-r from-primary/5 to-primary/10 rounded-lg p-4 mb-4">
                    <h3 className="font-semibold flex items-center">
                      <MessageCircle className="h-5 w-5 mr-2 text-primary" />
                      PathFinder: AI Career Chat
                    </h3>
                    <p className="text-sm text-gray-600">
                      Have a quick chat with our AI to discover the perfect career path based on your interests.
                    </p>
                  </div>
                  <div className="border rounded-lg overflow-hidden" style={{ height: '65vh' }}>
                    <PathFinder />
                  </div>
                </TabsContent>
                
                <TabsContent value="results">
                  {latestQuizResult ? (
                    <div className="space-y-6">
                      <div className="bg-gradient-to-br from-primary to-indigo-700 rounded-xl shadow-md p-6 text-white">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="text-xl font-bold">{latestQuizResult.recommendedCareer}</h3>
                            <p className="text-indigo-100 mt-1">Your top career match based on your assessment</p>
                          </div>
                          <Badge className="bg-white text-primary">95% Match</Badge>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 mt-6">
                          <div className="bg-white/10 rounded-lg p-4">
                            <h4 className="font-medium mb-2">Your Strengths</h4>
                            <ul className="space-y-1 text-sm">
                              <li className="flex items-center">
                                <CheckCircle className="h-4 w-4 mr-2" />
                                Analytical Thinking
                              </li>
                              <li className="flex items-center">
                                <CheckCircle className="h-4 w-4 mr-2" />
                                Problem Solving
                              </li>
                              <li className="flex items-center">
                                <CheckCircle className="h-4 w-4 mr-2" />
                                Technical Aptitude
                              </li>
                            </ul>
                          </div>
                          
                          <div className="bg-white/10 rounded-lg p-4">
                            <h4 className="font-medium mb-2">Skill Gaps</h4>
                            <ul className="space-y-1 text-sm">
                              <li className="flex items-center">
                                <ArrowRight className="h-4 w-4 mr-2" />
                                Advanced Statistics
                              </li>
                              <li className="flex items-center">
                                <ArrowRight className="h-4 w-4 mr-2" />
                                Database Management
                              </li>
                              <li className="flex items-center">
                                <ArrowRight className="h-4 w-4 mr-2" />
                                Cloud Computing
                              </li>
                            </ul>
                          </div>
                        </div>
                        
                        <div className="mt-6">
                          <h4 className="font-medium mb-2">Recommended Focus Areas:</h4>
                          <div className="flex flex-wrap gap-2">
                            {latestQuizResult.recommendedNiches.map((niche: string, index: number) => (
                              <Badge key={index} variant="outline" className="bg-white/20 text-white border-none">
                                {niche}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Card>
                          <CardHeader className="pb-2">
                            <div className="flex items-center space-x-2">
                              <BarChart className="h-5 w-5 text-primary" />
                              <CardTitle className="text-lg">Salary Range</CardTitle>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <p className="text-2xl font-bold">₹5-12 LPA</p>
                            <p className="text-sm text-gray-500">Entry-level to experienced range in India</p>
                          </CardContent>
                        </Card>
                        
                        <Card>
                          <CardHeader className="pb-2">
                            <div className="flex items-center space-x-2">
                              <Brain className="h-5 w-5 text-primary" />
                              <CardTitle className="text-lg">Growth Areas</CardTitle>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <ul className="text-sm space-y-1">
                              <li className="flex items-center">
                                <CheckCircle className="h-3 w-3 mr-2 text-green-500" />
                                Machine Learning
                              </li>
                              <li className="flex items-center">
                                <CheckCircle className="h-3 w-3 mr-2 text-green-500" />
                                Big Data Analytics
                              </li>
                              <li className="flex items-center">
                                <CheckCircle className="h-3 w-3 mr-2 text-green-500" />
                                Business Intelligence
                              </li>
                            </ul>
                          </CardContent>
                        </Card>
                        
                        <Card>
                          <CardHeader className="pb-2">
                            <div className="flex items-center space-x-2">
                              <LineChart className="h-5 w-5 text-primary" />
                              <CardTitle className="text-lg">Demand Trend</CardTitle>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <div className="flex items-center">
                              <div className="w-full bg-gray-200 rounded-full h-2.5 mr-2">
                                <div className="bg-green-600 h-2.5 rounded-full" style={{ width: '85%' }}></div>
                              </div>
                              <span className="text-green-600 font-medium">85%</span>
                            </div>
                            <p className="text-sm text-gray-500 mt-1">High demand in Indian job market</p>
                          </CardContent>
                        </Card>
                      </div>
                      
                      <Card className="w-full">
                        <CardHeader>
                          <CardTitle>Your Personalized Career Roadmap</CardTitle>
                          <CardDescription>
                            Detailed guide to becoming a {latestQuizResult.recommendedCareer} with focus on {latestQuizResult.recommendedNiches[0]}
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="p-0">
                          <div className="bg-primary/10 p-4">
                            <h3 className="text-lg font-bold flex items-center mb-2">
                              <Briefcase className="w-5 h-5 mr-2 text-primary" />
                              {latestQuizResult.recommendedCareer} Roadmap
                            </h3>
                            <p className="text-sm text-gray-600">
                              A comprehensive guide to help you build a successful career in this high-demand field.
                            </p>
                          </div>
                          
                          <div className="h-[500px] overflow-y-auto">
                            <div className="p-4 space-y-6">
                              {/* Industry Overview */}
                              <div>
                                <h4 className="text-lg font-semibold mb-2">Industry Overview</h4>
                                <p className="text-sm mb-3">
                                  {latestQuizResult.recommendedNiches[0] === "Data Science" ? 
                                    "Data Science combines statistics, programming, and domain expertise to extract meaningful insights from data. With India's digital transformation and growing tech sector, Data Scientists are in high demand across industries." : 
                                    "This growing field offers excellent opportunities for technical professionals with analytical mindsets. In India, the demand for these skills continues to rise as companies invest more in technology solutions."
                                  }
                                </p>
                                <div className="space-y-2">
                                  <div className="bg-muted p-2 rounded-md text-sm">
                                    "Many professionals in this field report high job satisfaction and above-average compensation compared to other roles in the tech industry."
                                  </div>
                                  <div className="bg-muted p-2 rounded-md text-sm">
                                    "Starting salaries in India for entry-level positions range from ₹5-8 LPA, with experienced professionals earning ₹20+ LPA."
                                  </div>
                                </div>
                              </div>
                              
                              <Separator />
                              
                              {/* Day in the Life */}
                              <div>
                                <h4 className="text-lg font-semibold mb-2">Day in the Life</h4>
                                <ul className="space-y-2">
                                  <li className="text-sm flex items-start">
                                    <Check className="w-4 h-4 text-green-500 mr-2 mt-0.5" />
                                    <span>Analyze data and identify patterns to solve business problems</span>
                                  </li>
                                  <li className="text-sm flex items-start">
                                    <Check className="w-4 h-4 text-green-500 mr-2 mt-0.5" />
                                    <span>Collaborate with cross-functional teams to implement solutions</span>
                                  </li>
                                  <li className="text-sm flex items-start">
                                    <Check className="w-4 h-4 text-green-500 mr-2 mt-0.5" />
                                    <span>Build and optimize algorithms to enhance system performance</span>
                                  </li>
                                  <li className="text-sm flex items-start">
                                    <Check className="w-4 h-4 text-green-500 mr-2 mt-0.5" />
                                    <span>Present findings and recommendations to stakeholders</span>
                                  </li>
                                  <li className="text-sm flex items-start">
                                    <Check className="w-4 h-4 text-green-500 mr-2 mt-0.5" />
                                    <span>Stay updated with the latest industry trends and techniques</span>
                                  </li>
                                </ul>
                              </div>
                              
                              <Separator />
                              
                              {/* Skills Needed */}
                              <div>
                                <h4 className="text-lg font-semibold mb-2">Skills Needed</h4>
                                
                                <h5 className="font-medium text-sm mb-2">Technical Skills</h5>
                                <div className="flex flex-wrap gap-1.5 mb-4">
                                  <Badge variant="outline" className="bg-blue-50">Python</Badge>
                                  <Badge variant="outline" className="bg-blue-50">SQL</Badge>
                                  <Badge variant="outline" className="bg-blue-50">Statistics</Badge>
                                  <Badge variant="outline" className="bg-blue-50">Machine Learning</Badge>
                                  <Badge variant="outline" className="bg-blue-50">Data Visualization</Badge>
                                  <Badge variant="outline" className="bg-blue-50">Cloud Platforms</Badge>
                                </div>
                                
                                <h5 className="font-medium text-sm mb-2">Soft Skills</h5>
                                <div className="flex flex-wrap gap-1.5">
                                  <Badge variant="outline" className="bg-green-50">Problem-solving</Badge>
                                  <Badge variant="outline" className="bg-green-50">Communication</Badge>
                                  <Badge variant="outline" className="bg-green-50">Critical Thinking</Badge>
                                  <Badge variant="outline" className="bg-green-50">Teamwork</Badge>
                                  <Badge variant="outline" className="bg-green-50">Business Acumen</Badge>
                                </div>
                              </div>
                              
                              <Separator />
                              
                              {/* Courses */}
                              <div>
                                <h4 className="text-lg font-semibold mb-2">Recommended Courses</h4>
                                <div className="space-y-3">
                                  <div className="bg-muted p-3 rounded-md">
                                    <div className="flex justify-between items-start">
                                      <div>
                                        <h5 className="font-medium text-sm">Foundations of Data Science</h5>
                                        <a href="/courses" className="text-xs text-primary underline">View details</a>
                                      </div>
                                      <Badge variant="outline" className="text-xs">Beginner</Badge>
                                    </div>
                                  </div>
                                  <div className="bg-muted p-3 rounded-md">
                                    <div className="flex justify-between items-start">
                                      <div>
                                        <h5 className="font-medium text-sm">Advanced Machine Learning</h5>
                                        <a href="/courses" className="text-xs text-primary underline">View details</a>
                                      </div>
                                      <Badge variant="outline" className="text-xs">Intermediate</Badge>
                                    </div>
                                  </div>
                                  <div className="bg-muted p-3 rounded-md">
                                    <div className="flex justify-between items-start">
                                      <div>
                                        <h5 className="font-medium text-sm">Deep Learning & Neural Networks</h5>
                                        <a href="/courses" className="text-xs text-primary underline">View details</a>
                                      </div>
                                      <Badge variant="outline" className="text-xs">Advanced</Badge>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              
                              <Separator />
                              
                              {/* Projects */}
                              <div>
                                <h4 className="text-lg font-semibold mb-2">Projects to Build</h4>
                                <div className="space-y-3">
                                  <div className="bg-muted p-3 rounded-md">
                                    <div className="flex justify-between items-start mb-2">
                                      <h5 className="font-medium text-sm">Exploratory Data Analysis Project</h5>
                                      <Badge variant="outline" className="text-xs">Beginner</Badge>
                                    </div>
                                    <div className="flex flex-wrap gap-1">
                                      <Badge variant="outline" className="text-xs bg-white">Python</Badge>
                                      <Badge variant="outline" className="text-xs bg-white">Pandas</Badge>
                                      <Badge variant="outline" className="text-xs bg-white">Visualization</Badge>
                                    </div>
                                  </div>
                                  <div className="bg-muted p-3 rounded-md">
                                    <div className="flex justify-between items-start mb-2">
                                      <h5 className="font-medium text-sm">Predictive Analysis Dashboard</h5>
                                      <Badge variant="outline" className="text-xs">Intermediate</Badge>
                                    </div>
                                    <div className="flex flex-wrap gap-1">
                                      <Badge variant="outline" className="text-xs bg-white">Machine Learning</Badge>
                                      <Badge variant="outline" className="text-xs bg-white">Dashboard</Badge>
                                      <Badge variant="outline" className="text-xs bg-white">Real-time Data</Badge>
                                    </div>
                                  </div>
                                  <div className="bg-muted p-3 rounded-md">
                                    <div className="flex justify-between items-start mb-2">
                                      <h5 className="font-medium text-sm">Industry-Specific ML Application</h5>
                                      <Badge variant="outline" className="text-xs">Advanced</Badge>
                                    </div>
                                    <div className="flex flex-wrap gap-1">
                                      <Badge variant="outline" className="text-xs bg-white">Deep Learning</Badge>
                                      <Badge variant="outline" className="text-xs bg-white">Production Deployment</Badge>
                                      <Badge variant="outline" className="text-xs bg-white">API Integration</Badge>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              
                              <Separator />
                              
                              {/* Network & Hire */}
                              <div>
                                <h4 className="text-lg font-semibold mb-2">Network & Hire</h4>
                                
                                <h5 className="font-medium text-sm mb-2">Communities to Join</h5>
                                <ul className="space-y-1 mb-4">
                                  <li className="text-sm flex items-start">
                                    <Check className="w-4 h-4 text-green-500 mr-2 mt-0.5" />
                                    <span>Analytics Vidhya</span>
                                  </li>
                                  <li className="text-sm flex items-start">
                                    <Check className="w-4 h-4 text-green-500 mr-2 mt-0.5" />
                                    <span>Kaggle Community</span>
                                  </li>
                                  <li className="text-sm flex items-start">
                                    <Check className="w-4 h-4 text-green-500 mr-2 mt-0.5" />
                                    <span>LinkedIn Groups for Data Professionals</span>
                                  </li>
                                  <li className="text-sm flex items-start">
                                    <Check className="w-4 h-4 text-green-500 mr-2 mt-0.5" />
                                    <span>GitHub Open Source Projects</span>
                                  </li>
                                </ul>
                                
                                <h5 className="font-medium text-sm mb-2">Career Success Tips</h5>
                                <ul className="space-y-1">
                                  <li className="text-sm flex items-start">
                                    <Check className="w-4 h-4 text-green-500 mr-2 mt-0.5" />
                                    <span>Build a strong GitHub portfolio showcasing your projects</span>
                                  </li>
                                  <li className="text-sm flex items-start">
                                    <Check className="w-4 h-4 text-green-500 mr-2 mt-0.5" />
                                    <span>Participate in hackathons and competitions</span>
                                  </li>
                                  <li className="text-sm flex items-start">
                                    <Check className="w-4 h-4 text-green-500 mr-2 mt-0.5" />
                                    <span>Build a professional online presence through blogs or tutorials</span>
                                  </li>
                                  <li className="text-sm flex items-start">
                                    <Check className="w-4 h-4 text-green-500 mr-2 mt-0.5" />
                                    <span>Network with professionals through meetups and conferences</span>
                                  </li>
                                </ul>
                              </div>
                            </div>
                          </div>
                          
                          <div className="p-4 border-t">
                            <div className="flex gap-2">
                              <Button className="flex-1 gap-1">
                                <Book className="w-4 h-4" />
                                Browse Courses
                              </Button>
                              <Button variant="outline" className="flex-1 gap-1">
                                <FileText className="w-4 h-4" />
                                Download PDF
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <p className="text-gray-600">No career roadmap found yet. Please use PathFinder to discover your ideal career path.</p>
                      <Button className="mt-4" onClick={() => setActiveTab("pathfinder")}>
                        Try PathFinder
                      </Button>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Mobile Navigation */}
      <MobileNavigation />
    </div>
  );
}
