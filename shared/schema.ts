import { pgTable, text, serial, integer, boolean, timestamp, jsonb, date, varchar, numeric, json } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
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
  name: text("name"), // Resume name for identification
  templateId: text("template_id").notNull(),
  // Complete resume data as JSONB to match ResumeData interface
  data: jsonb("data").notNull(), // This will store the complete ResumeData object
  createdAt: timestamp("created_at").defaultNow().notNull(),
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
  // New fields for enhanced community features
  communityType: text("community_type").notNull().default("general"), // "general", "group_channel", "project_collab", "college_fest", "competition", "local_event"
  interests: text("interests").array(), // Filter by interests
  domain: text("domain"), // Filter by domain/field
  region: text("region"), // Filter by region
  college: text("college"), // College affiliation
  maxMembers: integer("max_members").default(0), // 0 = unlimited
  currentMembers: integer("current_members").default(0),
  tags: text("tags").array(),
  settings: jsonb("settings"), // Additional community settings
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

// Industry Expert Network tables
export const industryExperts = pgTable("industry_experts", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id), // Optional if expert is not a platform user
  name: text("name").notNull(),
  title: text("title").notNull(),
  company: text("company").notNull(),
  industry: text("industry").notNull(),
  specializations: text("specializations").array().notNull(),
  experience: integer("experience_years").notNull(),
  bio: text("bio").notNull(),
  avatar: text("avatar"),
  linkedinUrl: text("linkedin_url"),
  expertise: text("expertise").array().notNull(), // ["AI/ML", "Startups", "Product Management"]
  rating: integer("rating").default(0), // Average rating from sessions
  totalSessions: integer("total_sessions").default(0),
  isFeatured: boolean("is_featured").default(false),
  featuredOrder: integer("featured_order").default(0),
  isActive: boolean("is_active").default(true).notNull(),
  joinedAt: timestamp("joined_at").defaultNow().notNull()
});

export const expertSessions = pgTable("expert_sessions", {
  id: serial("id").primaryKey(),
  expertId: integer("expert_id").notNull().references(() => industryExperts.id),
  title: text("title").notNull(),
  description: text("description").notNull(),
  sessionType: text("session_type").notNull(), // "lecture", "qa", "workshop", "mentoring"
  category: text("category").notNull(), // "career_guidance", "technical", "industry_insights"
  scheduledAt: timestamp("scheduled_at").notNull(),
  duration: integer("duration_minutes").notNull(),
  maxAttendees: integer("max_attendees").default(100),
  currentAttendees: integer("current_attendees").default(0),
  meetingLink: text("meeting_link"),
  recordingUrl: text("recording_url"),
  status: text("status").default("scheduled").notNull(), // "scheduled", "live", "completed", "cancelled"
  tags: text("tags").array(),
  isRecorded: boolean("is_recorded").default(true).notNull(),
  isFree: boolean("is_free").default(true).notNull(),
  price: integer("price").default(0), // In rupees
  createdAt: timestamp("created_at").defaultNow().notNull()
});

export const sessionRegistrations = pgTable("session_registrations", {
  id: serial("id").primaryKey(),
  sessionId: integer("session_id").notNull().references(() => expertSessions.id),
  userId: integer("user_id").notNull().references(() => users.id),
  registeredAt: timestamp("registered_at").defaultNow().notNull(),
  attended: boolean("attended").default(false),
  rating: integer("rating"), // 1-5 stars
  feedback: text("feedback"),
  questions: text("questions").array() // Pre-submitted questions
});

export const expertQnaSessions = pgTable("expert_qna_sessions", {
  id: serial("id").primaryKey(),
  sessionId: integer("session_id").notNull().references(() => expertSessions.id),
  question: text("question").notNull(),
  askedBy: integer("asked_by").notNull().references(() => users.id),
  answer: text("answer"),
  answeredAt: timestamp("answered_at"),
  upvotes: integer("upvotes").default(0),
  isAnswered: boolean("is_answered").default(false),
  askedAt: timestamp("asked_at").defaultNow().notNull()
});

export const careerSuccessStories = pgTable("career_success_stories", {
  id: serial("id").primaryKey(),
  authorId: integer("author_id").references(() => users.id), // Can be user or expert
  expertId: integer("expert_id").references(() => industryExperts.id),
  title: text("title").notNull(),
  story: text("story").notNull(),
  careerPath: text("career_path").notNull(), // "Software Engineer to Tech Lead"
  industryFrom: text("industry_from"),
  industryTo: text("industry_to").notNull(),
  timeframe: text("timeframe"), // "2 years", "6 months"
  keyLearnings: text("key_learnings").array(),
  challenges: text("challenges").array(),
  advice: text("advice").array(),
  salaryGrowth: text("salary_growth"), // "3 LPA to 15 LPA"
  companyProgression: text("company_progression").array(), // ["Startup", "Mid-size", "FAANG"]
  skillsGained: text("skills_gained").array(),
  certifications: text("certifications").array(),
  isPublic: boolean("is_public").default(true).notNull(),
  isFeatured: boolean("is_featured").default(false),
  views: integer("views").default(0),
  likes: integer("likes").default(0),
  createdAt: timestamp("created_at").defaultNow().notNull()
});

