import { db } from "../db";
import { roles, userRoles, users } from "../../shared/schema.js";
import { eq, and } from "drizzle-orm";

/**
 * Script to assign admin role to a test user
 */
async function assignAdminRole() {
  console.log("🔑 Assigning admin role to test user...");

  // Get the test user
  const [testUser] = await db
    .select()
    .from(users)
    .where(eq(users.username, "testuser"));

  if (!testUser) {
    console.error("Test user not found");
    return;
  }

  console.log(`Found test user: ${testUser.username} (ID: ${testUser.id})`);

  // Get the admin role
  const [adminRole] = await db
    .select()
    .from(roles)
    .where(eq(roles.name, "admin"));

  if (!adminRole) {
    console.error("Admin role not found");
    return;
  }

  console.log(`Found admin role: ${adminRole.name} (ID: ${adminRole.id})`);

  // Check if the user already has the admin role
  const existingRole = await db
    .select()
    .from(userRoles)
    .where(
      and(
        eq(userRoles.userId, testUser.id),
        eq(userRoles.roleId, adminRole.id)
      )
    );

  if (existingRole.length > 0) {
    console.log("User already has admin role");
    return;
  }

  // Assign admin role to the user
  const [userRole] = await db
    .insert(userRoles)
    .values({
      userId: testUser.id,
      roleId: adminRole.id,
      assignedAt: new Date()
    })
    .returning();

  console.log(`✅ Admin role assigned to test user: ${testUser.username}`);
  console.log(userRole);
}

// Run the script
assignAdminRole()
  .then(() => {
    console.log("Script completed successfully");
    process.exit(0);
  })
  .catch(error => {
    console.error("Error running script:", error);
    process.exit(1);
  });