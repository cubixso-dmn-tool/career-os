import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { ChevronRight, MessageCircle, Check, Briefcase, Cpu, Code, Palette, LineChart, Book, Users, FileText, Brain, Send } from "lucide-react";
import { ReactNode } from "react";

// Interest options for the quiz
const interestOptions = [
  { id: "logic", text: "Solving puzzles & logic problems", icon: <Brain className="w-5 h-5 mr-2" /> },
  { id: "design", text: "Designing cool stuff", icon: <Palette className="w-5 h-5 mr-2" /> },
  { id: "management", text: "Managing teams or events", icon: <Users className="w-5 h-5 mr-2" /> },
  { id: "finance", text: "Making money grow", icon: <LineChart className="w-5 h-5 mr-2" /> },
  { id: "teaching", text: "Teaching or explaining", icon: <Book className="w-5 h-5 mr-2" /> },
  { id: "writing", text: "Writing stories or content", icon: <FileText className="w-5 h-5 mr-2" /> },
  { id: "coding", text: "Building things with code", icon: <Code className="w-5 h-5 mr-2" /> },
  { id: "tech", text: "Exploring new tech", icon: <Cpu className="w-5 h-5 mr-2" /> },
];

// Import career roadmap data
import careerRoadmaps, { RoadmapData } from './CareerRoadmaps';

// Message interface for chat messages
interface Message {
  type: 'bot' | 'user' | 'options' | 'interests' | 'questions' | 'roadmap' | 'continue-chat';
  content: string | any;
}

// Interface for API conversation history
interface ConversationMessage {
  role: 'user' | 'assistant';
  content: string;
}

