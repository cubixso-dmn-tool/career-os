import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Progress } from '@/components/ui/progress';
import { 
  Bot, 
  Send, 
  Mic, 
  FileText, 
  GraduationCap, 
  MessageCircle, 
  Loader2,
  Sparkles,
  BrainCircuit,
  Target,
  TrendingUp,
  Award,
  BookOpen,
  Clock,
  CheckCircle2,
  AlertCircle,
  Lightbulb
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { motion, AnimatePresence } from 'framer-motion';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  type?: 'text' | 'analysis' | 'recommendations';
}

interface InterviewQuestion {
  question: string;
  type: 'technical' | 'behavioral' | 'situational' | 'knowledge';
  difficulty: 'easy' | 'medium' | 'hard';
  expectedDuration: string;
  hints?: string[];
  followUpQuestions?: string[];
}

interface ResumeAnalysis {
  overallScore: number;
  strengths: string[];
  weaknesses: string[];
  suggestions: {
    section: string;
    improvement: string;
    priority: 'high' | 'medium' | 'low';
  }[];
  atsCompatibility: {
    score: number;
    issues: string[];
    recommendations: string[];
  };
  keywordOptimization: {
    missing: string[];
    present: string[];
    suggestions: string[];
  };
}

type CoachingMode = 'general' | 'interview' | 'resume' | 'learning_path';