export const networkingEvents = pgTable("networking_events", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  eventType: text("event_type").notNull(), // "virtual_meetup", "industry_mixer", "career_fair", "workshop"
  industry: text("industry"),
  targetAudience: text("target_audience").array(), // ["students", "freshers", "experienced", "entrepreneurs"]
  organizer: text("organizer").notNull(),
  organizerId: integer("organizer_id").references(() => users.id),
  expertId: integer("expert_id").references(() => industryExperts.id),
  scheduledAt: timestamp("scheduled_at").notNull(),
  endTime: timestamp("end_time").notNull(),
  timezone: text("timezone").default("Asia/Kolkata").notNull(),
  location: text("location"), // "Online" or physical address
  meetingLink: text("meeting_link"),
  maxAttendees: integer("max_attendees"),
  currentAttendees: integer("current_attendees").default(0),
  isOnline: boolean("is_online").default(true).notNull(),
  isFree: boolean("is_free").default(true).notNull(),
  registrationDeadline: timestamp("registration_deadline"),
  tags: text("tags").array(),
  agenda: jsonb("agenda"), // Structured agenda with time slots
  status: text("status").default("upcoming").notNull(), // "upcoming", "live", "completed", "cancelled"
  createdAt: timestamp("created_at").defaultNow().notNull()
});

export const eventRegistrations = pgTable("event_registrations", {
  id: serial("id").primaryKey(),
  eventId: integer("event_id").notNull().references(() => networkingEvents.id),
  userId: integer("user_id").notNull().references(() => users.id),
  registeredAt: timestamp("registered_at").defaultNow().notNull(),
  attended: boolean("attended").default(false),
  rating: integer("rating"), // 1-5 stars
  feedback: text("feedback"),
  networkingGoals: text("networking_goals").array(), // What they hope to achieve
  interests: text("interests").array()
});

export const expertMentorship = pgTable("expert_mentorship", {
  id: serial("id").primaryKey(),
  expertId: integer("expert_id").notNull().references(() => industryExperts.id),
  menteeId: integer("mentee_id").notNull().references(() => users.id),
  status: text("status").default("pending").notNull(), // "pending", "active", "completed", "cancelled"
  duration: text("duration").notNull(), // "1 month", "3 months", "6 months"
  goals: text("goals").array().notNull(),
  meetingFrequency: text("meeting_frequency").notNull(), // "weekly", "bi-weekly", "monthly"
  communicationMode: text("communication_mode").notNull(), // "video", "chat", "email"
  startDate: timestamp("start_date"),
  endDate: timestamp("end_date"),
  notes: text("notes"),
  menteeProgress: jsonb("mentee_progress"),
  createdAt: timestamp("created_at").defaultNow().notNull()
});

export const expertAvailability = pgTable("expert_availability", {
  id: serial("id").primaryKey(),
  expertId: integer("expert_id").notNull().references(() => industryExperts.id),
  dayOfWeek: integer("day_of_week").notNull(), // 0-6 (Sunday-Saturday)
  startTime: text("start_time").notNull(), // "09:00"
  endTime: text("end_time").notNull(), // "17:00"
  timezone: text("timezone").default("Asia/Kolkata").notNull(),
  isAvailable: boolean("is_available").default(true).notNull(),
  sessionTypes: text("session_types").array().notNull() // ["mentoring", "qa", "lecture"]
});

// Expert Connection & Payment Tables
export const expertConnections = pgTable("expert_connections", {
  id: serial("id").primaryKey(),
  expertId: integer("expert_id").notNull().references(() => industryExperts.id),
  userId: integer("user_id").notNull().references(() => users.id),
  connectionType: text("connection_type").notNull(), // "chat", "mentorship", "consultation"
  status: text("status").default("active").notNull(), // "active", "closed", "blocked"
  purpose: text("purpose").notNull(), // User's reason for connecting
  message: text("message"), // Initial connection message
  createdAt: timestamp("created_at").defaultNow().notNull(),
  lastActivityAt: timestamp("last_activity_at").defaultNow()
});

export const expertMessages = pgTable("expert_messages", {
  id: serial("id").primaryKey(),
  connectionId: integer("connection_id").notNull().references(() => expertConnections.id),
  senderId: integer("sender_id").notNull().references(() => users.id),
  receiverId: integer("receiver_id").notNull().references(() => users.id),
  message: text("message").notNull(),
  messageType: text("message_type").default("text").notNull(), // "text", "image", "file", "voice"
  attachmentUrl: text("attachment_url"),
  isRead: boolean("is_read").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  editedAt: timestamp("edited_at")
});


