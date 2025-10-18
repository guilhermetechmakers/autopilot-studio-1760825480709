/**
 * React Query hooks for notifications
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import type { 
  Notification, 
  NotificationPreferences, 
  NotificationTemplate,
  NotificationType,
  NotificationChannel
} from '@/types/database';
import { notificationService } from '@/services/notificationService';
import { templateService } from '@/services/templateService';

// Query keys
export const notificationKeys = {
  all: ['notifications'] as const,
  user: (userId: string) => [...notificationKeys.all, 'user', userId] as const,
  preferences: (userId: string) => [...notificationKeys.all, 'preferences', userId] as const,
  templates: (userId?: string) => [...notificationKeys.all, 'templates', userId] as const,
  publicTemplates: () => [...notificationKeys.all, 'templates', 'public'] as const,
};

/**
 * Hook to get user notifications
 */
export function useNotifications(userId: string, limit: number = 50, offset: number = 0) {
  return useQuery({
    queryKey: notificationKeys.user(userId),
    queryFn: async () => {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .eq('channel', 'in_app')
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) {
        throw new Error(`Failed to fetch notifications: ${error.message}`);
      }

      return data || [];
    },
    enabled: !!userId,
  });
}

/**
 * Hook to get user notification preferences
 */
export function useNotificationPreferences(userId: string) {
  return useQuery({
    queryKey: notificationKeys.preferences(userId),
    queryFn: async () => {
      const { data, error } = await supabase
        .from('notification_preferences')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) {
        // If no preferences found, create default ones
        if (error.code === 'PGRST116') {
          return await createDefaultPreferences(userId);
        }
        throw new Error(`Failed to fetch notification preferences: ${error.message}`);
      }

      return data;
    },
    enabled: !!userId,
  });
}

/**
 * Hook to get user notification templates
 */
export function useNotificationTemplates(userId?: string) {
  return useQuery({
    queryKey: notificationKeys.templates(userId),
    queryFn: async () => {
      if (userId) {
        return await templateService.getUserTemplates(userId);
      } else {
        return await templateService.getPublicTemplates();
      }
    },
  });
}

/**
 * Hook to get public notification templates
 */
export function usePublicNotificationTemplates() {
  return useQuery({
    queryKey: notificationKeys.publicTemplates(),
    queryFn: async () => {
      return await templateService.getPublicTemplates();
    },
  });
}

/**
 * Hook to mark notification as read
 */
export function useMarkNotificationAsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (notificationId: string) => {
      await notificationService.markAsRead(notificationId);
    },
    onSuccess: (_, notificationId) => {
      // Update the notification in the cache
      queryClient.setQueryData(
        notificationKeys.all,
        (oldData: Notification[] | undefined) => {
          if (!oldData) return oldData;
          return oldData.map(notification =>
            notification.id === notificationId
              ? { ...notification, status: 'delivered', delivered_at: new Date().toISOString() }
              : notification
          );
        }
      );
    },
  });
}

/**
 * Hook to send notification
 */
export function useSendNotification() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: {
      userId: string;
      title: string;
      message: string;
      type: NotificationType;
      priority?: 'low' | 'medium' | 'high' | 'urgent';
      channels?: NotificationChannel[];
      content?: Record<string, any>;
      metadata?: Record<string, any>;
      relatedType?: string;
      relatedId?: string;
      scheduledFor?: Date;
      expiresAt?: Date;
    }) => {
      return await notificationService.sendNotification(payload);
    },
    onSuccess: (_notifications, variables) => {
      // Invalidate and refetch notifications for the user
      queryClient.invalidateQueries({
        queryKey: notificationKeys.user(variables.userId),
      });
    },
  });
}

/**
 * Hook to update notification preferences
 */
