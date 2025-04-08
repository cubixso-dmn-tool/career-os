import {
  users, User, InsertUser,
  quizResults, QuizResult, InsertQuizResult,
  courses, Course, InsertCourse,
  enrollments, Enrollment, InsertEnrollment,
  projects, Project, InsertProject,
  userProjects, UserProject, InsertUserProject,
  softSkills, SoftSkill, InsertSoftSkill,
  userSoftSkills, UserSoftSkill, InsertUserSoftSkill,
  resumes, Resume, InsertResume,
  posts, Post, InsertPost,
  comments, Comment, InsertComment,
  achievements, Achievement, InsertAchievement,
  userAchievements, UserAchievement, InsertUserAchievement,
  events, Event, InsertEvent,
  userEvents, UserEvent, InsertUserEvent,
  dailyBytes, DailyByte, InsertDailyByte,
  userDailyBytes, UserDailyByte, InsertUserDailyByte,
  communities, Community, InsertCommunity,
  communityMembers, CommunityMember, InsertCommunityMember,
  communityPosts, CommunityPost, InsertCommunityPost,
  communityPostComments, CommunityPostComment, InsertCommunityPostComment,
  communityEvents, CommunityEvent, InsertCommunityEvent,
  communityEventAttendees, CommunityEventAttendee, InsertCommunityEventAttendee,
  polls, Poll, InsertPoll,
  pollResponses, PollResponse, InsertPollResponse,
  flaggedContent, FlaggedContent, InsertFlaggedContent,
  communityCollaborations, CommunityCollaboration, InsertCommunityCollaboration
} from "@shared/schema";

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
  createResume(resume: InsertResume): Promise<Resume>;
  updateResume(id: number, updates: Partial<Resume>): Promise<Resume>;

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
  
  // DailyByte operations
  getDailyByte(id: number): Promise<DailyByte | undefined>;
  getAllDailyBytes(): Promise<DailyByte[]>;
  getTodaysDailyByte(): Promise<DailyByte | undefined>;
  createDailyByte(dailyByte: InsertDailyByte): Promise<DailyByte>;
  
  // UserDailyByte operations
  getUserDailyByte(id: number): Promise<UserDailyByte | undefined>; 
  getUserDailyBytesByUser(userId: number): Promise<UserDailyByte[]>;
  getUserDailyByteByDailyByteAndUser(dailyByteId: number, userId: number): Promise<UserDailyByte | undefined>;
  createUserDailyByte(userDailyByte: InsertUserDailyByte): Promise<UserDailyByte>;
  updateUserDailyByte(id: number, updates: Partial<UserDailyByte>): Promise<UserDailyByte>;
  
  // Community operations
  getCommunity(id: number): Promise<Community | undefined>;
  getCommunityByName(name: string): Promise<Community | undefined>;
  getAllCommunities(): Promise<Community[]>;
  getVerifiedCommunities(): Promise<Community[]>;
  getCommunitiesByFounder(founderId: number): Promise<Community[]>;
  createCommunity(community: InsertCommunity): Promise<Community>;
  updateCommunity(id: number, updates: Partial<Community>): Promise<Community>;

  // Community Member operations
  getCommunityMember(communityId: number, userId: number): Promise<CommunityMember | undefined>;
  getCommunityMembers(communityId: number): Promise<CommunityMember[]>;
  getCommunityMembersByRole(communityId: number, role: string): Promise<CommunityMember[]>;
  createCommunityMember(member: InsertCommunityMember): Promise<CommunityMember>;
  updateCommunityMember(communityId: number, userId: number, updates: Partial<CommunityMember>): Promise<CommunityMember>;
  
  // Community Post operations
  getCommunityPost(id: number): Promise<CommunityPost | undefined>;
  getCommunityPosts(communityId: number): Promise<CommunityPost[]>;
  getCommunityPostsByType(communityId: number, type: string): Promise<CommunityPost[]>;
  getFeaturedCommunityPosts(communityId: number): Promise<CommunityPost[]>;
  createCommunityPost(post: InsertCommunityPost): Promise<CommunityPost>;
  updateCommunityPost(id: number, updates: Partial<CommunityPost>): Promise<CommunityPost>;
  
  // Community Post Comment operations
  getCommunityPostComment(id: number): Promise<CommunityPostComment | undefined>;
  getCommunityPostComments(postId: number): Promise<CommunityPostComment[]>;
  createCommunityPostComment(comment: InsertCommunityPostComment): Promise<CommunityPostComment>;
  updateCommunityPostComment(id: number, updates: Partial<CommunityPostComment>): Promise<CommunityPostComment>;
  
  // Community Event operations
  getCommunityEvent(id: number): Promise<CommunityEvent | undefined>;
  getCommunityEvents(communityId: number): Promise<CommunityEvent[]>;
  getUpcomingCommunityEvents(communityId: number): Promise<CommunityEvent[]>;
  createCommunityEvent(event: InsertCommunityEvent): Promise<CommunityEvent>;
  updateCommunityEvent(id: number, updates: Partial<CommunityEvent>): Promise<CommunityEvent>;
  
  // Community Event Attendee operations
  getCommunityEventAttendee(eventId: number, userId: number): Promise<CommunityEventAttendee | undefined>;
  getCommunityEventAttendees(eventId: number): Promise<CommunityEventAttendee[]>;
  createCommunityEventAttendee(attendee: InsertCommunityEventAttendee): Promise<CommunityEventAttendee>;
  updateCommunityEventAttendee(eventId: number, userId: number, updates: Partial<CommunityEventAttendee>): Promise<CommunityEventAttendee>;
  
  // Poll operations
  getPoll(id: number): Promise<Poll | undefined>;
  getPollsByPost(postId: number): Promise<Poll[]>;
  createPoll(poll: InsertPoll): Promise<Poll>;
  
  // Poll Response operations
  getPollResponse(id: number): Promise<PollResponse | undefined>;
  getPollResponsesByPoll(pollId: number): Promise<PollResponse[]>;
  getPollResponseByPollAndUser(pollId: number, userId: number): Promise<PollResponse | undefined>;
  createPollResponse(response: InsertPollResponse): Promise<PollResponse>;
  
  // Flagged Content operations
  getFlaggedContent(id: number): Promise<FlaggedContent | undefined>;
  getFlaggedContentByStatus(status: string): Promise<FlaggedContent[]>;
  createFlaggedContent(content: InsertFlaggedContent): Promise<FlaggedContent>;
  updateFlaggedContent(id: number, updates: Partial<FlaggedContent>): Promise<FlaggedContent>;
  
  // Community Collaboration operations
  getCommunityCollaboration(id: number): Promise<CommunityCollaboration | undefined>;
  getCommunityCollaborations(communityId: number): Promise<CommunityCollaboration[]>;
  getCommunityCollaborationsByStatus(communityId: number, status: string): Promise<CommunityCollaboration[]>;
  createCommunityCollaboration(collaboration: InsertCommunityCollaboration): Promise<CommunityCollaboration>;
  updateCommunityCollaboration(id: number, updates: Partial<CommunityCollaboration>): Promise<CommunityCollaboration>;
}

