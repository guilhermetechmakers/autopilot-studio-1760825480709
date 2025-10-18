/**
 * Database types for projects table
 * Generated: 2024-12-20T12:00:00Z
 */

export interface Project {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  client_name: string;
  client_email: string | null;
  status: 'active' | 'paused' | 'completed' | 'cancelled';
  budget: number | null;
  start_date: string | null;
  end_date: string | null;
  estimated_hours: number | null;
  metadata: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface ProjectInsert {
  id?: string;
  user_id: string;
  name: string;
  description?: string | null;
  client_name: string;
  client_email?: string | null;
  status?: 'active' | 'paused' | 'completed' | 'cancelled';
  budget?: number | null;
  start_date?: string | null;
  end_date?: string | null;
  estimated_hours?: number | null;
  metadata?: Record<string, any>;
}

export interface ProjectUpdate {
  name?: string;
  description?: string | null;
  client_name?: string;
  client_email?: string | null;
  status?: 'active' | 'paused' | 'completed' | 'cancelled';
  budget?: number | null;
  start_date?: string | null;
  end_date?: string | null;
  estimated_hours?: number | null;
  metadata?: Record<string, any>;
}

// Supabase query result type
export type ProjectRow = Project;
