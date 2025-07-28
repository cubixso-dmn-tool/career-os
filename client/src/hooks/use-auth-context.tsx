import React, { createContext, ReactNode, useState, useContext, useEffect, useCallback } from 'react';
import { useLocation } from 'wouter';
import { useToast } from './use-toast';
import { useQueryClient } from '@tanstack/react-query';
import FirebaseAuthService from '../lib/firebase';
import { User as FirebaseUser } from 'firebase/auth';

interface User {
  id: number;
  name: string;
  email: string;
  username: string;
  avatar: string;
  roles?: number[];
  permissions?: string[];
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  userRoles: number[];
  userPermissions: string[];
  hasPermission: (permission: string) => boolean;
  hasRole: (roleId: number) => boolean;
  login: (username: string, password: string) => Promise<{ success: boolean; message?: string }>;
  register: (userData: any) => Promise<{ success: boolean; message?: string }>;
  logout: () => Promise<void>;
  signInWithGoogle: () => Promise<{ success: boolean; message?: string }>;
  signInWithGitHub: () => Promise<{ success: boolean; message?: string }>;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  isAuthenticated: false,
  userRoles: [],
  userPermissions: [],
  hasPermission: () => false,
  hasRole: () => false,
  login: async () => ({ success: false }),
  register: async () => ({ success: false }),
  logout: async () => {},
  signInWithGoogle: async () => ({ success: false }),
  signInWithGitHub: async () => ({ success: false }),
});

