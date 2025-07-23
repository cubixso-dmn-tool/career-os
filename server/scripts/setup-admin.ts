import { db } from '../db.js';
import { users, roles, permissions, userRoles, rolePermissions } from '../../shared/schema.js';
import { eq, and } from 'drizzle-orm';

async function setupAdmin() {
  try {
    console.log('🚀 Setting up RBAC system...');
    
    // 1. First, ensure we have all necessary roles
    const existingRoles = await db.select().from(roles);
    console.log('Existing roles:', existingRoles.map(r => r.name));

    let adminRole = existingRoles.find(r => r.name === 'admin');
    
    // Create admin role if it doesn't exist
    if (!adminRole) {
      console.log('Creating admin role...');
      const [newAdminRole] = await db
        .insert(roles)
        .values({
          name: 'admin',
          description: 'Administrator with full system access'
        })
        .returning();
      adminRole = newAdminRole;
      console.log('✅ Admin role created');
    }

    // 2. Ensure we have all necessary permissions
    const requiredPermissions = [
      { name: 'create:experts', description: 'Create expert profiles' },
      { name: 'read:experts', description: 'Read expert profiles' },
      { name: 'update:experts', description: 'Update expert profiles' },
      { name: 'delete:experts', description: 'Delete expert profiles' },
      { name: 'create:careers', description: 'Create career options' },
      { name: 'read:careers', description: 'Read career options' },
      { name: 'update:careers', description: 'Update career options' },
      { name: 'delete:careers', description: 'Delete career options' },
      { name: 'create:sessions', description: 'Create sessions' },
      { name: 'read:sessions', description: 'Read sessions' },
      { name: 'update:sessions', description: 'Update sessions' },
      { name: 'delete:sessions', description: 'Delete sessions' },
      { name: 'create:events', description: 'Create events' },
      { name: 'read:events', description: 'Read events' },
      { name: 'update:events', description: 'Update events' },
      { name: 'delete:events', description: 'Delete events' },
      { name: 'read:analytics', description: 'Read analytics data' },
      { name: 'read:users', description: 'Read user data' },
      { name: 'update:users', description: 'Update user data' },
      { name: 'read:stories', description: 'Read success stories' },
      { name: 'update:stories', description: 'Update success stories' },
      { name: 'community:moderate', description: 'Moderate community content' },
      { name: 'read:system', description: 'Read system logs and data' }
    ];

    const existingPermissions = await db.select().from(permissions);
    console.log('Existing permissions:', existingPermissions.length);

    for (const perm of requiredPermissions) {
      const exists = existingPermissions.find(p => p.name === perm.name);
      if (!exists) {
        console.log(`Creating permission: ${perm.name}`);
        await db.insert(permissions).values(perm);
      }
    }

    // Get all permissions for admin role
    const allPermissions = await db.select().from(permissions);
    
    // 3. Assign all permissions to admin role
    const existingRolePermissions = await db
      .select()
      .from(rolePermissions)
      .where(eq(rolePermissions.roleId, adminRole.id));

    for (const permission of allPermissions) {
      const exists = existingRolePermissions.find(rp => rp.permissionId === permission.id);
      if (!exists) {
        await db.insert(rolePermissions).values({
          roleId: adminRole.id,
          permissionId: permission.id
        });
        console.log(`✅ Assigned ${permission.name} to admin role`);
      }
    }

    // 4. Find the first user and assign admin role (assuming this is the main user)
    const firstUser = await db.select().from(users).limit(1);
    
    if (firstUser.length === 0) {
      console.log('❌ No users found in database. Create a user first!');
      return;
    }

    const user = firstUser[0];
    console.log(`Found user: ${user.username} (${user.email})`);

    // Check if user already has admin role
    const existingUserRole = await db
      .select()
      .from(userRoles)
      .where(and(
        eq(userRoles.userId, user.id),
        eq(userRoles.roleId, adminRole.id)
      ));

    if (existingUserRole.length === 0) {
      await db.insert(userRoles).values({
        userId: user.id,
        roleId: adminRole.id
      });
      console.log(`✅ Assigned admin role to ${user.username}`);
    } else {
      console.log(`✅ User ${user.username} already has admin role`);
    }

    console.log('🎉 Admin setup complete!');
    
    // Show summary
    console.log('\n📊 Summary:');
    console.log(`👤 Admin user: ${user.username} (${user.email})`);
    console.log(`🔑 Admin role ID: ${adminRole.id}`);
    console.log(`📝 Total permissions: ${allPermissions.length}`);

  } catch (error) {
    console.error('❌ Error setting up admin:', error);
  } finally {
    process.exit(0);
  }
}

setupAdmin();