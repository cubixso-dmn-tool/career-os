import { Request, Response, NextFunction } from "express";
import { storage } from "../storage.js";
import { Permission } from "../shared/schema.js";

// Type definition for Express Request with user role information
declare global {
  namespace Express {
    interface User {
      id: number;
      username: string;
      email: string;
      name: string;
      bio?: string | null;
      avatar?: string | null;
      createdAt: Date;
      roles?: number[]; // Array of role IDs
      permissions?: string[]; // Array of permission names
    }
  }
}

/**
 * Loads user roles and permissions and attaches them to the request object
 */
export async function loadUserRolesMiddleware(req: Request, res: Response, next: NextFunction) {
  if (!req.isAuthenticated() || !req.user) {
    return next();
  }

  try {
    // Get user roles
    const userRoles = await storage.getUserRoles(req.user.id);
    
    // Attach role IDs to the user object
    req.user.roles = userRoles.map(role => role.roleId);
    
    // Get permissions based on roles
    const permissions: Permission[] = [];
    for (const userRole of userRoles) {
      const rolePermissions = await storage.getRolePermissions(userRole.roleId);
      permissions.push(...rolePermissions);
    }
    
    // Attach unique permission names to the user object
    req.user.permissions = Array.from(new Set(permissions.map(p => p.name)));
    
    next();
  } catch (error) {
    console.error("Error loading user roles:", error);
    next();
  }
}

/**
 * Middleware to check if user has required permission
 * @param requiredPermission The permission name required to access the resource
 * @param resource Optional resource name to check permission for specific resource
 */
export function requirePermission(requiredPermission: string, resource?: string) {
  return (req: Request, res: Response, next: NextFunction) => {
    // If user is not authenticated, deny access
    if (!req.isAuthenticated() || !req.user) {
      return res.status(401).json({ message: "Authentication required" });
    }
    
    // Skip permission check if user has no permissions loaded
    if (!req.user.permissions) {
      return res.status(403).json({ message: "Permission check failed: User permissions not loaded" });
    }
    
    // Check if user has the required permission
    if (req.user.permissions.includes(requiredPermission)) {
      return next();
    }
    
    // Check if user has resource-specific permission if resource is provided
    if (resource && req.user.permissions.includes(`${requiredPermission}:${resource}`)) {
      return next();
    }
    
    // Deny access if user doesn't have required permission
    return res.status(403).json({ message: "Access denied: Insufficient permissions" });
  };
}

/**
 * Middleware to check if user has specific role
 * @param roleId The role ID required to access the resource
 */
export function requireRole(roleId: number) {
  return (req: Request, res: Response, next: NextFunction) => {
    // If user is not authenticated, deny access
    if (!req.isAuthenticated() || !req.user) {
      return res.status(401).json({ message: "Authentication required" });
    }
    
    // Skip role check if user has no roles loaded
    if (!req.user.roles) {
      return res.status(403).json({ message: "Role check failed: User roles not loaded" });
    }
    
    // Check if user has the required role
    if (req.user.roles.includes(roleId)) {
      return next();
    }
    
    // Deny access if user doesn't have required role
    return res.status(403).json({ message: "Access denied: Insufficient role" });
  };
}

/**
 * Middleware to check if user is a community moderator
 * @param communityIdParam The name of the URL parameter containing community ID
 */
export function requireCommunityModerator(communityIdParam: string = 'communityId') {
  return async (req: Request, res: Response, next: NextFunction) => {
    // If user is not authenticated, deny access
    if (!req.isAuthenticated() || !req.user) {
      return res.status(401).json({ message: "Authentication required" });
    }
    
    // Get community ID from request parameters
    const communityId = parseInt(req.params[communityIdParam]);
    if (isNaN(communityId)) {
      return res.status(400).json({ message: "Invalid community ID" });
    }
    
    try {
      // Check if user has a moderator role in the community
      const isModerator = await storage.isCommunityModerator(req.user.id, communityId);
      
      if (isModerator) {
        return next();
      }
      
      // Deny access if user is not a moderator
      return res.status(403).json({ message: "Access denied: Not a community moderator" });
    } catch (error) {
      console.error("Error checking community moderator status:", error);
      return res.status(500).json({ message: "Server error" });
    }
  };
}

/**
 * Middleware to check if user is a community owner
 * @param communityIdParam The name of the URL parameter containing community ID
 */
export function requireCommunityOwner(communityIdParam: string = 'communityId') {
  return async (req: Request, res: Response, next: NextFunction) => {
    // If user is not authenticated, deny access
    if (!req.isAuthenticated() || !req.user) {
      return res.status(401).json({ message: "Authentication required" });
    }
    
    // Get community ID from request parameters
    const communityId = parseInt(req.params[communityIdParam]);
    if (isNaN(communityId)) {
      return res.status(400).json({ message: "Invalid community ID" });
    }
    
    try {
      // Get community details
      const community = await storage.getCommunity(communityId);
      
      // Check if user is the community creator
      if (community && community.createdBy === req.user.id) {
        return next();
      }
      
      // Deny access if user is not the community creator
      return res.status(403).json({ message: "Access denied: Not the community owner" });
    } catch (error) {
      console.error("Error checking community owner status:", error);
      return res.status(500).json({ message: "Server error" });
    }
  };
}

/**
 * Middleware to check if a user has content management permissions
 * This middleware checks for any of the content-related permissions
 */
export function requireContentPermissions(req: Request, res: Response, next: NextFunction) {
  // If user is not authenticated, deny access
  if (!req.isAuthenticated() || !req.user) {
    return res.status(401).json({ message: "Authentication required" });
  }
  
  // Skip permission check if user has no permissions loaded
  if (!req.user.permissions) {
    return res.status(403).json({ message: "Permission check failed: User permissions not loaded" });
  }
  
  // Check if user has any of the content management permissions
  const contentPermissions = [
    'course:manage',
    'project:manage',
    'content:upload',
    'community:create'
  ];
  
  const hasContentPermission = contentPermissions.some(permission => 
    req.user.permissions?.includes(permission)
  );
  
  if (hasContentPermission) {
    return next();
  }
  
  // Deny access if user doesn't have required permissions
  return res.status(403).json({ 
    message: "Access denied: Content management permissions required" 
  });
}