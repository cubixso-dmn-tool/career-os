import {
  users, quizResults, courses, enrollments, projects, userProjects,
  softSkills, userSoftSkills, resumes, posts, comments, achievements,
  userAchievements, events, userEvents,
  type User, type QuizResult, type Course, type Enrollment, type Project,
  type UserProject, type SoftSkill, type UserSoftSkill, type Resume,
  type Post, type Comment, type Achievement, type UserAchievement,
  type Event, type UserEvent,
  type InsertUser, type InsertQuizResult, type InsertCourse, type InsertEnrollment,
  type InsertProject, type InsertUserProject, type InsertSoftSkill, type InsertUserSoftSkill,
  type InsertResume, type InsertPost, type InsertComment, type InsertAchievement,
  type InsertUserAchievement, type InsertEvent, type InsertUserEvent
} from "../shared/schema.js";
import { eq, desc, and, or, sql, like } from "drizzle-orm";
import { db } from "./db.js";

// Database storage interface
export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, user: Partial<User>): Promise<User>;

  // Quiz result operations
  getQuizResult(id: number): Promise<QuizResult | undefined>;
  getQuizResultsByUser(userId: number): Promise<QuizResult[]>;
  createQuizResult(quizResult: InsertQuizResult): Promise<QuizResult>;

  // Course operations
  getCourse(id: number): Promise<Course | undefined>;
  getAllCourses(): Promise<Course[]>;
  getFilteredCourses(category?: string, tags?: string[], isFree?: boolean): Promise<Course[]>;
  getRecommendedCourses(userId: number): Promise<Course[]>;
  createCourse(course: InsertCourse): Promise<Course>;

  // Enrollment operations
  getEnrollment(id: number): Promise<Enrollment | undefined>;
  getEnrollmentsByUser(userId: number): Promise<Enrollment[]>;
  createEnrollment(enrollment: InsertEnrollment): Promise<Enrollment>;
  updateEnrollment(id: number, updates: Partial<Enrollment>): Promise<Enrollment>;

  // Project operations
  getProject(id: number): Promise<Project | undefined>;
  getAllProjects(): Promise<Project[]>;
  getFilteredProjects(category?: string, difficulty?: string): Promise<Project[]>;
  getRecommendedProjects(userId: number): Promise<Project[]>;
  createProject(project: InsertProject): Promise<Project>;

  // UserProject operations
  getUserProject(id: number): Promise<UserProject | undefined>;
  getUserProjectsByUser(userId: number): Promise<UserProject[]>;
  createUserProject(userProject: InsertUserProject): Promise<UserProject>;
  updateUserProject(id: number, updates: Partial<UserProject>): Promise<UserProject>;

  // SoftSkill operations
  getSoftSkill(id: number): Promise<SoftSkill | undefined>;
  getAllSoftSkills(): Promise<SoftSkill[]>;
  getFilteredSoftSkills(type?: string): Promise<SoftSkill[]>;
  createSoftSkill(softSkill: InsertSoftSkill): Promise<SoftSkill>;

  // UserSoftSkill operations
  getUserSoftSkill(id: number): Promise<UserSoftSkill | undefined>;
  getUserSoftSkillsByUser(userId: number): Promise<UserSoftSkill[]>;
  createUserSoftSkill(userSoftSkill: InsertUserSoftSkill): Promise<UserSoftSkill>;
  updateUserSoftSkill(id: number, updates: Partial<UserSoftSkill>): Promise<UserSoftSkill>;

  // Resume operations
  getResume(id: number): Promise<Resume | undefined>;
  getResumeByUser(userId: number): Promise<Resume | undefined>;
  getUserResumes(userId: number): Promise<Resume[]>;
  createResume(resume: InsertResume): Promise<Resume>;
  updateResume(id: number, updates: Partial<Resume>): Promise<Resume>;
  deleteResume(id: number): Promise<void>;

  // Post operations
  getPost(id: number): Promise<Post | undefined>;
  getAllPosts(): Promise<Post[]>;
  getRecentPosts(limit: number): Promise<Post[]>;
  createPost(post: InsertPost): Promise<Post>;
  updatePost(id: number, updates: Partial<Post>): Promise<Post>;

  // Comment operations
  getComment(id: number): Promise<Comment | undefined>;
  getCommentsByPost(postId: number): Promise<Comment[]>;
  createComment(comment: InsertComment): Promise<Comment>;

  // Achievement operations
  getAchievement(id: number): Promise<Achievement | undefined>;
  getAllAchievements(): Promise<Achievement[]>;
  createAchievement(achievement: InsertAchievement): Promise<Achievement>;

  // UserAchievement operations
  getUserAchievement(id: number): Promise<UserAchievement | undefined>;
  getUserAchievementsByUser(userId: number): Promise<UserAchievement[]>;
  createUserAchievement(userAchievement: InsertUserAchievement): Promise<UserAchievement>;

  // Event operations
  getEvent(id: number): Promise<Event | undefined>;
  getAllEvents(): Promise<Event[]>;
  getUpcomingEvents(): Promise<Event[]>;
  createEvent(event: InsertEvent): Promise<Event>;

  // UserEvent operations
  getUserEvent(id: number): Promise<UserEvent | undefined>;
  getUserEventsByUser(userId: number): Promise<UserEvent[]>;
  createUserEvent(userEvent: InsertUserEvent): Promise<UserEvent>;

  // Analytics operations
  getTotalUsers(): Promise<number>;
  getActiveUsersToday(): Promise<number>;
  getTotalEvents(): Promise<number>;
  getPendingModerationCount(): Promise<number>;
  getTotalCourses(): Promise<number>;
  getTotalProjects(): Promise<number>;
  getTotalEnrollments(): Promise<number>;
  getUserEngagementMetrics(): Promise<any>;
  getCoursePerformanceMetrics(): Promise<any>;
  getDashboardMetrics(userId: number): Promise<any>;
  getRecentUserActivity(userId: number): Promise<any[]>;
}

