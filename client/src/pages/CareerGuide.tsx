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
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="pathfinder" className="flex items-center gap-1">
                    <MessageCircle className="h-4 w-4" />
                    PathFinder
                  </TabsTrigger>
                  <TabsTrigger value="assessment">Assessment</TabsTrigger>
                  <TabsTrigger value="results" disabled={!quizCompleted}>Results</TabsTrigger>
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
                
                <TabsContent value="assessment" className="space-y-4">
                  {quizCompleted ? (
                    <div className="text-center py-6">
                      <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold mb-2">Assessment Completed!</h3>
                      <p className="text-gray-600 mb-4">You've already completed the career assessment.</p>
                      <div className="flex justify-center space-x-4">
                        <Button 
                          variant="outline" 
                          onClick={() => setActiveTab("results")}
                        >
                          View Results
                        </Button>
                        <Button>Retake Assessment</Button>
                      </div>
                    </div>
                  ) : (
                    <CareerQuiz userId={USER_ID} onComplete={handleQuizComplete} />
                  )}
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
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card>
                          <CardHeader>
                            <CardTitle>Recommended Niche: {latestQuizResult.recommendedNiches[0]}</CardTitle>
                            <CardDescription>
                              A detailed look at why {latestQuizResult.recommendedNiches[0]} might be right for you
                            </CardDescription>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <div>
                              <h4 className="font-medium mb-1">What is {latestQuizResult.recommendedNiches[0]}?</h4>
                              <p className="text-sm text-gray-600">
                                {latestQuizResult.recommendedNiches[0]} focuses on creating systems that can learn from and make decisions based on data. It's a subset of artificial intelligence that uses statistical techniques to give computers the ability to "learn" from data.
                              </p>
                            </div>
                            
                            <div>
                              <h4 className="font-medium mb-1">Key Skills Required:</h4>
                              <div className="grid grid-cols-2 gap-2">
                                <Badge variant="outline" className="justify-start">Python</Badge>
                                <Badge variant="outline" className="justify-start">TensorFlow/PyTorch</Badge>
                                <Badge variant="outline" className="justify-start">Statistics</Badge>
                                <Badge variant="outline" className="justify-start">Data Preprocessing</Badge>
                              </div>
                            </div>
                            
                            <div>
                              <h4 className="font-medium mb-1">Companies Hiring:</h4>
                              <p className="text-sm text-gray-600">
                                Google, Amazon, Microsoft, IBM, Infosys, TCS, Wipro, Freshworks
                              </p>
                            </div>
                            
                            <Button className="w-full">
                              Explore Courses in {latestQuizResult.recommendedNiches[0]}
                            </Button>
                          </CardContent>
                        </Card>
                        
                        <Card>
                          <CardHeader>
                            <CardTitle>Career Path Roadmap</CardTitle>
                            <CardDescription>
                              A step-by-step guide to becoming a {latestQuizResult.recommendedCareer} professional
                            </CardDescription>
                          </CardHeader>
                          <CardContent>
                            <div className="relative pl-8 space-y-6 before:absolute before:left-4 before:top-3 before:bottom-3 before:w-0.5 before:bg-gray-200">
                              <div className="relative">
                                <div className="absolute -left-8 top-1 flex items-center justify-center w-6 h-6 rounded-full bg-primary text-white text-sm">1</div>
                                <h4 className="font-medium">Learn the Fundamentals</h4>
                                <p className="text-sm text-gray-600 mt-1">Start with Python programming, statistics, and data analysis basics.</p>
                              </div>
                              
                              <div className="relative">
                                <div className="absolute -left-8 top-1 flex items-center justify-center w-6 h-6 rounded-full bg-primary text-white text-sm">2</div>
                                <h4 className="font-medium">Build Core Skills</h4>
                                <p className="text-sm text-gray-600 mt-1">Master data manipulation, visualization, and machine learning algorithms.</p>
                              </div>
                              
                              <div className="relative">
                                <div className="absolute -left-8 top-1 flex items-center justify-center w-6 h-6 rounded-full bg-primary text-white text-sm">3</div>
                                <h4 className="font-medium">Work on Projects</h4>
                                <p className="text-sm text-gray-600 mt-1">Apply your skills to real-world projects and build a portfolio.</p>
                              </div>
                              
                              <div className="relative">
                                <div className="absolute -left-8 top-1 flex items-center justify-center w-6 h-6 rounded-full bg-primary text-white text-sm">4</div>
                                <h4 className="font-medium">Gain Experience</h4>
                                <p className="text-sm text-gray-600 mt-1">Internships, freelancing, or entry-level positions to build experience.</p>
                              </div>
                            </div>
                            
                            <Button variant="outline" className="w-full mt-6">
                              Download Complete Roadmap PDF
                            </Button>
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <p className="text-gray-600">No assessment results found. Please complete the assessment.</p>
                      <Button className="mt-4" onClick={() => setActiveTab("assessment")}>
                        Take Assessment
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
