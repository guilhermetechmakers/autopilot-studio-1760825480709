/**
 * Database types for notification_preferences table
 * Generated: 2024-12-20T13:00:00Z
 */

import type { DigestFrequency } from './notifications';

export interface EventPreferences {
  [eventType: string]: {
    [channel: string]: boolean;
  };
}

export interface NotificationPreferences {
  id: string;
  user_id: string;
  email_enabled: boolean;
  in_app_enabled: boolean;
  slack_enabled: boolean;
  webhook_enabled: boolean;
  sms_enabled: boolean;
  event_preferences: EventPreferences;
  quiet_hours_start: string;
  quiet_hours_end: string;
  timezone: string;
  digest_frequency: DigestFrequency;
  slack_webhook_url: string | null;
  slack_channel: string | null;
  webhook_url: string | null;
  webhook_headers: Record<string, any>;
  sms_phone_number: string | null;
  created_at: string;
  updated_at: string;
}

export interface NotificationPreferencesInsert {
  id?: string;
  user_id: string;
  email_enabled?: boolean;
  in_app_enabled?: boolean;
  slack_enabled?: boolean;
  webhook_enabled?: boolean;
  sms_enabled?: boolean;
  event_preferences?: EventPreferences;
  quiet_hours_start?: string;
  quiet_hours_end?: string;
  timezone?: string;
  digest_frequency?: DigestFrequency;
  slack_webhook_url?: string | null;
  slack_channel?: string | null;
  webhook_url?: string | null;
  webhook_headers?: Record<string, any>;
  sms_phone_number?: string | null;
}

export interface NotificationPreferencesUpdate {
  email_enabled?: boolean;
  in_app_enabled?: boolean;
  slack_enabled?: boolean;
  webhook_enabled?: boolean;
  sms_enabled?: boolean;
  event_preferences?: EventPreferences;
  quiet_hours_start?: string;
  quiet_hours_end?: string;
  timezone?: string;
  digest_frequency?: DigestFrequency;
  slack_webhook_url?: string | null;
  slack_channel?: string | null;
  webhook_url?: string | null;
  webhook_headers?: Record<string, any>;
  sms_phone_number?: string | null;
}

// Supabase query result type
export type NotificationPreferencesRow = NotificationPreferences;
