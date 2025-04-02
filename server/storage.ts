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
  userEvents, UserEvent, InsertUserEvent
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
}

import { eq, desc, and, or, sql, like } from "drizzle-orm";
import { db } from "./db";

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
    return this.courses.get(id);
  }

  async getAllCourses(): Promise<Course[]> {
    return Array.from(this.courses.values());
  }

  async getFilteredCourses(category?: string, tags?: string[], isFree?: boolean): Promise<Course[]> {
    let filtered = Array.from(this.courses.values());
    
    if (category) {
      filtered = filtered.filter(course => course.category === category);
    }
    
    if (tags && tags.length > 0) {
      filtered = filtered.filter(course => 
        tags.some(tag => course.tags?.includes(tag))
      );
    }
    
    if (isFree !== undefined) {
      filtered = filtered.filter(course => course.isFree === isFree);
    }
    
    return filtered;
  }

  async getRecommendedCourses(userId: number): Promise<Course[]> {
    // In a real implementation, this would use the user's quiz results and other data
    // to recommend courses. For simplicity, we're just returning featured courses.
    return Array.from(this.courses.values()).filter(course => course.isFeatured);
  }

  async createCourse(insertCourse: InsertCourse): Promise<Course> {
    const id = this.currentCourseId++;
    const course: Course = { ...insertCourse, id };
    this.courses.set(id, course);
    return course;
  }

  // Enrollment operations
  async getEnrollment(id: number): Promise<Enrollment | undefined> {
    return this.enrollments.get(id);
  }

  async getEnrollmentsByUser(userId: number): Promise<Enrollment[]> {
    return Array.from(this.enrollments.values()).filter(
      (enrollment) => enrollment.userId === userId,
    );
  }

  async createEnrollment(insertEnrollment: InsertEnrollment): Promise<Enrollment> {
    const id = this.currentEnrollmentId++;
    const enrollment: Enrollment = { ...insertEnrollment, id, enrolledAt: new Date() };
    this.enrollments.set(id, enrollment);
    return enrollment;
  }

  async updateEnrollment(id: number, updates: Partial<Enrollment>): Promise<Enrollment> {
    const enrollment = await this.getEnrollment(id);
    if (!enrollment) throw new Error("Enrollment not found");
    
    const updatedEnrollment = { ...enrollment, ...updates };
    this.enrollments.set(id, updatedEnrollment);
    return updatedEnrollment;
  }

  // Project operations
  async getProject(id: number): Promise<Project | undefined> {
    return this.projects.get(id);
  }

  async getAllProjects(): Promise<Project[]> {
    return Array.from(this.projects.values());
  }

  async getFilteredProjects(category?: string, difficulty?: string): Promise<Project[]> {
    let filtered = Array.from(this.projects.values());
    
    if (category) {
      filtered = filtered.filter(project => project.category === category);
    }
    
    if (difficulty) {
      filtered = filtered.filter(project => project.difficulty === difficulty);
    }
    
    return filtered;
  }

  async getRecommendedProjects(userId: number): Promise<Project[]> {
    // In a real implementation, this would be based on the user's profile and progress
    // For now, just return all projects
    return this.getAllProjects();
  }

  async createProject(insertProject: InsertProject): Promise<Project> {
    const id = this.currentProjectId++;
    const project: Project = { ...insertProject, id };
    this.projects.set(id, project);
    return project;
  }

  // UserProject operations
  async getUserProject(id: number): Promise<UserProject | undefined> {
    return this.userProjects.get(id);
  }

  async getUserProjectsByUser(userId: number): Promise<UserProject[]> {
    return Array.from(this.userProjects.values()).filter(
      (userProject) => userProject.userId === userId,
    );
  }

  async createUserProject(insertUserProject: InsertUserProject): Promise<UserProject> {
    const id = this.currentUserProjectId++;
    const userProject: UserProject = { ...insertUserProject, id, startedAt: new Date() };
    this.userProjects.set(id, userProject);
    return userProject;
  }

  async updateUserProject(id: number, updates: Partial<UserProject>): Promise<UserProject> {
    const userProject = await this.getUserProject(id);
    if (!userProject) throw new Error("User project not found");
    
    const updatedUserProject = { ...userProject, ...updates };
    this.userProjects.set(id, updatedUserProject);
    return updatedUserProject;
  }

  // SoftSkill operations
  async getSoftSkill(id: number): Promise<SoftSkill | undefined> {
    return this.softSkills.get(id);
  }

  async getAllSoftSkills(): Promise<SoftSkill[]> {
    return Array.from(this.softSkills.values());
  }

  async getFilteredSoftSkills(type?: string): Promise<SoftSkill[]> {
    let filtered = Array.from(this.softSkills.values());
    
    if (type) {
      filtered = filtered.filter(softSkill => softSkill.type === type);
    }
    
    return filtered;
  }

  async createSoftSkill(insertSoftSkill: InsertSoftSkill): Promise<SoftSkill> {
    const id = this.currentSoftSkillId++;
    const softSkill: SoftSkill = { ...insertSoftSkill, id };
    this.softSkills.set(id, softSkill);
    return softSkill;
  }

  // UserSoftSkill operations
  async getUserSoftSkill(id: number): Promise<UserSoftSkill | undefined> {
    return this.userSoftSkills.get(id);
  }

  async getUserSoftSkillsByUser(userId: number): Promise<UserSoftSkill[]> {
    return Array.from(this.userSoftSkills.values()).filter(
      (userSoftSkill) => userSoftSkill.userId === userId,
    );
  }

  async createUserSoftSkill(insertUserSoftSkill: InsertUserSoftSkill): Promise<UserSoftSkill> {
    const id = this.currentUserSoftSkillId++;
    const userSoftSkill: UserSoftSkill = { ...insertUserSoftSkill, id };
    this.userSoftSkills.set(id, userSoftSkill);
    return userSoftSkill;
  }

  async updateUserSoftSkill(id: number, updates: Partial<UserSoftSkill>): Promise<UserSoftSkill> {
    const userSoftSkill = await this.getUserSoftSkill(id);
    if (!userSoftSkill) throw new Error("User soft skill not found");
    
    const updatedUserSoftSkill = { ...userSoftSkill, ...updates };
    this.userSoftSkills.set(id, updatedUserSoftSkill);
    return updatedUserSoftSkill;
  }

  // Resume operations
  async getResume(id: number): Promise<Resume | undefined> {
    return this.resumes.get(id);
  }

  async getResumeByUser(userId: number): Promise<Resume | undefined> {
    return Array.from(this.resumes.values()).find(
      (resume) => resume.userId === userId,
    );
  }

  async createResume(insertResume: InsertResume): Promise<Resume> {
    const id = this.currentResumeId++;
    const resume: Resume = { ...insertResume, id, updatedAt: new Date() };
    this.resumes.set(id, resume);
    return resume;
  }

  async updateResume(id: number, updates: Partial<Resume>): Promise<Resume> {
    const resume = await this.getResume(id);
    if (!resume) throw new Error("Resume not found");
    
    const updatedResume = { ...resume, ...updates, updatedAt: new Date() };
    this.resumes.set(id, updatedResume);
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
    return this.achievements.get(id);
  }

  async getAllAchievements(): Promise<Achievement[]> {
    return Array.from(this.achievements.values());
  }

  async createAchievement(insertAchievement: InsertAchievement): Promise<Achievement> {
    const id = this.currentAchievementId++;
    const achievement: Achievement = { ...insertAchievement, id };
    this.achievements.set(id, achievement);
    return achievement;
  }

  // UserAchievement operations
  async getUserAchievement(id: number): Promise<UserAchievement | undefined> {
    return this.userAchievements.get(id);
  }

  async getUserAchievementsByUser(userId: number): Promise<UserAchievement[]> {
    return Array.from(this.userAchievements.values()).filter(
      (userAchievement) => userAchievement.userId === userId,
    );
  }

  async createUserAchievement(insertUserAchievement: InsertUserAchievement): Promise<UserAchievement> {
    const id = this.currentUserAchievementId++;
    const userAchievement: UserAchievement = { ...insertUserAchievement, id, earnedAt: new Date() };
    this.userAchievements.set(id, userAchievement);
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
    return this.userEvents.get(id);
  }

  async getUserEventsByUser(userId: number): Promise<UserEvent[]> {
    return Array.from(this.userEvents.values()).filter(
      (userEvent) => userEvent.userId === userId,
    );
  }

  async createUserEvent(insertUserEvent: InsertUserEvent): Promise<UserEvent> {
    const id = this.currentUserEventId++;
    const userEvent: UserEvent = { ...insertUserEvent, id, registeredAt: new Date() };
    this.userEvents.set(id, userEvent);
    return userEvent;
  }
}

export const storage = new DatabaseStorage();
