import { Router, Response } from 'express';
import { z } from 'zod';
import { 
  generateCareerGuidance, 
  generateLearningRoadmap, 
  generatePathFinderResponse,
  generateQuickCareerAssessment
} from '../services/openai.js';
import { storage } from '../storage.js';

// Helper function to handle Zod validation errors
function handleZodError(error: z.ZodError, res: Response) {
  return res.status(400).json({
    message: "Validation error",
    errors: error.errors,
  });
}

const router = Router();

// Schema for career guidance request
const careerGuidanceSchema = z.object({
  interests: z.array(z.string()),
  skills: z.array(z.string()),
  education: z.string(),
  experience: z.string(),
  preferences: z.object({
    workStyle: z.string(),
    industry: z.string().optional(),
    location: z.string().optional(),
    workLifeBalance: z.string().optional(),
  }),
});

// Schema for learning roadmap request
const learningRoadmapSchema = z.object({
  careerGoal: z.string(),
  userSkills: z.array(z.string()),
  timeframe: z.string(),
  learningStyle: z.string(),
});

// Schema for pathfinder chat request
const pathfinderChatSchema = z.object({
  message: z.string(),
  chatHistory: z.array(
    z.object({
      role: z.enum(['user', 'assistant']),
      content: z.string(),
    })
  ).optional().default([]),
});

// Generate career guidance
router.post('/guidance', async (req, res) => {
  try {
    const validatedData = careerGuidanceSchema.parse(req.body);
    const careerGuidance = await generateCareerGuidance(validatedData);
    
    // If user is authenticated, store this guidance in their profile
    if (req.isAuthenticated && req.isAuthenticated() && req.user) {
      // TODO: Store career guidance in user profile
      console.log('User authenticated, would store career guidance for user ID:', req.user.id);
    }
    
    res.json(careerGuidance);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return handleZodError(error, res);
    }
    console.error('Error generating career guidance:', error);
    res.status(500).json({ message: 'Failed to generate career guidance' });
  }
});

// Generate learning roadmap
router.post('/roadmap', async (req, res) => {
  try {
    const validatedData = learningRoadmapSchema.parse(req.body);
    const roadmap = await generateLearningRoadmap(
      validatedData.careerGoal,
      validatedData.userSkills,
      validatedData.timeframe,
      validatedData.learningStyle
    );
    
    // If user is authenticated, store this roadmap in their profile
    if (req.isAuthenticated && req.isAuthenticated() && req.user) {
      console.log('User authenticated, would store roadmap for user ID:', req.user.id);
    }
    
    res.json(roadmap);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return handleZodError(error, res);
    }
    console.error('Error generating learning roadmap:', error);
    res.status(500).json({ message: 'Failed to generate learning roadmap' });
  }
});

