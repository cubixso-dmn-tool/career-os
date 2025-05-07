import { pgTable, text, serial, integer, boolean, timestamp, jsonb, date } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
  name: text("name").notNull(),
  bio: text("bio"),
  avatar: text("avatar"),
  createdAt: timestamp("created_at").defaultNow().notNull()
});

export const quizResults = pgTable("quiz_results", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  quizType: text("quiz_type").notNull(),
  result: jsonb("result").notNull(),
  recommendedCareer: text("recommended_career").notNull(),
  recommendedNiches: text("recommended_niches").array().notNull(),
  completedAt: timestamp("completed_at").defaultNow().notNull()
});

export const courses = pgTable("courses", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  thumbnail: text("thumbnail").notNull(),
  price: integer("price").default(0).notNull(),
  isFree: boolean("is_free").default(true).notNull(),
  rating: integer("rating").default(0),
  enrolledCount: integer("enrolled_count").default(0),
  category: text("category").notNull(),
  tags: text("tags").array(),
  isFeatured: boolean("is_featured").default(false)
});

export const enrollments = pgTable("enrollments", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  courseId: integer("course_id").notNull().references(() => courses.id),
  progress: integer("progress").default(0).notNull(),
  isCompleted: boolean("is_completed").default(false).notNull(),
  enrolledAt: timestamp("enrolled_at").defaultNow().notNull()
});

export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  difficulty: text("difficulty").notNull(),
  duration: text("duration").notNull(),
  skills: text("skills").array(),
  category: text("category").notNull()
});

export const userProjects = pgTable("user_projects", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  projectId: integer("project_id").notNull().references(() => projects.id),
  progress: integer("progress").default(0).notNull(),
  isCompleted: boolean("is_completed").default(false).notNull(),
  startedAt: timestamp("started_at").defaultNow().notNull()
});

export const softSkills = pgTable("soft_skills", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  type: text("type").notNull(),
  content: text("content").notNull()
});

export const userSoftSkills = pgTable("user_soft_skills", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  softSkillId: integer("soft_skill_id").notNull().references(() => softSkills.id),
  progress: integer("progress").default(0).notNull(),
  isCompleted: boolean("is_completed").default(false).notNull()
});

export const resumes = pgTable("resumes", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  education: jsonb("education").array().notNull(),
  experience: jsonb("experience").array().notNull(),
  skills: text("skills").array().notNull(),
  projects: jsonb("projects").array(),
  templateId: text("template_id").notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull()
});

export const posts = pgTable("posts", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  content: text("content").notNull(),
  likes: integer("likes").default(0).notNull(),
  replies: integer("replies").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull()
});

export const comments = pgTable("comments", {
  id: serial("id").primaryKey(),
  postId: integer("post_id").notNull().references(() => posts.id),
  userId: integer("user_id").notNull().references(() => users.id),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull()
});

export const achievements = pgTable("achievements", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  icon: text("icon").notNull(),
  category: text("category").notNull()
});

export const userAchievements = pgTable("user_achievements", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  achievementId: integer("achievement_id").notNull().references(() => achievements.id),
  earnedAt: timestamp("earned_at").defaultNow().notNull()
});

export const events = pgTable("events", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  type: text("type").notNull(),
  date: timestamp("date").notNull(),
  duration: integer("duration").notNull(),
  isRegistrationRequired: boolean("is_registration_required").default(true).notNull()
});

export const userEvents = pgTable("user_events", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  eventId: integer("event_id").notNull().references(() => events.id),
  registeredAt: timestamp("registered_at").defaultNow().notNull()
});

export const dailyBytes = pgTable("daily_bytes", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  type: text("type").notNull(), // 'tip', 'quiz', 'insight'
  category: text("category").notNull(),
  forDate: date("for_date").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  active: boolean("active").default(true).notNull()
});

export const userDailyBytes = pgTable("user_daily_bytes", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  dailyByteId: integer("daily_byte_id").notNull().references(() => dailyBytes.id),
  completed: boolean("completed").default(false).notNull(),
  responded: boolean("responded").default(false).notNull(),
  response: jsonb("response"),
  completedAt: timestamp("completed_at")
});

// Role-based access control tables

export const roles = pgTable("roles", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow().notNull()
});

export const permissions = pgTable("permissions", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow().notNull()
});

