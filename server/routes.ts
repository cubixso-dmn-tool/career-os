import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, type WebSocket } from "ws";
import { storage } from "./storage";
import { ZodError } from "zod";

// Helper function to handle ZodErrors
function handleZodError(error: ZodError, res: Response) {
  return res.status(400).json({ 
    message: "Validation error", 
    errors: error.errors.map(err => ({
      path: err.path.join('.'),
      message: err.message
    }))
  });
}
import passport from "passport";
import { isAuthenticated, isAdmin, isCommunityFounder, isVerified, isCommunityMember, isCommunityAdminOrModerator } from "./middleware/auth";
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
  insertUserDailyByteSchema,
  insertCommunitySchema,
  insertCommunityMemberSchema,
  insertCommunityPostSchema,
  insertCommunityPostCommentSchema,
  insertCommunityEventSchema,
  insertCommunityEventAttendeeSchema,
  insertPollSchema,
  insertPollResponseSchema,
  insertFlaggedContentSchema,
  insertCommunityCollaborationSchema
} from "@shared/schema";
import { 
  generateCareerRecommendations,
  chatWithPathFinder
} from "./lib/openai";

// Community types and interfaces
interface CommunityPostData {
  communityId: number;
  title: string;
  content: string;
  type: 'announcement' | 'discussion' | 'event' | 'job' | 'blog';
  authorId: number;
  scheduleDate?: string;
}

interface CommunityEventData {
  communityId: number;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  location: string;
  isOnline: boolean;
  organizerId: number;
}

interface CommunityPollData {
  communityId: number;
  question: string;
  options: string[];
  expiresAt?: string;
  authorId: number;
}

interface CommunityMembershipData {
  userId: number;
  communityId: number;
  role: 'member' | 'moderator' | 'admin';
}

interface FlaggedContentData {
  contentId: number;
  contentType: 'post' | 'comment' | 'poll';
  reporterId: number;
  reason: string;
}

interface CommunityCollaborationData {
  sourceCommunityId: number;
  targetCommunityId: number;
  type: 'event' | 'project';
  status: 'pending' | 'approved' | 'rejected';
  details: string;
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Set up authentication
  const { setupAuth } = require('./auth');
  setupAuth(app);
  
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

  // COURSES
  app.get("/api/courses", async (req, res) => {
    try {
      const { category, tags, isFree } = req.query;
      
      let parsedTags: string[] | undefined;
      if (tags && typeof tags === 'string') {
        parsedTags = tags.split(',');
      }
      
      let parsedIsFree: boolean | undefined;
      if (isFree !== undefined) {
        parsedIsFree = isFree === 'true';
      }
      
      const courses = await storage.getFilteredCourses(
        category as string | undefined,
        parsedTags,
        parsedIsFree
      );
      
      res.json(courses);
    } catch (error) {
      res.status(500).json({ message: "Failed to get courses" });
    }
  });

  app.get("/api/courses/:id", async (req, res) => {
    try {
      const courseId = parseInt(req.params.id);
      const course = await storage.getCourse(courseId);
      
      if (!course) {
        return res.status(404).json({ message: "Course not found" });
      }
      
      res.json(course);
    } catch (error) {
      res.status(500).json({ message: "Failed to get course" });
    }
  });