export default function AICareerCoach() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [coachingMode, setCoachingMode] = useState<CoachingMode>('general');
  const [conversationHistory, setConversationHistory] = useState<Array<{ role: 'user' | 'assistant', content: string }>>([]);
  
  // Interview Mode States
  const [interviewQuestions, setInterviewQuestions] = useState<InterviewQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [interviewRole, setInterviewRole] = useState('');
  const [interviewExperience, setInterviewExperience] = useState('');
  const [interviewType, setInterviewType] = useState<'technical' | 'behavioral' | 'system_design' | 'hr'>('technical');
  const [difficulty, setDifficulty] = useState<'beginner' | 'intermediate' | 'advanced'>('intermediate');
  
  // Resume Mode States
  const [resumeText, setResumeText] = useState('');
  const [resumeAnalysis, setResumeAnalysis] = useState<ResumeAnalysis | null>(null);
  const [targetRole, setTargetRole] = useState('');
  
  // Learning Path States
  const [currentSkills, setCurrentSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState('');
  const [learningTargetRole, setLearningTargetRole] = useState('');
  const [timeframe, setTimeframe] = useState('');
  const [learningStyle, setLearningStyle] = useState<'visual' | 'hands-on' | 'theoretical' | 'mixed'>('mixed');
  const [experience, setExperience] = useState('');
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    // Add welcome message based on coaching mode
    const welcomeMessages = {
      general: "Hi! I'm your AI Career Coach. I'm here to help you navigate your career journey. What would you like to discuss today?",
      interview: "Welcome to Interview Prep! I can help you practice with mock interviews, provide feedback, and share strategies. Let's start by setting up your interview practice session.",
      resume: "I'm here to help optimize your resume! Upload your resume text or paste it below, and I'll provide detailed analysis and improvement suggestions.",
      learning_path: "Let's create a personalized learning path for your career goals! I'll help you identify skills gaps and create a roadmap to your target role."
    };

    if (messages.length === 0) {
      const welcomeMessage: Message = {
        id: Date.now().toString(),
        content: welcomeMessages[coachingMode],
        sender: 'ai',
        timestamp: new Date(),
        type: 'text'
      };
      setMessages([welcomeMessage]);
    }
  }, [coachingMode]);

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      sender: 'user',
      timestamp: new Date(),
      type: 'text'
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/ai-career-coach/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          message: inputMessage,
          conversationHistory,
          coachingType: coachingMode,
          userProfile: {
            currentRole: targetRole || undefined,
            experience: experience || undefined,
            skills: currentSkills.length > 0 ? currentSkills : undefined,
            goals: [learningTargetRole || targetRole].filter(Boolean),
          }
        })
      });

      if (!response.ok) throw new Error('Failed to get AI response');

      const data = await response.json();
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: data.response,
        sender: 'ai',
        timestamp: new Date(),
        type: 'text'
      };

      setMessages(prev => [...prev, aiMessage]);
      setConversationHistory(prev => [
        ...prev,
        { role: 'user', content: inputMessage },
        { role: 'assistant', content: data.response }
      ]);

    } catch (error) {
      console.error('Error getting AI response:', error);
      toast({
        title: "Error",
        description: "Failed to get response from AI Career Coach. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const generateMockInterview = async () => {
    if (!interviewRole || !interviewExperience) {
      toast({
        title: "Missing Information",
        description: "Please fill in the role and experience level first.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/ai-career-coach/mock-interview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          role: interviewRole,
          experience: interviewExperience,
          interviewType,
          difficulty
        })
      });

      if (!response.ok) throw new Error('Failed to generate interview questions');

      const data = await response.json();
      setInterviewQuestions(data.questions);
      setCurrentQuestionIndex(0);

      const interviewMessage: Message = {
        id: Date.now().toString(),
        content: `Great! I've prepared ${data.questions.length} interview questions for a ${interviewRole} position. Let's start with the first question.`,
        sender: 'ai',
        timestamp: new Date(),
        type: 'text'
      };

      setMessages(prev => [...prev, interviewMessage]);

    } catch (error) {
      console.error('Error generating mock interview:', error);
      toast({
        title: "Error",
        description: "Failed to generate interview questions. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const analyzeResume = async () => {
    if (!resumeText || resumeText.length < 50) {
      toast({
        title: "Invalid Resume",
        description: "Please provide a resume with at least 50 characters.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/ai-career-coach/analyze-resume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          resumeText,
          targetRole: targetRole || undefined
        })
      });

      if (!response.ok) throw new Error('Failed to analyze resume');

      const data = await response.json();
      setResumeAnalysis(data.analysis);

      const analysisMessage: Message = {
        id: Date.now().toString(),
        content: `Resume analysis complete! Overall score: ${data.analysis.overallScore}/100. I've identified key areas for improvement.`,
        sender: 'ai',
        timestamp: new Date(),
        type: 'analysis'
      };

      setMessages(prev => [...prev, analysisMessage]);

    } catch (error) {
      console.error('Error analyzing resume:', error);
      toast({
        title: "Error",
        description: "Failed to analyze resume. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const generateLearningPath = async () => {
    if (!currentSkills.length || !learningTargetRole || !timeframe || !experience) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields for learning path generation.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/ai-career-coach/learning-path', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          currentSkills,
          targetRole: learningTargetRole,
          timeframe,
          learningStyle,
          experience
        })
      });

      if (!response.ok) throw new Error('Failed to generate learning path');

      const data = await response.json();

      const pathMessage: Message = {
        id: Date.now().toString(),
        content: `Perfect! I've created a personalized learning path to help you become a ${learningTargetRole}. The roadmap includes ${data.learningPath.milestones.length} key milestones.`,
        sender: 'ai',
        timestamp: new Date(),
        type: 'recommendations'
      };

      setMessages(prev => [...prev, pathMessage]);

    } catch (error) {
      console.error('Error generating learning path:', error);
      toast({
        title: "Error",
        description: "Failed to generate learning path. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const addSkill = () => {
    if (skillInput.trim() && !currentSkills.includes(skillInput.trim())) {
      setCurrentSkills(prev => [...prev, skillInput.trim()]);
      setSkillInput('');
    }
  };

  const removeSkill = (skill: string) => {
    setCurrentSkills(prev => prev.filter(s => s !== skill));
  };

  const renderModeSpecificContent = () => {
    switch (coachingMode) {
      case 'interview':
        return (
          <Card className="mb-4">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BrainCircuit className="h-5 w-5" />
                Interview Setup
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Target Role</label>
                  <Input
                    value={interviewRole}
                    onChange={(e) => setInterviewRole(e.target.value)}
                    placeholder="e.g., Software Engineer"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Experience Level</label>
                  <Input
                    value={interviewExperience}
                    onChange={(e) => setInterviewExperience(e.target.value)}
                    placeholder="e.g., 2-3 years"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Interview Type</label>
                  <select
                    value={interviewType}
                    onChange={(e) => setInterviewType(e.target.value as any)}
                    className="w-full p-2 border rounded-md"
                  >
                    <option value="technical">Technical</option>
                    <option value="behavioral">Behavioral</option>
                    <option value="system_design">System Design</option>
                    <option value="hr">HR Round</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium">Difficulty</label>
                  <select
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value as any)}
                    className="w-full p-2 border rounded-md"
                  >
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>
              </div>
              <Button onClick={generateMockInterview} disabled={isLoading} className="w-full">
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Target className="h-4 w-4" />}
                Generate Mock Interview
              </Button>
            </CardContent>
          </Card>
        );

      case 'resume':
        return (
          <Card className="mb-4">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Resume Analysis
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium">Target Role (Optional)</label>
                <Input
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value)}
                  placeholder="e.g., Product Manager"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Paste Your Resume Text</label>
                <Textarea
                  value={resumeText}
                  onChange={(e) => setResumeText(e.target.value)}
                  placeholder="Paste your resume content here..."
                  rows={6}
                />
              </div>
              <Button onClick={analyzeResume} disabled={isLoading} className="w-full">
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                Analyze Resume
              </Button>
              
              {resumeAnalysis && (
                <div className="mt-4 space-y-4">
                  <div className="flex items-center gap-2">
                    <Award className="h-5 w-5 text-blue-600" />
                    <span className="font-medium">Overall Score: {resumeAnalysis.overallScore}/100</span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm text-green-600">Strengths</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-1">
                          {resumeAnalysis.strengths.map((strength, index) => (
                            <li key={index} className="flex items-center gap-2 text-sm">
                              <CheckCircle2 className="h-3 w-3 text-green-500" />
                              {strength}
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm text-red-600">Areas for Improvement</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-1">
                          {resumeAnalysis.weaknesses.map((weakness, index) => (
                            <li key={index} className="flex items-center gap-2 text-sm">
                              <AlertCircle className="h-3 w-3 text-red-500" />
                              {weakness}
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  </div>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">ATS Compatibility</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm">ATS Score</span>
                          <span className="font-medium">{resumeAnalysis.atsCompatibility.score}/100</span>
                        </div>
                        <Progress value={resumeAnalysis.atsCompatibility.score} className="h-2" />
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </CardContent>
          </Card>
        );

      case 'learning_path':
        return (
          <Card className="mb-4">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GraduationCap className="h-5 w-5" />
                Learning Path Generator
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium">Current Skills</label>
                <div className="flex gap-2 mb-2">
                  <Input
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    placeholder="Add a skill..."
                    onKeyPress={(e) => e.key === 'Enter' && addSkill()}
                  />
                  <Button onClick={addSkill} size="sm">Add</Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {currentSkills.map((skill, index) => (
                    <Badge key={index} variant="secondary" className="cursor-pointer" onClick={() => removeSkill(skill)}>
                      {skill} ×
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Target Role</label>
                  <Input
                    value={learningTargetRole}
                    onChange={(e) => setLearningTargetRole(e.target.value)}
                    placeholder="e.g., Data Scientist"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Timeframe</label>
                  <Input
                    value={timeframe}
                    onChange={(e) => setTimeframe(e.target.value)}
                    placeholder="e.g., 6 months"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Experience Level</label>
                  <Input
                    value={experience}
                    onChange={(e) => setExperience(e.target.value)}
                    placeholder="e.g., Beginner"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Learning Style</label>
                  <select
                    value={learningStyle}
                    onChange={(e) => setLearningStyle(e.target.value as any)}
                    className="w-full p-2 border rounded-md"
                  >
                    <option value="visual">Visual</option>
                    <option value="hands-on">Hands-on</option>
                    <option value="theoretical">Theoretical</option>
                    <option value="mixed">Mixed</option>
                  </select>
                </div>
              </div>

              <Button onClick={generateLearningPath} disabled={isLoading} className="w-full">
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <BookOpen className="h-4 w-4" />}
                Generate Learning Path
              </Button>
            </CardContent>
          </Card>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold flex items-center justify-center gap-2">
          <Bot className="h-8 w-8 text-blue-600" />
          AI Career Coach
        </h1>
        <p className="text-gray-600">Your intelligent career companion powered by advanced AI</p>
      </div>

      <Tabs value={coachingMode} onValueChange={(value) => {
        setCoachingMode(value as CoachingMode);
        setMessages([]); // Reset messages when switching modes
        setConversationHistory([]);
      }}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="general" className="flex items-center gap-2">
            <MessageCircle className="h-4 w-4" />
            General Coach
          </TabsTrigger>
          <TabsTrigger value="interview" className="flex items-center gap-2">
            <BrainCircuit className="h-4 w-4" />
            Interview Prep
          </TabsTrigger>
          <TabsTrigger value="resume" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Resume Analysis
          </TabsTrigger>
          <TabsTrigger value="learning_path" className="flex items-center gap-2">
            <GraduationCap className="h-4 w-4" />
            Learning Path
          </TabsTrigger>
        </TabsList>

        <TabsContent value={coachingMode} className="space-y-4">
          {renderModeSpecificContent()}

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5" />
                AI Conversation
              </CardTitle>
              <CardDescription>
                Chat with your AI career coach for personalized guidance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px] mb-4 p-4 border rounded-lg">
                <AnimatePresence>
                  {messages.map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className={`mb-4 ${message.sender === 'user' ? 'ml-auto' : 'mr-auto'}`}
                    >
                      <div className={`max-w-[80%] p-3 rounded-lg ${
                        message.sender === 'user'
                          ? 'bg-blue-600 text-white ml-auto'
                          : 'bg-gray-100 text-gray-900'
                      }`}>
                        <div className="whitespace-pre-wrap">{message.content}</div>
                        <div className="text-xs opacity-70 mt-1">
                          {message.timestamp.toLocaleTimeString()}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
                {isLoading && (
                  <div className="flex items-center gap-2 text-gray-500">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    AI is thinking...
                  </div>
                )}
                <div ref={messagesEndRef} />
              </ScrollArea>

              <div className="flex gap-2">
                <Input
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Ask your AI career coach anything..."
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  disabled={isLoading}
                />
                <Button onClick={sendMessage} disabled={isLoading || !inputMessage.trim()}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {interviewQuestions.length > 0 && coachingMode === 'interview' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Mock Interview Questions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">
                      Question {currentQuestionIndex + 1} of {interviewQuestions.length}
                    </span>
                    <Badge variant={interviewQuestions[currentQuestionIndex]?.difficulty === 'hard' ? 'destructive' : 
                                  interviewQuestions[currentQuestionIndex]?.difficulty === 'medium' ? 'default' : 'secondary'}>
                      {interviewQuestions[currentQuestionIndex]?.difficulty}
                    </Badge>
                  </div>

                  <Card>
                    <CardContent className="pt-4">
                      <h4 className="font-medium mb-2">
                        {interviewQuestions[currentQuestionIndex]?.question}
                      </h4>
                      <div className="text-sm text-gray-600 space-y-1">
                        <p><strong>Type:</strong> {interviewQuestions[currentQuestionIndex]?.type}</p>
                        <p><strong>Expected Duration:</strong> {interviewQuestions[currentQuestionIndex]?.expectedDuration}</p>
                      </div>

                      {interviewQuestions[currentQuestionIndex]?.hints && (
                        <div className="mt-3">
                          <p className="text-sm font-medium mb-1">Hints:</p>
                          <ul className="text-sm text-gray-600 space-y-1">
                            {interviewQuestions[currentQuestionIndex].hints!.map((hint, index) => (
                              <li key={index} className="flex items-center gap-2">
                                <Lightbulb className="h-3 w-3" />
                                {hint}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  <div className="flex justify-between">
                    <Button
                      variant="outline"
                      onClick={() => setCurrentQuestionIndex(Math.max(0, currentQuestionIndex - 1))}
                      disabled={currentQuestionIndex === 0}
                    >
                      Previous
                    </Button>
                    <Button
                      onClick={() => setCurrentQuestionIndex(Math.min(interviewQuestions.length - 1, currentQuestionIndex + 1))}
                      disabled={currentQuestionIndex === interviewQuestions.length - 1}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}