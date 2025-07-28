import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuthContext } from "./use-auth-context";
import { useEffect } from "react";

export function useUserRole() {
  const { user } = useAuthContext();
  const queryClient = useQueryClient();
  
  // Clear any existing role cache when user changes
  useEffect(() => {
    if (user?.id) {
      console.log('🗑️ Clearing role cache for user:', user.id);
      queryClient.removeQueries({ queryKey: ['/api/rbac/my-info'] });
    }
  }, [user?.id, queryClient]);
  
  const { data: roleData, isLoading, error, refetch } = useQuery({
    queryKey: ['/api/rbac/my-info', user?.id],
    queryFn: async () => {
      console.log('🔍 Fetching role data for user:', user?.id);
      const timestamp = Date.now();
      const response = await fetch(`/api/rbac/my-info?t=${timestamp}`, {
        credentials: "include",
        cache: "no-cache", // Prevent browser caching
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      });
      
      if (!response.ok) {
        console.error('❌ Role fetch failed:', response.status, response.statusText);
        throw new Error(`HTTP ${response.status}`);
      }
      
      const data = await response.json();
      console.log('✅ Role data received:', data);
      return data;
    },
    enabled: !!user, // Only run query if user is authenticated
    staleTime: 0, // Don't cache role data to ensure fresh data on each load
    gcTime: 0, // Updated property name for cache garbage collection time
    refetchOnMount: true, // Always refetch when component mounts
    refetchOnWindowFocus: true, // Refetch when window regains focus
  });

  // Determine the primary role (highest priority role)
  const getPrimaryRole = () => {
    console.log('🎭 Determining primary role from data:', roleData);
    
    if (!roleData?.roles || roleData.roles.length === 0) {
      console.log('⚠️ No roles found, defaulting to student');
      return 'student'; // Default role
    }

    // Role hierarchy: admin > moderator > mentor > student
    // Role mappings: 1 = admin, 2 = moderator, 3 = mentor, 4 = student
    
    const roleIds = roleData.roles;
    console.log('🔢 Role IDs from API:', roleIds);
    
    if (roleIds.includes(1)) {
      console.log('👑 Primary role determined: admin');
      return 'admin';
    }
    if (roleIds.includes(2)) {
      console.log('🛡️ Primary role determined: moderator');
      return 'moderator';
    }
    if (roleIds.includes(3)) {
      console.log('👨‍🎓 Primary role determined: mentor');
      return 'mentor';
    }
    console.log('📚 Primary role determined: student (default)');
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
    refetch, // Expose refetch function
    checkPermission,
    hasRole,
    hasAnyRole,
    isAdmin: hasRole('admin'),
    isModerator: hasRole('moderator') || hasRole('admin'),
    isMentor: hasRole('mentor') || hasRole('moderator') || hasRole('admin'),
    isStudent: hasRole('student')
  };
}