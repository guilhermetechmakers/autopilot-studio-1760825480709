/**
 * Database types for quickbooks_sync table
 * Generated: 2024-12-20T12:00:00Z
 */

export interface QuickBooksSync {
  id: string;
  user_id: string;
  entity_type: 'invoice' | 'payment' | 'customer' | 'item';
  entity_id: string;
  quickbooks_id: string | null;
  status: 'pending' | 'synced' | 'failed' | 'skipped';
  last_sync_at: string | null;
  sync_attempts: number;
  error_message: string | null;
  sync_data: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface QuickBooksSyncInsert {
  id?: string;
  user_id: string;
  entity_type: 'invoice' | 'payment' | 'customer' | 'item';
  entity_id: string;
  quickbooks_id?: string | null;
  status?: 'pending' | 'synced' | 'failed' | 'skipped';
  last_sync_at?: string | null;
  sync_attempts?: number;
  error_message?: string | null;
  sync_data?: Record<string, any>;
}

export interface QuickBooksSyncUpdate {
  quickbooks_id?: string | null;
  status?: 'pending' | 'synced' | 'failed' | 'skipped';
  last_sync_at?: string | null;
  sync_attempts?: number;
  error_message?: string | null;
  sync_data?: Record<string, any>;
}

// Supabase query result type
export type QuickBooksSyncRow = QuickBooksSync;