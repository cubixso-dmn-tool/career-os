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
import { db } from "../db.js";
import { careerOptions, careerPaths, careerSkills, careerCourses, careerProjects, careerResources } from "../../shared/schema.js";
import { eq, desc, sql } from "drizzle-orm";

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
router.get("/features", async (req, res) => {
  try {
    // Fetch dynamic career options from database
    const careers = await db.select({ title: careerOptions.title }).from(careerOptions);
    const supportedRoles = careers.length > 0 
      ? careers.map(c => c.title).concat(["And many more..."])
      : [
          "Software Engineer",
          "Data Scientist", 
          "Product Manager",
          "UI/UX Designer",
          "DevOps Engineer",
          "Business Analyst",
          "Digital Marketer",
          "Content Creator",
          "And many more..."
        ];

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
      supportedRoles,
      interviewTypes: ["technical", "behavioral", "system_design", "hr"],
      difficulties: ["beginner", "intermediate", "advanced"],
      learningStyles: ["visual", "hands-on", "theoretical", "mixed"]
    });
  } catch (error) {
    console.error("Error fetching features:", error);
    // Fallback to static data if database query fails
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
  }
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
      console.log("AI service unavailable, using intelligent fallback based on assessment responses and dynamic career data");
      
      // Analyze user responses to provide personalized recommendations
      const responses = message.toLowerCase();
      
      // Fetch career options from database
      const availableCareers = await db.select().from(careerOptions).orderBy(desc(careerOptions.id)).limit(20);
      
      // Simple analysis based on keywords and patterns
      const techWords = ['programming', 'coding', 'software', 'computer', 'technology', 'technical', 'building'];
      const dataWords = ['data', 'analysis', 'statistics', 'numbers', 'research', 'information'];
      const designWords = ['design', 'creative', 'art', 'visual', 'user', 'interface', 'experience'];
      const businessWords = ['business', 'management', 'leadership', 'strategy', 'communication'];
      const marketingWords = ['marketing', 'social', 'content', 'advertising', 'promotion', 'campaigns'];
      const securityWords = ['security', 'protection', 'privacy', 'risk', 'compliance', 'threat'];
      
      const isTechOriented = techWords.some(word => responses.includes(word));
      const isDataOriented = dataWords.some(word => responses.includes(word));
      const isDesignOriented = designWords.some(word => responses.includes(word));
      const isBusinessOriented = businessWords.some(word => responses.includes(word));
      const isMarketingOriented = marketingWords.some(word => responses.includes(word));
      const isSecurityOriented = securityWords.some(word => responses.includes(word));
      
      // Generate personalized recommendations based on detected interests using dynamic data
      let filteredCareers = availableCareers;
      
      if (isTechOriented) {
        filteredCareers = availableCareers.filter(career => 
          career.category === 'Software Development' || 
          career.title.toLowerCase().includes('developer') ||
          career.title.toLowerCase().includes('engineer')
        );
      } else if (isDataOriented) {
        filteredCareers = availableCareers.filter(career => 
          career.category === 'Data & AI' ||
          career.title.toLowerCase().includes('data') ||
          career.title.toLowerCase().includes('analyst')
        );
      } else if (isDesignOriented) {
        filteredCareers = availableCareers.filter(career => 
          career.category === 'Design & Product' ||
          career.title.toLowerCase().includes('design') ||
          career.title.toLowerCase().includes('ux') ||
          career.title.toLowerCase().includes('ui')
        );
      } else if (isMarketingOriented) {
        filteredCareers = availableCareers.filter(career => 
          career.category === 'Marketing & Growth' ||
          career.title.toLowerCase().includes('marketing') ||
          career.title.toLowerCase().includes('content')
        );
      } else if (isSecurityOriented) {
        filteredCareers = availableCareers.filter(career => 
          career.category === 'Cybersecurity' ||
          career.title.toLowerCase().includes('security') ||
          career.title.toLowerCase().includes('cyber')
        );
      }
      
      // If no specific category matches, use top careers
      if (filteredCareers.length === 0) {
        filteredCareers = availableCareers.slice(0, 6);
      }
      
      // Take top 3 matches and format them
      const topCareers = filteredCareers.slice(0, 3);
      
      for (let i = 0; i < topCareers.length && recommendations.length < 3; i++) {
        const career = topCareers[i];
        const matchPercentage = Math.max(75, 95 - (i * 5) - Math.floor(Math.random() * 8));
        
        recommendations.push({
          title: career.title,
          description: career.description,
          match_percentage: matchPercentage,
          salary_range: `₹${Math.floor(career.salaryMin / 100000)}-${Math.floor(career.salaryMax / 100000)} LPA`,
          growth_outlook: career.growthOutlook || "Good growth prospects in the current market",
          key_skills: career.requiredSkills || ["Professional Skills", "Communication", "Problem Solving"],
          daily_tasks: [
            "Work on projects and deliverables",
            "Collaborate with team members",
            "Analyze requirements and solutions",
            "Continuous learning and skill development"
          ],
          learning_path: [
            "Foundation building",
            "Skill development",
            "Practical application",
            "Professional expertise"
          ],
          time_to_proficiency: career.difficultyLevel === "Beginner" ? "6-12 months" : 
                             career.difficultyLevel === "Intermediate" ? "8-15 months" : "12-24 months",
          difficulty_level: career.difficultyLevel,
          industry_demand: "High",
          reasons: [
            "Matches your interests and responses",
            "Strong growth potential",
            "Good market demand"
          ]
        });
      }
      
      // Ensure we have exactly 3 recommendations by filling with popular careers if needed
      if (recommendations.length < 3) {
        const remainingCareers = availableCareers.slice(0, 5);
        for (let i = 0; i < remainingCareers.length && recommendations.length < 3; i++) {
          const career = remainingCareers[i];
          if (!recommendations.some(r => r.title === career.title)) {
            recommendations.push({
              title: career.title,
              description: career.description,
              match_percentage: 70 + Math.floor(Math.random() * 10),
              salary_range: `₹${Math.floor(career.salaryMin / 100000)}-${Math.floor(career.salaryMax / 100000)} LPA`,
              growth_outlook: career.growthOutlook || "Good growth prospects",
              key_skills: career.requiredSkills || ["Core Skills", "Communication", "Problem Solving"],
              daily_tasks: ["Professional responsibilities", "Team collaboration", "Skill application"],
              learning_path: ["Basic knowledge", "Skill building", "Experience gaining", "Mastery"],
              time_to_proficiency: career.difficultyLevel === "Beginner" ? "6-12 months" : 
                                 career.difficultyLevel === "Intermediate" ? "8-15 months" : "12-24 months",
              difficulty_level: career.difficultyLevel,
              industry_demand: "Medium",
              reasons: ["Popular career choice", "Good career prospects", "Transferable skills"]
            });
          }
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
      console.log("AI service unavailable, generating intelligent fallback roadmap for", career, "using dynamic database data");
      
      // Try to find a matching career path in the database
      const careerPaths = await db.select().from(careerPaths)
        .where(sql`LOWER(${careerPaths.title}) LIKE ${`%${career.toLowerCase()}%`}`);
      
      let matchingCareerPath = null;
      if (careerPaths.length > 0) {
        matchingCareerPath = careerPaths[0];
        console.log(`Found matching career path in database: ${matchingCareerPath.title}`);
        
        // Get related data
        const [skills, courses, projects, resources] = await Promise.all([
          db.select().from(careerSkills).where(eq(careerSkills.careerPathId, matchingCareerPath.id)),
          db.select().from(careerCourses).where(eq(careerCourses.careerPathId, matchingCareerPath.id)),
          db.select().from(careerProjects).where(eq(careerProjects.careerPathId, matchingCareerPath.id)),
          db.select().from(careerResources).where(eq(careerResources.careerPathId, matchingCareerPath.id))
        ]);
        
        // Create phases based on difficulty progression
        const phases = [];
        const technicalSkills = skills.filter(s => s.skillType === 'technical');
        const softSkills = skills.filter(s => s.skillType === 'soft');
        const beginnerCourses = courses.filter(c => c.difficulty === 'Beginner').slice(0, 3);
        const intermediateCourses = courses.filter(c => c.difficulty === 'Intermediate').slice(0, 3);
        const advancedCourses = courses.filter(c => c.difficulty === 'Advanced').slice(0, 2);
        const beginnerProjects = projects.filter(p => p.difficulty === 'Beginner').slice(0, 2);
        const intermediateProjects = projects.filter(p => p.difficulty === 'Intermediate').slice(0, 2);
        const advancedProjects = projects.filter(p => p.difficulty === 'Advanced').slice(0, 2);
        
        phases.push({
          phase: "Foundation Building",
          duration: "3-4 months",
          description: "Establish fundamental knowledge and basic skills",
          milestones: [
            ...technicalSkills.slice(0, 3).map(s => `Learn ${s.skillName}`),
            ...softSkills.slice(0, 2).map(s => `Develop ${s.skillName}`)
          ],
          resources: [
            ...beginnerCourses.map(c => c.title),
            ...resources.filter(r => r.resourceType === 'book').slice(0, 2).map(r => r.title)
          ],
          projects: beginnerProjects.map(p => p.title)
        });
        
        if (intermediateCourses.length > 0 || intermediateProjects.length > 0) {
          phases.push({
            phase: "Skill Development",
            duration: "4-6 months",
            description: "Develop intermediate skills and practical experience",
            milestones: [
              ...technicalSkills.slice(3, 6).map(s => `Master ${s.skillName}`),
              "Build complex projects",
              "Gain practical experience"
            ],
            resources: [
              ...intermediateCourses.map(c => c.title),
              ...resources.filter(r => r.resourceType === 'website').slice(0, 2).map(r => r.title)
            ],
            projects: intermediateProjects.map(p => p.title)
          });
        }
        
        if (advancedCourses.length > 0 || advancedProjects.length > 0) {
          phases.push({
            phase: "Advanced Specialization",
            duration: "3-5 months",
            description: "Focus on advanced concepts and specialization",
            milestones: [
              ...technicalSkills.slice(6, 8).map(s => `Expert level ${s.skillName}`),
              "Advanced project completion",
              "Industry recognition"
            ],
            resources: [
              ...advancedCourses.map(c => c.title),
              ...resources.filter(r => r.resourceType === 'certification').slice(0, 2).map(r => r.title)
            ],
            projects: advancedProjects.map(p => p.title)
          });
        }
        
        phases.push({
          phase: "Professional Readiness",
          duration: "2-3 months",
          description: "Prepare for career advancement and job market",
          milestones: [
            "Portfolio completion",
            "Interview preparation",
            "Industry networking",
            "Professional branding"
          ],
          resources: [
            "Portfolio development guides",
            "Interview preparation resources",
            "Professional networking platforms",
            "Career advancement strategies"
          ],
          projects: [
            "Comprehensive professional portfolio",
            "Industry presentation or publication",
            "Open source contribution"
          ]
        });
        
        roadmap = {
          career_path: matchingCareerPath.title,
          overview: matchingCareerPath.overview || `This comprehensive roadmap will guide you through becoming a skilled ${career}. You'll develop both technical and professional skills needed to excel in this field.`,
          total_duration: "12-18 months",
          phases: phases,
          key_skills: technicalSkills.slice(0, 8).map(s => s.skillName),
          certifications: resources.filter(r => r.resourceType === 'certification').map(r => r.title),
          salary_progression: {
            entry_level: "₹4-12 LPA",
            mid_level: "₹12-28 LPA", 
            senior_level: "₹28-50 LPA"
          },
          next_steps: [
            "Begin with the foundation phase",
            "Set up a structured learning schedule",
            "Join relevant professional communities",
            "Start your first hands-on project",
            "Find mentors in your chosen field"
          ]
        };
      } else {
        console.log("No matching career path found in database, using generic roadmap");
        
        // Fallback to generic roadmap structure
        roadmap = {
          career_path: career,
          overview: `This comprehensive roadmap will guide you through building expertise in ${career}. You'll develop both technical and professional skills needed to excel in this field.`,
          total_duration: "12-18 months",
          phases: [
            {
              phase: "Foundation Building",
              duration: "3-4 months",
              description: "Establish fundamental knowledge and basic skills",
              milestones: ["Core concepts understanding", "Basic tools proficiency", "Industry terminology", "Professional network start"],
              resources: ["Foundational courses", "Industry publications", "Professional communities", "Basic certifications"],
              projects: ["Skill demonstration project", "Industry case study", "Professional profile creation"]
            },
            {
              phase: "Skill Development", 
              duration: "4-6 months",
              description: "Develop intermediate skills and practical experience",
              milestones: ["Advanced skill acquisition", "Practical project completion", "Industry tool mastery", "Professional relationships"],
              resources: ["Advanced training", "Hands-on workshops", "Mentorship", "Industry events"],
              projects: ["Real-world project simulation", "Collaborative team project", "Industry-specific solution"]
            },
            {
              phase: "Professional Excellence",
              duration: "4-8 months",
              description: "Achieve professional readiness and career advancement",
              milestones: ["Career readiness", "Leadership skills", "Industry expertise", "Professional brand"],
              resources: ["Leadership training", "Career coaching", "Professional branding", "Executive mentorship"],
              projects: ["Capstone professional project", "Leadership initiative", "Industry contribution"]
            }
          ],
          key_skills: ["Domain Knowledge", "Professional Communication", "Problem Solving", "Project Management", "Industry Tools", "Continuous Learning"],
          certifications: ["Industry-standard certifications", "Professional credentials", "Skill-specific certifications"],
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