import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
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

export async function registerRoutes(app: Express): Promise<Server> {
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

  const httpServer = createServer(app);
  return httpServer;
}
