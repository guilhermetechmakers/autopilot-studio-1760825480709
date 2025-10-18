import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export type Database = {
  public: {
    Tables: {
      proposals: {
        Row: import('../types/database').Proposal;
        Insert: import('../types/database').ProposalInsert;
        Update: import('../types/database').ProposalUpdate;
      };
      sow_templates: {
        Row: import('../types/database').SowTemplate;
        Insert: import('../types/database').SowTemplateInsert;
        Update: import('../types/database').SowTemplateUpdate;
      };
      proposal_versions: {
        Row: import('../types/database').ProposalVersion;
        Insert: import('../types/database').ProposalVersionInsert;
        Update: import('../types/database').ProposalVersionUpdate;
      };
      esign_documents: {
        Row: import('../types/database').ESignDocument;
        Insert: import('../types/database').ESignDocumentInsert;
        Update: import('../types/database').ESignDocumentUpdate;
      };
      notifications: {
        Row: import('../types/database').Notification;
        Insert: import('../types/database').NotificationInsert;
        Update: import('../types/database').NotificationUpdate;
      };
      notification_preferences: {
        Row: import('../types/database').NotificationPreferences;
        Insert: import('../types/database').NotificationPreferencesInsert;
        Update: import('../types/database').NotificationPreferencesUpdate;
      };
      notification_templates: {
        Row: import('../types/database').NotificationTemplate;
        Insert: import('../types/database').NotificationTemplateInsert;
        Update: import('../types/database').NotificationTemplateUpdate;
      };
      notification_delivery_logs: {
        Row: import('../types/database').NotificationDeliveryLog;
        Insert: import('../types/database').NotificationDeliveryLogInsert;
        Update: import('../types/database').NotificationDeliveryLogUpdate;
      };
      projects: {
        Row: import('../types/database').Project;
        Insert: import('../types/database').ProjectInsert;
        Update: import('../types/database').ProjectUpdate;
      };
      project_milestones: {
        Row: import('../types/database').ProjectMilestone;
        Insert: import('../types/database').ProjectMilestoneInsert;
        Update: import('../types/database').ProjectMilestoneUpdate;
      };
      project_tasks: {
        Row: import('../types/database').ProjectTask;
        Insert: import('../types/database').ProjectTaskInsert;
        Update: import('../types/database').ProjectTaskUpdate;
      };
      project_repos: {
        Row: import('../types/database').ProjectRepo;
        Insert: import('../types/database').ProjectRepoInsert;
        Update: import('../types/database').ProjectRepoUpdate;
      };
      project_files: {
        Row: import('../types/database').ProjectFile;
        Insert: import('../types/database').ProjectFileInsert;
        Update: import('../types/database').ProjectFileUpdate;
      };
      project_audit_logs: {
        Row: import('../types/database').ProjectAuditLog;
        Insert: import('../types/database').ProjectAuditLogInsert;
        Update: never;
      };
    };
  };
};
