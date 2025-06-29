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

    // Use the existing getCareerCoachResponse function with specific context for analysis
    const response = await getCareerCoachResponse({
      message,
      conversationHistory: [],
      coachingType: 'general',
      userProfile: {},
      contextData: { context, task: 'career_assessment_analysis' }
    });

    // Parse the AI response to extract recommendations
    let recommendations = [];
    try {
      // Try to parse JSON from the response
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        recommendations = parsed.recommendations || parsed;
      }
    } catch (parseError) {
      // If JSON parsing fails, create structured recommendations from text
      recommendations = [
        {
          title: "Frontend Developer",
          description: "Build beautiful, responsive user interfaces for web applications",
          match_percentage: 85,
          salary_range: "₹5-25 LPA",
          growth_outlook: "24% growth over next 10 years",
          key_skills: ["HTML/CSS", "JavaScript", "React", "TypeScript"],
          daily_tasks: ["Write clean code", "Collaborate with designers", "Debug applications"],
          learning_path: ["HTML/CSS fundamentals", "JavaScript basics", "React framework"],
          time_to_proficiency: "6-12 months",
          difficulty_level: "Intermediate",
          industry_demand: "High",
          reasons: ["Strong technical interests", "Problem-solving skills", "Creative mindset"]
        },
        {
          title: "Data Analyst",
          description: "Analyze data to help companies make better business decisions",
          match_percentage: 78,
          salary_range: "₹5-18 LPA",
          growth_outlook: "20% growth over next 10 years",
          key_skills: ["SQL", "Excel", "Python", "Data Visualization"],
          daily_tasks: ["Clean datasets", "Create dashboards", "Generate reports"],
          learning_path: ["SQL basics", "Excel mastery", "Python for data"],
          time_to_proficiency: "4-8 months",
          difficulty_level: "Beginner",
          industry_demand: "High",
          reasons: ["Analytical thinking", "Attention to detail", "Business interest"]
        },
        {
          title: "UX Designer",
          description: "Create meaningful and relevant experiences for users",
          match_percentage: 72,
          salary_range: "₹5-25 LPA",
          growth_outlook: "18% growth over next 10 years",
          key_skills: ["User Research", "Wireframing", "Prototyping", "Figma"],
          daily_tasks: ["Conduct user research", "Create wireframes", "Run usability tests"],
          learning_path: ["Design fundamentals", "User research methods", "Prototyping tools"],
          time_to_proficiency: "8-15 months",
          difficulty_level: "Intermediate",
          industry_demand: "Medium",
          reasons: ["Creative problem solving", "User empathy", "Visual thinking"]
        }
      ];
    }

    res.json({
      success: true,
      recommendations,
      rawResponse: response
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

    // Use the existing getCareerCoachResponse function for roadmap generation
    const response = await getCareerCoachResponse({
      message,
      conversationHistory: [],
      coachingType: 'learning_path',
      userProfile: { currentRole: career },
      contextData: { context, task: 'roadmap_generation', career }
    });

    // Parse the AI response to extract roadmap
    let roadmap = null;
    try {
      // Try to parse JSON from the response
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        roadmap = JSON.parse(jsonMatch[0]);
      }
    } catch (parseError) {
      // If JSON parsing fails, create a structured roadmap
      roadmap = {
        career_path: career,
        overview: `This comprehensive roadmap will guide you through becoming a successful ${career}. The journey involves mastering technical skills, building projects, and gaining practical experience through structured learning phases.`,
        total_duration: "12-18 months",
        phases: [
          {
            phase: "Foundation",
            duration: "2-3 months",
            description: "Build fundamental knowledge and understanding",
            milestones: ["Complete basic courses", "Understand core concepts", "Set up development environment"],
            resources: ["Online tutorials", "Documentation", "Community forums"],
            projects: ["Hello World projects", "Basic exercises", "Small practice applications"]
          },
          {
            phase: "Skill Development",
            duration: "4-6 months",
            description: "Develop core technical and soft skills",
            milestones: ["Master key technologies", "Build complex projects", "Join communities"],
            resources: ["Advanced courses", "Books", "Mentorship"],
            projects: ["Portfolio website", "Real-world applications", "Open source contributions"]
          },
          {
            phase: "Specialization",
            duration: "3-4 months",
            description: "Focus on specific areas and advanced concepts",
            milestones: ["Choose specialization", "Deep dive into advanced topics", "Industry knowledge"],
            resources: ["Specialized courses", "Industry blogs", "Conferences"],
            projects: ["Specialized projects", "Industry-specific solutions", "Personal innovations"]
          },
          {
            phase: "Professional Ready",
            duration: "3-5 months",
            description: "Prepare for job market and career advancement",
            milestones: ["Complete portfolio", "Interview preparation", "Network building"],
            resources: ["Mock interviews", "Career coaching", "Professional networks"],
            projects: ["Capstone project", "Industry collaboration", "Professional portfolio"]
          }
        ],
        key_skills: ["Technical proficiency", "Problem solving", "Communication", "Continuous learning"],
        certifications: ["Industry-standard certifications", "Platform-specific credentials", "Professional development"],
        salary_progression: {
          entry_level: "₹4-8 LPA",
          mid_level: "₹8-20 LPA",
          senior_level: "₹20-40 LPA"
        },
        next_steps: ["Start with foundation phase", "Set up learning schedule", "Join relevant communities", "Begin first project"]
      };
    }

    res.json({
      success: true,
      roadmap,
      rawResponse: response
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