import { eq, desc, and, or, sql, like } from "drizzle-orm";
import { db } from "./db";

// JSON type definition
type Json = Record<string, any>;

export class DatabaseStorage implements IStorage {
  constructor() {
    // No initialization needed for database storage
  }

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
    // Simplified approach - get all courses first
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
    // In a real implementation, this would use the user's quiz results and other data
    // to recommend courses. For simplicity, we're just returning featured courses.
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
    return await db
      .select()
      .from(enrollments)
      .where(eq(enrollments.userId, userId));
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
    // Get all projects and filter in memory
    const allProjects = await db.select().from(projects);
    
    // Apply filters in memory
    return allProjects.filter(project => {
      // Check category filter
      if (category && project.category !== category) {
        return false;
      }
      
      // Check difficulty filter
      if (difficulty && project.difficulty !== difficulty) {
        return false;
      }
      
      return true;
    });
  }

  async getRecommendedProjects(userId: number): Promise<Project[]> {
    // In a real implementation, this would be based on the user's profile and progress
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
    return await db
      .select()
      .from(userProjects)
      .where(eq(userProjects.userId, userId));
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
      return await db
        .select()
        .from(softSkills)
        .where(eq(softSkills.type, type));
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
    return await db
      .select()
      .from(userSoftSkills)
      .where(eq(userSoftSkills.userId, userId));
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
      .where(eq(resumes.userId, userId));
    
    return resume || undefined;
  }

  async createResume(insertResume: InsertResume): Promise<Resume> {
    const resumeData = {
      ...insertResume,
      updatedAt: new Date()
    };
    
    const [resume] = await db.insert(resumes).values(resumeData).returning();
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

  // DailyByte operations
  async getDailyByte(id: number): Promise<DailyByte | undefined> {
    const [dailyByte] = await db.select().from(dailyBytes).where(eq(dailyBytes.id, id));
    return dailyByte || undefined;
  }

  async getAllDailyBytes(): Promise<DailyByte[]> {
    return await db.select().from(dailyBytes).orderBy(desc(dailyBytes.createdAt));
  }

  async getTodaysDailyByte(): Promise<DailyByte | undefined> {
    // Get today's date at beginning of day (midnight)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // For the end of the day (23:59:59.999)
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);
    
    // Find the daily byte for today
    const [dailyByte] = await db
      .select()
      .from(dailyBytes)
      .where(
        and(
          sql`${dailyBytes.createdAt} >= ${today}`,
          sql`${dailyBytes.createdAt} <= ${endOfDay}`
        )
      );
    
    return dailyByte || undefined;
  }

  async createDailyByte(insertDailyByte: InsertDailyByte): Promise<DailyByte> {
    const dailyByteData = {
      ...insertDailyByte,
      createdAt: new Date()
    };
    
    const [dailyByte] = await db.insert(dailyBytes).values(dailyByteData).returning();
    return dailyByte;
  }

  // UserDailyByte operations
  async getUserDailyByte(id: number): Promise<UserDailyByte | undefined> {
    const [userDailyByte] = await db.select().from(userDailyBytes).where(eq(userDailyBytes.id, id));
    return userDailyByte || undefined;
  }

  async getUserDailyBytesByUser(userId: number): Promise<UserDailyByte[]> {
    return await db
      .select()
      .from(userDailyBytes)
      .where(eq(userDailyBytes.userId, userId))
      .orderBy(desc(userDailyBytes.completedAt));
  }

  async getUserDailyByteByDailyByteAndUser(dailyByteId: number, userId: number): Promise<UserDailyByte | undefined> {
    const [userDailyByte] = await db
      .select()
      .from(userDailyBytes)
      .where(
        and(
          eq(userDailyBytes.dailyByteId, dailyByteId),
          eq(userDailyBytes.userId, userId)
        )
      );
    
    return userDailyByte || undefined;
  }

  async createUserDailyByte(insertUserDailyByte: InsertUserDailyByte): Promise<UserDailyByte> {
    const userDailyByteData = {
      ...insertUserDailyByte,
      completedAt: new Date()
    };
    
    const [userDailyByte] = await db.insert(userDailyBytes).values(userDailyByteData).returning();
    return userDailyByte;
  }

  async updateUserDailyByte(id: number, updates: Partial<UserDailyByte>): Promise<UserDailyByte> {
    const [updatedUserDailyByte] = await db
      .update(userDailyBytes)
      .set(updates)
      .where(eq(userDailyBytes.id, id))
      .returning();
    
    if (!updatedUserDailyByte) throw new Error("User daily byte not found");
    return updatedUserDailyByte;
  }

  // Community operations
  async getCommunity(id: number): Promise<Community | undefined> {
    const [community] = await db.select().from(communities).where(eq(communities.id, id));
    return community || undefined;
  }

  async getCommunityByName(name: string): Promise<Community | undefined> {
    const [community] = await db.select().from(communities).where(eq(communities.name, name));
    return community || undefined;
  }

  async getAllCommunities(): Promise<Community[]> {
    return await db.select().from(communities);
  }

  async getVerifiedCommunities(): Promise<Community[]> {
    return await db
      .select()
      .from(communities)
      .where(eq(communities.isVerified, true));
  }

  async getCommunitiesByFounder(founderId: number): Promise<Community[]> {
    return await db
      .select()
      .from(communities)
      .where(eq(communities.founderId, founderId));
  }

  async createCommunity(insertCommunity: InsertCommunity): Promise<Community> {
    const communityData = {
      ...insertCommunity,
      memberCount: 0,
      createdAt: new Date()
    };
    
    const [community] = await db.insert(communities).values(communityData).returning();
    
    // Auto-add the founder as an admin member
    await this.createCommunityMember({
      communityId: community.id,
      userId: community.founderId,
      role: 'admin',
      isActive: true
    });
    
    return community;
  }

  async updateCommunity(id: number, updates: Partial<Community>): Promise<Community> {
    const [updatedCommunity] = await db
      .update(communities)
      .set(updates)
      .where(eq(communities.id, id))
      .returning();
    
    if (!updatedCommunity) throw new Error("Community not found");
    return updatedCommunity;
  }

  // Community Member operations
  async getCommunityMember(communityId: number, userId: number): Promise<CommunityMember | undefined> {
    const [member] = await db
      .select()
      .from(communityMembers)
      .where(
        and(
          eq(communityMembers.communityId, communityId),
          eq(communityMembers.userId, userId)
        )
      );
    
    return member || undefined;
  }

  async getCommunityMembers(communityId: number): Promise<CommunityMember[]> {
    return await db
      .select()
      .from(communityMembers)
      .where(eq(communityMembers.communityId, communityId));
  }

  async getCommunityMembersByRole(communityId: number, role: string): Promise<CommunityMember[]> {
    return await db
      .select()
      .from(communityMembers)
      .where(
        and(
          eq(communityMembers.communityId, communityId),
          eq(communityMembers.role, role)
        )
      );
  }

  async createCommunityMember(insertMember: InsertCommunityMember): Promise<CommunityMember> {
    const memberData = {
      ...insertMember,
      joinedAt: new Date()
    };
    
    const [member] = await db.insert(communityMembers).values(memberData).returning();
    
    // Update community member count
    await db.execute(sql`
      UPDATE communities
      SET member_count = member_count + 1
      WHERE id = ${memberData.communityId}
    `);
    
    return member;
  }

  async updateCommunityMember(communityId: number, userId: number, updates: Partial<CommunityMember>): Promise<CommunityMember> {
    const [updatedMember] = await db
      .update(communityMembers)
      .set(updates)
      .where(
        and(
          eq(communityMembers.communityId, communityId),
          eq(communityMembers.userId, userId)
        )
      )
      .returning();
    
    if (!updatedMember) throw new Error("Community member not found");
    
    // If member is deactivated, update community member count
    if (updates.isActive === false) {
      await db.execute(sql`
        UPDATE communities
        SET member_count = member_count - 1
        WHERE id = ${communityId}
      `);
    } else if (updates.isActive === true) {
      // If member is reactivated, update community member count
      await db.execute(sql`
        UPDATE communities
        SET member_count = member_count + 1
        WHERE id = ${communityId}
      `);
    }
    
    return updatedMember;
  }

  // Community Post operations
  async getCommunityPost(id: number): Promise<CommunityPost | undefined> {
    const [post] = await db.select().from(communityPosts).where(eq(communityPosts.id, id));
    return post || undefined;
  }

  async getCommunityPosts(communityId: number): Promise<CommunityPost[]> {
    return await db
      .select()
      .from(communityPosts)
      .where(eq(communityPosts.communityId, communityId))
      .orderBy(desc(communityPosts.createdAt));
  }

  async getCommunityPostsByType(communityId: number, type: string): Promise<CommunityPost[]> {
    return await db
      .select()
      .from(communityPosts)
      .where(
        and(
          eq(communityPosts.communityId, communityId),
          eq(communityPosts.type, type)
        )
      )
      .orderBy(desc(communityPosts.createdAt));
  }

  async getFeaturedCommunityPosts(communityId: number): Promise<CommunityPost[]> {
    return await db
      .select()
      .from(communityPosts)
      .where(
        and(
          eq(communityPosts.communityId, communityId),
          eq(communityPosts.isFeatured, true)
        )
      )
      .orderBy(desc(communityPosts.createdAt));
  }

  async createCommunityPost(insertPost: InsertCommunityPost): Promise<CommunityPost> {
    const postData = {
      ...insertPost,
      likes: 0,
      views: 0,
      comments: 0,
      createdAt: new Date()
    };
    
    const [post] = await db.insert(communityPosts).values(postData).returning();
    return post;
  }

  async updateCommunityPost(id: number, updates: Partial<CommunityPost>): Promise<CommunityPost> {
    const [updatedPost] = await db
      .update(communityPosts)
      .set(updates)
      .where(eq(communityPosts.id, id))
      .returning();
    
    if (!updatedPost) throw new Error("Community post not found");
    return updatedPost;
  }

  // Community Post Comment operations
  async getCommunityPostComment(id: number): Promise<CommunityPostComment | undefined> {
    const [comment] = await db.select().from(communityPostComments).where(eq(communityPostComments.id, id));
    return comment || undefined;
  }

  async getCommunityPostComments(postId: number): Promise<CommunityPostComment[]> {
    return await db
      .select()
      .from(communityPostComments)
      .where(eq(communityPostComments.postId, postId))
      .orderBy(desc(communityPostComments.createdAt));
  }

  async createCommunityPostComment(insertComment: InsertCommunityPostComment): Promise<CommunityPostComment> {
    const commentData = {
      ...insertComment,
      likes: 0,
      createdAt: new Date()
    };
    
    const [comment] = await db.insert(communityPostComments).values(commentData).returning();
    
    // Update post comment count
    await db.execute(sql`
      UPDATE community_posts
      SET comments = comments + 1
      WHERE id = ${commentData.postId}
    `);
    
    return comment;
  }

  async updateCommunityPostComment(id: number, updates: Partial<CommunityPostComment>): Promise<CommunityPostComment> {
    const [updatedComment] = await db
      .update(communityPostComments)
      .set(updates)
      .where(eq(communityPostComments.id, id))
      .returning();
    
    if (!updatedComment) throw new Error("Community post comment not found");
    return updatedComment;
  }

  // Community Event operations
  async getCommunityEvent(id: number): Promise<CommunityEvent | undefined> {
    const [event] = await db.select().from(communityEvents).where(eq(communityEvents.id, id));
    return event || undefined;
  }

  async getCommunityEvents(communityId: number): Promise<CommunityEvent[]> {
    return await db
      .select()
      .from(communityEvents)
      .where(eq(communityEvents.communityId, communityId))
      .orderBy(desc(communityEvents.startDate));
  }

  async getUpcomingCommunityEvents(communityId: number): Promise<CommunityEvent[]> {
    const now = new Date();
    
    return await db
      .select()
      .from(communityEvents)
      .where(
        and(
          eq(communityEvents.communityId, communityId),
          sql`${communityEvents.startDate} > ${now}`
        )
      )
      .orderBy(communityEvents.startDate);
  }

  async createCommunityEvent(insertEvent: InsertCommunityEvent): Promise<CommunityEvent> {
    const eventData = {
      ...insertEvent,
      createdAt: new Date()
    };
    
    const [event] = await db.insert(communityEvents).values(eventData).returning();
    return event;
  }

  async updateCommunityEvent(id: number, updates: Partial<CommunityEvent>): Promise<CommunityEvent> {
    const [updatedEvent] = await db
      .update(communityEvents)
      .set(updates)
      .where(eq(communityEvents.id, id))
      .returning();
    
    if (!updatedEvent) throw new Error("Community event not found");
    return updatedEvent;
  }

  // Community Event Attendee operations
  async getCommunityEventAttendee(eventId: number, userId: number): Promise<CommunityEventAttendee | undefined> {
    const [attendee] = await db
      .select()
      .from(communityEventAttendees)
      .where(
        and(
          eq(communityEventAttendees.eventId, eventId),
          eq(communityEventAttendees.userId, userId)
        )
      );
    
    return attendee || undefined;
  }

  async getCommunityEventAttendees(eventId: number): Promise<CommunityEventAttendee[]> {
    return await db
      .select()
      .from(communityEventAttendees)
      .where(eq(communityEventAttendees.eventId, eventId));
  }

  async createCommunityEventAttendee(insertAttendee: InsertCommunityEventAttendee): Promise<CommunityEventAttendee> {
    const attendeeData = {
      ...insertAttendee,
      registeredAt: new Date()
    };
    
    const [attendee] = await db.insert(communityEventAttendees).values(attendeeData).returning();
    return attendee;
  }

  async updateCommunityEventAttendee(eventId: number, userId: number, updates: Partial<CommunityEventAttendee>): Promise<CommunityEventAttendee> {
    const [updatedAttendee] = await db
      .update(communityEventAttendees)
      .set(updates)
      .where(
        and(
          eq(communityEventAttendees.eventId, eventId),
          eq(communityEventAttendees.userId, userId)
        )
      )
      .returning();
    
    if (!updatedAttendee) throw new Error("Community event attendee not found");
    return updatedAttendee;
  }

  // Poll operations
  async getPoll(id: number): Promise<Poll | undefined> {
    const [poll] = await db.select().from(polls).where(eq(polls.id, id));
    return poll || undefined;
  }

  async getPollsByPost(postId: number): Promise<Poll[]> {
    return await db
      .select()
      .from(polls)
      .where(eq(polls.postId, postId));
  }

  async createPoll(insertPoll: InsertPoll): Promise<Poll> {
    const pollData = {
      ...insertPoll,
      createdAt: new Date()
    };
    
    const [poll] = await db.insert(polls).values(pollData).returning();
    return poll;
  }

  // Poll Response operations
  async getPollResponse(id: number): Promise<PollResponse | undefined> {
    const [response] = await db.select().from(pollResponses).where(eq(pollResponses.id, id));
    return response || undefined;
  }

  async getPollResponsesByPoll(pollId: number): Promise<PollResponse[]> {
    return await db
      .select()
      .from(pollResponses)
      .where(eq(pollResponses.pollId, pollId));
  }

  async getPollResponseByPollAndUser(pollId: number, userId: number): Promise<PollResponse | undefined> {
    const [response] = await db
      .select()
      .from(pollResponses)
      .where(
        and(
          eq(pollResponses.pollId, pollId),
          eq(pollResponses.userId, userId)
        )
      );
    
    return response || undefined;
  }

  async createPollResponse(insertResponse: InsertPollResponse): Promise<PollResponse> {
    const responseData = {
      ...insertResponse,
      submittedAt: new Date()
    };
    
    const [response] = await db.insert(pollResponses).values(responseData).returning();
    return response;
  }

  // Flagged Content operations
  async getFlaggedContent(id: number): Promise<FlaggedContent | undefined> {
    const [content] = await db.select().from(flaggedContent).where(eq(flaggedContent.id, id));
    return content || undefined;
  }

  async getFlaggedContentByStatus(status: string): Promise<FlaggedContent[]> {
    return await db
      .select()
      .from(flaggedContent)
      .where(eq(flaggedContent.status, status))
      .orderBy(desc(flaggedContent.reportedAt));
  }

  async createFlaggedContent(insertContent: InsertFlaggedContent): Promise<FlaggedContent> {
    const contentData = {
      ...insertContent,
      status: 'pending',
      reportedAt: new Date()
    };
    
    const [content] = await db.insert(flaggedContent).values(contentData).returning();
    return content;
  }

  async updateFlaggedContent(id: number, updates: Partial<FlaggedContent>): Promise<FlaggedContent> {
    const updatedData = {
      ...updates
    };
    
    if (updates.status && updates.status !== 'pending') {
      updatedData.reviewedAt = new Date();
    }
    
    const [updatedContent] = await db
      .update(flaggedContent)
      .set(updatedData)
      .where(eq(flaggedContent.id, id))
      .returning();
    
    if (!updatedContent) throw new Error("Flagged content not found");
    return updatedContent;
  }

  // Community Collaboration operations
  async getCommunityCollaboration(id: number): Promise<CommunityCollaboration | undefined> {
    const [collaboration] = await db.select().from(communityCollaborations).where(eq(communityCollaborations.id, id));
    return collaboration || undefined;
  }

  async getCommunityCollaborations(communityId: number): Promise<CommunityCollaboration[]> {
    return await db
      .select()
      .from(communityCollaborations)
      .where(
        or(
          eq(communityCollaborations.community1Id, communityId),
          eq(communityCollaborations.community2Id, communityId)
        )
      )
      .orderBy(desc(communityCollaborations.createdAt));
  }

  async getCommunityCollaborationsByStatus(communityId: number, status: string): Promise<CommunityCollaboration[]> {
    return await db
      .select()
      .from(communityCollaborations)
      .where(
        and(
          or(
            eq(communityCollaborations.community1Id, communityId),
            eq(communityCollaborations.community2Id, communityId)
          ),
          eq(communityCollaborations.status, status)
        )
      )
      .orderBy(desc(communityCollaborations.createdAt));
  }

  async createCommunityCollaboration(insertCollaboration: InsertCommunityCollaboration): Promise<CommunityCollaboration> {
    const collaborationData = {
      ...insertCollaboration,
      createdAt: new Date()
    };
    
    const [collaboration] = await db.insert(communityCollaborations).values(collaborationData).returning();
    return collaboration;
  }

  async updateCommunityCollaboration(id: number, updates: Partial<CommunityCollaboration>): Promise<CommunityCollaboration> {
    const [updatedCollaboration] = await db
      .update(communityCollaborations)
      .set(updates)
      .where(eq(communityCollaborations.id, id))
      .returning();
    
    if (!updatedCollaboration) throw new Error("Community collaboration not found");
    return updatedCollaboration;
  }
}

export const storage = new DatabaseStorage();
