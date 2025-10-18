import { supabase } from '@/lib/supabase';
import type { 
  Proposal, 
  ProposalInsert, 
  ProposalUpdate,
  ProposalVersion,
  ProposalVersionInsert,
  SowTemplate,
  SowTemplateInsert,
  SowTemplateUpdate,
  ESignDocument,
  ESignDocumentInsert,
  ESignDocumentUpdate
} from '@/types/database';

// =====================================================
// PROPOSALS API
// =====================================================

export const proposalsApi = {
  // Get all proposals for the current user
  async getAll() {
    const { data, error } = await supabase
      .from('proposals')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data as Proposal[];
  },

  // Get a single proposal by ID
  async getById(id: string) {
    const { data, error } = await supabase
      .from('proposals')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data as Proposal;
  },

  // Create a new proposal
  async create(proposal: ProposalInsert) {
    const { data, error } = await supabase
      .from('proposals')
      .insert(proposal)
      .select()
      .single();
    
    if (error) throw error;
    return data as Proposal;
  },

  // Update a proposal
  async update(id: string, updates: ProposalUpdate) {
    const { data, error } = await supabase
      .from('proposals')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data as Proposal;
  },

  // Delete a proposal
  async delete(id: string) {
    const { error } = await supabase
      .from('proposals')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  },

  // Get proposals by status
  async getByStatus(status: string) {
    const { data, error } = await supabase
      .from('proposals')
      .select('*')
      .eq('status', status)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data as Proposal[];
  },

  // Get proposals by client email
  async getByClientEmail(email: string) {
    const { data, error } = await supabase
      .from('proposals')
      .select('*')
      .eq('client_email', email)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data as Proposal[];
  },

  // Update proposal status
  async updateStatus(id: string, status: string) {
    const { data, error } = await supabase
      .from('proposals')
      .update({ status })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data as Proposal;
  },

  // Update e-signature status
  async updateESignStatus(id: string, esignStatus: string, metadata?: Record<string, any>) {
    const updates: ProposalUpdate = { esign_status: esignStatus as any };
    if (metadata) {
      updates.metadata = metadata;
    }
    
    const { data, error } = await supabase
      .from('proposals')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data as Proposal;
  }
};

// =====================================================
// PROPOSAL VERSIONS API
// =====================================================

export const proposalVersionsApi = {
  // Get all versions for a proposal
  async getByProposalId(proposalId: string) {
    const { data, error } = await supabase
      .from('proposal_versions')
      .select('*')
      .eq('proposal_id', proposalId)
      .order('version_number', { ascending: false });
    
    if (error) throw error;
    return data as ProposalVersion[];
  },

  // Create a new version
  async create(version: ProposalVersionInsert) {
    const { data, error } = await supabase
      .from('proposal_versions')
      .insert(version)
      .select()
      .single();
    
    if (error) throw error;
    return data as ProposalVersion;
  },

  // Get latest version for a proposal
  async getLatest(proposalId: string) {
    const { data, error } = await supabase
      .from('proposal_versions')
      .select('*')
      .eq('proposal_id', proposalId)
      .order('version_number', { ascending: false })
      .limit(1)
      .single();
    
    if (error) throw error;
    return data as ProposalVersion;
  }
};

// =====================================================
// SOW TEMPLATES API
// =====================================================

export const sowTemplatesApi = {
  // Get all templates for the current user
  async getAll() {
    const { data, error } = await supabase
      .from('sow_templates')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data as SowTemplate[];
  },

  // Get public templates
  async getPublic() {
    const { data, error } = await supabase
      .from('sow_templates')
      .select('*')
      .eq('is_public', true)
      .eq('is_active', true)
      .order('usage_count', { ascending: false });
    
    if (error) throw error;
    return data as SowTemplate[];
  },

  // Get templates by category
  async getByCategory(category: string) {
    const { data, error } = await supabase
      .from('sow_templates')
      .select('*')
      .eq('category', category)
      .eq('is_active', true)
      .order('usage_count', { ascending: false });
    
    if (error) throw error;
    return data as SowTemplate[];
  },

  // Get a single template by ID
  async getById(id: string) {
    const { data, error } = await supabase
      .from('sow_templates')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data as SowTemplate;
  },

  // Create a new template
  async create(template: SowTemplateInsert) {
    const { data, error } = await supabase
      .from('sow_templates')
      .insert(template)
      .select()
      .single();
    
    if (error) throw error;
    return data as SowTemplate;
  },

  // Update a template
  async update(id: string, updates: SowTemplateUpdate) {
    const { data, error } = await supabase
      .from('sow_templates')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data as SowTemplate;
  },

  // Delete a template
  async delete(id: string) {
    const { error } = await supabase
      .from('sow_templates')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  },

  // Increment usage count
  async incrementUsage(id: string) {
    // First get the current template
    const { data: currentTemplate, error: fetchError } = await supabase
      .from('sow_templates')
      .select('usage_count')
      .eq('id', id)
      .single();
    
    if (fetchError) throw fetchError;
    
    // Then update with incremented count
    const { data, error } = await supabase
      .from('sow_templates')
      .update({ 
        usage_count: (currentTemplate?.usage_count || 0) + 1,
        last_used_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data as SowTemplate;
  }
};

// =====================================================
// E-SIGN DOCUMENTS API
// =====================================================

export const esignDocumentsApi = {
  // Get all e-sign documents for a proposal
  async getByProposalId(proposalId: string) {
    const { data, error } = await supabase
      .from('esign_documents')
      .select('*')
      .eq('proposal_id', proposalId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data as ESignDocument[];
  },

  // Get a single e-sign document by ID
  async getById(id: string) {
    const { data, error } = await supabase
      .from('esign_documents')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data as ESignDocument;
  },

  // Create a new e-sign document
  async create(document: ESignDocumentInsert) {
    const { data, error } = await supabase
      .from('esign_documents')
      .insert(document)
      .select()
      .single();
    
    if (error) throw error;
    return data as ESignDocument;
  },

  // Update an e-sign document
  async update(id: string, updates: ESignDocumentUpdate) {
    const { data, error } = await supabase
      .from('esign_documents')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data as ESignDocument;
  },

  // Update e-sign document status
  async updateStatus(id: string, status: string, metadata?: Record<string, any>) {
    const updates: ESignDocumentUpdate = { status: status as any };
    if (metadata) {
      // Add metadata to the update if provided
      updates.recipients = metadata.recipients;
      updates.signed_by = metadata.signed_by;
      updates.signed_at = metadata.signed_at;
      updates.expires_at = metadata.expires_at;
    }
    
    const { data, error } = await supabase
      .from('esign_documents')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data as ESignDocument;
  },

  // Delete an e-sign document
  async delete(id: string) {
    const { error } = await supabase
      .from('esign_documents')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }
};
