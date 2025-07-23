// Add a test expert to check the functionality
import dotenv from 'dotenv';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { industryExperts } from '../../shared/schema.js';
import { eq } from 'drizzle-orm';

// Load environment variables
dotenv.config();

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error('DATABASE_URL must be set. Did you forget to provision a database?');
}

const client = postgres(connectionString);
const db = drizzle(client);

async function addTestExpert() {
  try {
    console.log('🚀 Adding test expert to database...');
    
    const testExpert = {
      name: 'John Doe',
      title: 'Senior Software Engineer',
      company: 'TechCorp',
      industry: 'Technology',
      specializations: ['Software Development', 'System Design'],
      experience: 8,
      bio: 'Experienced software engineer with expertise in full-stack development and system architecture.',
      expertise: ['JavaScript', 'React', 'Node.js', 'System Design'],
      rating: 90,
      totalSessions: 15,
      isActive: true
    };

    const result = await db.insert(industryExperts).values(testExpert).returning();
    console.log('✅ Test expert added:', result[0]);
    
    // Now update this expert to be featured
    await db.update(industryExperts)
      .set({ 
        is_featured: true, 
        featured_order: 1 
      })
      .where(eq(industryExperts.id, result[0].id));
    
    console.log('✅ Expert marked as featured');
    console.log('🎉 Test expert setup completed successfully!');
    
  } catch (error) {
    console.error('❌ Error adding test expert:', error);
  } finally {
    await client.end();
    process.exit(0);
  }
}

addTestExpert();