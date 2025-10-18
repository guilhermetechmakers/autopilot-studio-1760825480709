/**
 * Database types for project_repos table
 * Generated: 2024-12-20T12:00:00Z
 */

export interface ProjectRepo {
  id: string;
  project_id: string;
  provider: 'github' | 'gitlab' | 'bitbucket';
  repo_id: string;
  repo_name: string;
  repo_url: string;
  default_branch: string;
  is_connected: boolean;
  last_sync_at: string | null;
  webhook_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface ProjectRepoInsert {
  id?: string;
  project_id: string;
  provider: 'github' | 'gitlab' | 'bitbucket';
  repo_id: string;
  repo_name: string;
  repo_url: string;
  default_branch?: string;
  is_connected?: boolean;
  last_sync_at?: string | null;
  webhook_id?: string | null;
}

export interface ProjectRepoUpdate {
  provider?: 'github' | 'gitlab' | 'bitbucket';
  repo_id?: string;
  repo_name?: string;
  repo_url?: string;
  default_branch?: string;
  is_connected?: boolean;
  last_sync_at?: string | null;
  webhook_id?: string | null;
}

// Supabase query result type
export type ProjectRepoRow = ProjectRepo;
