import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Sparkles, X, Send, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

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
  
  // Enhanced questionnaire state - we'll use an object to store all answers
  const [questionnaire, setQuestionnaire] = useState({
    // Basic info
    educationLevel: '',
    location: '',
    background: '',
    
    // Technical skills
    programmingExperience: '',
    techSkills: [] as string[],
    
    // Work preferences
    workStyle: '',
    teamSize: '',
    workEnvironment: '',
    
    // Learning & Growth
    learningStyle: '',
    growthPriorities: [] as string[],
    
    // Career priorities
    salaryImportance: '',
    workLifeBalance: '',
    
    // Goals & Values
    shortTermGoal: '',
    values: [] as string[],
  });
  
  // Track current question in the enhanced questionnaire
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const totalQuestions = 12; // Total number of questions in the enhanced questionnaire
  
  const [analyzing, setAnalyzing] = useState(false);
  const [careerPath, setCareerPath] = useState('');
  const [careerMatches, setCareerMatches] = useState<{title: string, match: number, category: string, skills: string[], salary: string, growth: string, description: string, dailyTasks: string, learningPath: string, certifications: string[]}[]>([]);
  const [progress, setProgress] = useState(0);
  
  // New state for AI chat mode
  const [chatMode, setChatMode] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [chatHistory, setChatHistory] = useState<{role: 'user' | 'assistant', content: string}[]>([]);
  const [isAiThinking, setIsAiThinking] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

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

  // Continue to enhanced questionnaire after selecting interests
  const continueToEnhancedQuestionnaire = () => {
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
        content: "Great choices! Now, let's get to know you better with a few more questions to provide a highly personalized career recommendation tailored specifically for you...",
        sender: 'bot'
      });
      
      // Start the questionnaire
      setTimeout(() => {
        askNextQuestion();
      }, 1500);
    }, 1000);
  };

  // Ask the next question in the enhanced questionnaire
  const askNextQuestion = () => {
    // Questions with their options
    const questions = [
      {
        id: 1,
        category: 'Basic Info',
        question: '🎓 What is your current education level?',
        field: 'educationLevel',
        options: [
          { value: '10th', label: '10th Standard' },
          { value: '12th', label: '12th Standard' },
          { value: 'diploma', label: 'Diploma' },
          { value: 'bachelors', label: 'Bachelor\'s Degree' },
          { value: 'masters', label: 'Master\'s Degree' },
        ]
      },
      {
        id: 2,
        category: 'Basic Info',
        question: '🌍 Are you looking for opportunities in India or globally?',
        field: 'location',
        options: [
          { value: 'india', label: 'India 🇮🇳' },
          { value: 'global', label: 'Global 🌎' },
        ]
      },
      {
        id: 3,
        category: 'Technical Background',
        question: '💻 How much programming experience do you have?',
        field: 'programmingExperience',
        options: [
          { value: 'none', label: 'No Experience' },
          { value: 'beginner', label: 'Beginner (< 1 year)' },
          { value: 'intermediate', label: 'Intermediate (1-3 years)' },
          { value: 'advanced', label: 'Advanced (3+ years)' },
        ]
      },
      {
        id: 4,
        category: 'Technical Background',
        question: '🛠️ Which technical skills are you most comfortable with? (Select up to 3)',
        field: 'techSkills',
        multiSelect: true,
        options: [
          { value: 'frontend', label: 'Frontend Development' },
          { value: 'backend', label: 'Backend Development' },
          { value: 'mobile', label: 'Mobile Development' },
          { value: 'design', label: 'UI/UX Design' },
          { value: 'data', label: 'Data Analysis' },
          { value: 'ai', label: 'AI/Machine Learning' },
          { value: 'devops', label: 'DevOps/Cloud' },
          { value: 'none', label: 'None Yet' },
        ]
      },
      {
        id: 5,
        category: 'Work Style',
        question: '👥 Do you prefer working independently or in a team?',
        field: 'workStyle',
        options: [
          { value: 'independent', label: 'Independently' },
          { value: 'team', label: 'In a Team' },
          { value: 'mix', label: 'A Mix of Both' },
        ]
      },
      {
        id: 6,
        category: 'Work Environment',
        question: '🏢 What size of company would you prefer to work in?',
        field: 'teamSize',
        options: [
          { value: 'startup', label: 'Startup (< 50 people)' },
          { value: 'midsize', label: 'Mid-size (50-500 people)' },
          { value: 'large', label: 'Large (500+ people)' },
          { value: 'any', label: 'No Preference' },
        ]
      },
      {
        id: 7,
        category: 'Work Environment',
        question: '🏠 What is your preferred work environment?',
        field: 'workEnvironment',
        options: [
          { value: 'office', label: 'Office-based' },
          { value: 'remote', label: 'Fully Remote' },
          { value: 'hybrid', label: 'Hybrid' },
        ]
      },
      {
        id: 8,
        category: 'Learning & Growth',
        question: '📚 How do you prefer to learn new skills?',
        field: 'learningStyle',
        options: [
          { value: 'structured', label: 'Structured Courses' },
          { value: 'practical', label: 'Hands-on Projects' },
          { value: 'mentorship', label: 'With a Mentor' },
          { value: 'self', label: 'Self-paced Learning' },
        ]
      },
      {
        id: 9,
        category: 'Career Priorities',
        question: '💰 How important is a high starting salary to you?',
        field: 'salaryImportance',
        options: [
          { value: 'essential', label: 'Essential' },
          { value: 'important', label: 'Important but Not Critical' },
          { value: 'secondary', label: 'Secondary to Growth' },
          { value: 'notImportant', label: 'Not Important Now' },
        ]
      },
      {
        id: 10,
        category: 'Career Priorities',
        question: '⚖️ How do you view work-life balance?',
        field: 'workLifeBalance',
        options: [
          { value: 'flexible', label: 'Flexible Hours Important' },
          { value: 'strict', label: 'Prefer Regular Hours' },
          { value: 'resultsFocused', label: 'Focus on Results, Not Hours' },
        ]
      },
      {
        id: 11,
        category: 'Goals & Values',
        question: '🚀 What is your main short-term career goal?',
        field: 'shortTermGoal',
        options: [
          { value: 'skills', label: 'Develop Technical Skills' },
          { value: 'salary', label: 'Maximize Earning Potential' },
          { value: 'experience', label: 'Gain Diverse Experience' },
          { value: 'impact', label: 'Create Impact' },
          { value: 'startup', label: 'Build Own Startup' },
        ]
      },
      {
        id: 12,
        category: 'Growth Priorities',
        question: '🌱 Which aspects of professional growth do you value most? (Select up to 3)',
        field: 'growthPriorities',
        multiSelect: true,
        options: [
          { value: 'technicalDepth', label: 'Technical Depth' },
          { value: 'leadershipSkills', label: 'Leadership Skills' },
          { value: 'mentorship', label: 'Mentoring Others' },
          { value: 'industryRecognition', label: 'Industry Recognition' },
          { value: 'workLifeBalance', label: 'Work-Life Balance' },
          { value: 'innovation', label: 'Innovation & Creativity' },
          { value: 'jobSecurity', label: 'Job Security' },
          { value: 'networking', label: 'Professional Network' },
        ]
      },
    ];
    
    // Find the current question
    const currentQuestionData = questions.find(q => q.id === currentQuestion);
    
    if (!currentQuestionData) {
      // If we've gone through all questions, proceed to analysis
      startAnalysis();
      return;
    }
    
    // Ask the question
    addMessage({
      id: Date.now().toString(),
      content: (
        <div>
          <p className="text-xs text-gray-500">{currentQuestionData.category}</p>
          <p className="font-medium">{currentQuestionData.question}</p>
        </div>
      ),
      sender: 'bot'
    });
    
    // Update the progress
    setProgress((currentQuestion / totalQuestions) * 100);
  };

  // Handle answer selection in the enhanced questionnaire
  const handleQuestionnaireSelection = (field: string, value: string | string[], multiSelect = false) => {
    // Update the questionnaire state
    setQuestionnaire(prev => {
      if (multiSelect && Array.isArray(value)) {
        return { ...prev, [field]: value };
      }
      return { ...prev, [field]: value };
    });
    
    // Add user's response to chat
    let responseText = '';
    
    if (Array.isArray(value)) {
      responseText = value.join(', ');
    } else {
      responseText = value.toString();
    }
    
    addMessage({
      id: Date.now().toString(),
      content: responseText,
      sender: 'user'
    });
    
    // Move to the next question
    setCurrentQuestion(prev => prev + 1);
    
    // Ask the next question after a short delay
    setTimeout(() => {
      askNextQuestion();
    }, 1000);
  };

  // Skip the questionnaire
  const skipQuestionnaire = () => {
    addMessage({
      id: Date.now().toString(),
      content: "I'd like to skip the additional questions for now.",
      sender: 'user'
    });
    
    startAnalysis();
  };
  
  // Functions for AI-powered chat
  const handleChatSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!chatInput.trim() || isAiThinking) return;
    
    // Add user message to UI
    const userMessage = chatInput.trim();
    setChatInput('');
    
    addMessage({
      id: Date.now().toString(),
      content: userMessage,
      sender: 'user'
    });
    
    // Update chat history for context
    const updatedHistory = [...chatHistory, { role: 'user' as const, content: userMessage }];
    setChatHistory(updatedHistory);
    
    // Show thinking state
    setIsAiThinking(true);
    
    try {
      // Call the API
      const response = await fetch('/api/career/pathfinder/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage,
          chatHistory: updatedHistory
        }),
        credentials: 'include'
      });
      
      if (!response.ok) {
        throw new Error('Failed to get response from PathFinder');
      }
      
      const data = await response.json();
      
      // Add AI response to chat
      addMessage({
        id: Date.now().toString(),
        content: data.response,
        sender: 'bot'
      });
      
      // Update chat history
      setChatHistory([...updatedHistory, { role: 'assistant', content: data.response }]);
    } catch (error) {
      console.error('Error in AI chat:', error);
      toast({
        title: "Chat Error",
        description: "Sorry, I couldn't process your message. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsAiThinking(false);
    }
  };
  
  // Function to start AI chat mode after completing the questionnaire
  const startAiChatMode = () => {
    setChatMode(true);
    addMessage({
      id: Date.now().toString(),
      content: `Great! Now that I understand your interests and preferences, let's chat more specifically about your career path as a ${careerPath}. Feel free to ask me anything about this career, required skills, learning resources, or next steps!`,
      sender: 'bot'
    });
  };

  // Start the analysis animation
  const startAnalysis = () => {
    console.log("Starting analysis with questionnaire data:", questionnaire);
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
        console.log("Analysis complete, moving to results stage");
        setAnalyzing(false);
        setCurrentStage(5);
        
        // Career options with their skill profiles 
        const careerOptions = [
          {
            title: "Frontend Developer",
            match: 0,
            category: "Web Development",
            skills: ["HTML/CSS", "JavaScript", "React", "TypeScript", "Figma", "UX/UI Fundamentals"],
            salary: "₹5-25 LPA",
            growth: "24% growth over next 10 years",
            description: "Frontend developers build the visible parts of websites and web applications, bringing designs to life with code.",
            dailyTasks: "Writing clean code, collaborating with designers, optimizing applications, debugging, and staying current with technologies",
            learningPath: "HTML/CSS/JS fundamentals, frontend frameworks, state management, responsive design, browser DevTools",
            certifications: ["Meta Frontend Developer", "freeCodeCamp Responsive Web Design", "JavaScript Algorithms and Data Structures"]
          },
          {
            title: "Backend Developer",
            match: 0,
            category: "Web Development",
            skills: ["Node.js", "Express", "Databases", "API Design", "Authentication", "Performance"],
            salary: "₹6-28 LPA",
            growth: "22% growth over next 10 years",
            description: "Backend developers build and maintain the server-side of applications, handling business logic, database operations, and APIs.",
            dailyTasks: "Designing APIs, optimizing database queries, implementing authentication, monitoring systems, working with infrastructure",
            learningPath: "Server-side languages, database fundamentals, API design, authentication, deployment basics",
            certifications: ["IBM Back-End Development", "Node.js Services Development", "MongoDB Certified Developer"]
          },
          {
            title: "Full-Stack Developer",
            match: 0,
            category: "Web Development",
            skills: ["JavaScript", "React", "Node.js", "PostgreSQL", "AWS/Azure", "Git"],
            salary: "₹7-35 LPA",
            growth: "23% growth over next 10 years",
            description: "Full-stack developers work on both frontend and backend, handling entire web applications end-to-end.",
            dailyTasks: "End-to-end feature development, database and API design, debugging, collaboration, code reviews",
            learningPath: "Frontend fundamentals, backend framework, databases, API development, CI/CD",
            certifications: ["Meta Full-Stack Engineer", "freeCodeCamp Full Stack", "AWS Developer Associate"]
          },
          {
            title: "Data Analyst",
            match: 0,
            category: "Data Science",
            skills: ["SQL", "Excel", "Python", "Data Visualization", "Statistics", "Power BI/Tableau"],
            salary: "₹5-18 LPA",
            growth: "20% growth over next 10 years",
            description: "Data analysts collect, clean, and interpret data sets to solve business problems and help make data-driven decisions.",
            dailyTasks: "Data cleaning, dashboard creation, report generation, stakeholder collaboration, pipeline maintenance",
            learningPath: "SQL/Excel analysis, Python fundamentals, visualization, statistics, BI tools",
            certifications: ["Google Data Analytics", "Microsoft Power BI Data Analyst", "IBM Data Analyst"]
          },
          {
            title: "Data Scientist",
            match: 0,
            category: "Data Science",
            skills: ["Python", "R", "Machine Learning", "Statistical Analysis", "SQL", "Data Visualization"],
            salary: "₹8-30 LPA",
            growth: "28% growth over next 10 years",
            description: "Data scientists utilize statistical methods and machine learning to analyze data and derive actionable insights.",
            dailyTasks: "Building ML models, experiment design, data analysis, stakeholder communication, research",
            learningPath: "Programming for data science, statistics, ML fundamentals, deep learning, experimental design",
            certifications: ["IBM Data Science", "Microsoft Azure Data Scientist", "Google Machine Learning Engineer"]
          },
          {
            title: "Data Engineer",
            match: 0,
            category: "Data Science",
            skills: ["Python", "SQL", "Apache Spark", "ETL Pipelines", "Cloud Platforms", "Big Data Tools"],
            salary: "₹8-35 LPA",
            growth: "25% growth over next 10 years",
            description: "Data engineers design and implement systems to collect, store, and analyze large volumes of data.",
            dailyTasks: "Building data pipelines, maintaining data warehouses, performance optimization, security management, collaboration",
            learningPath: "Database fundamentals, ETL tools, big data technologies, cloud data services, data warehousing",
            certifications: ["Google Cloud Professional Data Engineer", "AWS Certified Data Engineer", "Cloudera Certified Data Engineer"]
          },
          {
            title: "Android Developer",
            match: 0,
            category: "Mobile Development",
            skills: ["Kotlin", "Java", "Android SDK", "Material Design", "SQLite", "Jetpack Compose"],
            salary: "₹6-25 LPA",
            growth: "22% growth over next 10 years",
            description: "Android developers build mobile applications for the world's most popular mobile platform.",
            dailyTasks: "App development and maintenance, UI implementation, performance optimization, debugging, platform updates",
            learningPath: "Java/Kotlin, Android Studio, Material Design, database integration, app publishing",
            certifications: ["Google Associate Android Developer", "Android Certified Application Developer", "Meta Android Developer"]
          },
          {
            title: "iOS Developer",
            match: 0,
            category: "Mobile Development",
            skills: ["Swift", "Objective-C", "iOS SDK", "UIKit", "SwiftUI", "Core Data"],
            salary: "₹7-30 LPA",
            growth: "22% growth over next 10 years",
            description: "iOS developers create applications for Apple's ecosystem including iPhone, iPad, and other Apple devices.",
            dailyTasks: "App development, feature design, performance optimization, bug fixing, cross-functional collaboration",
            learningPath: "Swift, iOS SDK, UIKit/SwiftUI, architecture patterns, App Store submission",
            certifications: ["App Development with Swift", "iOS App Development Professional", "Certified iOS Developer"]
          },
          {
            title: "Cross-Platform Developer",
            match: 0,
            category: "Mobile Development",
            skills: ["React Native", "Flutter", "JavaScript", "Dart", "Mobile UI Design", "Native APIs"],
            salary: "₹6-28 LPA",
            growth: "24% growth over next 10 years",
            description: "Cross-platform developers build mobile applications that run on multiple platforms using a single codebase.",
            dailyTasks: "Cross-platform app development, code optimization, native feature integration, troubleshooting, UI/UX consistency",
            learningPath: "JavaScript/Dart, React Native/Flutter, mobile UI/UX, native integration, cross-platform testing",
            certifications: ["Meta React Native Specialization", "Flutter Developer", "Certified Cross-Platform App Developer"]
          },
          {
            title: "UI Designer",
            match: 0,
            category: "Design & UX",
            skills: ["Figma", "Adobe XD", "Visual Design", "Typography", "Color Theory", "Prototyping"],
            salary: "₹4-20 LPA",
            growth: "15% growth over next 10 years",
            description: "UI designers create the visual elements of digital products focusing on look and style.",
            dailyTasks: "Interface design, visual element creation, prototyping, developer collaboration, design system maintenance",
            learningPath: "Visual design fundamentals, UI tools, design systems, prototyping, responsive design",
            certifications: ["Google UX Design Professional", "Certified UI Designer", "Adobe XD Certification"]
          },
          {
            title: "UX Designer",
            match: 0,
            category: "Design & UX",
            skills: ["User Research", "Wireframing", "Prototyping", "Usability Testing", "Information Architecture", "Figma"],
            salary: "₹5-25 LPA",
            growth: "18% growth over next 10 years",
            description: "UX designers focus on optimizing user satisfaction by improving the usability and accessibility of products.",
            dailyTasks: "User research, flow/wireframe creation, prototyping, usability testing, requirement definition",
            learningPath: "User research methods, wireframing, information architecture, usability testing, interaction design",
            certifications: ["Nielsen Norman Group UX", "Meta UX Designer Professional", "Certified Usability Analyst"]
          },
          {
            title: "Product Designer",
            match: 0,
            category: "Design & UX",
            skills: ["UI Design", "UX Research", "Product Thinking", "Prototyping", "Design Systems", "User Testing"],
            salary: "₹8-35 LPA",
            growth: "19% growth over next 10 years",
            description: "Product designers combine UX and UI design with product thinking to create holistic product experiences.",
            dailyTasks: "Product/user needs definition, end-to-end design, feedback iteration, collaboration, design system maintenance",
            learningPath: "UI/UX fundamentals, product strategy, design leadership, design systems, data-informed design",
            certifications: ["Professional Certificate in Product Design", "Certified Digital Product Designer", "Strategic Product Design"]
          },
          {
            title: "DevOps Engineer",
            match: 0,
            category: "DevOps & Cloud",
            skills: ["Linux", "Docker", "Kubernetes", "CI/CD", "Infrastructure as Code", "Monitoring Tools"],
            salary: "₹8-30 LPA",
            growth: "22% growth over next 10 years",
            description: "DevOps engineers bridge development and operations, automating and optimizing deployment pipelines.",
            dailyTasks: "CI/CD implementation, automation, monitoring, cloud resource management, infrastructure maintenance",
            learningPath: "Linux fundamentals, containerization, orchestration, CI/CD pipelines, infrastructure as code",
            certifications: ["AWS Certified DevOps Engineer", "Azure DevOps Engineer", "Google Professional DevOps Engineer"]
          },
          {
            title: "Cloud Architect",
            match: 0,
            category: "DevOps & Cloud",
            skills: ["AWS/Azure/GCP", "Infrastructure as Code", "Security", "Networking", "Cost Optimization"],
            salary: "₹12-40 LPA",
            growth: "25% growth over next 10 years",
            description: "Cloud architects design, implement, and manage cloud computing strategies for organizations.",
            dailyTasks: "Architecture design, security implementation, cost management, performance monitoring, cloud strategy development",
            learningPath: "Cloud fundamentals, architecture patterns, security best practices, networking, cost optimization",
            certifications: ["AWS Solutions Architect", "Microsoft Azure Architect", "Google Cloud Architect"]
          },
          {
            title: "Site Reliability Engineer (SRE)",
            match: 0,
            category: "DevOps & Cloud",
            skills: ["Programming", "Systems Engineering", "Automation", "Monitoring", "Incident Response"],
            salary: "₹10-35 LPA",
            growth: "22% growth over next 10 years",
            description: "SREs ensure that systems are reliable, scalable, and performing optimally, bridging software engineering and operations.",
            dailyTasks: "System reliability engineering, automation, monitoring, incident response, performance optimization",
            learningPath: "Programming fundamentals, systems engineering, monitoring tools, automation, incident management",
            certifications: ["Google SRE", "Azure Reliability Engineering", "AWS Operations Professional"]
          },
        ];
        
        // Calculate match scores for each career
        let calculatedMatches = careerOptions.map(career => {
          let matchScore = 0;
          const selectedInterests = interests.filter(i => i.selected).map(i => i.label);
          
          // Match based on interests (max 30 points)
          if (selectedInterests.includes("Building Code") && 
              (career.title.includes("Developer") || career.category === "Web Development")) {
            matchScore += 10;
          }
          
          if (selectedInterests.includes("Design & Creativity") && 
              (career.category === "Design & UX" || career.title.includes("Frontend"))) {
            matchScore += 10;
          }
          
          if (selectedInterests.includes("Logic & Puzzles") && 
              (career.category === "Data Science" || career.title.includes("Backend"))) {
            matchScore += 10;
          }
          
          if (selectedInterests.includes("Team Leadership") && 
              (career.title.includes("Product") || career.title.includes("DevOps"))) {
            matchScore += 10;
          }
          
          if (selectedInterests.includes("Money & Business") && 
              (career.salary.includes("30") || career.salary.includes("40"))) {
            matchScore += 7;
          }
          
          if (selectedInterests.includes("Tech Explorations") && 
              (career.category === "DevOps & Cloud" || career.category === "Mobile Development")) {
            matchScore += 10;
          }
          
          // Match based on questionnaire answers (max 70 points)
          
          // Technical background matches
          if (questionnaire.programmingExperience) {
            if (questionnaire.programmingExperience === "none" && 
                (career.category === "Design & UX" || career.title.includes("Analyst"))) {
              matchScore += 10;
            } else if (questionnaire.programmingExperience === "beginner" && 
                (career.title.includes("Frontend") || career.title.includes("UI"))) {
              matchScore += 10;
            } else if (questionnaire.programmingExperience === "intermediate" && 
                (career.title.includes("Full-Stack") || career.title.includes("Android"))) {
              matchScore += 10;
            } else if (questionnaire.programmingExperience === "advanced" && 
                (career.title.includes("Backend") || career.title.includes("Data Engineer") || 
                 career.title.includes("DevOps"))) {
              matchScore += 10;
            }
          }
          
          // Technical skills matches
          if (questionnaire.techSkills && questionnaire.techSkills.length > 0) {
            if (questionnaire.techSkills.includes("frontend") && 
                (career.title.includes("Frontend") || career.title.includes("UI"))) {
              matchScore += 8;
            }
            
            if (questionnaire.techSkills.includes("backend") && 
                (career.title.includes("Backend") || career.title.includes("Full-Stack"))) {
              matchScore += 8;
            }
            
            if (questionnaire.techSkills.includes("mobile") && 
                career.category === "Mobile Development") {
              matchScore += 10;
            }
            
            if (questionnaire.techSkills.includes("design") && 
                career.category === "Design & UX") {
              matchScore += 10;
            }
            
            if (questionnaire.techSkills.includes("data") && 
                career.category === "Data Science") {
              matchScore += 10;
            }
            
            if (questionnaire.techSkills.includes("devops") && 
                career.category === "DevOps & Cloud") {
              matchScore += 10;
            }
            
            if (questionnaire.techSkills.includes("ai") && 
                career.title.includes("Data Scientist")) {
              matchScore += 10;
            }
          }
          
          // Work style preferences
          if (questionnaire.workStyle) {
            if (questionnaire.workStyle === "independent" && 
                (career.title.includes("Designer") || career.title.includes("Developer"))) {
              matchScore += 7;
            }
            
            if (questionnaire.workStyle === "team" && 
                (career.title.includes("Product") || career.title.includes("DevOps"))) {
              matchScore += 7;
            }
          }
          
          // Company size preferences
          if (questionnaire.teamSize) {
            if (questionnaire.teamSize === "startup" && 
                (career.title.includes("Full-Stack") || career.title.includes("Product"))) {
              matchScore += 5;
            }
            
            if (questionnaire.teamSize === "large" && 
                (career.title.includes("Cloud") || career.title.includes("Data"))) {
              matchScore += 5;
            }
          }
          
          // Work environment preferences
          if (questionnaire.workEnvironment) {
            if (questionnaire.workEnvironment === "remote" && 
                (career.category === "Web Development" || career.category === "Design & UX")) {
              matchScore += 5;
            }
          }
          
          // Learning style
          if (questionnaire.learningStyle) {
            if (questionnaire.learningStyle === "practical" && 
                (career.title.includes("Developer") || career.title.includes("Engineer"))) {
              matchScore += 5;
            }
            
            if (questionnaire.learningStyle === "structured" && 
                (career.title.includes("Data") || career.title.includes("Cloud"))) {
              matchScore += 5;
            }
          }
          
          // Career priorities
          if (questionnaire.salaryImportance === "essential" && 
              (career.salary.includes("35") || career.salary.includes("40"))) {
            matchScore += 5;
          }
          
          if (questionnaire.workLifeBalance === "flexible" && 
              (career.category === "Design & UX" || career.title.includes("Developer"))) {
            matchScore += 5;
          }
          
          // Short-term goals
          if (questionnaire.shortTermGoal) {
            if (questionnaire.shortTermGoal === "skills" && 
                (career.title.includes("Frontend") || career.title.includes("Data Analyst"))) {
              matchScore += 5;
            }
            
            if (questionnaire.shortTermGoal === "salary" && 
                (career.title.includes("Cloud") || career.title.includes("Data Scientist"))) {
              matchScore += 5;
            }
            
            if (questionnaire.shortTermGoal === "impact" && 
                (career.title.includes("Product") || career.title.includes("SRE"))) {
              matchScore += 5;
            }
          }
          
          // Normalize score to 0-100%
          const normalizedScore = Math.min(Math.round(matchScore), 100);
          
          return {
            ...career,
            match: normalizedScore
          };
        });
        
        // Sort by match score and get top matches
        calculatedMatches.sort((a, b) => b.match - a.match);
        const topMatches = calculatedMatches.slice(0, 3);
        
        // Set career matches
        setCareerMatches(topMatches);
        
        // Set the top recommended career path
        setCareerPath(topMatches[0].title);
        
        console.log("Top matches to display:", topMatches);
        
        // First message - introduce the results
        addMessage({
          id: Date.now().toString(),
          content: `🎯 Your Top Career Match: ${topMatches[0].title}`,
          sender: 'bot'
        });
        
        // Second message - show all matches
        setTimeout(() => {
          let matchesContent = "Based on your interests and questionnaire responses, here are your personalized career matches:\n\n";
          
          topMatches.forEach((career, index) => {
            matchesContent += `${index + 1}. ${career.title} - ${career.match}% Match\n`;
            matchesContent += `   ${career.category} • ${career.salary}\n`;
            matchesContent += `   ${career.description}\n\n`;
          });
          
          addMessage({
            id: Date.now().toString(),
            content: matchesContent,
            sender: 'bot'
          });
          
          // Final message - call to action
          setTimeout(() => {
            addMessage({
              id: Date.now().toString(),
              content: `Let's continue your journey toward becoming a ${topMatches[0].title}!`,
              sender: 'bot'
            });
          }, 1000);
        }, 1000);
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
            onClick={continueToEnhancedQuestionnaire}
            className="space-x-2"
          >
            <span>Continue</span>
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );

  // Questions data for the enhanced questionnaire
  const questionnaireData = [
    {
      id: 1,
      category: 'Basic Info',
      question: '🎓 What is your current education level?',
      field: 'educationLevel',
      options: [
        { value: '10th', label: '10th Standard' },
        { value: '12th', label: '12th Standard' },
        { value: 'diploma', label: 'Diploma' },
        { value: 'bachelors', label: 'Bachelor\'s Degree' },
        { value: 'masters', label: 'Master\'s Degree' },
      ]
    },
    {
      id: 2,
      category: 'Basic Info',
      question: '🌍 Are you looking for opportunities in India or globally?',
      field: 'location',
      options: [
        { value: 'india', label: 'India 🇮🇳' },
        { value: 'global', label: 'Global 🌎' },
      ]
    },
    {
      id: 3,
      category: 'Technical Background',
      question: '💻 How much programming experience do you have?',
      field: 'programmingExperience',
      options: [
        { value: 'none', label: 'No Experience' },
        { value: 'beginner', label: 'Beginner (< 1 year)' },
        { value: 'intermediate', label: 'Intermediate (1-3 years)' },
        { value: 'advanced', label: 'Advanced (3+ years)' },
      ]
    },
    {
      id: 4,
      category: 'Technical Background',
      question: '🛠️ Which technical skills are you most comfortable with? (Select up to 3)',
      field: 'techSkills',
      multiSelect: true,
      options: [
        { value: 'frontend', label: 'Frontend Development' },
        { value: 'backend', label: 'Backend Development' },
        { value: 'mobile', label: 'Mobile Development' },
        { value: 'design', label: 'UI/UX Design' },
        { value: 'data', label: 'Data Analysis' },
        { value: 'ai', label: 'AI/Machine Learning' },
        { value: 'devops', label: 'DevOps/Cloud' },
        { value: 'none', label: 'None Yet' },
      ]
    },
    {
      id: 5,
      category: 'Work Style',
      question: '👥 Do you prefer working independently or in a team?',
      field: 'workStyle',
      options: [
        { value: 'independent', label: 'Independently' },
        { value: 'team', label: 'In a Team' },
        { value: 'mix', label: 'A Mix of Both' },
      ]
    },
    {
      id: 6,
      category: 'Work Environment',
      question: '🏢 What size of company would you prefer to work in?',
      field: 'teamSize',
      options: [
        { value: 'startup', label: 'Startup (< 50 people)' },
        { value: 'midsize', label: 'Mid-size (50-500 people)' },
        { value: 'large', label: 'Large (500+ people)' },
        { value: 'any', label: 'No Preference' },
      ]
    },
    {
      id: 7,
      category: 'Work Environment',
      question: '🏠 What is your preferred work environment?',
      field: 'workEnvironment',
      options: [
        { value: 'office', label: 'Office-based' },
        { value: 'remote', label: 'Fully Remote' },
        { value: 'hybrid', label: 'Hybrid' },
      ]
    },
    {
      id: 8,
      category: 'Learning & Growth',
      question: '📚 How do you prefer to learn new skills?',
      field: 'learningStyle',
      options: [
        { value: 'structured', label: 'Structured Courses' },
        { value: 'practical', label: 'Hands-on Projects' },
        { value: 'mentorship', label: 'With a Mentor' },
        { value: 'self', label: 'Self-paced Learning' },
      ]
    },
    {
      id: 9,
      category: 'Career Priorities',
      question: '💰 How important is a high starting salary to you?',
      field: 'salaryImportance',
      options: [
        { value: 'essential', label: 'Essential' },
        { value: 'important', label: 'Important but Not Critical' },
        { value: 'secondary', label: 'Secondary to Growth' },
        { value: 'notImportant', label: 'Not Important Now' },
      ]
    },
    {
      id: 10,
      category: 'Career Priorities',
      question: '⚖️ How do you view work-life balance?',
      field: 'workLifeBalance',
      options: [
        { value: 'flexible', label: 'Flexible Hours Important' },
        { value: 'strict', label: 'Prefer Regular Hours' },
        { value: 'resultsFocused', label: 'Focus on Results, Not Hours' },
      ]
    },
    {
      id: 11,
      category: 'Goals & Values',
      question: '🚀 What is your main short-term career goal?',
      field: 'shortTermGoal',
      options: [
        { value: 'skills', label: 'Develop Technical Skills' },
        { value: 'salary', label: 'Maximize Earning Potential' },
        { value: 'experience', label: 'Gain Diverse Experience' },
        { value: 'impact', label: 'Create Impact' },
        { value: 'startup', label: 'Build Own Startup' },
      ]
    },
    {
      id: 12,
      category: 'Growth Priorities',
      question: '🌱 Which aspects of professional growth do you value most? (Select up to 3)',
      field: 'growthPriorities',
      multiSelect: true,
      options: [
        { value: 'technicalDepth', label: 'Technical Depth' },
        { value: 'leadershipSkills', label: 'Leadership Skills' },
        { value: 'mentorship', label: 'Mentoring Others' },
        { value: 'industryRecognition', label: 'Industry Recognition' },
        { value: 'workLifeBalance', label: 'Work-Life Balance' },
        { value: 'innovation', label: 'Innovation & Creativity' },
        { value: 'jobSecurity', label: 'Job Security' },
        { value: 'networking', label: 'Professional Network' },
      ]
    },
  ];
  
  // For multi-select questions
  const [multiSelectOptions, setMultiSelectOptions] = useState<string[]>([]);
  
  // Reset multi-select options when question changes
  useEffect(() => {
    setMultiSelectOptions([]);
  }, [currentQuestion]);
  
  // Render the Enhanced Questionnaire component
  const renderEnhancedQuestionnaire = () => {
    // Find the current question
    const currentQuestionData = questionnaireData.find(q => q.id === currentQuestion);
    
    if (!currentQuestionData) {
      return null;
    }
    
    const isMultiSelect = currentQuestionData.multiSelect;
    
    // Handle option selection for multi-select questions
    const handleOptionSelect = (value: string) => {
      if (isMultiSelect) {
        setMultiSelectOptions(prev => {
          if (prev.includes(value)) {
            return prev.filter(v => v !== value);
          } else {
            if (prev.length < 3) { // Limit to 3 selections
              return [...prev, value];
            }
            return prev;
          }
        });
      } else {
        // For single-select questions, immediately proceed to the next question
        handleQuestionnaireSelection(
          currentQuestionData.field, 
          value
        );
      }
    };
    
    // Handle continue button click for multi-select questions
    const handleMultiSelectContinue = () => {
      if (multiSelectOptions.length > 0) {
        handleQuestionnaireSelection(
          currentQuestionData.field,
          multiSelectOptions,
          true
        );
      }
    };
    
    return (
      <div className="mt-4 mb-6 w-full max-w-md mx-auto">
        <div className="flex justify-center mb-6">
          <div className="h-2 w-full max-w-xs bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary rounded-full transition-all duration-300" 
              style={{ width: `${(currentQuestion / totalQuestions) * 100}%` }}
            />
          </div>
        </div>
        
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestionData.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-3"
          >
            <div className="mb-4">
              <p className="text-xs text-gray-500">{currentQuestionData.category}</p>
              <p className="font-medium text-gray-700 mb-3">{currentQuestionData.question}</p>
            </div>
            
            <div className={`grid ${currentQuestionData.options.length > 4 ? 'grid-cols-2' : 'grid-cols-1'} gap-3`}>
              {currentQuestionData.options.map(option => (
                <Button
                  key={option.value}
                  variant={
                    isMultiSelect
                      ? multiSelectOptions.includes(option.value) ? "default" : "outline"
                      : questionnaire[currentQuestionData.field as keyof typeof questionnaire] === option.value
                        ? "default"
                        : "outline"
                  }
                  onClick={() => handleOptionSelect(option.value)}
                  className={`h-auto py-3 justify-start ${
                    isMultiSelect && multiSelectOptions.length >= 3 && !multiSelectOptions.includes(option.value)
                      ? "opacity-50"
                      : ""
                  }`}
                  disabled={
                    isMultiSelect && multiSelectOptions.length >= 3 && !multiSelectOptions.includes(option.value)
                  }
                >
                  <span className="text-left">{option.label}</span>
                </Button>
              ))}
            </div>
            
            {isMultiSelect && (
              <div className="flex justify-between mt-4">
                <p className="text-xs text-gray-500 self-center">
                  {multiSelectOptions.length === 0 
                    ? "Select up to 3 options" 
                    : `Selected ${multiSelectOptions.length} of 3`}
                </p>
                {multiSelectOptions.length > 0 && (
                  <Button 
                    onClick={handleMultiSelectContinue}
                    size="sm"
                    className="space-x-2"
                  >
                    <span>Continue</span>
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                )}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
        
        <div className="mt-8 text-center">
          <button 
            onClick={skipQuestionnaire}
            className="text-gray-500 text-sm hover:text-primary hover:underline transition-colors"
          >
            Skip remaining questions
          </button>
        </div>
      </div>
    );
  };

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
      
      <div className="relative pl-8 border-l-2 border-dashed border-gray-300 mb-6">
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
      
      {!chatMode ? (
        <div className="p-4 rounded-lg border border-gray-200 bg-white shadow-sm">
          <h4 className="font-bold text-lg flex items-center">
            <Sparkles className="mr-2 h-5 w-5 text-primary" />
            Want personalized guidance?
          </h4>
          <p className="text-gray-600 text-sm mb-3">
            Chat with our AI-powered PathFinder assistant to get tailored advice and answers about your {careerPath} career path.
          </p>
          <Button onClick={startAiChatMode} className="mt-2">
            Start AI Conversation <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div className="p-4 rounded-lg border border-primary/20 bg-white shadow-sm">
          <h4 className="font-bold text-lg flex items-center">
            <Sparkles className="mr-2 h-5 w-5 text-primary" />
            PathFinder AI Assistant
          </h4>
          <p className="text-gray-600 text-sm mb-4">
            Ask anything about your career path, skills, learning resources, or next steps.
          </p>
          
          <form onSubmit={handleChatSubmit} className="flex items-center gap-2">
            <Input
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Your question about the career path..."
              disabled={isAiThinking}
              className="flex-1"
            />
            <Button 
              type="submit"
              size="icon"
              disabled={isAiThinking || !chatInput.trim()}
            >
              {isAiThinking ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </form>
        </div>
      )}
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
              {currentStage === 3 && renderEnhancedQuestionnaire()}
              {currentStage === 4 && analyzing && renderAnalysisAnimation()}
              {currentStage === 5 && renderRoadmap()}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}