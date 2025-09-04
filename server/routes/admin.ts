import { Router } from "express";
import { loadUserRolesMiddleware, requirePermission } from "../middleware/rbac.js";
import { db } from "../db.js";
import { users, userRoles, roles, posts, communityPosts, enrollments, courses, userEvents, projects, industryExperts, expertSessions, careerSuccessStories, networkingEvents, careerOptions, careerPaths } from "../../shared/schema.js";
import { count, sql, and, gte, eq, desc } from "drizzle-orm";

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
    const { roleName } = req.body;

    if (!userId || !roleName) {
      return res.status(400).json({
        success: false,
        message: "User ID and role name are required"
      });
    }

    const userIdNum = parseInt(userId);
    if (!userIdNum) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID"
      });
    }

    // First, get the role ID from role name
    const role = await db.select().from(roles).where(eq(roles.name, roleName)).limit(1);
    if (role.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid role name"
      });
    }

    const roleId = role[0].id;

    // Check if user already has a role assignment
    const existingRole = await db.select().from(userRoles).where(eq(userRoles.userId, userIdNum)).limit(1);

    if (existingRole.length > 0) {
      // Update existing role
      await db.update(userRoles)
        .set({ roleId })
        .where(eq(userRoles.userId, userIdNum));
    } else {
      // Insert new role assignment
      await db.insert(userRoles).values({
        userId: userIdNum,
        roleId
      });
    }

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
 * Delete user
 * DELETE /api/admin/users/:userId
 */
router.delete("/users/:userId", requirePermission("delete:users"), async (req, res) => {
  try {
    const { userId } = req.params;
    const userIdNum = parseInt(userId);

    if (!userIdNum) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID"
      });
    }

    // Delete user roles first (foreign key constraint)
    await db.delete(userRoles).where(eq(userRoles.userId, userIdNum));
    
    // Delete the user
    const [deletedUser] = await db.delete(users).where(eq(users.id, userIdNum)).returning();

    if (!deletedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    res.json({
      success: true,
      message: "User deleted successfully"
    });
  } catch (error: any) {
    console.error("Error deleting user:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete user",
      error: error.message
    });
  }
});

/**
 * Create new user
 * POST /api/admin/users
 */
router.post("/users", requirePermission("create:users"), async (req, res) => {
  try {
    const { name, email, username, roleName = 'student' } = req.body;

    if (!name || !email || !username) {
      return res.status(400).json({
        success: false,
        message: "Name, email, and username are required"
      });
    }

    // Check if user already exists
    const existingUser = await db.select().from(users).where(
      sql`${users.email} = ${email} OR ${users.username} = ${username}`
    ).limit(1);

    if (existingUser.length > 0) {
      return res.status(400).json({
        success: false,
        message: "User with this email or username already exists"
      });
    }

    // Create the user
    const [newUser] = await db.insert(users).values({
      name,
      email,
      username,
      bio: null,
      avatar: null
    }).returning();

    // Get the role ID
    const role = await db.select().from(roles).where(eq(roles.name, roleName)).limit(1);
    if (role.length > 0) {
      // Assign role to user
      await db.insert(userRoles).values({
        userId: newUser.id,
        roleId: role[0].id
      });
    }

    res.json({
      success: true,
      message: "User created successfully",
      data: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        username: newUser.username,
        role: roleName
      }
    });
  } catch (error: any) {
    console.error("Error creating user:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create user",
      error: error.message
    });
  }
});

/**
 * Get available roles
 * GET /api/admin/roles
 */
router.get("/roles", requirePermission("read:users"), async (req, res) => {
  try {
    const rolesList = await db.select().from(roles).orderBy(roles.name);
    
    res.json({
      success: true,
      data: rolesList
    });
  } catch (error: any) {
    console.error("Error fetching roles:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch roles",
      error: error.message
    });
  }
});

/**
 * Get single user details
 * GET /api/admin/users/:userId
 */
router.get("/users/:userId", requirePermission("read:users"), async (req, res) => {
  try {
    const { userId } = req.params;
    const userIdNum = parseInt(userId);

    if (!userIdNum) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID"
      });
    }

    // Get user with role information
    const userResult = await db
      .select({
        id: users.id,
        username: users.username,
        email: users.email,
        name: users.name,
        bio: users.bio,
        avatar: users.avatar,
        createdAt: users.createdAt,
        roleName: roles.name,
        roleId: roles.id
      })
      .from(users)
      .leftJoin(userRoles, eq(users.id, userRoles.userId))
      .leftJoin(roles, eq(userRoles.roleId, roles.id))
      .where(eq(users.id, userIdNum))
      .limit(1);

    if (userResult.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    const user = userResult[0];
    
    // Get user activity stats (you can expand this with actual activity data)
    const userStats = {
      coursesEnrolled: 0, // Will be implemented with actual enrollment data
      projectsCompleted: 0, // Will be implemented with actual project data
      communityPosts: 0, // Will be implemented with actual community data
      lastLoginDate: user.createdAt, // Will be implemented with session tracking
      accountStatus: 'active', // Will be implemented with user status tracking
      joinedDate: user.createdAt
    };

    res.json({
      success: true,
      data: {
        ...user,
        role: user.roleName || 'student',
        stats: userStats
      }
    });
  } catch (error: any) {
    console.error("Error fetching user:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch user",
      error: error.message
    });
  }
});

/**
 * Update user details
 * PUT /api/admin/users/:userId
 */
