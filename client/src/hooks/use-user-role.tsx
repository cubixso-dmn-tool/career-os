import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuthContext } from "./use-auth-context";
import { useEffect } from "react";

export function useUserRole() {
  const { user } = useAuthContext();
  const queryClient = useQueryClient();
  
  // Only clear role cache when user actually changes (not on every render)
  useEffect(() => {
    // Only clear cache if we have a user ID and it's different from the cached one
    const cachedUserId = queryClient.getQueryData(['/api/rbac/my-info', 'user-id']);
    if (user?.id && cachedUserId && cachedUserId !== user.id) {
      console.log('🗑️ User changed, clearing role cache. Old:', cachedUserId, 'New:', user.id);
      queryClient.removeQueries({ queryKey: ['/api/rbac/my-info'] });
    }
    if (user?.id) {
      queryClient.setQueryData(['/api/rbac/my-info', 'user-id'], user.id);
    }
  }, [user?.id, queryClient]);
  
  const { data: roleData, isLoading, error, refetch } = useQuery({
    queryKey: ['/api/rbac/my-info', user?.id],
    queryFn: async () => {
      console.log('🔍 Fetching role data for user:', user?.id);
      const timestamp = Date.now();
      
      // Get access token from localStorage for authentication
      const accessToken = localStorage.getItem('access_token');
      
      const headers: Record<string, string> = {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      };
      
      // Add Authorization header if we have a token
      if (accessToken) {
        headers['Authorization'] = `Bearer ${accessToken}`;
        console.log('🔑 Using JWT token for authentication');
      } else {
        console.log('🍪 Using session-based authentication');
      }
      
      const response = await fetch(`/api/rbac/my-info?t=${timestamp}`, {
        credentials: "include", // Include cookies for session-based auth
        cache: "no-cache",
        headers
      });
      
      if (!response.ok) {
        console.error('❌ Role fetch failed:', response.status, response.statusText);
        
        // If JWT auth failed, try to refresh token
        if (response.status === 401 && accessToken) {
          console.log('🔄 JWT token might be expired, attempting refresh...');
          try {
            const refreshToken = localStorage.getItem('refresh_token');
            if (refreshToken) {
              const refreshResponse = await fetch('/api/auth/refresh-token', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ refreshToken }),
              });
              
              if (refreshResponse.ok) {
                const refreshData = await refreshResponse.json();
                localStorage.setItem('access_token', refreshData.accessToken);
                localStorage.setItem('refresh_token', refreshData.refreshToken);
                
                console.log('✅ Token refreshed, retrying role fetch...');
                
                // Retry the original request with new token
                const retryResponse = await fetch(`/api/rbac/my-info?t=${timestamp}`, {
                  credentials: "include",
                  cache: "no-cache",
                  headers: {
                    ...headers,
                    'Authorization': `Bearer ${refreshData.accessToken}`
                  }
                });
                
                if (retryResponse.ok) {
                  const data = await retryResponse.json();
                  console.log('✅ Role data received after token refresh:', data);
                  return data;
                }
              }
            }
          } catch (refreshError) {
            console.error('❌ Token refresh failed:', refreshError);
          }
        }
        
        throw new Error(`HTTP ${response.status}`);
      }
      
      const data = await response.json();
      console.log('✅ Role data received:', data);
      return data;
    },
    enabled: !!user, // Only run query if user is authenticated
    staleTime: 5 * 60 * 1000, // Cache role data for 5 minutes
    gcTime: 10 * 60 * 1000, // Keep cache for 10 minutes
    refetchOnMount: false, // Don't always refetch on mount - use cache if available
    refetchOnWindowFocus: false, // Don't refetch on window focus to prevent flickering
  });

  // Determine the primary role (highest priority role)
  const getPrimaryRole = () => {
    console.log('🎭 Determining primary role from data:', roleData);
    
    // Check if we have cached data even during loading
    const cachedData = queryClient.getQueryData(['/api/rbac/my-info', user?.id]);
    const dataToUse = roleData || cachedData;
    
    if (!dataToUse?.roles || dataToUse.roles.length === 0) {
      // Only default to student if we're not loading and have no cached data
      if (!isLoading) {
        console.log('⚠️ No roles found, defaulting to student');
        return 'student';
      }
      // If still loading and no cached data, try to maintain previous state
      const previousRole = queryClient.getQueryData(['user-primary-role']) as string;
      if (previousRole) {
        console.log('⏳ Using previous role during loading:', previousRole);
        return previousRole;
      }
      console.log('⏳ Role data still loading, defaulting to student');
      return 'student'; // Safe default
    }

    // Role hierarchy: admin > moderator > mentor > student
    // Role mappings: 1 = admin, 2 = moderator, 3 = mentor, 4 = student
    
    const roleIds = dataToUse.roles;
    console.log('🔢 Role IDs from API:', roleIds);
    
    let determinedRole = 'student';
    
    if (roleIds.includes(1)) {
      console.log('👑 Primary role determined: admin');
      determinedRole = 'admin';
    } else if (roleIds.includes(2)) {
      console.log('🛡️ Primary role determined: moderator');
      determinedRole = 'moderator';
    } else if (roleIds.includes(3)) {
      console.log('👨‍🎓 Primary role determined: mentor');
      determinedRole = 'mentor';
    } else {
      console.log('📚 Primary role determined: student (default)');
      determinedRole = 'student';
    }
    
    // Cache the determined role for stability
    queryClient.setQueryData(['user-primary-role'], determinedRole);
    return determinedRole;
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