// PathFinder chat interaction
router.post('/pathfinder/chat', async (req, res) => {
  try {
    const validatedData = pathfinderChatSchema.parse(req.body);
    
    // Get user profile if authenticated
    let userProfile;
    if (req.isAuthenticated && req.isAuthenticated() && req.user) {
      const user = await storage.getUser(req.user.id);
      if (user) {
        try {
          // Get user quiz results if available for better personalization
          const quizResults = await storage.getQuizResultsByUser(req.user.id);
          
          // Get enrolled courses for additional context
          const enrollments = await storage.getEnrollmentsByUser(req.user.id);
          const enrolledCourseIds = enrollments.map(e => e.courseId);
          const enrolledCourses = await Promise.all(
            enrolledCourseIds.map(async id => await storage.getCourse(id))
          );
          const courseNames = enrolledCourses.filter(Boolean).map(c => c?.title || '');
          
          // Get user projects for additional context
          const userProjects = await storage.getUserProjectsByUser(req.user.id);
          const projectIds = userProjects.map(p => p.projectId);
          const projects = await Promise.all(
            projectIds.map(async id => await storage.getProject(id))
          );
          const projectNames = projects.filter(Boolean).map(p => p?.title || '');
          
          // Get user's soft skills
          const userSoftSkills = await storage.getUserSoftSkillsByUser(req.user.id);
          const softSkillIds = userSoftSkills.map(s => s.softSkillId);
          const softSkills = await Promise.all(
            softSkillIds.map(async id => await storage.getSoftSkill(id))
          );
          const softSkillNames = softSkills.filter(Boolean).map((s: any) => s?.name || '');
          
          // Get recommended niches and career from quiz results
          const recommendedNiches = quizResults.length > 0 && Array.isArray(quizResults[0].recommendedNiches) 
            ? quizResults[0].recommendedNiches 
            : ['technology'];
            
          const recommendedCareer = quizResults.length > 0 && quizResults[0].recommendedCareer 
            ? quizResults[0].recommendedCareer 
            : undefined;
          
          // Enhanced user profile with actual user data
          userProfile = {
            name: user.username, // Using username which we know exists
            interests: recommendedNiches,
            education: 'Current Indian student', // Default value
            skills: Array.from(new Set([
              ...(softSkillNames || [])
            ])),
            enrolledCourses: courseNames,
            projects: projectNames,
            careerPath: recommendedCareer,
            location: 'India' // Default value
          };
        } catch (error) {
          console.error("Error getting additional user data:", error);
          // Fallback to basic profile if there are errors with additional data
          userProfile = {
            name: user.username,
            education: 'Current Indian student',
            location: 'India'
          };
        }
      }
    }
    
    let response;
    
    try {
      // First try to use OpenAI for the response
      response = await generatePathFinderResponse(
        validatedData.message,
        validatedData.chatHistory || [],
        userProfile
      );
    } catch (error) {
      const aiError = error as Error;
      console.log('Using fallback response due to OpenAI error:', aiError.message);
      
      // Fallback: Generate a response based on the message content
      // This is a simple keyword-based fallback that doesn't require OpenAI
      const message = validatedData.message.toLowerCase();
      
      if (message.includes('skill') || message.includes('learn')) {
        response = "For Indian tech careers, focus on building both technical and soft skills. Technical skills like programming languages (Python, JavaScript), cloud platforms (AWS, Azure), and frameworks are fundamental. Equally important are communication, problem-solving, and teamwork skills that are highly valued in Indian workplaces. Most Indian tech professionals recommend a balance of structured courses and hands-on projects.";
      } else if (message.includes('salary') || message.includes('pay') || message.includes('income')) {
        response = "In the Indian tech industry, salaries vary widely based on skills, experience, and location. Entry-level tech roles typically offer ₹3-8 LPA, mid-level positions range from ₹8-20 LPA, and senior roles can exceed ₹25 LPA. Tech hubs like Bangalore, Hyderabad, and Pune generally offer higher compensation packages compared to other Indian cities.";
      } else if (message.includes('company') || message.includes('work')) {
        response = "The Indian tech ecosystem offers diverse work environments. You could join established IT giants like TCS, Infosys, or Wipro, which offer stability and structured growth. Alternatively, global tech companies like Google, Microsoft, and Amazon have strong Indian presence with competitive packages. The vibrant startup scene in cities like Bangalore and Delhi provides opportunities to work on cutting-edge technologies with potential equity benefits.";
      } else if (message.includes('college') || message.includes('university') || message.includes('education')) {
        response = "Top tech education options in India include IITs, NITs, BITS, and other respected engineering colleges. Many successful professionals also come from tier-2 and tier-3 institutions. Beyond traditional education, certifications from platforms like NPTEL, Coursera, and industry-specific certifications are highly valued by Indian employers. The key is to supplement formal education with practical projects and continuous learning.";
      } else if (message.includes('intern') || message.includes('placement')) {
        response = "For internships and placements in India, start by leveraging your college's placement cell as many Indian companies recruit directly from campuses. Additionally, platforms like Internshala, LinkedIn, and AngelList are popular for finding opportunities. Build a strong portfolio of projects, participate in coding competitions like CodeChef or HackerRank, and network with industry professionals at tech meetups and conferences popular in Indian tech hubs.";
      } else {
        response = "I understand you're interested in career guidance in India. I can help with specific questions about education paths, skills, job market trends, internships, or career progression in various fields. What specific aspect of your career journey would you like guidance on?";
      }
    }
    
    // If user is authenticated, store this chat in history
    if (req.isAuthenticated && req.isAuthenticated() && req.user) {
      // TODO: Implement chat history storage
      console.log('User authenticated, would store chat history for user ID:', req.user.id);
    }
    
    res.json({ response });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return handleZodError(error, res);
    }
    console.error('Error in PathFinder chat endpoint:', error);
    res.status(500).json({ message: 'Failed to process chat request' });
  }
});

// Quick career assessment based on chat
router.post('/pathfinder/quick-assessment', async (req, res) => {
  try {
    const validatedData = z.object({
      chatHistory: z.array(
        z.object({
          role: z.enum(['user', 'assistant']),
          content: z.string(),
        })
      ).min(2) // At least one user message and one assistant response
    }).parse(req.body);
    
    try {
      // Generate career assessment
      const assessment = await generateQuickCareerAssessment(validatedData.chatHistory);
      
      // If user is authenticated, store this assessment
      if (req.isAuthenticated && req.isAuthenticated() && req.user) {
        // TODO: Save assessment to user profile
        console.log('User authenticated, would store career assessment for user ID:', req.user.id);
      }
      
      res.json(assessment);
    } catch (error) {
      console.error('Error generating quick assessment:', error);
      res.status(500).json({ 
        message: 'Failed to generate career assessment',
        fallback: {
          careerSuggestions: [
            {
              title: "Software Developer",
              match: 85,
              description: "Design, build, and maintain software applications",
              skills: ["Programming", "Problem-solving", "Teamwork"],
              salary: "₹5-25 LPA",
              growthProspect: "Strong growth in India across all sectors",
              educationPath: "BTech/BE in Computer Science or related field",
              certifications: ["AWS Certified Developer", "Microsoft Certified: Azure Developer"]
            },
            {
              title: "Data Analyst",
              match: 80,
              description: "Analyze data to extract valuable insights for business decisions",
              skills: ["Data Analysis", "SQL", "Statistics", "Visualization"],
              salary: "₹4-18 LPA",
              growthProspect: "High demand as Indian companies become more data-driven",
              educationPath: "Degree in Statistics, Computer Science, or related field",
              certifications: ["IBM Data Analyst", "Microsoft Power BI Data Analyst"]
            }
          ],
          explanation: "Based on your conversation, you seem interested in technology fields with good growth potential in India. These suggestions match your analytical mindset and interest in building solutions."
        }
      });
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return handleZodError(error, res);
    }
    console.error('Error in quick career assessment endpoint:', error);
    res.status(500).json({ message: 'Failed to process assessment request' });
  }
});

// Get user's saved career paths (if authenticated)
router.get('/saved-paths', async (req, res) => {
  if (!req.isAuthenticated || !req.isAuthenticated() || !req.user) {
    return res.status(401).json({ message: 'Authentication required' });
  }
  
  try {
    // In a real implementation, you'd fetch from database
    // TODO: Implement actual database fetch for saved paths
    res.json({
      savedPaths: []
    });
  } catch (error) {
    console.error('Error fetching saved career paths:', error);
    res.status(500).json({ message: 'Failed to fetch saved career paths' });
  }
});

export default router;