// Project Collaboration Tables
export const communityProjects = pgTable("community_projects", {
  id: serial("id").primaryKey(),
  communityId: integer("community_id").notNull().references(() => communities.id),
  createdBy: integer("created_by").notNull().references(() => users.id),
  title: text("title").notNull(),
  description: text("description").notNull(),
  projectType: text("project_type").notNull(), // "web", "mobile", "ai", "blockchain", "iot", "research"
  techStack: text("tech_stack").array().notNull(),
  difficulty: text("difficulty").notNull(), // "beginner", "intermediate", "advanced"
  estimatedDuration: text("estimated_duration").notNull(), // "1 week", "1 month", "3 months"
  maxCollaborators: integer("max_collaborators").default(5),
  currentCollaborators: integer("current_collaborators").default(1),
  status: text("status").default("open").notNull(), // "open", "in_progress", "completed", "cancelled"
  isPublic: boolean("is_public").default(true).notNull(),
  requirements: text("requirements").array(),
  expectedOutcome: text("expected_outcome").notNull(),
  githubRepo: text("github_repo"),
  liveDemo: text("live_demo"),
  figmaDesign: text("figma_design"),
  resources: jsonb("resources"), // Links and resources
  deadline: timestamp("deadline"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull()
});

export const projectCollaborators = pgTable("project_collaborators", {
  id: serial("id").primaryKey(),
  projectId: integer("project_id").notNull().references(() => communityProjects.id),
  userId: integer("user_id").notNull().references(() => users.id),
  role: text("role").notNull(), // "owner", "lead", "developer", "designer", "tester", "contributor"
  skills: text("skills").array(),
  joinedAt: timestamp("joined_at").defaultNow().notNull(),
  status: text("status").default("active").notNull(), // "active", "inactive", "left"
  contributionScore: integer("contribution_score").default(0),
  isInvited: boolean("is_invited").default(false).notNull(),
  invitedBy: integer("invited_by").references(() => users.id),
  invitedAt: timestamp("invited_at")
});

export const projectTasks = pgTable("project_tasks", {
  id: serial("id").primaryKey(),
  projectId: integer("project_id").notNull().references(() => communityProjects.id),
  assignedTo: integer("assigned_to").references(() => users.id),
  createdBy: integer("created_by").notNull().references(() => users.id),
  title: text("title").notNull(),
  description: text("description").notNull(),
  priority: text("priority").default("medium").notNull(), // "low", "medium", "high", "urgent"
  status: text("status").default("todo").notNull(), // "todo", "in_progress", "review", "done"
  category: text("category").notNull(), // "frontend", "backend", "design", "testing", "documentation"
  estimatedHours: integer("estimated_hours"),
  actualHours: integer("actual_hours"),
  dueDate: timestamp("due_date"),
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull()
});

export const projectUpdates = pgTable("project_updates", {
  id: serial("id").primaryKey(),
  projectId: integer("project_id").notNull().references(() => communityProjects.id),
  userId: integer("user_id").notNull().references(() => users.id),
  updateType: text("update_type").notNull(), // "progress", "milestone", "blocker", "announcement"
  title: text("title").notNull(),
  content: text("content").notNull(),
  attachments: text("attachments").array(),
  mentions: integer("mentions").array(), // User IDs mentioned
  isImportant: boolean("is_important").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull()
});

export const projectShowcase = pgTable("project_showcase", {
  id: serial("id").primaryKey(),
  projectId: integer("project_id").notNull().references(() => communityProjects.id),
  userId: integer("user_id").notNull().references(() => users.id),
  title: text("title").notNull(),
  description: text("description").notNull(),
  screenshots: text("screenshots").array(),
  videoDemo: text("video_demo"),
  liveUrl: text("live_url"),
  githubUrl: text("github_url"),
  techStack: text("tech_stack").array(),
  challenges: text("challenges").array(),
  learnings: text("learnings").array(),
  futureEnhancements: text("future_enhancements").array(),
  isPublic: boolean("is_public").default(true).notNull(),
  isFeatured: boolean("is_featured").default(false).notNull(),
  views: integer("views").default(0),
  likes: integer("likes").default(0),
  createdAt: timestamp("created_at").defaultNow().notNull()
});

// College Events and Competitions
export const collegeEvents = pgTable("college_events", {
  id: serial("id").primaryKey(),
  communityId: integer("community_id").references(() => communities.id),
  organizerId: integer("organizer_id").notNull().references(() => users.id),
  title: text("title").notNull(),
  description: text("description").notNull(),
  eventType: text("event_type").notNull(), // "college_fest", "competition", "workshop", "seminar", "cultural", "technical"
  category: text("category").notNull(), // "inter_college", "intra_college", "national", "international"
  college: text("college"),
  venue: text("venue"),
  city: text("city").notNull(),
  state: text("state").notNull(),
  isOnline: boolean("is_online").default(false).notNull(),
  meetingLink: text("meeting_link"),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  registrationDeadline: timestamp("registration_deadline"),
  maxParticipants: integer("max_participants"),
  currentParticipants: integer("current_participants").default(0),
  entryFee: integer("entry_fee").default(0),
  prizes: jsonb("prizes"), // Prize structure
  rules: text("rules").array(),
  requirements: text("requirements").array(),
  contacts: jsonb("contacts"), // Contact information
  sponsors: text("sponsors").array(),
  tags: text("tags").array(),
  banner: text("banner"),
  status: text("status").default("upcoming").notNull(), // "upcoming", "ongoing", "completed", "cancelled"
  isApproved: boolean("is_approved").default(false).notNull(),
  approvedBy: integer("approved_by").references(() => users.id),
  approvedAt: timestamp("approved_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull()
});

export const collegeEventRegistrations = pgTable("college_event_registrations", {
  id: serial("id").primaryKey(),
  eventId: integer("event_id").notNull().references(() => collegeEvents.id),
  userId: integer("user_id").notNull().references(() => users.id),
  teamName: text("team_name"),
  teamMembers: jsonb("team_members"), // Array of team member details
  college: text("college"),
  year: text("year"), // Academic year
  phone: text("phone"),
  emergencyContact: text("emergency_contact"),
  specialRequirements: text("special_requirements"),
  paymentStatus: text("payment_status").default("pending").notNull(), // "pending", "paid", "failed"
  paymentId: text("payment_id"),
  registrationData: jsonb("registration_data"), // Additional event-specific data
  status: text("status").default("registered").notNull(), // "registered", "approved", "rejected", "attended"
  registeredAt: timestamp("registered_at").defaultNow().notNull()
});

// Local Events and Meetups
export const localEvents = pgTable("local_events", {
  id: serial("id").primaryKey(),
  communityId: integer("community_id").references(() => communities.id),
  organizerId: integer("organizer_id").notNull().references(() => users.id),
  title: text("title").notNull(),
  description: text("description").notNull(),
  eventType: text("event_type").notNull(), // "meetup", "workshop", "networking", "study_group", "hackathon"
  category: text("category").notNull(), // "tech", "career", "social", "academic", "cultural"
  venue: text("venue").notNull(),
  address: text("address").notNull(),
  city: text("city").notNull(),
  state: text("state").notNull(),
  coordinates: jsonb("coordinates"), // Lat/long for map
  date: timestamp("date").notNull(),
  duration: text("duration").notNull(), // "2 hours", "1 day"
  maxAttendees: integer("max_attendees").default(50),
  currentAttendees: integer("current_attendees").default(0),
  entryFee: integer("entry_fee").default(0),
  ageRestriction: text("age_restriction"), // "18+", "all ages"
  requirements: text("requirements").array(),
  whatToBring: text("what_to_bring").array(),
  agenda: jsonb("agenda"), // Detailed agenda
  speakers: jsonb("speakers"), // Speaker information
  sponsors: text("sponsors").array(),
  tags: text("tags").array(),
  images: text("images").array(),
  contactInfo: jsonb("contact_info"),
  isApproved: boolean("is_approved").default(false).notNull(),
  approvedBy: integer("approved_by").references(() => users.id),
  status: text("status").default("upcoming").notNull(), // "upcoming", "ongoing", "completed", "cancelled"
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull()
});

export const localEventAttendees = pgTable("local_event_attendees", {
  id: serial("id").primaryKey(),
  eventId: integer("event_id").notNull().references(() => localEvents.id),
  userId: integer("user_id").notNull().references(() => users.id),
  attendeeType: text("attendee_type").default("participant").notNull(), // "participant", "volunteer", "speaker"
  specialRequests: text("special_requests"),
  emergencyContact: text("emergency_contact"),
  paymentStatus: text("payment_status").default("pending").notNull(),
  paymentId: text("payment_id"),
  checkInTime: timestamp("check_in_time"),
  checkOutTime: timestamp("check_out_time"),
  feedback: text("feedback"),
  rating: integer("rating"), // 1-5 stars
  status: text("status").default("registered").notNull(), // "registered", "confirmed", "attended", "no_show"
  registeredAt: timestamp("registered_at").defaultNow().notNull()
});

// Career Guide Dynamic Tables

export const careerOptions = pgTable("career_options", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  category: text("category").notNull(),
  description: text("description").notNull(),
  salaryMin: integer("salary_min"),
  salaryMax: integer("salary_max"),
  difficultyLevel: text("difficulty_level"),
  requiredSkills: text("required_skills").array(),
  growthOutlook: text("growth_outlook"),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull()
});

export const careerAssessmentQuestions = pgTable("career_assessment_questions", {
  id: serial("id").primaryKey(),
  question: text("question").notNull(),
  questionType: text("question_type").notNull(),
  options: jsonb("options"), // For multiple choice options
  category: text("category"), // interests, work_style, tech_comfort, etc.
  weight: integer("weight").default(1),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull()
});

export const careerMatchingRules = pgTable("career_matching_rules", {
  id: serial("id").primaryKey(),
  careerId: integer("career_id").references(() => careerOptions.id).notNull(),
  questionCategory: text("question_category"),
  matchingCriteria: jsonb("matching_criteria"),
  weight: numeric("weight", { precision: 3, scale: 2 }).default(sql`1.0`)
});

export const userCareerAssessments = pgTable("user_career_assessments", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  responses: jsonb("responses").notNull(),
  recommendations: jsonb("recommendations"),
  completedAt: timestamp("completed_at").defaultNow().notNull()
});

