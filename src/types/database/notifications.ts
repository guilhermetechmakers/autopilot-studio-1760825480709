/**
 * Database types for notifications table
 * Generated: 2024-12-20T13:00:00Z
 */

export type NotificationType = 
  | 'info' 
  | 'success' 
  | 'warning' 
  | 'error' 
  | 'proposal' 
  | 'approval' 
  | 'deployment' 
  | 'invoice' 
  | 'meeting' 
  | 'task' 
  | 'system';

export type NotificationPriority = 'low' | 'medium' | 'high' | 'urgent';

export type NotificationChannel = 'email' | 'in_app' | 'slack' | 'webhook' | 'sms';

export type NotificationStatus = 'pending' | 'sent' | 'delivered' | 'failed' | 'cancelled';

export type DeliveryLogStatus = 
  | 'attempting' 
  | 'sent' 
  | 'delivered' 
  | 'failed' 
  | 'bounced' 
  | 'opened' 
  | 'clicked';

export type DigestFrequency = 'immediate' | 'hourly' | 'daily' | 'weekly' | 'never';

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: NotificationType;
  priority: NotificationPriority;
  channel: NotificationChannel;
  status: NotificationStatus;
  content: Record<string, any>;
  metadata: Record<string, any>;
  related_type: string | null;
  related_id: string | null;
  delivery_attempts: number;
  max_attempts: number;
  last_attempt_at: string | null;
  delivered_at: string | null;
  failed_at: string | null;
  error_message: string | null;
  next_retry_at: string | null;
  retry_count: number;
  created_at: string;
  updated_at: string;
  scheduled_for: string;
  expires_at: string | null;
}

export interface NotificationInsert {
  id?: string;
  user_id: string;
  title: string;
  message: string;
  type: NotificationType;
  priority?: NotificationPriority;
  channel: NotificationChannel;
  status?: NotificationStatus;
  content?: Record<string, any>;
  metadata?: Record<string, any>;
  related_type?: string | null;
  related_id?: string | null;
  delivery_attempts?: number;
  max_attempts?: number;
  last_attempt_at?: string | null;
  delivered_at?: string | null;
  failed_at?: string | null;
  error_message?: string | null;
  next_retry_at?: string | null;
  retry_count?: number;
  scheduled_for?: string;
  expires_at?: string | null;
}

export interface NotificationUpdate {
  title?: string;
  message?: string;
  type?: NotificationType;
  priority?: NotificationPriority;
  channel?: NotificationChannel;
  status?: NotificationStatus;
  content?: Record<string, any>;
  metadata?: Record<string, any>;
  related_type?: string | null;
  related_id?: string | null;
  delivery_attempts?: number;
  max_attempts?: number;
  last_attempt_at?: string | null;
  delivered_at?: string | null;
  failed_at?: string | null;
  error_message?: string | null;
  next_retry_at?: string | null;
  retry_count?: number;
  scheduled_for?: string;
  expires_at?: string | null;
}

// Supabase query result type
export type NotificationRow = Notification;
