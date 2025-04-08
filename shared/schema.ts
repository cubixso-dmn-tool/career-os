import { pgTable, text, serial, integer, boolean, timestamp, jsonb, date, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
  name: text("name").notNull(),
  bio: text("bio"),
  avatar: text("avatar"),
  role: text("role").default('student').notNull(), // 'student', 'admin', 'community_admin', 'super_admin'
  lastLogin: timestamp("last_login"),
  settings: jsonb("settings"),
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

// Community related tables
export const communities = pgTable("communities", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slug: varchar("slug", { length: 100 }).notNull().unique(),
  description: text("description").notNull(),
  logo: text("logo"),
  banner: text("banner"),
  website: text("website"),
  stream: text("stream").notNull(), // tech, commerce, arts, etc.
  tags: text("tags").array(),
  isVerified: boolean("is_verified").default(false).notNull(),
  memberCount: integer("member_count").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  isActive: boolean("is_active").default(true).notNull(),
});

export const communityAdmins = pgTable("community_admins", {
  id: serial("id").primaryKey(),
  communityId: integer("community_id").notNull().references(() => communities.id),
  userId: integer("user_id").notNull().references(() => users.id),
  role: text("role").notNull(), // 'owner', 'admin', 'moderator'
  addedAt: timestamp("added_at").defaultNow().notNull()
});

export const communityMembers = pgTable("community_members", {
  id: serial("id").primaryKey(),
  communityId: integer("community_id").notNull().references(() => communities.id),
  userId: integer("user_id").notNull().references(() => users.id),
  joinedAt: timestamp("joined_at").defaultNow().notNull()
});

export const communityPosts = pgTable("community_posts", {
  id: serial("id").primaryKey(),
  communityId: integer("community_id").notNull().references(() => communities.id),
  authorId: integer("author_id").notNull().references(() => users.id),
  title: text("title").notNull(),
  content: text("content").notNull(),
  type: text("type").notNull(), // 'announcement', 'event', 'job', 'internship', 'blog', 'question'
  attachments: jsonb("attachments").array(),
  likes: integer("likes").default(0).notNull(),
  views: integer("views").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  scheduledFor: timestamp("scheduled_for"),
  isPinned: boolean("is_pinned").default(false).notNull()
});

export const communityPostComments = pgTable("community_post_comments", {
  id: serial("id").primaryKey(),
  postId: integer("post_id").notNull().references(() => communityPosts.id),
  userId: integer("user_id").notNull().references(() => users.id),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull()
});

export const communityEvents = pgTable("community_events", {
  id: serial("id").primaryKey(),
  communityId: integer("community_id").notNull().references(() => communities.id),
  title: text("title").notNull(),
  description: text("description").notNull(),
  type: text("type").notNull(), // webinar, workshop, hackathon, meetup
  format: text("format").notNull(), // online, offline, hybrid
  location: text("location"),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  registrationLink: text("registration_link"),
  maxAttendees: integer("max_attendees"),
  isFree: boolean("is_free").default(true).notNull(),
  createdBy: integer("created_by").notNull().references(() => users.id),
  createdAt: timestamp("created_at").defaultNow().notNull()
});

export const communityEventRegistrations = pgTable("community_event_registrations", {
  id: serial("id").primaryKey(),
  eventId: integer("event_id").notNull().references(() => communityEvents.id),
  userId: integer("user_id").notNull().references(() => users.id),
  registeredAt: timestamp("registered_at").defaultNow().notNull(),
  status: text("status").notNull(), // registered, attended, cancelled
  feedback: jsonb("feedback")
});

