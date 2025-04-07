import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BookOpen,
  Code,
  Database,
  Fingerprint,
  LayoutDashboard,
  PenTool,
  ServerIcon,
  UsersRound,
  Search,
  Brain,
  Lightbulb,
  ChevronRight,
  ArrowRight,
  BarChart,
  RefreshCw,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import PathFinder from "@/components/career/PathFinder";

// Types
type CareerCategory = {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  careers: Career[];
};

type Career = {
  id: string;
  title: string;
  description: string;
  skills: string[];
  salary: string;
  growth: string;
  dailyTasks: string[];
  learningPath: string[];
  certifications: string[];
};

// Mock data
const careerCategories: CareerCategory[] = [
  {
    id: "web",
    name: "Web Development",
    description: "Create websites and web applications that millions can use",
    icon: <Code className="h-6 w-6" />,
    careers: [
      {
        id: "frontend",
        title: "Frontend Developer",
        description: "Build beautiful, responsive user interfaces for web applications",
        skills: ["HTML/CSS", "JavaScript", "React", "TypeScript", "Figma", "UX/UI Fundamentals"],
        salary: "₹5-25 LPA",
        growth: "24% growth over next 10 years",
        dailyTasks: [
          "Write clean, maintainable code using JavaScript frameworks",
          "Collaborate with designers to implement UI/UX designs",
          "Optimize applications for maximum speed and scalability",
          "Debug issues and fix bugs in frontend applications",
          "Stay up-to-date with emerging frontend technologies"
        ],
        learningPath: [
          "HTML, CSS & JavaScript fundamentals",
          "Frontend framework (React, Vue, Angular)",
          "State management solutions",
          "Build responsive websites",
          "Browser DevTools mastery"
        ],
        certifications: [
          "Meta Frontend Developer Professional Certificate",
          "freeCodeCamp Responsive Web Design",
          "JavaScript Algorithms and Data Structures"
        ]
      },
      {
        id: "backend",
        title: "Backend Developer",
        description: "Create the server-side logic that powers web applications",
        skills: ["Node.js", "Express", "Databases", "API Design", "Authentication", "Performance"],
        salary: "₹6-28 LPA",
        growth: "22% growth over next 10 years",
        dailyTasks: [
          "Design and implement server-side APIs and services",
          "Optimize database queries for performance",
          "Implement authentication and authorization systems",
          "Monitor and troubleshoot backend issues",
          "Work with infrastructure and deployment tools"
        ],
        learningPath: [
          "Server-side language (Node.js, Python, Java)",
          "Database fundamentals (SQL, NoSQL)",
          "API design principles",
          "Authentication & authorization",
          "Deployment & infrastructure basics"
        ],
        certifications: [
          "IBM Back-End Development Professional Certificate",
          "Node.js Services Development",
          "MongoDB Certified Developer"
        ]
      },
      {
        id: "fullstack",
        title: "Full-Stack Developer",
        description: "Handle both frontend and backend development of web applications",
        skills: ["JavaScript", "React", "Node.js", "PostgreSQL", "AWS/Azure", "Git"],
        salary: "₹7-35 LPA",
        growth: "23% growth over next 10 years",
        dailyTasks: [
          "Develop end-to-end features across frontend and backend",
          "Design and implement database schemas and APIs",
          "Troubleshoot and debug issues throughout the stack",
          "Collaborate with product managers and designers",
          "Participate in code reviews and architectural decisions"
        ],
        learningPath: [
          "Frontend fundamentals (HTML, CSS, JavaScript)",
          "Backend language & framework",
          "Database systems",
          "API development",
          "Deployment & CI/CD"
        ],
        certifications: [
          "Meta Full-Stack Engineer Certificate",
          "freeCodeCamp Full Stack Certification",
          "AWS Developer Associate"
        ]
      }
    ]
  },
  {
    id: "data",
    name: "Data Science",
    description: "Extract insights from data to drive business decisions",
    icon: <Database className="h-6 w-6" />,
    careers: [
      {
        id: "data-analyst",
        title: "Data Analyst",
        description: "Analyze data to help companies make better business decisions",
        skills: ["SQL", "Excel", "Python", "Data Visualization", "Statistics", "Power BI/Tableau"],
        salary: "₹5-18 LPA",
        growth: "20% growth over next 10 years",
        dailyTasks: [
          "Clean and process datasets for analysis",
          "Create dashboards and visualizations to communicate insights",
          "Generate regular business reports and metrics",
          "Collaborate with stakeholders to identify business questions",
          "Develop and maintain data pipelines for reporting"
        ],
        learningPath: [
          "Data analysis with SQL and Excel",
          "Python fundamentals for data",
          "Data visualization techniques",
          "Statistical analysis basics",
          "Business intelligence tools"
        ],
        certifications: [
          "Google Data Analytics Professional Certificate",
          "Microsoft Power BI Data Analyst",
          "IBM Data Analyst Professional Certificate"
        ]
      },
      {
        id: "data-scientist",
        title: "Data Scientist",
        description: "Use advanced techniques to analyze complex data and build predictive models",
        skills: ["Python", "R", "Machine Learning", "Statistical Analysis", "SQL", "Data Visualization"],
        salary: "₹8-30 LPA",
        growth: "28% growth over next 10 years",
        dailyTasks: [
          "Build machine learning models to solve business problems",
          "Design experiments and A/B tests",
          "Extract and analyze complex data sets",
          "Communicate findings to technical and non-technical stakeholders",
          "Research and implement new methodologies and algorithms"
        ],
        learningPath: [
          "Programming for data science (Python/R)",
          "Statistics and probability",
          "Machine learning fundamentals",
          "Deep learning techniques",
          "Experimental design"
        ],
        certifications: [
          "IBM Data Science Professional Certificate",
          "Microsoft Azure Data Scientist Associate",
          "Google Machine Learning Engineer"
        ]
      },
      {
        id: "data-engineer",
        title: "Data Engineer",
        description: "Build systems to collect, manage, and convert raw data into useful information",
        skills: ["Python", "SQL", "Apache Spark", "ETL Pipelines", "Cloud Platforms", "Big Data Tools"],
        salary: "₹8-35 LPA",
        growth: "25% growth over next 10 years",
        dailyTasks: [
          "Design and build data pipelines and ETL processes",
          "Maintain data warehouse systems and architecture",
          "Optimize data systems for performance and reliability",
          "Ensure data security and compliance",
          "Collaborate with data scientists and analysts to meet data needs"
        ],
        learningPath: [
          "Database fundamentals and SQL",
          "ETL tools and techniques",
          "Big data technologies",
          "Cloud data services",
          "Data warehousing concepts"
        ],
        certifications: [
          "Google Cloud Professional Data Engineer",
          "AWS Certified Data Engineer",
          "Cloudera Certified Data Engineer"
        ]
      }
    ]
  },
  {
    id: "mobile",
    name: "Mobile Development",
    description: "Build applications for iOS and Android devices",
    icon: <Fingerprint className="h-6 w-6" />,
    careers: [
      {
        id: "android",
        title: "Android Developer",
        description: "Create applications for the Android operating system",
        skills: ["Kotlin", "Java", "Android SDK", "Material Design", "SQLite", "Jetpack Compose"],
        salary: "₹6-25 LPA",
        growth: "22% growth over next 10 years",
        dailyTasks: [
          "Develop and maintain Android applications",
          "Collaborate with designers to implement UI/UX",
          "Optimize applications for performance and user experience",
          "Debug and resolve application issues",
          "Stay updated with Android platform developments"
        ],
        learningPath: [
          "Java or Kotlin fundamentals",
          "Android Studio and SDK",
          "UI design with Material Design",
          "Database and API integration",
          "App publishing and distribution"
        ],
        certifications: [
          "Google Associate Android Developer",
          "Android Certified Application Developer",
          "Meta Android Developer Professional Certificate"
        ]
      },
      {
        id: "ios",
        title: "iOS Developer",
        description: "Build applications for Apple's iOS platform",
        skills: ["Swift", "Objective-C", "iOS SDK", "UIKit", "SwiftUI", "Core Data"],
        salary: "₹7-30 LPA",
        growth: "22% growth over next 10 years",
        dailyTasks: [
          "Develop and maintain iOS applications",
          "Design and implement new features",
          "Ensure performance, quality, and responsiveness",
          "Identify and fix bugs and performance bottlenecks",
          "Collaborate with cross-functional teams"
        ],
        learningPath: [
          "Swift programming language",
          "iOS SDK and Xcode",
          "UIKit or SwiftUI",
          "App architecture patterns",
          "App Store submission process"
        ],
        certifications: [
          "App Development with Swift Certification",
          "iOS App Development Professional Certificate",
          "Certified iOS Developer"
        ]
      },
      {
        id: "cross-platform",
        title: "Cross-Platform Developer",
        description: "Create mobile applications that work across multiple platforms",
        skills: ["React Native", "Flutter", "JavaScript", "Dart", "Mobile UI Design", "Native APIs"],
        salary: "₹6-28 LPA",
        growth: "24% growth over next 10 years",
        dailyTasks: [
          "Build applications that work on both iOS and Android",
          "Optimize code for performance across platforms",
          "Integrate with native device features",
          "Troubleshoot platform-specific issues",
          "Maintain consistent UI/UX across different devices"
        ],
        learningPath: [
          "JavaScript or Dart fundamentals",
          "React Native or Flutter framework",
          "Mobile UI/UX principles",
          "Native module integration",
          "Cross-platform testing"
        ],
        certifications: [
          "Meta React Native Specialization",
          "Flutter Developer Certification",
          "Certified Cross-Platform App Developer"
        ]
      }
    ]
  },
  {
    id: "design",
    name: "Design & UX",
    description: "Create beautiful, user-friendly interfaces and experiences",
    icon: <PenTool className="h-6 w-6" />,
    careers: [
      {
        id: "ui-designer",
        title: "UI Designer",
        description: "Design visually appealing interfaces for applications and websites",
        skills: ["Figma", "Adobe XD", "Visual Design", "Typography", "Color Theory", "Prototyping"],
        salary: "₹4-20 LPA",
        growth: "15% growth over next 10 years",
        dailyTasks: [
          "Create visually appealing interface designs",
          "Design consistent visual elements and components",
          "Create mockups and prototypes",
          "Work with developers to implement designs",
          "Maintain design systems and documentation"
        ],
        learningPath: [
          "Visual design fundamentals",
          "UI design tools (Figma, XD)",
          "Design systems and components",
          "Prototyping techniques",
          "Responsive design principles"
        ],
        certifications: [
          "Google UX Design Professional Certificate",
          "Certified UI Designer",
          "Adobe XD Certification"
        ]
      },
      {
        id: "ux-designer",
        title: "UX Designer",
        description: "Create meaningful and relevant experiences for users",
        skills: ["User Research", "Wireframing", "Prototyping", "Usability Testing", "Information Architecture", "Figma"],
        salary: "₹5-25 LPA",
        growth: "18% growth over next 10 years",
        dailyTasks: [
          "Conduct user research and interviews",
          "Create user flows and wireframes",
          "Build interactive prototypes",
          "Run usability tests and gather feedback",
          "Collaborate with stakeholders to define requirements"
        ],
        learningPath: [
          "User research methods",
          "Wireframing and prototyping",
          "Information architecture",
          "Usability testing",
          "Interaction design patterns"
        ],
        certifications: [
          "Nielsen Norman Group UX Certification",
          "Meta UX Designer Professional Certificate",
          "Certified Usability Analyst"
        ]
      },
      {
        id: "product-designer",
        title: "Product Designer",
        description: "Combine UI/UX skills with product thinking to create user-centered products",
        skills: ["UI Design", "UX Research", "Product Thinking", "Prototyping", "Design Systems", "User Testing"],
        salary: "₹8-35 LPA",
        growth: "19% growth over next 10 years",
        dailyTasks: [
          "Define product requirements and user needs",
          "Create end-to-end design solutions",
          "Test and iterate on designs based on user feedback",
          "Collaborate with product managers and engineers",
          "Define and maintain product design systems"
        ],
        learningPath: [
          "UI and UX fundamentals",
          "Product strategy and thinking",
          "Design leadership principles",
          "Design systems creation",
          "Data-informed design decisions"
        ],
        certifications: [
          "Professional Certificate in Product Design",
          "Certified Digital Product Designer",
          "Strategic Product Design Certification"
        ]
      }
    ]
  },
  {
    id: "devops",
    name: "DevOps & Cloud",
    description: "Automate and optimize infrastructure and deployment processes",
    icon: <ServerIcon className="h-6 w-6" />,
    careers: [
      {
        id: "devops-engineer",
        title: "DevOps Engineer",
        description: "Bridge the gap between development and operations teams",
        skills: ["Linux", "Docker", "Kubernetes", "CI/CD", "Infrastructure as Code", "Monitoring Tools"],
        salary: "₹8-30 LPA",
        growth: "22% growth over next 10 years",
        dailyTasks: [
          "Implement and maintain CI/CD pipelines",
          "Automate infrastructure and deployment processes",
          "Monitor system performance and troubleshoot issues",
          "Manage cloud resources and infrastructure",
          "Collaborate with development teams on deployment strategies"
        ],
        learningPath: [
          "Linux systems administration",
          "Containerization with Docker",
          "Infrastructure as code (Terraform, Ansible)",
          "CI/CD pipelines",
          "Cloud platforms (AWS, Azure, GCP)"
        ],
        certifications: [
          "AWS DevOps Engineer Professional",
          "Google Professional DevOps Engineer",
          "Microsoft Certified: DevOps Engineer"
        ]
      },
      {
        id: "cloud-engineer",
        title: "Cloud Engineer",
        description: "Design, implement and manage cloud-based solutions",
        skills: ["AWS/Azure/GCP", "Infrastructure as Code", "Cloud Architecture", "Networking", "Security"],
        salary: "₹7-28 LPA",
        growth: "15% growth over next 10 years",
        dailyTasks: [
          "Design and implement cloud infrastructure",
          "Optimize cloud resources for cost and performance",
          "Implement security best practices in cloud environments",
          "Automate cloud deployments and management",
          "Troubleshoot cloud service issues"
        ],
        learningPath: [
          "Cloud platform fundamentals (AWS, Azure, GCP)",
          "Cloud architecture principles",
          "Infrastructure as code",
          "Cloud security best practices",
          "Cost optimization strategies"
        ],
        certifications: [
          "AWS Certified Solutions Architect",
          "Microsoft Azure Solutions Architect",
          "Google Professional Cloud Architect"
        ]
      },
      {
        id: "site-reliability-engineer",
        title: "Site Reliability Engineer",
        description: "Ensure that large-scale systems are reliable and scalable",
        skills: ["Software Engineering", "Operations", "Automation", "Monitoring", "Incident Response", "Performance Tuning"],
        salary: "₹12-40 LPA",
        growth: "22% growth over next 10 years",
        dailyTasks: [
          "Design and implement automation to prevent outages",
          "Monitor system health and performance",
          "Respond to and resolve production incidents",
          "Design scalable and reliable systems",
          "Implement observability and monitoring solutions"
        ],
        learningPath: [
          "Software engineering fundamentals",
          "Systems design and architecture",
          "Monitoring and observability",
          "Incident response procedures",
          "Performance engineering"
        ],
        certifications: [
          "Site Reliability Engineering (SRE) Certification",
          "Google Cloud Professional SRE",
          "Certified Reliability Engineer"
        ]
      }
    ]
  },
  {
    id: "product",
    name: "Product & Management",
    description: "Lead teams and build product strategies",
    icon: <LayoutDashboard className="h-6 w-6" />,
    careers: [
      {
        id: "product-manager",
        title: "Product Manager",
        description: "Define product vision and work with teams to deliver successful products",
        skills: ["Product Strategy", "User Research", "Roadmapping", "Analytics", "Agile/Scrum", "Stakeholder Communication"],
        salary: "₹10-40 LPA",
        growth: "10% growth over next 10 years",
        dailyTasks: [
          "Define product strategy and roadmap",
          "Gather and prioritize product requirements",
          "Work with cross-functional teams to deliver features",
          "Analyze market trends and competitive landscape",
          "Make data-driven decisions based on metrics"
        ],
        learningPath: [
          "Product strategy fundamentals",
          "User research and personas",
          "Agile and product development methodologies",
          "Analytics and data-driven decision making",
          "Stakeholder management"
        ],
        certifications: [
          "Certified Product Manager",
          "Agile Certified Product Manager",
          "Professional Scrum Product Owner"
        ]
      },
      {
        id: "technical-project-manager",
        title: "Technical Project Manager",
        description: "Lead technical projects and ensure successful delivery",
        skills: ["Project Management", "Technical Knowledge", "Agile/Scrum", "Risk Management", "Budget Planning", "Team Leadership"],
        salary: "₹8-35 LPA",
        growth: "8% growth over next 10 years",
        dailyTasks: [
          "Plan and execute technology projects",
          "Manage scope, schedule, and resources",
          "Facilitate team communication and remove blockers",
          "Track project progress and report to stakeholders",
          "Identify and mitigate risks throughout projects"
        ],
        learningPath: [
          "Project management methodologies",
          "Agile/Scrum frameworks",
          "Technical knowledge fundamentals",
          "Risk management techniques",
          "Team leadership skills"
        ],
        certifications: [
          "Project Management Professional (PMP)",
          "Certified ScrumMaster (CSM)",
          "PRINCE2 Certification"
        ]
      },
      {
        id: "engineering-manager",
        title: "Engineering Manager",
        description: "Lead a team of engineers and ensure successful product development",
        skills: ["Technical Leadership", "People Management", "Software Development", "Project Management", "Communication", "Mentoring"],
        salary: "₹18-50 LPA",
        growth: "9% growth over next 10 years",
        dailyTasks: [
          "Lead and mentor a team of engineers",
          "Balance technical decisions with project timelines",
          "Conduct performance evaluations and provide feedback",
          "Work with product managers on roadmap planning",
          "Ensure software quality and best practices"
        ],
        learningPath: [
          "Software engineering fundamentals",
          "People management skills",
          "Project management principles",
          "Technical architecture and design",
          "Agile team leadership"
        ],
        certifications: [
          "Certified Engineering Manager",
          "Certified Software Development Manager",
          "Leadership in Engineering Management"
        ]
      }
    ]
  }
];

