import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Sparkles, X } from "lucide-react";
import { cn } from "@/lib/utils";

// PathFinder Avatar Component
const PathFinderAvatar = () => (
  <motion.div 
    className="h-12 w-12 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-white text-xl font-bold shadow-md"
    initial={{ scale: 0.8, opacity: 0 }}
    animate={{ 
      scale: 1, 
      opacity: 1,
      y: [0, -5, 0],
    }}
    transition={{ 
      duration: 0.5,
      y: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }}
  >
    PF
  </motion.div>
);

// Types for our chat components
type MessageType = {
  id: string;
  content: string | React.ReactNode;
  sender: 'bot' | 'user';
  isTyping?: boolean;
};

type InterestType = {
  id: string;
  emoji: string;
  label: string;
  selected: boolean;
};

// Main PathFinder Component
export default function PathFinder() {
  const [started, setStarted] = useState(false);
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [currentStage, setCurrentStage] = useState<number>(1);
  const [interests, setInterests] = useState<InterestType[]>([
    { id: '1', emoji: '🧩', label: 'Logic & Puzzles', selected: false },
    { id: '2', emoji: '🎨', label: 'Design & Creativity', selected: false },
    { id: '3', emoji: '🧑‍💼', label: 'Team Leadership', selected: false },
    { id: '4', emoji: '💰', label: 'Money & Business', selected: false },
    { id: '5', emoji: '🧑‍🏫', label: 'Teaching', selected: false },
    { id: '6', emoji: '✍️', label: 'Writing', selected: false },
    { id: '7', emoji: '💻', label: 'Building Code', selected: false },
    { id: '8', emoji: '⚙️', label: 'Tech Explorations', selected: false },
  ]);
  const [selectedInterestsCount, setSelectedInterestsCount] = useState(0);
  const [infoOptions, setInfoOptions] = useState({
    level: '',
    location: '',
    background: ''
  });
  const [currentInfoStep, setCurrentInfoStep] = useState(1);
  const [analyzing, setAnalyzing] = useState(false);
  const [careerPath, setCareerPath] = useState('');
  const [progress, setProgress] = useState(0);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Start the chat flow
  const startChat = () => {
    setStarted(true);
    setTimeout(() => {
      addMessage({
        id: Date.now().toString(),
        content: "Hey! I'm PathFinder – your AI career buddy.",
        sender: 'bot'
      });
      
      setTimeout(() => {
        addMessage({
          id: Date.now().toString(),
          content: "I'll help you discover your ideal career path based on your interests and strengths.",
          sender: 'bot'
        });
        
        setTimeout(() => {
          setCurrentStage(2);
          addMessage({
            id: Date.now().toString(),
            content: "Let's start with what excites you the most... Pick 1-3 interests below!",
            sender: 'bot'
          });
        }, 1500);
      }, 1500);
    }, 500);
  };

  // Add a message to the chat
  const addMessage = (message: MessageType) => {
    if (message.isTyping) {
      setMessages(prev => [...prev, message]);
      return;
    }
    
    // First add a typing indicator
    const typingId = Date.now().toString();
    setMessages(prev => [...prev, { 
      id: typingId, 
      content: "", 
      sender: message.sender, 
      isTyping: true 
    }]);
    
    // Then replace it with the actual message after a delay
    setTimeout(() => {
      setMessages(prev => prev.map(msg => 
        msg.id === typingId 
          ? { ...message, id: typingId, isTyping: false } 
          : msg
      ));
    }, 800);
  };

  // Handle interest selection
  const handleInterestClick = (id: string) => {
    const updatedInterests = interests.map(interest => {
      if (interest.id === id) {
        // If already selected, toggle it off
        if (interest.selected) {
          setSelectedInterestsCount(prev => prev - 1);
          return { ...interest, selected: false };
        }
        
        // If not selected and less than 3 interests are selected, toggle it on
        if (selectedInterestsCount < 3) {
          setSelectedInterestsCount(prev => prev + 1);
          return { ...interest, selected: true };
        }
      }
      return interest;
    });
    
    setInterests(updatedInterests);
  };

  // Continue to personal info after selecting interests
  const continueToPersonalInfo = () => {
    const selectedLabels = interests
      .filter(interest => interest.selected)
      .map(interest => interest.emoji + " " + interest.label)
      .join(", ");
    
    addMessage({
      id: Date.now().toString(),
      content: `You selected: ${selectedLabels}`,
      sender: 'user'
    });
    
    setTimeout(() => {
      setCurrentStage(3);
      addMessage({
        id: Date.now().toString(),
        content: "Great choices! Now, let's get a bit more information to tailor your career path recommendations...",
        sender: 'bot'
      });
    }, 1000);
  };

  // Handle personal info selection
  const handleInfoSelection = (field: 'level' | 'location' | 'background', value: string) => {
    setInfoOptions(prev => ({ ...prev, [field]: value }));
    
    if (field === 'level' && currentInfoStep === 1) {
      setCurrentInfoStep(2);
    } else if (field === 'location' && currentInfoStep === 2) {
      setCurrentInfoStep(3);
    } else if (field === 'background' && currentInfoStep === 3) {
      // Prepare to finish the quiz
      const infoSummary = `Education: ${value === 'tech' ? '💻 Technical' : '📚 Non-Technical'} background, ${infoOptions.level} level, interested in ${infoOptions.location === 'india' ? '🇮🇳 Indian' : '🌎 Global'} opportunities`;
      
      addMessage({
        id: Date.now().toString(),
        content: infoSummary,
        sender: 'user'
      });
      
      startAnalysis();
    }
  };

  // Skip personal info
  const skipPersonalInfo = () => {
    addMessage({
      id: Date.now().toString(),
      content: "I'd like to skip the additional questions for now.",
      sender: 'user'
    });
    
    startAnalysis();
  };

  // Start the analysis animation
  const startAnalysis = () => {
    setCurrentStage(4);
    setAnalyzing(true);
    
    setTimeout(() => {
      addMessage({
        id: Date.now().toString(),
        content: "Analyzing your interests and preferences...",
        sender: 'bot'
      });
      
      // Simulate analysis
      setTimeout(() => {
        setAnalyzing(false);
        setCurrentStage(5);
        
        // Determine a career path based on selected interests
        let recommendedPath = "";
        const selectedInterests = interests.filter(i => i.selected).map(i => i.label);
        
        if (selectedInterests.includes("Building Code") || selectedInterests.includes("Tech Explorations")) {
          recommendedPath = "Software Development";
        } else if (selectedInterests.includes("Design & Creativity")) {
          recommendedPath = "UI/UX Design";
        } else if (selectedInterests.includes("Money & Business")) {
          recommendedPath = "Product Management";
        } else if (selectedInterests.includes("Logic & Puzzles")) {
          recommendedPath = "Data Science";
        } else if (selectedInterests.includes("Teaching") || selectedInterests.includes("Writing")) {
          recommendedPath = "Technical Content Creation";
        } else if (selectedInterests.includes("Team Leadership")) {
          recommendedPath = "Technical Project Management";
        } else {
          recommendedPath = "Full-Stack Development";
        }
        
        setCareerPath(recommendedPath);
        
        addMessage({
          id: Date.now().toString(),
          content: (
            <div className="space-y-2">
              <p className="text-lg font-medium text-primary flex items-center">
                <Sparkles className="h-5 w-5 mr-2 text-yellow-400" strokeWidth={2.5} />
                Your Recommended Career Path: {recommendedPath}
              </p>
              <p className="text-gray-600">
                Based on your interests and preferences, I think this would be an excellent direction for you!
              </p>
            </div>
          ),
          sender: 'bot'
        });
      }, 3000);
    }, 1000);
  };

  // Render the Interest Picker component
  const renderInterestPicker = () => (
    <div className="mt-4 mb-6 w-full">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {interests.map(interest => (
          <motion.button
            key={interest.id}
            className={cn(
              "h-32 rounded-lg border-2 flex flex-col items-center justify-center space-y-2 transition-all",
              interest.selected 
                ? "border-primary bg-primary/10 shadow-md" 
                : "border-gray-200 hover:border-primary/30 hover:bg-gray-50",
              selectedInterestsCount >= 3 && !interest.selected && "opacity-50 cursor-not-allowed"
            )}
            onClick={() => handleInterestClick(interest.id)}
            whileHover={selectedInterestsCount < 3 || interest.selected ? { scale: 1.02 } : {}}
            whileTap={selectedInterestsCount < 3 || interest.selected ? { scale: 0.98 } : {}}
            disabled={selectedInterestsCount >= 3 && !interest.selected}
          >
            <span className="text-3xl">{interest.emoji}</span>
            <span className="text-sm font-medium text-center">{interest.label}</span>
          </motion.button>
        ))}
      </div>
      
      {selectedInterestsCount > 0 && (
        <div className="mt-4 flex justify-end">
          <Button 
            onClick={continueToPersonalInfo}
            className="space-x-2"
          >
            <span>Continue</span>
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );

  // Render the Personal Info component
  const renderPersonalInfo = () => (
    <div className="mt-4 mb-6 w-full max-w-md mx-auto">
      <div className="flex justify-center mb-6">
        <div className="h-2 w-full max-w-xs bg-gray-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-primary rounded-full transition-all duration-300" 
            style={{ width: `${(currentInfoStep / 3) * 100}%` }}
          />
        </div>
      </div>
      
      <AnimatePresence mode="wait">
        {currentInfoStep === 1 && (
          <motion.div
            key="edu-level"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-3"
          >
            <p className="font-medium text-gray-700 mb-3">🎓 What's your current education level?</p>
            <div className="grid grid-cols-2 gap-3">
              {['10th', '12th', 'College', 'Graduate'].map(option => (
                <Button
                  key={option}
                  variant={infoOptions.level === option.toLowerCase() ? "default" : "outline"}
                  onClick={() => handleInfoSelection('level', option.toLowerCase())}
                  className="h-12"
                >
                  {option}
                </Button>
              ))}
            </div>
          </motion.div>
        )}
        
        {currentInfoStep === 2 && (
          <motion.div
            key="location"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-3"
          >
            <p className="font-medium text-gray-700 mb-3">🌍 Where are you aiming to work?</p>
            <div className="grid grid-cols-2 gap-3">
              <Button
                variant={infoOptions.location === 'india' ? "default" : "outline"}
                onClick={() => handleInfoSelection('location', 'india')}
                className="h-12"
              >
                India 🇮🇳
              </Button>
              <Button
                variant={infoOptions.location === 'global' ? "default" : "outline"}
                onClick={() => handleInfoSelection('location', 'global')}
                className="h-12"
              >
                Global 🌎
              </Button>
            </div>
          </motion.div>
        )}
        
        {currentInfoStep === 3 && (
          <motion.div
            key="background"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-3"
          >
            <p className="font-medium text-gray-700 mb-3">🧑‍💻 What's your background?</p>
            <div className="grid grid-cols-2 gap-3">
              <Button
                variant={infoOptions.background === 'tech' ? "default" : "outline"}
                onClick={() => handleInfoSelection('background', 'tech')}
                className="h-12"
              >
                Technical
              </Button>
              <Button
                variant={infoOptions.background === 'non-tech' ? "default" : "outline"}
                onClick={() => handleInfoSelection('background', 'non-tech')}
                className="h-12"
              >
                Non-Technical
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <div className="mt-8 text-center">
        <button 
          onClick={skipPersonalInfo}
          className="text-gray-500 text-sm hover:text-primary hover:underline transition-colors"
        >
          Skip this for now
        </button>
      </div>
    </div>
  );

  // Render the Analysis Animation
  const renderAnalysisAnimation = () => (
    <div className="flex flex-col items-center justify-center h-48 my-8">
      <motion.div
        className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full"
        animate={{ rotate: 360 }}
        transition={{ 
          duration: 1.5,
          ease: "linear",
          repeat: Infinity,
        }}
      />
      <p className="mt-4 text-gray-600 font-medium animate-pulse">
        Analyzing your profile...
      </p>
    </div>
  );

  // Render Roadmap component
  const renderRoadmap = () => (
    <div className="mt-6 mb-10 w-full">
      <div className="bg-gradient-to-r from-primary/20 to-primary/5 rounded-lg p-4 mb-6">
        <h3 className="text-xl font-bold flex items-center">
          <span className="mr-2">🎯</span>
          You're on the path to becoming a {careerPath} expert!
        </h3>
        <p className="text-sm text-gray-600 mt-1">Progress: 1/6 checkpoints completed</p>
      </div>
      
      <div className="relative pl-8 border-l-2 border-dashed border-gray-300">
        {['Introduction', 'Skills', 'Courses', 'Projects', 'Resume', 'Network'].map((checkpoint, index) => (
          <div key={checkpoint} className="mb-10 relative">
            <div className={cn(
              "absolute -left-[34px] h-6 w-6 rounded-full border-2 flex items-center justify-center",
              index === 0 
                ? "bg-primary border-primary text-white" 
                : "bg-white border-gray-300"
            )}>
              {index === 0 ? '✓' : (index + 1)}
            </div>
            <div className={cn(
              "p-4 rounded-lg border bg-white",
              index === 0 ? "border-primary shadow-sm" : "border-gray-200"
            )}>
              <h4 className="font-bold text-lg">{checkpoint}</h4>
              <p className="text-gray-600 text-sm">
                {index === 0 
                  ? 'Completed! You\'ve started your journey toward a career in ' + careerPath + '.'
                  : 'Unlock this section by completing previous steps.'}
              </p>
              
              {index === 1 && (
                <Button size="sm" className="mt-2" variant="outline" disabled>
                  Start Learning
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // Typing Indicator Animation
  const TypingIndicator = () => (
    <div className="flex space-x-1 items-center py-1 px-3">
      <motion.div
        className="h-2 w-2 bg-gray-400 rounded-full"
        animate={{ scale: [0.5, 1, 0.5] }}
        transition={{ duration: 1, repeat: Infinity }}
      />
      <motion.div
        className="h-2 w-2 bg-gray-400 rounded-full"
        animate={{ scale: [0.5, 1, 0.5] }}
        transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
      />
      <motion.div
        className="h-2 w-2 bg-gray-400 rounded-full"
        animate={{ scale: [0.5, 1, 0.5] }}
        transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
      />
    </div>
  );

  return (
    <div className="relative max-w-4xl mx-auto">
      {/* PathFinder Chat Interface */}
      <div className="bg-white rounded-xl shadow-md p-4 mb-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <PathFinderAvatar />
            <h3 className="text-xl font-semibold ml-3">PathFinder</h3>
          </div>
          
          {started && (
            <button
              onClick={() => setStarted(false)}
              className="h-8 w-8 flex items-center justify-center rounded-full hover:bg-gray-100"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          )}
        </div>
        
        {!started ? (
          <div className="py-12 flex flex-col items-center justify-center">
            <h2 className="text-2xl font-bold mb-3">Discover Your Perfect Tech Career</h2>
            <p className="text-gray-600 max-w-md text-center mb-6">
              Answer a few questions and I'll recommend the best tech career path for you based on your interests and strengths.
            </p>
            <Button 
              size="lg" 
              onClick={startChat}
              className="flex items-center"
            >
              <span>Let's Get Started</span>
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        ) : (
          <div className="flex flex-col h-[550px]">
            {/* Messages Container */}
            <div className="flex-1 overflow-y-auto px-2 py-4">
              <div className="space-y-4">
                {messages.map(message => (
                  <div 
                    key={message.id}
                    className={cn(
                      "flex",
                      message.sender === 'user' ? "justify-end" : "justify-start",
                    )}
                  >
                    {message.sender === 'bot' && !message.isTyping && (
                      <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-white text-sm font-bold mr-2 mt-1">
                        PF
                      </div>
                    )}
                    
                    <div className={cn(
                      "max-w-[80%] rounded-2xl py-2 px-4",
                      message.sender === 'user' 
                        ? "bg-primary text-white rounded-tr-none" 
                        : "bg-gray-100 text-gray-800 rounded-tl-none"
                    )}>
                      {message.isTyping ? (
                        <TypingIndicator />
                      ) : (
                        <div className="text-sm">{message.content}</div>
                      )}
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            </div>
            
            {/* Interactive Input Areas based on current stage */}
            <div className="mt-4 border-t pt-4">
              {currentStage === 2 && renderInterestPicker()}
              {currentStage === 3 && renderPersonalInfo()}
              {currentStage === 4 && analyzing && renderAnalysisAnimation()}
              {currentStage === 5 && renderRoadmap()}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}