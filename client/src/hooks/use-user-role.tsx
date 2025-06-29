import { useQuery } from "@tanstack/react-query";
import { useAuthContext } from "./use-auth-context";

export function useUserRole() {
  const { user } = useAuthContext();
  
  const { data: roleData, isLoading, error } = useQuery({
    queryKey: ['/api/rbac/my-info'],
    queryFn: async () => {
      const response = await fetch('/api/rbac/my-info', {
        credentials: "include",
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      
      return response.json();
    },
    enabled: !!user, // Only run query if user is authenticated
  });

  // Determine the primary role (highest priority role)
  const getPrimaryRole = () => {
    if (!roleData?.roles || roleData.roles.length === 0) {
      return 'student'; // Default role
    }

    // Role hierarchy: admin > moderator > mentor > student
    // Role mappings: 1 = admin, 2 = moderator, 3 = mentor, 4 = student
    
    const roleIds = roleData.roles;
    
    if (roleIds.includes(1)) return 'admin';
    if (roleIds.includes(2)) return 'moderator';
    if (roleIds.includes(3)) return 'mentor';
    return 'student';
  };

  const checkPermission = (permission: string): boolean => {
    if (!roleData?.permissions) return false;
    return roleData.permissions.includes(permission);
  };

  const hasRole = (roleName: string): boolean => {
    const currentRole = getPrimaryRole();
    return currentRole === roleName;
  };

  const hasAnyRole = (roleNames: string[]): boolean => {
    const currentRole = getPrimaryRole();
    return roleNames.includes(currentRole);
  };

  return {
    primaryRole: getPrimaryRole(),
    roles: roleData?.roles || [],
    permissions: roleData?.permissions || [],
    isLoading,
    error,
    checkPermission,
    hasRole,
    hasAnyRole,
    isAdmin: hasRole('admin'),
    isModerator: hasRole('moderator') || hasRole('admin'),
    isMentor: hasRole('mentor') || hasRole('moderator') || hasRole('admin'),
    isStudent: hasRole('student')
  };
}