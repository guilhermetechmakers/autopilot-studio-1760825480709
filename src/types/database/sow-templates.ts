/**
 * Database types for sow_templates table
 * Generated: 2024-12-20T12:00:00Z
 */

export type TemplateCategory = 'ai_development' | 'web_development' | 'mobile_development' | 'consulting' | 'general';

export interface SowTemplate {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  category: TemplateCategory;
  content: Record<string, any>;
  variables: Record<string, any>;
  is_public: boolean;
  is_active: boolean;
  version: string;
  usage_count: number;
  last_used_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface SowTemplateInsert {
  id?: string;
  user_id: string;
  name: string;
  description?: string | null;
  category: TemplateCategory;
  content?: Record<string, any>;
  variables?: Record<string, any>;
  is_public?: boolean;
  is_active?: boolean;
  version?: string;
  usage_count?: number;
  last_used_at?: string | null;
}

export interface SowTemplateUpdate {
  name?: string;
  description?: string | null;
  category?: TemplateCategory;
  content?: Record<string, any>;
  variables?: Record<string, any>;
  is_public?: boolean;
  is_active?: boolean;
  version?: string;
  usage_count?: number;
  last_used_at?: string | null;
}

// Supabase query result type
export type SowTemplateRow = SowTemplate;
