import { useState, useEffect, useCallback } from 'react';
import { apiRequest } from '../lib/queryClient';
import type { User } from '@shared/schema';

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
  error: string | null;
}

interface LoginCredentials {
  username: string;
  password: string;
}

interface RegisterCredentials {
  username: string;
  password: string;
  email: string;
  name: string;
}

export function useAuth() {
  const [auth, setAuth] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    loading: true,
    error: null
  });

  // Check authentication status when component mounts
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = useCallback(async () => {
    try {
      setAuth(prev => ({ ...prev, loading: true, error: null }));
      const response = await fetch('/api/auth/status', {
        method: 'GET',
        credentials: 'include'
      });
      
      if (!response.ok) {
        throw new Error(`${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();

      setAuth({
        isAuthenticated: data.isAuthenticated,
        user: data.user || null,
        loading: false,
        error: null
      });
    } catch (err) {
      setAuth({
        isAuthenticated: false,
        user: null,
        loading: false,
        error: 'Failed to check authentication status'
      });
    }
  }, []);

  const login = useCallback(async (credentials: LoginCredentials) => {
    try {
      setAuth(prev => ({ ...prev, loading: true, error: null }));
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(credentials)
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || response.statusText);
      }
      
      const data = await response.json();

      setAuth({
        isAuthenticated: true,
        user: data.user,
        loading: false,
        error: null
      });
      
      return data;
    } catch (err: any) {
      const errorMessage = err.message || 'Login failed';
      setAuth(prev => ({
        ...prev,
        loading: false,
        error: errorMessage
      }));
      throw new Error(errorMessage);
    }
  }, []);

  const register = useCallback(async (credentials: RegisterCredentials) => {
    try {
      setAuth(prev => ({ ...prev, loading: true, error: null }));
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials)
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || response.statusText);
      }
      
      await response.json();

      // After registration, automatically log in
      return await login({
        username: credentials.username,
        password: credentials.password
      });
    } catch (err: any) {
      const errorMessage = err.message || 'Registration failed';
      setAuth(prev => ({
        ...prev,
        loading: false,
        error: errorMessage
      }));
      throw new Error(errorMessage);
    }
  }, [login]);

  const logout = useCallback(async () => {
    try {
      setAuth(prev => ({ ...prev, loading: true, error: null }));
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include'
      });
      
      if (!response.ok) {
        throw new Error(`${response.status}: ${response.statusText}`);
      }

      setAuth({
        isAuthenticated: false,
        user: null,
        loading: false,
        error: null
      });
    } catch (err) {
      setAuth(prev => ({
        ...prev,
        loading: false,
        error: 'Logout failed'
      }));
    }
  }, []);

  return {
    isAuthenticated: auth.isAuthenticated,
    user: auth.user,
    loading: auth.loading,
    error: auth.error,
    login,
    register,
    logout,
    checkAuthStatus
  };
}