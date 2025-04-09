import { useAuthContext } from './use-auth-context';

export interface User {
  id: number;
  name: string;
  email: string;
  username: string;
  avatar: string;
}

export function useAuth() {
  return useAuthContext();
}