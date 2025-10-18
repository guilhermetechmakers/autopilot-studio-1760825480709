/**
 * Database types for notification_delivery_logs table
 * Generated: 2024-12-20T13:00:00Z
 */

import type { NotificationChannel, DeliveryLogStatus } from './notifications';

export interface NotificationDeliveryLog {
  id: string;
  notification_id: string;
  attempt_number: number;
  channel: NotificationChannel;
  status: DeliveryLogStatus;
  provider: string | null;
  provider_message_id: string | null;
  provider_response: Record<string, any>;
  error_code: string | null;
  error_message: string | null;
  error_details: Record<string, any>;
  created_at: string;
}

export interface NotificationDeliveryLogInsert {
  id?: string;
  notification_id: string;
  attempt_number: number;
  channel: NotificationChannel;
  status: DeliveryLogStatus;
  provider?: string | null;
  provider_message_id?: string | null;
  provider_response?: Record<string, any>;
  error_code?: string | null;
  error_message?: string | null;
  error_details?: Record<string, any>;
}

export interface NotificationDeliveryLogUpdate {
  attempt_number?: number;
  channel?: NotificationChannel;
  status?: DeliveryLogStatus;
  provider?: string | null;
  provider_message_id?: string | null;
  provider_response?: Record<string, any>;
  error_code?: string | null;
  error_message?: string | null;
  error_details?: Record<string, any>;
}

// Supabase query result type
export type NotificationDeliveryLogRow = NotificationDeliveryLog;