export const communityQuestions = pgTable("community_questions", {
  id: serial("id").primaryKey(),
  communityId: integer("community_id").notNull().references(() => communities.id),
  userId: integer("user_id").notNull().references(() => users.id),
  title: text("title").notNull(),
  content: text("content").notNull(),
  tags: text("tags").array(),
  isAnswered: boolean("is_answered").default(false).notNull(),
  upvotes: integer("upvotes").default(0).notNull(),
  views: integer("views").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const communityQuestionAnswers = pgTable("community_question_answers", {
  id: serial("id").primaryKey(),
  questionId: integer("question_id").notNull().references(() => communityQuestions.id),
  userId: integer("user_id").notNull().references(() => users.id),
  content: text("content").notNull(),
  isAccepted: boolean("is_accepted").default(false).notNull(),
  upvotes: integer("upvotes").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const communityPolls = pgTable("community_polls", {
  id: serial("id").primaryKey(),
  communityId: integer("community_id").notNull().references(() => communities.id),
  createdBy: integer("created_by").notNull().references(() => users.id),
  question: text("question").notNull(),
  options: jsonb("options").array().notNull(),
  expiresAt: timestamp("expires_at"),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const communityPollVotes = pgTable("community_poll_votes", {
  id: serial("id").primaryKey(),
  pollId: integer("poll_id").notNull().references(() => communityPolls.id),
  userId: integer("user_id").notNull().references(() => users.id),
  optionIndex: integer("option_index").notNull(),
  votedAt: timestamp("voted_at").defaultNow().notNull()
});

export const communityRoles = pgTable("community_roles", {
  id: serial("id").primaryKey(),
  communityId: integer("community_id").notNull().references(() => communities.id),
  name: text("name").notNull(),
  color: text("color"),
  createdAt: timestamp("created_at").defaultNow().notNull()
});

export const communityMemberRoles = pgTable("community_member_roles", {
  id: serial("id").primaryKey(),
  memberId: integer("member_id").notNull().references(() => communityMembers.id),
  roleId: integer("role_id").notNull().references(() => communityRoles.id),
  assignedAt: timestamp("assigned_at").defaultNow().notNull()
});

export const communityInvites = pgTable("community_invites", {
  id: serial("id").primaryKey(),
  communityId: integer("community_id").notNull().references(() => communities.id),
  invitedBy: integer("invited_by").notNull().references(() => users.id),
  email: text("email").notNull(),
  status: text("status").notNull(), // pending, accepted, declined
  createdAt: timestamp("created_at").defaultNow().notNull(),
  expiresAt: timestamp("expires_at")
});

export const userCommunityNotificationSettings = pgTable("user_community_notification_settings", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  communityId: integer("community_id").notNull().references(() => communities.id),
  newPosts: boolean("new_posts").default(true).notNull(),
  events: boolean("events").default(true).notNull(),
  comments: boolean("comments").default(true).notNull(),
  announcements: boolean("announcements").default(true).notNull(),
  directMessages: boolean("direct_messages").default(true).notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull()
});

// Insert schemas

export const insertUserSchema = createInsertSchema(users).omit({ id: true, createdAt: true, lastLogin: true, settings: true });
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

// Community related insert schemas
export const insertCommunitySchema = createInsertSchema(communities).omit({ id: true, memberCount: true, createdAt: true, isVerified: true });
export const insertCommunityAdminSchema = createInsertSchema(communityAdmins).omit({ id: true, addedAt: true });
export const insertCommunityMemberSchema = createInsertSchema(communityMembers).omit({ id: true, joinedAt: true });
export const insertCommunityPostSchema = createInsertSchema(communityPosts).omit({ id: true, likes: true, views: true, createdAt: true, isPinned: true });
export const insertCommunityPostCommentSchema = createInsertSchema(communityPostComments).omit({ id: true, createdAt: true });
export const insertCommunityEventSchema = createInsertSchema(communityEvents).omit({ id: true, createdAt: true });
export const insertCommunityEventRegistrationSchema = createInsertSchema(communityEventRegistrations).omit({ id: true, registeredAt: true });
export const insertCommunityQuestionSchema = createInsertSchema(communityQuestions).omit({ id: true, isAnswered: true, upvotes: true, views: true, createdAt: true });
export const insertCommunityQuestionAnswerSchema = createInsertSchema(communityQuestionAnswers).omit({ id: true, isAccepted: true, upvotes: true, createdAt: true });
export const insertCommunityPollSchema = createInsertSchema(communityPolls).omit({ id: true, createdAt: true });
export const insertCommunityPollVoteSchema = createInsertSchema(communityPollVotes).omit({ id: true, votedAt: true });
export const insertCommunityRoleSchema = createInsertSchema(communityRoles).omit({ id: true, createdAt: true });
export const insertCommunityMemberRoleSchema = createInsertSchema(communityMemberRoles).omit({ id: true, assignedAt: true });
export const insertCommunityInviteSchema = createInsertSchema(communityInvites).omit({ id: true, createdAt: true });
export const insertUserCommunityNotificationSettingsSchema = createInsertSchema(userCommunityNotificationSettings).omit({ id: true, updatedAt: true });

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

// Community related types
export type InsertCommunity = z.infer<typeof insertCommunitySchema>;
export type Community = typeof communities.$inferSelect;

export type InsertCommunityAdmin = z.infer<typeof insertCommunityAdminSchema>;
export type CommunityAdmin = typeof communityAdmins.$inferSelect;

export type InsertCommunityMember = z.infer<typeof insertCommunityMemberSchema>;
export type CommunityMember = typeof communityMembers.$inferSelect;

export type InsertCommunityPost = z.infer<typeof insertCommunityPostSchema>;
export type CommunityPost = typeof communityPosts.$inferSelect;

export type InsertCommunityPostComment = z.infer<typeof insertCommunityPostCommentSchema>;
export type CommunityPostComment = typeof communityPostComments.$inferSelect;

export type InsertCommunityEvent = z.infer<typeof insertCommunityEventSchema>;
export type CommunityEvent = typeof communityEvents.$inferSelect;

export type InsertCommunityEventRegistration = z.infer<typeof insertCommunityEventRegistrationSchema>;
export type CommunityEventRegistration = typeof communityEventRegistrations.$inferSelect;

export type InsertCommunityQuestion = z.infer<typeof insertCommunityQuestionSchema>;
export type CommunityQuestion = typeof communityQuestions.$inferSelect;

export type InsertCommunityQuestionAnswer = z.infer<typeof insertCommunityQuestionAnswerSchema>;
export type CommunityQuestionAnswer = typeof communityQuestionAnswers.$inferSelect;

export type InsertCommunityPoll = z.infer<typeof insertCommunityPollSchema>;
export type CommunityPoll = typeof communityPolls.$inferSelect;

export type InsertCommunityPollVote = z.infer<typeof insertCommunityPollVoteSchema>;
export type CommunityPollVote = typeof communityPollVotes.$inferSelect;

export type InsertCommunityRole = z.infer<typeof insertCommunityRoleSchema>;
export type CommunityRole = typeof communityRoles.$inferSelect;

export type InsertCommunityMemberRole = z.infer<typeof insertCommunityMemberRoleSchema>;
export type CommunityMemberRole = typeof communityMemberRoles.$inferSelect;

export type InsertCommunityInvite = z.infer<typeof insertCommunityInviteSchema>;
export type CommunityInvite = typeof communityInvites.$inferSelect;

export type InsertUserCommunityNotificationSettings = z.infer<typeof insertUserCommunityNotificationSettingsSchema>;
export type UserCommunityNotificationSettings = typeof userCommunityNotificationSettings.$inferSelect;
