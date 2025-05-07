import { Router, Response } from 'express';
import { z } from 'zod';
import { 
  generateCareerGuidance, 
  generateLearningRoadmap, 
  generatePathFinderResponse 
} from '../services/openai';
import { storage } from '../storage';

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
        // Simplistic user profile - in a real app, you'd have more structured data
        userProfile = {
          name: user.username || user.name,
          // These would come from other tables in a real implementation
          interests: ['web development', 'artificial intelligence'], // Placeholder
          education: 'Bachelor of Technology', // Placeholder
          skills: ['JavaScript', 'React', 'Python'] // Placeholder
        };
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
      } else {
        response = "I understand you're interested in tech careers in India. Could you ask a more specific question about education paths, skills, job market trends, or career progression in your chosen field? I'm here to provide tailored guidance for Indian Gen Z students entering the tech industry.";
      }
    }
    
    // If user is authenticated, store this chat in history
    if (req.isAuthenticated && req.isAuthenticated() && req.user) {
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