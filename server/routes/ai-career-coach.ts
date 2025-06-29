import { Router } from "express";
import { z } from "zod";
import { 
  getCareerCoachResponse,
  generateMockInterviewQuestions,
  analyzeResumeWithAI,
  generatePersonalizedLearningPath,
  type CareerCoachRequest,
  type MockInterviewRequest,
  type ResumeAnalysisRequest,
  type LearningPathRequest
} from "../services/openai.js";

const router = Router();

// Validation schemas
const careerCoachRequestSchema = z.object({
  message: z.string().min(1, "Message cannot be empty"),
  conversationHistory: z.array(z.object({
    role: z.enum(['user', 'assistant']),
    content: z.string()
  })).optional(),
  coachingType: z.enum(['general', 'interview', 'resume', 'learning_path']),
  userProfile: z.object({
    currentRole: z.string().optional(),
    experience: z.string().optional(),
    skills: z.array(z.string()).optional(),
    goals: z.array(z.string()).optional(),
    education: z.string().optional(),
    location: z.string().optional()
  }).optional(),
  contextData: z.any().optional()
});

const mockInterviewRequestSchema = z.object({
  role: z.string().min(1, "Role is required"),
  experience: z.string().min(1, "Experience level is required"),
  interviewType: z.enum(['technical', 'behavioral', 'system_design', 'hr']),
  difficulty: z.enum(['beginner', 'intermediate', 'advanced']),
  companyType: z.string().optional(),
  previousQuestions: z.array(z.string()).optional()
});

const resumeAnalysisRequestSchema = z.object({
  resumeText: z.string().min(50, "Resume text must be at least 50 characters"),
  targetRole: z.string().optional(),
  targetCompany: z.string().optional(),
  jobDescription: z.string().optional()
});

const learningPathRequestSchema = z.object({
  currentSkills: z.array(z.string()).min(1, "At least one current skill required"),
  targetRole: z.string().min(1, "Target role is required"),
  timeframe: z.string().min(1, "Timeframe is required"),
  learningStyle: z.enum(['visual', 'hands-on', 'theoretical', 'mixed']),
  experience: z.string().min(1, "Experience level is required")
});

/**
 * General AI Career Coach Chat
 * POST /api/ai-career-coach/chat
 */
router.post("/chat", async (req, res) => {
  try {
    const validatedData = careerCoachRequestSchema.parse(req.body);
    
    // Add user ID if authenticated
    const userId = req.user ? (req.user as any).id : undefined;
    
    const coachRequest: CareerCoachRequest = {
      ...validatedData,
      userId
    };

    const response = await getCareerCoachResponse(coachRequest);
    
    res.json({ 
      success: true,
      response,
      coachingType: validatedData.coachingType
    });
  } catch (error: any) {
    console.error("AI Career Coach error:", error);
    
    if (error.name === 'ZodError') {
      return res.status(400).json({
        success: false,
        message: "Invalid request data",
        errors: error.errors
      });
    }
    
    res.status(500).json({
      success: false,
      message: "Failed to get career coaching response",
      error: error.message
    });
  }
});

/**
 * Generate Mock Interview Questions
 * POST /api/ai-career-coach/mock-interview
 */
router.post("/mock-interview", async (req, res) => {
  try {
    const validatedData = mockInterviewRequestSchema.parse(req.body);
    
    const interviewRequest: MockInterviewRequest = validatedData;
    const questions = await generateMockInterviewQuestions(interviewRequest);
    
    res.json({
      success: true,
      questions,
      sessionInfo: {
        role: validatedData.role,
        type: validatedData.interviewType,
        difficulty: validatedData.difficulty,
        questionCount: questions.length
      }
    });
  } catch (error: any) {
    console.error("Mock interview generation error:", error);
    
    if (error.name === 'ZodError') {
      return res.status(400).json({
        success: false,
        message: "Invalid request data",
        errors: error.errors
      });
    }
    
    res.status(500).json({
      success: false,
      message: "Failed to generate mock interview questions",
      error: error.message
    });
  }
});