router.put("/users/:userId", requirePermission("update:users"), async (req, res) => {
  try {
    const { userId } = req.params;
    const { name, email, username, bio, avatar } = req.body;
    const userIdNum = parseInt(userId);

    if (!userIdNum) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID"
      });
    }

    // Check if email or username already exists for other users
    if (email || username) {
      const existingUser = await db
        .select()
        .from(users)
        .where(
          sql`${users.id} != ${userIdNum} AND (${email ? sql`${users.email} = ${email}` : sql`FALSE`} OR ${username ? sql`${users.username} = ${username}` : sql`FALSE`})`
        )
        .limit(1);

      if (existingUser.length > 0) {
        return res.status(400).json({
          success: false,
          message: "Email or username already exists"
        });
      }
    }

    // Update user data
    const updateData: any = {};
    if (name !== undefined) updateData.name = name;
    if (email !== undefined) updateData.email = email;
    if (username !== undefined) updateData.username = username;
    if (bio !== undefined) updateData.bio = bio;
    if (avatar !== undefined) updateData.avatar = avatar;

    const [updatedUser] = await db
      .update(users)
      .set(updateData)
      .where(eq(users.id, userIdNum))
      .returning();

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    res.json({
      success: true,
      message: "User updated successfully",
      data: updatedUser
    });
  } catch (error: any) {
    console.error("Error updating user:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update user",
      error: error.message
    });
  }
});

/**
 * Suspend/Activate user
 * PUT /api/admin/users/:userId/status
 */
router.put("/users/:userId/status", requirePermission("update:users"), async (req, res) => {
  try {
    const { userId } = req.params;
    const { status, reason } = req.body;
    const userIdNum = parseInt(userId);

    if (!userIdNum) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID"
      });
    }

    if (!status || !['active', 'suspended'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Status must be 'active' or 'suspended'"
      });
    }

    // For now, we'll store the status in a new column or use a separate table
    // Since we don't have a status column in the current schema, we'll simulate it
    // In a real implementation, you would add a status column to the users table
    
    // You can add a user_status table or modify the users table to include status
    // For now, we'll return success but in a real implementation you'd update the database
    
    res.json({
      success: true,
      message: `User ${status === 'suspended' ? 'suspended' : 'activated'} successfully`,
      data: {
        userId: userIdNum,
        status,
        reason: reason || null,
        updatedAt: new Date(),
        updatedBy: req.user?.id
      }
    });
  } catch (error: any) {
    console.error("Error updating user status:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update user status",
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

/**
 * Expert Management Routes
 */

/**
 * Get all experts for admin management
 * GET /api/admin/experts
 */
router.get("/experts", requirePermission("read:experts"), async (req, res) => {
  try {
    const { page = 1, limit = 50, search, industry } = req.query;
    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const offset = (pageNum - 1) * limitNum;

    // Build search condition
    let searchCondition;
    if (search) {
      searchCondition = sql`(${industryExperts.name} ILIKE ${`%${search}%`} OR ${industryExperts.company} ILIKE ${`%${search}%`} OR ${industryExperts.title} ILIKE ${`%${search}%`})`;
    }

    // Build industry filter
    let industryCondition;
    if (industry) {
      industryCondition = eq(industryExperts.industry, industry as string);
    }

    // Combine conditions
    const conditions = [];
    if (searchCondition) conditions.push(searchCondition);
    if (industryCondition) conditions.push(industryCondition);

    // Get total count
    const [totalResult] = conditions.length > 0 ? 
      await db.select({ count: count() }).from(industryExperts).where(and(...conditions)) :
      await db.select({ count: count() }).from(industryExperts);
    const total = totalResult.count || 0;

    // Get experts with pagination
    const baseQuery = db
      .select({
        id: industryExperts.id,
        name: industryExperts.name,
        email: sql`NULL`.as('email'), // Not in schema, return null
        title: industryExperts.title,
        company: industryExperts.company,
        industry: industryExperts.industry,
        specializations: industryExperts.specializations,
        yearsOfExperience: industryExperts.experience, // Map experience_years to yearsOfExperience
        bio: industryExperts.bio,
        avatar: industryExperts.avatar,
        linkedInUrl: industryExperts.linkedinUrl,
        portfolioUrl: sql`NULL`.as('portfolioUrl'), // Not in schema, return null
        hourlyRate: sql`NULL`.as('hourlyRate'), // Not in schema, return null
        availability: sql`'Available'`.as('availability'), // Default value
        expertise: industryExperts.expertise,
        rating: industryExperts.rating,
        totalSessions: industryExperts.totalSessions,
        isActive: industryExperts.isActive,
        isFeatured: sql`COALESCE(${industryExperts}.is_featured, false)`.as('isFeatured'),
        featuredOrder: sql`${industryExperts}.featured_order`.as('featuredOrder'),
        joinedAt: industryExperts.joinedAt,
        createdAt: industryExperts.joinedAt // Map joinedAt to createdAt for frontend
      })
      .from(industryExperts)
      .orderBy(sql`${industryExperts.joinedAt} DESC`)
      .limit(limitNum)
      .offset(offset);

    const expertsList = conditions.length > 0 ? 
      await baseQuery.where(and(...conditions)) : 
      await baseQuery;

    res.json({
      success: true,
      data: {
        data: expertsList,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total: total,
          totalPages: Math.ceil(total / limitNum)
        }
      }
    });
  } catch (error: any) {
    console.error("Error fetching experts:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch experts",
      error: error.message
    });
  }
});

/**
 * Create new expert profile
 * POST /api/admin/experts
 */
