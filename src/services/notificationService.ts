/**
 * Comprehensive Notification Service
 * Handles multi-channel notifications with retry, backoff, and templating
 */

import { supabase } from '@/lib/supabase';
import type { 
  Notification, 
  NotificationInsert, 
  NotificationType, 
  NotificationChannel, 
  NotificationPriority,
  NotificationPreferences,
  DeliveryLogStatus
} from '@/types/database';

export interface NotificationPayload {
  userId: string;
  title: string;
  message: string;
  type: NotificationType;
  priority?: NotificationPriority;
  channels?: NotificationChannel[];
  content?: Record<string, any>;
  metadata?: Record<string, any>;
  relatedType?: string;
  relatedId?: string;
  scheduledFor?: Date;
  expiresAt?: Date;
  templateId?: string;
  variables?: Record<string, any>;
}

export interface DeliveryResult {
  success: boolean;
  channel: NotificationChannel;
  messageId?: string;
  error?: string;
  retryAfter?: number;
}

export interface NotificationProvider {
  name: string;
  send: (notification: Notification, preferences: NotificationPreferences) => Promise<DeliveryResult>;
  validate: (preferences: NotificationPreferences) => boolean;
}

class NotificationService {
  private providers: Map<NotificationChannel, NotificationProvider> = new Map();
  private retryDelays = [1000, 5000, 15000, 60000, 300000]; // 1s, 5s, 15s, 1m, 5m

  constructor() {
    this.initializeProviders();
  }

  private initializeProviders() {
    // In-app notification provider
    this.providers.set('in_app', {
      name: 'in_app',
      send: this.sendInAppNotification.bind(this),
      validate: () => true // Always available
    });

    // Email provider (placeholder - would integrate with SendGrid, AWS SES, etc.)
    this.providers.set('email', {
      name: 'email',
      send: this.sendEmailNotification.bind(this),
      validate: (prefs) => prefs.email_enabled
    });

    // Slack provider
    this.providers.set('slack', {
      name: 'slack',
      send: this.sendSlackNotification.bind(this),
      validate: (prefs) => prefs.slack_enabled && !!prefs.slack_webhook_url
    });

    // Webhook provider
    this.providers.set('webhook', {
      name: 'webhook',
      send: this.sendWebhookNotification.bind(this),
      validate: (prefs) => prefs.webhook_enabled && !!prefs.webhook_url
    });

    // SMS provider (placeholder - would integrate with Twilio, etc.)
    this.providers.set('sms', {
      name: 'sms',
      send: this.sendSmsNotification.bind(this),
      validate: (prefs) => prefs.sms_enabled && !!prefs.sms_phone_number
    });
  }

  /**
   * Send notification to user across multiple channels
   */
  async sendNotification(payload: NotificationPayload): Promise<Notification[]> {
    const { userId, channels = ['in_app'], ...notificationData } = payload;

    // Get user preferences
    const preferences = await this.getUserPreferences(userId);
    if (!preferences) {
      throw new Error('User preferences not found');
    }

    // Filter channels based on user preferences and event type
    const enabledChannels = channels.filter(channel => 
      this.shouldSendNotification(userId, notificationData.type, channel, preferences)
    );

    if (enabledChannels.length === 0) {
      console.log(`No enabled channels for user ${userId} and event type ${notificationData.type}`);
      return [];
    }

    // Create notifications for each channel
    const notifications: Notification[] = [];
    
    for (const channel of enabledChannels) {
      try {
        const notification = await this.createNotification({
          ...notificationData,
          user_id: userId,
          channel,
          scheduled_for: (notificationData.scheduledFor || new Date()).toISOString()
        });

        notifications.push(notification);

        // Process notification immediately if not scheduled
        if (!notificationData.scheduledFor) {
          this.processNotification(notification, preferences).catch(console.error);
        }
      } catch (error) {
        console.error(`Failed to create notification for channel ${channel}:`, error);
      }
    }

    return notifications;
  }

