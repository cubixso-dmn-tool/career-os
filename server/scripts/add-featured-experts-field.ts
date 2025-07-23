import { db } from '../db.js';
import { sql } from 'drizzle-orm';

async function addFeaturedExpertsField() {
  try {
    console.log('🚀 Adding isFeatured field to industry_experts table...');
    
    // Add isFeatured column
    await db.execute(sql`
      ALTER TABLE industry_experts 
      ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT false NOT NULL;
    `);
    console.log('✅ Added is_featured column');

    // Add featured_order column for sorting featured experts
    await db.execute(sql`
      ALTER TABLE industry_experts 
      ADD COLUMN IF NOT EXISTS featured_order INTEGER DEFAULT NULL;
    `);
    console.log('✅ Added featured_order column');

    // Create index for faster queries
    await db.execute(sql`
      CREATE INDEX IF NOT EXISTS idx_industry_experts_featured 
      ON industry_experts(is_featured, featured_order);
    `);
    console.log('✅ Created index for featured experts');

    console.log('🎉 Featured experts functionality added successfully!');

  } catch (error) {
    console.error('❌ Error adding featured experts field:', error);
  } finally {
    process.exit(0);
  }
}

addFeaturedExpertsField();