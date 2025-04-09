import React from 'react';
import { useDashboard } from '@/hooks/useDashboardContext';
import { useDashboardEvents } from '@/lib/dashboardEventBus';
import { Bell, Check, X, MessageSquare } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Sheet, 
  SheetContent, 
  SheetDescription, 
  SheetHeader, 
  SheetTitle, 
  SheetTrigger 
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { formatDistance } from 'date-fns';

// Individual notification item
const NotificationItem: React.FC<{
  id: string;
  type: string;
  title: string;
  message: string;
  date: string;
  isRead: boolean;
  onMarkRead: (id: string) => void;
  onAction?: (id: string, type: string, entityId?: number) => void;
  relatedEntity?: {
    type: string;
    id: number;
  };
}> = ({ 
  id, 
  type, 
  title, 
  message, 
  date, 
  isRead, 
  onMarkRead, 
  onAction,
  relatedEntity 
}) => {
  const timeAgo = formatDistance(new Date(date), new Date(), { addSuffix: true });
  
  // Handle clicking the notification action button
  const handleAction = () => {
    if (onAction && relatedEntity) {
      onAction(id, relatedEntity.type, relatedEntity.id);
    }
  };
  
  return (
    <div className={`p-4 ${isRead ? 'bg-white' : 'bg-blue-50'} border-b last:border-b-0`}>
      <div className="flex justify-between items-start">
        <h4 className="font-medium text-sm">{title}</h4>
        <div className="flex space-x-1">
          {!isRead && (
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-6 w-6" 
              onClick={() => onMarkRead(id)}
            >
              <Check className="h-4 w-4" />
              <span className="sr-only">Mark as read</span>
            </Button>
          )}
        </div>
      </div>
      <p className="text-sm text-gray-600 mt-1">{message}</p>
      <div className="flex justify-between items-center mt-3">
        <span className="text-xs text-gray-500">{timeAgo}</span>
        
        {relatedEntity && (
          <Button 
            variant="link" 
            size="sm" 
            className="h-6 p-0 text-primary" 
            onClick={handleAction}
          >
            View {relatedEntity.type}
          </Button>
        )}
      </div>
    </div>
  );
};

// Notification counter badge for the trigger button
const NotificationCounter: React.FC<{
  count: number;
}> = ({ count }) => {
  if (count === 0) return null;
  
  return (
    <Badge 
      variant="destructive" 
      className="absolute -top-2 -right-2 h-5 min-w-5 flex items-center justify-center p-0 px-[5px]"
    >
      {count > 99 ? '99+' : count}
    </Badge>
  );
};

// Collapsible notifications panel component
const NotificationsPanel: React.FC<{
  onNotificationAction?: (id: string, type: string, entityId?: number) => void;
}> = ({ onNotificationAction }) => {
  const { 
    notifications, 
    notificationCount, 
    hasNotifications,
    markNotificationRead, 
    markAllNotificationsRead 
  } = useDashboard();
  const { subscribe, publish, eventNames } = useDashboardEvents();
  
  // Handle notification action
  const handleNotificationAction = (id: string, type: string, entityId?: number) => {
    // Mark the notification as read
    markNotificationRead(id);
    
    // Publish an event that this notification was acted upon
    publish(eventNames.NOTIFICATION_READ, { id, type, entityId });
    
    // Call the optional handler
    if (onNotificationAction) {
      onNotificationAction(id, type, entityId);
    }
  };
  
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <NotificationCounter count={notificationCount} />
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Notifications</SheetTitle>
          <SheetDescription>
            Stay updated with the latest happenings across your learning journey
          </SheetDescription>
        </SheetHeader>
        
        <div className="py-4">
          {hasNotifications ? (
            <div className="flex justify-end">
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-xs"
                onClick={markAllNotificationsRead}
              >
                Mark all as read
              </Button>
            </div>
          ) : null}
          
          <ScrollArea className="h-[calc(100vh-200px)] mt-2">
            {notifications.length > 0 ? (
              <div className="divide-y">
                {notifications.map((notification) => (
                  <NotificationItem
                    key={notification.id}
                    id={notification.id}
                    type={notification.type}
                    title={notification.title}
                    message={notification.message}
                    date={notification.date}
                    isRead={notification.isRead}
                    onMarkRead={markNotificationRead}
                    onAction={handleNotificationAction}
                    relatedEntity={notification.relatedEntity}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-10">
                <MessageSquare className="h-8 w-8 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No notifications yet</p>
                <p className="text-sm text-gray-400 mt-1">
                  Notifications will appear here as you interact with the platform
                </p>
              </div>
            )}
          </ScrollArea>
        </div>
      </SheetContent>
    </Sheet>
  );
};

// Simplified mini notifications card for dashboard
export const NotificationsCard: React.FC<{
  maxItems?: number;
  onViewAll?: () => void;
  onNotificationAction?: (id: string, type: string, entityId?: number) => void;
}> = ({ 
  maxItems = 3, 
  onViewAll, 
  onNotificationAction 
}) => {
  const { 
    notifications, 
    hasNotifications,
    markNotificationRead
  } = useDashboard();
  
  // Show only the most recent unread notifications
  const recentNotifications = notifications
    .filter(n => !n.isRead)
    .slice(0, maxItems);
  
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg">Notifications</CardTitle>
          {hasNotifications && <Badge variant="destructive">{notifications.filter(n => !n.isRead).length}</Badge>}
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        {recentNotifications.length > 0 ? (
          <div className="space-y-4">
            {recentNotifications.map((notification) => (
              <NotificationItem
                key={notification.id}
                id={notification.id}
                type={notification.type}
                title={notification.title}
                message={notification.message}
                date={notification.date}
                isRead={notification.isRead}
                onMarkRead={markNotificationRead}
                onAction={onNotificationAction}
                relatedEntity={notification.relatedEntity}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-6">
            <p className="text-gray-500">No new notifications</p>
          </div>
        )}
      </CardContent>
      {hasNotifications && (
        <CardFooter>
          <Button variant="ghost" size="sm" onClick={onViewAll} className="w-full">
            View all notifications
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default NotificationsPanel;