/**
 * Analyze Resume with AI
 * POST /api/ai-career-coach/analyze-resume
 */
router.post("/analyze-resume", async (req, res) => {
  try {
    const validatedData = resumeAnalysisRequestSchema.parse(req.body);
    
    const analysisRequest: ResumeAnalysisRequest = validatedData;
    const analysis = await analyzeResumeWithAI(analysisRequest);
    
    res.json({
      success: true,
      analysis,
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    console.error("Resume analysis error:", error);
    
    if (error.name === 'ZodError') {
      return res.status(400).json({
        success: false,
        message: "Invalid request data",
        errors: error.errors
      });
    }
    
    res.status(500).json({
      success: false,
      message: "Failed to analyze resume",
      error: error.message
    });
  }
});

/**
 * Generate Personalized Learning Path
 * POST /api/ai-career-coach/learning-path
 */
router.post("/learning-path", async (req, res) => {
  try {
    const validatedData = learningPathRequestSchema.parse(req.body);
    
    const learningRequest: LearningPathRequest = validatedData;
    const learningPath = await generatePersonalizedLearningPath(learningRequest);
    
    res.json({
      success: true,
      learningPath,
      generatedAt: new Date().toISOString(),
      profile: {
        targetRole: validatedData.targetRole,
        timeframe: validatedData.timeframe,
        currentSkillCount: validatedData.currentSkills.length
      }
    });
  } catch (error: any) {
    console.error("Learning path generation error:", error);
    
    if (error.name === 'ZodError') {
      return res.status(400).json({
        success: false,
        message: "Invalid request data",
        errors: error.errors
      });
    }
    
    res.status(500).json({
      success: false,
      message: "Failed to generate learning path",
      error: error.message
    });
  }
});

/**
 * Get AI Career Coach Features Info
 * GET /api/ai-career-coach/features
 */
router.get("/features", (req, res) => {
  res.json({
    success: true,
    features: {
      generalCoaching: {
        name: "General Career Coaching",
        description: "Comprehensive career guidance and advice",
        capabilities: [
          "Career path exploration",
          "Skills development advice", 
          "Industry insights",
          "Salary expectations",
          "Work-life balance guidance"
        ]
      },
      interviewCoaching: {
        name: "Interview Preparation",
        description: "AI-powered interview practice and preparation",
        capabilities: [
          "Mock interview questions",
          "Technical interview prep",
          "Behavioral interview strategies", 
          "Company-specific insights",
          "Salary negotiation tips"
        ]
      },
      resumeOptimization: {
        name: "Resume Analysis & Optimization",
        description: "AI-powered resume analysis and improvement suggestions",
        capabilities: [
          "Resume scoring and analysis",
          "ATS compatibility check",
          "Keyword optimization",
          "Section-wise improvements",
          "Industry-specific customization"
        ]
      },
      learningPath: {
        name: "Personalized Learning Paths",
        description: "Custom learning roadmaps based on career goals",
        capabilities: [
          "Skill gap analysis",
          "Milestone-based progression",
          "Resource recommendations",
          "Certification guidance",
          "Portfolio building strategies"
        ]
      }
    },
    supportedRoles: [
      "Software Engineer",
      "Data Scientist", 
      "Product Manager",
      "UI/UX Designer",
      "DevOps Engineer",
      "Business Analyst",
      "Digital Marketer",
      "Content Creator",
      "And many more..."
    ],
    interviewTypes: ["technical", "behavioral", "system_design", "hr"],
    difficulties: ["beginner", "intermediate", "advanced"],
    learningStyles: ["visual", "hands-on", "theoretical", "mixed"]
  });
});

/**
 * Career Assessment Analysis
 * POST /api/ai-career-coach/analyze
 */
router.post("/analyze", async (req, res) => {
  try {
    const { message, context } = req.body;
    
    if (!message) {
      return res.status(400).json({
        success: false,
        message: "Message is required"
      });
    }

    let recommendations = [];
    
    try {
      // Try to use AI for analysis
      const response = await getCareerCoachResponse({
        message,
        conversationHistory: [],
        coachingType: 'general',
        userProfile: {},
        contextData: { context, task: 'career_assessment_analysis' }
      });

      // Parse the AI response to extract recommendations
      try {
        const jsonMatch = response.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          recommendations = parsed.recommendations || parsed;
        }
      } catch (parseError) {
        throw new Error("Failed to parse AI response");
      }
    } catch (aiError) {
      console.log("AI service unavailable, using intelligent fallback based on assessment responses");
      
      // Analyze user responses to provide personalized recommendations
      const responses = message.toLowerCase();
      
      // Simple analysis based on keywords and patterns
      const techWords = ['programming', 'coding', 'software', 'computer', 'technology', 'technical', 'building'];
      const dataWords = ['data', 'analysis', 'statistics', 'numbers', 'research', 'information'];
      const designWords = ['design', 'creative', 'art', 'visual', 'user', 'interface', 'experience'];
      const businessWords = ['business', 'management', 'leadership', 'strategy', 'communication'];
      
      const isTechOriented = techWords.some(word => responses.includes(word));
      const isDataOriented = dataWords.some(word => responses.includes(word));
      const isDesignOriented = designWords.some(word => responses.includes(word));
      const isBusinessOriented = businessWords.some(word => responses.includes(word));
      
      // Generate personalized recommendations based on detected interests
      if (isTechOriented) {
        recommendations.push({
          title: "Software Developer",
          description: "Build applications and systems that solve real-world problems using programming languages and frameworks",
          match_percentage: 88,
          salary_range: "₹5-30 LPA",
          growth_outlook: "25% growth over next 10 years",
          key_skills: ["Programming Languages", "Problem Solving", "System Design", "Testing"],
          daily_tasks: ["Write and review code", "Debug and fix issues", "Design software solutions", "Collaborate with team"],
          learning_path: ["Programming fundamentals", "Data structures & algorithms", "Framework specialization", "System design"],
          time_to_proficiency: "8-15 months",
          difficulty_level: "Intermediate",
          industry_demand: "High",
          reasons: ["Strong technical interest shown", "Problem-solving mindset", "Enjoys building things"]
        });
      }
      
      if (isDataOriented) {
        recommendations.push({
          title: "Data Analyst",
          description: "Transform raw data into actionable insights that drive business decisions and strategy",
          match_percentage: 85,
          salary_range: "₹5-18 LPA",
          growth_outlook: "22% growth over next 10 years",
          key_skills: ["SQL", "Excel", "Python/R", "Data Visualization", "Statistics"],
          daily_tasks: ["Clean and analyze datasets", "Create reports and dashboards", "Present findings to stakeholders"],
          learning_path: ["SQL and database fundamentals", "Statistical analysis", "Visualization tools", "Business intelligence"],
          time_to_proficiency: "6-12 months",
          difficulty_level: "Beginner",
          industry_demand: "High",
          reasons: ["Strong analytical thinking", "Interest in data and patterns", "Detail-oriented approach"]
        });
      }
      
      if (isDesignOriented) {
        recommendations.push({
          title: "UX/UI Designer",
          description: "Create intuitive and beautiful user experiences that make technology accessible and enjoyable",
          match_percentage: 82,
          salary_range: "₹4-22 LPA",
          growth_outlook: "19% growth over next 10 years",
          key_skills: ["Design Tools", "User Research", "Prototyping", "Visual Design", "Psychology"],
          daily_tasks: ["Research user needs", "Create wireframes and prototypes", "Design user interfaces", "Test usability"],
          learning_path: ["Design fundamentals", "User research methods", "Design tools mastery", "Portfolio building"],
          time_to_proficiency: "8-14 months",
          difficulty_level: "Intermediate",
          industry_demand: "Medium",
          reasons: ["Creative problem-solving approach", "User-centric thinking", "Visual and aesthetic sense"]
        });
      }
      
      // Always include a versatile third option
      if (recommendations.length < 3) {
        recommendations.push({
          title: "Product Manager",
          description: "Bridge technology and business to create products that users love and businesses need",
          match_percentage: 78,
          salary_range: "₹8-35 LPA",
          growth_outlook: "21% growth over next 10 years",
          key_skills: ["Strategic Thinking", "Communication", "Market Research", "Project Management"],
          daily_tasks: ["Define product requirements", "Coordinate with teams", "Analyze market trends", "Make data-driven decisions"],
          learning_path: ["Business fundamentals", "Product management frameworks", "Analytics tools", "Leadership skills"],
          time_to_proficiency: "10-18 months",
          difficulty_level: "Advanced",
          industry_demand: "High",
          reasons: ["Leadership potential", "Strategic thinking", "Cross-functional collaboration skills"]
        });
      }
      
      // Ensure we have exactly 3 recommendations
      if (recommendations.length < 3) {
        const fallbackCareers = [
          {
            title: "Digital Marketing Specialist",
            description: "Help businesses reach and engage customers through digital channels and platforms",
            match_percentage: 75,
            salary_range: "₹3-15 LPA",
            growth_outlook: "18% growth over next 10 years",
            key_skills: ["Digital Marketing", "Analytics", "Content Creation", "Social Media"],
            daily_tasks: ["Create marketing campaigns", "Analyze performance metrics", "Manage social media", "Optimize content"],
            learning_path: ["Marketing fundamentals", "Digital tools mastery", "Analytics certification", "Campaign management"],
            time_to_proficiency: "6-10 months",
            difficulty_level: "Beginner",
            industry_demand: "High",
            reasons: ["Communication skills", "Creative thinking", "Tech-savvy approach"]
          },
          {
            title: "Business Analyst",
            description: "Analyze business processes and recommend improvements to increase efficiency and profitability",
            match_percentage: 72,
            salary_range: "₹4-18 LPA",
            growth_outlook: "17% growth over next 10 years",
            key_skills: ["Analysis", "Process Mapping", "Requirements Gathering", "Documentation"],
            daily_tasks: ["Analyze business processes", "Gather stakeholder requirements", "Create documentation", "Recommend solutions"],
            learning_path: ["Business analysis fundamentals", "Process improvement methodologies", "Tools and software", "Communication skills"],
            time_to_proficiency: "6-12 months",
            difficulty_level: "Intermediate",
            industry_demand: "Medium",
            reasons: ["Analytical mindset", "Problem-solving skills", "Business understanding"]
          }
        ];
        
        while (recommendations.length < 3) {
          recommendations.push(fallbackCareers[recommendations.length - 1] || fallbackCareers[0]);
        }
      }
    }

    res.json({
      success: true,
      recommendations
    });
  } catch (error: any) {
    console.error("Career assessment analysis error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to analyze career assessment",
      error: error.message
    });
  }
});

