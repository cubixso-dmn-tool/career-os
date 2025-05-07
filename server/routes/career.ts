import { Router } from 'express';
import { z } from 'zod';
import { handleZodError } from '../routes';
import { 
  generateCareerGuidance, 
  generateLearningRoadmap, 
  generatePathFinderResponse 
} from '../services/openai';
import { storage } from '../storage';

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
  ),
});

// Generate career guidance
router.post('/guidance', async (req, res) => {
  try {
    const validatedData = careerGuidanceSchema.parse(req.body);
    const careerGuidance = await generateCareerGuidance(validatedData);
    
    // If user is authenticated, store this guidance in their profile
    if (req.isAuthenticated() && req.user) {
      // TODO: Store career guidance in user profile
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
    if (req.isAuthenticated() && req.user) {
      // TODO: Store learning roadmap in user profile
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
    if (req.isAuthenticated() && req.user) {
      const user = await storage.getUser(req.user.id);
      if (user) {
        // Simplistic user profile - in a real app, you'd have more structured data
        userProfile = {
          name: user.name,
          // These would come from other tables in a real implementation
          interests: ['web development', 'artificial intelligence'], // Placeholder
          education: 'Bachelor of Technology', // Placeholder
          skills: ['JavaScript', 'React', 'Python'] // Placeholder
        };
      }
    }
    
    const response = await generatePathFinderResponse(
      validatedData.message,
      validatedData.chatHistory,
      userProfile
    );
    
    // If user is authenticated, store this chat in history
    if (req.isAuthenticated() && req.user) {
      // TODO: Store chat history
    }
    
    res.json({ response });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return handleZodError(error, res);
    }
    console.error('Error generating PathFinder response:', error);
    res.status(500).json({ message: 'Failed to generate PathFinder response' });
  }
});

// Get user's saved career paths (if authenticated)
router.get('/saved-paths', async (req, res) => {
  if (!req.isAuthenticated() || !req.user) {
    return res.status(401).json({ message: 'Authentication required' });
  }
  
  try {
    // In a real implementation, you'd fetch from database
    // Here, returning mock data for demonstration
    res.json({
      savedPaths: [
        {
          id: 1,
          title: 'Full Stack Developer Path',
          createdAt: new Date().toISOString(),
          // Other data would be here
        }
      ]
    });
  } catch (error) {
    console.error('Error fetching saved career paths:', error);
    res.status(500).json({ message: 'Failed to fetch saved career paths' });
  }
});

export default router;