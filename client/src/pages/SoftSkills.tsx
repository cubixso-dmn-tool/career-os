import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSidebar } from "@/hooks/use-sidebar";
import Sidebar from "@/components/layout/Sidebar";
import MobileHeader from "@/components/ui/mobile-header";
import MobileNavigation from "@/components/layout/MobileNavigation";
import MobileSidebar from "@/components/layout/MobileSidebar";
import SoftSkillModule from "@/components/softskills/SoftSkillModule";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UserCheck, Search, BookOpen, MessagesSquare, Clock, BriefcaseBusiness, Users, Brain, Loader2 } from "lucide-react";

// Mock user ID until authentication is implemented
const USER_ID = 1;

// Mock soft skills data until backend is implemented
const mockSoftSkills = [
  {
    id: 1,
    title: "Effective Communication",
    description: "Learn to express your ideas clearly and confidently in speech and writing.",
    type: "communication",
    content: JSON.stringify({
      overview: "<p>Communication is one of the most important skills for professional success. This module covers verbal, written, and non-verbal communication skills essential for the workplace.</p>",
      learningObjectives: [
        "Master the art of clear and concise communication",
        "Learn techniques for active listening",
        "Understand non-verbal communication cues",
        "Develop email and business writing skills",
        "Practice public speaking and presentation skills"
      ],
      materials: [
        {
          type: "video",
          title: "The Power of Effective Communication",
          description: "An introduction to communication fundamentals",
          duration: "15 minutes"
        },
        {
          type: "document",
          title: "Communication Techniques Guide",
          description: "Comprehensive guide with examples and exercises"
        }
      ],
      exercises: [
        {
          title: "Active Listening Exercise",
          description: "Practice active listening techniques with a partner or team member"
        },
        {
          title: "Email Writing Challenge",
          description: "Write clear and professional emails for different scenarios"
        }
      ],
      quiz: [
        {
          question: "Which of the following is NOT an element of effective communication?",
          options: [
            "Active listening",
            "Clear messaging",
            "Interrupting to make your point",
            "Non-verbal cues"
          ]
        },
        {
          question: "What percentage of communication is non-verbal according to research?",
          options: [
            "10-20%",
            "30-40%",
            "55-70%",
            "80-90%"
          ]
        }
      ]
    })
  },
  {
    id: 2,
    title: "Technical Interview Preparation",
    description: "Master strategies for technical interviews in the IT industry.",
    type: "interview",
    content: JSON.stringify({
      overview: "<p>Technical interviews are challenging and require specific preparation. This module will help you understand the format, common questions, and effective strategies for success.</p>",
      learningObjectives: [
        "Understand different types of technical interviews",
        "Learn how to approach coding problems methodically",
        "Master common data structures and algorithms",
        "Practice explaining your thought process clearly",
        "Develop strategies for handling stress during interviews"
      ],
      materials: [
        {
          type: "video",
          title: "Anatomy of a Technical Interview",
          description: "Overview of what to expect in different tech companies",
          duration: "20 minutes"
        },
        {
          type: "document",
          title: "100 Common Technical Interview Questions",
          description: "Compilation of frequently asked questions with approach strategies"
        }
      ],
      exercises: [
        {
          title: "Algorithm Challenge",
          description: "Solve a series of algorithmic problems with time constraints"
        },
        {
          title: "Mock Interview Session",
          description: "Participate in a simulated technical interview with feedback"
        }
      ],
      quiz: [
        {
          question: "What should you do if you don't know the answer to a technical question?",
          options: [
            "Make up an answer to appear knowledgeable",
            "Say you don't know and move on",
            "Talk through your thought process and approach",
            "Ask to skip the question"
          ]
        },
        {
          question: "Which of these is NOT a common type of technical interview?",
          options: [
            "Coding challenge",
            "System design interview",
            "Behavioral interview",
            "Personality assessment"
          ]
        }
      ]
    })
  },
  {
    id: 3,
    title: "Time Management & Productivity",
    description: "Learn techniques to organize your work and maximize efficiency.",
    type: "time-management",
    content: JSON.stringify({
      overview: "<p>Effective time management is essential for career success. This module covers practical strategies to prioritize tasks, avoid procrastination, and increase your overall productivity.</p>",
      learningObjectives: [
        "Learn to prioritize tasks effectively using proven frameworks",
        "Develop strategies to overcome procrastination",
        "Master planning techniques for short and long-term goals",
        "Create productive work routines and habits",
        "Understand how to manage energy, not just time"
      ],
      materials: [
        {
          type: "video",
          title: "The Pomodoro Technique Explained",
          description: "How to use time blocking for maximum focus",
          duration: "12 minutes"
        },
        {
          type: "document",
          title: "Time Management for Students and Professionals",
          description: "Comprehensive guide with practical exercises"
        }
      ],
      exercises: [
        {
          title: "Weekly Planning Session",
          description: "Create a structured plan for your upcoming week"
        },
        {
          title: "Distraction Audit",
          description: "Track and analyze what disrupts your focus throughout the day"
        }
      ],
      quiz: [
        {
          question: "Which of these is a core principle of the Eisenhower Matrix?",
          options: [
            "Doing the most difficult tasks first thing in the morning",
            "Distinguishing between urgent and important tasks",
            "Working in 25-minute intervals with breaks",
            "Setting SMART goals for all activities"
          ]
        },
        {
          question: "What is 'time blocking'?",
          options: [
            "Preventing yourself from checking email at certain times",
            "Dedicating specific time periods to specific tasks or categories of work",
            "Taking regular breaks throughout the day",
            "Delegating tasks to free up your schedule"
          ]
        }
      ]
    })
  },
  {
    id: 4,
    title: "Leadership & Team Dynamics",
    description: "Develop skills to lead teams and navigate group dynamics effectively.",
    type: "leadership",
    content: JSON.stringify({
      overview: "<p>Leadership skills are valuable at every career stage. This module covers fundamental principles of leadership, team dynamics, and how to influence without authority.</p>",
      learningObjectives: [
        "Understand different leadership styles and when to apply them",
        "Learn techniques for effective team collaboration",
        "Develop conflict resolution strategies",
        "Master delegation and feedback skills",
        "Build emotional intelligence for better team relationships"
      ],
      materials: [
        {
          type: "video",
          title: "Leadership Fundamentals",
          description: "Introduction to core leadership principles",
          duration: "25 minutes"
        },
        {
          type: "document",
          title: "Team Dynamics Handbook",
          description: "Guide to understanding and improving group performance"
        }
      ],
      exercises: [
        {
          title: "Leadership Style Assessment",
          description: "Identify your natural leadership approach and areas for growth"
        },
        {
          title: "Difficult Conversations Role Play",
          description: "Practice handling challenging team situations"
        }
      ],
      quiz: [
        {
          question: "Which leadership style is characterized by involving team members in decision-making?",
          options: [
            "Autocratic leadership",
            "Transformational leadership",
            "Democratic leadership",
            "Laissez-faire leadership"
          ]
        },
        {
          question: "What is the primary purpose of constructive feedback?",
          options: [
            "To point out mistakes",
            "To maintain authority",
            "To improve performance and growth",
            "To document performance issues"
          ]
        }
      ]
    })
  }
];