  app.get("/api/users/:userId/recommended-courses", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const courses = await storage.getRecommendedCourses(userId);
      res.json(courses);
    } catch (error) {
      res.status(500).json({ message: "Failed to get recommended courses" });
    }
  });

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

  // RESUME
  app.post("/api/resumes", async (req, res) => {
    try {
      const resumeData = insertResumeSchema.parse(req.body);
      const resume = await storage.createResume(resumeData);
      res.status(201).json(resume);
    } catch (error) {
      if (error instanceof ZodError) {
        return handleZodError(error, res);
      }
      res.status(500).json({ message: "Failed to create resume" });
    }
  });

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

  app.patch("/api/resumes/:id", async (req, res) => {
    try {
      const resumeId = parseInt(req.params.id);
      const updatedResume = await storage.updateResume(resumeId, req.body);
      res.json(updatedResume);
    } catch (error) {
      res.status(500).json({ message: "Failed to update resume" });
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

  // ----------- COMMUNITY MANAGEMENT API ROUTES -----------

  // COMMUNITIES
  app.get("/api/communities", async (req, res) => {
    try {
      // If verified flag is passed, only get verified communities
      const { verified } = req.query;
      
      let communities;
      if (verified === 'true') {
        communities = await storage.getVerifiedCommunities();
      } else {
        communities = await storage.getAllCommunities();
      }
      
      res.json(communities);
    } catch (error) {
      res.status(500).json({ message: "Failed to get communities" });
    }
  });
  
  app.post("/api/communities", isAuthenticated, isVerified, async (req, res) => {
    try {
      const communityData = insertCommunitySchema.parse({
        ...req.body,
        founderId: req.user.id  // Set the current user as the founder
      });
      
      // Check if community name already exists
      const existingCommunity = await storage.getCommunityByName(communityData.name);
      if (existingCommunity) {
        return res.status(400).json({ message: "Community name already exists" });
      }
      
      const community = await storage.createCommunity(communityData);
      res.status(201).json(community);
    } catch (error) {
      if (error instanceof ZodError) {
        return handleZodError(error, res);
      }
      res.status(500).json({ message: "Failed to create community" });
    }
  });
  
  app.get("/api/communities/:id", async (req, res) => {
    try {
      const communityId = parseInt(req.params.id);
      const community = await storage.getCommunity(communityId);
      
      if (!community) {
        return res.status(404).json({ message: "Community not found" });
      }
      
      res.json(community);
    } catch (error) {
      res.status(500).json({ message: "Failed to get community" });
    }
  });
  
  app.patch("/api/communities/:id", isAuthenticated, isCommunityFounder, async (req, res) => {
    try {
      const communityId = parseInt(req.params.id);
      
      // Don't allow changing founderId
      const { founderId, ...updateData } = req.body;
      
      // If updating the name, check if it already exists
      if (updateData.name) {
        const existingCommunity = await storage.getCommunityByName(updateData.name);
        if (existingCommunity && existingCommunity.id !== communityId) {
          return res.status(400).json({ message: "Community name already exists" });
        }
      }
      
      const updatedCommunity = await storage.updateCommunity(communityId, updateData);
      res.json(updatedCommunity);
    } catch (error) {
      res.status(500).json({ message: "Failed to update community" });
    }
  });
  
  app.get("/api/users/:userId/communities/founded", isAuthenticated, async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      
      // Only the user or an admin can see this
      if (req.user.id !== userId && req.user.role !== 'admin') {
        return res.status(403).json({ message: "Unauthorized" });
      }
      
      const communities = await storage.getCommunitiesByFounder(userId);
      res.json(communities);
    } catch (error) {
      res.status(500).json({ message: "Failed to get founded communities" });
    }
  });

  // COMMUNITY MEMBERS
  app.get("/api/communities/:communityId/members", async (req, res) => {
    try {
      const communityId = parseInt(req.params.communityId);
      const { role } = req.query;
      
      let members;
      if (role) {
        members = await storage.getCommunityMembersByRole(communityId, role as string);
      } else {
        members = await storage.getCommunityMembers(communityId);
      }
      
      res.json(members);
    } catch (error) {
      res.status(500).json({ message: "Failed to get community members" });
    }
  });
  
  app.post("/api/communities/:communityId/members", isAuthenticated, async (req, res) => {
    try {
      const communityId = parseInt(req.params.communityId);
      
      // Check if the community exists
      const community = await storage.getCommunity(communityId);
      if (!community) {
        return res.status(404).json({ message: "Community not found" });
      }
      
      // Check if user is already a member
      const existingMember = await storage.getCommunityMember(communityId, req.user.id);
      if (existingMember) {
        return res.status(400).json({ message: "User is already a member of this community" });
      }
      
      const memberData = insertCommunityMemberSchema.parse({
        communityId,
        userId: req.user.id,
        role: 'member',  // Default role for new members
        isActive: true
      });
      
      const member = await storage.createCommunityMember(memberData);
      res.status(201).json(member);
    } catch (error) {
      if (error instanceof ZodError) {
        return handleZodError(error, res);
      }
      res.status(500).json({ message: "Failed to join community" });
    }
  });
  
  app.patch("/api/communities/:communityId/members/:userId", isAuthenticated, isCommunityAdminOrModerator, async (req, res) => {
    try {
      const communityId = parseInt(req.params.communityId);
      const userId = parseInt(req.params.userId);
      
      // Get the member
      const member = await storage.getCommunityMember(communityId, userId);
      if (!member) {
        return res.status(404).json({ message: "Member not found" });
      }
      
      // Founder can't be removed or have their role changed by others
      if (req.user.id !== communityId && member.role === 'admin') {
        const community = await storage.getCommunity(communityId);
        if (community && community.founderId === userId) {
          return res.status(403).json({ message: "Cannot modify the founder's membership" });
        }
      }
      
      // Only founders can promote to admin
      if (req.body.role === 'admin') {
        const community = await storage.getCommunity(communityId);
        if (community && community.founderId !== req.user.id) {
          return res.status(403).json({ message: "Only the founder can promote to admin" });
        }
      }
      
      const updatedMember = await storage.updateCommunityMember(communityId, userId, req.body);
      res.json(updatedMember);
    } catch (error) {
      res.status(500).json({ message: "Failed to update member" });
    }
  });
  
  app.delete("/api/communities/:communityId/members/:userId", isAuthenticated, async (req, res) => {
    try {
      const communityId = parseInt(req.params.communityId);
      const userId = parseInt(req.params.userId);
      
      // Get the member
      const member = await storage.getCommunityMember(communityId, userId);
      if (!member) {
        return res.status(404).json({ message: "Member not found" });
      }
      
      // Users can leave communities they're a member of
      if (req.user.id === userId) {
        // But founders can't leave their own community
        const community = await storage.getCommunity(communityId);
        if (community && community.founderId === userId) {
          return res.status(403).json({ message: "Founders cannot leave their own community" });
        }
        
        // Mark the member as inactive instead of deleting
        await storage.updateCommunityMember(communityId, userId, { isActive: false });
        return res.json({ message: "Successfully left the community" });
      }
      
      // Only admins/moderators can remove other members
      const requesterMember = await storage.getCommunityMember(communityId, req.user.id);
      if (!requesterMember || (requesterMember.role !== 'admin' && requesterMember.role !== 'moderator')) {
        return res.status(403).json({ message: "You don't have permission to remove members" });
      }
      
      // Moderators can't remove admins
      if (requesterMember.role === 'moderator' && member.role === 'admin') {
        return res.status(403).json({ message: "Moderators cannot remove admins" });
      }
      
      // Mark the member as inactive instead of deleting
      await storage.updateCommunityMember(communityId, userId, { isActive: false });
      res.json({ message: "Member removed successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to remove member" });
    }
  });

  // COMMUNITY POSTS
  app.get("/api/communities/:communityId/posts", async (req, res) => {
    try {
      const communityId = parseInt(req.params.communityId);
      const { type, featured } = req.query;
      
      let posts;
      if (featured === 'true') {
        posts = await storage.getFeaturedCommunityPosts(communityId);
      } else if (type) {
        posts = await storage.getCommunityPostsByType(communityId, type as string);
      } else {
        posts = await storage.getCommunityPosts(communityId);
      }
      
      res.json(posts);
    } catch (error) {
      res.status(500).json({ message: "Failed to get community posts" });
    }
  });
  
  app.post("/api/communities/:communityId/posts", isAuthenticated, isCommunityMember, async (req, res) => {
    try {
      const communityId = parseInt(req.params.communityId);
      
      const postData = insertCommunityPostSchema.parse({
        ...req.body,
        communityId,
        userId: req.user.id,
        authorId: req.user.id
      });
      
      const post = await storage.createCommunityPost(postData);
      res.status(201).json(post);
    } catch (error) {
      if (error instanceof ZodError) {
        return handleZodError(error, res);
      }
      res.status(500).json({ message: "Failed to create post" });
    }
  });
  
  app.get("/api/community-posts/:id", async (req, res) => {
    try {
      const postId = parseInt(req.params.id);
      const post = await storage.getCommunityPost(postId);
      
      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }
      
      // Increment view count
      await storage.updateCommunityPost(postId, { views: post.views + 1 });
      
      // Return the original post (without updated view count)
      res.json(post);
    } catch (error) {
      res.status(500).json({ message: "Failed to get post" });
    }
  });
  
  app.patch("/api/community-posts/:id", isAuthenticated, async (req, res) => {
    try {
      const postId = parseInt(req.params.id);
      const post = await storage.getCommunityPost(postId);
      
      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }
      
      // Only author, community admin/moderators, or site admin can edit
      if (post.authorId !== req.user.id) {
        const member = await storage.getCommunityMember(post.communityId, req.user.id);
        if ((!member || (member.role !== 'admin' && member.role !== 'moderator')) && 
            req.user.role !== 'admin') {
          return res.status(403).json({ message: "You don't have permission to edit this post" });
        }
      }
      
      const updatedPost = await storage.updateCommunityPost(postId, req.body);
      res.json(updatedPost);
    } catch (error) {
      res.status(500).json({ message: "Failed to update post" });
    }
  });

  // COMMUNITY POST COMMENTS
  app.get("/api/community-posts/:postId/comments", async (req, res) => {
    try {
      const postId = parseInt(req.params.postId);
      const comments = await storage.getCommunityPostComments(postId);
      res.json(comments);
    } catch (error) {
      res.status(500).json({ message: "Failed to get comments" });
    }
  });
  
  app.post("/api/community-posts/:postId/comments", isAuthenticated, async (req, res) => {
    try {
      const postId = parseInt(req.params.postId);
      
      // Check if post exists
      const post = await storage.getCommunityPost(postId);
      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }
      
      // Check if user is a member of the community
      const member = await storage.getCommunityMember(post.communityId, req.user.id);
      if (!member || !member.isActive) {
        return res.status(403).json({ message: "You must be a member of the community to comment" });
      }
      
      const commentData = insertCommunityPostCommentSchema.parse({
        ...req.body,
        postId,
        userId: req.user.id
      });
      
      const comment = await storage.createCommunityPostComment(commentData);
      res.status(201).json(comment);
    } catch (error) {
      if (error instanceof ZodError) {
        return handleZodError(error, res);
      }
      res.status(500).json({ message: "Failed to create comment" });
    }
  });
  
  app.patch("/api/community-post-comments/:id", isAuthenticated, async (req, res) => {
    try {
      const commentId = parseInt(req.params.id);
      const comment = await storage.getCommunityPostComment(commentId);
      
      if (!comment) {
        return res.status(404).json({ message: "Comment not found" });
      }
      
      // Only the author, community admin/moderators, or site admin can edit
      if (comment.userId !== req.user.id) {
        const post = await storage.getCommunityPost(comment.postId);
        if (!post) {
          return res.status(404).json({ message: "Associated post not found" });
        }
        
        const member = await storage.getCommunityMember(post.communityId, req.user.id);
        if ((!member || (member.role !== 'admin' && member.role !== 'moderator')) && 
            req.user.role !== 'admin') {
          return res.status(403).json({ message: "You don't have permission to edit this comment" });
        }
      }
      
      const updatedComment = await storage.updateCommunityPostComment(commentId, req.body);
      res.json(updatedComment);
    } catch (error) {
      res.status(500).json({ message: "Failed to update comment" });
    }
  });

  // COMMUNITY EVENTS
  app.get("/api/communities/:communityId/events", async (req, res) => {
    try {
      const communityId = parseInt(req.params.communityId);
      const { upcoming } = req.query;
      
      let events;
      if (upcoming === 'true') {
        events = await storage.getUpcomingCommunityEvents(communityId);
      } else {
        events = await storage.getCommunityEvents(communityId);
      }
      
      res.json(events);
    } catch (error) {
      res.status(500).json({ message: "Failed to get community events" });
    }
  });
  
  app.post("/api/communities/:communityId/events", isAuthenticated, isCommunityAdminOrModerator, async (req, res) => {
    try {
      const communityId = parseInt(req.params.communityId);
      
      const eventData = insertCommunityEventSchema.parse({
        ...req.body,
        communityId,
        createdBy: req.user.id,
        organizerId: req.user.id
      });
      
      const event = await storage.createCommunityEvent(eventData);
      res.status(201).json(event);
    } catch (error) {
      if (error instanceof ZodError) {
        return handleZodError(error, res);
      }
      res.status(500).json({ message: "Failed to create event" });
    }
  });
  
  app.get("/api/community-events/:id", async (req, res) => {
    try {
      const eventId = parseInt(req.params.id);
      const event = await storage.getCommunityEvent(eventId);
      
      if (!event) {
        return res.status(404).json({ message: "Event not found" });
      }
      
      res.json(event);
    } catch (error) {
      res.status(500).json({ message: "Failed to get event" });
    }
  });
  
  app.patch("/api/community-events/:id", isAuthenticated, async (req, res) => {
    try {
      const eventId = parseInt(req.params.id);
      const event = await storage.getCommunityEvent(eventId);
      
      if (!event) {
        return res.status(404).json({ message: "Event not found" });
      }
      
      // Only organizer, community admin/moderators, or site admin can edit
      if (event.organizerId !== req.user.id) {
        const member = await storage.getCommunityMember(event.communityId, req.user.id);
        if ((!member || (member.role !== 'admin' && member.role !== 'moderator')) && 
            req.user.role !== 'admin') {
          return res.status(403).json({ message: "You don't have permission to edit this event" });
        }
      }
      
      const updatedEvent = await storage.updateCommunityEvent(eventId, req.body);
      res.json(updatedEvent);
    } catch (error) {
      res.status(500).json({ message: "Failed to update event" });
    }
  });

  // COMMUNITY EVENT ATTENDEES
  app.get("/api/community-events/:eventId/attendees", async (req, res) => {
    try {
      const eventId = parseInt(req.params.eventId);
      const attendees = await storage.getCommunityEventAttendees(eventId);
      res.json(attendees);
    } catch (error) {
      res.status(500).json({ message: "Failed to get event attendees" });
    }
  });
  
  app.post("/api/community-events/:eventId/attendees", isAuthenticated, async (req, res) => {
    try {
      const eventId = parseInt(req.params.eventId);
      
      // Check if event exists
      const event = await storage.getCommunityEvent(eventId);
      if (!event) {
        return res.status(404).json({ message: "Event not found" });
      }
      
      // Check if user is a member of the community
      const member = await storage.getCommunityMember(event.communityId, req.user.id);
      if (!member || !member.isActive) {
        return res.status(403).json({ message: "You must be a member of the community to register for events" });
      }
      
      // Check if user is already registered
      const existingAttendee = await storage.getCommunityEventAttendee(eventId, req.user.id);
      if (existingAttendee) {
        return res.status(400).json({ message: "You are already registered for this event" });
      }
      
      const attendeeData = insertCommunityEventAttendeeSchema.parse({
        eventId,
        userId: req.user.id,
        status: 'registered',
        attendanceConfirmed: false
      });
      
      const attendee = await storage.createCommunityEventAttendee(attendeeData);
      res.status(201).json(attendee);
    } catch (error) {
      if (error instanceof ZodError) {
        return handleZodError(error, res);
      }
      res.status(500).json({ message: "Failed to register for event" });
    }
  });
  
  app.patch("/api/community-events/:eventId/attendees/:userId", isAuthenticated, async (req, res) => {
    try {
      const eventId = parseInt(req.params.eventId);
      const userId = parseInt(req.params.userId);
      
      // Get the event
      const event = await storage.getCommunityEvent(eventId);
      if (!event) {
        return res.status(404).json({ message: "Event not found" });
      }
      
      // Check if the attendee exists
      const attendee = await storage.getCommunityEventAttendee(eventId, userId);
      if (!attendee) {
        return res.status(404).json({ message: "Attendee not found" });
      }
      
      // Users can update their own attendance status, or event organizers/admins can update anyone's
      if (req.user.id !== userId && event.organizerId !== req.user.id) {
        const member = await storage.getCommunityMember(event.communityId, req.user.id);
        if ((!member || (member.role !== 'admin' && member.role !== 'moderator')) && 
            req.user.role !== 'admin') {
          return res.status(403).json({ message: "You don't have permission to update this attendee" });
        }
      }
      
      // Only organizers and admins can confirm attendance
      if (req.body.attendanceConfirmed !== undefined && req.user.id !== event.organizerId) {
        const member = await storage.getCommunityMember(event.communityId, req.user.id);
        if ((!member || member.role !== 'admin') && req.user.role !== 'admin') {
          return res.status(403).json({ message: "Only organizers and admins can confirm attendance" });
        }
      }
      
      const updatedAttendee = await storage.updateCommunityEventAttendee(eventId, userId, req.body);
      res.json(updatedAttendee);
    } catch (error) {
      res.status(500).json({ message: "Failed to update attendee" });
    }
  });

  // POLLS
  app.get("/api/community-posts/:postId/polls", async (req, res) => {
    try {
      const postId = parseInt(req.params.postId);
      const polls = await storage.getPollsByPost(postId);
      res.json(polls);
    } catch (error) {
      res.status(500).json({ message: "Failed to get polls" });
    }
  });
  
  app.post("/api/community-posts/:postId/polls", isAuthenticated, async (req, res) => {
    try {
      const postId = parseInt(req.params.postId);
      
      // Check if post exists
      const post = await storage.getCommunityPost(postId);
      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }
      
      // Only post author, community admin/moderators, or site admin can create polls
      if (post.authorId !== req.user.id) {
        const member = await storage.getCommunityMember(post.communityId, req.user.id);
        if ((!member || (member.role !== 'admin' && member.role !== 'moderator')) && 
            req.user.role !== 'admin') {
          return res.status(403).json({ message: "You don't have permission to create polls for this post" });
        }
      }
      
      const pollData = insertPollSchema.parse({
        ...req.body,
        postId,
        creatorId: req.user.id
      });
      
      const poll = await storage.createPoll(pollData);
      res.status(201).json(poll);
    } catch (error) {
      if (error instanceof ZodError) {
        return handleZodError(error, res);
      }
      res.status(500).json({ message: "Failed to create poll" });
    }
  });
  
  app.get("/api/polls/:id", async (req, res) => {
    try {
      const pollId = parseInt(req.params.id);
      const poll = await storage.getPoll(pollId);
      
      if (!poll) {
        return res.status(404).json({ message: "Poll not found" });
      }
      
      res.json(poll);
    } catch (error) {
      res.status(500).json({ message: "Failed to get poll" });
    }
  });
  
  app.get("/api/polls/:id/responses", async (req, res) => {
    try {
      const pollId = parseInt(req.params.id);
      const responses = await storage.getPollResponsesByPoll(pollId);
      res.json(responses);
    } catch (error) {
      res.status(500).json({ message: "Failed to get poll responses" });
    }
  });
  
  app.post("/api/polls/:id/responses", isAuthenticated, async (req, res) => {
    try {
      const pollId = parseInt(req.params.id);
      
      // Check if poll exists
      const poll = await storage.getPoll(pollId);
      if (!poll) {
        return res.status(404).json({ message: "Poll not found" });
      }
      
      // Check if post exists and get community ID
      const post = await storage.getCommunityPost(poll.postId);
      if (!post) {
        return res.status(404).json({ message: "Associated post not found" });
      }
      
      // Check if user is a community member
      const member = await storage.getCommunityMember(post.communityId, req.user.id);
      if (!member || !member.isActive) {
        return res.status(403).json({ message: "You must be a member of the community to respond to polls" });
      }
      
      // Check if user has already responded
      const existingResponse = await storage.getPollResponseByPollAndUser(pollId, req.user.id);
      if (existingResponse) {
        return res.status(400).json({ message: "You have already responded to this poll" });
      }
      
      const responseData = insertPollResponseSchema.parse({
        ...req.body,
        pollId,
        userId: req.user.id
      });
      
      const response = await storage.createPollResponse(responseData);
      res.status(201).json(response);
    } catch (error) {
      if (error instanceof ZodError) {
        return handleZodError(error, res);
      }
      res.status(500).json({ message: "Failed to submit poll response" });
    }
  });

  // FLAGGED CONTENT
  app.post("/api/flagged-content", isAuthenticated, async (req, res) => {
    try {
      const flaggedContentData = insertFlaggedContentSchema.parse({
        ...req.body,
        reporterId: req.user.id,
        status: 'pending'
      });
      
      const flaggedContent = await storage.createFlaggedContent(flaggedContentData);
      res.status(201).json(flaggedContent);
    } catch (error) {
      if (error instanceof ZodError) {
        return handleZodError(error, res);
      }
      res.status(500).json({ message: "Failed to flag content" });
    }
  });
  
  app.get("/api/flagged-content", isAuthenticated, isAdmin, async (req, res) => {
    try {
      const { status } = req.query;
      
      let flaggedContent;
      if (status) {
        flaggedContent = await storage.getFlaggedContentByStatus(status as string);
      } else {
        // Default to pending
        flaggedContent = await storage.getFlaggedContentByStatus('pending');
      }
      
      res.json(flaggedContent);
    } catch (error) {
      res.status(500).json({ message: "Failed to get flagged content" });
    }
  });
  
  app.patch("/api/flagged-content/:id", isAuthenticated, isAdmin, async (req, res) => {
    try {
      const flaggedContentId = parseInt(req.params.id);
      
      // Auto set reviewerId if status is being updated
      let updates = { ...req.body };
      if (updates.status && updates.status !== 'pending') {
        updates.reviewerId = req.user.id;
      }
      
      const updatedFlaggedContent = await storage.updateFlaggedContent(flaggedContentId, updates);
      res.json(updatedFlaggedContent);
    } catch (error) {
      res.status(500).json({ message: "Failed to update flagged content" });
    }
  });

  // COMMUNITY COLLABORATIONS
  app.get("/api/communities/:communityId/collaborations", isAuthenticated, isCommunityMember, async (req, res) => {
    try {
      const communityId = parseInt(req.params.communityId);
      const { status } = req.query;
      
      let collaborations;
      if (status) {
        collaborations = await storage.getCommunityCollaborationsByStatus(communityId, status as string);
      } else {
        collaborations = await storage.getCommunityCollaborations(communityId);
      }
      
      res.json(collaborations);
    } catch (error) {
      res.status(500).json({ message: "Failed to get collaborations" });
    }
  });
  
  app.post("/api/community-collaborations", isAuthenticated, isCommunityAdminOrModerator, async (req, res) => {
    try {
      const { community1Id, community2Id, description, type } = req.body;
      
      // Validate that both communities exist
      const community1 = await storage.getCommunity(community1Id);
      if (!community1) {
        return res.status(404).json({ message: "First community not found" });
      }
      
      const community2 = await storage.getCommunity(community2Id);
      if (!community2) {
        return res.status(404).json({ message: "Second community not found" });
      }
      
      // Check if the user is an admin or moderator in one of the communities
      const member1 = await storage.getCommunityMember(community1Id, req.user.id);
      const member2 = await storage.getCommunityMember(community2Id, req.user.id);
      
      if ((!member1 || (member1.role !== 'admin' && member1.role !== 'moderator')) && 
          (!member2 || (member2.role !== 'admin' && member2.role !== 'moderator'))) {
        return res.status(403).json({ message: "You must be an admin or moderator in at least one of the communities" });
      }
      
      // Create collaboration with pending status
      const collaborationData = insertCommunityCollaborationSchema.parse({
        community1Id,
        community2Id,
        initiatedById: req.user.id,
        description,
        type,
        status: 'pending'
      });
      
      const collaboration = await storage.createCommunityCollaboration(collaborationData);
      res.status(201).json(collaboration);
    } catch (error) {
      if (error instanceof ZodError) {
        return handleZodError(error, res);
      }
      res.status(500).json({ message: "Failed to create collaboration" });
    }
  });
  
  app.patch("/api/community-collaborations/:id", isAuthenticated, async (req, res) => {
    try {
      const collaborationId = parseInt(req.params.id);
      
      // Get the collaboration
      const collaboration = await storage.getCommunityCollaboration(collaborationId);
      if (!collaboration) {
        return res.status(404).json({ message: "Collaboration not found" });
      }
      
      // Check if user is admin or moderator in one of the communities
      const member1 = await storage.getCommunityMember(collaboration.community1Id, req.user.id);
      const member2 = await storage.getCommunityMember(collaboration.community2Id, req.user.id);
      
      if ((!member1 || (member1.role !== 'admin' && member1.role !== 'moderator')) && 
          (!member2 || (member2.role !== 'admin' && member2.role !== 'moderator')) &&
          req.user.role !== 'admin') {
        return res.status(403).json({ message: "You don't have permission to update this collaboration" });
      }
      
      // If changing status to approved/rejected/completed, add respondedById
      if (req.body.status && req.body.status !== collaboration.status && req.body.status !== 'pending') {
        req.body.respondedById = req.user.id;
      }
      
      const updatedCollaboration = await storage.updateCommunityCollaboration(collaborationId, req.body);
      res.json(updatedCollaboration);
    } catch (error) {
      res.status(500).json({ message: "Failed to update collaboration" });
    }
  });

  // COMMUNITY ENDPOINTS
  // Get all communities
  app.get("/api/communities", async (req, res) => {
    try {
      const { category, search } = req.query;
      
      // Mock implementation for demo purposes
      const communities = [
        {
          id: 1,
          name: "Tech Innovators",
          description: "A community for tech enthusiasts and innovators to share ideas and collaborate on projects.",
          founderId: 1,
          category: "Tech",
          isVerified: true,
          logo: null,
          banner: null,
          memberCount: 250,
          createdAt: new Date().toISOString(),
          founderName: "Admin User"
        },
        {
          id: 2,
          name: "Data Science Hub",
          description: "Connect with data scientists, analysts, and machine learning engineers to discuss the latest trends and techniques.",
          founderId: 1,
          category: "Tech",
          isVerified: true,
          logo: null,
          banner: null,
          memberCount: 180,
          createdAt: new Date().toISOString(),
          founderName: "Admin User"
        },
        {
          id: 3,
          name: "Future Leaders",
          description: "A community for young professionals looking to develop leadership skills and advance their careers.",
          founderId: 2,
          category: "Career",
          isVerified: false,
          logo: null,
          banner: null,
          memberCount: 120,
          createdAt: new Date().toISOString(),
          founderName: "Mentor User"
        },
        {
          id: 4,
          name: "Creative Design Collective",
          description: "A space for designers to share their work, get feedback, and collaborate on projects.",
          founderId: 3,
          category: "Design",
          isVerified: false,
          logo: null,
          banner: null,
          memberCount: 95,
          createdAt: new Date().toISOString(),
          founderName: "Designer User"
        },
        {
          id: 5,
          name: "Entrepreneurship Network",
          description: "Connect with fellow entrepreneurs, share experiences, and learn from each other's successes and failures.",
          founderId: 1,
          category: "Business",
          isVerified: true,
          logo: null,
          banner: null,
          memberCount: 210,
          createdAt: new Date().toISOString(),
          founderName: "Admin User"
        }
      ];
      
      // Filter by category if provided
      let filteredCommunities = communities;
      if (category && typeof category === 'string') {
        filteredCommunities = filteredCommunities.filter(c => 
          c.category.toLowerCase() === category.toLowerCase()
        );
      }
      
      // Search by name or description if provided
      if (search && typeof search === 'string') {
        const searchLower = search.toLowerCase();
        filteredCommunities = filteredCommunities.filter(c => 
          c.name.toLowerCase().includes(searchLower) || 
          c.description.toLowerCase().includes(searchLower)
        );
      }
      
      res.json(filteredCommunities);
    } catch (error) {
      res.status(500).json({ message: "Failed to get communities" });
    }
  });

  // Get communities founded by the user
  app.get("/api/communities/founded", async (req, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      
      // Mock implementation for demo
      const communities = [
        {
          id: 1,
          name: "Tech Innovators",
          description: "A community for tech enthusiasts and innovators to share ideas and collaborate on projects.",
          founderId: 1,
          category: "Tech",
          isVerified: true,
          logo: null,
          banner: null,
          memberCount: 250,
          createdAt: new Date().toISOString(),
          founderName: "Admin User"
        },
        {
          id: 2,
          name: "Data Science Hub",
          description: "Connect with data scientists, analysts, and machine learning engineers to discuss the latest trends and techniques.",
          founderId: 1,
          category: "Tech",
          isVerified: true,
          logo: null,
          banner: null,
          memberCount: 180,
          createdAt: new Date().toISOString(),
          founderName: "Admin User"
        },
        {
          id: 5,
          name: "Entrepreneurship Network",
          description: "Connect with fellow entrepreneurs, share experiences, and learn from each other's successes and failures.",
          founderId: 1,
          category: "Business",
          isVerified: true,
          logo: null,
          banner: null,
          memberCount: 210,
          createdAt: new Date().toISOString(),
          founderName: "Admin User"
        }
      ];
      
      const userCommunities = communities.filter(c => c.founderId === req.user.id);
      res.json(userCommunities);
    } catch (error) {
      res.status(500).json({ message: "Failed to get community list" });
    }
  });

  // Get a specific community
  app.get("/api/communities/:id", async (req, res) => {
    try {
      const communityId = parseInt(req.params.id);
      
      // Mock implementation for demo
      const community = {
        id: communityId,
        name: communityId === 1 ? "Tech Innovators" : "Data Science Hub",
        description: communityId === 1 
          ? "A community for tech enthusiasts and innovators to share ideas and collaborate on projects."
          : "Connect with data scientists, analysts, and machine learning engineers to discuss the latest trends and techniques.",
        founderId: 1,
        category: "Tech",
        isVerified: true,
        logo: null,
        banner: null,
        memberCount: communityId === 1 ? 250 : 180,
        createdAt: new Date().toISOString(),
        founderName: "Admin User",
        rules: [
          "Be respectful to all members",
          "No spam or self-promotion without permission",
          "Stay on topic in discussions",
          "Share knowledge generously",
          "Give credit when using others' work"
        ],
        links: [
          { title: "Community Website", url: "https://example.com" },
          { title: "Resources Repository", url: "https://github.com/example" },
          { title: "Discord Server", url: "https://discord.gg/example" }
        ]
      };
      
      if (!community) {
        return res.status(404).json({ message: "Community not found" });
      }
      
      res.json(community);
    } catch (error) {
      res.status(500).json({ message: "Failed to get community" });
    }
  });

  // Create a new community
  app.post("/api/communities", async (req, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      
      const { name, description, category } = req.body;
      
      if (!name || !description || !category) {
        return res.status(400).json({ message: "Missing required fields" });
      }
      
      // Mock implementation for demo
      const newCommunity = {
        id: 6,  // In a real implementation, this would be auto-generated
        name,
        description,
        founderId: req.user.id,
        category,
        isVerified: false,
        logo: null,
        banner: null,
        memberCount: 1,  // Start with the founder
        createdAt: new Date().toISOString(),
        founderName: req.user.username || "User"
      };
      
      res.status(201).json(newCommunity);
    } catch (error) {
      res.status(500).json({ message: "Failed to create community" });
    }
  });

  // Update community details
  app.patch("/api/communities/:id", async (req, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      
      const communityId = parseInt(req.params.id);
      
      // Mock implementation for demo - check if the user is the founder
      const isFounder = communityId <= 2 && req.user.id === 1;
      
      if (!isFounder) {
        return res.status(403).json({ message: "Permission denied" });
      }
      
      // In a real implementation, you would fetch the community, verify ownership,
      // then update the requested fields
      
      const updatedCommunity = {
        id: communityId,
        name: req.body.name || "Tech Innovators",
        description: req.body.description || "Updated description",
        founderId: 1,
        category: req.body.category || "Tech",
        isVerified: true,
        logo: req.body.logo || null,
        banner: req.body.banner || null,
        memberCount: 250,
        createdAt: new Date().toISOString(),
        founderName: "Admin User",
        rules: req.body.rules || ["Be respectful to all members"],
        links: req.body.links || [{ title: "Community Website", url: "https://example.com" }]
      };
      
      res.json(updatedCommunity);
    } catch (error) {
      res.status(500).json({ message: "Failed to update community" });
    }
  });

  // Get community members
  app.get("/api/communities/:id/members", async (req, res) => {
    try {
      const communityId = parseInt(req.params.id);
      
      // Mock implementation for demo
      const members = [
        {
          userId: 1,
          communityId,
          name: "Admin User",
          avatar: null,
          role: "admin",
          joinedAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(), // 90 days ago
          isActive: true
        },
        {
          userId: 2,
          communityId,
          name: "Mentor User",
          avatar: null,
          role: "moderator",
          joinedAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(), // 60 days ago
          isActive: true
        },
        {
          userId: 3,
          communityId,
          name: "Regular User 1",
          avatar: null,
          role: "member",
          joinedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days ago
          isActive: true
        },
        {
          userId: 4,
          communityId,
          name: "Regular User 2",
          avatar: null,
          role: "member",
          joinedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(), // 15 days ago
          isActive: true
        },
        {
          userId: 5,
          communityId,
          name: "Inactive User",
          avatar: null,
          role: "member",
          joinedAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(), // 45 days ago
          isActive: false
        }
      ];
      
      res.json(members);
    } catch (error) {
      res.status(500).json({ message: "Failed to get community members" });
    }
  });

  // Add/update community membership
  app.post("/api/communities/:id/members", async (req, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      
      const communityId = parseInt(req.params.id);
      const { role } = req.body;
      
      // In a real implementation, you would check permissions if a role is specified
      
      // Mock implementation for demo
      const membership = {
        userId: req.user.id,
        communityId,
        name: req.user.username || "User",
        avatar: null,
        role: role && ["admin", "moderator"].includes(role) ? role : "member",
        joinedAt: new Date().toISOString(),
        isActive: true
      };
      
      res.status(201).json(membership);
    } catch (error) {
      res.status(500).json({ message: "Failed to add member" });
    }
  });

  // Remove community membership
  app.delete("/api/communities/:id/members/:userId", async (req, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      
      const communityId = parseInt(req.params.id);
      const targetUserId = parseInt(req.params.userId);
      
      // In a real implementation, check if the user is an admin or the member being removed
      const canRemove = req.user.id === targetUserId || (communityId <= 2 && req.user.id === 1);
      
      if (!canRemove) {
        return res.status(403).json({ message: "Permission denied" });
      }
      
      res.status(200).json({ message: "Member removed successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to remove member" });
    }
  });

  // Get community posts
  app.get("/api/communities/:id/posts", async (req, res) => {
    try {
      const communityId = parseInt(req.params.id);
      const { type } = req.query;
      
      // Mock implementation for demo
      const posts = [
        {
          id: 1,
          communityId,
          authorId: 1,
          authorName: "Admin User",
          authorAvatar: null,
          title: "Welcome to our community!",
          content: "We're excited to have you join our community! This is a space for tech enthusiasts to collaborate, share ideas, and learn from each other. Feel free to introduce yourself in the comments!",
          type: "announcement",
          createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
          commentCount: 15,
          isFeatured: true,
          likes: 42
        },
        {
          id: 2,
          communityId,
          authorId: 2,
          authorName: "Mentor User",
          authorAvatar: null,
          title: "Monthly Tech Meetup - June 2023",
          content: "Join us for our monthly tech meetup! We'll be discussing the latest trends in AI and machine learning. RSVP in the comments if you plan to attend.",
          type: "event",
          createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
          commentCount: 8,
          isFeatured: false,
          likes: 27
        },
        {
          id: 3,
          communityId,
          authorId: 3,
          authorName: "Regular User 1",
          authorAvatar: null,
          title: "Question about React Hooks",
          content: "I'm new to React and have been learning about hooks. Could someone explain the difference between useEffect and useLayoutEffect? When should I use one over the other?",
          type: "discussion",
          createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
          commentCount: 12,
          isFeatured: false,
          likes: 18
        },
        {
          id: 4,
          communityId,
          authorId: 1,
          authorName: "Admin User",
          authorAvatar: null,
          title: "Frontend Developer Position at TechCorp",
          content: "TechCorp is hiring frontend developers! We're looking for someone with experience in React, TypeScript, and modern CSS frameworks. Remote work available. Apply with your portfolio and resume.",
          type: "job",
          createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
          commentCount: 5,
          isFeatured: true,
          likes: 31
        },
        {
          id: 5,
          communityId,
          authorId: 2,
          authorName: "Mentor User",
          authorAvatar: null,
          title: "The Future of Web Development",
          content: "I've been thinking about where web development is headed in the next few years. With the rise of AI, Web Assembly, and edge computing, the landscape is changing rapidly. Here are my thoughts...",
          type: "blog",
          createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          commentCount: 7,
          isFeatured: false,
          likes: 24
        }
      ];
      
      // Filter by post type if provided
      let filteredPosts = posts;
      if (type && typeof type === 'string') {
        filteredPosts = filteredPosts.filter(p => p.type === type);
      }
      
      res.json(filteredPosts);
    } catch (error) {
      res.status(500).json({ message: "Failed to get community posts" });
    }
  });

  // Create a community post
  app.post("/api/communities/:id/posts", async (req, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      
      const communityId = parseInt(req.params.id);
      const { title, content, type, scheduleDate } = req.body;
      
      if (!title || !content || !type) {
        return res.status(400).json({ message: "Missing required fields" });
      }
      
      if (!['announcement', 'discussion', 'event', 'job', 'blog'].includes(type)) {
        return res.status(400).json({ message: "Invalid post type" });
      }
      
      // Mock implementation for demo
      const post = {
        id: 6, // In a real implementation, this would be auto-generated
        communityId,
        authorId: req.user.id,
        authorName: req.user.username || "User",
        authorAvatar: null,
        title,
        content,
        type,
        createdAt: scheduleDate || new Date().toISOString(),
        commentCount: 0,
        isFeatured: false,
        likes: 0
      };
      
      res.status(201).json(post);
    } catch (error) {
      res.status(500).json({ message: "Failed to create post" });
    }
  });

  // Get community events
  app.get("/api/communities/:id/events", async (req, res) => {
    try {
      const communityId = parseInt(req.params.id);
      
      // Mock implementation for demo
      const events = [
        {
          id: 1,
          communityId,
          organizerId: 1,
          title: "Monthly Tech Meetup - June 2023",
          description: "Join us for our monthly tech meetup! We'll be discussing the latest trends in AI and machine learning.",
          startDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
          endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000).toISOString(), // 2 hours later
          location: "Tech Hub, Downtown",
          isOnline: false,
          attendeeCount: 42
        },
        {
          id: 2,
          communityId,
          organizerId: 2,
          title: "Web Development Workshop",
          description: "Learn the basics of modern web development with React, TypeScript, and TailwindCSS in this hands-on workshop.",
          startDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(), // 14 days from now
          endDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000 + 4 * 60 * 60 * 1000).toISOString(), // 4 hours later
          location: "Zoom",
          isOnline: true,
          attendeeCount: 75
        },
        {
          id: 3,
          communityId,
          organizerId: 1,
          title: "Career Panel: Transitioning to Tech",
          description: "Industry professionals share their experiences transitioning to tech careers from non-technical backgrounds.",
          startDate: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString(), // 21 days from now
          endDate: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000 + 1.5 * 60 * 60 * 1000).toISOString(), // 1.5 hours later
          location: "Google Meet",
          isOnline: true,
          attendeeCount: 120
        }
      ];
      
      res.json(events);
    } catch (error) {
      res.status(500).json({ message: "Failed to get community events" });
    }
  });

  // Create a community event
  app.post("/api/communities/:id/events", async (req, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      
      const communityId = parseInt(req.params.id);
      const { title, description, startDate, endDate, location, isOnline } = req.body;
      
      if (!title || !description || !startDate || !endDate) {
        return res.status(400).json({ message: "Missing required fields" });
      }
      
      // Mock implementation for demo
      const event = {
        id: 4, // In a real implementation, this would be auto-generated
        communityId,
        organizerId: req.user.id,
        title,
        description,
        startDate,
        endDate,
        location: location || (isOnline ? "Online" : "TBD"),
        isOnline: isOnline || false,
        attendeeCount: 0
      };
      
      res.status(201).json(event);
    } catch (error) {
      res.status(500).json({ message: "Failed to create event" });
    }
  });

  // Get community polls
  app.get("/api/communities/:id/polls", async (req, res) => {
    try {
      const communityId = parseInt(req.params.id);
      
      // Mock implementation for demo
      const polls = [
        {
          id: 1,
          communityId,
          authorId: 1,
          authorName: "Admin User",
          question: "What topic would you like to see covered in our next workshop?",
          options: ["React Hooks", "TypeScript Advanced Types", "State Management", "Testing Strategies"],
          votes: [12, 8, 15, 7],
          createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
          expiresAt: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString(),
          isActive: true
        },
        {
          id: 2,
          communityId,
          authorId: 2,
          authorName: "Mentor User",
          question: "Which day works best for our monthly meetups?",
          options: ["Monday", "Wednesday", "Friday", "Saturday"],
          votes: [5, 12, 8, 25],
          createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
          expiresAt: new Date(Date.now() - 16 * 24 * 60 * 60 * 1000).toISOString(),
          isActive: false
        }
      ];
      
      res.json(polls);
    } catch (error) {
      res.status(500).json({ message: "Failed to get community polls" });
    }
  });

  // Create a community poll
  app.post("/api/communities/:id/polls", async (req, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      
      const communityId = parseInt(req.params.id);
      const { question, options, expiresAt } = req.body;
      
      if (!question || !options || !Array.isArray(options) || options.length < 2) {
        return res.status(400).json({ message: "Invalid poll data" });
      }
      
      // Calculate expiration (default to 7 days if not specified)
      const expiry = expiresAt || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
      
      // Mock implementation for demo
      const poll = {
        id: 3, // In a real implementation, this would be auto-generated
        communityId,
        authorId: req.user.id,
        authorName: req.user.username || "User",
        question,
        options,
        votes: Array(options.length).fill(0), // Initialize with 0 votes for each option
        createdAt: new Date().toISOString(),
        expiresAt: expiry,
        isActive: true
      };
      
      res.status(201).json(poll);
    } catch (error) {
      res.status(500).json({ message: "Failed to create poll" });
    }
  });

  // Vote in a poll
  app.post("/api/communities/:id/polls/:pollId/vote", async (req, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      
      const { optionIndex } = req.body;
      
      if (optionIndex === undefined || typeof optionIndex !== 'number') {
        return res.status(400).json({ message: "Invalid vote data" });
      }
      
      // Mock implementation for demo - just send success response
      res.status(200).json({ message: "Vote recorded successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to record vote" });
    }
  });

  // Get community analytics
  app.get("/api/communities/:id/stats", async (req, res) => {
    try {
      const communityId = parseInt(req.params.id);
      
      // Mock implementation for demo
      const stats = {
        totalMembers: 250,
        activeMembers: 180,
        totalPosts: 45,
        totalEvents: 12,
        engagementRate: 0.72,
        memberGrowth: [
          { date: "2023-01-01", count: 150 },
          { date: "2023-02-01", count: 165 },
          { date: "2023-03-01", count: 185 },
          { date: "2023-04-01", count: 210 },
          { date: "2023-05-01", count: 235 },
          { date: "2023-06-01", count: 250 }
        ],
        postEngagement: [
          { date: "2023-01-01", count: 85 },
          { date: "2023-02-01", count: 92 },
          { date: "2023-03-01", count: 110 },
          { date: "2023-04-01", count: 125 },
          { date: "2023-05-01", count: 145 },
          { date: "2023-06-01", count: 160 }
        ],
        newJoins: 15
      };
      
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: "Failed to get community stats" });
    }
  });

  // Get flagged content
  app.get("/api/communities/:id/flagged", async (req, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      
      const communityId = parseInt(req.params.id);
      
      // Check if user is admin or moderator (in a real implementation)
      const isAdminOrMod = communityId <= 2 && req.user.id === 1;
      
      if (!isAdminOrMod) {
        return res.status(403).json({ message: "Permission denied" });
      }
      
      // Mock implementation for demo
      const flaggedContent = [
        {
          id: 1,
          communityId,
          contentId: 42,
          contentType: "comment",
          content: "This is spam content that was flagged by users.",
          reporterId: 3,
          reporterName: "Regular User 1",
          reason: "Spam",
          createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          status: "pending"
        },
        {
          id: 2,
          communityId,
          contentId: 65,
          contentType: "post",
          content: "This post contains inappropriate language that violates community guidelines.",
          reporterId: 4,
          reporterName: "Regular User 2",
          reason: "Inappropriate language",
          createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          status: "pending"
        }
      ];
      
      res.json(flaggedContent);
    } catch (error) {
      res.status(500).json({ message: "Failed to get flagged content" });
    }
  });

  // Flag content
  app.post("/api/communities/:id/flag", async (req, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      
      const communityId = parseInt(req.params.id);
      const { contentId, contentType, reason } = req.body;
      
      if (!contentId || !contentType || !reason) {
        return res.status(400).json({ message: "Invalid flag data" });
      }
      
      // Mock implementation for demo
      const flaggedContent = {
        id: 3, // In a real implementation, this would be auto-generated
        communityId,
        contentId,
        contentType,
        content: "Content that was flagged", // In a real implementation, this would be fetched based on contentId
        reporterId: req.user.id,
        reporterName: req.user.username || "User",
        reason,
        createdAt: new Date().toISOString(),
        status: "pending"
      };
      
      res.status(201).json({ message: "Content flagged successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to flag content" });
    }
  });

  // Handle flagged content
  app.patch("/api/communities/:id/flagged/:flagId", async (req, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      
      const communityId = parseInt(req.params.id);
      const flagId = parseInt(req.params.flagId);
      const { action } = req.body; // 'remove', 'approve', 'ignore'
      
      if (!action || !['remove', 'approve', 'ignore'].includes(action)) {
        return res.status(400).json({ message: "Invalid action" });
      }
      
      // Check if user is admin or moderator (in a real implementation)
      const isAdminOrMod = communityId <= 2 && req.user.id === 1;
      
      if (!isAdminOrMod) {
        return res.status(403).json({ message: "Permission denied" });
      }
      
      // Mock implementation for demo - just send success response
      res.status(200).json({ message: `Flagged content ${action}d successfully` });
    } catch (error) {
      res.status(500).json({ message: "Failed to handle flagged content" });
    }
  });

  // Get collaboration opportunities
  app.get("/api/communities/:id/collaborations", async (req, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      
      const communityId = parseInt(req.params.id);
      
      // Mock implementation for demo
      const collaborations = [
        {
          id: 1,
          sourceCommunityId: communityId,
          sourceCommunityName: "Tech Innovators",
          targetCommunityId: 3,
          targetCommunityName: "Future Leaders",
          type: "event",
          status: "approved",
          details: "Joint tech leadership workshop",
          createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: 2,
          sourceCommunityId: 4,
          sourceCommunityName: "Creative Design Collective",
          targetCommunityId: communityId,
          targetCommunityName: "Tech Innovators",
          type: "project",
          status: "pending",
          details: "Collaboration on UI/UX for open source project",
          createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
        }
      ];
      
      res.json(collaborations);
    } catch (error) {
      res.status(500).json({ message: "Failed to get collaborations" });
    }
  });

  // Propose collaboration
  app.post("/api/communities/:id/collaborations", async (req, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      
      const sourceCommunityId = parseInt(req.params.id);
      const { targetCommunityId, type, details } = req.body;
      
      if (!targetCommunityId || !type || !details) {
        return res.status(400).json({ message: "Invalid collaboration data" });
      }
      
      // Check if user is admin or moderator of source community (in a real implementation)
      const isSourceAdmin = sourceCommunityId <= 2 && req.user.id === 1;
      
      if (!isSourceAdmin) {
        return res.status(403).json({ message: "Permission denied" });
      }
      
      // Mock implementation for demo
      const collaboration = {
        id: 3, // In a real implementation, this would be auto-generated
        sourceCommunityId,
        sourceCommunityName: "Tech Innovators",
        targetCommunityId,
        targetCommunityName: "Creative Design Collective", // In a real implementation, this would be fetched
        type,
        status: "pending",
        details,
        createdAt: new Date().toISOString()
      };
      
      res.status(201).json(collaboration);
    } catch (error) {
      res.status(500).json({ message: "Failed to propose collaboration" });
    }
  });

  // Respond to collaboration proposal
  app.patch("/api/communities/:id/collaborations/:collaborationId", async (req, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      
      const communityId = parseInt(req.params.id);
      const collaborationId = parseInt(req.params.collaborationId);
      const { status } = req.body; // 'approved', 'rejected'
      
      if (!status || !['approved', 'rejected'].includes(status)) {
        return res.status(400).json({ message: "Invalid status" });
      }
      
      // Check if user is admin or moderator of target community (in a real implementation)
      const isTargetAdmin = communityId <= 2 && req.user.id === 1;
      
      if (!isTargetAdmin) {
        return res.status(403).json({ message: "Permission denied" });
      }
      
      // Mock implementation for demo - just send success response
      res.status(200).json({ message: `Collaboration proposal ${status}` });
    } catch (error) {
      res.status(500).json({ message: "Failed to respond to collaboration" });
    }
  });

  // Create HTTP server
  const httpServer = createServer(app);
  
  // WebSocket server
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });

  wss.on('connection', (ws: any) => {
    console.log('WebSocket client connected');

    ws.on('message', (message: any) => {
      try {
        const data = JSON.parse(message.toString());
        console.log('Received message:', data);

        // Handle different message types
        if (data.type === 'join_community') {
          // In a real implementation, you would subscribe the client to community updates
          ws.send(JSON.stringify({
            type: 'joined_community',
            communityId: data.communityId,
            success: true
          }));
        } else if (data.type === 'leave_community') {
          // In a real implementation, you would unsubscribe the client from community updates
          ws.send(JSON.stringify({
            type: 'left_community',
            communityId: data.communityId,
            success: true
          }));
        }
      } catch (error) {
        console.error('Error handling WebSocket message:', error);
        ws.send(JSON.stringify({
          type: 'error',
          message: 'Invalid message format'
        }));
      }
    });

    ws.on('close', () => {
      console.log('WebSocket client disconnected');
    });

    // Send initial welcome message
    ws.send(JSON.stringify({
      type: 'welcome',
      message: 'Connected to CareerOS Communities WebSocket'
    }));
  });
  return httpServer;
}
