import { db } from "../db.js";
import { users, userRoles } from "../../shared/schema.js";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

/**
 * Script to create test users for each role
 */
async function createTestUsers() {
  console.log("🧪 Creating test users for different roles...");

  // Define test users for each role
  const testUsers = [
    {
      username: "student_test",
      password: "password123",
      email: "student@test.com",
      name: "Alex Student",
      bio: "Aspiring software developer learning full-stack development",
      roleId: 4 // student role
    },
    {
      username: "mentor_test", 
      password: "password123",
      email: "mentor@test.com",
      name: "Sarah Mentor",
      bio: "Senior Full Stack Developer with 8+ years experience, passionate about mentoring",
      roleId: 3 // mentor role
    },
    {
      username: "admin_test",
      password: "password123", 
      email: "admin@test.com",
      name: "Mike Admin",
      bio: "Platform administrator managing CareerOS operations",
      roleId: 1 // admin role
    },
    {
      username: "moderator_test",
      password: "password123",
      email: "moderator@test.com", 
      name: "Emma Moderator",
      bio: "Community moderator ensuring quality discussions",
      roleId: 2 // moderator role
    }
  ];

  for (const userData of testUsers) {
    try {
      // Check if user already exists
      const existingUser = await db.select()
        .from(users)
        .where(eq(users.username, userData.username))
        .limit(1);

      if (existingUser.length > 0) {
        console.log(`User ${userData.username} already exists, skipping...`);
        continue;
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(userData.password, 10);

      // Create user
      const [newUser] = await db.insert(users).values({
        username: userData.username,
        password: hashedPassword,
        email: userData.email,
        name: userData.name,
        bio: userData.bio,
        createdAt: new Date()
      }).returning();

      console.log(`Created user: ${newUser.username} (ID: ${newUser.id})`);

      // Assign role to user
      await db.insert(userRoles).values({
        userId: newUser.id,
        roleId: userData.roleId,
        createdAt: new Date()
      });

      console.log(`Assigned role ${userData.roleId} to user ${newUser.username}`);

    } catch (error) {
      console.error(`Error creating user ${userData.username}:`, error);
    }
  }

  console.log("✅ Test users creation complete!");
  console.log("\n📋 Test User Credentials:");
  console.log("========================");
  console.log("👨‍🎓 STUDENT:");
  console.log("   Username: student_test");
  console.log("   Password: password123");
  console.log("   Dashboard: Student Dashboard");
  console.log("");
  console.log("👨‍🏫 MENTOR:");
  console.log("   Username: mentor_test");
  console.log("   Password: password123"); 
  console.log("   Dashboard: Mentor Dashboard");
  console.log("");
  console.log("👨‍💼 ADMIN:");
  console.log("   Username: admin_test");
  console.log("   Password: password123");
  console.log("   Dashboard: Admin Dashboard");
  console.log("");
  console.log("🛡️ MODERATOR:");
  console.log("   Username: moderator_test");
  console.log("   Password: password123");
  console.log("   Dashboard: Admin Dashboard (shared with admin)");
}

// Run the script
createTestUsers()
  .then(() => {
    console.log("Script completed successfully");
    process.exit(0);
  })
  .catch(error => {
    console.error("Error running script:", error);
    process.exit(1);
  });