export const rolePermissions = pgTable("role_permissions", {
  id: serial("id").primaryKey(),
  roleId: integer("role_id").notNull().references(() => roles.id),
  permissionId: integer("permission_id").notNull().references(() => permissions.id),
  createdAt: timestamp("created_at").defaultNow().notNull()
});

export const userRoles = pgTable("user_roles", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  roleId: integer("role_id").notNull().references(() => roles.id),
  assignedAt: timestamp("assigned_at").defaultNow().notNull()
});

// Communities tables for role-based moderation

export const communities = pgTable("communities", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  rules: text("rules"),
  banner: text("banner"),
  icon: text("icon"),
  createdBy: integer("created_by").notNull().references(() => users.id),
  isPrivate: boolean("is_private").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull()
});

export const communityMembers = pgTable("community_members", {
  id: serial("id").primaryKey(),
  communityId: integer("community_id").notNull().references(() => communities.id),
  userId: integer("user_id").notNull().references(() => users.id),
  roleId: integer("role_id").references(() => roles.id), // Optional role specific to this community
  role: text("role").default("member").notNull(), // "member", "moderator", "owner"
  joinedAt: timestamp("joined_at").defaultNow().notNull()
});

export const communityPosts = pgTable("community_posts", {
  id: serial("id").primaryKey(),
  communityId: integer("community_id").notNull().references(() => communities.id),
  userId: integer("user_id").notNull().references(() => users.id),
  title: text("title").notNull(),
  content: text("content").notNull(),
  likes: integer("likes").default(0).notNull(),
  replies: integer("replies").default(0).notNull(),
  isPinned: boolean("is_pinned").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
});

export const communityPostComments = pgTable("community_post_comments", {
  id: serial("id").primaryKey(),
  postId: integer("post_id").notNull().references(() => communityPosts.id),
  userId: integer("user_id").notNull().references(() => users.id),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
});

export const moderationActions = pgTable("moderation_actions", {
  id: serial("id").primaryKey(),
  communityId: integer("community_id").notNull().references(() => communities.id),
  targetType: text("target_type").notNull(), // "post", "comment", "user"
  targetId: integer("target_id").notNull(), // ID of the post, comment, or user
  action: text("action").notNull(), // "remove", "warn", "ban", etc.
  reason: text("reason"),
  moderatorId: integer("moderator_id").notNull().references(() => users.id),
  createdAt: timestamp("created_at").defaultNow().notNull()
});

// Insert schemas

export const insertUserSchema = createInsertSchema(users).omit({ id: true, createdAt: true });
export const insertQuizResultSchema = createInsertSchema(quizResults).omit({ id: true, completedAt: true });
export const insertCourseSchema = createInsertSchema(courses).omit({ id: true });
export const insertEnrollmentSchema = createInsertSchema(enrollments).omit({ id: true, enrolledAt: true });
export const insertProjectSchema = createInsertSchema(projects).omit({ id: true });
export const insertUserProjectSchema = createInsertSchema(userProjects).omit({ id: true, startedAt: true });
export const insertSoftSkillSchema = createInsertSchema(softSkills).omit({ id: true });
export const insertUserSoftSkillSchema = createInsertSchema(userSoftSkills).omit({ id: true });
export const insertResumeSchema = createInsertSchema(resumes).omit({ id: true, updatedAt: true });
export const insertPostSchema = createInsertSchema(posts).omit({ id: true, likes: true, replies: true, createdAt: true });
export const insertCommentSchema = createInsertSchema(comments).omit({ id: true, createdAt: true });
export const insertAchievementSchema = createInsertSchema(achievements).omit({ id: true });
export const insertUserAchievementSchema = createInsertSchema(userAchievements).omit({ id: true, earnedAt: true });
export const insertEventSchema = createInsertSchema(events).omit({ id: true });
export const insertUserEventSchema = createInsertSchema(userEvents).omit({ id: true, registeredAt: true });
export const insertDailyByteSchema = createInsertSchema(dailyBytes).omit({ id: true, createdAt: true });
export const insertUserDailyByteSchema = createInsertSchema(userDailyBytes).omit({ id: true, completedAt: true });

// RBAC schemas
export const insertRoleSchema = createInsertSchema(roles).omit({ id: true, createdAt: true });
export const insertPermissionSchema = createInsertSchema(permissions).omit({ id: true, createdAt: true });
export const insertRolePermissionSchema = createInsertSchema(rolePermissions).omit({ id: true, createdAt: true });
export const insertUserRoleSchema = createInsertSchema(userRoles).omit({ id: true, assignedAt: true });

