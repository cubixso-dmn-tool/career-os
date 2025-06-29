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

export default router;