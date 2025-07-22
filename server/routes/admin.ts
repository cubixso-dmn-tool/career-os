import { Router } from "express";
import { storage } from "../storage.js";
import { loadUserRolesMiddleware, requirePermission } from "../middleware/rbac.js";
import { db } from "../db.js";
import { users, userRoles, roles, posts, communityPosts, enrollments, courses, userEvents, projects } from "../../shared/schema.js";
import { count, sql, and, gte, eq } from "drizzle-orm";

const router = Router();

// Apply middleware to load user roles and permissions
router.use(loadUserRolesMiddleware);

/**
 * Get platform analytics for admin dashboard
 * GET /api/admin/analytics
 */
router.get("/analytics", requirePermission("read:analytics"), async (req, res) => {
  try {
    // Get real analytics data from database
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    // Get user stats
    const [totalUsersResult] = await db.select({ count: count() }).from(users);
    const [newUsersThisMonthResult] = await db.select({ count: count() }).from(users).where(gte(users.createdAt, startOfMonth));
    
    // Get content stats
    const [totalCoursesResult] = await db.select({ count: count() }).from(courses);
    const [totalProjectsResult] = await db.select({ count: count() }).from(projects);
    const [totalPostsResult] = await db.select({ count: count() }).from(posts);
    const [totalCommunityPostsResult] = await db.select({ count: count() }).from(communityPosts);
    
    // Get enrollment stats
    const [totalEnrollmentsResult] = await db.select({ count: count() }).from(enrollments);
    const [totalUserEventsResult] = await db.select({ count: count() }).from(userEvents);
    
    const totalUsers = totalUsersResult.count || 0;
    const newUsersThisMonth = newUsersThisMonthResult.count || 0;
    const totalCourses = totalCoursesResult.count || 0;
    const totalProjects = totalProjectsResult.count || 0;
    const totalPosts = (totalPostsResult.count || 0) + (totalCommunityPostsResult.count || 0);
    
    const analytics = {
      users: {
        total: totalUsers,
        newThisMonth: newUsersThisMonth,
        growthRate: totalUsers > 0 ? Math.round((newUsersThisMonth / totalUsers) * 100) : 0,
        activeUsers: 0, // Will be implemented later with session tracking
        retentionRate: 0 // Will be implemented later with user activity tracking
      },
      content: {
        totalCourses: totalCourses,
        totalProjects: totalProjects,
        totalPosts: totalPosts,
        approvedContent: 0 // Will be implemented later with content moderation
      },
      engagement: {
        totalSessions: totalUserEventsResult.count || 0,
        avgSessionDuration: 0, // Will be implemented later
        courseCompletions: totalEnrollmentsResult.count || 0,
        communityPosts: totalCommunityPostsResult.count || 0
      },
      performance: {
        systemUptime: 0, // Will be implemented later with monitoring
        avgResponseTime: 0, // Will be implemented later
        errorRate: 0, // Will be implemented later
        databaseSize: 0 // Will be implemented later
      },
      revenue: {
        monthlyRevenue: 0, // Will be implemented later with payment tracking
        totalRevenue: 0, // Will be implemented later
        avgRevenuePerUser: 0, // Will be implemented later
        conversionRate: 0 // Will be implemented later
      }
    };

    res.json({
      success: true,
      data: analytics
    });
  } catch (error: any) {
    console.error("Error fetching analytics:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch analytics",
      error: error.message
    });
  }
});

/**
 * Get moderation queue
 * GET /api/admin/moderation-queue
 */
router.get("/moderation-queue", requirePermission("community:moderate"), async (req, res) => {
  try {
    // For now, return empty moderation queue as we haven't implemented content flagging yet
    const moderationQueue = {
      flaggedContent: [],
      userReports: [],
      expertApplications: [],
      stats: {
        pendingReviews: 0,
        resolvedToday: 0,
        avgResolutionTime: 0
      }
    };

    res.json({
      success: true,
      data: moderationQueue
    });
  } catch (error: any) {
    console.error("Error fetching moderation queue:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch moderation queue",
      error: error.message
    });
  }
});

/**
 * Get users list for admin management
 * GET /api/admin/users
 */
