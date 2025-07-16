import { db } from '../db';
import { userRoles, users, roles } from '../../shared/schema.js';
import { eq } from 'drizzle-orm';

async function assignTestRoles() {
  try {
    console.log('Starting role assignment for test users...');

    // Get role IDs
    const adminRole = await db.query.roles.findFirst({
      where: eq(roles.name, 'admin')
    });
    
    const moderatorRole = await db.query.roles.findFirst({
      where: eq(roles.name, 'moderator')
    });
    
    const mentorRole = await db.query.roles.findFirst({
      where: eq(roles.name, 'mentor')
    });
    
    const studentRole = await db.query.roles.findFirst({
      where: eq(roles.name, 'student')
    });

    if (!adminRole || !moderatorRole || !mentorRole || !studentRole) {
      console.error('Required roles not found in database. Please run populate-rbac.ts script first.');
      return;
    }

    // Get users
    const testAdmin = await db.query.users.findFirst({
      where: eq(users.username, 'testuser')
    });
    
    const modUser = await db.query.users.findFirst({
      where: eq(users.username, 'moduser')
    });
    
    const mentorUser = await db.query.users.findFirst({
      where: eq(users.username, 'mentoruser')
    });
    
    const studentUser = await db.query.users.findFirst({
      where: eq(users.username, 'studentuser')
    });

    if (!testAdmin) {
      console.error('Admin user (testuser) not found.');
    } else {
      // Assign Admin role to testuser
      const existingAdminAssignment = await db.query.userRoles.findFirst({
        where: (userRole) => 
          eq(userRole.userId, testAdmin.id) && eq(userRole.roleId, adminRole.id)
      });

      if (!existingAdminAssignment) {
        await db.insert(userRoles).values({
          userId: testAdmin.id,
          roleId: adminRole.id
        });
        console.log(`Admin role assigned to testuser (ID: ${testAdmin.id})`);
      } else {
        console.log(`Admin role already assigned to testuser (ID: ${testAdmin.id})`);
      }
    }

    if (!modUser) {
      console.error('Moderator user (moduser) not found.');
    } else {
      // Assign Moderator role to moduser
      const existingModAssignment = await db.query.userRoles.findFirst({
        where: (userRole) => 
          eq(userRole.userId, modUser.id) && eq(userRole.roleId, moderatorRole.id)
      });

      if (!existingModAssignment) {
        await db.insert(userRoles).values({
          userId: modUser.id,
          roleId: moderatorRole.id
        });
        console.log(`Moderator role assigned to moduser (ID: ${modUser.id})`);
      } else {
        console.log(`Moderator role already assigned to moduser (ID: ${modUser.id})`);
      }
    }

    if (!mentorUser) {
      console.error('Mentor user (mentoruser) not found.');
    } else {
      // Assign Mentor role to mentoruser
      const existingMentorAssignment = await db.query.userRoles.findFirst({
        where: (userRole) => 
          eq(userRole.userId, mentorUser.id) && eq(userRole.roleId, mentorRole.id)
      });

      if (!existingMentorAssignment) {
        await db.insert(userRoles).values({
          userId: mentorUser.id,
          roleId: mentorRole.id
        });
        console.log(`Mentor role assigned to mentoruser (ID: ${mentorUser.id})`);
      } else {
        console.log(`Mentor role already assigned to mentoruser (ID: ${mentorUser.id})`);
      }
    }

    if (!studentUser) {
      console.error('Student user (studentuser) not found.');
    } else {
      // Assign Student role to studentuser
      const existingStudentAssignment = await db.query.userRoles.findFirst({
        where: (userRole) => 
          eq(userRole.userId, studentUser.id) && eq(userRole.roleId, studentRole.id)
      });

      if (!existingStudentAssignment) {
        await db.insert(userRoles).values({
          userId: studentUser.id,
          roleId: studentRole.id
        });
        console.log(`Student role assigned to studentuser (ID: ${studentUser.id})`);
      } else {
        console.log(`Student role already assigned to studentuser (ID: ${studentUser.id})`);
      }
    }

    console.log('Role assignment for test users completed successfully.');
  } catch (error) {
    console.error('Error assigning roles to test users:', error);
  } finally {
    process.exit(0);
  }
}

assignTestRoles();