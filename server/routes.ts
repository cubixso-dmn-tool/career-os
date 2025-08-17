import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage.js";
import ExpertChatWebSocket from "./websocket.js";
import { ZodError } from "zod";
import passport from "passport";
import { 
  insertUserSchema, 
  insertQuizResultSchema, 
  insertEnrollmentSchema, 
  insertUserProjectSchema,
  insertUserSoftSkillSchema,
  insertResumeSchema,
  insertPostSchema,
  insertCommentSchema,
  insertUserAchievementSchema,
  insertUserEventSchema,
  insertDailyByteSchema,
  insertUserDailyByteSchema
} from "../shared/schema.js";
import { 
  generateCareerRecommendations,
  chatWithPathFinder
} from "./lib/openai.js";
import communityRoutes from "./routes/community.js";
import communityFeaturesRoutes from "./routes/community-features.js";
import rbacRoutes from "./routes/rbac.js";
import careerRoutes from "./routes/career.js";
import careerRoadmapRoutes from "./routes/career-roadmap.js";
import contentManagementRoutes from "./routes/content-management.js";
import coursesRoutes from "./routes/courses.js";
import aiCareerCoachRoutes from "./routes/ai-career-coach.js";
import industryExpertsRoutes from "./routes/industry-experts.js";
import learningResourcesRoutes from "./routes/learning-resources.js";
import mentorRoutes from "./routes/mentor.js";
import mentorJourneyRoutes from "./routes/mentor-journey.js";
import adminRoutes from "./routes/admin.js";
import analyticsRoutes from "./routes/analytics.js";
import dashboardRoutes from "./routes/dashboard.js";
import searchRoutes from "./routes/search.js";
import uploadRoutes from "./routes/upload.js";
import authAdvancedRoutes from "./routes/auth-advanced.js";
import adminLogsRoutes from "./routes/admin-logs.js";
import { loadUserRolesMiddleware } from "./middleware/rbac.js";
import { sanitizeInput, rateLimit, validateSqlInjection, securityHeaders } from "./middleware/validation.js";
import { AdminLogger } from "./lib/admin-logs.js";

