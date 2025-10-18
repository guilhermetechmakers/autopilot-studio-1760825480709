/**
 * Notification Panel Component
 * Displays list of notifications with actions
 */

import { X, AlertCircle, Info, CheckCircle, AlertTriangle, FileText, Zap, CreditCard, Calendar, CheckSquare, Settings, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { Notification } from '@/types/database';
import { formatDistanceToNow } from 'date-fns';

interface NotificationPanelProps {
  notifications: Notification[];
  onMarkAsRead: (notificationId: string) => void;
  onClose: () => void;
}

const typeIcons = {
  info: Info,
  success: CheckCircle,
  warning: AlertTriangle,
  error: AlertCircle,
  proposal: FileText,
  approval: CheckSquare,
  deployment: Zap,
  invoice: CreditCard,
  meeting: Calendar,
  task: CheckSquare,
  system: Settings,
};

const typeColors = {
  info: 'text-blue-600 bg-blue-50 border-blue-200',
  success: 'text-green-600 bg-green-50 border-green-200',
  warning: 'text-yellow-600 bg-yellow-50 border-yellow-200',
  error: 'text-red-600 bg-red-50 border-red-200',
  proposal: 'text-purple-600 bg-purple-50 border-purple-200',
  approval: 'text-orange-600 bg-orange-50 border-orange-200',
  deployment: 'text-indigo-600 bg-indigo-50 border-indigo-200',
  invoice: 'text-emerald-600 bg-emerald-50 border-emerald-200',
  meeting: 'text-cyan-600 bg-cyan-50 border-cyan-200',
  task: 'text-slate-600 bg-slate-50 border-slate-200',
  system: 'text-gray-600 bg-gray-50 border-gray-200',
};

export function NotificationPanel({
  notifications,
  onMarkAsRead,
  onClose
}: NotificationPanelProps) {
  const unreadNotifications = notifications.filter(n => n.status === 'pending' || n.status === 'sent');
  const readNotifications = notifications.filter(n => n.status === 'delivered');

  return (
    <Card className="w-80 shadow-lg border-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
        <CardTitle className="text-sm font-medium">
          Notifications
          {unreadNotifications.length > 0 && (
            <Badge variant="secondary" className="ml-2">
              {unreadNotifications.length}
            </Badge>
          )}
        </CardTitle>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="h-6 w-6"
        >
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      
      <CardContent className="p-0">
        <ScrollArea className="h-96">
          <div className="space-y-1 p-2">
            {notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <Bell className="h-8 w-8 text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">No notifications</p>
              </div>
            ) : (
              <>
                {/* Unread notifications */}
                {unreadNotifications.map((notification) => (
                  <NotificationItem
                    key={notification.id}
                    notification={notification}
                    onMarkAsRead={onMarkAsRead}
                    isUnread={true}
                  />
                ))}
                
                {/* Read notifications */}
                {readNotifications.map((notification) => (
                  <NotificationItem
                    key={notification.id}
                    notification={notification}
                    onMarkAsRead={onMarkAsRead}
                    isUnread={false}
                  />
                ))}
              </>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

interface NotificationItemProps {
  notification: Notification;
  onMarkAsRead: (notificationId: string) => void;
  isUnread: boolean;
}

function NotificationItem({ notification, onMarkAsRead, isUnread }: NotificationItemProps) {
  const Icon = typeIcons[notification.type] || Info;
  const typeColor = typeColors[notification.type] || typeColors.info;

  const handleMarkAsRead = () => {
    if (isUnread) {
      onMarkAsRead(notification.id);
    }
  };

  return (
    <div
      className={cn(
        'flex items-start space-x-3 p-3 rounded-lg cursor-pointer transition-colors hover:bg-muted/50',
        isUnread && 'bg-muted/30 border-l-2 border-l-primary'
      )}
      onClick={handleMarkAsRead}
    >
      <div className={cn(
        'flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center',
        typeColor
      )}>
        <Icon className="h-4 w-4" />
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <p className={cn(
            'text-sm font-medium truncate',
            isUnread ? 'text-foreground' : 'text-muted-foreground'
          )}>
            {notification.title}
          </p>
          {isUnread && (
            <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0" />
          )}
        </div>
        
        <p className={cn(
          'text-xs mt-1 line-clamp-2',
          isUnread ? 'text-muted-foreground' : 'text-muted-foreground/70'
        )}>
          {notification.message}
        </p>
        
        <div className="flex items-center justify-between mt-2">
          <span className="text-xs text-muted-foreground">
            {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
          </span>
          
          {notification.priority === 'urgent' && (
            <Badge variant="destructive" className="text-xs">
              Urgent
            </Badge>
          )}
        </div>
      </div>
    </div>
  );
}