interface SoftSkillsProps {}

export default function SoftSkills({}: SoftSkillsProps) {
  const { isSidebarOpen, closeSidebar } = useSidebar();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [selectedSkillId, setSelectedSkillId] = useState<number | null>(null);

  // Fetch user data
  const { data: userData, isLoading: loadingUser } = useQuery({
    queryKey: [`/api/users/${USER_ID}`],
    queryFn: undefined, // Use default queryFn from queryClient
  });

  // Fetch soft skills
  const { data: softSkills = mockSoftSkills, isLoading: loadingSoftSkills } = useQuery({
    queryKey: ['/api/soft-skills', { type: selectedType }],
    queryFn: undefined, // Use default queryFn from queryClient
  });

  // Fetch user's soft skills progress
  const { data: userSoftSkills = [], isLoading: loadingUserSoftSkills } = useQuery({
    queryKey: [`/api/users/${USER_ID}/user-soft-skills`],
    queryFn: undefined, // Use default queryFn from queryClient
  });

  // Close sidebar when navigating to this page
  useEffect(() => {
    closeSidebar();
  }, [closeSidebar]);

  // Filter soft skills based on search term
  const filteredSoftSkills = softSkills.filter((skill: any) => 
    skill.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    skill.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Get selected soft skill
  const selectedSkill = selectedSkillId 
    ? softSkills.find((skill: any) => skill.id === selectedSkillId) 
    : null;

  // Get user progress for selected skill
  const userProgressForSelectedSkill = selectedSkillId 
    ? userSoftSkills.find((userSkill: any) => userSkill.softSkillId === selectedSkillId)
    : null;

  const isLoading = loadingUser || loadingSoftSkills || loadingUserSoftSkills;

  // Get icon for skill type
  const getSkillTypeIcon = (type: string) => {
    switch (type) {
      case 'communication':
        return <MessagesSquare className="h-5 w-5 text-blue-500" />;
      case 'interview':
        return <BriefcaseBusiness className="h-5 w-5 text-green-500" />;
      case 'leadership':
        return <Users className="h-5 w-5 text-purple-500" />;
      case 'time-management':
        return <Clock className="h-5 w-5 text-amber-500" />;
      default:
        return <Brain className="h-5 w-5 text-gray-500" />;
    }
  };

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
            <UserCheck className="h-6 w-6 mr-2 text-primary" />
            <h1 className="text-2xl font-bold text-gray-900">Soft Skills Development</h1>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Skill Browser (1/3 width on desktop) */}
            <div className={`${selectedSkillId ? 'hidden md:block' : ''}`}>
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle>Browse Skills</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Search & Filter */}
                  <div className="space-y-3">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                      <Input
                        placeholder="Search skills..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-9"
                      />
                    </div>
                    <Select value={selectedType || ""} onValueChange={(value) => setSelectedType(value || null)}>
                      <SelectTrigger>
                        <SelectValue placeholder="All Skill Types" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Skill Types</SelectItem>
                        <SelectItem value="communication">Communication</SelectItem>
                        <SelectItem value="interview">Interview Prep</SelectItem>
                        <SelectItem value="leadership">Leadership</SelectItem>
                        <SelectItem value="time-management">Time Management</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Skills List */}
                  {isLoading ? (
                    <div className="space-y-3">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="bg-gray-100 animate-pulse rounded-lg h-24"></div>
                      ))}
                    </div>
                  ) : filteredSoftSkills.length === 0 ? (
                    <div className="text-center py-8">
                      <BookOpen className="h-10 w-10 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-600">No skills found matching your search.</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {filteredSoftSkills.map((skill: any) => {
                        const userProgress = userSoftSkills.find((us: any) => us.softSkillId === skill.id);
                        
                        return (
                          <div 
                            key={skill.id}
                            className={`p-4 border rounded-lg hover:border-primary hover:shadow-sm cursor-pointer transition-all ${
                              selectedSkillId === skill.id ? 'border-primary bg-indigo-50' : ''
                            }`}
                            onClick={() => setSelectedSkillId(skill.id)}
                          >
                            <div className="flex justify-between items-start mb-2">
                              <div className="flex items-center">
                                {getSkillTypeIcon(skill.type)}
                                <h3 className="font-medium ml-2">{skill.title}</h3>
                              </div>
                              {userProgress && (
                                <Badge 
                                  variant={userProgress.isCompleted ? "secondary" : "outline"}
                                  className={userProgress.isCompleted ? "bg-green-100 text-green-800" : ""}
                                >
                                  {userProgress.isCompleted ? 'Completed' : `${userProgress.progress}%`}
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-gray-600">{skill.description}</p>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Skill Module (2/3 width on desktop, full width on mobile when a skill is selected) */}
            <div className={`${selectedSkillId ? 'md:col-span-2' : 'hidden md:block md:col-span-2'}`}>
              {selectedSkill ? (
                <SoftSkillModule 
                  softSkill={selectedSkill} 
                  userSoftSkill={userProgressForSelectedSkill}
                  userId={USER_ID}
                />
              ) : (
                <Card className="h-full flex flex-col justify-center items-center p-8 text-center">
                  <BookOpen className="h-16 w-16 text-gray-300 mb-4" />
                  <h2 className="text-xl font-medium text-gray-800 mb-2">Select a Skill to Begin</h2>
                  <p className="text-gray-600 max-w-md mb-6">
                    Choose a soft skill module from the list to start learning. Each module includes lessons, exercises, and assessments.
                  </p>
                  <div className="grid grid-cols-2 gap-4 w-full max-w-md">
                    <div className="border rounded-lg p-4 text-center">
                      <MessagesSquare className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                      <p className="font-medium">Communication</p>
                    </div>
                    <div className="border rounded-lg p-4 text-center">
                      <BriefcaseBusiness className="h-8 w-8 text-green-500 mx-auto mb-2" />
                      <p className="font-medium">Interview Prep</p>
                    </div>
                    <div className="border rounded-lg p-4 text-center">
                      <Users className="h-8 w-8 text-purple-500 mx-auto mb-2" />
                      <p className="font-medium">Leadership</p>
                    </div>
                    <div className="border rounded-lg p-4 text-center">
                      <Clock className="h-8 w-8 text-amber-500 mx-auto mb-2" />
                      <p className="font-medium">Time Management</p>
                    </div>
                  </div>
                </Card>
              )}
              
              {/* Mobile back button */}
              {selectedSkillId && (
                <div className="mt-4 md:hidden">
                  <Button variant="outline" onClick={() => setSelectedSkillId(null)}>
                    Back to Skill List
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Mobile Navigation */}
      <MobileNavigation />
    </div>
  );
}
