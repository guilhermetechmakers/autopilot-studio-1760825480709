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
    };
  };
};
