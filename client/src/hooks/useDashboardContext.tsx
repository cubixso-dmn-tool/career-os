import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useAuth } from './use-auth';
import { useDashboardOverview } from './useDashboardIntegration';

interface DashboardContextValue {
  // Data summary stats
  stats: {
    completedCourses: number;
    completedProjects: number;
    masteredSkills: number;
    achievementCount: number;
    hasCareerPath: boolean;
    overallProgress: number;
  };
  
  // Recent activities across all sections
  recentActivities: any[];
  
  // Current active sections
  activeSections: string[];
  
  // Navigation functions
  navigateToSection: (section: string) => void;
  markSectionSeen: (section: string) => void;
  
  // Notification system for cross-dashboard updates
  hasNotifications: boolean;
  notificationCount: number;
  notifications: {
    id: string;
    type: string;
    title: string;
    message: string;
    date: string;
    isRead: boolean;
    relatedEntity?: {
      type: string;
      id: number;
    };
  }[];
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  
  // Track progress in real-time across dashboard
  trackProgress: (progressType: string, entityId: number, progress: number) => void;
  trackCompletion: (progressType: string, entityId: number) => void;
  
  // Learning recommendations based on all user activities
  learningRecommendations: {
    type: string;
    title: string;
    description: string;
    id: number;
    reason: string;
  }[];
}

const DashboardContext = createContext<DashboardContextValue | undefined>(undefined);

export const DashboardProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const dashboardData = useDashboardOverview();
  
  // Local states for dashboard management
  const [activeSections, setActiveSections] = useState<string[]>([]);
  const [notifications, setNotifications] = useState<DashboardContextValue['notifications']>([]);
  const [learningRecommendations, setLearningRecommendations] = useState<DashboardContextValue['learningRecommendations']>([]);
  
  // Navigation functions
  const navigateToSection = useCallback((section: string) => {
    // Add section to active sections if not already there
    setActiveSections(prev => 
      prev.includes(section) ? prev : [...prev, section]
    );
  }, []);
  
  const markSectionSeen = useCallback((section: string) => {
    // Remove section from active list
    setActiveSections(prev => 
      prev.filter(s => s !== section)
    );
  }, []);
  
  // Notification functions
  const markNotificationRead = useCallback((id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, isRead: true } : n)
    );
  }, []);
  
  const markAllNotificationsRead = useCallback(() => {
    setNotifications(prev => 
      prev.map(n => ({ ...n, isRead: true }))
    );
  }, []);
  
  // Add a new notification when important events happen
  const addNotification = useCallback((notification: Omit<DashboardContextValue['notifications'][0], 'id' | 'date' | 'isRead'>) => {
    const newNotification = {
      ...notification,
      id: Date.now().toString(),
      date: new Date().toISOString(),
      isRead: false
    };
    
    setNotifications(prev => [newNotification, ...prev]);
  }, []);
  
  // Progress tracking functions
  const trackProgress = useCallback((progressType: string, entityId: number, progress: number) => {
    // This function would interact with the appropriate API,
    // but for now just create a notification about the progress
    addNotification({
      type: 'progress',
      title: `Progress Update`,
      message: `You've made progress in your ${progressType} #${entityId}!`,
      relatedEntity: {
        type: progressType,
        id: entityId
      }
    });
  }, [addNotification]);
  
  const trackCompletion = useCallback((progressType: string, entityId: number) => {
    // Add a completion notification
    addNotification({
      type: 'completion',
      title: `${progressType.charAt(0).toUpperCase() + progressType.slice(1)} Completed!`,
      message: `Congratulations! You've completed ${progressType} #${entityId}`,
      relatedEntity: {
        type: progressType,
        id: entityId
      }
    });
    
    // Update learning recommendations based on this completion
    updateLearningRecommendations();
  }, [addNotification]);
  
  // Generate personalized learning recommendations based on all user data
  const updateLearningRecommendations = useCallback(() => {
    // In a real implementation, this might call an AI service or a recommendation engine
    // Here we'll just use the data we have
    
    // This is simplified, but shows the integrated nature across course, project, skills
    
    const newRecommendations: DashboardContextValue['learningRecommendations'] = [];
    
    // Add recommendations based on completed courses
    if (dashboardData.completedCourses > 0) {
      newRecommendations.push({
        type: 'project',
        id: 1, // This would be a real project ID related to completed courses
        title: 'Applied Project',
        description: 'Apply your new skills in a hands-on project',
        reason: 'Based on your recently completed courses'
      });
    }
    
    // Add recommendations based on completed projects
    if (dashboardData.completedProjects > 0) {
      newRecommendations.push({
        type: 'skill',
        id: 1, // This would be a real skill ID
        title: 'Leadership',
        description: 'Enhance your project management with leadership skills',
        reason: 'Complement your project experience'
      });
    }
    
    // Add community recommendations if the user is active in learning
    if (dashboardData.overallProgress > 30) {
      newRecommendations.push({
        type: 'community',
        id: 1,
        title: 'Tech Innovators',
        description: 'Connect with other learners in your field',
        reason: 'Enhance your learning with peer discussion'
      });
    }
    
    setLearningRecommendations(newRecommendations);
  }, [dashboardData]);
  
  // Initialize and update learning recommendations when dashboard data changes
  useEffect(() => {
    if (user) {
      updateLearningRecommendations();
    }
  }, [user, updateLearningRecommendations, dashboardData.stats]);
  
  const value: DashboardContextValue = {
    stats: dashboardData.stats,
    recentActivities: dashboardData.recentActivities,
    activeSections,
    navigateToSection,
    markSectionSeen,
    hasNotifications: notifications.some(n => !n.isRead),
    notificationCount: notifications.filter(n => !n.isRead).length,
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
    trackProgress,
    trackCompletion,
    learningRecommendations
  };
  
  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  );
};

export const useDashboard = () => {
  const context = useContext(DashboardContext);
  if (context === undefined) {
    throw new Error('useDashboard must be used within a DashboardProvider');
  }
  return context;
};