/**
 * Database types for esign_documents table
 * Generated: 2024-12-20T12:00:00Z
 */

export type ESignProvider = 'docusign' | 'hellosign' | 'adobe_sign';
export type ESignDocumentStatus = 'created' | 'sent' | 'delivered' | 'viewed' | 'signed' | 'declined' | 'expired' | 'cancelled';

export interface ESignDocument {
  id: string;
  proposal_id: string;
  user_id: string;
  provider: ESignProvider;
  document_id: string;
  envelope_id: string | null;
  document_name: string;
  document_url: string | null;
  signed_document_url: string | null;
  status: ESignDocumentStatus;
  error_message: string | null;
  recipients: any[];
  signed_by: string | null;
  signed_at: string | null;
  expires_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface ESignDocumentInsert {
  id?: string;
  proposal_id: string;
  user_id: string;
  provider: ESignProvider;
  document_id: string;
  envelope_id?: string | null;
  document_name: string;
  document_url?: string | null;
  signed_document_url?: string | null;
  status?: ESignDocumentStatus;
  error_message?: string | null;
  recipients?: any[];
  signed_by?: string | null;
  signed_at?: string | null;
  expires_at?: string | null;
}

export interface ESignDocumentUpdate {
  envelope_id?: string | null;
  document_name?: string;
  document_url?: string | null;
  signed_document_url?: string | null;
  status?: ESignDocumentStatus;
  error_message?: string | null;
  recipients?: any[];
  signed_by?: string | null;
  signed_at?: string | null;
  expires_at?: string | null;
}

// Supabase query result type
export type ESignDocumentRow = ESignDocument;