// Career Roadmap Dynamic Tables

export const careerPaths = pgTable("career_paths", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  category: text("category").notNull(),
  description: text("description"),
  overview: text("overview"),
  dayInLife: text("day_in_life"),
  salaryExpectations: jsonb("salary_expectations"),
  growthOutlook: text("growth_outlook"),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull()
});

export const careerSkills = pgTable("career_skills", {
  id: serial("id").primaryKey(),
  careerPathId: integer("career_path_id").references(() => careerPaths.id).notNull(),
  skillName: text("skill_name").notNull(),
  skillType: text("skill_type").notNull(),
  importanceLevel: integer("importance_level"),
  description: text("description")
});

export const careerCourses = pgTable("career_courses", {
  id: serial("id").primaryKey(),
  careerPathId: integer("career_path_id").references(() => careerPaths.id).notNull(),
  title: text("title").notNull(),
  description: text("description"),
  provider: text("provider"),
  url: text("url"),
  difficulty: text("difficulty"),
  duration: text("duration"),
  isFree: boolean("is_free").default(false).notNull(),
  price: integer("price"),
  category: text("category"),
  sortOrder: integer("sort_order").default(0)
});

export const careerProjects = pgTable("career_projects", {
  id: serial("id").primaryKey(),
  careerPathId: integer("career_path_id").references(() => careerPaths.id).notNull(),
  title: text("title").notNull(),
  description: text("description"),
  difficulty: text("difficulty"),
  technologies: text("technologies").array(),
  estimatedDuration: text("estimated_duration"),
  projectUrl: text("project_url"),
  githubRepo: text("github_repo"),
  sortOrder: integer("sort_order").default(0)
});