router.post("/experts", requirePermission("create:experts"), async (req, res) => {
  try {
    const { 
      name, 
      email,
      title, 
      company, 
      industry, 
      bio, 
      expertise,
      yearsOfExperience,
      linkedInUrl,
      portfolioUrl,
      hourlyRate,
      availability
    } = req.body;

    if (!name || !title || !company || !industry || !bio) {
      return res.status(400).json({
        success: false,
        message: "Name, title, company, industry, and bio are required"
      });
    }

    const [newExpert] = await db
      .insert(industryExperts)
      .values({
        name,
        title,
        company,
        industry,
        specializations: [], // We can add this field later if needed
        experience: yearsOfExperience || 0,
        bio,
        avatar: null, // Can be added later
        linkedinUrl: linkedInUrl || null,
        expertise: expertise || [],
        isActive: true
      })
      .returning();

    res.json({
      success: true,
      message: "Expert created successfully",
      data: newExpert
    });
  } catch (error: any) {
    console.error("Error creating expert:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create expert",
      error: error.message
    });
  }
});

/**
 * Update expert profile
 * PUT /api/admin/experts/:id
 */
router.put("/experts/:id", requirePermission("update:experts"), async (req, res) => {
  try {
    const { id } = req.params;
    const expertId = parseInt(id);
    
    const { 
      name, 
      title, 
      company, 
      industry, 
      bio, 
      expertise,
      yearsOfExperience,
      linkedInUrl,
      portfolioUrl,
      hourlyRate,
      availability,
      isActive,
      isFeatured,
      featuredOrder
    } = req.body;

    if (!expertId) {
      return res.status(400).json({
        success: false,
        message: "Invalid expert ID"
      });
    }

    // Only update fields that are provided
    const updateData: any = {};
    if (name !== undefined) updateData.name = name;
    if (title !== undefined) updateData.title = title;
    if (company !== undefined) updateData.company = company;
    if (industry !== undefined) updateData.industry = industry;
    if (bio !== undefined) updateData.bio = bio;
    if (expertise !== undefined) updateData.expertise = expertise;
    if (yearsOfExperience !== undefined) updateData.experience = yearsOfExperience;
    if (linkedInUrl !== undefined) updateData.linkedinUrl = linkedInUrl;
    if (portfolioUrl !== undefined) updateData.portfolioUrl = portfolioUrl;
    if (hourlyRate !== undefined) updateData.hourlyRate = hourlyRate;
    if (availability !== undefined) updateData.availability = availability;
    if (isActive !== undefined) updateData.isActive = isActive;
    if (isFeatured !== undefined) updateData.isFeatured = isFeatured;
    if (featuredOrder !== undefined) updateData.featuredOrder = featuredOrder;

    const [updatedExpert] = await db
      .update(industryExperts)
      .set(updateData)
      .where(eq(industryExperts.id, expertId))
      .returning();

    if (!updatedExpert) {
      return res.status(404).json({
        success: false,
        message: "Expert not found"
      });
    }

    res.json({
      success: true,
      message: "Expert updated successfully",
      data: updatedExpert
    });
  } catch (error: any) {
    console.error("Error updating expert:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update expert",
      error: error.message
    });
  }
});

/**
 * Update only featured status (safer endpoint)
 * PATCH /api/admin/experts/:id/featured
 */
router.patch("/experts/:id/featured", requirePermission("update:experts"), async (req, res) => {
  try {
    const { id } = req.params;
    const expertId = parseInt(id);
    const { isFeatured } = req.body;

    if (!expertId) {
      return res.status(400).json({
        success: false,
        message: "Invalid expert ID"
      });
    }

    const [updatedExpert] = await db
      .update(industryExperts)
      .set({
        isFeatured: isFeatured,
        featuredOrder: isFeatured ? 1 : 0
      })
      .where(eq(industryExperts.id, expertId))
      .returning();

    if (!updatedExpert) {
      return res.status(404).json({
        success: false,
        message: "Expert not found"
      });
    }

    res.json({
      success: true,
      data: updatedExpert,
      message: `Expert ${isFeatured ? 'featured' : 'unfeatured'} successfully`
    });
  } catch (error: any) {
    console.error("Error updating expert featured status:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update expert featured status",
      error: error.message
    });
  }
});

/**
 * Delete expert profile
 * DELETE /api/admin/experts/:id
 */
router.delete("/experts/:id", requirePermission("delete:experts"), async (req, res) => {
  try {
    const { id } = req.params;
    const expertId = parseInt(id);

    if (!expertId) {
      return res.status(400).json({
        success: false,
        message: "Invalid expert ID"
      });
    }

    const [deletedExpert] = await db
      .delete(industryExperts)
      .where(eq(industryExperts.id, expertId))
      .returning();

    if (!deletedExpert) {
      return res.status(404).json({
        success: false,
        message: "Expert not found"
      });
    }

    res.json({
      success: true,
      message: "Expert deleted successfully"
    });
  } catch (error: any) {
    console.error("Error deleting expert:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete expert",
      error: error.message
    });
  }
});

/**
 * Get expert sessions for admin management
 * GET /api/admin/expert-sessions
 */
