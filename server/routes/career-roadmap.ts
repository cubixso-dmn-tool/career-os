import { Router } from "express";
import { storage } from "../storage.js";
import { loadUserRolesMiddleware } from "../middleware/rbac.js";
import { db } from "../db.js";
import { careerPaths, careerSkills, careerCourses, careerProjects, careerResources, userCareerProgress, users } from "../../shared/schema.js";
import { eq, and } from "drizzle-orm";

const router = Router();

// Apply middleware to load user roles and permissions
router.use(loadUserRolesMiddleware);

// Get available career paths
router.get('/paths', async (req, res) => {
  try {
    const { category } = req.query;
    
    let query = db.select().from(careerPaths).where(eq(careerPaths.isActive, true));
    
    if (category) {
      query = query.where(and(eq(careerPaths.isActive, true), eq(careerPaths.category, category as string)));
    }
    
    const paths = await query;
    
    res.json({
      success: true,
      data: paths
    });
  } catch (error) {
    console.error('Error fetching career paths:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to fetch career paths' 
    });
  }
});

// Get detailed career roadmap by path ID
router.get('/roadmap/:pathId', async (req, res) => {
  try {
    const pathId = parseInt(req.params.pathId);
    
    if (!pathId) {
      return res.status(400).json({
        success: false,
        error: 'Invalid path ID'
      });
    }
    
    // Get career path details
    const [careerPath] = await db
      .select()
      .from(careerPaths)
      .where(eq(careerPaths.id, pathId));
    
    if (!careerPath) {
      return res.status(404).json({
        success: false,
        error: 'Career path not found'
      });
    }
    
    // Get related data
    const [skills, courses, projects, resources] = await Promise.all([
      db.select().from(careerSkills).where(eq(careerSkills.careerPathId, pathId)),
      db.select().from(careerCourses).where(eq(careerCourses.careerPathId, pathId)),
      db.select().from(careerProjects).where(eq(careerProjects.careerPathId, pathId)),
      db.select().from(careerResources).where(eq(careerResources.careerPathId, pathId))
    ]);
    
    const roadmap = {
      ...careerPath,
      skills: {
        technical: skills.filter(s => s.skillType === 'technical'),
        soft: skills.filter(s => s.skillType === 'soft')
      },
      courses: courses.sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0)),
      projects: projects.sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0)),
      resources: {
        books: resources.filter(r => r.resourceType === 'book'),
        websites: resources.filter(r => r.resourceType === 'website'),
        tools: resources.filter(r => r.resourceType === 'tool'),
        communities: resources.filter(r => r.resourceType === 'community'),
        certifications: resources.filter(r => r.resourceType === 'certification')
      }
    };
    
    res.json({
      success: true,
      data: roadmap
    });
  } catch (error) {
    console.error('Error fetching career roadmap:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to fetch career roadmap' 
    });
  }
});

// Get user career progress
router.get('/progress', async (req, res) => {
  try {
    if (!req.isAuthenticated || !req.isAuthenticated() || !req.user) {
      return res.status(401).json({ 
        success: false,
        error: 'Unauthorized' 
      });
    }
    
    const userId = req.user.id;
    
    // Get user's career progress
    const progressList = await db
      .select({
        id: userCareerProgress.id,
        careerPathId: userCareerProgress.careerPathId,
        currentPhase: userCareerProgress.currentPhase,
        completedSkills: userCareerProgress.completedSkills,
        completedCourses: userCareerProgress.completedCourses,
        completedProjects: userCareerProgress.completedProjects,
        progressPercentage: userCareerProgress.progressPercentage,
        startedAt: userCareerProgress.startedAt,
        lastUpdated: userCareerProgress.lastUpdated,
        careerTitle: careerPaths.title,
        careerCategory: careerPaths.category
      })
      .from(userCareerProgress)
      .leftJoin(careerPaths, eq(userCareerProgress.careerPathId, careerPaths.id))
      .where(eq(userCareerProgress.userId, userId));
    
    res.json({
      success: true,
      data: progressList
    });
  } catch (error) {
    console.error('Error fetching user career progress:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to fetch career progress' 
    });
  }
});

// Start tracking progress for a career path
router.post('/progress/:pathId', async (req, res) => {
  try {
    if (!req.isAuthenticated || !req.isAuthenticated() || !req.user) {
      return res.status(401).json({ 
        success: false,
        error: 'Unauthorized' 
      });
    }
    
    const userId = req.user.id;
    const pathId = parseInt(req.params.pathId);
    
    if (!pathId) {
      return res.status(400).json({
        success: false,
        error: 'Invalid path ID'
      });
    }
    
    // Check if user already has progress for this path
    const [existingProgress] = await db
      .select()
      .from(userCareerProgress)
      .where(and(eq(userCareerProgress.userId, userId), eq(userCareerProgress.careerPathId, pathId)));
    
    if (existingProgress) {
      return res.json({
        success: true,
        message: 'Progress already exists',
        data: existingProgress
      });
    }
    
    // Create new progress tracking
    const [newProgress] = await db
      .insert(userCareerProgress)
      .values({
        userId,
        careerPathId: pathId,
        currentPhase: 1,
        completedSkills: [],
        completedCourses: [],
        completedProjects: [],
        progressPercentage: 0
      })
      .returning();
    
    res.json({
      success: true,
      message: 'Started tracking career progress',
      data: newProgress
    });
  } catch (error) {
    console.error('Error creating career progress:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to create career progress' 
    });
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