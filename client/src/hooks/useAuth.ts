import { useQuery } from '@tanstack/react-query';

interface User {
  id: number;
  username: string;
  email: string;
  avatar?: string;
  name?: string;
  isVerified?: boolean;
  isAdmin?: boolean;
  roles?: string[];
}

export function useAuth() {
  const { data, isLoading, error } = useQuery<{ isAuthenticated: boolean; user?: User }>({
    queryKey: ['/api/auth/status'],
    refetchOnWindowFocus: false,
  });

  return {
    user: data?.user || null,
    isLoading,
    isAuthenticated: data?.isAuthenticated || false,
    error
  };
}