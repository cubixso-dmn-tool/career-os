import { Router } from "express";
import { storage } from "../simple-storage";

const router = Router();

// Simple auth check middleware
const requireAuth = (req: any, res: any, next: any) => {
  if (!req.isAuthenticated() || !req.user) {
    return res.status(401).json({ message: "Authentication required" });
  }
  next();
};

// Get personalized dashboard metrics for current user
router.get("/metrics", requireAuth, async (req: any, res) => {
  try {
    const userId = req.user.id;
    const metrics = await storage.getDashboardMetrics(userId);
    res.json(metrics);
  } catch (error) {
    console.error("Error fetching dashboard metrics:", error);
    res.status(500).json({ error: "Failed to fetch dashboard metrics" });
  }
});

// Get user's progress summary
router.get("/progress", requireAuth, async (req: any, res) => {
  try {
    const userId = req.user.id;
    
    const [
      enrollments,
      userProjects,
      quizResults,
      userAchievements
    ] = await Promise.all([
      storage.getEnrollmentsByUser(userId),
      storage.getUserProjectsByUser(userId),
      storage.getQuizResultsByUser(userId),
      storage.getUserAchievementsByUser(userId)
    ]);

    // Calculate overall progress
    const totalMilestones = 4;
    let completedMilestones = 0;
    
    if (quizResults.length > 0) completedMilestones++;
    if (quizResults.some(result => result.recommendedNiches.length > 0)) completedMilestones++;
    if (enrollments.filter(e => e.isCompleted).length >= 2) completedMilestones++;
    if (userProjects.filter(p => p.isCompleted).length >= 1) completedMilestones++;

    const progress = {
      overallProgress: Math.round((completedMilestones / totalMilestones) * 100),
      courses: {
        enrolled: enrollments.length,
        completed: enrollments.filter(e => e.isCompleted).length,
        averageProgress: enrollments.length > 0 
          ? Math.round(enrollments.reduce((sum, e) => sum + e.progress, 0) / enrollments.length)
          : 0
      },
      projects: {
        total: userProjects.length,
        completed: userProjects.filter(p => p.isCompleted).length
      },
      achievements: userAchievements.length,
      careerAssessment: quizResults.length > 0,
      recommendedCareer: quizResults.length > 0 ? quizResults[0].recommendedCareer : null
    };

    res.json(progress);
  } catch (error) {
    console.error("Error fetching user progress:", error);
    res.status(500).json({ error: "Failed to fetch user progress" });
  }
});

// Get user's recent activity
router.get("/activity", requireAuth, async (req: any, res) => {
  try {
    const userId = req.user.id;
    const recentActivity = await storage.getRecentUserActivity(userId);
    res.json(recentActivity);
  } catch (error) {
    console.error("Error fetching recent activity:", error);
    res.status(500).json({ error: "Failed to fetch recent activity" });
  }
});

export default router;