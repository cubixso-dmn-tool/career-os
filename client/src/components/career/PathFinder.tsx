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
import { ChevronRight, MessageCircle, Check, Briefcase, Cpu, Code, Palette, LineChart, Book, Users, FileText, Brain } from "lucide-react";
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

// Types for roadmap data
interface RoadmapData {
  title: string;
  description: string;
  overview: {
    intro: string;
    successStories: string[];
  };
  dayInLife: string[];
  skills: {
    technical: string[];
    soft: string[];
  };
  courses: {
    name: string;
    level: string;
    link: string;
  }[];
  projects: {
    name: string;
    level: string;
    skills: string[];
  }[];
  networking: {
    communities: string[];
    tips: string[];
  };
}

// Career roadmap data
const careerRoadmaps: Record<string, RoadmapData> = {
  "data-science": {
    title: "Data Scientist",
    description: "Analyze and interpret complex data to help organizations make better decisions",
    overview: {
      intro: "Data Science combines statistics, programming, and domain expertise to extract meaningful insights from data. With India's digital transformation and growing tech sector, Data Scientists are in high demand across industries.",
      successStories: [
        "Priya Sharma, IIT graduate, now leads the AI team at Flipkart after starting as a junior data analyst.",
        "Over 40% of Indian startups are now incorporating data science into their business models."
      ]
    },
    dayInLife: [
      "Analyze datasets using Python, R, or SQL",
      "Build and optimize machine learning models",
      "Present insights to non-technical stakeholders",
      "Collaborate with engineers to implement solutions",
      "Stay updated with the latest research and techniques"
    ],
    skills: {
      technical: ["Python", "R", "SQL", "Statistics", "Machine Learning", "Data Visualization", "Big Data Tools"],
      soft: ["Problem-solving", "Communication", "Business Acumen", "Critical Thinking", "Teamwork"]
    },
    courses: [
      {
        name: "Data Science Specialization by IIT Madras",
        level: "Beginner",
        link: "/courses?category=data-science"
      },
      {
        name: "Machine Learning by Andrew Ng",
        level: "Intermediate",
        link: "/courses?category=data-science"
      },
      {
        name: "Deep Learning Specialization",
        level: "Advanced",
        link: "/courses?category=data-science"
      }
    ],
    projects: [
      {
        name: "Customer Segmentation Analysis",
        level: "Beginner",
        skills: ["Python", "Pandas", "Data Visualization"]
      },
      {
        name: "Predictive Analytics Dashboard",
        level: "Intermediate",
        skills: ["Machine Learning", "SQL", "Dashboard Tools"]
      },
      {
        name: "Natural Language Processing Application",
        level: "Advanced",
        skills: ["NLP", "Deep Learning", "Cloud Deployment"]
      }
    ],
    networking: {
      communities: [
        "Kaggle",
        "Data Science India Community",
        "Analytics Vidhya",
        "LinkedIn Data Science Groups"
      ],
      tips: [
        "Create a GitHub portfolio showcasing your projects",
        "Participate in hackathons and competitions",
        "Attend industry conferences and local meetups",
        "Connect with alumni working in data science roles"
      ]
    }
  },
  "product-management": {
    title: "Product Manager",
    description: "Lead the development of products from conception to launch and beyond",
    overview: {
      intro: "Product Managers are the bridge between business strategy, user needs, and technical implementation. They work closely with all teams to ensure products solve real problems and deliver value.",
      successStories: [
        "Rohit Mehta started as a software developer but switched to product management at Paytm, now leading their core payment product.",
        "The demand for product managers in India has grown by 250% in the last 3 years across startups and established companies."
      ]
    },
    dayInLife: [
      "Define product vision and strategy",
      "Gather and prioritize user requirements",
      "Work with designers and engineers on implementation",
      "Analyze metrics and user feedback",
      "Present to stakeholders and leadership"
    ],
    skills: {
      technical: ["Product Analytics", "Basic Programming Knowledge", "Wireframing", "Project Management", "A/B Testing"],
      soft: ["Communication", "Leadership", "Strategic Thinking", "Empathy", "Negotiation"]
    },
    courses: [
      {
        name: "Product Management Fundamentals",
        level: "Beginner",
        link: "/courses?category=business"
      },
      {
        name: "User Research and Validation",
        level: "Intermediate",
        link: "/courses?category=business"
      },
      {
        name: "Strategic Product Leadership",
        level: "Advanced",
        link: "/courses?category=business"
      }
    ],
    projects: [
      {
        name: "Feature Specification Document",
        level: "Beginner",
        skills: ["Documentation", "User Stories", "Wireframing"]
      },
      {
        name: "Product Roadmap Creation",
        level: "Intermediate",
        skills: ["Strategy", "Prioritization", "Stakeholder Management"]
      },
      {
        name: "Product Launch Campaign",
        level: "Advanced",
        skills: ["Marketing", "Analytics", "Cross-functional Coordination"]
      }
    ],
    networking: {
      communities: [
        "Product Management Club India",
        "ProductHunt",
        "Mind the Product",
        "Product Coalition"
      ],
      tips: [
        "Create case studies of products you use and how you would improve them",
        "Network with existing product managers on LinkedIn",
        "Attend product conferences and meetups",
        "Join online communities and contribute to discussions"
      ]
    }
  },
  "web-development": {
    title: "Web Developer",
    description: "Build and maintain websites and web applications using various technologies",
    overview: {
      intro: "Web development is one of the most accessible and in-demand tech careers in India. From startups to established companies, web developers create everything from simple websites to complex web applications.",
      successStories: [
        "Ankit Jain started learning web development through free online resources and now works remotely for an international tech company earning 3x the local market rate.",
        "Many successful Indian freelance web developers earn ₹80,000-2,00,000 monthly working with global clients."
      ]
    },
    dayInLife: [
      "Write clean, functional code for websites/applications",
      "Test and debug across browsers and devices",
      "Collaborate with designers and back-end developers",
      "Optimize applications for performance",
      "Stay updated with the latest web technologies"
    ],
    skills: {
      technical: ["HTML/CSS", "JavaScript", "React/Angular/Vue", "Node.js", "Git", "Responsive Design", "API Integration"],
      soft: ["Problem-solving", "Time Management", "Attention to Detail", "Communication", "Adaptability"]
    },
    courses: [
      {
        name: "Web Development Bootcamp",
        level: "Beginner",
        link: "/courses?category=web-development"
      },
      {
        name: "Advanced JavaScript and Frameworks",
        level: "Intermediate",
        link: "/courses?category=web-development"
      },
      {
        name: "Full-Stack Development Mastery",
        level: "Advanced",
        link: "/courses?category=web-development"
      }
    ],
    projects: [
      {
        name: "Personal Portfolio Website",
        level: "Beginner",
        skills: ["HTML/CSS", "Responsive Design", "Basic JavaScript"]
      },
      {
        name: "E-commerce Platform",
        level: "Intermediate",
        skills: ["React/Angular", "API Integration", "State Management"]
      },
      {
        name: "Full-Stack Social Media Application",
        level: "Advanced",
        skills: ["Full-Stack Development", "Database Design", "Authentication"]
      }
    ],
    networking: {
      communities: [
        "Dev.to",
        "JavaScript India",
        "React India Community",
        "GitHub Open Source Projects"
      ],
      tips: [
        "Build a strong portfolio website showcasing your projects",
        "Contribute to open-source projects on GitHub",
        "Share your knowledge through blogs or tutorials",
        "Attend local coding meetups and hackathons"
      ]
    }
  },
  "ui-ux-design": {
    title: "UI/UX Designer",
    description: "Create user-centered designs and experiences for digital products",
    overview: {
      intro: "UI/UX designers focus on creating intuitive, enjoyable user experiences for websites and applications. As India's digital economy grows, companies increasingly value designers who can create products that users love.",
      successStories: [
        "Nisha Patel transitioned from graphic design to UI/UX and now leads the design team at a fintech startup after just 3 years.",
        "Several Indian designers have gained international recognition on platforms like Dribbble and Behance, opening doors to global opportunities."
      ]
    },
    dayInLife: [
      "Create wireframes, prototypes, and mockups",
      "Conduct user research and usability testing",
      "Collaborate with product managers and developers",
      "Design UI elements and user flows",
      "Iterate based on user feedback"
    ],
    skills: {
      technical: ["Figma/Adobe XD", "Wireframing", "Prototyping", "Visual Design", "Information Architecture", "User Research", "Usability Testing"],
      soft: ["Empathy", "Communication", "Critical Thinking", "Collaboration", "Adaptability"]
    },
    courses: [
      {
        name: "UI/UX Design Fundamentals",
        level: "Beginner",
        link: "/courses?category=design"
      },
      {
        name: "User Research and Testing Methods",
        level: "Intermediate",
        link: "/courses?category=design"
      },
      {
        name: "Advanced Interaction Design",
        level: "Advanced",
        link: "/courses?category=design"
      }
    ],
    projects: [
      {
        name: "Mobile App Redesign",
        level: "Beginner",
        skills: ["UI Design", "Wireframing", "Usability"]
      },
      {
        name: "E-commerce User Experience Project",
        level: "Intermediate",
        skills: ["User Research", "Information Architecture", "Prototyping"]
      },
      {
        name: "Design System Creation",
        level: "Advanced",
        skills: ["Design Systems", "Component Design", "Documentation"]
      }
    ],
    networking: {
      communities: [
        "Dribbble",
        "Behance",
        "Design Buddies",
        "Indian Design Community"
      ],
      tips: [
        "Create a standout portfolio showcasing your process",
        "Share redesigns of existing products with your improvements",
        "Follow and engage with designers you admire",
        "Attend design workshops and conferences"
      ]
    }
  }
};