  /**
   * Process a single notification (send via appropriate channel)
   */
  async processNotification(notification: Notification, preferences: NotificationPreferences): Promise<void> {
    const provider = this.providers.get(notification.channel);
    if (!provider) {
      console.error(`No provider found for channel: ${notification.channel}`);
      return;
    }

    if (!provider.validate(preferences)) {
      console.log(`Provider validation failed for channel: ${notification.channel}`);
      await this.updateNotificationStatus(notification.id, 'cancelled');
      return;
    }

    try {
      // Log delivery attempt
      await this.logDeliveryAttempt(notification.id, 'attempting');

      // Send notification
      const result = await provider.send(notification, preferences);

      if (result.success) {
        await this.updateNotificationStatus(notification.id, 'sent', {
          delivered_at: new Date().toISOString(),
          provider_message_id: result.messageId
        });
        await this.logDeliveryAttempt(notification.id, 'sent', {
          provider_message_id: result.messageId
        });
      } else {
        await this.handleDeliveryFailure(notification, result.error || 'Unknown error');
      }
    } catch (error) {
      console.error(`Failed to send notification ${notification.id}:`, error);
      await this.handleDeliveryFailure(notification, error instanceof Error ? error.message : 'Unknown error');
    }
  }

  /**
   * Handle delivery failure with retry logic
   */
  private async handleDeliveryFailure(notification: Notification, error: string): Promise<void> {
    const retryCount = notification.retry_count + 1;
    const maxAttempts = notification.max_attempts;

    if (retryCount >= maxAttempts) {
      // Max retries reached, mark as failed
      await this.updateNotificationStatus(notification.id, 'failed', {
        failed_at: new Date().toISOString(),
        error_message: error
      });
      await this.logDeliveryAttempt(notification.id, 'failed', { error_message: error });
    } else {
      // Schedule retry with exponential backoff
      const delay = this.retryDelays[Math.min(retryCount - 1, this.retryDelays.length - 1)];
      const nextRetryAt = new Date(Date.now() + delay);

      await this.updateNotificationStatus(notification.id, 'pending', {
        retry_count: retryCount,
        next_retry_at: nextRetryAt.toISOString(),
        error_message: error
      });
      await this.logDeliveryAttempt(notification.id, 'failed', { 
        error_message: error,
        next_retry_at: nextRetryAt.toISOString()
      });
    }
  }

  /**
   * Check if user should receive notification for event type and channel
   */
  private shouldSendNotification(
    _userId: string, 
    eventType: NotificationType, 
    channel: NotificationChannel,
    preferences: NotificationPreferences
  ): boolean {
    // Check if channel is enabled
    const channelEnabled = this.getChannelEnabled(preferences, channel);
    if (!channelEnabled) return false;

    // Check if event type is enabled for this channel
    const eventEnabled = preferences.event_preferences[eventType]?.[channel] ?? false;
    return eventEnabled;
  }

  /**
   * Get channel enabled status from preferences
   */
  private getChannelEnabled(preferences: NotificationPreferences, channel: NotificationChannel): boolean {
    switch (channel) {
      case 'email': return preferences.email_enabled;
      case 'in_app': return preferences.in_app_enabled;
      case 'slack': return preferences.slack_enabled;
      case 'webhook': return preferences.webhook_enabled;
      case 'sms': return preferences.sms_enabled;
      default: return false;
    }
  }

