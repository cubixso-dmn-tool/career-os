import React, { createContext, ReactNode, useState, useContext, useEffect } from 'react';
import { useLocation } from 'wouter';

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

  // Function to load user roles and permissions
  const loadUserRolesAndPermissions = async () => {
    try {
      const response = await fetch('/api/rbac/my-info');
      if (response.ok) {
        const data = await response.json();
        setUserRoles(data.roles || []);
        setUserPermissions(data.permissions || []);
      }
    } catch (error) {
      console.error('Failed to fetch user roles and permissions', error);
      setUserRoles([]);
      setUserPermissions([]);
    }
  };

  useEffect(() => {
    async function loadUser() {
      try {
        const response = await fetch('/api/auth/me');
        
        if (response.ok) {
          const data = await response.json();
          setUser(data.user);
          
          // Load roles and permissions after user is loaded
          await loadUserRolesAndPermissions();
        } else {
          setUser(null);
          setUserRoles([]);
          setUserPermissions([]);
        }
      } catch (error) {
        console.error('Failed to fetch user', error);
        setUser(null);
        setUserRoles([]);
        setUserPermissions([]);
      } finally {
        setLoading(false);
      }
    }
    
    loadUser();
  }, []);

  // Check if user has a specific permission
  const hasPermission = (permission: string): boolean => {
    return userPermissions.includes(permission);
  };

  // Check if user has a specific role
  const hasRole = (roleId: number): boolean => {
    return userRoles.includes(roleId);
  };

  const login = async (username: string, password: string) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
        
        // Load roles and permissions after successful login
        await loadUserRolesAndPermissions();
        
        navigate('/dashboard');
        return { success: true };
      } else {
        const error = await response.json();
        return { 
          success: false, 
          message: error.message || 'Login failed. Please check your credentials.'
        };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { 
        success: false, 
        message: 'An error occurred during login. Please try again.'
      };
    }
  };

  const register = async (userData: any) => {
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
    }
  };

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
      });
      setUser(null);
      setUserRoles([]);
      setUserPermissions([]);
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
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
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}