/**
 * Database types for proposal_versions table
 * Generated: 2024-12-20T12:00:00Z
 */

export interface ProposalVersion {
  id: string;
  proposal_id: string;
  user_id: string;
  version_number: number;
  title: string;
  content: Record<string, any>;
  changes_summary: string | null;
  created_at: string;
}

export interface ProposalVersionInsert {
  id?: string;
  proposal_id: string;
  user_id: string;
  version_number: number;
  title: string;
  content?: Record<string, any>;
  changes_summary?: string | null;
}

export interface ProposalVersionUpdate {
  title?: string;
  content?: Record<string, any>;
  changes_summary?: string | null;
}

// Supabase query result type
export type ProposalVersionRow = ProposalVersion;
