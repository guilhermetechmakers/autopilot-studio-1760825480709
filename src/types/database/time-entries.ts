/**
 * Database types for time_entries table
 * Generated: 2024-12-20T12:00:00Z
 */

export interface TimeEntry {
  id: string;
  user_id: string;
  project_id: string;
  task_id: string | null;
  invoice_id: string | null;
  description: string;
  start_time: string;
  end_time: string | null;
  duration_minutes: number | null;
  billable_hours: number | null;
  hourly_rate: number | null;
  total_amount: number | null;
  currency: 'USD' | 'EUR' | 'GBP' | 'CAD';
  status: 'active' | 'billed' | 'paid' | 'cancelled';
  notes: string | null;
  metadata: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface TimeEntryInsert {
  id?: string;
  user_id: string;
  project_id: string;
  task_id?: string | null;
  invoice_id?: string | null;
  description: string;
  start_time: string;
  end_time?: string | null;
  duration_minutes?: number | null;
  billable_hours?: number | null;
  hourly_rate?: number | null;
  total_amount?: number | null;
  currency?: 'USD' | 'EUR' | 'GBP' | 'CAD';
  status?: 'active' | 'billed' | 'paid' | 'cancelled';
  notes?: string | null;
  metadata?: Record<string, any>;
}

export interface TimeEntryUpdate {
  task_id?: string | null;
  invoice_id?: string | null;
  description?: string;
  start_time?: string;
  end_time?: string | null;
  duration_minutes?: number | null;
  billable_hours?: number | null;
  hourly_rate?: number | null;
  total_amount?: number | null;
  currency?: 'USD' | 'EUR' | 'GBP' | 'CAD';
  status?: 'active' | 'billed' | 'paid' | 'cancelled';
  notes?: string | null;
  metadata?: Record<string, any>;
}

// Supabase query result type
export type TimeEntryRow = TimeEntry;