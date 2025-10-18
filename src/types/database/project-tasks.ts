/**
 * Database types for project_tasks table
 * Generated: 2024-12-20T12:00:00Z
 */

export interface ProjectTask {
  id: string;
  project_id: string;
  milestone_id: string | null;
  title: string;
  description: string | null;
  status: 'todo' | 'in_progress' | 'review' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  assigned_to: string | null;
  due_date: string | null;
  estimated_hours: number | null;
  actual_hours: number | null;
  labels: string[];
  task_type: 'development' | 'design' | 'testing' | 'documentation' | 'review' | 'other' | null;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface ProjectTaskInsert {
  id?: string;
  project_id: string;
  milestone_id?: string | null;
  title: string;
  description?: string | null;
  status?: 'todo' | 'in_progress' | 'review' | 'completed' | 'cancelled';
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  assigned_to?: string | null;
  due_date?: string | null;
  estimated_hours?: number | null;
  actual_hours?: number | null;
  labels?: string[];
  task_type?: 'development' | 'design' | 'testing' | 'documentation' | 'review' | 'other' | null;
  sort_order?: number;
}

export interface ProjectTaskUpdate {
  title?: string;
  description?: string | null;
  status?: 'todo' | 'in_progress' | 'review' | 'completed' | 'cancelled';
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  assigned_to?: string | null;
  due_date?: string | null;
  estimated_hours?: number | null;
  actual_hours?: number | null;
  labels?: string[];
  task_type?: 'development' | 'design' | 'testing' | 'documentation' | 'review' | 'other' | null;
  sort_order?: number;
}

// Supabase query result type
export type ProjectTaskRow = ProjectTask;
