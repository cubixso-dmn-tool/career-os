-- Create community_feature_cards table for admin-managed community content
CREATE TABLE IF NOT EXISTS community_feature_cards (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  image_url TEXT,
  redirect_url TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('communities', 'projects', 'events', 'competitions')),
  is_active BOOLEAN NOT NULL DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_by INTEGER NOT NULL REFERENCES users(id),
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_community_feature_cards_category ON community_feature_cards(category);
CREATE INDEX IF NOT EXISTS idx_community_feature_cards_active ON community_feature_cards(is_active);
CREATE INDEX IF NOT EXISTS idx_community_feature_cards_display_order ON community_feature_cards(display_order);

-- Insert some sample data for testing
INSERT INTO community_feature_cards (title, description, redirect_url, category, created_by) VALUES
('Tech Communities Discord', 'Join our vibrant Discord community for tech discussions, networking, and career advice', 'https://discord.gg/techcommunity', 'communities', 1),
('Open Source Projects', 'Contribute to open source projects and build your portfolio with real-world experience', 'https://github.com/explore', 'projects', 1),
('Tech Meetups Mumbai', 'Attend local tech meetups and networking events in Mumbai', 'https://www.meetup.com/tech-mumbai', 'events', 1),
('HackerRank Challenges', 'Participate in coding competitions and algorithmic challenges', 'https://www.hackerrank.com/contests', 'competitions', 1);