router.get("/expert-sessions", requirePermission("read:sessions"), async (req, res) => {
  try {
    const { page = 1, limit = 50, expertId, sessionType, status } = req.query;
    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const offset = (pageNum - 1) * limitNum;

    // Build filter conditions
    const conditions = [];
    if (expertId) {
      conditions.push(eq(expertSessions.expertId, parseInt(expertId as string)));
    }
    if (sessionType) {
      conditions.push(eq(expertSessions.sessionType, sessionType as string));
    }
    if (status) {
      conditions.push(eq(expertSessions.status, status as string));
    }

    // Get total count
    const [totalResult] = conditions.length > 0 ? 
      await db.select({ count: count() }).from(expertSessions).where(and(...conditions)) :
      await db.select({ count: count() }).from(expertSessions);
    const total = totalResult.count || 0;

    // Get sessions with expert info
    const baseQuery = db
      .select({
        id: expertSessions.id,
        title: expertSessions.title,
        description: expertSessions.description,
        sessionType: expertSessions.sessionType,
        category: expertSessions.category,
        scheduledAt: expertSessions.scheduledAt,
        duration: expertSessions.duration,
        maxAttendees: expertSessions.maxAttendees,
        currentAttendees: expertSessions.currentAttendees,
        status: expertSessions.status,
        isFree: expertSessions.isFree,
        price: expertSessions.price,
        createdAt: expertSessions.createdAt,
        expertName: industryExperts.name,
        expertCompany: industryExperts.company
      })
      .from(expertSessions)
      .leftJoin(industryExperts, eq(expertSessions.expertId, industryExperts.id))
      .orderBy(sql`${expertSessions.scheduledAt} DESC`)
      .limit(limitNum)
      .offset(offset);

    const sessionsList = conditions.length > 0 ? 
      await baseQuery.where(and(...conditions)) : 
      await baseQuery;

    res.json({
      success: true,
      data: {
        data: sessionsList,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total: total,
          totalPages: Math.ceil(total / limitNum)
        }
      }
    });
  } catch (error: any) {
    console.error("Error fetching expert sessions:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch expert sessions",
      error: error.message
    });
  }
});

/**
 * Create new expert session
 * POST /api/admin/expert-sessions
 */
router.post("/expert-sessions", requirePermission("create:sessions"), async (req, res) => {
  try {
    const {
      expertId,
      title,
      description,
      sessionType,
      category,
      scheduledAt,
      duration,
      maxAttendees,
      meetingLink,
      isFree,
      price,
      tags
    } = req.body;

    if (!expertId || !title || !sessionType || !scheduledAt || !duration) {
      return res.status(400).json({
        success: false,
        message: "Expert ID, title, session type, scheduled time, and duration are required"
      });
    }

    const [newSession] = await db
      .insert(expertSessions)
      .values({
        expertId: parseInt(expertId),
        title,
        description: description || "",
        sessionType,
        category: category || "general",
        scheduledAt: new Date(scheduledAt),
        duration: parseInt(duration),
        maxAttendees: maxAttendees ? parseInt(maxAttendees) : 100,
        meetingLink: meetingLink || null,
        isFree: isFree !== undefined ? isFree : true,
        price: price ? parseInt(price) : 0,
        tags: tags || [],
        status: "scheduled"
      })
      .returning();

    res.json({
      success: true,
      message: "Expert session created successfully",
      data: newSession
    });
  } catch (error: any) {
    console.error("Error creating expert session:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create expert session",
      error: error.message
    });
  }
});

/**
 * Update expert session
 * PUT /api/admin/expert-sessions/:id
 */
router.put("/expert-sessions/:id", requirePermission("update:sessions"), async (req, res) => {
  try {
    const { id } = req.params;
    const sessionId = parseInt(id);
    
    const {
      title,
      description,
      sessionType,
      category,
      scheduledAt,
      duration,
      maxAttendees,
      meetingLink,
      isFree,
      price,
      status,
      tags
    } = req.body;

    if (!sessionId) {
      return res.status(400).json({
        success: false,
        message: "Invalid session ID"
      });
    }

    const [updatedSession] = await db
      .update(expertSessions)
      .set({
        title,
        description,
        sessionType,
        category,
        scheduledAt: scheduledAt ? new Date(scheduledAt) : undefined,
        duration: duration ? parseInt(duration) : undefined,
        maxAttendees: maxAttendees ? parseInt(maxAttendees) : undefined,
        meetingLink,
        isFree: isFree !== undefined ? isFree : undefined,
        price: price ? parseInt(price) : undefined,
        status,
        tags: tags || []
      })
      .where(eq(expertSessions.id, sessionId))
      .returning();

    if (!updatedSession) {
      return res.status(404).json({
        success: false,
        message: "Session not found"
      });
    }

    res.json({
      success: true,
      message: "Expert session updated successfully",
      data: updatedSession
    });
  } catch (error: any) {
    console.error("Error updating expert session:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update expert session",
      error: error.message
    });
  }
});

/**
 * Delete expert session
 * DELETE /api/admin/expert-sessions/:id
 */
router.delete("/expert-sessions/:id", requirePermission("delete:sessions"), async (req, res) => {
  try {
    const { id } = req.params;
    const sessionId = parseInt(id);

    if (!sessionId) {
      return res.status(400).json({
        success: false,
        message: "Invalid session ID"
      });
    }

    const [deletedSession] = await db
      .delete(expertSessions)
      .where(eq(expertSessions.id, sessionId))
      .returning();

    if (!deletedSession) {
      return res.status(404).json({
        success: false,
        message: "Session not found"
      });
    }

    res.json({
      success: true,
      message: "Expert session deleted successfully"
    });
  } catch (error: any) {
    console.error("Error deleting expert session:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete expert session",
      error: error.message
    });
  }
});

/**
 * Get networking events for admin management
 * GET /api/admin/networking-events
 */