export default function CareerGuide() {
  const { toast } = useToast();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCareerId, setSelectedCareerId] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState("web");
  const [showPathFinder, setShowPathFinder] = useState(false);

  // Get the currently selected category
  const selectedCategory = careerCategories.find(category => category.id === selectedCategoryId);
  
  // Filter careers by search term
  const filteredCareers = selectedCategory ? selectedCategory.careers.filter(
    career => career.title.toLowerCase().includes(searchTerm.toLowerCase())
  ) : [];

  // Get the selected career
  const selectedCareer = selectedCategory?.careers.find(career => career.id === selectedCareerId);

  // When a category is selected, reset the career selection to the first one
  useEffect(() => {
    if (selectedCategory && selectedCategory.careers.length > 0) {
      setSelectedCareerId(selectedCategory.careers[0].id);
    }
  }, [selectedCategoryId]);

  // Handle search input changes
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // Toggle PathFinder visibility
  const togglePathFinder = () => {
    setShowPathFinder(!showPathFinder);
  };

  return (
    <div className="w-full p-6 pb-16">
      <header className="mb-8">
        <h1 className="text-3xl font-bold">Career Guide</h1>
        <p className="text-gray-600 mt-2">
          Explore tech career paths or get personalized recommendations with our AI career advisor
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Left sidebar for career exploration */}
        <div className="md:col-span-3">
          <Tabs defaultValue="explore" className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="explore" className="flex items-center">
                <Search className="h-4 w-4 mr-2" />
                Explore Careers
              </TabsTrigger>
              <TabsTrigger value="pathfinder" className="flex items-center" onClick={togglePathFinder}>
                <Brain className="h-4 w-4 mr-2" />
                AI Career Advisor
              </TabsTrigger>
            </TabsList>

            <TabsContent value="explore" className="mt-0">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                {/* Category cards */}
                {careerCategories.map((category) => (
                  <Card 
                    key={category.id} 
                    className={`cursor-pointer transition-colors hover:border-primary/50 ${
                      selectedCategoryId === category.id ? 'border-primary bg-primary/5' : ''
                    }`}
                    onClick={() => setSelectedCategoryId(category.id)}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-md ${
                          selectedCategoryId === category.id ? 'bg-primary text-white' : 'bg-muted'
                        }`}>
                          {category.icon}
                        </div>
                        <CardTitle>{category.name}</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <CardDescription>{category.description}</CardDescription>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {selectedCategory && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Career selection sidebar */}
                  <div className="lg:col-span-1">
                    <div className="mb-4">
                      <Input
                        placeholder="Search careers..."
                        value={searchTerm}
                        onChange={handleSearchChange}
                        className="w-full"
                      />
                    </div>
                    <div className="space-y-2">
                      {filteredCareers.map((career) => (
                        <div
                          key={career.id}
                          className={`p-3 rounded-md cursor-pointer transition-all ${
                            selectedCareerId === career.id
                              ? "bg-primary text-white"
                              : "hover:bg-gray-100"
                          }`}
                          onClick={() => setSelectedCareerId(career.id)}
                        >
                          <h3 className="font-medium">{career.title}</h3>
                          <p className={`text-sm truncate ${
                            selectedCareerId === career.id ? "text-white/80" : "text-gray-500"
                          }`}>
                            {career.description}
                          </p>
                        </div>
                      ))}
                      {filteredCareers.length === 0 && (
                        <div className="p-4 text-center text-gray-500">
                          No careers found matching "{searchTerm}"
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Career detail view */}
                  <div className="lg:col-span-2">
                    {selectedCareer ? (
                      <Card className="border border-gray-200">
                        <CardHeader className="pb-3">
                          <div className="flex justify-between items-start">
                            <div>
                              <CardTitle className="text-2xl">{selectedCareer.title}</CardTitle>
                              <CardDescription className="mt-1">
                                {selectedCareer.description}
                              </CardDescription>
                            </div>
                            <Button
                              size="sm"
                              className="flex items-center"
                              onClick={togglePathFinder}
                            >
                              <Lightbulb className="h-4 w-4 mr-2" />
                              Get Personalized Advice
                            </Button>
                          </div>
                        </CardHeader>
                        <CardContent className="pb-6">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                            <div className="p-4 bg-primary/5 rounded-lg">
                              <h3 className="font-semibold text-sm text-gray-500 mb-1">Salary Range (India)</h3>
                              <p className="text-lg font-bold">{selectedCareer.salary}</p>
                            </div>
                            <div className="p-4 bg-green-50 rounded-lg">
                              <h3 className="font-semibold text-sm text-gray-500 mb-1">Job Growth</h3>
                              <p className="text-lg font-bold text-green-600 flex items-center">
                                <BarChart className="h-4 w-4 mr-1" />
                                {selectedCareer.growth}
                              </p>
                            </div>
                          </div>

                          <div className="mb-6">
                            <h3 className="font-semibold mb-3 flex items-center">
                              <Lightbulb className="h-4 w-4 mr-2 text-yellow-500" />
                              Key Skills Required
                            </h3>
                            <div className="flex flex-wrap gap-2">
                              {selectedCareer.skills.map((skill) => (
                                <Badge key={skill} variant="secondary">
                                  {skill}
                                </Badge>
                              ))}
                            </div>
                          </div>

                          <Separator className="my-6" />

                          <div className="mb-6">
                            <h3 className="font-semibold mb-3">Typical Daily Tasks</h3>
                            <ul className="space-y-2">
                              {selectedCareer.dailyTasks.map((task, index) => (
                                <li key={index} className="flex items-start">
                                  <span className="h-5 w-5 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs mr-3 mt-0.5">
                                    {index + 1}
                                  </span>
                                  <span>{task}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          <Separator className="my-6" />

                          <div className="mb-6">
                            <h3 className="font-semibold mb-3 flex items-center">
                              <RefreshCw className="h-4 w-4 mr-2 text-primary" />
                              Learning Path
                            </h3>
                            <div className="relative pl-6 border-l-2 border-dashed border-gray-200">
                              {selectedCareer.learningPath.map((step, index) => (
                                <div key={index} className="mb-4 relative">
                                  <div className="absolute -left-[9px] h-4 w-4 bg-white border-2 border-primary rounded-full" />
                                  <p className="pl-2">{step}</p>
                                </div>
                              ))}
                            </div>
                          </div>

                          <Separator className="my-6" />

                          <div>
                            <h3 className="font-semibold mb-3">Recommended Certifications</h3>
                            <ul className="space-y-2">
                              {selectedCareer.certifications.map((cert, index) => (
                                <li key={index} className="flex items-center">
                                  <BookOpen className="h-4 w-4 text-primary mr-2" />
                                  <span>{cert}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          <div className="mt-8 text-center">
                            <Button className="w-full max-w-xs">
                              Explore Courses for this Career
                              <ChevronRight className="h-4 w-4 ml-2" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full p-10 text-center">
                        <p className="text-gray-500">Select a career to view details</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="pathfinder" className="mt-0">
              {showPathFinder && <PathFinder />}
            </TabsContent>
          </Tabs>
        </div>

        {/* Right sidebar */}
        <div className="col-span-1">
          <div className="sticky top-24">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center">
                  <Brain className="h-5 w-5 mr-2 text-primary" />
                  Career Resources
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Button variant="outline" className="w-full justify-start" onClick={togglePathFinder}>
                    <Lightbulb className="h-4 w-4 mr-2 text-yellow-500" />
                    Get AI career advice
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <UsersRound className="h-4 w-4 mr-2 text-blue-500" />
                    Connect with mentors
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <ArrowRight className="h-4 w-4 mr-2 text-green-500" />
                    Take skills assessment
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="mt-6">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Career Stats</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Career Paths Explored</span>
                    <span className="font-medium">12</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Skill Match Score</span>
                    <span className="font-medium">76%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Recommended Courses</span>
                    <span className="font-medium">24</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}