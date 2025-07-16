import { Router } from "express";
import { storage } from "../storage.js";
import { loadUserRolesMiddleware, requirePermission } from "../middleware/rbac.js";
import { insertRoleSchema, insertPermissionSchema, insertRolePermissionSchema } from "../../shared/schema.js";

// Create router
const router = Router();

// Apply middleware to load user roles and permissions
router.use(loadUserRolesMiddleware);

// Role routes

// Get all roles (admin only)
router.get("/roles", requirePermission("read:roles"), async (req, res) => {
  try {
    const roles = await storage.getAllRoles();
    res.status(200).json(roles);
  } catch (error) {
    console.error("Error fetching roles:", error);
    res.status(500).json({ message: "Failed to fetch roles" });
  }
});

// Get a specific role
router.get("/roles/:roleId", requirePermission("read:roles"), async (req, res) => {
  try {
    const roleId = parseInt(req.params.roleId);
    if (isNaN(roleId)) {
      return res.status(400).json({ message: "Invalid role ID" });
    }
    
    const role = await storage.getRole(roleId);
    if (!role) {
      return res.status(404).json({ message: "Role not found" });
    }
    
    res.status(200).json(role);
  } catch (error) {
    console.error("Error fetching role:", error);
    res.status(500).json({ message: "Failed to fetch role" });
  }
});

// Create a new role (admin only)
router.post("/roles", requirePermission("create:roles"), async (req, res) => {
  try {
    const validatedData = insertRoleSchema.parse(req.body);
    const role = await storage.createRole(validatedData);
    res.status(201).json(role);
  } catch (error) {
    console.error("Error creating role:", error);
    res.status(500).json({ message: "Failed to create role" });
  }
});

// Permission routes

// Get all permissions (admin only)
router.get("/permissions", requirePermission("read:permissions"), async (req, res) => {
  try {
    const permissions = await storage.getAllPermissions();
    res.status(200).json(permissions);
  } catch (error) {
    console.error("Error fetching permissions:", error);
    res.status(500).json({ message: "Failed to fetch permissions" });
  }
});

// Get a specific permission
router.get("/permissions/:permissionId", requirePermission("read:permissions"), async (req, res) => {
  try {
    const permissionId = parseInt(req.params.permissionId);
    if (isNaN(permissionId)) {
      return res.status(400).json({ message: "Invalid permission ID" });
    }
    
    const permission = await storage.getPermission(permissionId);
    if (!permission) {
      return res.status(404).json({ message: "Permission not found" });
    }
    
    res.status(200).json(permission);
  } catch (error) {
    console.error("Error fetching permission:", error);
    res.status(500).json({ message: "Failed to fetch permission" });
  }
});

// Create a new permission (admin only)
router.post("/permissions", requirePermission("create:permissions"), async (req, res) => {
  try {
    const validatedData = insertPermissionSchema.parse(req.body);
    const permission = await storage.createPermission(validatedData);
    res.status(201).json(permission);
  } catch (error) {
    console.error("Error creating permission:", error);
    res.status(500).json({ message: "Failed to create permission" });
  }
});

// Role Permission routes

// Get permissions for a role
router.get("/roles/:roleId/permissions", requirePermission("read:roles"), async (req, res) => {
  try {
    const roleId = parseInt(req.params.roleId);
    if (isNaN(roleId)) {
      return res.status(400).json({ message: "Invalid role ID" });
    }
    
    // Verify role exists
    const role = await storage.getRole(roleId);
    if (!role) {
      return res.status(404).json({ message: "Role not found" });
    }
    
    const permissions = await storage.getRolePermissions(roleId);
    res.status(200).json(permissions);
  } catch (error) {
    console.error("Error fetching role permissions:", error);
    res.status(500).json({ message: "Failed to fetch role permissions" });
  }
});

// Assign permission to role
router.post("/roles/:roleId/permissions", requirePermission("update:roles"), async (req, res) => {
  try {
    const roleId = parseInt(req.params.roleId);
    const { permissionId } = req.body;
    
    if (isNaN(roleId) || isNaN(permissionId)) {
      return res.status(400).json({ message: "Invalid role ID or permission ID" });
    }
    
    // Verify role exists
    const role = await storage.getRole(roleId);
    if (!role) {
      return res.status(404).json({ message: "Role not found" });
    }
    
    // Verify permission exists
    const permission = await storage.getPermission(permissionId);
    if (!permission) {
      return res.status(404).json({ message: "Permission not found" });
    }
    
    const validatedData = insertRolePermissionSchema.parse({
      roleId,
      permissionId
    });
    
    const rolePermission = await storage.assignPermissionToRole(validatedData);
    res.status(201).json(rolePermission);
  } catch (error) {
    console.error("Error assigning permission to role:", error);
    res.status(500).json({ message: "Failed to assign permission to role" });
  }
});

