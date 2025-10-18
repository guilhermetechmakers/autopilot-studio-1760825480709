/**
 * Database types for project_milestones table
 * Generated: 2024-12-20T12:00:00Z
 */

export interface ProjectMilestone {
  id: string;
  project_id: string;
  name: string;
  description: string | null;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  due_date: string | null;
  billing_amount: number | null;
  billing_trigger: 'on_start' | 'on_completion' | 'on_approval' | null;
  acceptance_criteria: string[];
  sort_order: number;
  depends_on_milestone_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface ProjectMilestoneInsert {
  id?: string;
  project_id: string;
  name: string;
  description?: string | null;
  status?: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  due_date?: string | null;
  billing_amount?: number | null;
  billing_trigger?: 'on_start' | 'on_completion' | 'on_approval' | null;
  acceptance_criteria?: string[];
  sort_order?: number;
  depends_on_milestone_id?: string | null;
}

export interface ProjectMilestoneUpdate {
  name?: string;
  description?: string | null;
  status?: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  due_date?: string | null;
  billing_amount?: number | null;
  billing_trigger?: 'on_start' | 'on_completion' | 'on_approval' | null;
  acceptance_criteria?: string[];
  sort_order?: number;
  depends_on_milestone_id?: string | null;
}

// Supabase query result type
export type ProjectMilestoneRow = ProjectMilestone;