// PostgreSQL implementation of the storage interface
export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async updateUser(id: number, updates: Partial<User>): Promise<User> {
    const [updatedUser] = await db
      .update(users)
      .set(updates)
      .where(eq(users.id, id))
      .returning();
    
    if (!updatedUser) throw new Error("User not found");
    return updatedUser;
  }

  // Quiz result operations
  async getQuizResult(id: number): Promise<QuizResult | undefined> {
    const [quizResult] = await db.select().from(quizResults).where(eq(quizResults.id, id));
    return quizResult || undefined;
  }

  async getQuizResultsByUser(userId: number): Promise<QuizResult[]> {
    return await db.select().from(quizResults).where(eq(quizResults.userId, userId));
  }

  async createQuizResult(insertQuizResult: InsertQuizResult): Promise<QuizResult> {
    const quizResultData = {
      ...insertQuizResult, 
      completedAt: new Date()
    };
    
    const [quizResult] = await db.insert(quizResults).values(quizResultData).returning();
    return quizResult;
  }

  // Course operations
  async getCourse(id: number): Promise<Course | undefined> {
    const [course] = await db.select().from(courses).where(eq(courses.id, id));
    return course || undefined;
  }

  async getAllCourses(): Promise<Course[]> {
    return await db.select().from(courses);
  }

  async getFilteredCourses(category?: string, tags?: string[], isFree?: boolean): Promise<Course[]> {
    // Get all courses first
    const allCourses = await this.getAllCourses();
    
    // Manual filtering in memory
    let filteredCourses = allCourses;
    
    if (category) {
      filteredCourses = filteredCourses.filter(course => course.category === category);
    }
    
    if (isFree !== undefined) {
      filteredCourses = filteredCourses.filter(course => course.isFree === isFree);
    }
    
    if (tags && tags.length > 0) {
      filteredCourses = filteredCourses.filter(course => {
        return course.tags && tags.some(tag => course.tags?.includes(tag));
      });
    }
    
    return filteredCourses;
  }

  async getRecommendedCourses(userId: number): Promise<Course[]> {
    return await db
      .select()
      .from(courses)
      .where(eq(courses.isFeatured, true));
  }

  async createCourse(insertCourse: InsertCourse): Promise<Course> {
    const [course] = await db.insert(courses).values(insertCourse).returning();
    return course;
  }

  // Enrollment operations
  async getEnrollment(id: number): Promise<Enrollment | undefined> {
    const [enrollment] = await db.select().from(enrollments).where(eq(enrollments.id, id));
    return enrollment || undefined;
  }

  async getEnrollmentsByUser(userId: number): Promise<Enrollment[]> {
    return await db.select().from(enrollments).where(eq(enrollments.userId, userId));
  }

  async createEnrollment(insertEnrollment: InsertEnrollment): Promise<Enrollment> {
    const enrollmentData = {
      ...insertEnrollment,
      enrolledAt: new Date()
    };
    
    const [enrollment] = await db.insert(enrollments).values(enrollmentData).returning();
    return enrollment;
  }

  async updateEnrollment(id: number, updates: Partial<Enrollment>): Promise<Enrollment> {
    const [updatedEnrollment] = await db
      .update(enrollments)
      .set(updates)
      .where(eq(enrollments.id, id))
      .returning();
    
    if (!updatedEnrollment) throw new Error("Enrollment not found");
    return updatedEnrollment;
  }

  // Project operations
  async getProject(id: number): Promise<Project | undefined> {
    const [project] = await db.select().from(projects).where(eq(projects.id, id));
    return project || undefined;
  }

  async getAllProjects(): Promise<Project[]> {
    return await db.select().from(projects);
  }

  async getFilteredProjects(category?: string, difficulty?: string): Promise<Project[]> {
    // Get all projects
    const allProjects = await this.getAllProjects();
    
    // Apply filters in memory
    let filteredProjects = allProjects;
    
    if (category) {
      filteredProjects = filteredProjects.filter(project => project.category === category);
    }
    
    if (difficulty) {
      filteredProjects = filteredProjects.filter(project => project.difficulty === difficulty);
    }
    
    return filteredProjects;
  }

  async getRecommendedProjects(userId: number): Promise<Project[]> {
    // For now, just return all projects
    return this.getAllProjects();
  }

  async createProject(insertProject: InsertProject): Promise<Project> {
    const [project] = await db.insert(projects).values(insertProject).returning();
    return project;
  }

  // UserProject operations
  async getUserProject(id: number): Promise<UserProject | undefined> {
    const [userProject] = await db.select().from(userProjects).where(eq(userProjects.id, id));
    return userProject || undefined;
  }

  async getUserProjectsByUser(userId: number): Promise<UserProject[]> {
    return await db.select().from(userProjects).where(eq(userProjects.userId, userId));
  }

  async createUserProject(insertUserProject: InsertUserProject): Promise<UserProject> {
    const userProjectData = {
      ...insertUserProject,
      startedAt: new Date()
    };
    
    const [userProject] = await db.insert(userProjects).values(userProjectData).returning();
    return userProject;
  }

  async updateUserProject(id: number, updates: Partial<UserProject>): Promise<UserProject> {
    const [updatedUserProject] = await db
      .update(userProjects)
      .set(updates)
      .where(eq(userProjects.id, id))
      .returning();
    
    if (!updatedUserProject) throw new Error("User project not found");
    return updatedUserProject;
  }

  // SoftSkill operations
  async getSoftSkill(id: number): Promise<SoftSkill | undefined> {
    const [softSkill] = await db.select().from(softSkills).where(eq(softSkills.id, id));
    return softSkill || undefined;
  }

  async getAllSoftSkills(): Promise<SoftSkill[]> {
    return await db.select().from(softSkills);
  }

  async getFilteredSoftSkills(type?: string): Promise<SoftSkill[]> {
    if (type) {
      return await db.select().from(softSkills).where(eq(softSkills.type, type));
    }
    
    return this.getAllSoftSkills();
  }

  async createSoftSkill(insertSoftSkill: InsertSoftSkill): Promise<SoftSkill> {
    const [softSkill] = await db.insert(softSkills).values(insertSoftSkill).returning();
    return softSkill;
  }

  // UserSoftSkill operations
  async getUserSoftSkill(id: number): Promise<UserSoftSkill | undefined> {
    const [userSoftSkill] = await db.select().from(userSoftSkills).where(eq(userSoftSkills.id, id));
    return userSoftSkill || undefined;
  }

  async getUserSoftSkillsByUser(userId: number): Promise<UserSoftSkill[]> {
    return await db.select().from(userSoftSkills).where(eq(userSoftSkills.userId, userId));
  }

  async createUserSoftSkill(insertUserSoftSkill: InsertUserSoftSkill): Promise<UserSoftSkill> {
    const [userSoftSkill] = await db.insert(userSoftSkills).values(insertUserSoftSkill).returning();
    return userSoftSkill;
  }

  async updateUserSoftSkill(id: number, updates: Partial<UserSoftSkill>): Promise<UserSoftSkill> {
    const [updatedUserSoftSkill] = await db
      .update(userSoftSkills)
      .set(updates)
      .where(eq(userSoftSkills.id, id))
      .returning();
    
    if (!updatedUserSoftSkill) throw new Error("User soft skill not found");
    return updatedUserSoftSkill;
  }

  // Resume operations
  async getResume(id: number): Promise<Resume | undefined> {
    const [resume] = await db.select().from(resumes).where(eq(resumes.id, id));
    return resume || undefined;
  }

  async getResumeByUser(userId: number): Promise<Resume | undefined> {
    const [resume] = await db
      .select()
      .from(resumes)
      .where(eq(resumes.userId, userId))
      .orderBy(desc(resumes.updatedAt));
    return resume || undefined;
  }

  async getUserResumes(userId: number): Promise<Resume[]> {
    const userResumes = await db
      .select()
      .from(resumes)
      .where(eq(resumes.userId, userId))
      .orderBy(desc(resumes.updatedAt));
    return userResumes;
  }

  async createResume(insertResume: InsertResume): Promise<Resume> {
    const [resume] = await db.insert(resumes).values(insertResume).returning();
    return resume;
  }

  async updateResume(id: number, updates: Partial<Resume>): Promise<Resume> {
    const updatedData = {
      ...updates,
      updatedAt: new Date()
    };
    
    const [updatedResume] = await db
      .update(resumes)
      .set(updatedData)
      .where(eq(resumes.id, id))
      .returning();
    
    if (!updatedResume) throw new Error("Resume not found");
    return updatedResume;
  }

  async deleteResume(id: number): Promise<void> {
    await db.delete(resumes).where(eq(resumes.id, id));
  }

  // Post operations
  async getPost(id: number): Promise<Post | undefined> {
    const [post] = await db.select().from(posts).where(eq(posts.id, id));
    return post || undefined;
  }

  async getAllPosts(): Promise<Post[]> {
    return await db.select().from(posts).orderBy(desc(posts.createdAt));
  }

  async getRecentPosts(limit: number): Promise<Post[]> {
    return await db.select().from(posts).orderBy(desc(posts.createdAt)).limit(limit);
  }

  async createPost(insertPost: InsertPost): Promise<Post> {
    const postData = {
      ...insertPost,
      likes: 0,
      replies: 0,
      createdAt: new Date()
    };
    
    const [post] = await db.insert(posts).values(postData).returning();
    return post;
  }

  async updatePost(id: number, updates: Partial<Post>): Promise<Post> {
    const [updatedPost] = await db
      .update(posts)
      .set(updates)
      .where(eq(posts.id, id))
      .returning();
    
    if (!updatedPost) throw new Error("Post not found");
    return updatedPost;
  }

  // Comment operations
  async getComment(id: number): Promise<Comment | undefined> {
    const [comment] = await db.select().from(comments).where(eq(comments.id, id));
    return comment || undefined;
  }

  async getCommentsByPost(postId: number): Promise<Comment[]> {
    return await db
      .select()
      .from(comments)
      .where(eq(comments.postId, postId))
      .orderBy(comments.createdAt);
  }

  async createComment(insertComment: InsertComment): Promise<Comment> {
    const commentData = {
      ...insertComment,
      createdAt: new Date()
    };
    
    const [comment] = await db.insert(comments).values(commentData).returning();
    
    // Update post's reply count
    const post = await this.getPost(insertComment.postId);
    if (post) {
      await this.updatePost(post.id, { replies: post.replies + 1 });
    }
    
    return comment;
  }

  // Achievement operations
  async getAchievement(id: number): Promise<Achievement | undefined> {
    const [achievement] = await db.select().from(achievements).where(eq(achievements.id, id));
    return achievement || undefined;
  }

  async getAllAchievements(): Promise<Achievement[]> {
    return await db.select().from(achievements);
  }

  async createAchievement(insertAchievement: InsertAchievement): Promise<Achievement> {
    const [achievement] = await db.insert(achievements).values(insertAchievement).returning();
    return achievement;
  }

  // UserAchievement operations
  async getUserAchievement(id: number): Promise<UserAchievement | undefined> {
    const [userAchievement] = await db.select().from(userAchievements).where(eq(userAchievements.id, id));
    return userAchievement || undefined;
  }

  async getUserAchievementsByUser(userId: number): Promise<UserAchievement[]> {
    return await db
      .select()
      .from(userAchievements)
      .where(eq(userAchievements.userId, userId));
  }

  async createUserAchievement(insertUserAchievement: InsertUserAchievement): Promise<UserAchievement> {
    const userAchievementData = {
      ...insertUserAchievement,
      earnedAt: new Date()
    };
    
    const [userAchievement] = await db.insert(userAchievements).values(userAchievementData).returning();
    return userAchievement;
  }

  // Event operations
  async getEvent(id: number): Promise<Event | undefined> {
    const [event] = await db.select().from(events).where(eq(events.id, id));
    return event || undefined;
  }

  async getAllEvents(): Promise<Event[]> {
    return await db.select().from(events).orderBy(events.date);
  }

  async getUpcomingEvents(): Promise<Event[]> {
    const now = new Date();
    return await db
      .select()
      .from(events)
      .where(sql`${events.date} > ${now}`)
      .orderBy(events.date);
  }

  async createEvent(insertEvent: InsertEvent): Promise<Event> {
    const [event] = await db.insert(events).values(insertEvent).returning();
    return event;
  }

  // UserEvent operations
  async getUserEvent(id: number): Promise<UserEvent | undefined> {
    const [userEvent] = await db.select().from(userEvents).where(eq(userEvents.id, id));
    return userEvent || undefined;
  }

  async getUserEventsByUser(userId: number): Promise<UserEvent[]> {
    return await db
      .select()
      .from(userEvents)
      .where(eq(userEvents.userId, userId));
  }

  async createUserEvent(insertUserEvent: InsertUserEvent): Promise<UserEvent> {
    const userEventData = {
      ...insertUserEvent,
      registeredAt: new Date()
    };
    
    const [userEvent] = await db.insert(userEvents).values(userEventData).returning();
    return userEvent;
  }

  // Analytics operations implementation
  async getTotalUsers(): Promise<number> {
    const result = await db.select({ count: sql<number>`count(*)` }).from(users);
    return result[0].count;
  }

  async getActiveUsersToday(): Promise<number> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Count users who have any activity today (enrollments, posts, logins, etc.)
    const result = await db
      .select({ count: sql<number>`count(distinct user_id)` })
      .from(enrollments)
      .where(sql`enrolled_at >= ${today}`);
    
    return result[0].count;
  }

  async getTotalEvents(): Promise<number> {
    const result = await db.select({ count: sql<number>`count(*)` }).from(events);
    return result[0].count;
  }

  async getPendingModerationCount(): Promise<number> {
    // For now, return 0 as we'll implement real moderation counts later
    return 0;
  }

  async getTotalCourses(): Promise<number> {
    const result = await db.select({ count: sql<number>`count(*)` }).from(courses);
    return result[0].count;
  }

  async getTotalProjects(): Promise<number> {
    const result = await db.select({ count: sql<number>`count(*)` }).from(projects);
    return result[0].count;
  }

  async getTotalEnrollments(): Promise<number> {
    const result = await db.select({ count: sql<number>`count(*)` }).from(enrollments);
    return result[0].count;
  }

  async getUserEngagementMetrics(): Promise<any> {
    // Calculate user engagement metrics
    const [
      totalUsers,
      activeUsers,
      completedCourses,
      averageProgress
    ] = await Promise.all([
      this.getTotalUsers(),
      this.getActiveUsersToday(),
      db.select({ count: sql<number>`count(*)` }).from(enrollments).where(sql`is_completed = true`),
      db.select({ avg: sql<number>`avg(progress)` }).from(enrollments)
    ]);

    return {
      totalUsers,
      activeUsers,
      completedCourses: completedCourses[0].count,
      averageProgress: Math.round(averageProgress[0].avg || 0),
      engagementRate: totalUsers > 0 ? ((activeUsers / totalUsers) * 100).toFixed(1) : "0.0"
    };
  }

  async getCoursePerformanceMetrics(): Promise<any> {
    // Get top performing courses by enrollment and completion
    const topCourses = await db
      .select({
        title: courses.title,
        enrollments: sql<number>`count(enrollments.id)`,
        completions: sql<number>`count(case when enrollments.is_completed then 1 end)`,
        avgRating: sql<number>`coalesce(avg(courses.rating), 0)`
      })
      .from(courses)
      .leftJoin(enrollments, sql`courses.id = enrollments.course_id`)
      .groupBy(courses.id, courses.title, courses.rating)
      .orderBy(sql`count(enrollments.id) desc`)
      .limit(5);

    return {
      topCourses: topCourses.map(course => ({
        ...course,
        completionRate: course.enrollments > 0 ? 
          ((course.completions / course.enrollments) * 100).toFixed(1) : "0.0"
      }))
    };
  }

  // Additional analytics methods for comprehensive data
  async getDashboardMetrics(userId: number): Promise<any> {
    const [
      userCourses,
      userProjects,
      userAchievements,
      recentActivity
    ] = await Promise.all([
      this.getEnrollmentsByUser(userId),
      this.getUserProjectsByUser(userId),
      this.getUserAchievementsByUser(userId),
      this.getRecentUserActivity(userId)
    ]);

    return {
      courses: {
        enrolled: userCourses.length,
        completed: userCourses.filter(c => c.isCompleted).length,
        inProgress: userCourses.filter(c => !c.isCompleted && c.progress > 0).length
      },
      projects: {
        total: userProjects.length,
        completed: userProjects.filter(p => p.isCompleted).length,
        inProgress: userProjects.filter(p => !p.isCompleted && p.progress > 0).length
      },
      achievements: userAchievements.length,
      recentActivity
    };
  }

  async getRecentUserActivity(userId: number): Promise<any[]> {
    // Get recent enrollments, project updates, and achievements
    const recentEnrollments = await db
      .select({
        type: sql<string>`'enrollment'`,
        title: courses.title,
        date: enrollments.enrolledAt
      })
      .from(enrollments)
      .innerJoin(courses, sql`enrollments.course_id = courses.id`)
      .where(sql`enrollments.user_id = ${userId}`)
      .orderBy(sql`enrollments.enrolled_at desc`)
      .limit(5);

    return recentEnrollments;
  }
}

export const storage = new DatabaseStorage();