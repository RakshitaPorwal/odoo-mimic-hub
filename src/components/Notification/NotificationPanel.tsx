import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Bell, CheckCircle, Clock, X } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { format } from "date-fns";
import { notificationService, Notification } from "@/services/notificationService";
import { toast } from "@/hooks/use-toast";

const NotificationPanel = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const unreadCount = notifications.filter(n => !n.read).length;

  useEffect(() => {
    fetchNotifications();
    let unsubscribe: (() => void) | undefined;

    const setupSubscription = async () => {
      unsubscribe = await notificationService.subscribeToNotifications((notification) => {
        setNotifications(prev => [notification, ...prev]);
        // Show a toast for new notifications
        toast({
          title: notification.title,
          description: notification.description,
        });
      });
    };

    setupSubscription();

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

  const fetchNotifications = async () => {
    try {
      setIsLoading(true);
      const data = await notificationService.getNotifications();
      setNotifications(data);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      toast({
        title: "Error",
        description: "Failed to fetch notifications",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const markAsRead = async (id: number) => {
    try {
      const updatedNotification = await notificationService.markAsRead(id);
      if (updatedNotification) {
        setNotifications(notifications.map(n => 
          n.id === id ? updatedNotification : n
        ));
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
      toast({
        title: "Error",
        description: "Failed to mark notification as read",
        variant: "destructive",
      });
    }
  };

  const markAllAsRead = async () => {
    try {
      const success = await notificationService.markAllAsRead();
      if (success) {
        setNotifications(notifications.map(n => ({ ...n, read: true })));
      }
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      toast({
        title: "Error",
        description: "Failed to mark all notifications as read",
        variant: "destructive",
      });
    }
  };

  const deleteNotification = async (id: number) => {
    try {
      const success = await notificationService.deleteNotification(id);
      if (success) {
        setNotifications(notifications.filter(n => n.id !== id));
      }
    } catch (error) {
      console.error('Error deleting notification:', error);
      toast({
        title: "Error",
        description: "Failed to delete notification",
        variant: "destructive",
      });
    }
  };

  const clearAll = async () => {
    try {
      const success = await notificationService.clearAll();
      if (success) {
        setNotifications([]);
      }
    } catch (error) {
      console.error('Error clearing notifications:', error);
      toast({
        title: "Error",
        description: "Failed to clear notifications",
        variant: "destructive",
      });
    }
  };

  const cleanupOldNotifications = async () => {
    try {
      await notificationService.cleanupOldNotifications();
      await fetchNotifications(); // Refresh the notifications list
      toast({
        title: "Cleanup Complete",
        description: "Old notifications have been cleaned up",
      });
    } catch (error) {
      console.error('Error cleaning up old notifications:', error);
      toast({
        title: "Error",
        description: "Failed to clean up old notifications",
        variant: "destructive",
      });
    }
  };

  const formatTimeAgo = (date: string) => {
    const notificationDate = new Date(date);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - notificationDate.getTime()) / 1000);

    if (diffInSeconds < 60) return `${diffInSeconds} seconds ago`;
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    return format(notificationDate, 'MMM d, yyyy');
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'task':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'invoice':
        return <Bell className="h-4 w-4 text-blue-500" />;
      case 'message':
        return <Bell className="h-4 w-4 text-purple-500" />;
      default:
        return <Clock className="h-4 w-4 text-muted-foreground" />;
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs">
              {unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-96 p-0" align="end">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="font-medium">Notifications</h3>
          <div className="flex gap-2">
            {unreadCount > 0 && (
              <Button variant="ghost" size="sm" onClick={markAllAsRead}>
                Mark all as read
              </Button>
            )}
            {notifications.length > 0 && (
              <>
                <Button variant="ghost" size="sm" onClick={cleanupOldNotifications}>
                  Clean up old
                </Button>
                <Button variant="ghost" size="sm" onClick={clearAll}>
                  Clear all
                </Button>
              </>
            )}
          </div>
        </div>
        
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="w-full">
            <TabsTrigger value="all" className="flex-1">All</TabsTrigger>
            <TabsTrigger value="unread" className="flex-1">Unread {unreadCount > 0 && `(${unreadCount})`}</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="p-0">
            <ScrollArea className="h-[300px]">
              {isLoading ? (
                <div className="text-center py-6 text-muted-foreground">
                  Loading notifications...
                </div>
              ) : notifications.length === 0 ? (
                <div className="text-center py-6 text-muted-foreground">
                  No notifications
                </div>
              ) : (
                <div className="divide-y">
                  {notifications.map((notification) => (
                    <div 
                      key={notification.id}
                      className={`p-4 hover:bg-muted flex items-start gap-3 transition-colors ${!notification.read ? 'bg-muted/50' : ''}`}
                    >
                      <div className="mt-0.5">
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start">
                          <h4 className={`font-medium text-sm ${!notification.read ? 'text-foreground' : 'text-muted-foreground'}`}>
                            {notification.title}
                          </h4>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-muted-foreground whitespace-nowrap">
                              {formatTimeAgo(notification.created)}
                            </span>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-6 w-6"
                              onClick={() => deleteNotification(notification.id)}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-2">{notification.description}</p>
                        
                        {!notification.read && (
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="mt-1 h-7 text-xs"
                            onClick={() => markAsRead(notification.id)}
                          >
                            Mark as read
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </TabsContent>
          
          <TabsContent value="unread" className="p-0">
            <ScrollArea className="h-[300px]">
              {isLoading ? (
                <div className="text-center py-6 text-muted-foreground">
                  Loading notifications...
                </div>
              ) : unreadCount === 0 ? (
                <div className="text-center py-6 text-muted-foreground">
                  No unread notifications
                </div>
              ) : (
                <div className="divide-y">
                  {notifications.filter(n => !n.read).map((notification) => (
                    <div 
                      key={notification.id}
                      className="p-4 hover:bg-muted flex items-start gap-3 transition-colors bg-muted/50"
                    >
                      <div className="mt-0.5">
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start">
                          <h4 className="font-medium text-sm text-foreground">
                            {notification.title}
                          </h4>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-muted-foreground whitespace-nowrap">
                              {formatTimeAgo(notification.created)}
                            </span>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-6 w-6"
                              onClick={() => deleteNotification(notification.id)}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-2">{notification.description}</p>
                        
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="mt-1 h-7 text-xs"
                          onClick={() => markAsRead(notification.id)}
                        >
                          Mark as read
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </PopoverContent>
    </Popover>
  );
};

export default NotificationPanel;
