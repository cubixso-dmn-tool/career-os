// Run with: node --loader ts-node/esm push-schema.js
import { db } from './server/db.js';
import { pool } from './server/db.js';

console.log('Pushing schema to database...');

async function main() {
  try {
    // We'll create all tables directly
    
    // Push our schema to the database
    await db.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        name TEXT NOT NULL,
        bio TEXT,
        avatar TEXT,
        created_at TIMESTAMP NOT NULL DEFAULT NOW()
      );
      
      CREATE TABLE IF NOT EXISTS roles (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL UNIQUE,
        description TEXT,
        created_at TIMESTAMP NOT NULL DEFAULT NOW()
      );
      
      CREATE TABLE IF NOT EXISTS permissions (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL UNIQUE,
        description TEXT,
        created_at TIMESTAMP NOT NULL DEFAULT NOW()
      );
      
      CREATE TABLE IF NOT EXISTS role_permissions (
        id SERIAL PRIMARY KEY,
        role_id INTEGER NOT NULL REFERENCES roles(id),
        permission_id INTEGER NOT NULL REFERENCES permissions(id),
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        UNIQUE(role_id, permission_id)
      );
      
      CREATE TABLE IF NOT EXISTS user_roles (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id),
        role_id INTEGER NOT NULL REFERENCES roles(id),
        assigned_at TIMESTAMP NOT NULL DEFAULT NOW(),
        UNIQUE(user_id, role_id)
      );
      
      CREATE TABLE IF NOT EXISTS communities (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT,
        logo TEXT,
        banner TEXT,
        is_private BOOLEAN NOT NULL DEFAULT FALSE,
        created_at TIMESTAMP NOT NULL DEFAULT NOW()
      );
      
      CREATE TABLE IF NOT EXISTS community_members (
        id SERIAL PRIMARY KEY,
        community_id INTEGER NOT NULL REFERENCES communities(id),
        user_id INTEGER NOT NULL REFERENCES users(id),
        role_id INTEGER REFERENCES roles(id),
        role TEXT NOT NULL DEFAULT 'member',
        joined_at TIMESTAMP NOT NULL DEFAULT NOW(),
        UNIQUE(community_id, user_id)
      );
      
      CREATE TABLE IF NOT EXISTS community_posts (
        id SERIAL PRIMARY KEY,
        community_id INTEGER NOT NULL REFERENCES communities(id),
        user_id INTEGER NOT NULL REFERENCES users(id),
        title TEXT NOT NULL,
        content TEXT NOT NULL,
        likes INTEGER NOT NULL DEFAULT 0,
        replies INTEGER NOT NULL DEFAULT 0,
        is_pinned BOOLEAN NOT NULL DEFAULT FALSE,
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP
      );
      
      CREATE TABLE IF NOT EXISTS community_post_comments (
        id SERIAL PRIMARY KEY,
        post_id INTEGER NOT NULL REFERENCES community_posts(id),
        user_id INTEGER NOT NULL REFERENCES users(id),
        content TEXT NOT NULL,
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP
      );
      
      CREATE TABLE IF NOT EXISTS moderation_actions (
        id SERIAL PRIMARY KEY,
        community_id INTEGER NOT NULL REFERENCES communities(id),
        target_type TEXT NOT NULL,
        target_id INTEGER NOT NULL,
        action TEXT NOT NULL,
        reason TEXT,
        moderator_id INTEGER NOT NULL REFERENCES users(id),
        created_at TIMESTAMP NOT NULL DEFAULT NOW()
      );
    `);
    
    console.log('Schema push completed successfully');
  } catch (error) {
    console.error('Error pushing schema:', error);
  } finally {
    process.exit(0);
  }
}

main();