export const useAuthContext = () => useContext(AuthContext);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [userRoles, setUserRoles] = useState<number[]>([]);
  const [userPermissions, setUserPermissions] = useState<string[]>([]);
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Token management functions
  const getStoredTokens = () => {
    const accessToken = localStorage.getItem('access_token');
    const refreshToken = localStorage.getItem('refresh_token');
    return { accessToken, refreshToken };
  };

  const setStoredTokens = (accessToken: string, refreshToken: string) => {
    localStorage.setItem('access_token', accessToken);
    localStorage.setItem('refresh_token', refreshToken);
  };

  const clearStoredTokens = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  };

  // Function to make authenticated requests
  const authenticatedFetch = async (url: string, options: RequestInit = {}) => {
    const { accessToken } = getStoredTokens();
    const headers = {
      ...options.headers,
      ...(accessToken && { Authorization: `Bearer ${accessToken}` })
    };

    let response = await fetch(url, { ...options, headers });
    
    // If token is expired, try to refresh
    if (response.status === 401 && accessToken) {
      const refreshed = await refreshAccessToken();
      if (refreshed) {
        const { accessToken: newAccessToken } = getStoredTokens();
        response = await fetch(url, {
          ...options,
          headers: {
            ...options.headers,
            Authorization: `Bearer ${newAccessToken}`
          }
        });
      }
    }

    return response;
  };

  // Function to refresh access token
  const refreshAccessToken = async (): Promise<boolean> => {
    try {
      const { refreshToken } = getStoredTokens();
      if (!refreshToken) return false;

      const response = await fetch('/api/auth/refresh-token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken }),
      });

      if (response.ok) {
        const data = await response.json();
        setStoredTokens(data.accessToken, data.refreshToken);
        return true;
      } else {
        clearStoredTokens();
        return false;
      }
    } catch (error) {
      console.error('Token refresh failed:', error);
      clearStoredTokens();
      return false;
    }
  };

  // Function to load user roles and permissions
  const loadUserRolesAndPermissions = async () => {
    try {
      console.log('🔄 AuthContext - Loading user roles and permissions');
      const response = await authenticatedFetch('/api/rbac/my-info');
      if (response.ok) {
        const data = await response.json();
        console.log('✅ AuthContext - Role data loaded:', data);
        setUserRoles(data.roles || []);
        setUserPermissions(data.permissions || []);
      } else {
        console.error('❌ AuthContext - Failed to load roles:', response.status);
      }
    } catch (error) {
      console.error('Failed to fetch user roles and permissions', error);
      setUserRoles([]);
      setUserPermissions([]);
    }
  };

  useEffect(() => {
    // Set up Firebase auth state listener
    const unsubscribe = FirebaseAuthService.onAuthStateChange(async (firebaseUser: FirebaseUser | null) => {
      console.log('🔥 Firebase auth state change:', firebaseUser ? 'User signed in' : 'User signed out');
      
      try {
        if (firebaseUser) {
          console.log('📡 Syncing Firebase user to database...');
          // Firebase user is signed in, sync to our database
          const syncResult = await FirebaseAuthService.syncUserToDatabase(firebaseUser);
          console.log('✅ User sync successful:', syncResult);
          
          // Store our JWT tokens
          setStoredTokens(syncResult.accessToken, syncResult.refreshToken);
          
          // Set user data
          setUser(syncResult.user);
          await loadUserRolesAndPermissions();
          
          toast({
            title: "Login successful",
            description: "Welcome to CareerOS!",
          });
          
          // Navigate to dashboard after successful sync
          console.log('🚀 Navigating to dashboard...');
          setTimeout(() => {
            navigate('/dashboard');
          }, 1000);
          
        } else {
          // No Firebase user, check for legacy auth
          await loadLegacyAuth();
        }
      } catch (error) {
        console.error('Firebase user sync failed:', error);
        toast({
          title: "Authentication Error",
          description: "Failed to sync user data. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  // Legacy authentication check (for existing users)
  const loadLegacyAuth = async () => {
    try {
      // Check for OAuth tokens in URL (from OAuth redirect)
      const urlParams = new URLSearchParams(window.location.search);
      const accessToken = urlParams.get('access_token');
      const refreshToken = urlParams.get('refresh_token');
      
      if (accessToken && refreshToken) {
        // Store tokens from OAuth redirect
        setStoredTokens(accessToken, refreshToken);
        // Clean up URL
        window.history.replaceState({}, document.title, window.location.pathname);
        
        // Immediately fetch user data with new tokens
        try {
          const response = await authenticatedFetch('/api/auth/me');
          if (response.ok) {
            const data = await response.json();
            setUser(data);
            await loadUserRolesAndPermissions();
            
            // Show success toast
            toast({
              title: "Login successful",
              description: "Welcome to CareerOS!",
            });
            
            // Redirect to dashboard after successful OAuth login
            setTimeout(() => {
              navigate('/dashboard');
            }, 500);
            return;
          }
        } catch (error) {
          console.error('OAuth token validation failed:', error);
          clearStoredTokens();
          toast({
            title: "Authentication Error",
            description: "OAuth login failed. Please try again.",
            variant: "destructive",
          });
        }
      }
      
      const { accessToken: storedAccessToken } = getStoredTokens();
      
      // If no token, check session-based auth as fallback
      if (!storedAccessToken) {
        const response = await fetch('/api/auth/me');
        if (response.ok) {
          const data = await response.json();
          setUser(data.user);
          await loadUserRolesAndPermissions();
        } else {
          setUser(null);
          setUserRoles([]);
          setUserPermissions([]);
        }
      } else {
        // Use token-based authentication - try advanced auth route first
        const response = await authenticatedFetch('/api/auth/me');
        if (response.ok) {
          const data = await response.json();
          // JWT endpoint returns user data directly
          setUser(data);
          await loadUserRolesAndPermissions();
        } else {
          // Token might be invalid, clear it
          clearStoredTokens();
          setUser(null);
          setUserRoles([]);
          setUserPermissions([]);
        }
      }
    } catch (error) {
      console.error('Failed to fetch user', error);
      clearStoredTokens();
      setUser(null);
      setUserRoles([]);
      setUserPermissions([]);
    }
  };

  // Check if user has a specific permission
  const hasPermission = (permission: string): boolean => {
    return userPermissions.includes(permission);
  };

  // Check if user has a specific role
  const hasRole = (roleId: number): boolean => {
    return userRoles.includes(roleId);
  };

  const login = async (username: string, password: string) => {
    setLoading(true);
    try {
      // Try JWT login first
      const jwtResponse = await fetch('/api/auth/jwt-login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (jwtResponse.ok) {
        const data = await jwtResponse.json();
        // Store tokens for persistence
        setStoredTokens(data.accessToken, data.refreshToken);
        setUser(data.user);
        
        // Load roles and permissions after successful login
        await loadUserRolesAndPermissions();
        
        // Small delay to ensure role data is loaded before redirect
        setTimeout(() => {
          navigate('/dashboard');
        }, 200);
        return { success: true };
      } else {
        // Fallback to session-based login
        const sessionResponse = await fetch('/api/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ username, password }),
        });

        if (sessionResponse.ok) {
          const data = await sessionResponse.json();
          setUser(data.user);
          
          // Load roles and permissions after successful login
          await loadUserRolesAndPermissions();
          
          // Small delay to ensure role data is loaded before redirect
          setTimeout(() => {
            navigate('/dashboard');
          }, 200);
          return { success: true };
        } else {
          const error = await sessionResponse.json();
          return { 
            success: false, 
            message: error.message || 'Login failed. Please check your credentials.'
          };
        }
      }
    } catch (error) {
      console.error('Login error:', error);
      return { 
        success: false, 
        message: 'An error occurred during login. Please try again.'
      };
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData: any) => {
    setLoading(true);
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
        
        // New users may have default roles, so load them
        await loadUserRolesAndPermissions();
        
        navigate('/dashboard');
        return { success: true };
      } else {
        const error = await response.json();
        return { 
          success: false, 
          message: error.message || 'Registration failed. Please try again.'
        };
      }
    } catch (error) {
      console.error('Registration error:', error);
      return { 
        success: false, 
        message: 'An error occurred during registration. Please try again.'
      };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      // Sign out from Firebase
      await FirebaseAuthService.signOut();
      
      const { accessToken } = getStoredTokens();
      
      if (accessToken) {
        // Try JWT logout if we have tokens
        await authenticatedFetch('/api/auth/logout', {
          method: 'POST',
        });
      } else {
        // Fallback to session-based logout
        await fetch('/api/auth/logout', {
          method: 'POST',
        });
      }
      
      // Clear tokens and state
      clearStoredTokens();
      setUser(null);
      setUserRoles([]);
      setUserPermissions([]);
      
      // Clear all React Query cache to ensure fresh data on next login
      queryClient.clear();
      
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
      // Even if logout fails, clear local state
      clearStoredTokens();
      setUser(null);
      setUserRoles([]);
      setUserPermissions([]);
      
      // Clear all React Query cache to ensure fresh data on next login
      queryClient.clear();
      
      navigate('/login');
    } finally {
      setLoading(false);
    }
  };

  // Firebase Google Sign In
  const signInWithGoogle = async () => {
    setLoading(true);
    try {
      const result = await FirebaseAuthService.signInWithGoogle();
      
      if (result.success) {
        // Firebase auth state listener will handle the rest (sync + redirect)
        return { success: true };
      } else {
        toast({
          title: "Authentication Error",
          description: result.error || "Google sign in failed",
          variant: "destructive",
        });
        return { success: false, message: result.error };
      }
    } catch (error: any) {
      toast({
        title: "Authentication Error",
        description: error.message || "Google sign in failed",
        variant: "destructive",
      });
      return { success: false, message: error.message };
    } finally {
      setLoading(false);
    }
  };

  // Firebase GitHub Sign In
  const signInWithGitHub = async () => {
    setLoading(true);
    try {
      const result = await FirebaseAuthService.signInWithGitHub();
      
      if (result.success) {
        // Firebase auth state listener will handle the rest (sync + redirect)
        return { success: true };
      } else {
        toast({
          title: "Authentication Error",
          description: result.error || "GitHub sign in failed",
          variant: "destructive",
        });
        return { success: false, message: result.error };
      }
    } catch (error: any) {
      toast({
        title: "Authentication Error",
        description: error.message || "GitHub sign in failed",
        variant: "destructive",
      });
      return { success: false, message: error.message };
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    userRoles,
    userPermissions,
    hasPermission,
    hasRole,
    login,
    register,
    logout,
    signInWithGoogle,
    signInWithGitHub,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}