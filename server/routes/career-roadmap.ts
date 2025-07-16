import { Router } from "express";
import { storage } from "../storage.js";
import { loadUserRolesMiddleware } from "../middleware/rbac.js";

const router = Router();

// Apply middleware to load user roles and permissions
router.use(loadUserRolesMiddleware);

// Get user career progress
router.get('/progress', async (req, res) => {
  try {
    if (!req.isAuthenticated || !req.isAuthenticated() || !req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    
    // For now, return mock data - in real implementation, this would fetch from the database
    // using the authenticated user's ID (req.user.id)
    const mockUserProgress = {
      currentStep: 2,
      completedSteps: ["Introduction", "Skills"],
      coursesCompleted: 3,
      projectsCompleted: 1
    };
    
    res.json(mockUserProgress);
  } catch (error) {
    console.error('Error fetching user career progress:', error);
    res.status(500).json({ error: 'Failed to fetch career progress' });
  }
});

// Update user progress for a step
router.post('/progress/step', async (req, res) => {
  try {
    if (!req.isAuthenticated || !req.isAuthenticated() || !req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    
    const { step, action } = req.body;
    
    if (!step || !action) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    if (!['start', 'complete'].includes(action)) {
      return res.status(400).json({ error: 'Invalid action' });
    }
    
    // Mock implementation - in real app, this would update the database
    // This would validate step prerequisites, etc.
    const mockUpdatedProgress = {
      currentStep: 3,
      completedSteps: ["Introduction", "Skills", "Courses"],
      coursesCompleted: 3,
      projectsCompleted: 1
    };
    
    res.json(mockUpdatedProgress);
  } catch (error) {
    console.error('Error updating career progress:', error);
    res.status(500).json({ error: 'Failed to update career progress' });
  }
});

// Get recommended resources for career path
router.get('/resources/:careerPath', async (req, res) => {
  try {
    if (!req.isAuthenticated || !req.isAuthenticated() || !req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    
    const { careerPath } = req.params;
    
    // Mock implementation - in real app, this would query the database based on career path
    const mockResources = {
      recommendedBooks: [
        { title: "The Pragmatic Programmer", author: "Andrew Hunt" },
        { title: "Clean Code", author: "Robert C. Martin" },
        { title: "Cracking the Coding Interview", author: "Gayle McDowell" }
      ],
      onlineResources: [
        { name: "LeetCode", url: "https://leetcode.com" },
        { name: "GitHub", url: "https://github.com" },
        { name: "Stack Overflow", url: "https://stackoverflow.com" }
      ]
    };
    
    res.json(mockResources);
  } catch (error) {
    console.error('Error fetching career resources:', error);
    res.status(500).json({ error: 'Failed to fetch career resources' });
  }
});

export default router;