export function useUpdateNotificationPreferences() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      userId,
      preferences,
    }: {
      userId: string;
      preferences: Partial<NotificationPreferences>;
    }) => {
      const { data, error } = await supabase
        .from('notification_preferences')
        .upsert({
          user_id: userId,
          ...preferences,
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) {
        throw new Error(`Failed to update notification preferences: ${error.message}`);
      }

      return data;
    },
    onSuccess: (_, variables) => {
      // Invalidate and refetch preferences
      queryClient.invalidateQueries({
        queryKey: notificationKeys.preferences(variables.userId),
      });
    },
  });
}

/**
 * Hook to create notification template
 */
export function useCreateNotificationTemplate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (template: {
      user_id: string;
      name: string;
      description?: string;
      event_type: NotificationType;
      channel: NotificationChannel;
      subject_template?: string;
      title_template: string;
      message_template: string;
      html_template?: string;
      slack_template?: string;
      variables?: Record<string, any>;
      is_active?: boolean;
      is_public?: boolean;
    }) => {
      return await templateService.createTemplate(template);
    },
    onSuccess: (_, variables) => {
      // Invalidate templates queries
      queryClient.invalidateQueries({
        queryKey: notificationKeys.templates(variables.user_id),
      });
      queryClient.invalidateQueries({
        queryKey: notificationKeys.publicTemplates(),
      });
    },
  });
}

/**
 * Hook to update notification template
 */
export function useUpdateNotificationTemplate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      updates,
    }: {
      id: string;
      updates: Partial<NotificationTemplate>;
    }) => {
      return await templateService.updateTemplate(id, updates);
    },
    onSuccess: (template) => {
      // Invalidate templates queries
      queryClient.invalidateQueries({
        queryKey: notificationKeys.templates(template.user_id),
      });
      queryClient.invalidateQueries({
        queryKey: notificationKeys.publicTemplates(),
      });
    },
  });
}

/**
 * Hook to delete notification template
 */
export function useDeleteNotificationTemplate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await templateService.deleteTemplate(id);
    },
    onSuccess: () => {
      // Invalidate all template queries
      queryClient.invalidateQueries({
        queryKey: notificationKeys.all,
      });
    },
  });
}

/**
 * Hook to create default notification preferences
 */
export function useCreateDefaultPreferences() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userId: string) => {
      return await createDefaultPreferences(userId);
    },
    onSuccess: (_, userId) => {
      // Invalidate preferences query
      queryClient.invalidateQueries({
        queryKey: notificationKeys.preferences(userId),
      });
    },
  });
}

/**
 * Hook to create default templates
 */
export function useCreateDefaultTemplates() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userId: string) => {
      await templateService.createDefaultTemplates(userId);
    },
    onSuccess: (_, userId) => {
      // Invalidate templates queries
      queryClient.invalidateQueries({
        queryKey: notificationKeys.templates(userId),
      });
      queryClient.invalidateQueries({
        queryKey: notificationKeys.publicTemplates(),
      });
    },
  });
}

/**
 * Helper function to create default notification preferences
 */
async function createDefaultPreferences(userId: string): Promise<NotificationPreferences> {
  const defaultPreferences = {
    user_id: userId,
    email_enabled: true,
    in_app_enabled: true,
    slack_enabled: false,
    webhook_enabled: false,
    sms_enabled: false,
    event_preferences: {
      proposal: { email: true, in_app: true, slack: false },
      approval: { email: true, in_app: true, slack: true },
      deployment: { email: false, in_app: true, slack: true },
      invoice: { email: true, in_app: true, slack: false },
      meeting: { email: true, in_app: true, slack: false },
      task: { email: false, in_app: true, slack: false },
      system: { email: true, in_app: true, slack: true },
    },
    quiet_hours_start: '22:00:00',
    quiet_hours_end: '08:00:00',
    timezone: 'UTC',
    digest_frequency: 'daily' as const,
    webhook_headers: {},
  };

  const { data, error } = await supabase
    .from('notification_preferences')
    .insert(defaultPreferences)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create default preferences: ${error.message}`);
  }

  return data;
}