// Message interface for chat messages
interface Message {
  type: 'bot' | 'user' | 'options' | 'interests' | 'questions' | 'roadmap';
  content: string | any;
}

export default function PathFinder() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentStage, setCurrentStage] = useState<'intro' | 'interests' | 'questions' | 'processing' | 'roadmap'>('intro');
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [userResponses, setUserResponses] = useState({
    grade: '',
    location: '',
    background: '',
    idea: ''
  });
  const [careerPath, setCareerPath] = useState<string | null>(null);
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
                        {roadmap.overview.successStories.map((story, i) => (
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
                        {roadmap.dayInLife.map((item, i) => (
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
                        {roadmap.skills.technical.map((skill, i) => (
                          <Badge key={i} variant="outline" className="bg-blue-50">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                      
                      <h5 className="font-medium text-sm mb-2">Soft Skills</h5>
                      <div className="flex flex-wrap gap-1.5">
                        {roadmap.skills.soft.map((skill, i) => (
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
                        {roadmap.courses.map((course, i) => (
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
                        {roadmap.projects.map((project, i) => (
                          <div key={i} className="bg-muted p-3 rounded-md">
                            <div className="flex justify-between items-start mb-2">
                              <h5 className="font-medium text-sm">{project.name}</h5>
                              <Badge variant="outline" className="text-xs">{project.level}</Badge>
                            </div>
                            <div className="flex flex-wrap gap-1">
                              {project.skills.map((skill, j) => (
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
                        {roadmap.networking.communities.map((community, i) => (
                          <li key={i} className="text-sm flex items-start">
                            <Check className="w-4 h-4 text-green-500 mr-2 mt-0.5" />
                            <span>{community}</span>
                          </li>
                        ))}
                      </ul>
                      
                      <h5 className="font-medium text-sm mb-2">Tips for Success</h5>
                      <ul className="space-y-1">
                        {roadmap.networking.tips.map((tip, i) => (
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

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4">
        <div className="max-w-3xl mx-auto">
          {messages.map((message, index) => renderMessage(message, index))}
          <div ref={chatEndRef} />
        </div>
      </div>
    </div>
  );
}