/**
 * Database types for notification_templates table
 * Generated: 2024-12-20T13:00:00Z
 */

import type { NotificationType, NotificationChannel } from './notifications';

export interface NotificationTemplate {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  event_type: NotificationType;
  channel: NotificationChannel;
  subject_template: string | null;
  title_template: string;
  message_template: string;
  html_template: string | null;
  slack_template: string | null;
  variables: Record<string, any>;
  is_active: boolean;
  is_public: boolean;
  version: string;
  usage_count: number;
  last_used_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface NotificationTemplateInsert {
  id?: string;
  user_id: string;
  name: string;
  description?: string | null;
  event_type: NotificationType;
  channel: NotificationChannel;
  subject_template?: string | null;
  title_template: string;
  message_template: string;
  html_template?: string | null;
  slack_template?: string | null;
  variables?: Record<string, any>;
  is_active?: boolean;
  is_public?: boolean;
  version?: string;
  usage_count?: number;
  last_used_at?: string | null;
}

export interface NotificationTemplateUpdate {
  name?: string;
  description?: string | null;
  event_type?: NotificationType;
  channel?: NotificationChannel;
  subject_template?: string | null;
  title_template?: string;
  message_template?: string;
  html_template?: string | null;
  slack_template?: string | null;
  variables?: Record<string, any>;
  is_active?: boolean;
  is_public?: boolean;
  version?: string;
  usage_count?: number;
  last_used_at?: string | null;
}

// Supabase query result type
export type NotificationTemplateRow = NotificationTemplate;
