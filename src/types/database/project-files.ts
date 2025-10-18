/**
 * Database types for project_files table
 * Generated: 2024-12-20T12:00:00Z
 */

export interface ProjectFile {
  id: string;
  project_id: string;
  name: string;
  file_type: 'document' | 'image' | 'video' | 'audio' | 'archive' | 'other';
  file_size: number | null;
  file_url: string;
  folder_path: string;
  description: string | null;
  tags: string[];
  is_public: boolean;
  is_client_visible: boolean;
  created_at: string;
  updated_at: string;
}

export interface ProjectFileInsert {
  id?: string;
  project_id: string;
  name: string;
  file_type: 'document' | 'image' | 'video' | 'audio' | 'archive' | 'other';
  file_size?: number | null;
  file_url: string;
  folder_path?: string;
  description?: string | null;
  tags?: string[];
  is_public?: boolean;
  is_client_visible?: boolean;
}

export interface ProjectFileUpdate {
  name?: string;
  file_type?: 'document' | 'image' | 'video' | 'audio' | 'archive' | 'other';
  file_size?: number | null;
  file_url?: string;
  folder_path?: string;
  description?: string | null;
  tags?: string[];
  is_public?: boolean;
  is_client_visible?: boolean;
}

// Supabase query result type
export type ProjectFileRow = ProjectFile;
