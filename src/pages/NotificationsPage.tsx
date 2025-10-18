/**
 * Notifications Page
 * Main page for managing notifications and settings
 */

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bell, Settings, Send, FileText } from 'lucide-react';
import { useNotifications, useNotificationPreferences, useSendNotification, useCreateDefaultTemplates } from '@/hooks/useNotifications';
import { NotificationBell, NotificationSettings } from '@/components/notifications';
import { useMarkNotificationAsRead } from '@/hooks/useNotifications';
import { toast } from 'sonner';

// Mock user ID - in real app this would come from auth context
const MOCK_USER_ID = 'mock-user-id';

export function NotificationsPage() {
  const { data: notifications = [], isLoading: notificationsLoading } = useNotifications(MOCK_USER_ID);
  const { data: preferences, isLoading: preferencesLoading } = useNotificationPreferences(MOCK_USER_ID);
  const markAsRead = useMarkNotificationAsRead();
  const sendNotification = useSendNotification();
  const createDefaultTemplates = useCreateDefaultTemplates();

  const unreadCount = notifications.filter(n => n.status === 'pending' || n.status === 'sent').length;

  const handleMarkAsRead = (notificationId: string) => {
    markAsRead.mutate(notificationId, {
      onSuccess: () => {
        toast.success('Notification marked as read');
      },
      onError: () => {
        toast.error('Failed to mark notification as read');
      }
    });
  };

  const handleSendTestNotification = () => {
    sendNotification.mutate({
      userId: MOCK_USER_ID,
      title: 'Test Notification',
      message: 'This is a test notification to demonstrate the system.',
      type: 'info',
      priority: 'medium',
      channels: ['in_app', 'email'],
      content: {
        action_url: '/notifications',
        action_text: 'View Notifications'
      }
    }, {
      onSuccess: () => {
        toast.success('Test notification sent');
      },
      onError: () => {
        toast.error('Failed to send test notification');
      }
    });
  };

  const handleCreateDefaultTemplates = () => {
    createDefaultTemplates.mutate(MOCK_USER_ID, {
      onSuccess: () => {
        toast.success('Default templates created');
      },
      onError: () => {
        toast.error('Failed to create default templates');
      }
    });
  };

  if (preferencesLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading notification settings...</p>
        </div>
      </div>
    );
  }

  if (!preferences) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">No notification preferences found</p>
          <Button onClick={() => window.location.reload()}>
            Refresh Page
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Notifications</h1>
          <p className="text-muted-foreground">
            Manage your notification preferences and view recent notifications
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <NotificationBell
            notifications={notifications}
            unreadCount={unreadCount}
            onMarkAsRead={handleMarkAsRead}
          />
          <Button onClick={handleSendTestNotification} disabled={sendNotification.isPending}>
            <Send className="h-4 w-4 mr-2" />
            Send Test
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Notifications</CardTitle>
                <Bell className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{notifications.length}</div>
                <p className="text-xs text-muted-foreground">
                  {unreadCount} unread
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Channels</CardTitle>
                <Settings className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {Object.values(preferences).filter(value => typeof value === 'boolean' && value).length}
                </div>
                <p className="text-xs text-muted-foreground">
                  notification channels enabled
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Event Types</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {Object.keys(preferences.event_preferences).length}
                </div>
                <p className="text-xs text-muted-foreground">
                  configured event types
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Recent Notifications</CardTitle>
              <CardDescription>
                Your most recent notifications
              </CardDescription>
            </CardHeader>
            <CardContent>
              {notificationsLoading ? (
                <div className="space-y-3">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="animate-pulse">
                      <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                      <div className="h-3 bg-muted rounded w-1/2"></div>
                    </div>
                  ))}
                </div>
              ) : notifications.length === 0 ? (
                <div className="text-center py-8">
                  <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No notifications yet</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Send a test notification to see how it works
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {notifications.slice(0, 5).map((notification) => (
                    <div
                      key={notification.id}
                      className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 cursor-pointer"
                      onClick={() => handleMarkAsRead(notification.id)}
                    >
                      <div className="space-y-1">
                        <p className="text-sm font-medium">{notification.title}</p>
                        <p className="text-xs text-muted-foreground">{notification.message}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant={notification.priority === 'urgent' ? 'destructive' : 'secondary'}>
                          {notification.priority}
                        </Badge>
                        {notification.status === 'pending' || notification.status === 'sent' ? (
                          <div className="w-2 h-2 bg-primary rounded-full"></div>
                        ) : null}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings">
          <NotificationSettings preferences={preferences} userId={MOCK_USER_ID} />
        </TabsContent>

        <TabsContent value="templates" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Notification Templates</CardTitle>
              <CardDescription>
                Manage your notification templates and create default ones
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground mb-4">No templates created yet</p>
                <Button onClick={handleCreateDefaultTemplates} disabled={createDefaultTemplates.isPending}>
                  <FileText className="h-4 w-4 mr-2" />
                  {createDefaultTemplates.isPending ? 'Creating...' : 'Create Default Templates'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Notification History</CardTitle>
              <CardDescription>
                View all your notifications and their delivery status
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Notification history will appear here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