router.get("/users", requirePermission("read:users"), async (req, res) => {
  try {
    const { page = 1, limit = 50, role: roleFilter, search } = req.query;
    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const offset = (pageNum - 1) * limitNum;

    // Build search condition
    let searchCondition;
    if (search) {
      searchCondition = sql`(${users.name} ILIKE ${`%${search}%`} OR ${users.email} ILIKE ${`%${search}%`} OR ${users.username} ILIKE ${`%${search}%`})`;
    }

    // Get total count
    const [totalResult] = searchCondition ? 
      await db.select({ count: count() }).from(users).where(searchCondition) :
      await db.select({ count: count() }).from(users);
    const total = totalResult.count || 0;

    // Get users with their roles
    const baseQuery = db
      .select({
        id: users.id,
        username: users.username,
        email: users.email,
        name: users.name,
        bio: users.bio,
        avatar: users.avatar,
        createdAt: users.createdAt,
        roleName: roles.name
      })
      .from(users)
      .leftJoin(userRoles, eq(users.id, userRoles.userId))
      .leftJoin(roles, eq(userRoles.roleId, roles.id))
      .orderBy(sql`${users.createdAt} DESC`)
      .limit(limitNum)
      .offset(offset);

    // Apply filters
    const conditions = [];
    if (searchCondition) {
      conditions.push(searchCondition);
    }
    if (roleFilter) {
      conditions.push(eq(roles.name, roleFilter as string));
    }
    
    const usersList = conditions.length > 0 ? 
      await baseQuery.where(and(...conditions)) : 
      await baseQuery;

    // Get role statistics
    const roleStats = await db
      .select({
        roleName: roles.name,
        count: count()
      })
      .from(users)
      .leftJoin(userRoles, eq(users.id, userRoles.userId))
      .leftJoin(roles, eq(userRoles.roleId, roles.id))
      .groupBy(roles.name);

    // Process role stats
    const stats = {
      totalUsers: total,
      activeUsers: 0, // Will be implemented with session tracking
      students: 0,
      mentors: 0,
      experts: 0,
      moderators: 0,
      admins: 0
    };

    roleStats.forEach(stat => {
      if (stat.roleName === 'student') stats.students = stat.count || 0;
      else if (stat.roleName === 'mentor') stats.mentors = stat.count || 0;
      else if (stat.roleName === 'expert') stats.experts = stat.count || 0;
      else if (stat.roleName === 'moderator') stats.moderators = stat.count || 0;
      else if (stat.roleName === 'admin') stats.admins = stat.count || 0;
    });

    // Format users data
    const usersData = usersList.map(user => ({
      id: user.id,
      username: user.username,
      email: user.email,
      name: user.name,
      role: user.roleName || 'student',
      status: 'active', // Will be implemented later with user activity tracking
      joinedAt: user.createdAt,
      lastActive: user.createdAt // Will be implemented later with session tracking
    }));

    const result = {
      data: usersData,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total: total,
        totalPages: Math.ceil(total / limitNum)
      },
      stats: stats
    };

    res.json({
      success: true,
      data: result
    });
  } catch (error: any) {
    console.error("Error fetching users:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch users",
      error: error.message
    });
  }
});

/**
 * Update user role
 * PUT /api/admin/users/:userId/role
 */
router.put("/users/:userId/role", requirePermission("update:users"), async (req, res) => {
  try {
    const { userId } = req.params;
    const { roleId } = req.body;

    if (!userId || !roleId) {
      return res.status(400).json({
        success: false,
        message: "User ID and role ID are required"
      });
    }

    // In real implementation, update user role in database
    res.json({
      success: true,
      message: "User role updated successfully"
    });
  } catch (error: any) {
    console.error("Error updating user role:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update user role",
      error: error.message
    });
  }
});

/**
 * Moderate content (approve/reject/delete)
 * POST /api/admin/moderate
 */
router.post("/moderate", requirePermission("community:moderate"), async (req, res) => {
  try {
    const { contentId, action } = req.body;

    if (!contentId || !action) {
      return res.status(400).json({
        success: false,
        message: "Content ID and action are required"
      });
    }

    const validActions = ['approve', 'reject', 'delete', 'warn'];
    if (!validActions.includes(action)) {
      return res.status(400).json({
        success: false,
        message: "Invalid action"
      });
    }

    // In real implementation, update content status in database
    res.json({
      success: true,
      message: `Content ${action}ed successfully`,
      data: { contentId, action, moderatedBy: req.user?.id, moderatedAt: new Date() }
    });
  } catch (error: any) {
    console.error("Error moderating content:", error);
    res.status(500).json({
      success: false,
      message: "Failed to moderate content",
      error: error.message
    });
  }
});

/**
 * Create platform event
 * POST /api/admin/events
 */
router.post("/events", requirePermission("create:events"), async (req, res) => {
  try {
    const { title, description, startTime, endTime, type, maxParticipants } = req.body;

    if (!title || !description || !startTime) {
      return res.status(400).json({
        success: false,
        message: "Title, description, and start time are required"
      });
    }

    // In real implementation, create event in database
    const newEvent = {
      id: Date.now(), // Mock ID
      title,
      description,
      startTime: new Date(startTime),
      endTime: endTime ? new Date(endTime) : null,
      type,
      maxParticipants,
      createdBy: req.user?.id,
      createdAt: new Date(),
      status: "scheduled"
    };

    res.json({
      success: true,
      message: "Event created successfully",
      data: newEvent
    });
  } catch (error: any) {
    console.error("Error creating event:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create event",
      error: error.message
    });
  }
});

/**
 * Get system logs
 * GET /api/admin/logs
 */
router.get("/logs", requirePermission("read:system"), async (req, res) => {
  try {
    const { limit = 100 } = req.query;

    // Mock system logs - in real implementation, fetch from logging system
    const logs = {
      data: [
        {
          id: 1,
          level: "info",
          message: "User registration successful",
          timestamp: new Date(Date.now() - 5 * 60 * 1000),
          userId: 123,
          ip: "192.168.1.1"
        },
        {
          id: 2,
          level: "warning",
          message: "API rate limit approached for user",
          timestamp: new Date(Date.now() - 10 * 60 * 1000),
          userId: 456,
          ip: "192.168.1.2"
        },
        {
          id: 3,
          level: "error",
          message: "Database connection timeout",
          timestamp: new Date(Date.now() - 15 * 60 * 1000),
          service: "database",
          error: "Connection timeout after 30s"
        }
      ],
      pagination: {
        limit: parseInt(limit as string),
        total: 5432,
        hasMore: true
      }
    };

    res.json({
      success: true,
      data: logs
    });
  } catch (error: any) {
    console.error("Error fetching logs:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch logs",
      error: error.message
    });
  }
});

export default router;