// Remove permission from role
router.delete("/roles/:roleId/permissions/:permissionId", requirePermission("update:roles"), async (req, res) => {
  try {
    const roleId = parseInt(req.params.roleId);
    const permissionId = parseInt(req.params.permissionId);
    
    if (isNaN(roleId) || isNaN(permissionId)) {
      return res.status(400).json({ message: "Invalid role ID or permission ID" });
    }
    
    // Verify role exists
    const role = await storage.getRole(roleId);
    if (!role) {
      return res.status(404).json({ message: "Role not found" });
    }
    
    // Verify permission exists
    const permission = await storage.getPermission(permissionId);
    if (!permission) {
      return res.status(404).json({ message: "Permission not found" });
    }
    
    await storage.removePermissionFromRole(roleId, permissionId);
    res.status(200).json({ message: "Permission removed from role successfully" });
  } catch (error) {
    console.error("Error removing permission from role:", error);
    res.status(500).json({ message: "Failed to remove permission from role" });
  }
});

// Current User Info routes

// Get current user's roles and permissions
router.get("/my-info", async (req, res) => {
  try {
    if (!req.isAuthenticated() || !req.user) {
      return res.status(401).json({ message: "Authentication required" });
    }
    
    // Roles and permissions should already be loaded by the middleware
    const userInfo = {
      id: req.user.id,
      username: req.user.username,
      roles: req.user.roles || [],
      permissions: req.user.permissions || []
    };
    

    
    res.status(200).json(userInfo);
  } catch (error) {
    console.error("Error fetching user info:", error);
    res.status(500).json({ message: "Failed to fetch user info" });
  }
});

// Check if current user has a specific permission
router.get("/has-permission/:permissionName", async (req, res) => {
  try {
    if (!req.isAuthenticated() || !req.user) {
      return res.status(401).json({ message: "Authentication required" });
    }
    
    const permissionName = req.params.permissionName;
    
    // Check if user has the permission
    const hasPermission = req.user.permissions && 
                         req.user.permissions.includes(permissionName);
    
    res.status(200).json({ hasPermission });
  } catch (error) {
    console.error("Error checking permission:", error);
    res.status(500).json({ message: "Failed to check permission" });
  }
});

// User Role routes

// Get roles for a user
router.get("/users/:userId/roles", requirePermission("read:user-roles"), async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);
    if (isNaN(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }
    
    // Verify user exists
    const user = await storage.getUser(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    const userRoles = await storage.getUserRoles(userId);
    
    // Get full role details
    const roles = [];
    for (const userRole of userRoles) {
      const role = await storage.getRole(userRole.roleId);
      if (role) {
        roles.push(role);
      }
    }
    
    res.status(200).json(roles);
  } catch (error) {
    console.error("Error fetching user roles:", error);
    res.status(500).json({ message: "Failed to fetch user roles" });
  }
});

// Assign role to user
router.post("/users/:userId/roles", requirePermission("assign:roles"), async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);
    const { roleId } = req.body;
    
    if (isNaN(userId) || isNaN(roleId)) {
      return res.status(400).json({ message: "Invalid user ID or role ID" });
    }
    
    // Verify user exists
    const user = await storage.getUser(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    // Verify role exists
    const role = await storage.getRole(roleId);
    if (!role) {
      return res.status(404).json({ message: "Role not found" });
    }
    
    // Check if user already has this role
    const userRoles = await storage.getUserRoles(userId);
    if (userRoles.some(r => r.roleId === roleId)) {
      return res.status(400).json({ message: "User already has this role" });
    }
    
    const userRole = await storage.assignRoleToUser({ userId, roleId });
    res.status(201).json(userRole);
  } catch (error) {
    console.error("Error assigning role to user:", error);
    res.status(500).json({ message: "Failed to assign role to user" });
  }
});

// Remove role from user
router.delete("/users/:userId/roles/:roleId", requirePermission("assign:roles"), async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);
    const roleId = parseInt(req.params.roleId);
    
    if (isNaN(userId) || isNaN(roleId)) {
      return res.status(400).json({ message: "Invalid user ID or role ID" });
    }
    
    // Verify user exists
    const user = await storage.getUser(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    // Verify role exists
    const role = await storage.getRole(roleId);
    if (!role) {
      return res.status(404).json({ message: "Role not found" });
    }
    
    // Check if user has this role
    const userRoles = await storage.getUserRoles(userId);
    if (!userRoles.some(r => r.roleId === roleId)) {
      return res.status(400).json({ message: "User does not have this role" });
    }
    
    await storage.removeRoleFromUser(userId, roleId);
    res.status(200).json({ message: "Role removed from user successfully" });
  } catch (error) {
    console.error("Error removing role from user:", error);
    res.status(500).json({ message: "Failed to remove role from user" });
  }
});

export default router;