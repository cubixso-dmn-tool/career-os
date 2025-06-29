import { db } from "../db";
import { sql } from "drizzle-orm";

export async function createPerformanceIndexes() {
  console.log("🚀 Creating performance indexes...");

  const indexes = [
    // User-related indexes
    `CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)`,
    `CREATE INDEX IF NOT EXISTS idx_users_username ON users(username)`,
    `CREATE INDEX IF NOT EXISTS idx_users_created_at ON users(created_at)`,

    // Enrollment indexes for fast course queries
    `CREATE INDEX IF NOT EXISTS idx_enrollments_user_id ON enrollments(user_id)`,
    `CREATE INDEX IF NOT EXISTS idx_enrollments_course_id ON enrollments(course_id)`,
    `CREATE INDEX IF NOT EXISTS idx_enrollments_user_course ON enrollments(user_id, course_id)`,
    `CREATE INDEX IF NOT EXISTS idx_enrollments_completed ON enrollments(is_completed)`,
    `CREATE INDEX IF NOT EXISTS idx_enrollments_enrolled_at ON enrollments(enrolled_at)`,

    // Course performance indexes
    `CREATE INDEX IF NOT EXISTS idx_courses_category ON courses(category)`,
    `CREATE INDEX IF NOT EXISTS idx_courses_featured ON courses(is_featured)`,
    `CREATE INDEX IF NOT EXISTS idx_courses_free ON courses(is_free)`,
    `CREATE INDEX IF NOT EXISTS idx_courses_rating ON courses(rating)`,

    // Project tracking indexes
    `CREATE INDEX IF NOT EXISTS idx_user_projects_user_id ON user_projects(user_id)`,
    `CREATE INDEX IF NOT EXISTS idx_user_projects_project_id ON user_projects(project_id)`,
    `CREATE INDEX IF NOT EXISTS idx_user_projects_completed ON user_projects(is_completed)`,

    // Quiz and assessment indexes
    `CREATE INDEX IF NOT EXISTS idx_quiz_results_user_id ON quiz_results(user_id)`,
    `CREATE INDEX IF NOT EXISTS idx_quiz_results_completed_at ON quiz_results(completed_at)`,

    // Events and activities indexes
    `CREATE INDEX IF NOT EXISTS idx_events_date ON events(date)`,
    `CREATE INDEX IF NOT EXISTS idx_user_events_user_id ON user_events(user_id)`,
    `CREATE INDEX IF NOT EXISTS idx_user_events_event_id ON user_events(event_id)`,

    // RBAC performance indexes
    `CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON user_roles(user_id)`,
    `CREATE INDEX IF NOT EXISTS idx_user_roles_role_id ON user_roles(role_id)`,
    `CREATE INDEX IF NOT EXISTS idx_role_permissions_role_id ON role_permissions(role_id)`,
    `CREATE INDEX IF NOT EXISTS idx_role_permissions_permission_id ON role_permissions(permission_id)`,

    // Community and social indexes
    `CREATE INDEX IF NOT EXISTS idx_posts_created_at ON posts(created_at)`,
    `CREATE INDEX IF NOT EXISTS idx_comments_post_id ON comments(post_id)`,
    `CREATE INDEX IF NOT EXISTS idx_community_members_user_id ON community_members(user_id)`,
    `CREATE INDEX IF NOT EXISTS idx_community_members_community_id ON community_members(community_id)`,

    // Daily bytes and engagement indexes
    `CREATE INDEX IF NOT EXISTS idx_user_daily_bytes_user_id ON user_daily_bytes(user_id)`,
    `CREATE INDEX IF NOT EXISTS idx_user_daily_bytes_completed_at ON user_daily_bytes(completed_at)`,

    // Composite indexes for complex queries
    `CREATE INDEX IF NOT EXISTS idx_enrollments_user_progress ON enrollments(user_id, progress, is_completed)`,
    `CREATE INDEX IF NOT EXISTS idx_courses_category_rating ON courses(category, rating)`,
    `CREATE INDEX IF NOT EXISTS idx_user_projects_user_progress ON user_projects(user_id, progress, is_completed)`
  ];

  try {
    for (const index of indexes) {
      await db.execute(sql.raw(index));
    }
    console.log("✅ All performance indexes created successfully");
  } catch (error) {
    console.error("❌ Error creating indexes:", error);
    throw error;
  }
}

export async function analyzeQueryPerformance() {
  console.log("📊 Analyzing query performance...");

  const queries = [
    {
      name: "User Dashboard Query",
      query: `EXPLAIN ANALYZE SELECT * FROM enrollments WHERE user_id = 1`
    },
    {
      name: "Course Search Query", 
      query: `EXPLAIN ANALYZE SELECT * FROM courses WHERE category = 'Programming' AND is_free = true`
    },
    {
      name: "Analytics Query",
      query: `EXPLAIN ANALYZE SELECT COUNT(*) FROM users WHERE created_at >= NOW() - INTERVAL '24 hours'`
    }
  ];

  try {
    for (const { name, query } of queries) {
      console.log(`\n📈 ${name}:`);
      const result = await db.execute(sql.raw(query));
      console.log(result);
    }
  } catch (error) {
    console.error("❌ Error analyzing performance:", error);
  }
}

// Connection pool optimization
export function optimizeConnectionPool() {
  console.log("🔧 Connection pool already optimized via Neon serverless");
  // Neon handles connection pooling automatically
  // For production, consider additional connection pool settings
}

// Run optimization if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  createPerformanceIndexes()
    .then(() => analyzeQueryPerformance())
    .then(() => optimizeConnectionPool())
    .then(() => process.exit(0))
    .catch((error) => {
      console.error("Failed to optimize database:", error);
      process.exit(1);
    });
}