export const careerResources = pgTable("career_resources", {
  id: serial("id").primaryKey(),
  careerPathId: integer("career_path_id").references(() => careerPaths.id).notNull(),
  resourceType: text("resource_type").notNull(),
  title: text("title").notNull(),
  description: text("description"),
  url: text("url"),
  isFree: boolean("is_free").default(false).notNull(),
  rating: numeric("rating", { precision: 2, scale: 1 })
});

export const userCareerProgress = pgTable("user_career_progress", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  careerPathId: integer("career_path_id").references(() => careerPaths.id).notNull(),
  currentPhase: integer("current_phase").default(1),
  completedSkills: text("completed_skills").array().default(sql`'{}'::text[]`),
  completedCourses: text("completed_courses").array().default(sql`'{}'::text[]`),
  completedProjects: text("completed_projects").array().default(sql`'{}'::text[]`),
  progressPercentage: integer("progress_percentage").default(0),
  startedAt: timestamp("started_at").defaultNow().notNull(),
  lastUpdated: timestamp("last_updated").defaultNow().notNull()
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
export const insertResumeSchema = createInsertSchema(resumes).omit({ id: true, createdAt: true, updatedAt: true });
export const insertPostSchema = createInsertSchema(posts).omit({ id: true, likes: true, replies: true, createdAt: true });
export const insertCommentSchema = createInsertSchema(comments).omit({ id: true, createdAt: true });
export const insertAchievementSchema = createInsertSchema(achievements).omit({ id: true });
export const insertUserAchievementSchema = createInsertSchema(userAchievements).omit({ id: true, earnedAt: true });
export const insertEventSchema = createInsertSchema(events).omit({ id: true });
export const insertUserEventSchema = createInsertSchema(userEvents).omit({ id: true, registeredAt: true });
export const insertDailyByteSchema = createInsertSchema(dailyBytes).omit({ id: true, createdAt: true });
export const insertUserDailyByteSchema = createInsertSchema(userDailyBytes).omit({ id: true, completedAt: true });

// Community project schemas
export const insertCommunityProjectSchema = createInsertSchema(communityProjects).omit({ id: true, createdAt: true, updatedAt: true, currentCollaborators: true });
export const insertProjectCollaboratorSchema = createInsertSchema(projectCollaborators).omit({ id: true, joinedAt: true, contributionScore: true });
export const insertProjectTaskSchema = createInsertSchema(projectTasks).omit({ id: true, createdAt: true, updatedAt: true, completedAt: true });
export const insertProjectUpdateSchema = createInsertSchema(projectUpdates).omit({ id: true, createdAt: true });
export const insertProjectShowcaseSchema = createInsertSchema(projectShowcase).omit({ id: true, createdAt: true, views: true, likes: true });

// Event schemas
export const insertCollegeEventSchema = createInsertSchema(collegeEvents).omit({ id: true, createdAt: true, updatedAt: true, currentParticipants: true, isApproved: true, approvedBy: true, approvedAt: true });
export const insertLocalEventSchema = createInsertSchema(localEvents).omit({ id: true, createdAt: true, updatedAt: true, currentAttendees: true, isApproved: true, approvedBy: true });
export const insertLocalEventAttendeeSchema = createInsertSchema(localEventAttendees).omit({ id: true, registeredAt: true, checkInTime: true, checkOutTime: true });

// RBAC schemas
export const insertRoleSchema = createInsertSchema(roles).omit({ id: true, createdAt: true });
export const insertPermissionSchema = createInsertSchema(permissions).omit({ id: true, createdAt: true });
export const insertRolePermissionSchema = createInsertSchema(rolePermissions).omit({ id: true, createdAt: true });
export const insertUserRoleSchema = createInsertSchema(userRoles).omit({ id: true, assignedAt: true });

// Community schemas
export const insertCommunitySchema = createInsertSchema(communities).omit({ id: true, createdAt: true });
export const insertCommunityMemberSchema = createInsertSchema(communityMembers).omit({ id: true, joinedAt: true });
export const insertCommunityPostSchema = createInsertSchema(communityPosts).omit({ id: true, likes: true, replies: true, createdAt: true, updatedAt: true, userId: true, communityId: true });
export const insertCommunityPostCommentSchema = createInsertSchema(communityPostComments).omit({ id: true, createdAt: true, updatedAt: true, userId: true, postId: true });
export const insertModerationActionSchema = createInsertSchema(moderationActions).omit({ id: true, createdAt: true });

// Industry Expert Network schemas
export const insertIndustryExpertSchema = createInsertSchema(industryExperts).omit({ id: true, joinedAt: true, rating: true, totalSessions: true });
export const insertExpertSessionSchema = createInsertSchema(expertSessions).omit({ id: true, createdAt: true, currentAttendees: true });
export const insertSessionRegistrationSchema = createInsertSchema(sessionRegistrations).omit({ id: true, registeredAt: true, attended: true });
export const insertExpertQnaSessionSchema = createInsertSchema(expertQnaSessions).omit({ id: true, askedAt: true, answeredAt: true, upvotes: true, isAnswered: true });
export const insertCareerSuccessStorySchema = createInsertSchema(careerSuccessStories).omit({ id: true, createdAt: true, views: true, likes: true });
export const insertNetworkingEventSchema = createInsertSchema(networkingEvents).omit({ id: true, createdAt: true, currentAttendees: true });
export const insertCollegeEventRegistrationSchema = createInsertSchema(collegeEventRegistrations).omit({ id: true, registeredAt: true });
export const insertExpertMentorshipSchema = createInsertSchema(expertMentorship).omit({ id: true, createdAt: true });
export const insertExpertConnectionSchema = createInsertSchema(expertConnections).omit({ id: true, createdAt: true, lastActivityAt: true });
export const insertExpertMessageSchema = createInsertSchema(expertMessages).omit({ id: true, createdAt: true, editedAt: true });
export const insertExpertAvailabilitySchema = createInsertSchema(expertAvailability).omit({ id: true });

// Career Guide schemas
export const insertCareerOptionSchema = createInsertSchema(careerOptions).omit({ id: true, createdAt: true, updatedAt: true });
export const insertCareerAssessmentQuestionSchema = createInsertSchema(careerAssessmentQuestions).omit({ id: true, createdAt: true });
export const insertCareerMatchingRuleSchema = createInsertSchema(careerMatchingRules).omit({ id: true });
export const insertUserCareerAssessmentSchema = createInsertSchema(userCareerAssessments).omit({ id: true, completedAt: true });

// Career Roadmap schemas
export const insertCareerPathSchema = createInsertSchema(careerPaths).omit({ id: true, createdAt: true });
export const insertCareerSkillSchema = createInsertSchema(careerSkills).omit({ id: true });
export const insertCareerCourseSchema = createInsertSchema(careerCourses).omit({ id: true });
export const insertCareerProjectSchema = createInsertSchema(careerProjects).omit({ id: true });
export const insertCareerResourceSchema = createInsertSchema(careerResources).omit({ id: true });
export const insertUserCareerProgressSchema = createInsertSchema(userCareerProgress).omit({ id: true, startedAt: true, lastUpdated: true });

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

// Industry Expert Network types
export type InsertIndustryExpert = z.infer<typeof insertIndustryExpertSchema>;
export type IndustryExpert = typeof industryExperts.$inferSelect;

export type InsertExpertSession = z.infer<typeof insertExpertSessionSchema>;
export type ExpertSession = typeof expertSessions.$inferSelect;

export type InsertSessionRegistration = z.infer<typeof insertSessionRegistrationSchema>;
export type SessionRegistration = typeof sessionRegistrations.$inferSelect;

export type InsertExpertQnaSession = z.infer<typeof insertExpertQnaSessionSchema>;
export type ExpertQnaSession = typeof expertQnaSessions.$inferSelect;

export type InsertExpertConnection = z.infer<typeof insertExpertConnectionSchema>;
export type ExpertConnection = typeof expertConnections.$inferSelect;

export type InsertExpertMessage = z.infer<typeof insertExpertMessageSchema>;
export type ExpertMessage = typeof expertMessages.$inferSelect;

export type InsertCareerSuccessStory = z.infer<typeof insertCareerSuccessStorySchema>;
export type CareerSuccessStory = typeof careerSuccessStories.$inferSelect;

export type InsertNetworkingEvent = z.infer<typeof insertNetworkingEventSchema>;
export type NetworkingEvent = typeof networkingEvents.$inferSelect;

export type InsertEventRegistration = z.infer<typeof insertCollegeEventRegistrationSchema>;
export type EventRegistration = typeof eventRegistrations.$inferSelect;

export type InsertExpertMentorship = z.infer<typeof insertExpertMentorshipSchema>;
export type ExpertMentorship = typeof expertMentorship.$inferSelect;

export type InsertExpertAvailability = z.infer<typeof insertExpertAvailabilitySchema>;
export type ExpertAvailability = typeof expertAvailability.$inferSelect;

// ========================================
// MENTOR JOURNEY TABLES & SCHEMAS
// ========================================

// Mentor Profiles Table
export const mentorProfiles = pgTable("mentor_profiles", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  domains: text("domains").array().notNull().default(sql`'{}'::text[]`),
  experienceLevel: varchar("experience_level", { length: 50 }).notNull(),
  skills: text("skills").array().notNull().default(sql`'{}'::text[]`),
  weeklyAvailability: integer("weekly_availability").notNull().default(0),
  availability: json("availability").notNull().default({}),
  mentoringPreferences: text("mentoring_preferences").array().notNull().default(sql`'{}'::text[]`),
  isVerified: boolean("is_verified").default(false),
  isApproved: boolean("is_approved").default(false),
  currentStage: integer("current_stage").default(1),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

export const insertMentorProfileSchema = createInsertSchema(mentorProfiles);

// Mentor Sessions Table
export const mentorSessions = pgTable("mentor_sessions", {
  id: serial("id").primaryKey(),
  mentorId: integer("mentor_id").references(() => users.id).notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  type: varchar("type", { length: 50 }).notNull(), // 'workshop', 'mock_interview', 'qa', 'one_on_one'
  scheduledDate: timestamp("scheduled_date").notNull(),
  duration: integer("duration").notNull(), // in minutes
  maxParticipants: integer("max_participants").default(1),
  currentParticipants: integer("current_participants").default(0),
  isActive: boolean("is_active").default(true),
  rating: numeric("rating", { precision: 3, scale: 2 }),
  createdAt: timestamp("created_at").defaultNow()
});

export const insertMentorSessionSchema = createInsertSchema(mentorSessions);

// Mentor Community Engagement Table
export const mentorCommunityEngagement = pgTable("mentor_community_engagement", {
  id: serial("id").primaryKey(),
  mentorId: integer("mentor_id").references(() => users.id).notNull(),
  answersPosted: integer("answers_posted").default(0),
  postsCreated: integer("posts_created").default(0),
  totalUpvotes: integer("total_upvotes").default(0),
  communityRating: numeric("community_rating", { precision: 3, scale: 2 }).default(sql`0.0`),
  monthlyGoalAnswers: integer("monthly_goal_answers").default(50),
  currentMonthAnswers: integer("current_month_answers").default(0),
  lastUpdated: timestamp("last_updated").defaultNow()
});

export const insertMentorCommunityEngagementSchema = createInsertSchema(mentorCommunityEngagement);

// Mentor Resources Table
export const mentorResources = pgTable("mentor_resources", {
  id: serial("id").primaryKey(),
  mentorId: integer("mentor_id").references(() => users.id).notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  type: varchar("type", { length: 50 }).notNull(), // 'pdf', 'doc', 'template', 'checklist'
  filePath: text("file_path"),
  downloads: integer("downloads").default(0),
  isPublic: boolean("is_public").default(true),
  createdAt: timestamp("created_at").defaultNow()
});

export const insertMentorResourceSchema = createInsertSchema(mentorResources);

// Mentorship Matching Table
export const mentorshipMatching = pgTable("mentorship_matching", {
  id: serial("id").primaryKey(),
  mentorId: integer("mentor_id").references(() => users.id).notNull(),
  menteeId: integer("mentee_id").references(() => users.id).notNull(),
  status: varchar("status", { length: 50 }).default("active"), // 'active', 'completed', 'paused'
  matchedAt: timestamp("matched_at").defaultNow(),
  goals: text("goals").array().notNull().default(sql`'{}'::text[]`),
  progress: integer("progress").default(0),
  nextSessionDate: timestamp("next_session_date"),
  totalSessions: integer("total_sessions").default(0),
  rating: numeric("rating", { precision: 3, scale: 2 })
});

export const insertMentorshipMatchingSchema = createInsertSchema(mentorshipMatching);

// Mentor Feedback Table
export const mentorFeedback = pgTable("mentor_feedback", {
  id: serial("id").primaryKey(),
  mentorId: integer("mentor_id").references(() => users.id).notNull(),
  studentId: integer("student_id").references(() => users.id).notNull(),
  sessionId: integer("session_id").references(() => mentorSessions.id),
  rating: integer("rating").notNull(), // 1-5 scale
  feedback: text("feedback"),
  isAnonymous: boolean("is_anonymous").default(false),
  createdAt: timestamp("created_at").defaultNow()
});

export const insertMentorFeedbackSchema = createInsertSchema(mentorFeedback);

// Mentor Badges Table
export const mentorBadges = pgTable("mentor_badges", {
  id: serial("id").primaryKey(),
  mentorId: integer("mentor_id").references(() => users.id).notNull(),
  badgeType: varchar("badge_type", { length: 100 }).notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  earnedAt: timestamp("earned_at").defaultNow(),
  isVisible: boolean("is_visible").default(true)
});

export const insertMentorBadgeSchema = createInsertSchema(mentorBadges);

// Relations for mentor tables
export const mentorProfilesRelations = relations(mentorProfiles, ({ one }) => ({
  user: one(users, {
    fields: [mentorProfiles.userId],
    references: [users.id]
  })
}));

export const mentorSessionsRelations = relations(mentorSessions, ({ one }) => ({
  mentor: one(users, {
    fields: [mentorSessions.mentorId],
    references: [users.id]
  })
}));

export const mentorCommunityEngagementRelations = relations(mentorCommunityEngagement, ({ one }) => ({
  mentor: one(users, {
    fields: [mentorCommunityEngagement.mentorId],
    references: [users.id]
  })
}));

export const mentorResourcesRelations = relations(mentorResources, ({ one }) => ({
  mentor: one(users, {
    fields: [mentorResources.mentorId],
    references: [users.id]
  })
}));

export const mentorshipMatchingRelations = relations(mentorshipMatching, ({ one }) => ({
  mentor: one(users, {
    fields: [mentorshipMatching.mentorId],
    references: [users.id]
  }),
  mentee: one(users, {
    fields: [mentorshipMatching.menteeId], 
    references: [users.id]
  })
}));

export const mentorFeedbackRelations = relations(mentorFeedback, ({ one }) => ({
  mentor: one(users, {
    fields: [mentorFeedback.mentorId],
    references: [users.id]
  }),
  student: one(users, {
    fields: [mentorFeedback.studentId],
    references: [users.id]
  }),
  session: one(mentorSessions, {
    fields: [mentorFeedback.sessionId],
    references: [mentorSessions.id]
  })
}));

export const mentorBadgesRelations = relations(mentorBadges, ({ one }) => ({
  mentor: one(users, {
    fields: [mentorBadges.mentorId],
    references: [users.id]
  })
}));

// Mentor journey types
export type InsertMentorProfile = z.infer<typeof insertMentorProfileSchema>;
export type MentorProfile = typeof mentorProfiles.$inferSelect;

export type InsertMentorSession = z.infer<typeof insertMentorSessionSchema>;
export type MentorSession = typeof mentorSessions.$inferSelect;

export type InsertMentorCommunityEngagement = z.infer<typeof insertMentorCommunityEngagementSchema>;
export type MentorCommunityEngagement = typeof mentorCommunityEngagement.$inferSelect;

export type InsertMentorResource = z.infer<typeof insertMentorResourceSchema>;
export type MentorResource = typeof mentorResources.$inferSelect;

export type InsertMentorshipMatching = z.infer<typeof insertMentorshipMatchingSchema>;
export type MentorshipMatching = typeof mentorshipMatching.$inferSelect;

export type InsertMentorFeedback = z.infer<typeof insertMentorFeedbackSchema>;
export type MentorFeedback = typeof mentorFeedback.$inferSelect;

export type InsertMentorBadge = z.infer<typeof insertMentorBadgeSchema>;
export type MentorBadge = typeof mentorBadges.$inferSelect;

// Community Project Types
export type InsertCommunityProject = z.infer<typeof insertCommunityProjectSchema>;
export type CommunityProject = typeof communityProjects.$inferSelect;

export type InsertProjectCollaborator = z.infer<typeof insertProjectCollaboratorSchema>;
export type ProjectCollaborator = typeof projectCollaborators.$inferSelect;

export type InsertProjectTask = z.infer<typeof insertProjectTaskSchema>;
export type ProjectTask = typeof projectTasks.$inferSelect;

export type InsertProjectUpdate = z.infer<typeof insertProjectUpdateSchema>;
export type ProjectUpdate = typeof projectUpdates.$inferSelect;

export type InsertProjectShowcase = z.infer<typeof insertProjectShowcaseSchema>;
export type ProjectShowcase = typeof projectShowcase.$inferSelect;

// Event Types
export type InsertCollegeEvent = z.infer<typeof insertCollegeEventSchema>;
export type CollegeEvent = typeof collegeEvents.$inferSelect;

export type InsertCollegeEventRegistration = z.infer<typeof insertCollegeEventRegistrationSchema>;
export type CollegeEventRegistration = typeof collegeEventRegistrations.$inferSelect;

export type InsertLocalEvent = z.infer<typeof insertLocalEventSchema>;
export type LocalEvent = typeof localEvents.$inferSelect;

export type InsertLocalEventAttendee = z.infer<typeof insertLocalEventAttendeeSchema>;
export type LocalEventAttendee = typeof localEventAttendees.$inferSelect;

// Career Guide Types
export type InsertCareerOption = z.infer<typeof insertCareerOptionSchema>;
export type CareerOption = typeof careerOptions.$inferSelect;

export type InsertCareerAssessmentQuestion = z.infer<typeof insertCareerAssessmentQuestionSchema>;
export type CareerAssessmentQuestion = typeof careerAssessmentQuestions.$inferSelect;

export type InsertCareerMatchingRule = z.infer<typeof insertCareerMatchingRuleSchema>;
export type CareerMatchingRule = typeof careerMatchingRules.$inferSelect;

export type InsertUserCareerAssessment = z.infer<typeof insertUserCareerAssessmentSchema>;
export type UserCareerAssessment = typeof userCareerAssessments.$inferSelect;

// Career Roadmap Types
export type InsertCareerPath = z.infer<typeof insertCareerPathSchema>;
export type CareerPath = typeof careerPaths.$inferSelect;

export type InsertCareerSkill = z.infer<typeof insertCareerSkillSchema>;
export type CareerSkill = typeof careerSkills.$inferSelect;

export type InsertCareerCourse = z.infer<typeof insertCareerCourseSchema>;
export type CareerCourse = typeof careerCourses.$inferSelect;

export type InsertCareerProject = z.infer<typeof insertCareerProjectSchema>;
export type CareerProject = typeof careerProjects.$inferSelect;

export type InsertCareerResource = z.infer<typeof insertCareerResourceSchema>;
export type CareerResource = typeof careerResources.$inferSelect;

export type InsertUserCareerProgress = z.infer<typeof insertUserCareerProgressSchema>;
export type UserCareerProgress = typeof userCareerProgress.$inferSelect;