// Community schemas
export const insertCommunitySchema = createInsertSchema(communities).omit({ id: true, createdAt: true });
export const insertCommunityMemberSchema = createInsertSchema(communityMembers).omit({ id: true, joinedAt: true });
export const insertCommunityPostSchema = createInsertSchema(communityPosts).omit({ id: true, likes: true, replies: true, createdAt: true, updatedAt: true });
export const insertCommunityPostCommentSchema = createInsertSchema(communityPostComments).omit({ id: true, createdAt: true, updatedAt: true });
export const insertModerationActionSchema = createInsertSchema(moderationActions).omit({ id: true, createdAt: true });

// Types

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertQuizResult = z.infer<typeof insertQuizResultSchema>;
export type QuizResult = typeof quizResults.$inferSelect;

export type InsertCourse = z.infer<typeof insertCourseSchema>;
export type Course = typeof courses.$inferSelect;

export type InsertEnrollment = z.infer<typeof insertEnrollmentSchema>;
export type Enrollment = typeof enrollments.$inferSelect;

export type InsertProject = z.infer<typeof insertProjectSchema>;
export type Project = typeof projects.$inferSelect;

export type InsertUserProject = z.infer<typeof insertUserProjectSchema>;
export type UserProject = typeof userProjects.$inferSelect;

export type InsertSoftSkill = z.infer<typeof insertSoftSkillSchema>;
export type SoftSkill = typeof softSkills.$inferSelect;

export type InsertUserSoftSkill = z.infer<typeof insertUserSoftSkillSchema>;
export type UserSoftSkill = typeof userSoftSkills.$inferSelect;

export type InsertResume = z.infer<typeof insertResumeSchema>;
export type Resume = typeof resumes.$inferSelect;

export type InsertPost = z.infer<typeof insertPostSchema>;
export type Post = typeof posts.$inferSelect;

export type InsertComment = z.infer<typeof insertCommentSchema>;
export type Comment = typeof comments.$inferSelect;

export type InsertAchievement = z.infer<typeof insertAchievementSchema>;
export type Achievement = typeof achievements.$inferSelect;

export type InsertUserAchievement = z.infer<typeof insertUserAchievementSchema>;
export type UserAchievement = typeof userAchievements.$inferSelect;

export type InsertEvent = z.infer<typeof insertEventSchema>;
export type Event = typeof events.$inferSelect;

export type InsertUserEvent = z.infer<typeof insertUserEventSchema>;
export type UserEvent = typeof userEvents.$inferSelect;

export type InsertDailyByte = z.infer<typeof insertDailyByteSchema>;
export type DailyByte = typeof dailyBytes.$inferSelect;

export type InsertUserDailyByte = z.infer<typeof insertUserDailyByteSchema>;
export type UserDailyByte = typeof userDailyBytes.$inferSelect;

// RBAC types
export type InsertRole = z.infer<typeof insertRoleSchema>;
export type Role = typeof roles.$inferSelect;

export type InsertPermission = z.infer<typeof insertPermissionSchema>;
export type Permission = typeof permissions.$inferSelect;

export type InsertRolePermission = z.infer<typeof insertRolePermissionSchema>;
export type RolePermission = typeof rolePermissions.$inferSelect;

export type InsertUserRole = z.infer<typeof insertUserRoleSchema>;
export type UserRole = typeof userRoles.$inferSelect;

// Community types
export type InsertCommunity = z.infer<typeof insertCommunitySchema>;
export type Community = typeof communities.$inferSelect;

export type InsertCommunityMember = z.infer<typeof insertCommunityMemberSchema>;
export type CommunityMember = typeof communityMembers.$inferSelect;

export type InsertCommunityPost = z.infer<typeof insertCommunityPostSchema>;
export type CommunityPost = typeof communityPosts.$inferSelect;

export type InsertCommunityPostComment = z.infer<typeof insertCommunityPostCommentSchema>;
export type CommunityPostComment = typeof communityPostComments.$inferSelect;

export type InsertModerationAction = z.infer<typeof insertModerationActionSchema>;
export type ModerationAction = typeof moderationActions.$inferSelect;
