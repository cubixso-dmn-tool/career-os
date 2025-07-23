import { db } from '../db.js';
import { sql } from 'drizzle-orm';

async function createMissingTables() {
  try {
    console.log('🚀 Creating missing tables...');
    
    // Create industry_experts table
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS "industry_experts" (
        "id" SERIAL PRIMARY KEY,
        "user_id" INTEGER REFERENCES "users"("id"),
        "name" TEXT NOT NULL,
        "title" TEXT NOT NULL,
        "company" TEXT NOT NULL,
        "industry" TEXT NOT NULL,
        "specializations" TEXT[] NOT NULL,
        "experience_years" INTEGER NOT NULL,
        "bio" TEXT NOT NULL,
        "avatar" TEXT,
        "linkedin_url" TEXT,
        "expertise" TEXT[] DEFAULT '{}',
        "rating" NUMERIC(3,2) DEFAULT 0.0,
        "total_sessions" INTEGER DEFAULT 0,
        "is_active" BOOLEAN DEFAULT true,
        "joined_at" TIMESTAMP DEFAULT NOW()
      );
    `);
    console.log('✅ Created industry_experts table');

    // Create expert_sessions table if it doesn't exist
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS "expert_sessions" (
        "id" SERIAL PRIMARY KEY,
        "expert_id" INTEGER NOT NULL REFERENCES "industry_experts"("id"),
        "title" TEXT NOT NULL,
        "description" TEXT NOT NULL,
        "session_type" TEXT NOT NULL,
        "category" TEXT NOT NULL,
        "scheduled_at" TIMESTAMP NOT NULL,
        "duration_minutes" INTEGER NOT NULL,
        "max_attendees" INTEGER DEFAULT 100,
        "current_attendees" INTEGER DEFAULT 0,
        "meeting_link" TEXT,
        "recording_url" TEXT,
        "materials" TEXT[],
        "prerequisites" TEXT[],
        "tags" TEXT[],
        "is_free" BOOLEAN DEFAULT true,
        "price" NUMERIC(10,2) DEFAULT 0,
        "status" TEXT DEFAULT 'scheduled',
        "feedback_summary" TEXT,
        "average_rating" NUMERIC(3,2),
        "total_ratings" INTEGER DEFAULT 0,
        "created_at" TIMESTAMP DEFAULT NOW(),
        "updated_at" TIMESTAMP DEFAULT NOW()
      );
    `);
    console.log('✅ Created expert_sessions table');

    // Create session_registrations table if it doesn't exist
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS "session_registrations" (
        "id" SERIAL PRIMARY KEY,
        "session_id" INTEGER NOT NULL REFERENCES "expert_sessions"("id"),
        "user_id" INTEGER NOT NULL REFERENCES "users"("id"),
        "registered_at" TIMESTAMP DEFAULT NOW(),
        "attended" BOOLEAN DEFAULT false,
        "feedback" TEXT,
        "rating" INTEGER CHECK ("rating" >= 1 AND "rating" <= 5),
        "questions" TEXT[],
        "notes" TEXT
      );
    `);
    console.log('✅ Created session_registrations table');

    // Create career_options table if it doesn't exist
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS "career_options" (
        "id" SERIAL PRIMARY KEY,
        "title" TEXT NOT NULL,
        "category" TEXT NOT NULL,
        "description" TEXT NOT NULL,
        "salary_min" INTEGER,
        "salary_max" INTEGER,
        "difficulty_level" TEXT,
        "required_skills" TEXT[] DEFAULT '{}',
        "growth_outlook" TEXT,
        "is_active" BOOLEAN DEFAULT true,
        "created_at" TIMESTAMP DEFAULT NOW(),
        "updated_at" TIMESTAMP DEFAULT NOW()
      );
    `);
    console.log('✅ Created career_options table');

    // Create career_paths table if it doesn't exist
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS "career_paths" (
        "id" SERIAL PRIMARY KEY,
        "title" TEXT NOT NULL,
        "category" TEXT NOT NULL,
        "description" TEXT,
        "overview" TEXT,
        "day_in_life" TEXT,
        "salary_expectations" TEXT,
        "growth_outlook" TEXT,
        "is_active" BOOLEAN DEFAULT true,
        "created_at" TIMESTAMP DEFAULT NOW()
      );
    `);
    console.log('✅ Created career_paths table');

    // Create networking_events table if it doesn't exist
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS "networking_events" (
        "id" SERIAL PRIMARY KEY,
        "title" TEXT NOT NULL,
        "description" TEXT NOT NULL,
        "event_type" TEXT NOT NULL,
        "industry" TEXT,
        "target_audience" TEXT[],
        "organizer" TEXT NOT NULL,
        "organizer_id" INTEGER REFERENCES "users"("id"),
        "expert_id" INTEGER REFERENCES "industry_experts"("id"),
        "scheduled_at" TIMESTAMP NOT NULL,
        "end_time" TIMESTAMP NOT NULL,
        "timezone" TEXT DEFAULT 'Asia/Kolkata',
        "location" TEXT,
        "meeting_link" TEXT,
        "max_attendees" INTEGER,
        "current_attendees" INTEGER DEFAULT 0,
        "is_online" BOOLEAN DEFAULT true,
        "is_free" BOOLEAN DEFAULT true,
        "registration_deadline" TIMESTAMP,
        "tags" TEXT[],
        "agenda" TEXT[],
        "speakers" TEXT[],
        "status" TEXT DEFAULT 'upcoming',
        "feedback_summary" TEXT,
        "created_at" TIMESTAMP DEFAULT NOW(),
        "updated_at" TIMESTAMP DEFAULT NOW()
      );
    `);
    console.log('✅ Created networking_events table');

    // Create career_success_stories table if it doesn't exist
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS "career_success_stories" (
        "id" SERIAL PRIMARY KEY,
        "author_id" INTEGER REFERENCES "users"("id"),
        "expert_id" INTEGER REFERENCES "industry_experts"("id"),
        "title" TEXT NOT NULL,
        "story" TEXT NOT NULL,
        "career_path" TEXT NOT NULL,
        "industry_from" TEXT,
        "industry_to" TEXT NOT NULL,
        "timeframe" TEXT,
        "key_learnings" TEXT[],
        "challenges" TEXT[],
        "advice" TEXT[],
        "salary_growth" TEXT,
        "is_public" BOOLEAN DEFAULT false,
        "is_featured" BOOLEAN DEFAULT false,
        "views" INTEGER DEFAULT 0,
        "likes" INTEGER DEFAULT 0,
        "created_at" TIMESTAMP DEFAULT NOW()
      );
    `);
    console.log('✅ Created career_success_stories table');

    console.log('🎉 All missing tables created successfully!');

    // Test the industry_experts table by selecting from it
    const result = await db.execute(sql`SELECT COUNT(*) FROM industry_experts`);
    console.log('📊 industry_experts table is working:', result.rows[0]);

  } catch (error) {
    console.error('❌ Error creating tables:', error);
  } finally {
    process.exit(0);
  }
}

createMissingTables();