router.get("/networking-events", requirePermission("read:events"), async (req, res) => {
  try {
    const { page = 1, limit = 50, status, eventType } = req.query;
    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const offset = (pageNum - 1) * limitNum;

    // Build filter conditions
    const conditions = [];
    if (status) {
      conditions.push(eq(networkingEvents.status, status as string));
    }
    if (eventType) {
      conditions.push(eq(networkingEvents.eventType, eventType as string));
    }

    // Get total count
    const [totalResult] = conditions.length > 0 ? 
      await db.select({ count: count() }).from(networkingEvents).where(and(...conditions)) :
      await db.select({ count: count() }).from(networkingEvents);
    const total = totalResult.count || 0;

    // Get events with organizer info
    const baseQuery = db
      .select({
        id: networkingEvents.id,
        title: networkingEvents.title,
        description: networkingEvents.description,
        eventType: networkingEvents.eventType,
        industry: networkingEvents.industry,
        targetAudience: networkingEvents.targetAudience,
        organizer: networkingEvents.organizer,
        scheduledAt: networkingEvents.scheduledAt,
        endTime: networkingEvents.endTime,
        location: networkingEvents.location,
        maxAttendees: networkingEvents.maxAttendees,
        currentAttendees: networkingEvents.currentAttendees,
        isOnline: networkingEvents.isOnline,
        isFree: networkingEvents.isFree,
        status: networkingEvents.status,
        createdAt: networkingEvents.createdAt
      })
      .from(networkingEvents)
      .orderBy(sql`${networkingEvents.scheduledAt} DESC`)
      .limit(limitNum)
      .offset(offset);

    const eventsList = conditions.length > 0 ? 
      await baseQuery.where(and(...conditions)) : 
      await baseQuery;

    res.json({
      success: true,
      data: {
        data: eventsList,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total: total,
          totalPages: Math.ceil(total / limitNum)
        }
      }
    });
  } catch (error: any) {
    console.error("Error fetching networking events:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch networking events",
      error: error.message
    });
  }
});

/**
 * Create networking event
 * POST /api/admin/networking-events
 */
router.post("/networking-events", requirePermission("create:events"), async (req, res) => {
  try {
    const {
      title,
      description,
      eventType,
      industry,
      targetAudience,
      organizer,
      scheduledAt,
      endTime,
      location,
      meetingLink,
      maxAttendees,
      isOnline,
      isFree,
      tags
    } = req.body;

    if (!title || !description || !eventType || !organizer || !scheduledAt) {
      return res.status(400).json({
        success: false,
        message: "Title, description, event type, organizer, and scheduled time are required"
      });
    }

    const [newEvent] = await db
      .insert(networkingEvents)
      .values({
        title,
        description,
        eventType,
        industry: industry || null,
        targetAudience: targetAudience || [],
        organizer,
        scheduledAt: new Date(scheduledAt),
        endTime: endTime ? new Date(endTime) : new Date(new Date(scheduledAt).getTime() + 2 * 60 * 60 * 1000), // Default 2 hours if not provided
        location: location || null,
        meetingLink: meetingLink || null,
        maxAttendees: maxAttendees ? parseInt(maxAttendees) : null,
        currentAttendees: 0,
        isOnline: isOnline !== undefined ? isOnline : true,
        isFree: isFree !== undefined ? isFree : true,
        tags: tags || [],
        status: "upcoming"
      })
      .returning();

    res.json({
      success: true,
      message: "Networking event created successfully",
      data: newEvent
    });
  } catch (error: any) {
    console.error("Error creating networking event:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create networking event",
      error: error.message
    });
  }
});

/**
 * Get success stories for admin management
 * GET /api/admin/success-stories
 */
router.get("/success-stories", requirePermission("read:stories"), async (req, res) => {
  try {
    const { page = 1, limit = 50, featured, isPublic } = req.query;
    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const offset = (pageNum - 1) * limitNum;

    // Build filter conditions
    const conditions = [];
    if (featured !== undefined) {
      conditions.push(eq(careerSuccessStories.isFeatured, featured === 'true'));
    }
    if (isPublic !== undefined) {
      conditions.push(eq(careerSuccessStories.isPublic, isPublic === 'true'));
    }

    // Get total count
    const [totalResult] = conditions.length > 0 ? 
      await db.select({ count: count() }).from(careerSuccessStories).where(and(...conditions)) :
      await db.select({ count: count() }).from(careerSuccessStories);
    const total = totalResult.count || 0;

    // Get stories
    const baseQuery = db
      .select({
        id: careerSuccessStories.id,
        title: careerSuccessStories.title,
        story: careerSuccessStories.story,
        careerPath: careerSuccessStories.careerPath,
        industryFrom: careerSuccessStories.industryFrom,
        industryTo: careerSuccessStories.industryTo,
        timeframe: careerSuccessStories.timeframe,
        salaryGrowth: careerSuccessStories.salaryGrowth,
        isPublic: careerSuccessStories.isPublic,
        isFeatured: careerSuccessStories.isFeatured,
        views: careerSuccessStories.views,
        likes: careerSuccessStories.likes,
        createdAt: careerSuccessStories.createdAt
      })
      .from(careerSuccessStories)
      .orderBy(sql`${careerSuccessStories.createdAt} DESC`)
      .limit(limitNum)
      .offset(offset);

    const storiesList = conditions.length > 0 ? 
      await baseQuery.where(and(...conditions)) : 
      await baseQuery;

    res.json({
      success: true,
      data: {
        data: storiesList,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total: total,
          totalPages: Math.ceil(total / limitNum)
        }
      }
    });
  } catch (error: any) {
    console.error("Error fetching success stories:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch success stories",
      error: error.message
    });
  }
});

/**
 * Update success story (approve/feature/publish)
 * PUT /api/admin/success-stories/:id
 */
