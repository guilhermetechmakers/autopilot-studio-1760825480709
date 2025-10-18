/**
 * Database types for billing_milestones table
 * Generated: 2024-12-20T12:00:00Z
 */

export interface BillingMilestone {
  id: string;
  user_id: string;
  project_id: string;
  milestone_id: string | null;
  invoice_id: string | null;
  name: string;
  description: string | null;
  amount: number;
  currency: 'USD' | 'EUR' | 'GBP' | 'CAD';
  status: 'pending' | 'billed' | 'paid' | 'cancelled';
  trigger_type: 'manual' | 'milestone_completion' | 'date' | 'deliverable';
  trigger_date: string | null;
  trigger_condition: Record<string, any>;
  billed_at: string | null;
  paid_at: string | null;
  notes: string | null;
  metadata: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface BillingMilestoneInsert {
  id?: string;
  user_id: string;
  project_id: string;
  milestone_id?: string | null;
  invoice_id?: string | null;
  name: string;
  description?: string | null;
  amount: number;
  currency?: 'USD' | 'EUR' | 'GBP' | 'CAD';
  status?: 'pending' | 'billed' | 'paid' | 'cancelled';
  trigger_type?: 'manual' | 'milestone_completion' | 'date' | 'deliverable';
  trigger_date?: string | null;
  trigger_condition?: Record<string, any>;
  billed_at?: string | null;
  paid_at?: string | null;
  notes?: string | null;
  metadata?: Record<string, any>;
}

export interface BillingMilestoneUpdate {
  milestone_id?: string | null;
  invoice_id?: string | null;
  name?: string;
  description?: string | null;
  amount?: number;
  currency?: 'USD' | 'EUR' | 'GBP' | 'CAD';
  status?: 'pending' | 'billed' | 'paid' | 'cancelled';
  trigger_type?: 'manual' | 'milestone_completion' | 'date' | 'deliverable';
  trigger_date?: string | null;
  trigger_condition?: Record<string, any>;
  billed_at?: string | null;
  paid_at?: string | null;
  notes?: string | null;
  metadata?: Record<string, any>;
}

// Supabase query result type
export type BillingMilestoneRow = BillingMilestone;