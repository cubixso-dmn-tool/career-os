-- Migration to update resumes table schema for complete data persistence
-- Run this migration to update the existing resumes table structure

BEGIN;

-- Create a backup of existing data (optional)
CREATE TABLE IF NOT EXISTS resumes_backup AS SELECT * FROM resumes;

-- Drop the old columns that are no longer needed
ALTER TABLE resumes DROP COLUMN IF EXISTS education;
ALTER TABLE resumes DROP COLUMN IF EXISTS experience;
ALTER TABLE resumes DROP COLUMN IF EXISTS skills;
ALTER TABLE resumes DROP COLUMN IF EXISTS projects;

-- Add new columns for the updated schema
ALTER TABLE resumes ADD COLUMN IF NOT EXISTS name TEXT;
ALTER TABLE resumes ADD COLUMN IF NOT EXISTS data JSONB NOT NULL DEFAULT '{}';
ALTER TABLE resumes ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT NOW() NOT NULL;

-- Update the updated_at column to have a default if it doesn't already
ALTER TABLE resumes ALTER COLUMN updated_at SET DEFAULT NOW();

-- If there are existing records, we might need to migrate them
-- For now, we'll assume starting fresh or manual migration is acceptable

COMMIT;