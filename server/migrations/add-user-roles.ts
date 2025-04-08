import { db } from '../db';
import { sql } from 'drizzle-orm';

// Add role and isVerified columns to users table
export async function addUserRoles() {
  try {
    // Check if columns already exist
    const checkColumns = await db.execute(sql`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'users' 
      AND column_name IN ('role', 'is_verified')
    `);
    
    const existingColumns = checkColumns.rows.map(row => row.column_name);
    
    if (!existingColumns.includes('role')) {
      console.log('Adding role column to users table...');
      await db.execute(sql`
        ALTER TABLE users
        ADD COLUMN role text NOT NULL DEFAULT 'student'
      `);
    }
    
    if (!existingColumns.includes('is_verified')) {
      console.log('Adding is_verified column to users table...');
      await db.execute(sql`
        ALTER TABLE users
        ADD COLUMN is_verified boolean NOT NULL DEFAULT false
      `);
    }
    
    console.log('User role migration completed successfully');
  } catch (error) {
    console.error('Error executing user role migration:', error);
    throw error;
  }
}

// Make admin user
export async function makeUserAdmin(userId: number) {
  try {
    await db.execute(sql`
      UPDATE users
      SET role = 'admin', is_verified = true
      WHERE id = ${userId}
    `);
    console.log(`User ${userId} updated to admin and verified`);
  } catch (error) {
    console.error(`Error making user ${userId} an admin:`, error);
    throw error;
  }
}

// Verify a user
export async function verifyUser(userId: number) {
  try {
    await db.execute(sql`
      UPDATE users
      SET is_verified = true
      WHERE id = ${userId}
    `);
    console.log(`User ${userId} verified`);
  } catch (error) {
    console.error(`Error verifying user ${userId}:`, error);
    throw error;
  }
}

// Make a user a community founder
export async function makeCommunityFounder(userId: number) {
  try {
    await db.execute(sql`
      UPDATE users
      SET role = 'community_founder', is_verified = true
      WHERE id = ${userId}
    `);
    console.log(`User ${userId} updated to community founder and verified`);
  } catch (error) {
    console.error(`Error making user ${userId} a community founder:`, error);
    throw error;
  }
}