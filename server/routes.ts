import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
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
} from "@shared/schema";
import { 
  generateCareerRecommendations,
  chatWithPathFinder
} from "./lib/openai";
import communityRoutes from "./routes/community";
import rbacRoutes from "./routes/rbac";
import careerRoutes from "./routes/career";
import careerRoadmapRoutes from "./routes/career-roadmap";
import contentManagementRoutes from "./routes/content-management";
import coursesRoutes from "./routes/courses";
import projectsRoutes from "./routes/projects";
import { loadUserRolesMiddleware } from "./middleware/rbac";

function handleZodError(error: ZodError, res: Response) {
  return res.status(400).json({
    message: "Validation error",
    errors: error.errors,
  });
}

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

  // Apply RBAC middleware to all routes
  app.use(loadUserRolesMiddleware);

  // Register community routes
  app.use('/api/communities', communityRoutes);

  // Register RBAC (roles and permissions) routes
  app.use('/api/rbac', rbacRoutes);
  
  // Register Career Guide and PathFinder routes
  app.use('/api/career', careerRoutes);
  
  // Register Career Roadmap routes
  app.use('/api/career/roadmap', careerRoadmapRoutes);
  
  // Register Content Management routes
  app.use('/api/content-management', contentManagementRoutes);
  
  // Register Course features routes
  app.use('/api/courses', coursesRoutes);
  
  // Register Projects routes
  app.use('/api/projects', projectsRoutes);

  const httpServer = createServer(app);
  return httpServer;
}
