/**
 * Database types for proposals table
 * Generated: 2024-12-20T12:00:00Z
 */

export type ProjectType = 'ai_development' | 'web_development' | 'mobile_development' | 'consulting' | 'other';
export type ProposalStatus = 'draft' | 'sent' | 'under_review' | 'approved' | 'rejected' | 'signed' | 'cancelled';
export type ProposalPriority = 'low' | 'medium' | 'high' | 'urgent';
export type ESignStatus = 'not_sent' | 'sent' | 'viewed' | 'signed' | 'declined' | 'expired';

export interface Proposal {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  client_name: string;
  client_email: string;
  project_type: ProjectType;
  total_value: number;
  currency: string;
  payment_terms: string;
  status: ProposalStatus;
  priority: ProposalPriority;
  template_id: string | null;
  ai_generated: boolean;
  ai_prompt: string | null;
  ai_model: string | null;
  esign_status: ESignStatus;
  esign_document_id: string | null;
  esign_envelope_id: string | null;
  esign_signed_at: string | null;
  esign_expires_at: string | null;
  content: Record<string, any>;
  metadata: Record<string, any>;
  created_at: string;
  updated_at: string;
  sent_at: string | null;
  signed_at: string | null;
}

export interface ProposalInsert {
  id?: string;
  user_id: string;
  title: string;
  description?: string | null;
  client_name: string;
  client_email: string;
  project_type: ProjectType;
  total_value: number;
  currency?: string;
  payment_terms?: string;
  status?: ProposalStatus;
  priority?: ProposalPriority;
  template_id?: string | null;
  ai_generated?: boolean;
  ai_prompt?: string | null;
  ai_model?: string | null;
  esign_status?: ESignStatus;
  esign_document_id?: string | null;
  esign_envelope_id?: string | null;
  esign_signed_at?: string | null;
  esign_expires_at?: string | null;
  content?: Record<string, any>;
  metadata?: Record<string, any>;
  sent_at?: string | null;
  signed_at?: string | null;
}

export interface ProposalUpdate {
  title?: string;
  description?: string | null;
  client_name?: string;
  client_email?: string;
  project_type?: ProjectType;
  total_value?: number;
  currency?: string;
  payment_terms?: string;
  status?: ProposalStatus;
  priority?: ProposalPriority;
  template_id?: string | null;
  ai_generated?: boolean;
  ai_prompt?: string | null;
  ai_model?: string | null;
  esign_status?: ESignStatus;
  esign_document_id?: string | null;
  esign_envelope_id?: string | null;
  esign_signed_at?: string | null;
  esign_expires_at?: string | null;
  content?: Record<string, any>;
  metadata?: Record<string, any>;
  sent_at?: string | null;
  signed_at?: string | null;
}

// Supabase query result type
export type ProposalRow = Proposal;
