CREATE TABLE "achievements" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"icon" text NOT NULL,
	"category" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "career_assessment_questions" (
	"id" serial PRIMARY KEY NOT NULL,
	"question" text NOT NULL,
	"question_type" text NOT NULL,
	"options" jsonb,
	"category" text,
	"weight" integer DEFAULT 1,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "career_courses" (
	"id" serial PRIMARY KEY NOT NULL,
	"career_path_id" integer NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"provider" text,
	"url" text,
	"difficulty" text,
	"duration" text,
	"is_free" boolean DEFAULT false NOT NULL,
	"price" integer,
	"category" text,
	"sort_order" integer DEFAULT 0
);
--> statement-breakpoint
CREATE TABLE "career_matching_rules" (
	"id" serial PRIMARY KEY NOT NULL,
	"career_id" integer NOT NULL,
	"question_category" text,
	"matching_criteria" jsonb,
	"weight" numeric(3, 2) DEFAULT 1.0
);
--> statement-breakpoint
CREATE TABLE "career_options" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"category" text NOT NULL,
	"description" text NOT NULL,
	"salary_min" integer,
	"salary_max" integer,
	"difficulty_level" text,
	"required_skills" text[],
	"growth_outlook" text,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "career_paths" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"category" text NOT NULL,
	"description" text,
	"overview" text,
	"day_in_life" text,
	"salary_expectations" jsonb,
	"growth_outlook" text,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "career_projects" (
	"id" serial PRIMARY KEY NOT NULL,
	"career_path_id" integer NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"difficulty" text,
	"technologies" text[],
	"estimated_duration" text,
	"project_url" text,
	"github_repo" text,
	"sort_order" integer DEFAULT 0
);
--> statement-breakpoint
CREATE TABLE "career_resources" (
	"id" serial PRIMARY KEY NOT NULL,
	"career_path_id" integer NOT NULL,
	"resource_type" text NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"url" text,
	"is_free" boolean DEFAULT false NOT NULL,
	"rating" numeric(2, 1)
);
--> statement-breakpoint
CREATE TABLE "career_skills" (
	"id" serial PRIMARY KEY NOT NULL,
	"career_path_id" integer NOT NULL,
	"skill_name" text NOT NULL,
	"skill_type" text NOT NULL,
	"importance_level" integer,
	"description" text
);
--> statement-breakpoint
CREATE TABLE "career_success_stories" (
	"id" serial PRIMARY KEY NOT NULL,
	"author_id" integer,
	"expert_id" integer,
	"title" text NOT NULL,
	"story" text NOT NULL,
	"career_path" text NOT NULL,
	"industry_from" text,
	"industry_to" text NOT NULL,
	"timeframe" text,
	"key_learnings" text[],
	"challenges" text[],
	"advice" text[],
	"salary_growth" text,
	"company_progression" text[],
	"skills_gained" text[],
	"certifications" text[],
	"is_public" boolean DEFAULT true NOT NULL,
	"is_featured" boolean DEFAULT false,
	"views" integer DEFAULT 0,
	"likes" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "college_event_registrations" (
	"id" serial PRIMARY KEY NOT NULL,
	"event_id" integer NOT NULL,
	"user_id" integer NOT NULL,
	"team_name" text,
	"team_members" jsonb,
	"college" text,
	"year" text,
	"phone" text,
	"emergency_contact" text,
	"special_requirements" text,
	"payment_status" text DEFAULT 'pending' NOT NULL,
	"payment_id" text,
	"registration_data" jsonb,
	"status" text DEFAULT 'registered' NOT NULL,
	"registered_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "college_events" (
	"id" serial PRIMARY KEY NOT NULL,
	"community_id" integer,
	"organizer_id" integer NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"event_type" text NOT NULL,
	"category" text NOT NULL,
	"college" text,
	"venue" text,
	"city" text NOT NULL,
	"state" text NOT NULL,
	"is_online" boolean DEFAULT false NOT NULL,
	"meeting_link" text,
	"start_date" timestamp NOT NULL,
	"end_date" timestamp NOT NULL,
	"registration_deadline" timestamp,
	"max_participants" integer,
	"current_participants" integer DEFAULT 0,
	"entry_fee" integer DEFAULT 0,
	"prizes" jsonb,
	"rules" text[],
	"requirements" text[],
	"contacts" jsonb,
	"sponsors" text[],
	"tags" text[],
	"banner" text,
	"status" text DEFAULT 'upcoming' NOT NULL,
	"is_approved" boolean DEFAULT false NOT NULL,
	"approved_by" integer,
	"approved_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "comments" (
	"id" serial PRIMARY KEY NOT NULL,
	"post_id" integer NOT NULL,
	"user_id" integer NOT NULL,
	"content" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "communities" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text NOT NULL,
	"rules" text,
	"banner" text,
	"icon" text,
	"created_by" integer NOT NULL,
	"is_private" boolean DEFAULT false NOT NULL,
	"community_type" text DEFAULT 'general' NOT NULL,
	"interests" text[],
	"domain" text,
	"region" text,
	"college" text,
	"max_members" integer DEFAULT 0,
	"current_members" integer DEFAULT 0,
	"tags" text[],
	"settings" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "community_members" (
	"id" serial PRIMARY KEY NOT NULL,
	"community_id" integer NOT NULL,
	"user_id" integer NOT NULL,
	"role_id" integer,
	"role" text DEFAULT 'member' NOT NULL,
	"joined_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "community_post_comments" (
	"id" serial PRIMARY KEY NOT NULL,
	"post_id" integer NOT NULL,
	"user_id" integer NOT NULL,
	"content" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "community_posts" (
	"id" serial PRIMARY KEY NOT NULL,
	"community_id" integer NOT NULL,
	"user_id" integer NOT NULL,
	"title" text NOT NULL,
	"content" text NOT NULL,
	"likes" integer DEFAULT 0 NOT NULL,
	"replies" integer DEFAULT 0 NOT NULL,
	"is_pinned" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "community_projects" (
	"id" serial PRIMARY KEY NOT NULL,
	"community_id" integer NOT NULL,
	"created_by" integer NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"project_type" text NOT NULL,
	"tech_stack" text[] NOT NULL,
	"difficulty" text NOT NULL,
	"estimated_duration" text NOT NULL,
	"max_collaborators" integer DEFAULT 5,
	"current_collaborators" integer DEFAULT 1,
	"status" text DEFAULT 'open' NOT NULL,
	"is_public" boolean DEFAULT true NOT NULL,
	"requirements" text[],
	"expected_outcome" text NOT NULL,
	"github_repo" text,
	"live_demo" text,
	"figma_design" text,
	"resources" jsonb,
	"deadline" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "courses" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"thumbnail" text NOT NULL,
	"price" integer DEFAULT 0 NOT NULL,
	"is_free" boolean DEFAULT true NOT NULL,
	"rating" integer DEFAULT 0,
	"enrolled_count" integer DEFAULT 0,
	"category" text NOT NULL,
	"tags" text[],
	"is_featured" boolean DEFAULT false
);
--> statement-breakpoint
CREATE TABLE "daily_bytes" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"content" text NOT NULL,
	"type" text NOT NULL,
	"category" text NOT NULL,
	"for_date" date NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"active" boolean DEFAULT true NOT NULL
);
--> statement-breakpoint
CREATE TABLE "enrollments" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"course_id" integer NOT NULL,
	"progress" integer DEFAULT 0 NOT NULL,
	"is_completed" boolean DEFAULT false NOT NULL,
	"enrolled_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "event_registrations" (
	"id" serial PRIMARY KEY NOT NULL,
	"event_id" integer NOT NULL,
	"user_id" integer NOT NULL,
	"registered_at" timestamp DEFAULT now() NOT NULL,
	"attended" boolean DEFAULT false,
	"rating" integer,
	"feedback" text,
	"networking_goals" text[],
	"interests" text[]
);
--> statement-breakpoint
CREATE TABLE "events" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"type" text NOT NULL,
	"date" timestamp NOT NULL,
	"duration" integer NOT NULL,
	"is_registration_required" boolean DEFAULT true NOT NULL
);
--> statement-breakpoint
CREATE TABLE "expert_availability" (
	"id" serial PRIMARY KEY NOT NULL,
	"expert_id" integer NOT NULL,
	"day_of_week" integer NOT NULL,
	"start_time" text NOT NULL,
	"end_time" text NOT NULL,
	"timezone" text DEFAULT 'Asia/Kolkata' NOT NULL,
	"is_available" boolean DEFAULT true NOT NULL,
	"session_types" text[] NOT NULL
);
--> statement-breakpoint
CREATE TABLE "expert_mentorship" (
	"id" serial PRIMARY KEY NOT NULL,
	"expert_id" integer NOT NULL,
	"mentee_id" integer NOT NULL,
	"status" text DEFAULT 'pending' NOT NULL,
	"duration" text NOT NULL,
	"goals" text[] NOT NULL,
	"meeting_frequency" text NOT NULL,
	"communication_mode" text NOT NULL,
	"start_date" timestamp,
	"end_date" timestamp,
	"notes" text,
	"mentee_progress" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "expert_qna_sessions" (
	"id" serial PRIMARY KEY NOT NULL,
	"session_id" integer NOT NULL,
	"question" text NOT NULL,
	"asked_by" integer NOT NULL,
	"answer" text,
	"answered_at" timestamp,
	"upvotes" integer DEFAULT 0,
	"is_answered" boolean DEFAULT false,
	"asked_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "expert_sessions" (
	"id" serial PRIMARY KEY NOT NULL,
	"expert_id" integer NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"session_type" text NOT NULL,
	"category" text NOT NULL,
	"scheduled_at" timestamp NOT NULL,
	"duration_minutes" integer NOT NULL,
	"max_attendees" integer DEFAULT 100,
	"current_attendees" integer DEFAULT 0,
	"meeting_link" text,
	"recording_url" text,
	"status" text DEFAULT 'scheduled' NOT NULL,
	"tags" text[],
	"is_recorded" boolean DEFAULT true NOT NULL,
	"is_free" boolean DEFAULT true NOT NULL,
	"price" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "industry_experts" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer,
	"name" text NOT NULL,
	"title" text NOT NULL,
	"company" text NOT NULL,
	"industry" text NOT NULL,
	"specializations" text[] NOT NULL,
	"experience_years" integer NOT NULL,
	"bio" text NOT NULL,
	"avatar" text,
	"linkedin_url" text,
	"expertise" text[] NOT NULL,
	"rating" integer DEFAULT 0,
	"total_sessions" integer DEFAULT 0,
	"is_featured" boolean DEFAULT false,
	"featured_order" integer DEFAULT 0,
	"is_active" boolean DEFAULT true NOT NULL,
	"joined_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "local_event_attendees" (
	"id" serial PRIMARY KEY NOT NULL,
	"event_id" integer NOT NULL,
	"user_id" integer NOT NULL,
	"attendee_type" text DEFAULT 'participant' NOT NULL,
	"special_requests" text,
	"emergency_contact" text,
	"payment_status" text DEFAULT 'pending' NOT NULL,
	"payment_id" text,
	"check_in_time" timestamp,
	"check_out_time" timestamp,
	"feedback" text,
	"rating" integer,
	"status" text DEFAULT 'registered' NOT NULL,
	"registered_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "local_events" (
	"id" serial PRIMARY KEY NOT NULL,
	"community_id" integer,
	"organizer_id" integer NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"event_type" text NOT NULL,
	"category" text NOT NULL,
	"venue" text NOT NULL,
	"address" text NOT NULL,
	"city" text NOT NULL,
	"state" text NOT NULL,
	"coordinates" jsonb,
	"date" timestamp NOT NULL,
	"duration" text NOT NULL,
	"max_attendees" integer DEFAULT 50,
	"current_attendees" integer DEFAULT 0,
	"entry_fee" integer DEFAULT 0,
	"age_restriction" text,
	"requirements" text[],
	"what_to_bring" text[],
	"agenda" jsonb,
	"speakers" jsonb,
	"sponsors" text[],
	"tags" text[],
	"images" text[],
	"contact_info" jsonb,
	"is_approved" boolean DEFAULT false NOT NULL,
	"approved_by" integer,
	"status" text DEFAULT 'upcoming' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "mentor_badges" (
	"id" serial PRIMARY KEY NOT NULL,
	"mentor_id" integer NOT NULL,
	"badge_type" varchar(100) NOT NULL,
	"title" varchar(255) NOT NULL,
	"description" text,
	"earned_at" timestamp DEFAULT now(),
	"is_visible" boolean DEFAULT true
);
--> statement-breakpoint
CREATE TABLE "mentor_community_engagement" (
	"id" serial PRIMARY KEY NOT NULL,
	"mentor_id" integer NOT NULL,
	"answers_posted" integer DEFAULT 0,
	"posts_created" integer DEFAULT 0,
	"total_upvotes" integer DEFAULT 0,
	"community_rating" numeric(3, 2) DEFAULT 0.0,
	"monthly_goal_answers" integer DEFAULT 50,
	"current_month_answers" integer DEFAULT 0,
	"last_updated" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "mentor_feedback" (
	"id" serial PRIMARY KEY NOT NULL,
	"mentor_id" integer NOT NULL,
	"student_id" integer NOT NULL,
	"session_id" integer,
	"rating" integer NOT NULL,
	"feedback" text,
	"is_anonymous" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "mentor_profiles" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"domains" text[] DEFAULT '{}'::text[] NOT NULL,
	"experience_level" varchar(50) NOT NULL,
	"skills" text[] DEFAULT '{}'::text[] NOT NULL,
	"weekly_availability" integer DEFAULT 0 NOT NULL,
	"availability" json DEFAULT '{}'::json NOT NULL,
	"mentoring_preferences" text[] DEFAULT '{}'::text[] NOT NULL,
	"is_verified" boolean DEFAULT false,
	"is_approved" boolean DEFAULT false,
	"current_stage" integer DEFAULT 1,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "mentor_resources" (
	"id" serial PRIMARY KEY NOT NULL,
	"mentor_id" integer NOT NULL,
	"title" varchar(255) NOT NULL,
	"description" text,
	"type" varchar(50) NOT NULL,
	"file_path" text,
	"downloads" integer DEFAULT 0,
	"is_public" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "mentor_sessions" (
	"id" serial PRIMARY KEY NOT NULL,
	"mentor_id" integer NOT NULL,
	"title" varchar(255) NOT NULL,
	"description" text,
	"type" varchar(50) NOT NULL,
	"scheduled_date" timestamp NOT NULL,
	"duration" integer NOT NULL,
	"max_participants" integer DEFAULT 1,
	"current_participants" integer DEFAULT 0,
	"is_active" boolean DEFAULT true,
	"rating" numeric(3, 2),
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "mentorship_matching" (
	"id" serial PRIMARY KEY NOT NULL,
	"mentor_id" integer NOT NULL,
	"mentee_id" integer NOT NULL,
	"status" varchar(50) DEFAULT 'active',
	"matched_at" timestamp DEFAULT now(),
	"goals" text[] DEFAULT '{}'::text[] NOT NULL,
	"progress" integer DEFAULT 0,
	"next_session_date" timestamp,
	"total_sessions" integer DEFAULT 0,
	"rating" numeric(3, 2)
);
--> statement-breakpoint
CREATE TABLE "moderation_actions" (
	"id" serial PRIMARY KEY NOT NULL,
	"community_id" integer NOT NULL,
	"target_type" text NOT NULL,
	"target_id" integer NOT NULL,
	"action" text NOT NULL,
	"reason" text,
	"moderator_id" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "networking_events" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"event_type" text NOT NULL,
	"industry" text,
	"target_audience" text[],
	"organizer" text NOT NULL,
	"organizer_id" integer,
	"expert_id" integer,
	"scheduled_at" timestamp NOT NULL,
	"end_time" timestamp NOT NULL,
	"timezone" text DEFAULT 'Asia/Kolkata' NOT NULL,
	"location" text,
	"meeting_link" text,
	"max_attendees" integer,
	"current_attendees" integer DEFAULT 0,
	"is_online" boolean DEFAULT true NOT NULL,
	"is_free" boolean DEFAULT true NOT NULL,
	"registration_deadline" timestamp,
	"tags" text[],
	"agenda" jsonb,
	"status" text DEFAULT 'upcoming' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "permissions" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "permissions_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "posts" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"content" text NOT NULL,
	"likes" integer DEFAULT 0 NOT NULL,
	"replies" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "project_collaborators" (
	"id" serial PRIMARY KEY NOT NULL,
	"project_id" integer NOT NULL,
	"user_id" integer NOT NULL,
	"role" text NOT NULL,
	"skills" text[],
	"joined_at" timestamp DEFAULT now() NOT NULL,
	"status" text DEFAULT 'active' NOT NULL,
	"contribution_score" integer DEFAULT 0,
	"is_invited" boolean DEFAULT false NOT NULL,
	"invited_by" integer,
	"invited_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "project_showcase" (
	"id" serial PRIMARY KEY NOT NULL,
	"project_id" integer NOT NULL,
	"user_id" integer NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"screenshots" text[],
	"video_demo" text,
	"live_url" text,
	"github_url" text,
	"tech_stack" text[],
	"challenges" text[],
	"learnings" text[],
	"future_enhancements" text[],
	"is_public" boolean DEFAULT true NOT NULL,
	"is_featured" boolean DEFAULT false NOT NULL,
	"views" integer DEFAULT 0,
	"likes" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "project_tasks" (
	"id" serial PRIMARY KEY NOT NULL,
	"project_id" integer NOT NULL,
	"assigned_to" integer,
	"created_by" integer NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"priority" text DEFAULT 'medium' NOT NULL,
	"status" text DEFAULT 'todo' NOT NULL,
	"category" text NOT NULL,
	"estimated_hours" integer,
	"actual_hours" integer,
	"due_date" timestamp,
	"completed_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "project_updates" (
	"id" serial PRIMARY KEY NOT NULL,
	"project_id" integer NOT NULL,
	"user_id" integer NOT NULL,
	"update_type" text NOT NULL,
	"title" text NOT NULL,
	"content" text NOT NULL,
	"attachments" text[],
	"mentions" integer[],
	"is_important" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "projects" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"difficulty" text NOT NULL,
	"duration" text NOT NULL,
	"skills" text[],
	"category" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "quiz_results" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"quiz_type" text NOT NULL,
	"result" jsonb NOT NULL,
	"recommended_career" text NOT NULL,
	"recommended_niches" text[] NOT NULL,
	"completed_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "resumes" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"education" jsonb[] NOT NULL,
	"experience" jsonb[] NOT NULL,
	"skills" text[] NOT NULL,
	"projects" jsonb[],
	"template_id" text NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "role_permissions" (
	"id" serial PRIMARY KEY NOT NULL,
	"role_id" integer NOT NULL,
	"permission_id" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "roles" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "roles_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "session_registrations" (
	"id" serial PRIMARY KEY NOT NULL,
	"session_id" integer NOT NULL,
	"user_id" integer NOT NULL,
	"registered_at" timestamp DEFAULT now() NOT NULL,
	"attended" boolean DEFAULT false,
	"rating" integer,
	"feedback" text,
	"questions" text[]
);
--> statement-breakpoint
CREATE TABLE "soft_skills" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"type" text NOT NULL,
	"content" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_achievements" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"achievement_id" integer NOT NULL,
	"earned_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_career_assessments" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"responses" jsonb NOT NULL,
	"recommendations" jsonb,
	"completed_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_career_progress" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"career_path_id" integer NOT NULL,
	"current_phase" integer DEFAULT 1,
	"completed_skills" text[] DEFAULT '{}'::text[],
	"completed_courses" text[] DEFAULT '{}'::text[],
	"completed_projects" text[] DEFAULT '{}'::text[],
	"progress_percentage" integer DEFAULT 0,
	"started_at" timestamp DEFAULT now() NOT NULL,
	"last_updated" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_daily_bytes" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"daily_byte_id" integer NOT NULL,
	"completed" boolean DEFAULT false NOT NULL,
	"responded" boolean DEFAULT false NOT NULL,
	"response" jsonb,
	"completed_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "user_events" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"event_id" integer NOT NULL,
	"registered_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_projects" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"project_id" integer NOT NULL,
	"progress" integer DEFAULT 0 NOT NULL,
	"is_completed" boolean DEFAULT false NOT NULL,
	"started_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_roles" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"role_id" integer NOT NULL,
	"assigned_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_soft_skills" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"soft_skill_id" integer NOT NULL,
	"progress" integer DEFAULT 0 NOT NULL,
	"is_completed" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"username" text NOT NULL,
	"password" text NOT NULL,
	"email" text NOT NULL,
	"name" text NOT NULL,
	"bio" text,
	"avatar" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_username_unique" UNIQUE("username"),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "career_courses" ADD CONSTRAINT "career_courses_career_path_id_career_paths_id_fk" FOREIGN KEY ("career_path_id") REFERENCES "public"."career_paths"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "career_matching_rules" ADD CONSTRAINT "career_matching_rules_career_id_career_options_id_fk" FOREIGN KEY ("career_id") REFERENCES "public"."career_options"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "career_projects" ADD CONSTRAINT "career_projects_career_path_id_career_paths_id_fk" FOREIGN KEY ("career_path_id") REFERENCES "public"."career_paths"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "career_resources" ADD CONSTRAINT "career_resources_career_path_id_career_paths_id_fk" FOREIGN KEY ("career_path_id") REFERENCES "public"."career_paths"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "career_skills" ADD CONSTRAINT "career_skills_career_path_id_career_paths_id_fk" FOREIGN KEY ("career_path_id") REFERENCES "public"."career_paths"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "career_success_stories" ADD CONSTRAINT "career_success_stories_author_id_users_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "career_success_stories" ADD CONSTRAINT "career_success_stories_expert_id_industry_experts_id_fk" FOREIGN KEY ("expert_id") REFERENCES "public"."industry_experts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "college_event_registrations" ADD CONSTRAINT "college_event_registrations_event_id_college_events_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."college_events"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "college_event_registrations" ADD CONSTRAINT "college_event_registrations_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "college_events" ADD CONSTRAINT "college_events_community_id_communities_id_fk" FOREIGN KEY ("community_id") REFERENCES "public"."communities"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "college_events" ADD CONSTRAINT "college_events_organizer_id_users_id_fk" FOREIGN KEY ("organizer_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "college_events" ADD CONSTRAINT "college_events_approved_by_users_id_fk" FOREIGN KEY ("approved_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "comments" ADD CONSTRAINT "comments_post_id_posts_id_fk" FOREIGN KEY ("post_id") REFERENCES "public"."posts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "comments" ADD CONSTRAINT "comments_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "communities" ADD CONSTRAINT "communities_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "community_members" ADD CONSTRAINT "community_members_community_id_communities_id_fk" FOREIGN KEY ("community_id") REFERENCES "public"."communities"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "community_members" ADD CONSTRAINT "community_members_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "community_members" ADD CONSTRAINT "community_members_role_id_roles_id_fk" FOREIGN KEY ("role_id") REFERENCES "public"."roles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "community_post_comments" ADD CONSTRAINT "community_post_comments_post_id_community_posts_id_fk" FOREIGN KEY ("post_id") REFERENCES "public"."community_posts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "community_post_comments" ADD CONSTRAINT "community_post_comments_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "community_posts" ADD CONSTRAINT "community_posts_community_id_communities_id_fk" FOREIGN KEY ("community_id") REFERENCES "public"."communities"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "community_posts" ADD CONSTRAINT "community_posts_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "community_projects" ADD CONSTRAINT "community_projects_community_id_communities_id_fk" FOREIGN KEY ("community_id") REFERENCES "public"."communities"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "community_projects" ADD CONSTRAINT "community_projects_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "enrollments" ADD CONSTRAINT "enrollments_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "enrollments" ADD CONSTRAINT "enrollments_course_id_courses_id_fk" FOREIGN KEY ("course_id") REFERENCES "public"."courses"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "event_registrations" ADD CONSTRAINT "event_registrations_event_id_networking_events_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."networking_events"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "event_registrations" ADD CONSTRAINT "event_registrations_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "expert_availability" ADD CONSTRAINT "expert_availability_expert_id_industry_experts_id_fk" FOREIGN KEY ("expert_id") REFERENCES "public"."industry_experts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "expert_mentorship" ADD CONSTRAINT "expert_mentorship_expert_id_industry_experts_id_fk" FOREIGN KEY ("expert_id") REFERENCES "public"."industry_experts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "expert_mentorship" ADD CONSTRAINT "expert_mentorship_mentee_id_users_id_fk" FOREIGN KEY ("mentee_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "expert_qna_sessions" ADD CONSTRAINT "expert_qna_sessions_session_id_expert_sessions_id_fk" FOREIGN KEY ("session_id") REFERENCES "public"."expert_sessions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "expert_qna_sessions" ADD CONSTRAINT "expert_qna_sessions_asked_by_users_id_fk" FOREIGN KEY ("asked_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "expert_sessions" ADD CONSTRAINT "expert_sessions_expert_id_industry_experts_id_fk" FOREIGN KEY ("expert_id") REFERENCES "public"."industry_experts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "industry_experts" ADD CONSTRAINT "industry_experts_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "local_event_attendees" ADD CONSTRAINT "local_event_attendees_event_id_local_events_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."local_events"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "local_event_attendees" ADD CONSTRAINT "local_event_attendees_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "local_events" ADD CONSTRAINT "local_events_community_id_communities_id_fk" FOREIGN KEY ("community_id") REFERENCES "public"."communities"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "local_events" ADD CONSTRAINT "local_events_organizer_id_users_id_fk" FOREIGN KEY ("organizer_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "local_events" ADD CONSTRAINT "local_events_approved_by_users_id_fk" FOREIGN KEY ("approved_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "mentor_badges" ADD CONSTRAINT "mentor_badges_mentor_id_users_id_fk" FOREIGN KEY ("mentor_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "mentor_community_engagement" ADD CONSTRAINT "mentor_community_engagement_mentor_id_users_id_fk" FOREIGN KEY ("mentor_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "mentor_feedback" ADD CONSTRAINT "mentor_feedback_mentor_id_users_id_fk" FOREIGN KEY ("mentor_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "mentor_feedback" ADD CONSTRAINT "mentor_feedback_student_id_users_id_fk" FOREIGN KEY ("student_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "mentor_feedback" ADD CONSTRAINT "mentor_feedback_session_id_mentor_sessions_id_fk" FOREIGN KEY ("session_id") REFERENCES "public"."mentor_sessions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "mentor_profiles" ADD CONSTRAINT "mentor_profiles_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "mentor_resources" ADD CONSTRAINT "mentor_resources_mentor_id_users_id_fk" FOREIGN KEY ("mentor_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "mentor_sessions" ADD CONSTRAINT "mentor_sessions_mentor_id_users_id_fk" FOREIGN KEY ("mentor_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "mentorship_matching" ADD CONSTRAINT "mentorship_matching_mentor_id_users_id_fk" FOREIGN KEY ("mentor_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "mentorship_matching" ADD CONSTRAINT "mentorship_matching_mentee_id_users_id_fk" FOREIGN KEY ("mentee_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "moderation_actions" ADD CONSTRAINT "moderation_actions_community_id_communities_id_fk" FOREIGN KEY ("community_id") REFERENCES "public"."communities"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "moderation_actions" ADD CONSTRAINT "moderation_actions_moderator_id_users_id_fk" FOREIGN KEY ("moderator_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "networking_events" ADD CONSTRAINT "networking_events_organizer_id_users_id_fk" FOREIGN KEY ("organizer_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "networking_events" ADD CONSTRAINT "networking_events_expert_id_industry_experts_id_fk" FOREIGN KEY ("expert_id") REFERENCES "public"."industry_experts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "posts" ADD CONSTRAINT "posts_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_collaborators" ADD CONSTRAINT "project_collaborators_project_id_community_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."community_projects"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_collaborators" ADD CONSTRAINT "project_collaborators_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_collaborators" ADD CONSTRAINT "project_collaborators_invited_by_users_id_fk" FOREIGN KEY ("invited_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_showcase" ADD CONSTRAINT "project_showcase_project_id_community_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."community_projects"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_showcase" ADD CONSTRAINT "project_showcase_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_tasks" ADD CONSTRAINT "project_tasks_project_id_community_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."community_projects"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_tasks" ADD CONSTRAINT "project_tasks_assigned_to_users_id_fk" FOREIGN KEY ("assigned_to") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_tasks" ADD CONSTRAINT "project_tasks_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_updates" ADD CONSTRAINT "project_updates_project_id_community_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."community_projects"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_updates" ADD CONSTRAINT "project_updates_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "quiz_results" ADD CONSTRAINT "quiz_results_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "resumes" ADD CONSTRAINT "resumes_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "role_permissions" ADD CONSTRAINT "role_permissions_role_id_roles_id_fk" FOREIGN KEY ("role_id") REFERENCES "public"."roles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "role_permissions" ADD CONSTRAINT "role_permissions_permission_id_permissions_id_fk" FOREIGN KEY ("permission_id") REFERENCES "public"."permissions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session_registrations" ADD CONSTRAINT "session_registrations_session_id_expert_sessions_id_fk" FOREIGN KEY ("session_id") REFERENCES "public"."expert_sessions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session_registrations" ADD CONSTRAINT "session_registrations_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_achievements" ADD CONSTRAINT "user_achievements_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_achievements" ADD CONSTRAINT "user_achievements_achievement_id_achievements_id_fk" FOREIGN KEY ("achievement_id") REFERENCES "public"."achievements"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_career_assessments" ADD CONSTRAINT "user_career_assessments_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_career_progress" ADD CONSTRAINT "user_career_progress_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_career_progress" ADD CONSTRAINT "user_career_progress_career_path_id_career_paths_id_fk" FOREIGN KEY ("career_path_id") REFERENCES "public"."career_paths"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_daily_bytes" ADD CONSTRAINT "user_daily_bytes_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_daily_bytes" ADD CONSTRAINT "user_daily_bytes_daily_byte_id_daily_bytes_id_fk" FOREIGN KEY ("daily_byte_id") REFERENCES "public"."daily_bytes"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_events" ADD CONSTRAINT "user_events_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_events" ADD CONSTRAINT "user_events_event_id_events_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_projects" ADD CONSTRAINT "user_projects_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_projects" ADD CONSTRAINT "user_projects_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_roles" ADD CONSTRAINT "user_roles_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_roles" ADD CONSTRAINT "user_roles_role_id_roles_id_fk" FOREIGN KEY ("role_id") REFERENCES "public"."roles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_soft_skills" ADD CONSTRAINT "user_soft_skills_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_soft_skills" ADD CONSTRAINT "user_soft_skills_soft_skill_id_soft_skills_id_fk" FOREIGN KEY ("soft_skill_id") REFERENCES "public"."soft_skills"("id") ON DELETE no action ON UPDATE no action;