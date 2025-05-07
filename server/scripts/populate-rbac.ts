import { db } from "../db";
import { roles, permissions, rolePermissions } from "@shared/schema";
import { eq, and } from "drizzle-orm";

/**
 * Script to populate default roles and permissions for RBAC
 */
async function populateRBAC() {
  console.log("🔑 Populating RBAC data...");

  // Create default roles
  const roleData = [
    { name: "admin", description: "Administrator with full access" },
    { name: "moderator", description: "Community moderator with content management permissions" },
    { name: "mentor", description: "Mentor with special teaching and content creation permissions" },
    { name: "student", description: "Regular student user" }
  ];

  console.log("Creating roles...");
  for (const role of roleData) {
    const existing = await db.select().from(roles).where(eq(roles.name, role.name));
    
    if (existing.length === 0) {
      const [newRole] = await db.insert(roles).values({
        name: role.name,
        description: role.description,
        createdAt: new Date()
      }).returning();
      
      console.log(`Created role: ${newRole.name} (ID: ${newRole.id})`);
    } else {
      console.log(`Role already exists: ${role.name}`);
    }
  }

  // Create permissions
  const permissionData = [
    // Content permissions
    { name: "content:create", description: "Create content" },
    { name: "content:edit", description: "Edit content" },
    { name: "content:delete", description: "Delete content" },
    { name: "content:approve", description: "Approve content" },
    
    // Community permissions
    { name: "community:moderate", description: "Moderate community content" },
    { name: "community:create", description: "Create communities" },
    { name: "community:manage", description: "Manage community settings" },
    
    // User permissions
    { name: "user:view", description: "View user profiles" },
    { name: "user:edit", description: "Edit user profiles" },
    { name: "user:manage", description: "Manage users (ban, suspend)" },
    
    // Admin permissions
    { name: "admin:settings", description: "Access admin settings" },
    { name: "admin:roles", description: "Manage roles and permissions" }
  ];

  console.log("Creating permissions...");
  for (const perm of permissionData) {
    const existing = await db.select().from(permissions).where(eq(permissions.name, perm.name));
    
    if (existing.length === 0) {
      const [newPerm] = await db.insert(permissions).values({
        name: perm.name,
        description: perm.description,
        createdAt: new Date()
      }).returning();
      
      console.log(`Created permission: ${newPerm.name} (ID: ${newPerm.id})`);
    } else {
      console.log(`Permission already exists: ${perm.name}`);
    }
  }

  // Map roles to permissions
  console.log("Assigning permissions to roles...");
  
  // Get all roles and permissions
  const allRoles = await db.select().from(roles);
  const allPermissions = await db.select().from(permissions);
  
  // Create a map of role name to ID
  const roleMap = new Map();
  allRoles.forEach(role => roleMap.set(role.name, role.id));
  
  // Create a map of permission name to ID
  const permMap = new Map();
  allPermissions.forEach(perm => permMap.set(perm.name, perm.id));
  
  // Role-permission mappings
  const rolesToPermissions = {
    "admin": allPermissions.map(p => p.name), // Admin gets all permissions
    "moderator": [
      "content:create", "content:edit", "content:delete", "content:approve",
      "community:moderate", "user:view"
    ],
    "mentor": [
      "content:create", "content:edit", "community:create", "user:view"
    ],
    "student": [
      "content:create", "user:view"
    ]
  };
  
  // Assign permissions to roles
  for (const [roleName, permissionNames] of Object.entries(rolesToPermissions)) {
    const roleId = roleMap.get(roleName);
    
    if (!roleId) {
      console.log(`Role not found: ${roleName}`);
      continue;
    }
    
    for (const permName of permissionNames) {
      const permId = permMap.get(permName);
      
      if (!permId) {
        console.log(`Permission not found: ${permName}`);
        continue;
      }
      
      // Check if this role-permission mapping already exists
      const existing = await db.select().from(rolePermissions).where(
        and(
          eq(rolePermissions.roleId, roleId),
          eq(rolePermissions.permissionId, permId)
        )
      );
      
      if (existing.length === 0) {
        await db.insert(rolePermissions).values({
          roleId,
          permissionId: permId,
          createdAt: new Date()
        });
        
        console.log(`Assigned permission ${permName} to role ${roleName}`);
      } else {
        console.log(`Permission ${permName} already assigned to role ${roleName}`);
      }
    }
  }
  
  console.log("✅ RBAC data population complete!");
}

// Run the script
populateRBAC()
  .then(() => {
    console.log("Script completed successfully");
    process.exit(0);
  })
  .catch(error => {
    console.error("Error running script:", error);
    process.exit(1);
  });