function handleZodError(error: ZodError, res: Response) {
  return res.status(400).json({
    message: "Validation error",
    errors: error.errors,
  });
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Apply security middleware only to API routes, but exclude resume endpoints
  app.use('/api', sanitizeInput);
  app.use('/api', rateLimit(100, 60000)); // 100 requests per minute
  app.use('/api', (req, res, next) => {
    // Skip SQL injection validation for resume endpoints
    if (req.path.startsWith('/api/resumes')) {
      console.log('Skipping SQL injection validation for:', req.path);
      return next();
    }
    return validateSqlInjection(req, res, next);
  });
  app.use('/api', securityHeaders);
  
  // Register specific route modules first to avoid conflicts
  app.use('/api/courses', coursesRoutes);
  app.use('/api/career', careerRoutes);
  app.use('/api/career/roadmap', careerRoadmapRoutes);
  app.use('/api/content-management', contentManagementRoutes);
  app.use('/api/ai-career-coach', aiCareerCoachRoutes);
  app.use('/api/industry-experts', industryExpertsRoutes);
  app.use('/api/learning-resources', learningResourcesRoutes);
  app.use('/api/mentor', mentorRoutes);
  app.use('/api/mentor-journey', mentorJourneyRoutes);
  app.use('/api/admin', adminRoutes);
  app.use('/api/analytics', analyticsRoutes);
  app.use('/api/dashboard', dashboardRoutes);
  app.use('/api/search', searchRoutes);
  app.use('/api/upload', uploadRoutes);
  app.use('/api/auth-advanced', authAdvancedRoutes);
  app.use('/api/admin-logs', adminLogsRoutes);
  app.use('/api/rbac', rbacRoutes);
  app.use('/api/community-features', communityFeaturesRoutes);
  app.use('/api', communityRoutes);
  
  // Load user roles middleware
  app.use(loadUserRolesMiddleware);
  
  // USERS
  app.post("/api/users", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      
      // Check if username or email already exists
      const existingUserByUsername = await storage.getUserByUsername(userData.username);
      if (existingUserByUsername) {
        return res.status(400).json({ message: "Username already exists" });
      }
      
      const existingUserByEmail = await storage.getUserByEmail(userData.email);
      if (existingUserByEmail) {
        return res.status(400).json({ message: "Email already exists" });
      }
      
      const user = await storage.createUser(userData);
      res.status(201).json(user);
    } catch (error) {
      if (error instanceof ZodError) {
        return handleZodError(error, res);
      }
      res.status(500).json({ message: "Failed to create user" });
    }
  });

  app.get("/api/users/:id", async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Failed to get user" });
    }
  });

  app.patch("/api/users/:id", async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const updatedUser = await storage.updateUser(userId, req.body);
      res.json(updatedUser);
    } catch (error) {
      res.status(500).json({ message: "Failed to update user" });
    }
  });

  // PATHFINDER CHAT
  app.post("/api/pathfinder/chat", async (req, res) => {
    try {
      const { message, conversationHistory, careerPath } = req.body;
      
      if (!message || typeof message !== 'string') {
        return res.status(400).json({ message: "Invalid chat message" });
      }
      
      // Validate conversation history if provided
      if (conversationHistory && !Array.isArray(conversationHistory)) {
        return res.status(400).json({ message: "Invalid conversation history format" });
      }
      
      // Process the chat message
      const response = await chatWithPathFinder(message, conversationHistory, careerPath);
      res.json({ response });
    } catch (error) {
      console.error("PathFinder chat error:", error);
      res.status(500).json({ message: "Failed to process chat message" });
    }
  });

  // CAREER QUIZ RESULTS
  app.post("/api/quiz-results", async (req, res) => {
    try {
      const quizData = insertQuizResultSchema.parse(req.body);
      const quizResult = await storage.createQuizResult(quizData);
      res.status(201).json(quizResult);
    } catch (error) {
      if (error instanceof ZodError) {
        return handleZodError(error, res);
      }
      res.status(500).json({ message: "Failed to save quiz result" });
    }
  });

  app.get("/api/users/:userId/quiz-results", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const quizResults = await storage.getQuizResultsByUser(userId);
      res.json(quizResults);
    } catch (error) {
      res.status(500).json({ message: "Failed to get quiz results" });
    }
  });

  app.post("/api/career-recommendations", async (req, res) => {
    try {
      const { answers } = req.body;
      
      if (!answers || !Array.isArray(answers)) {
        return res.status(400).json({ message: "Invalid quiz data" });
      }
      
      // Use OpenAI to analyze the answers and generate recommendations
      const recommendations = await generateCareerRecommendations(answers);
      res.json(recommendations);
    } catch (error) {
      res.status(500).json({ message: "Failed to generate recommendations" });
    }
  });

  // COURSES - Now handled by courses router module

  // ENROLLMENTS
  app.post("/api/enrollments", async (req, res) => {
    try {
      const enrollmentData = insertEnrollmentSchema.parse(req.body);
      const enrollment = await storage.createEnrollment(enrollmentData);
      res.status(201).json(enrollment);
    } catch (error) {
      if (error instanceof ZodError) {
        return handleZodError(error, res);
      }
      res.status(500).json({ message: "Failed to create enrollment" });
    }
  });

  app.get("/api/users/:userId/enrollments", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const enrollments = await storage.getEnrollmentsByUser(userId);
      res.json(enrollments);
    } catch (error) {
      res.status(500).json({ message: "Failed to get enrollments" });
    }
  });

  app.patch("/api/enrollments/:id", async (req, res) => {
    try {
      const enrollmentId = parseInt(req.params.id);
      const updatedEnrollment = await storage.updateEnrollment(enrollmentId, req.body);
      res.json(updatedEnrollment);
    } catch (error) {
      res.status(500).json({ message: "Failed to update enrollment" });
    }
  });

  // PROJECTS
  app.get("/api/projects", async (req, res) => {
    try {
      const { category, difficulty } = req.query;
      
      const projects = await storage.getFilteredProjects(
        category as string | undefined,
        difficulty as string | undefined
      );
      
      res.json(projects);
    } catch (error) {
      res.status(500).json({ message: "Failed to get projects" });
    }
  });

  app.get("/api/projects/:id", async (req, res) => {
    try {
      const projectId = parseInt(req.params.id);
      const project = await storage.getProject(projectId);
      
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }
      
      res.json(project);
    } catch (error) {
      res.status(500).json({ message: "Failed to get project" });
    }
  });

  app.get("/api/users/:userId/recommended-projects", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const projects = await storage.getRecommendedProjects(userId);
      res.json(projects);
    } catch (error) {
      res.status(500).json({ message: "Failed to get recommended projects" });
    }
  });

  // USER PROJECTS
  app.post("/api/user-projects", async (req, res) => {
    try {
      const userProjectData = insertUserProjectSchema.parse(req.body);
      const userProject = await storage.createUserProject(userProjectData);
      res.status(201).json(userProject);
    } catch (error) {
      if (error instanceof ZodError) {
        return handleZodError(error, res);
      }
      res.status(500).json({ message: "Failed to create user project" });
    }
  });

  app.get("/api/users/:userId/user-projects", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const userProjects = await storage.getUserProjectsByUser(userId);
      res.json(userProjects);
    } catch (error) {
      res.status(500).json({ message: "Failed to get user projects" });
    }
  });

  app.patch("/api/user-projects/:id", async (req, res) => {
    try {
      const userProjectId = parseInt(req.params.id);
      const updatedUserProject = await storage.updateUserProject(userProjectId, req.body);
      res.json(updatedUserProject);
    } catch (error) {
      res.status(500).json({ message: "Failed to update user project" });
    }
  });

  // SOFT SKILLS
  app.get("/api/soft-skills", async (req, res) => {
    try {
      const { type } = req.query;
      
      const softSkills = await storage.getFilteredSoftSkills(
        type as string | undefined
      );
      
      res.json(softSkills);
    } catch (error) {
      res.status(500).json({ message: "Failed to get soft skills" });
    }
  });

  app.get("/api/soft-skills/:id", async (req, res) => {
    try {
      const softSkillId = parseInt(req.params.id);
      const softSkill = await storage.getSoftSkill(softSkillId);
      
      if (!softSkill) {
        return res.status(404).json({ message: "Soft skill not found" });
      }
      
      res.json(softSkill);
    } catch (error) {
      res.status(500).json({ message: "Failed to get soft skill" });
    }
  });

  // USER SOFT SKILLS
  app.post("/api/user-soft-skills", async (req, res) => {
    try {
      const userSoftSkillData = insertUserSoftSkillSchema.parse(req.body);
      const userSoftSkill = await storage.createUserSoftSkill(userSoftSkillData);
      res.status(201).json(userSoftSkill);
    } catch (error) {
      if (error instanceof ZodError) {
        return handleZodError(error, res);
      }
      res.status(500).json({ message: "Failed to create user soft skill" });
    }
  });

  app.get("/api/users/:userId/user-soft-skills", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const userSoftSkills = await storage.getUserSoftSkillsByUser(userId);
      res.json(userSoftSkills);
    } catch (error) {
      res.status(500).json({ message: "Failed to get user soft skills" });
    }
  });

  app.patch("/api/user-soft-skills/:id", async (req, res) => {
    try {
      const userSoftSkillId = parseInt(req.params.id);
      const updatedUserSoftSkill = await storage.updateUserSoftSkill(userSoftSkillId, req.body);
      res.json(updatedUserSoftSkill);
    } catch (error) {
      res.status(500).json({ message: "Failed to update user soft skill" });
    }
  });

  // RESUME API - Updated for comprehensive data persistence
  app.post("/api/resumes", async (req, res) => {
    try {
      console.log('POST /api/resumes - Request body keys:', Object.keys(req.body));
      console.log('POST /api/resumes - User authenticated:', !!req.user);
      console.log('POST /api/resumes - User ID:', req.user?.id);

      if (!req.user) {
        console.log('POST /api/resumes - Authentication failed');
        return res.status(401).json({ message: "Authentication required" });
      }

      const { templateId, data, name } = req.body;
      
      console.log('POST /api/resumes - templateId:', templateId);
      console.log('POST /api/resumes - data keys:', data ? Object.keys(data) : 'undefined');
      console.log('POST /api/resumes - name:', name);
      
      if (!templateId || !data) {
        console.log('POST /api/resumes - Missing required fields');
        return res.status(400).json({ message: "templateId and data are required" });
      }

      const resumeData = insertResumeSchema.parse({
        userId: req.user.id,
        templateId,
        data,
        name: name || data.personalInfo?.name || 'Untitled Resume'
      });
      
      console.log('POST /api/resumes - Parsed resume data:', {
        userId: resumeData.userId,
        templateId: resumeData.templateId,
        name: resumeData.name,
        dataKeys: Object.keys(resumeData.data)
      });
      
      const resume = await storage.createResume(resumeData);
      console.log('POST /api/resumes - Resume created successfully:', resume.id);
      res.status(201).json(resume);
    } catch (error) {
      if (error instanceof ZodError) {
        console.error('POST /api/resumes - Zod validation error:', error.errors);
        return handleZodError(error, res);
      }
      console.error('POST /api/resumes - Error creating resume:', error);
      res.status(500).json({ message: "Failed to create resume", error: error.message });
    }
  });

  app.get("/api/resumes", async (req, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Authentication required" });
      }

      const resumes = await storage.getUserResumes(req.user.id);
      res.json(resumes);
    } catch (error) {
      console.error('Error getting user resumes:', error);
      res.status(500).json({ message: "Failed to get resumes" });
    }
  });

  app.get("/api/resumes/:id", async (req, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Authentication required" });
      }

      const resumeId = parseInt(req.params.id);
      const resume = await storage.getResume(resumeId);
      
      if (!resume) {
        return res.status(404).json({ message: "Resume not found" });
      }

      // Ensure user can only access their own resumes
      if (resume.userId !== req.user.id) {
        return res.status(403).json({ message: "Access denied" });
      }
      
      res.json(resume);
    } catch (error) {
      console.error('Error getting resume:', error);
      res.status(500).json({ message: "Failed to get resume" });
    }
  });

  app.put("/api/resumes/:id", async (req, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Authentication required" });
      }

      const resumeId = parseInt(req.params.id);
      const { templateId, data, name } = req.body;
      
      // Verify resume ownership
      const existingResume = await storage.getResume(resumeId);
      if (!existingResume) {
        return res.status(404).json({ message: "Resume not found" });
      }
      
      if (existingResume.userId !== req.user.id) {
        return res.status(403).json({ message: "Access denied" });
      }

      const updatedResume = await storage.updateResume(resumeId, {
        templateId: templateId || existingResume.templateId,
        data: data || existingResume.data,
        name: name || data?.personalInfo?.name || existingResume.name
      });
      
      res.json(updatedResume);
    } catch (error) {
      console.error('Error updating resume:', error);
      res.status(500).json({ message: "Failed to update resume" });
    }
  });

  app.delete("/api/resumes/:id", async (req, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Authentication required" });
      }

      const resumeId = parseInt(req.params.id);
      
      // Verify resume ownership
      const existingResume = await storage.getResume(resumeId);
      if (!existingResume) {
        return res.status(404).json({ message: "Resume not found" });
      }
      
      if (existingResume.userId !== req.user.id) {
        return res.status(403).json({ message: "Access denied" });
      }

      await storage.deleteResume(resumeId);
      res.json({ message: "Resume deleted successfully" });
    } catch (error) {
      console.error('Error deleting resume:', error);
      res.status(500).json({ message: "Failed to delete resume" });
    }
  });

  // Legacy endpoint for backwards compatibility
  app.get("/api/users/:userId/resume", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const resume = await storage.getResumeByUser(userId);
      
      if (!resume) {
        return res.status(404).json({ message: "Resume not found" });
      }
      
      res.json(resume);
    } catch (error) {
      res.status(500).json({ message: "Failed to get resume" });
    }
  });

  // COMMUNITY POSTS
  app.get("/api/posts", async (req, res) => {
    try {
      const posts = await storage.getAllPosts();
      res.json(posts);
    } catch (error) {
      res.status(500).json({ message: "Failed to get posts" });
    }
  });

  app.post("/api/posts", async (req, res) => {
    try {
      const postData = insertPostSchema.parse(req.body);
      const post = await storage.createPost(postData);
      res.status(201).json(post);
    } catch (error) {
      if (error instanceof ZodError) {
        return handleZodError(error, res);
      }
      res.status(500).json({ message: "Failed to create post" });
    }
  });

  app.get("/api/posts/:id", async (req, res) => {
    try {
      const postId = parseInt(req.params.id);
      const post = await storage.getPost(postId);
      
      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }
      
      res.json(post);
    } catch (error) {
      res.status(500).json({ message: "Failed to get post" });
    }
  });

  app.patch("/api/posts/:id", async (req, res) => {
    try {
      const postId = parseInt(req.params.id);
      const updatedPost = await storage.updatePost(postId, req.body);
      res.json(updatedPost);
    } catch (error) {
      res.status(500).json({ message: "Failed to update post" });
    }
  });

  // COMMENTS
  app.get("/api/posts/:postId/comments", async (req, res) => {
    try {
      const postId = parseInt(req.params.postId);
      const comments = await storage.getCommentsByPost(postId);
      res.json(comments);
    } catch (error) {
      res.status(500).json({ message: "Failed to get comments" });
    }
  });

  app.post("/api/comments", async (req, res) => {
    try {
      const commentData = insertCommentSchema.parse(req.body);
      const comment = await storage.createComment(commentData);
      res.status(201).json(comment);
    } catch (error) {
      if (error instanceof ZodError) {
        return handleZodError(error, res);
      }
      res.status(500).json({ message: "Failed to create comment" });
    }
  });

  // ACHIEVEMENTS
  app.get("/api/achievements", async (req, res) => {
    try {
      const achievements = await storage.getAllAchievements();
      res.json(achievements);
    } catch (error) {
      res.status(500).json({ message: "Failed to get achievements" });
    }
  });

  app.get("/api/users/:userId/achievements", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const userAchievements = await storage.getUserAchievementsByUser(userId);
      
      // Get full achievement details
      const achievementIds = userAchievements.map(ua => ua.achievementId);
      const achievements = await Promise.all(
        achievementIds.map(id => storage.getAchievement(id))
      );
      
      const completeAchievements = userAchievements.map((ua, index) => ({
        ...ua,
        achievement: achievements[index]
      }));
      
      res.json(completeAchievements);
    } catch (error) {
      res.status(500).json({ message: "Failed to get user achievements" });
    }
  });

  app.post("/api/user-achievements", async (req, res) => {
    try {
      const userAchievementData = insertUserAchievementSchema.parse(req.body);
      const userAchievement = await storage.createUserAchievement(userAchievementData);
      res.status(201).json(userAchievement);
    } catch (error) {
      if (error instanceof ZodError) {
        return handleZodError(error, res);
      }
      res.status(500).json({ message: "Failed to create user achievement" });
    }
  });

  // EVENTS
  app.get("/api/events", async (req, res) => {
    try {
      const events = await storage.getAllEvents();
      res.json(events);
    } catch (error) {
      res.status(500).json({ message: "Failed to get events" });
    }
  });

  app.get("/api/events/upcoming", async (req, res) => {
    try {
      const events = await storage.getUpcomingEvents();
      res.json(events);
    } catch (error) {
      res.status(500).json({ message: "Failed to get upcoming events" });
    }
  });

  app.get("/api/events/:id", async (req, res) => {
    try {
      const eventId = parseInt(req.params.id);
      const event = await storage.getEvent(eventId);
      
      if (!event) {
        return res.status(404).json({ message: "Event not found" });
      }
      
      res.json(event);
    } catch (error) {
      res.status(500).json({ message: "Failed to get event" });
    }
  });

  app.post("/api/user-events", async (req, res) => {
    try {
      const userEventData = insertUserEventSchema.parse(req.body);
      const userEvent = await storage.createUserEvent(userEventData);
      res.status(201).json(userEvent);
    } catch (error) {
      if (error instanceof ZodError) {
        return handleZodError(error, res);
      }
      res.status(500).json({ message: "Failed to register for event" });
    }
  });

  app.get("/api/users/:userId/events", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const userEvents = await storage.getUserEventsByUser(userId);
      res.json(userEvents);
    } catch (error) {
      res.status(500).json({ message: "Failed to get user events" });
    }
  });

  // Event registration endpoint for community events
  app.post("/api/events/:id/register", async (req: Request, res: Response) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ message: "Not authenticated" });
      }

      const eventId = parseInt(req.params.id);
      const { eventType = 'college' } = req.body;

      // For now, use the existing user events system
      const userEventData = insertUserEventSchema.parse({
        userId,
        eventId,
        registrationStatus: 'registered'
      });
      
      const userEvent = await storage.createUserEvent(userEventData);
      res.status(201).json({ message: "Successfully registered for event", userEvent });
    } catch (error) {
      if (error instanceof ZodError) {
        return handleZodError(error, res);
      }
      console.error("Error registering for event:", error);
      res.status(500).json({ message: "Failed to register for event" });
    }
  });

  // DAILY BYTES
  app.get("/api/daily-bytes", async (req, res) => {
    try {
      const dailyBytes = await storage.getAllDailyBytes();
      res.json(dailyBytes);
    } catch (error) {
      res.status(500).json({ message: "Failed to get daily bytes" });
    }
  });

  app.get("/api/daily-bytes/today", async (req, res) => {
    try {
      const dailyByte = await storage.getTodaysDailyByte();
      if (!dailyByte) {
        return res.status(404).json({ message: "No daily byte available for today" });
      }
      res.json(dailyByte);
    } catch (error) {
      res.status(500).json({ message: "Failed to get today's daily byte" });
    }
  });

  app.get("/api/daily-bytes/:id", async (req, res) => {
    try {
      const dailyByteId = parseInt(req.params.id);
      const dailyByte = await storage.getDailyByte(dailyByteId);
      
      if (!dailyByte) {
        return res.status(404).json({ message: "Daily byte not found" });
      }
      
      res.json(dailyByte);
    } catch (error) {
      res.status(500).json({ message: "Failed to get daily byte" });
    }
  });

  app.post("/api/daily-bytes", async (req, res) => {
    try {
      const dailyByteData = insertDailyByteSchema.parse(req.body);
      const dailyByte = await storage.createDailyByte(dailyByteData);
      res.status(201).json(dailyByte);
    } catch (error) {
      if (error instanceof ZodError) {
        return handleZodError(error, res);
      }
      res.status(500).json({ message: "Failed to create daily byte" });
    }
  });

  app.post("/api/user-daily-bytes", async (req, res) => {
    try {
      const userDailyByteData = insertUserDailyByteSchema.parse(req.body);
      
      // Check if the user has already completed this daily byte
      const existingUserDailyByte = await storage.getUserDailyByteByDailyByteAndUser(
        userDailyByteData.dailyByteId,
        userDailyByteData.userId
      );
      
      if (existingUserDailyByte) {
        return res.status(400).json({ 
          message: "User has already completed this daily byte",
          userDailyByte: existingUserDailyByte
        });
      }
      
      const userDailyByte = await storage.createUserDailyByte(userDailyByteData);
      res.status(201).json(userDailyByte);
    } catch (error) {
      if (error instanceof ZodError) {
        return handleZodError(error, res);
      }
      res.status(500).json({ message: "Failed to complete daily byte" });
    }
  });

  app.get("/api/users/:userId/daily-bytes", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const userDailyBytes = await storage.getUserDailyBytesByUser(userId);
      res.json(userDailyBytes);
    } catch (error) {
      res.status(500).json({ message: "Failed to get user daily bytes" });
    }
  });

  app.patch("/api/user-daily-bytes/:id", async (req, res) => {
    try {
      const userDailyByteId = parseInt(req.params.id);
      const updatedUserDailyByte = await storage.updateUserDailyByte(userDailyByteId, req.body);
      res.json(updatedUserDailyByte);
    } catch (error) {
      res.status(500).json({ message: "Failed to update user daily byte" });
    }
  });

  // DASHBOARD DATA
  app.get("/api/users/:userId/dashboard", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      
      // Get all the required data for the dashboard
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const [
        quizResults,
        enrollments,
        userProjects,
        userAchievements,
        recommendedCourses,
        recommendedProjects,
        upcomingEvents,
        recentPosts,
        todaysDailyByte,
        userDailyBytes
      ] = await Promise.all([
        storage.getQuizResultsByUser(userId),
        storage.getEnrollmentsByUser(userId),
        storage.getUserProjectsByUser(userId),
        storage.getUserAchievementsByUser(userId),
        storage.getRecommendedCourses(userId),
        storage.getRecommendedProjects(userId),
        storage.getUpcomingEvents(),
        storage.getRecentPosts(5),
        storage.getTodaysDailyByte(),
        storage.getUserDailyBytesByUser(userId)
      ]);
      
      // Calculate overall progress
      const totalMilestones = 4; // Career Assessment, Niche Selection, Core Courses, Projects
      let completedMilestones = 0;
      
      // Check if career assessment is completed
      if (quizResults.length > 0) {
        completedMilestones++;
      }
      
      // Check if niche selection is completed
      if (quizResults.some(result => result.recommendedNiches.length > 0)) {
        completedMilestones++;
      }
      
      // Calculate course progress
      const totalCourses = 5;
      const completedCourses = enrollments.filter(enrollment => enrollment.isCompleted).length;
      
      // Calculate project progress
      const totalProjectsRequired = 2;
      const completedProjects = userProjects.filter(project => project.isCompleted).length;
      
      // Get achievements with details
      const achievementIds = userAchievements.map(ua => ua.achievementId);
      const achievementsData = await Promise.all(
        achievementIds.map(id => storage.getAchievement(id))
      );
      
      const achievements = userAchievements.map((ua, index) => ({
        ...ua,
        achievement: achievementsData[index]
      }));
      
      // Calculate overall progress percentage
      const progressPercentage = Math.round((completedMilestones / totalMilestones) * 100);
      
      // Check if the user has completed today's daily byte
      let dailyByteCompleted = false;
      if (todaysDailyByte) {
        dailyByteCompleted = userDailyBytes.some(
          udb => udb.dailyByteId === todaysDailyByte.id
        );
      }

      res.json({
        user,
        progress: {
          percentage: progressPercentage,
          careerAssessment: quizResults.length > 0,
          nicheSelection: quizResults.some(result => result.recommendedNiches.length > 0),
          coreCourses: {
            completed: completedCourses,
            total: totalCourses
          },
          projects: {
            completed: completedProjects,
            total: totalProjectsRequired
          }
        },
        careerPath: quizResults.length > 0 ? {
          title: quizResults[0].recommendedCareer,
          match: 95,  // Placeholder value
          niches: quizResults[0].recommendedNiches
        } : null,
        achievements,
        recommendedCourses,
        recommendedProject: recommendedProjects.length > 0 ? recommendedProjects[0] : null,
        upcomingEvents,
        communityPosts: recentPosts,
        dailyByte: todaysDailyByte ? {
          ...todaysDailyByte,
          completed: dailyByteCompleted
        } : null,
        dailyByteStreak: userDailyBytes.length
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to get dashboard data" });
    }
  });

  // AUTHENTICATION ROUTES
  // Register endpoint
  app.post("/api/auth/register", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      
      // Check if username or email already exists
      const existingUserByUsername = await storage.getUserByUsername(userData.username);
      if (existingUserByUsername) {
        return res.status(400).json({ message: "Username already exists" });
      }
      
      const existingUserByEmail = await storage.getUserByEmail(userData.email);
      if (existingUserByEmail) {
        return res.status(400).json({ message: "Email already exists" });
      }

      // Create the user
      const user = await storage.createUser(userData);
      
      // Automatically log in the user after registration
      req.login(user, (err) => {
        if (err) {
          return res.status(500).json({ message: "Error during login after registration" });
        }
        
        // Don't send password to client
        const { password, ...userWithoutPassword } = user;
        return res.json({ 
          message: "Registration successful", 
          user: userWithoutPassword 
        });
      });
    } catch (error) {
      if (error instanceof ZodError) {
        return handleZodError(error, res);
      }
      console.error("Registration error:", error);
      res.status(500).json({ message: "Failed to register user" });
    }
  });
  
  // Login
  app.post("/api/auth/login", (req, res, next) => {
    passport.authenticate("local", (err: Error | null, user: any, info: { message?: string }) => {
      if (err) {
        return next(err);
      }
      if (!user) {
        return res.status(401).json({ message: info.message || "Authentication failed" });
      }
      
      req.logIn(user, (err) => {
        if (err) {
          return next(err);
        }
        
        // Don't send password to client
        const { password, ...userWithoutPassword } = user;
        return res.json({ 
          message: "Login successful", 
          user: userWithoutPassword 
        });
      });
    })(req, res, next);
  });
  
  // Logout
  app.post("/api/auth/logout", (req, res) => {
    req.logout((err) => {
      if (err) {
        return res.status(500).json({ message: "Error during logout" });
      }
      res.json({ message: "Logged out successfully" });
    });
  });
  
  // Check if user is authenticated
  app.get("/api/auth/status", (req, res) => {
    if (req.isAuthenticated()) {
      // Don't send password to client
      const { password, ...userWithoutPassword } = req.user as any;
      res.json({ 
        isAuthenticated: true,
        user: userWithoutPassword
      });
    } else {
      res.json({ 
        isAuthenticated: false 
      });
    }
  });
  
  // Get current user data
  app.get("/api/auth/me", (req, res) => {
    if (req.isAuthenticated()) {
      // Don't send password to client
      const { password, ...userWithoutPassword } = req.user as any;
      res.json({ 
        user: userWithoutPassword
      });
    } else {
      res.status(401).json({ 
        message: "Not authenticated" 
      });
    }
  });

  // Route modules registered at the top to avoid conflicts
  // Additional RBAC middleware for specific routes if needed
  
  // Register Analytics routes
  app.use('/api/analytics', analyticsRoutes);
  
  // Register Dashboard routes
  app.use('/api/dashboard', dashboardRoutes);
  
  // Register Search routes
  app.use('/api/search', searchRoutes);
  
  // Register Upload routes
  app.use('/api/upload', uploadRoutes);
  
  // Register Advanced Authentication routes
  app.use('/api/auth', authAdvancedRoutes);
  
  // Register Admin Logs routes
  app.use('/api/admin-logs', adminLogsRoutes);

  // Initialize admin logging for system startup
  AdminLogger.logSystem(
    "SYSTEM_STARTUP",
    "CareerOS server started successfully",
    undefined,
    { nodeEnv: process.env.NODE_ENV, port: process.env.PORT || 5000 }
  );

  const httpServer = createServer(app);
  
  // Initialize WebSocket server for expert chat
  new ExpertChatWebSocket(httpServer);
  
  return httpServer;
}