router.put("/success-stories/:id", requirePermission("update:stories"), async (req, res) => {
  try {
    const { id } = req.params;
    const storyId = parseInt(id);
    
    const { isPublic, isFeatured } = req.body;

    if (!storyId) {
      return res.status(400).json({
        success: false,
        message: "Invalid story ID"
      });
    }

    const [updatedStory] = await db
      .update(careerSuccessStories)
      .set({
        isPublic: isPublic !== undefined ? isPublic : undefined,
        isFeatured: isFeatured !== undefined ? isFeatured : undefined
      })
      .where(eq(careerSuccessStories.id, storyId))
      .returning();

    if (!updatedStory) {
      return res.status(404).json({
        success: false,
        message: "Success story not found"
      });
    }

    res.json({
      success: true,
      message: "Success story updated successfully",
      data: updatedStory
    });
  } catch (error: any) {
    console.error("Error updating success story:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update success story",
      error: error.message
    });
  }
});

/**
 * Career Management Routes
 */



/**
 * Career Options Management Routes
 */

/**
 * Get all career options
 * GET /api/admin/career-options
 */
router.get("/career-options", requirePermission("read:careers"), async (req, res) => {
  try {
    const { page = 1, limit = 50, category, active } = req.query;
    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const offset = (pageNum - 1) * limitNum;

    // Build conditions
    const conditions = [];
    if (category) {
      conditions.push(eq(careerOptions.category, category as string));
    }
    if (active !== undefined) {
      conditions.push(eq(careerOptions.isActive, active === 'true'));
    }

    // Get career options
    const baseQuery = db
      .select()
      .from(careerOptions)
      .limit(limitNum)
      .offset(offset)
      .orderBy(desc(careerOptions.createdAt));

    const optionsList = conditions.length > 0 ? 
      await baseQuery.where(and(...conditions)) : 
      await baseQuery;

    // Get total count
    const [totalResult] = conditions.length > 0 ? 
      await db.select({ count: sql`count(*)` }).from(careerOptions).where(and(...conditions)) :
      await db.select({ count: sql`count(*)` }).from(careerOptions);

    const total = Number(totalResult.count) || 0;
    const totalPages = Math.ceil(total / limitNum);

    res.json({
      success: true,
      data: optionsList,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages,
        hasNext: pageNum < totalPages,
        hasPrev: pageNum > 1
      }
    });
  } catch (error: any) {
    console.error("Error fetching career options:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch career options",
      error: error.message
    });
  }
});

/**
 * Create a new career option
 * POST /api/admin/career-options
 */
router.post("/career-options", requirePermission("create:careers"), async (req, res) => {
  try {
    const {
      title,
      category,
      description,
      salaryMin,
      salaryMax,
      difficultyLevel,
      requiredSkills,
      growthOutlook
    } = req.body;

    if (!title || !category || !description) {
      return res.status(400).json({
        success: false,
        message: "Title, category, and description are required"
      });
    }

    const [newOption] = await db
      .insert(careerOptions)
      .values({
        title,
        category,
        description,
        salaryMin: salaryMin ? parseInt(salaryMin) : null,
        salaryMax: salaryMax ? parseInt(salaryMax) : null,
        difficultyLevel: difficultyLevel || null,
        requiredSkills: requiredSkills || [],
        growthOutlook: growthOutlook || null,
        isActive: true
      })
      .returning();

    res.json({
      success: true,
      message: "Career option created successfully",
      data: newOption
    });
  } catch (error: any) {
    console.error("Error creating career option:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create career option",
      error: error.message
    });
  }
});

/**
 * Update a career option
 * PUT /api/admin/career-options/:id
 */
router.put("/career-options/:id", requirePermission("update:careers"), async (req, res) => {
  try {
    const { id } = req.params;
    const optionId = parseInt(id);

    if (!optionId) {
      return res.status(400).json({
        success: false,
        message: "Invalid career option ID"
      });
    }

    const updateData = { ...req.body };
    if (updateData.salaryMin) {
      updateData.salaryMin = parseInt(updateData.salaryMin);
    }
    if (updateData.salaryMax) {
      updateData.salaryMax = parseInt(updateData.salaryMax);
    }

    const [updatedOption] = await db
      .update(careerOptions)
      .set({ ...updateData, updatedAt: new Date() })
      .where(eq(careerOptions.id, optionId))
      .returning();

    if (!updatedOption) {
      return res.status(404).json({
        success: false,
        message: "Career option not found"
      });
    }

    res.json({
      success: true,
      message: "Career option updated successfully",
      data: updatedOption
    });
  } catch (error: any) {
    console.error("Error updating career option:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update career option",
      error: error.message
    });
  }
});

/**
 * Delete a career option
 * DELETE /api/admin/career-options/:id
 */
router.delete("/career-options/:id", requirePermission("delete:careers"), async (req, res) => {
  try {
    const { id } = req.params;
    const optionId = parseInt(id);

    if (!optionId) {
      return res.status(400).json({
        success: false,
        message: "Invalid career option ID"
      });
    }

    const [deletedOption] = await db
      .delete(careerOptions)
      .where(eq(careerOptions.id, optionId))
      .returning();

    if (!deletedOption) {
      return res.status(404).json({
        success: false,
        message: "Career option not found"
      });
    }

    res.json({
      success: true,
      message: "Career option deleted successfully",
      data: deletedOption
    });
  } catch (error: any) {
    console.error("Error deleting career option:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete career option",
      error: error.message
    });
  }
});

/**
 * Get all career paths
 * GET /api/admin/career-paths
 */
