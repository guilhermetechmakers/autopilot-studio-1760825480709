/**
 * Database types for project_audit_logs table
 * Generated: 2024-12-20T12:00:00Z
 */

export interface ProjectAuditLog {
  id: string;
  project_id: string;
  user_id: string | null;
  action: string;
  entity_type: string;
  entity_id: string | null;
  description: string | null;
  old_values: Record<string, any> | null;
  new_values: Record<string, any> | null;
  ip_address: string | null;
  user_agent: string | null;
  created_at: string;
}

export interface ProjectAuditLogInsert {
  id?: string;
  project_id: string;
  user_id?: string | null;
  action: string;
  entity_type: string;
  entity_id?: string | null;
  description?: string | null;
  old_values?: Record<string, any> | null;
  new_values?: Record<string, any> | null;
  ip_address?: string | null;
  user_agent?: string | null;
}

// Supabase query result type
export type ProjectAuditLogRow = ProjectAuditLog;