export default function PathFinder() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentStage, setCurrentStage] = useState<'intro' | 'interests' | 'questions' | 'processing' | 'roadmap' | 'chat'>('intro');
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [userResponses, setUserResponses] = useState({
    grade: '',
    location: '',
    background: '',
    idea: ''
  });
  const [careerPath, setCareerPath] = useState<string | null>(null);
  const [conversationHistory, setConversationHistory] = useState<ConversationMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [userInput, setUserInput] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of chat when messages change
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Initialize chat with welcome message
  useEffect(() => {
    setMessages([
      {
        type: 'bot',
        content: "Hi there! 👋 I'm PathFinder, your AI career guide. I'll help you discover the perfect career path based on your interests and preferences."
      },
      {
        type: 'options',
        content: {
          message: "Ready to explore career possibilities that match your unique interests?",
          options: [
            { id: 'start', text: "Let's Go", icon: <ChevronRight className="w-4 h-4" /> },
            { id: 'cancel', text: "Not Now", icon: <ChevronRight className="w-4 h-4" /> }
          ]
        }
      }
    ]);
  }, []);

  // Handle option selection in the chat
  const handleOptionSelect = (optionId: string) => {
    if (optionId === 'start') {
      startInterestsQuiz();
    } else if (optionId === 'cancel') {
      setMessages([
        ...messages,
        { type: 'user', content: "Not Now" },
        { type: 'bot', content: "No problem! I'm here whenever you're ready to explore career options. Just refresh to start a new conversation." }
      ]);
    }
  };

  // Start the interests selection quiz
  const startInterestsQuiz = () => {
    setMessages([
      ...messages,
      { type: 'user', content: "Let's Go" },
      { type: 'bot', content: "Great! Let's start by understanding your interests. Choose 1-3 options that excite you the most:" },
      { type: 'interests', content: { options: interestOptions } }
    ]);
    setCurrentStage('interests');
  };

  // Handle interest selection
  const handleInterestSelect = (interestId: string) => {
    if (selectedInterests.includes(interestId)) {
      setSelectedInterests(selectedInterests.filter(id => id !== interestId));
    } else {
      if (selectedInterests.length < 3) {
        setSelectedInterests([...selectedInterests, interestId]);
      }
    }
  };

  // Continue to follow-up questions after selecting interests
  const continueToQuestions = () => {
    const selectedInterestNames = selectedInterests.map(id => 
      interestOptions.find(option => option.id === id)?.text
    ).filter(Boolean);

    setMessages([
      ...messages,
      { 
        type: 'user', 
        content: `I'm interested in: ${selectedInterestNames.join(', ')}` 
      },
      { 
        type: 'bot', 
        content: "Thanks for sharing your interests! Let's get a bit more context to provide you with the most relevant career path." 
      },
      { 
        type: 'questions', 
        content: {} 
      }
    ]);
    setCurrentStage('questions');
  };

  // Handle response change in follow-up questions
  const handleResponseChange = (field: string, value: string) => {
    setUserResponses({
      ...userResponses,
      [field]: value
    });
  };

  // Process all responses and generate a career recommendation
  const processResponses = () => {
    setMessages([
      ...messages,
      { 
        type: 'user', 
        content: `Educational level: ${userResponses.grade}, Preference: ${userResponses.location}, Background: ${userResponses.background}${userResponses.idea ? `, Ideas: ${userResponses.idea}` : ''}` 
      },
      { 
        type: 'bot', 
        content: "Analyzing your responses to find the perfect career match..." 
      }
    ]);
    setCurrentStage('processing');

    // Simple recommendation logic based on interests
    setTimeout(() => {
      let recommendedPath = "";
      
      // Simple decision tree for recommendations
      if (selectedInterests.includes('logic') && (selectedInterests.includes('coding') || selectedInterests.includes('tech'))) {
        recommendedPath = "data-science";
      } else if (selectedInterests.includes('design') && (selectedInterests.includes('tech') || selectedInterests.includes('writing'))) {
        recommendedPath = "ui-ux-design";
      } else if (selectedInterests.includes('management') && (selectedInterests.includes('finance') || selectedInterests.includes('teaching'))) {
        recommendedPath = "product-management";
      } else if (selectedInterests.includes('coding') || selectedInterests.includes('tech')) {
        recommendedPath = "web-development";
      } else {
        // Default fallback
        recommendedPath = "web-development";
      }

      setCareerPath(recommendedPath);
      
      setMessages(prev => [
        ...prev,
        { 
          type: 'bot', 
          content: `Based on your interests and preferences, I recommend exploring a career as a ${careerRoadmaps[recommendedPath].title}!` 
        },
        { 
          type: 'roadmap', 
          content: { roadmap: careerRoadmaps[recommendedPath] } 
        }
      ]);
      setCurrentStage('roadmap');
    }, 1500);
  };

  // Render different message types in the chat
  const renderMessage = (message: Message, index: number) => {
    switch (message.type) {
      case 'bot':
        return (
          <div key={index} className="flex items-start gap-3 mb-4">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white">
              <MessageCircle className="w-4 h-4" />
            </div>
            <div className="bg-muted rounded-lg p-3 max-w-[80%]">
              <p className="text-sm">{message.content}</p>
            </div>
          </div>
        );
      
      case 'user':
        return (
          <div key={index} className="flex items-start gap-3 mb-4 justify-end">
            <div className="bg-primary rounded-lg p-3 max-w-[80%] text-white">
              <p className="text-sm">{message.content}</p>
            </div>
            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
              <Users className="w-4 h-4 text-gray-600" />
            </div>
          </div>
        );
      
      case 'options':
        return (
          <div key={index} className="mb-4">
            <p className="text-sm mb-2">{message.content.message}</p>
            <div className="flex gap-2">
              {message.content.options.map((option: any) => (
                <Button 
                  key={option.id} 
                  variant={option.id === 'start' ? 'default' : 'outline'} 
                  size="sm"
                  onClick={() => handleOptionSelect(option.id)}
                  className="flex items-center"
                >
                  {option.text}
                  {option.icon}
                </Button>
              ))}
            </div>
          </div>
        );
      
      case 'interests':
        return (
          <div key={index} className="mb-4">
            <div className="grid grid-cols-2 gap-2 mb-3">
              {message.content.options.map((option: any) => (
                <Button
                  key={option.id}
                  variant={selectedInterests.includes(option.id) ? "default" : "outline"}
                  className={`justify-start ${selectedInterests.includes(option.id) ? "" : "border-dashed"}`}
                  onClick={() => handleInterestSelect(option.id)}
                >
                  <div className="flex items-center">
                    {option.icon}
                    <span>{option.text}</span>
                  </div>
                  {selectedInterests.includes(option.id) && (
                    <Check className="w-4 h-4 ml-auto" />
                  )}
                </Button>
              ))}
            </div>
            <Button 
              onClick={continueToQuestions} 
              disabled={selectedInterests.length === 0}
              className="w-full"
            >
              Continue
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        );
      
      case 'questions':
        return (
          <div key={index} className="mb-4">
            <div className="space-y-4">
              <div>
                <Label htmlFor="grade" className="text-sm font-medium">
                  What's your current educational level?
                </Label>
                <Select 
                  onValueChange={(value) => handleResponseChange('grade', value)}
                  value={userResponses.grade}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select your education level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10th">10th Standard</SelectItem>
                    <SelectItem value="12th">12th Standard</SelectItem>
                    <SelectItem value="college">College</SelectItem>
                    <SelectItem value="graduate">Graduate</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label className="text-sm font-medium">
                  Career location preference:
                </Label>
                <RadioGroup 
                  value={userResponses.location}
                  onValueChange={(value) => handleResponseChange('location', value)}
                  className="mt-1 flex space-x-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="india" id="india" />
                    <Label htmlFor="india">India-based</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="global" id="global" />
                    <Label htmlFor="global">Global</Label>
                  </div>
                </RadioGroup>
              </div>
              
              <div>
                <Label className="text-sm font-medium">
                  Your background:
                </Label>
                <RadioGroup 
                  value={userResponses.background}
                  onValueChange={(value) => handleResponseChange('background', value)}
                  className="mt-1 flex space-x-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="tech" id="tech" />
                    <Label htmlFor="tech">Technical</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="non-tech" id="non-tech" />
                    <Label htmlFor="non-tech">Non-technical</Label>
                  </div>
                </RadioGroup>
              </div>
              
              <div>
                <Label htmlFor="idea" className="text-sm font-medium">
                  Any career ideas you already have? (Optional)
                </Label>
                <Input
                  id="idea"
                  placeholder="E.g. Software Developer, Designer..."
                  value={userResponses.idea}
                  onChange={(e) => handleResponseChange('idea', e.target.value)}
                  className="mt-1"
                />
              </div>
              
              <Button 
                onClick={processResponses} 
                disabled={!userResponses.grade || !userResponses.location || !userResponses.background}
                className="w-full"
              >
                Get My Career Path
                <Briefcase className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        );
      
      case 'roadmap':
        const roadmap = message.content.roadmap;
        return (
          <div key={index} className="mb-4">
            <Card className="border-primary/20">
              <CardContent className="p-0">
                <div className="bg-primary/10 p-4 rounded-t-lg">
                  <h3 className="text-xl font-bold flex items-center">
                    <Briefcase className="w-5 h-5 mr-2 text-primary" />
                    {roadmap.title}
                  </h3>
                  <p className="text-sm text-gray-600">{roadmap.description}</p>
                </div>
                
                <ScrollArea className="h-[400px] rounded-b-lg">
                  <div className="p-4 space-y-6">
                    {/* Industry Overview */}
                    <div>
                      <h4 className="text-lg font-semibold mb-2">Industry Overview</h4>
                      <p className="text-sm mb-3">{roadmap.overview.intro}</p>
                      <div className="space-y-2">
                        {roadmap.overview.successStories.map((story: string, i: number) => (
                          <div key={i} className="bg-muted p-2 rounded-md text-sm">
                            {story}
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <Separator />
                    
                    {/* Day in the Life */}
                    <div>
                      <h4 className="text-lg font-semibold mb-2">Day in the Life</h4>
                      <ul className="space-y-2">
                        {roadmap.dayInLife.map((item: string, i: number) => (
                          <li key={i} className="text-sm flex items-start">
                            <Check className="w-4 h-4 text-green-500 mr-2 mt-0.5" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <Separator />
                    
                    {/* Skills Needed */}
                    <div>
                      <h4 className="text-lg font-semibold mb-2">Skills Needed</h4>
                      
                      <h5 className="font-medium text-sm mb-2">Technical Skills</h5>
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {roadmap.skills.technical.map((skill: string, i: number) => (
                          <Badge key={i} variant="outline" className="bg-blue-50">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                      
                      <h5 className="font-medium text-sm mb-2">Soft Skills</h5>
                      <div className="flex flex-wrap gap-1.5">
                        {roadmap.skills.soft.map((skill: string, i: number) => (
                          <Badge key={i} variant="outline" className="bg-green-50">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <Separator />
                    
                    {/* Courses */}
                    <div>
                      <h4 className="text-lg font-semibold mb-2">Recommended Courses</h4>
                      <div className="space-y-3">
                        {roadmap.courses.map((course: { name: string, level: string, link: string }, i: number) => (
                          <div key={i} className="bg-muted p-3 rounded-md">
                            <div className="flex justify-between items-start">
                              <div>
                                <h5 className="font-medium text-sm">{course.name}</h5>
                                <a href={course.link} className="text-xs text-primary underline">View details</a>
                              </div>
                              <Badge variant="outline" className="text-xs">{course.level}</Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <Separator />
                    
                    {/* Projects */}
                    <div>
                      <h4 className="text-lg font-semibold mb-2">Projects to Build</h4>
                      <div className="space-y-3">
                        {roadmap.projects.map((project: { name: string, level: string, skills: string[] }, i: number) => (
                          <div key={i} className="bg-muted p-3 rounded-md">
                            <div className="flex justify-between items-start mb-2">
                              <h5 className="font-medium text-sm">{project.name}</h5>
                              <Badge variant="outline" className="text-xs">{project.level}</Badge>
                            </div>
                            <div className="flex flex-wrap gap-1">
                              {project.skills.map((skill: string, j: number) => (
                                <Badge key={j} variant="outline" className="text-xs bg-white">
                                  {skill}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <Separator />
                    
                    {/* Network & Hire */}
                    <div>
                      <h4 className="text-lg font-semibold mb-2">Network & Hire</h4>
                      
                      <h5 className="font-medium text-sm mb-2">Communities to Join</h5>
                      <ul className="space-y-1 mb-4">
                        {roadmap.networking.communities.map((community: string, i: number) => (
                          <li key={i} className="text-sm flex items-start">
                            <Check className="w-4 h-4 text-green-500 mr-2 mt-0.5" />
                            <span>{community}</span>
                          </li>
                        ))}
                      </ul>
                      
                      <h5 className="font-medium text-sm mb-2">Tips for Success</h5>
                      <ul className="space-y-1">
                        {roadmap.networking.tips.map((tip: string, i: number) => (
                          <li key={i} className="text-sm flex items-start">
                            <Check className="w-4 h-4 text-green-500 mr-2 mt-0.5" />
                            <span>{tip}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
            
            <div className="mt-4 text-center">
              <p className="text-sm text-gray-600 mb-2">
                Like this recommendation? Explore more resources in these sections:
              </p>
              <div className="flex gap-2 justify-center">
                <Button variant="outline" size="sm">
                  <Book className="w-4 h-4 mr-1" />
                  Courses
                </Button>
                <Button variant="outline" size="sm">
                  <Code className="w-4 h-4 mr-1" />
                  Projects
                </Button>
                <Button variant="outline" size="sm">
                  <Users className="w-4 h-4 mr-1" />
                  Community
                </Button>
              </div>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserInput(e.target.value);
  };

  // Handle sending a message in continued conversation
  const handleSendMessage = async () => {
    if (!userInput.trim()) return;
    
    // Add user message to chat
    const newUserMessage: Message = { type: 'user', content: userInput };
    setMessages([...messages, newUserMessage]);
    
    // Add to conversation history
    const newConversationHistory: ConversationMessage[] = [
      ...conversationHistory,
      { role: 'user', content: userInput }
    ];
    setConversationHistory(newConversationHistory);
    
    // Clear input and set loading
    setUserInput('');
    setIsLoading(true);
    
    try {
      // Send message to API
      const response = await fetch('/api/pathfinder/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userInput,
          conversationHistory: newConversationHistory,
          careerPath,
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to get a response from the PathFinder AI');
      }
      
      const data = await response.json();
      
      // Add AI response to chat
      const aiMessage: Message = { type: 'bot', content: data.response };
      setMessages(prev => [...prev, aiMessage]);
      
      // Add to conversation history
      setConversationHistory([
        ...newConversationHistory,
        { role: 'assistant', content: data.response }
      ]);
      
      // If this is the first message after roadmap, show the continue-chat UI
      if (currentStage === 'roadmap') {
        setCurrentStage('chat');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      // Add error message
      const errorMessage: Message = { type: 'bot', content: "Sorry, I had trouble processing your message. Please try again." };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle pressing Enter to send a message
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Add a button to continue the conversation after viewing the roadmap
  const showContinueChatUI = () => {
    const continueChatMessage: Message = {
      type: 'continue-chat',
      content: "Have questions about this career path? You can ask me anything!"
    };
    setMessages([...messages, continueChatMessage]);
    setCurrentStage('chat');
  };

  // Render continue-chat message
  const renderContinueChatMessage = (index: number) => {
    return (
      <div key={index} className="mb-4 mt-6">
        <div className="p-3 bg-primary/5 rounded-lg border border-primary/20">
          <p className="text-sm text-gray-700 mb-3">
            Have questions about this career path? I can help you explore more details!
          </p>
          <Button 
            onClick={showContinueChatUI} 
            variant="default" 
            className="w-full"
          >
            Ask me anything
            <MessageCircle className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    );
  };

  // Add case for rendering continue-chat UI
  const originalRenderMessage = renderMessage;
  const renderMessageWithContinueChat = (message: Message, index: number) => {
    if (message.type === 'continue-chat') {
      return renderContinueChatMessage(index);
    }
    return originalRenderMessage(message, index);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4">
        <div className="max-w-3xl mx-auto">
          {messages.map((message: Message, index: number) => renderMessageWithContinueChat(message, index))}
          {isLoading && (
            <div className="flex items-center gap-2 text-gray-500 text-sm">
              <div className="animate-spin">
                <div className="h-4 w-4 rounded-full border-2 border-primary border-t-transparent" />
              </div>
              PathFinder is thinking...
            </div>
          )}
          <div ref={chatEndRef} />
        </div>
      </div>
      
      {/* Input for continued conversation */}
      {(currentStage === 'roadmap' || currentStage === 'chat') && (
        <div className="p-4 border-t">
          <div className="flex gap-2 max-w-3xl mx-auto">
            <Input
              value={userInput}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder="Ask about career prospects, skills, or education paths..."
              className="flex-1"
              disabled={isLoading}
            />
            <Button 
              onClick={handleSendMessage} 
              disabled={!userInput.trim() || isLoading}
              size="icon"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          
          {/* When in roadmap view and not yet in chat, show a hint */}
          {currentStage === 'roadmap' && !messages.some(m => m.type === 'continue-chat') && (
            <div className="max-w-3xl mx-auto">
              <p className="text-xs text-gray-500 mt-2">
                You can ask questions about this career path to learn more details.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}