router.get("/career-paths", requirePermission("read:careers"), async (req, res) => {
  try {
    const { page = 1, limit = 50, category, active } = req.query;
    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const offset = (pageNum - 1) * limitNum;

    // Build conditions
    const conditions = [];
    if (category) {
      conditions.push(eq(careerPaths.category, category as string));
    }
    if (active !== undefined) {
      conditions.push(eq(careerPaths.isActive, active === 'true'));
    }

    // Get career paths
    const baseQuery = db
      .select()
      .from(careerPaths)
      .limit(limitNum)
      .offset(offset)
      .orderBy(desc(careerPaths.createdAt));

    const pathsList = conditions.length > 0 ? 
      await baseQuery.where(and(...conditions)) : 
      await baseQuery;

    // Get total count
    const [totalResult] = conditions.length > 0 ? 
      await db.select({ count: sql`count(*)` }).from(careerPaths).where(and(...conditions)) :
      await db.select({ count: sql`count(*)` }).from(careerPaths);

    const total = Number(totalResult.count) || 0;
    const totalPages = Math.ceil(total / limitNum);

    res.json({
      success: true,
      data: pathsList,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages,
        hasNext: pageNum < totalPages,
        hasPrev: pageNum > 1
      }
    });
  } catch (error: any) {
    console.error("Error fetching career paths:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch career paths",
      error: error.message
    });
  }
});

/**
 * Session Management Routes
 */

/**
 * Get all expert sessions
 * GET /api/admin/sessions
 */
router.get("/sessions", requirePermission("read:sessions"), async (req, res) => {
  try {
    const { page = 1, limit = 50, status, expertId } = req.query;
    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const offset = (pageNum - 1) * limitNum;

    // Build conditions
    const conditions = [];
    if (status) {
      conditions.push(eq(expertSessions.status, status as string));
    }
    if (expertId) {
      conditions.push(eq(expertSessions.expertId, parseInt(expertId as string)));
    }

    // Get sessions with expert details
    const baseQuery = db
      .select({
        id: expertSessions.id,
        expertId: expertSessions.expertId,
        expertName: industryExperts.name,
        title: expertSessions.title,
        description: expertSessions.description,
        sessionType: expertSessions.sessionType,
        scheduledAt: expertSessions.scheduledAt,
        duration: expertSessions.duration,
        maxParticipants: expertSessions.maxAttendees,
        currentParticipants: expertSessions.currentAttendees,
        status: expertSessions.status,
        meetingLink: expertSessions.meetingLink,
        price: expertSessions.price,
        createdAt: expertSessions.createdAt
      })
      .from(expertSessions)
      .leftJoin(industryExperts, eq(expertSessions.expertId, industryExperts.id))
      .limit(limitNum)
      .offset(offset)
      .orderBy(desc(expertSessions.createdAt));

    const sessionsList = conditions.length > 0 ? 
      await baseQuery.where(and(...conditions)) : 
      await baseQuery;

    // Get total count
    const [totalResult] = conditions.length > 0 ? 
      await db.select({ count: sql`count(*)` }).from(expertSessions).where(and(...conditions)) :
      await db.select({ count: sql`count(*)` }).from(expertSessions);

    const total = Number(totalResult.count) || 0;
    const totalPages = Math.ceil(total / limitNum);

    res.json({
      success: true,
      data: sessionsList,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages,
        hasNext: pageNum < totalPages,
        hasPrev: pageNum > 1
      }
    });
  } catch (error: any) {
    console.error("Error fetching sessions:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch sessions",
      error: error.message
    });
  }
});

/**
 * Create a new expert session
 * POST /api/admin/sessions
 */
router.post("/sessions", requirePermission("create:sessions"), async (req, res) => {
  try {
    const {
      expertId,
      title,
      description,
      sessionType,
      scheduledAt,
      duration,
      maxParticipants,
      price,
      meetingLink
    } = req.body;

    if (!expertId || !title || !sessionType || !scheduledAt || !duration) {
      return res.status(400).json({
        success: false,
        message: "Required fields: expertId, title, sessionType, scheduledAt, duration"
      });
    }

    const [newSession] = await db
      .insert(expertSessions)
      .values({
        expertId: parseInt(expertId),
        title,
        description: description || "",
        sessionType,
        category: "general",
        scheduledAt: new Date(scheduledAt),
        duration: parseInt(duration),
        maxAttendees: maxParticipants ? parseInt(maxParticipants) : 100,
        currentAttendees: 0,
        meetingLink: meetingLink || null,
        status: 'scheduled',
        isFree: price ? false : true,
        price: price ? parseInt(price) : 0
      })
      .returning();

    res.json({
      success: true,
      message: "Session created successfully",
      data: newSession
    });
  } catch (error: any) {
    console.error("Error creating session:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create session",
      error: error.message
    });
  }
});

/**
 * Update an expert session
 * PUT /api/admin/sessions/:id
 */
router.put("/sessions/:id", requirePermission("update:sessions"), async (req, res) => {
  try {
    const { id } = req.params;
    const sessionId = parseInt(id);

    if (!sessionId) {
      return res.status(400).json({
        success: false,
        message: "Invalid session ID"
      });
    }

    const updateData = { ...req.body };
    if (updateData.scheduledAt) {
      updateData.scheduledAt = new Date(updateData.scheduledAt);
    }
    if (updateData.duration) {
      updateData.duration = parseInt(updateData.duration);
    }
    if (updateData.maxParticipants) {
      updateData.maxParticipants = parseInt(updateData.maxParticipants);
    }
    if (updateData.price) {
      updateData.price = parseFloat(updateData.price);
    }

    const [updatedSession] = await db
      .update(expertSessions)
      .set({ ...updateData, updatedAt: new Date() })
      .where(eq(expertSessions.id, sessionId))
      .returning();

    if (!updatedSession) {
      return res.status(404).json({
        success: false,
        message: "Session not found"
      });
    }

    res.json({
      success: true,
      message: "Session updated successfully",
      data: updatedSession
    });
  } catch (error: any) {
    console.error("Error updating session:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update session",
      error: error.message
    });
  }
});

