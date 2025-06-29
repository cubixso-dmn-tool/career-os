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
      console.log('No role data found, defaulting to student');
      return 'student'; // Default role
    }

    // Role hierarchy: admin > moderator > mentor > student
    // Note: In the actual implementation, you'd fetch role names from the API
    // For now, we'll use role IDs with known mappings:
    // 1 = admin, 2 = moderator, 3 = mentor, 4 = student
    
    const roleIds = roleData.roles;
    console.log('User role IDs:', roleIds, 'Role data:', roleData);
    
    if (roleIds.includes(1)) {
      console.log('User is admin');
      return 'admin';
    }
    if (roleIds.includes(2)) {
      console.log('User is moderator');
      return 'moderator';
    }
    if (roleIds.includes(3)) {
      console.log('User is mentor');
      return 'mentor';
    }
    console.log('User is student (default or role ID 4)');
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