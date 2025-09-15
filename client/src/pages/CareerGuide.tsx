import { useState, useEffect, useRef, useCallback } from "react";
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
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { useLocation } from "wouter";
import {
  Bot,
  Send,
  User,
  Sparkles,
  Target,
  Clock,
  TrendingUp,
  BookOpen,
  Code,
  Users,
  MapPin,
  CheckCircle,
  AlertCircle,
  Lightbulb,
  Brain,
  Zap,
  Loader2,
  RefreshCw,
  Download,
  Star,
  ChevronRight,
  Briefcase,
  DollarSign,
  Calendar,
  Award,
  ArrowRight,
  MessageSquare,
  Wand2,
  Rocket
} from "lucide-react";

interface Message {
  id: string;
  role: 'user' | 'ai';
  content: string;
  timestamp: Date;
  isLoading?: boolean;
}

interface CareerRecommendation {
  title: string;
  description: string;
  match_percentage: number;
  salary_range: string;
  growth_outlook: string;
  key_skills: string[];
  daily_tasks: string[];
  learning_path: string[];
  time_to_proficiency: string;
  difficulty_level: 'Beginner' | 'Intermediate' | 'Advanced';
  industry_demand: 'High' | 'Medium' | 'Low';
  reasons: string[];
}

interface GeneratedRoadmap {
  career_path: string;
  overview: string;
  total_duration: string;
  phases: {
    phase: string;
    duration: string;
    description: string;
    milestones: string[];
    resources: string[];
    projects: string[];
  }[];
  key_skills: string[];
  certifications: string[];
  salary_progression: {
    entry_level: string;
    mid_level: string;
    senior_level: string;
  };
  next_steps: string[];
}

const ASSESSMENT_QUESTIONS = [
  "What subjects did you enjoy most in school?",
  "Do you prefer working with people, data, or creative projects?",
  "Are you more interested in building things, analyzing information, or solving problems?",
  "What's your comfort level with technology and programming?",
  "Do you prefer structured work environments or flexible, creative spaces?",
  "Are you interested in leadership roles or individual contributor positions?",
  "What motivates you more: high salary, work-life balance, or making an impact?",
  "Do you enjoy continuous learning and staying updated with new technologies?"
];

