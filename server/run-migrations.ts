import { addUserRoles, makeUserAdmin } from './migrations/add-user-roles';

// Run all migrations
async function runMigrations() {
  try {
    console.log('Starting database migrations...');
    
    // Add user roles column
    await addUserRoles();
    
    // Make test user an admin
    await makeUserAdmin(1); // Assuming test user has ID 1
    
    console.log('All migrations completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error running migrations:', error);
    process.exit(1);
  }
}

runMigrations();