  /**
   * Create notification record in database
   */
  private async createNotification(data: NotificationInsert): Promise<Notification> {
    const { data: notification, error } = await supabase
      .from('notifications')
      .insert(data)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create notification: ${error.message}`);
    }

    return notification;
  }

  /**
   * Update notification status
   */
  private async updateNotificationStatus(
    notificationId: string, 
    status: string, 
    updates: Record<string, any> = {}
  ): Promise<void> {
    const { error } = await supabase
      .from('notifications')
      .update({ 
        status, 
        updated_at: new Date().toISOString(),
        ...updates 
      })
      .eq('id', notificationId);

    if (error) {
      console.error(`Failed to update notification status: ${error.message}`);
    }
  }

  /**
   * Log delivery attempt
   */
  private async logDeliveryAttempt(
    notificationId: string, 
    status: DeliveryLogStatus,
    details: Record<string, any> = {}
  ): Promise<void> {
    const { error } = await supabase
      .from('notification_delivery_logs')
      .insert({
        notification_id: notificationId,
        attempt_number: 1, // This should be calculated based on existing logs
        channel: 'in_app', // This should be passed as parameter
        status,
        ...details
      });

    if (error) {
      console.error(`Failed to log delivery attempt: ${error.message}`);
    }
  }

  /**
   * Get user notification preferences
   */
  private async getUserPreferences(userId: string): Promise<NotificationPreferences | null> {
    const { data, error } = await supabase
      .from('notification_preferences')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) {
      console.error(`Failed to get user preferences: ${error.message}`);
      return null;
    }

    return data;
  }

  // Provider implementations

  private async sendInAppNotification(notification: Notification, _preferences: NotificationPreferences): Promise<DeliveryResult> {
    // In-app notifications are immediately "delivered" since they're stored in the database
    return {
      success: true,
      channel: 'in_app',
      messageId: notification.id
    };
  }

  private async sendEmailNotification(notification: Notification, _preferences: NotificationPreferences): Promise<DeliveryResult> {
    // TODO: Integrate with email service (SendGrid, AWS SES, etc.)
    console.log('Sending email notification:', notification.title);
    
    // Placeholder implementation
    return {
      success: true,
      channel: 'email',
      messageId: `email_${notification.id}`
    };
  }

  private async sendSlackNotification(notification: Notification, preferences: NotificationPreferences): Promise<DeliveryResult> {
    if (!preferences.slack_webhook_url) {
      return {
        success: false,
        channel: 'slack',
        error: 'Slack webhook URL not configured'
      };
    }

    try {
      const slackMessage = {
        text: notification.title,
        blocks: [
          {
            type: 'section',
            text: {
              type: 'mrkdwn',
              text: `*${notification.title}*\n${notification.message}`
            }
          }
        ]
      };

      const response = await fetch(preferences.slack_webhook_url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(slackMessage)
      });

      if (!response.ok) {
        throw new Error(`Slack API error: ${response.statusText}`);
      }

      return {
        success: true,
        channel: 'slack',
        messageId: `slack_${notification.id}`
      };
    } catch (error) {
      return {
        success: false,
        channel: 'slack',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  private async sendWebhookNotification(notification: Notification, preferences: NotificationPreferences): Promise<DeliveryResult> {
    if (!preferences.webhook_url) {
      return {
        success: false,
        channel: 'webhook',
        error: 'Webhook URL not configured'
      };
    }

    try {
      const webhookPayload = {
        notification: {
          id: notification.id,
          title: notification.title,
          message: notification.message,
          type: notification.type,
          priority: notification.priority,
          content: notification.content,
          metadata: notification.metadata,
          related_type: notification.related_type,
          related_id: notification.related_id,
          created_at: notification.created_at
        }
      };

      const response = await fetch(preferences.webhook_url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...preferences.webhook_headers
        },
        body: JSON.stringify(webhookPayload)
      });

      if (!response.ok) {
        throw new Error(`Webhook error: ${response.statusText}`);
      }

      return {
        success: true,
        channel: 'webhook',
        messageId: `webhook_${notification.id}`
      };
    } catch (error) {
      return {
        success: false,
        channel: 'webhook',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  private async sendSmsNotification(notification: Notification, preferences: NotificationPreferences): Promise<DeliveryResult> {
    if (!preferences.sms_phone_number) {
      return {
        success: false,
        channel: 'sms',
        error: 'SMS phone number not configured'
      };
    }

    // TODO: Integrate with SMS service (Twilio, AWS SNS, etc.)
    console.log('Sending SMS notification:', notification.title, 'to', preferences.sms_phone_number);
    
    // Placeholder implementation
    return {
      success: true,
      channel: 'sms',
      messageId: `sms_${notification.id}`
    };
  }

  /**
   * Process pending notifications (for background job)
   */
  async processPendingNotifications(): Promise<void> {
    const { data: notifications, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('status', 'pending')
      .lte('scheduled_for', new Date().toISOString())
      .lte('next_retry_at', new Date().toISOString())
      .limit(100);

    if (error) {
      console.error('Failed to fetch pending notifications:', error);
      return;
    }

    for (const notification of notifications || []) {
      const preferences = await this.getUserPreferences(notification.user_id);
      if (preferences) {
        this.processNotification(notification, preferences).catch(console.error);
      }
    }
  }

  /**
   * Mark notification as read
   */
  async markAsRead(notificationId: string): Promise<void> {
    const { error } = await supabase
      .from('notifications')
      .update({ 
        status: 'delivered',
        delivered_at: new Date().toISOString()
      })
      .eq('id', notificationId);

    if (error) {
      console.error(`Failed to mark notification as read: ${error.message}`);
    }
  }

  /**
   * Get user notifications
   */
  async getUserNotifications(
    userId: string, 
    limit: number = 50, 
    offset: number = 0
  ): Promise<Notification[]> {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .eq('channel', 'in_app')
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      console.error('Failed to fetch user notifications:', error);
      return [];
    }

    return data || [];
  }
}

// Export singleton instance
export const notificationService = new NotificationService();
export default notificationService;
