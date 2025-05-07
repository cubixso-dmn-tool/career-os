import { ReactNode } from 'react';
import { useAuth } from '@/hooks/useAuth';

interface PermissionGateProps {
  children: ReactNode;
  permissions?: string[];     // Specific permissions required
  anyPermission?: boolean;    // If true, user needs any of the permissions, not all
  roles?: number[];           // Specific roles required 
  anyRole?: boolean;          // If true, user needs any of the roles, not all
  fallback?: ReactNode;       // Component to render if permission check fails
}

/**
 * Component for conditionally rendering content based on user permissions or roles
 */
export default function PermissionGate({ 
  children, 
  permissions = [], 
  anyPermission = false,
  roles = [], 
  anyRole = false,
  fallback = null 
}: PermissionGateProps) {
  const { hasPermission, hasRole } = useAuth();
  
  // Check permissions
  const permissionCheck = permissions.length === 0 || (
    anyPermission 
      ? permissions.some(permission => hasPermission(permission))
      : permissions.every(permission => hasPermission(permission))
  );
  
  // Check roles
  const roleCheck = roles.length === 0 || (
    anyRole
      ? roles.some(roleId => hasRole(roleId))
      : roles.every(roleId => hasRole(roleId))
  );
  
  // User must pass both permission and role checks
  const hasAccess = permissionCheck && roleCheck;
  
  // Render children if user has access, otherwise render fallback
  return hasAccess ? <>{children}</> : <>{fallback}</>;
}