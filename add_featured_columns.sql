-- Safely add the two new columns to industry_experts table
ALTER TABLE industry_experts 
ADD COLUMN IF NOT EXISTS is_featured boolean DEFAULT false;

ALTER TABLE industry_experts 
ADD COLUMN IF NOT EXISTS featured_order integer DEFAULT 0;