type EventCallback = (data?: any) => void;

interface EventSubscription {
  eventName: string;
  callback: EventCallback;
}

class DashboardEventBus {
  private listeners: Record<string, EventCallback[]> = {};
  private subscriptions: Map<object, EventSubscription[]> = new Map();

  // Subscribe to an event
  on(eventName: string, callback: EventCallback, subscriber?: object): void {
    if (!this.listeners[eventName]) {
      this.listeners[eventName] = [];
    }
    
    this.listeners[eventName].push(callback);
    
    // Track the subscription if a subscriber is provided
    if (subscriber) {
      if (!this.subscriptions.has(subscriber)) {
        this.subscriptions.set(subscriber, []);
      }
      
      this.subscriptions.get(subscriber)?.push({
        eventName,
        callback
      });
    }
  }

  // Emit an event with optional data
  emit(eventName: string, data?: any): void {
    const callbacks = this.listeners[eventName];
    if (callbacks) {
      callbacks.forEach(callback => callback(data));
    }
  }

  // Unsubscribe from a specific event
  off(eventName: string, callback: EventCallback): void {
    const callbacks = this.listeners[eventName];
    if (callbacks) {
      this.listeners[eventName] = callbacks.filter(cb => cb !== callback);
    }
  }

  // Unsubscribe all events for a specific component/subscriber
  unsubscribeAll(subscriber: object): void {
    const subscriptions = this.subscriptions.get(subscriber);
    if (subscriptions) {
      subscriptions.forEach(sub => {
        this.off(sub.eventName, sub.callback);
      });
      this.subscriptions.delete(subscriber);
    }
  }
}

// Define standard event names for dashboard components to use
export const DashboardEvents = {
  // Course related events
  COURSE_ENROLLED: 'course:enrolled',
  COURSE_PROGRESS_UPDATED: 'course:progress_updated',
  COURSE_COMPLETED: 'course:completed',
  
  // Project related events
  PROJECT_STARTED: 'project:started',
  PROJECT_PROGRESS_UPDATED: 'project:progress_updated',
  PROJECT_COMPLETED: 'project:completed',
  
  // Skill related events
  SKILL_STARTED: 'skill:started',
  SKILL_PROGRESS_UPDATED: 'skill:progress_updated',
  SKILL_COMPLETED: 'skill:completed',
  
  // Community related events
  COMMUNITY_JOINED: 'community:joined',
  COMMUNITY_POST_CREATED: 'community:post_created',
  COMMUNITY_EVENT_JOINED: 'community:event_joined',
  
  // Achievement related events
  ACHIEVEMENT_UNLOCKED: 'achievement:unlocked',
  
  // Resume related events
  RESUME_UPDATED: 'resume:updated',
  
  // Career assessment events
  QUIZ_COMPLETED: 'quiz:completed',
  CAREER_PATH_SELECTED: 'career:path_selected',
  
  // Dashboard UI events
  TAB_CHANGED: 'ui:tab_changed',
  SECTION_EXPANDED: 'ui:section_expanded',
  SECTION_COLLAPSED: 'ui:section_collapsed',
  
  // Notification events
  NOTIFICATION_RECEIVED: 'notification:received',
  NOTIFICATION_READ: 'notification:read',
  
  // Global refresh events
  DASHBOARD_REFRESH: 'dashboard:refresh'
};

// Create a singleton instance for the entire application
export const dashboardEvents = new DashboardEventBus();

// React hook for using the event bus in components
import { useEffect, useRef } from 'react';

export function useDashboardEvents() {
  const componentRef = useRef<object>({});
  
  // Automatically unsubscribe all events when the component unmounts
  useEffect(() => {
    const component = componentRef.current;
    return () => {
      dashboardEvents.unsubscribeAll(component);
    };
  }, []);
  
  // Subscribe to an event
  const subscribe = (eventName: string, callback: EventCallback) => {
    dashboardEvents.on(eventName, callback, componentRef.current);
  };
  
  // Emit an event
  const publish = (eventName: string, data?: any) => {
    dashboardEvents.emit(eventName, data);
  };
  
  return {
    subscribe,
    publish,
    eventNames: DashboardEvents
  };
}