import { useAuthContext } from './use-auth-context';
import { User } from '@shared/schema';

export function useAuth() {
  const { isAuthenticated, user, loading: isLoading, error } = useAuthContext();

  return {
    user,
    isAuthenticated,
    isLoading,
    error
  };
}