export default function CareerGuide() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [currentStep, setCurrentStep] = useState<'welcome' | 'assessment' | 'chat' | 'recommendations' | 'roadmap'>('welcome');
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [userResponses, setUserResponses] = useState<string[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [recommendations, setRecommendations] = useState<CareerRecommendation[]>([]);
  const [selectedCareer, setSelectedCareer] = useState<CareerRecommendation | null>(null);
  const [generatedRoadmap, setGeneratedRoadmap] = useState<GeneratedRoadmap | null>(null);
  const [userProfile, setUserProfile] = useState({
    name: '',
    age: '',
    education: '',
    experience: '',
    interests: ''
  });
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [conversationId, setConversationId] = useState<number | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Initialize or restore conversation on component mount
  useEffect(() => {
    initializeConversation();
  }, []);

  // Initialize conversation - check for existing session or create new one
  const initializeConversation = async () => {
    try {
      // Check if there's a session in localStorage
      const savedSessionId = localStorage.getItem('ai-career-chat-session');
      
      if (savedSessionId) {
        // Try to restore existing conversation
        const response = await apiRequest({
          url: `/api/ai-career-coach/conversation/${savedSessionId}/messages`,
          method: 'GET'
        });
        
        if (response.success) {
          setSessionId(savedSessionId);
          setConversationId(response.conversation.id);
          
          // Restore messages
          const restoredMessages = response.messages.map((msg: any) => ({
            ...msg,
            timestamp: new Date(msg.timestamp)
          }));
          
          // Restore state based on conversation metadata
          const metadata = response.conversation.metadata;
          let restoredStep = 'welcome';
          
          if (metadata) {
            if (metadata.currentStep) {
              restoredStep = metadata.currentStep;
              setCurrentStep(metadata.currentStep);
            }
            if (metadata.userResponses) setUserResponses(metadata.userResponses);
            if (metadata.currentQuestionIndex !== undefined) setCurrentQuestionIndex(metadata.currentQuestionIndex);
            if (metadata.recommendations) setRecommendations(metadata.recommendations);
            if (metadata.selectedCareer) setSelectedCareer(metadata.selectedCareer);
            if (metadata.generatedRoadmap) setGeneratedRoadmap(metadata.generatedRoadmap);
            if (metadata.userProfile) setUserProfile(metadata.userProfile);
          }
          
          // Set messages after state is restored to prevent conflicts
          setMessages(restoredMessages);
          
          // If we have messages but no step saved, at least move to assessment
          if (restoredMessages.length > 0 && restoredStep === 'welcome') {
            setCurrentStep('assessment');
          }
          
          console.log('Conversation restored:', {
            messages: restoredMessages.length,
            step: restoredStep,
            sessionId: savedSessionId
          });
          
          setIsInitializing(false);
          return;
        } else {
          // Session exists but couldn't load - clear it
          localStorage.removeItem('ai-career-chat-session');
        }
      }
      
      // If no existing session or failed to restore, we'll create one when starting assessment
      setIsInitializing(false);
    } catch (error) {
      console.error('Failed to initialize conversation:', error);
      // Clear potentially corrupted session
      localStorage.removeItem('ai-career-chat-session');
      setIsInitializing(false);
    }
  };

  // Create new conversation session
  const createConversation = async (conversationType = 'assessment') => {
    try {
      const newSessionId = crypto.randomUUID();
      const response = await apiRequest({
        url: '/api/ai-career-coach/conversation',
        method: 'POST',
        body: {
          sessionId: newSessionId,
          conversationType
        }
      });
      
      if (response.success) {
        setSessionId(newSessionId);
        setConversationId(response.conversation.id);
        localStorage.setItem('ai-career-chat-session', newSessionId);
        return response.conversation;
      }
    } catch (error) {
      console.error('Failed to create conversation:', error);
    }
    return null;
  };

  // Save message to database
  const saveMessage = useCallback(async (message: Message) => {
    if (!sessionId) return;
    
    try {
      await apiRequest({
        url: `/api/ai-career-coach/conversation/${sessionId}/message`,
        method: 'POST',
        body: {
          role: message.role,
          content: message.content,
          messageType: message.role === 'ai' ? 'assessment_question' : 'text',
          metadata: {}
        }
      });
    } catch (error) {
      console.error('Failed to save message:', error);
    }
  }, [sessionId]);

  // Save conversation state/metadata
  const saveConversationState = useCallback(async () => {
    if (!sessionId) return;
    
    try {
      await apiRequest({
        url: `/api/ai-career-coach/conversation/${sessionId}/metadata`,
        method: 'PUT',
        body: {
          metadata: {
            currentStep,
            userResponses,
            currentQuestionIndex,
            recommendations,
            selectedCareer,
            generatedRoadmap,
            userProfile
          },
          status: currentStep === 'roadmap' ? 'completed' : 'active'
        }
      });
    } catch (error) {
      console.error('Failed to save conversation state:', error);
    }
  }, [sessionId, currentStep, userResponses, currentQuestionIndex, recommendations, selectedCareer, generatedRoadmap, userProfile]);

  // Save state whenever important changes happen
  useEffect(() => {
    if (sessionId) {
      saveConversationState();
    }
  }, [currentStep, userResponses, currentQuestionIndex, recommendations, selectedCareer, generatedRoadmap, saveConversationState]);

  // Start career assessment
  const startAssessment = async () => {
    // Don't start if we already have messages (restored session)
    if (messages.length > 0) {
      console.log('Assessment already in progress, not starting new one');
      return;
    }
    
    // Create conversation if we don't have one
    if (!sessionId) {
      await createConversation('assessment');
    }
    
    setCurrentStep('assessment');
    const initialMessage = {
      id: '1',
      role: 'ai' as const,
      content: `Hi! I'm your AI Career Guide. I'll help you discover the perfect career path based on your interests, skills, and goals. Let's start with a quick assessment.\n\n${ASSESSMENT_QUESTIONS[0]}`,
      timestamp: new Date()
    };
    
    setMessages([initialMessage]);
    
    // Save the initial message
    setTimeout(() => {
      if (sessionId) {
        saveMessage(initialMessage);
      }
    }, 100);
  };

  // Handle assessment responses
  const handleAssessmentResponse = async (response: string) => {
    const newUserMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: response,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, newUserMessage]);
    setUserResponses(prev => [...prev, response]);
    
    // Save user message
    saveMessage(newUserMessage);

    if (currentQuestionIndex < ASSESSMENT_QUESTIONS.length - 1) {
      // Continue with next question
      setTimeout(() => {
        const nextQuestion = ASSESSMENT_QUESTIONS[currentQuestionIndex + 1];
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'ai',
          content: nextQuestion,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, aiMessage]);
        setCurrentQuestionIndex(prev => prev + 1);
        
        // Save AI message
        saveMessage(aiMessage);
      }, 1000);
    } else {
      // Assessment complete, analyze responses and transition to chat
      await analyzeAssessment();
      // After analysis, switch to chat mode
      setTimeout(() => {
        setCurrentStep('chat');
        const chatTransitionMessage: Message = {
          id: (Date.now() + 2).toString(),
          role: 'ai',
          content: "Great! Now that I understand your preferences, feel free to ask me any questions about careers, skills, job market trends, or anything else related to your career journey. I'm here to help!",
          timestamp: new Date()
        };
        setMessages(prev => [...prev, chatTransitionMessage]);
        saveMessage(chatTransitionMessage);
      }, 2000);
    }
  };

  // Analyze assessment and get AI recommendations
  const analyzeAssessment = async () => {
    setIsLoading(true);
    
    try {
      const analysisPrompt = `Based on these career assessment responses, provide 3 personalized career recommendations:

User Responses:
${ASSESSMENT_QUESTIONS.map((q, i) => `Q: ${q}\nA: ${userResponses[i] || 'No response'}`).join('\n\n')}

Please respond with a JSON object containing an array of career recommendations. Each recommendation should include:
- title: Career title
- description: Brief description (2-3 sentences)
- match_percentage: Match percentage (number)
- salary_range: Salary range in Indian context
- growth_outlook: Growth outlook
- key_skills: Array of key skills needed
- daily_tasks: Array of typical daily tasks
- learning_path: Array of learning steps
- time_to_proficiency: Time needed to become proficient
- difficulty_level: "Beginner", "Intermediate", or "Advanced"
- industry_demand: "High", "Medium", or "Low"
- reasons: Array of reasons why this career matches the user

Return only valid JSON.`;

      const response = await apiRequest({
        url: '/api/ai-career-coach/analyze',
        method: 'POST',
        body: { 
          message: analysisPrompt,
          context: 'career_assessment'
        }
      });

      if (response.recommendations) {
        setRecommendations(response.recommendations);
        // Don't immediately set to recommendations step - let it transition to chat first
        
        const recommendationMessage = {
          id: Date.now().toString(),
          role: 'ai' as const,
          content: `Perfect! I've analyzed your responses and generated personalized career recommendations for you. You can view these recommendations anytime by clicking "View Recommendations" below, or continue chatting with me about your career questions.`,
          timestamp: new Date()
        };
        
        setMessages(prev => [...prev, recommendationMessage]);
        
        // Save the recommendation message
        saveMessage(recommendationMessage);
      }
    } catch (error) {
      console.error('Error analyzing assessment:', error);
      toast({
        title: "Analysis Error",
        description: "Unable to analyze your responses. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Generate detailed roadmap for selected career
  const generateRoadmap = async (career: CareerRecommendation) => {
    setSelectedCareer(career);
    setIsLoading(true);

    try {
      const roadmapPrompt = `Create a comprehensive, personalized learning roadmap for becoming a ${career.title}. 

Based on the user's assessment responses:
${ASSESSMENT_QUESTIONS.map((q, i) => `${q}: ${userResponses[i] || 'No response'}`).join('\n')}

Generate a detailed roadmap with the following structure:
- career_path: Career title
- overview: Comprehensive overview (3-4 sentences)
- total_duration: Total time needed
- phases: Array of learning phases (4-6 phases) with:
  - phase: Phase name
  - duration: Time for this phase
  - description: What you'll learn
  - milestones: Key achievements
  - resources: Learning resources
  - projects: Hands-on projects
- key_skills: All essential skills
- certifications: Recommended certifications
- salary_progression: Entry, mid, and senior level salaries in Indian context
- next_steps: Immediate action items

Return only valid JSON.`;

      const response = await apiRequest({
        url: '/api/ai-career-coach/roadmap',
        method: 'POST',
        body: { 
          message: roadmapPrompt,
          career: career.title,
          context: 'roadmap_generation'
        }
      });

      if (response.roadmap) {
        setGeneratedRoadmap(response.roadmap);
        setCurrentStep('roadmap');
        
        const roadmapMessage = {
          id: Date.now().toString(),
          role: 'ai' as const,
          content: `Perfect choice! I've created a comprehensive roadmap for becoming a ${career.title}. This personalized plan is based on your assessment and current industry standards.`,
          timestamp: new Date()
        };
        
        setMessages(prev => [...prev, roadmapMessage]);
        
        // Save the roadmap message
        saveMessage(roadmapMessage);
      }
    } catch (error) {
      console.error('Error generating roadmap:', error);
      toast({
        title: "Roadmap Generation Error",
        description: "Unable to generate roadmap. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Accept roadmap and update career roadmap page
  const acceptRoadmap = async () => {
    if (!generatedRoadmap || !selectedCareer) return;

    try {
      // Save career path to localStorage for Career Roadmap page
      localStorage.setItem('selectedCareerPath', generatedRoadmap.career_path);
      localStorage.setItem('careerRoadmapData', JSON.stringify(generatedRoadmap));
      localStorage.setItem('careerAssessmentComplete', 'true');

      toast({
        title: "Roadmap Accepted!",
        description: `Your ${generatedRoadmap.career_path} roadmap has been saved. Redirecting to your personalized roadmap...`,
      });

      // Redirect to career roadmap page after short delay
      setTimeout(() => {
        setLocation('/career-roadmap');
      }, 2000);

    } catch (error) {
      console.error('Error accepting roadmap:', error);
      toast({
        title: "Save Error",
        description: "Unable to save roadmap. Please try again.",
        variant: "destructive"
      });
    }
  };

  // Send message in chat mode
  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);
    
    // Save user message
    saveMessage(userMessage);

    try {
      const response = await apiRequest({
        url: '/api/ai-career-coach/chat',
        method: 'POST',
        body: { 
          message: inputMessage,
          conversationHistory: messages.slice(-5).map(msg => ({
            role: msg.role === 'ai' ? 'assistant' : 'user',
            content: msg.content
          })),
          coachingType: 'general',
          userProfile: {},
          contextData: { context: 'career_guidance' }
        }
      });

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'ai',
        content: response.response || "I'm here to help with your career questions!",
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
      
      // Save AI response
      saveMessage(aiMessage);
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Message Error",
        description: "Unable to send message. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-100 text-green-700 border-green-200';
      case 'Intermediate': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'Advanced': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getDemandColor = (demand: string) => {
    switch (demand) {
      case 'High': return 'bg-green-100 text-green-700';
      case 'Medium': return 'bg-yellow-100 text-yellow-700';
      case 'Low': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  // Show loading while initializing
  if (isInitializing) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto p-6 flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Loading your career journey...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto p-6">
        {/* Welcome Step */}
        {currentStep === 'welcome' && (
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Brain className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-4xl font-bold text-gray-900 mb-4">AI Career Guide</h1>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Discover your perfect career path with personalized AI recommendations based on your interests, skills, and goals.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card className="text-center">
                <CardContent className="pt-6">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MessageSquare className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="font-semibold mb-2">Smart Assessment</h3>
                  <p className="text-sm text-gray-600">Answer conversational questions to help AI understand your preferences</p>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardContent className="pt-6">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Wand2 className="w-6 h-6 text-green-600" />
                  </div>
                  <h3 className="font-semibold mb-2">AI Recommendations</h3>
                  <p className="text-sm text-gray-600">Get personalized career suggestions with detailed insights and match scores</p>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardContent className="pt-6">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Rocket className="w-6 h-6 text-purple-600" />
                  </div>
                  <h3 className="font-semibold mb-2">Custom Roadmap</h3>
                  <p className="text-sm text-gray-600">Receive a comprehensive learning roadmap tailored to your chosen career</p>
                </CardContent>
              </Card>
            </div>

            <div className="text-center">
              <Button onClick={startAssessment} size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                <Sparkles className="w-5 h-5 mr-2" />
                Start Career Assessment
              </Button>
              <p className="text-sm text-gray-500 mt-4">Takes about 5-10 minutes</p>
            </div>
          </div>
        )}

        {/* Assessment/Chat Step */}
        {(currentStep === 'assessment' || currentStep === 'chat') && (
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">AI Career Assessment</h1>
                <p className="text-gray-600">Having a conversation with your AI career guide</p>
              </div>
              {currentStep === 'assessment' && (
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-500">Progress:</span>
                  <Progress value={(currentQuestionIndex / ASSESSMENT_QUESTIONS.length) * 100} className="w-24" />
                  <span className="text-sm font-medium">{currentQuestionIndex + 1}/{ASSESSMENT_QUESTIONS.length}</span>
                </div>
              )}
            </div>

            <Card className="h-[600px] flex flex-col">
              <CardHeader className="border-b">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <Bot className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">AI Career Guide</CardTitle>
                    <CardDescription>Your personal career discovery assistant</CardDescription>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="flex-1 overflow-hidden p-0">
                <div 
                  ref={chatContainerRef}
                  className="h-full overflow-y-auto p-6 space-y-4"
                >
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={cn(
                        "flex items-start space-x-3",
                        message.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                      )}
                    >
                      <Avatar className="w-8 h-8">
                        {message.role === 'ai' ? (
                          <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                            <Bot className="w-4 h-4 text-white" />
                          </div>
                        ) : (
                          <>
                            <AvatarImage src="" />
                            <AvatarFallback>
                              <User className="w-4 h-4" />
                            </AvatarFallback>
                          </>
                        )}
                      </Avatar>
                      <div
                        className={cn(
                          "max-w-[80%] rounded-lg p-3 whitespace-pre-wrap",
                          message.role === 'user'
                            ? 'bg-blue-600 text-white ml-auto'
                            : 'bg-gray-100 text-gray-900'
                        )}
                      >
                        {message.content}
                        {message.isLoading && (
                          <div className="flex items-center space-x-1 mt-2">
                            <Loader2 className="w-3 h-3 animate-spin" />
                            <span className="text-xs">Thinking...</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                  
                  {isLoading && (
                    <div className="flex items-start space-x-3">
                      <Avatar className="w-8 h-8">
                        <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                          <Bot className="w-4 h-4 text-white" />
                        </div>
                      </Avatar>
                      <div className="bg-gray-100 rounded-lg p-3">
                        <div className="flex items-center space-x-2">
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span className="text-sm text-gray-600">Analyzing your responses...</span>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div ref={messagesEndRef} />
                </div>
              </CardContent>

              <div className="border-t p-4">
                {/* Show recommendations button when available and in chat mode */}
                {currentStep === 'chat' && recommendations.length > 0 && (
                  <div className="mb-4">
                    <Button
                      onClick={() => setCurrentStep('recommendations')}
                      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                    >
                      <Lightbulb className="w-4 h-4 mr-2" />
                      View My Career Recommendations
                    </Button>
                  </div>
                )}
                
                <div className="flex space-x-2">
                  <Input
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    placeholder={currentStep === 'assessment' ? "Type your answer..." : "Ask me anything about careers..."}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        if (currentStep === 'assessment') {
                          handleAssessmentResponse(inputMessage);
                          setInputMessage('');
                        } else {
                          sendMessage();
                        }
                      }
                    }}
                    disabled={isLoading}
                  />
                  <Button
                    onClick={() => {
                      if (currentStep === 'assessment') {
                        handleAssessmentResponse(inputMessage);
                        setInputMessage('');
                      } else {
                        sendMessage();
                      }
                    }}
                    disabled={!inputMessage.trim() || isLoading}
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Recommendations Step */}
        {currentStep === 'recommendations' && (
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">Your Personalized Career Recommendations</h1>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Based on your assessment, here are the top career paths that match your interests, skills, and goals.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {recommendations.map((career, index) => (
                <Card key={index} className="relative overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="absolute top-4 right-4">
                    <Badge className="bg-green-100 text-green-700">
                      {career.match_percentage}% Match
                    </Badge>
                  </div>

                  <CardHeader>
                    <div className="flex items-center space-x-2 mb-2">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <Briefcase className="w-4 h-4 text-blue-600" />
                      </div>
                      <Badge 
                        variant="outline"
                        className={getDifficultyColor(career.difficulty_level)}
                      >
                        {career.difficulty_level}
                      </Badge>
                    </div>
                    <CardTitle className="text-xl">{career.title}</CardTitle>
                    <CardDescription>{career.description}</CardDescription>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center space-x-2">
                        <DollarSign className="w-4 h-4 text-green-600" />
                        <span>{career.salary_range}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <TrendingUp className="w-4 h-4 text-blue-600" />
                        <Badge variant="secondary" className={getDemandColor(career.industry_demand)}>
                          {career.industry_demand} Demand
                        </Badge>
                      </div>
                      <div className="flex items-center space-x-2 col-span-2">
                        <Clock className="w-4 h-4 text-orange-600" />
                        <span>{career.time_to_proficiency}</span>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2">Key Skills:</h4>
                      <div className="flex flex-wrap gap-1">
                        {career.key_skills.slice(0, 4).map((skill, i) => (
                          <Badge key={i} variant="secondary" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                        {career.key_skills.length > 4 && (
                          <Badge variant="secondary" className="text-xs">
                            +{career.key_skills.length - 4} more
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2">Why This Matches You:</h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        {career.reasons.slice(0, 2).map((reason, i) => (
                          <li key={i} className="flex items-start space-x-2">
                            <CheckCircle className="w-3 h-3 text-green-600 mt-0.5 flex-shrink-0" />
                            <span>{reason}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <Button 
                      onClick={() => generateRoadmap(career)}
                      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                      disabled={isLoading}
                    >
                      {isLoading && selectedCareer?.title === career.title ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Generating Roadmap...
                        </>
                      ) : (
                        <>
                          <Wand2 className="w-4 h-4 mr-2" />
                          Generate Roadmap
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="text-center mt-8">
              <Button 
                variant="outline" 
                onClick={() => setCurrentStep('chat')}
                className="mr-4"
              >
                <MessageSquare className="w-4 h-4 mr-2" />
                Continue Chatting
              </Button>
              <Button 
                variant="outline" 
                onClick={() => {
                  // Clear session and start fresh
                  localStorage.removeItem('ai-career-chat-session');
                  setSessionId(null);
                  setConversationId(null);
                  setCurrentStep('welcome');
                  setUserResponses([]);
                  setCurrentQuestionIndex(0);
                  setMessages([]);
                  setRecommendations([]);
                }}
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Start New Assessment
              </Button>
            </div>
          </div>
        )}

        {/* Roadmap Step */}
        {currentStep === 'roadmap' && generatedRoadmap && (
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                Your {generatedRoadmap.career_path} Roadmap
              </h1>
              <p className="text-gray-600 max-w-3xl mx-auto">
                {generatedRoadmap.overview}
              </p>
              <div className="flex items-center justify-center space-x-6 mt-4">
                <div className="flex items-center space-x-2">
                  <Clock className="w-5 h-5 text-blue-600" />
                  <span className="font-medium">{generatedRoadmap.total_duration}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <BookOpen className="w-5 h-5 text-green-600" />
                  <span className="font-medium">{generatedRoadmap.phases.length} Learning Phases</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Roadmap Timeline */}
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <MapPin className="w-5 h-5" />
                      <span>Learning Journey</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {generatedRoadmap.phases.map((phase, index) => (
                        <div key={index} className="relative">
                          {index < generatedRoadmap.phases.length - 1 && (
                            <div className="absolute left-6 top-14 w-0.5 h-20 bg-gray-200" />
                          )}
                          
                          <div className="flex items-start space-x-4">
                            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                              <span className="font-bold text-blue-600">{index + 1}</span>
                            </div>
                            
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-2">
                                <h3 className="text-lg font-semibold">{phase.phase}</h3>
                                <Badge variant="outline">{phase.duration}</Badge>
                              </div>
                              
                              <p className="text-gray-600 mb-3">{phase.description}</p>
                              
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <h4 className="font-medium text-sm mb-2">Milestones:</h4>
                                  <ul className="text-sm text-gray-600 space-y-1">
                                    {phase.milestones.map((milestone, i) => (
                                      <li key={i} className="flex items-start space-x-2">
                                        <Target className="w-3 h-3 text-green-600 mt-0.5 flex-shrink-0" />
                                        <span>{milestone}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                                
                                <div>
                                  <h4 className="font-medium text-sm mb-2">Key Projects:</h4>
                                  <ul className="text-sm text-gray-600 space-y-1">
                                    {phase.projects.map((project, i) => (
                                      <li key={i} className="flex items-start space-x-2">
                                        <Code className="w-3 h-3 text-blue-600 mt-0.5 flex-shrink-0" />
                                        <span>{project}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar Information */}
              <div className="space-y-6">
                {/* Salary Progression */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2 text-lg">
                      <DollarSign className="w-5 h-5" />
                      <span>Salary Progression</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Entry Level</span>
                      <span className="font-semibold">{generatedRoadmap.salary_progression.entry_level}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Mid Level</span>
                      <span className="font-semibold">{generatedRoadmap.salary_progression.mid_level}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Senior Level</span>
                      <span className="font-semibold text-green-600">{generatedRoadmap.salary_progression.senior_level}</span>
                    </div>
                  </CardContent>
                </Card>

                {/* Key Skills */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2 text-lg">
                      <Zap className="w-5 h-5" />
                      <span>Essential Skills</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {generatedRoadmap.key_skills.map((skill, index) => (
                        <Badge key={index} variant="secondary">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Certifications */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2 text-lg">
                      <Award className="w-5 h-5" />
                      <span>Recommended Certifications</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {generatedRoadmap.certifications.map((cert, index) => (
                        <li key={index} className="flex items-start space-x-2">
                          <Star className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                          <span className="text-sm">{cert}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                {/* Next Steps */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2 text-lg">
                      <ArrowRight className="w-5 h-5" />
                      <span>Immediate Next Steps</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {generatedRoadmap.next_steps.map((step, index) => (
                        <li key={index} className="flex items-start space-x-2">
                          <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                          <span className="text-sm">{step}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>

            <div className="text-center mt-8 space-x-4">
              <Button 
                onClick={acceptRoadmap}
                size="lg"
                className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
              >
                <CheckCircle className="w-5 h-5 mr-2" />
                Accept This Roadmap
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setCurrentStep('recommendations')}
              >
                <ArrowRight className="w-4 h-4 mr-2" />
                Choose Different Career
              </Button>
              <Button 
                variant="outline"
              >
                <Download className="w-4 h-4 mr-2" />
                Download PDF
              </Button>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}