/**
 * Generate Career Roadmap
 * POST /api/ai-career-coach/roadmap
 */
router.post("/roadmap", async (req, res) => {
  try {
    const { message, career, context } = req.body;
    
    if (!message || !career) {
      return res.status(400).json({
        success: false,
        message: "Message and career are required"
      });
    }

    let roadmap = null;
    
    try {
      // Try to use AI for roadmap generation
      const response = await getCareerCoachResponse({
        message,
        conversationHistory: [],
        coachingType: 'learning_path',
        userProfile: { currentRole: career },
        contextData: { context, task: 'roadmap_generation', career }
      });

      // Parse the AI response to extract roadmap
      try {
        const jsonMatch = response.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          roadmap = JSON.parse(jsonMatch[0]);
        }
      } catch (parseError) {
        throw new Error("Failed to parse AI response");
      }
    } catch (aiError) {
      console.log("AI service unavailable, generating intelligent fallback roadmap for", career);
      
      // Generate career-specific roadmap based on the career title
      const careerLower = career.toLowerCase();
      
      // Determine career category and customize roadmap
      let careerData: {
        overview: string;
        duration: string;
        skills: string[];
        certifications: string[];
        phases: Array<{
          phase: string;
          duration: string;
          description: string;
          milestones: string[];
          resources: string[];
          projects: string[];
        }>;
      } = {
        overview: "",
        duration: "12-18 months",
        skills: [] as string[],
        certifications: [] as string[],
        phases: [] as Array<{
          phase: string;
          duration: string;
          description: string;
          milestones: string[];
          resources: string[];
          projects: string[];
        }>
      };
      
      if (careerLower.includes('developer') || careerLower.includes('software') || careerLower.includes('frontend') || careerLower.includes('backend')) {
        careerData = {
          overview: `This comprehensive roadmap will guide you through becoming a skilled ${career}. You'll master programming fundamentals, build real projects, and develop the technical expertise needed to excel in software development.`,
          duration: "12-18 months",
          skills: ["Programming Languages", "Problem Solving", "Version Control", "Testing", "Debugging", "System Design"],
          certifications: ["Platform-specific developer certifications", "Cloud computing credentials", "Framework certifications"],
          phases: [
            {
              phase: "Programming Fundamentals",
              duration: "3-4 months",
              description: "Master core programming concepts and basic development tools",
              milestones: ["Learn programming language syntax", "Understand data structures", "Master version control", "Write clean, readable code"],
              resources: ["Online coding platforms", "Programming books", "Developer documentation", "Coding communities"],
              projects: ["Calculator app", "To-do list application", "Personal website", "Small automation scripts"]
            },
            {
              phase: "Framework & Tools Mastery",
              duration: "4-5 months",
              description: "Learn frameworks, libraries, and development tools",
              milestones: ["Master main framework", "Build complex applications", "Understand testing", "Learn deployment basics"],
              resources: ["Framework documentation", "Advanced tutorials", "Open source projects", "Mentorship"],
              projects: ["E-commerce website", "Social media clone", "API development", "Mobile-responsive apps"]
            },
            {
              phase: "Advanced Development",
              duration: "3-4 months",
              description: "Dive into advanced concepts and specialization areas",
              milestones: ["System design understanding", "Performance optimization", "Security best practices", "Choose specialization"],
              resources: ["Advanced courses", "Technical blogs", "Conference talks", "Industry forums"],
              projects: ["Microservices architecture", "Performance optimized app", "Security-focused project", "Open source contribution"]
            },
            {
              phase: "Professional Readiness",
              duration: "2-5 months",
              description: "Prepare for the job market and career advancement",
              milestones: ["Complete portfolio", "Interview preparation", "Technical communication", "Industry networking"],
              resources: ["Interview prep platforms", "Tech meetups", "Professional networks", "Career coaching"],
              projects: ["Comprehensive portfolio", "Technical blog posts", "Conference presentation", "Mentoring others"]
            }
          ]
        };
      } else if (careerLower.includes('data') || careerLower.includes('analyst')) {
        careerData = {
          overview: `This roadmap will transform you into a proficient ${career}. You'll learn to extract insights from data, master analytical tools, and develop the skills to drive data-informed business decisions.`,
          duration: "10-15 months",
          skills: ["Statistical Analysis", "Data Visualization", "SQL", "Python/R", "Business Intelligence", "Critical Thinking"],
          certifications: ["Google Data Analytics", "Microsoft Power BI", "Tableau certification", "SQL certifications"],
          phases: [
            {
              phase: "Data Fundamentals",
              duration: "2-3 months",
              description: "Learn data basics, statistics, and foundational tools",
              milestones: ["Understand data types", "Basic statistics knowledge", "Excel proficiency", "SQL basics"],
              resources: ["Statistics courses", "Excel tutorials", "SQL learning platforms", "Data literacy resources"],
              projects: ["Sales data analysis", "Survey data interpretation", "Basic dashboard creation", "Data cleaning exercises"]
            },
            {
              phase: "Analytics Tools Mastery",
              duration: "4-5 months",
              description: "Master key analytical tools and visualization platforms",
              milestones: ["Advanced SQL skills", "Python/R for data analysis", "Visualization tool mastery", "Statistical modeling"],
              resources: ["Python/R tutorials", "Visualization tool documentation", "Statistical analysis courses", "Practice datasets"],
              projects: ["Customer behavior analysis", "Sales forecasting model", "Interactive dashboards", "A/B testing analysis"]
            },
            {
              phase: "Advanced Analytics",
              duration: "2-4 months",
              description: "Develop advanced analytical and machine learning skills",
              milestones: ["Machine learning basics", "Advanced statistical methods", "Big data concepts", "Business intelligence"],
              resources: ["ML courses", "Advanced statistics", "Big data platforms", "Business case studies"],
              projects: ["Predictive modeling project", "Customer segmentation", "Market research analysis", "Business intelligence dashboard"]
            },
            {
              phase: "Professional Analytics",
              duration: "2-3 months",
              description: "Build professional skills and prepare for analyst roles",
              milestones: ["Storytelling with data", "Business presentation skills", "Domain expertise", "Portfolio completion"],
              resources: ["Communication courses", "Industry reports", "Professional communities", "Mentorship"],
              projects: ["Executive presentation", "Industry-specific analysis", "Comprehensive portfolio", "Business recommendation report"]
            }
          ]
        };
      } else if (careerLower.includes('design') || careerLower.includes('ux') || careerLower.includes('ui')) {
        careerData = {
          overview: `This roadmap will develop you into a skilled ${career}. You'll learn design principles, user research methods, and create beautiful, functional designs that solve real user problems.`,
          duration: "10-16 months",
          skills: ["Design Principles", "User Research", "Prototyping", "Visual Design", "Interaction Design", "Design Thinking"],
          certifications: ["Google UX Design Certificate", "Adobe certification", "Figma certification", "Design thinking credentials"],
          phases: [
            {
              phase: "Design Foundations",
              duration: "2-3 months",
              description: "Learn fundamental design principles and basic tools",
              milestones: ["Design principles mastery", "Basic tool proficiency", "Color and typography understanding", "Design thinking process"],
              resources: ["Design theory courses", "Tool tutorials", "Design inspiration sites", "Basic design books"],
              projects: ["Logo design", "Simple app interface", "Typography poster", "Color palette creation"]
            },
            {
              phase: "User Experience Design",
              duration: "4-5 months",
              description: "Master user research, wireframing, and UX design methods",
              milestones: ["User research skills", "Wireframing proficiency", "Information architecture", "Usability testing"],
              resources: ["UX research courses", "Wireframing tools", "IA resources", "Testing methodologies"],
              projects: ["User research study", "App wireframes", "User journey mapping", "Usability testing project"]
            },
            {
              phase: "Visual & Interaction Design",
              duration: "2-4 months",
              description: "Develop advanced visual design and interaction skills",
              milestones: ["Advanced visual design", "Interaction design", "Animation basics", "Design systems"],
              resources: ["Visual design courses", "Animation tutorials", "Design system guides", "Advanced tool training"],
              projects: ["High-fidelity mockups", "Interactive prototypes", "Design system creation", "Animated micro-interactions"]
            },
            {
              phase: "Professional Design Practice",
              duration: "2-4 months",
              description: "Build portfolio and prepare for design career",
              milestones: ["Portfolio completion", "Design critique skills", "Client communication", "Industry knowledge"],
              resources: ["Portfolio guides", "Design communities", "Industry events", "Mentorship programs"],
              projects: ["Complete design portfolio", "Case study documentation", "Client project simulation", "Design presentation"]
            }
          ]
        };
      } else {
        // Generic professional roadmap
        careerData = {
          overview: `This comprehensive roadmap will guide you through building expertise in ${career}. You'll develop both technical and professional skills needed to excel in this field.`,
          duration: "12-18 months",
          skills: ["Domain Knowledge", "Professional Communication", "Problem Solving", "Project Management", "Industry Tools", "Continuous Learning"],
          certifications: ["Industry-standard certifications", "Professional credentials", "Skill-specific certifications"],
          phases: [
            {
              phase: "Foundation Building",
              duration: "3-4 months",
              description: "Establish fundamental knowledge and basic skills",
              milestones: ["Core concepts understanding", "Basic tools proficiency", "Industry terminology", "Professional network start"],
              resources: ["Foundational courses", "Industry publications", "Professional communities", "Basic certifications"],
              projects: ["Skill demonstration project", "Industry case study", "Professional profile creation", "Basic portfolio"]
            },
            {
              phase: "Skill Development",
              duration: "4-6 months",
              description: "Develop intermediate skills and practical experience",
              milestones: ["Advanced skill acquisition", "Practical project completion", "Industry tool mastery", "Professional relationships"],
              resources: ["Advanced training", "Hands-on workshops", "Mentorship", "Industry events"],
              projects: ["Real-world project simulation", "Collaborative team project", "Industry-specific solution", "Professional presentation"]
            },
            {
              phase: "Specialization",
              duration: "3-4 months",
              description: "Focus on specific expertise areas and advanced concepts",
              milestones: ["Specialization choice", "Expert-level skills", "Industry recognition", "Thought leadership"],
              resources: ["Specialized courses", "Expert mentorship", "Industry conferences", "Advanced certifications"],
              projects: ["Specialized expertise project", "Industry innovation", "Professional publication", "Conference presentation"]
            },
            {
              phase: "Professional Excellence",
              duration: "2-4 months",
              description: "Achieve professional readiness and career advancement",
              milestones: ["Career readiness", "Leadership skills", "Industry expertise", "Professional brand"],
              resources: ["Leadership training", "Career coaching", "Professional branding", "Executive mentorship"],
              projects: ["Capstone professional project", "Leadership initiative", "Industry contribution", "Career advancement plan"]
            }
          ]
        };
      }
      
      // Create the complete roadmap structure
      roadmap = {
        career_path: career,
        overview: careerData.overview,
        total_duration: careerData.duration,
        phases: careerData.phases,
        key_skills: careerData.skills,
        certifications: careerData.certifications,
        salary_progression: {
          entry_level: "₹4-10 LPA",
          mid_level: "₹10-25 LPA",
          senior_level: "₹25-50 LPA"
        },
        next_steps: [
          "Begin with the foundation phase",
          "Set up a structured learning schedule",
          "Join relevant professional communities",
          "Start your first hands-on project",
          "Find mentors in your chosen field"
        ]
      };
    }

    res.json({
      success: true,
      roadmap
    });
  } catch (error: any) {
    console.error("Roadmap generation error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to generate career roadmap",
      error: error.message
    });
  }
});

/**
 * General Career Chat
 * POST /api/ai-career-coach/chat
 */
router.post("/chat", async (req, res) => {
  try {
    const { message, context, conversation_history } = req.body;
    
    if (!message) {
      return res.status(400).json({
        success: false,
        message: "Message is required"
      });
    }

    // Convert conversation history to the expected format
    const formattedHistory = conversation_history?.map((msg: any) => ({
      role: msg.role === 'user' ? 'user' : 'assistant',
      content: msg.content
    })) || [];

    const response = await getCareerCoachResponse({
      message,
      conversationHistory: formattedHistory,
      coachingType: 'general',
      userProfile: {},
      contextData: { context, task: 'general_chat' }
    });

    res.json({
      success: true,
      message: response
    });
  } catch (error: any) {
    console.error("Career chat error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get chat response",
      error: error.message
    });
  }
});

export default router;