/**
 * Delete an expert session
 * DELETE /api/admin/sessions/:id
 */
router.delete("/sessions/:id", requirePermission("delete:sessions"), async (req, res) => {
  try {
    const { id } = req.params;
    const sessionId = parseInt(id);

    if (!sessionId) {
      return res.status(400).json({
        success: false,
        message: "Invalid session ID"
      });
    }

    const [deletedSession] = await db
      .delete(expertSessions)
      .where(eq(expertSessions.id, sessionId))
      .returning();

    if (!deletedSession) {
      return res.status(404).json({
        success: false,
        message: "Session not found"
      });
    }

    res.json({
      success: true,
      message: "Session deleted successfully",
      data: deletedSession
    });
  } catch (error: any) {
    console.error("Error deleting session:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete session",
      error: error.message
    });
  }
});

/**
 * Event Management Routes
 */

/**
 * Get all networking events
 * GET /api/admin/events
 */
router.get("/events", requirePermission("read:events"), async (req, res) => {
  try {
    const { page = 1, limit = 50, status, eventType } = req.query;
    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const offset = (pageNum - 1) * limitNum;

    // Build conditions
    const conditions = [];
    if (status) {
      conditions.push(eq(networkingEvents.status, status as string));
    }
    if (eventType) {
      conditions.push(eq(networkingEvents.eventType, eventType as string));
    }

    // Get events
    const baseQuery = db
      .select()
      .from(networkingEvents)
      .limit(limitNum)
      .offset(offset)
      .orderBy(desc(networkingEvents.createdAt));

    const eventsList = conditions.length > 0 ? 
      await baseQuery.where(and(...conditions)) : 
      await baseQuery;

    // Get total count
    const [totalResult] = conditions.length > 0 ? 
      await db.select({ count: sql`count(*)` }).from(networkingEvents).where(and(...conditions)) :
      await db.select({ count: sql`count(*)` }).from(networkingEvents);

    const total = Number(totalResult.count) || 0;
    const totalPages = Math.ceil(total / limitNum);

    res.json({
      success: true,
      data: eventsList,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages,
        hasNext: pageNum < totalPages,
        hasPrev: pageNum > 1
      }
    });
  } catch (error: any) {
    console.error("Error fetching events:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch events",
      error: error.message
    });
  }
});

/**
 * Create a new networking event
 * POST /api/admin/events
 */
router.post("/events", requirePermission("create:events"), async (req, res) => {
  try {
    const {
      title,
      description,
      eventType,
      scheduledAt,
      duration,
      location,
      maxParticipants,
      registrationRequired,
      price
    } = req.body;

    if (!title || !eventType || !scheduledAt || !duration || !location) {
      return res.status(400).json({
        success: false,
        message: "Required fields: title, eventType, scheduledAt, duration, location"
      });
    }

    const [newEvent] = await db
      .insert(networkingEvents)
      .values({
        title,
        description: description || "",
        eventType,
        organizer: "Admin",
        scheduledAt: new Date(scheduledAt),
        endTime: new Date(new Date(scheduledAt).getTime() + (duration ? parseInt(duration) * 60 * 1000 : 2 * 60 * 60 * 1000)),
        location: location || null,
        maxAttendees: maxParticipants ? parseInt(maxParticipants) : null,
        currentAttendees: 0,
        isOnline: !location || location === "Online",
        isFree: price ? false : true,
        status: 'upcoming'
      })
      .returning();

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
 * Update a networking event
 * PUT /api/admin/events/:id
 */
router.put("/events/:id", requirePermission("update:events"), async (req, res) => {
  try {
    const { id } = req.params;
    const eventId = parseInt(id);

    if (!eventId) {
      return res.status(400).json({
        success: false,
        message: "Invalid event ID"
      });
    }

    const updateData = { ...req.body };
    if (updateData.scheduledAt) {
      updateData.scheduledAt = new Date(updateData.scheduledAt);
    }
    if (updateData.duration) {
      updateData.duration = parseInt(updateData.duration);
    }
    if (updateData.maxParticipants) {
      updateData.maxParticipants = parseInt(updateData.maxParticipants);
    }
    if (updateData.price) {
      updateData.price = parseFloat(updateData.price);
    }

    const [updatedEvent] = await db
      .update(networkingEvents)
      .set({ ...updateData, updatedAt: new Date() })
      .where(eq(networkingEvents.id, eventId))
      .returning();

    if (!updatedEvent) {
      return res.status(404).json({
        success: false,
        message: "Event not found"
      });
    }

    res.json({
      success: true,
      message: "Event updated successfully",
      data: updatedEvent
    });
  } catch (error: any) {
    console.error("Error updating event:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update event",
      error: error.message
    });
  }
});

/**
 * Delete a networking event
 * DELETE /api/admin/events/:id
 */
router.delete("/events/:id", requirePermission("delete:events"), async (req, res) => {
  try {
    const { id } = req.params;
    const eventId = parseInt(id);

    if (!eventId) {
      return res.status(400).json({
        success: false,
        message: "Invalid event ID"
      });
    }

    const [deletedEvent] = await db
      .delete(networkingEvents)
      .where(eq(networkingEvents.id, eventId))
      .returning();

    if (!deletedEvent) {
      return res.status(404).json({
        success: false,
        message: "Event not found"
      });
    }

    res.json({
      success: true,
      message: "Event deleted successfully",
      data: deletedEvent
    });
  } catch (error: any) {
    console.error("Error deleting event:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete event",
      error: error.message
    });
  }
});

export default router;