-- =====================================================
-- Migration: Create Proposals and SoW Tables
-- Created: 2024-12-20T12:00:00Z
-- Tables: proposals, sow_templates, proposal_versions, esign_documents
-- Purpose: Support proposal generation, SoW templates, versioning, and e-signature workflows
-- =====================================================

-- Enable UUID extension (idempotent)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Helper function for updated_at (idempotent)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- TABLE: proposals
-- Purpose: Store generated proposals with AI integration and e-signature support
-- =====================================================
CREATE TABLE IF NOT EXISTS proposals (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  
  -- Core proposal fields
  title TEXT NOT NULL,
  description TEXT,
  client_name TEXT NOT NULL,
  client_email TEXT NOT NULL,
  project_type TEXT NOT NULL CHECK (project_type IN ('ai_development', 'web_development', 'mobile_development', 'consulting', 'other')),
  
  -- Financial details
  total_value DECIMAL(12,2) NOT NULL,
  currency TEXT DEFAULT 'USD' NOT NULL,
  payment_terms TEXT DEFAULT 'Net 30',
  
  -- Status and workflow
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'under_review', 'approved', 'rejected', 'signed', 'cancelled')),
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  
  -- AI and template integration
  template_id UUID,
  ai_generated BOOLEAN DEFAULT false,
  ai_prompt TEXT,
  ai_model TEXT,
  
  -- E-signature integration
  esign_status TEXT DEFAULT 'not_sent' CHECK (esign_status IN ('not_sent', 'sent', 'viewed', 'signed', 'declined', 'expired')),
  esign_document_id TEXT,
  esign_envelope_id TEXT,
  esign_signed_at TIMESTAMPTZ,
  esign_expires_at TIMESTAMPTZ,
  
  -- Content and versioning
  content JSONB DEFAULT '{}'::jsonb,
  metadata JSONB DEFAULT '{}'::jsonb,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  sent_at TIMESTAMPTZ,
  signed_at TIMESTAMPTZ,
  
  -- Constraints
  CONSTRAINT proposals_title_not_empty CHECK (length(trim(title)) > 0),
  CONSTRAINT proposals_client_name_not_empty CHECK (length(trim(client_name)) > 0),
  CONSTRAINT proposals_client_email_valid CHECK (client_email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
  CONSTRAINT proposals_total_value_positive CHECK (total_value > 0)
);

-- =====================================================
-- TABLE: sow_templates
-- Purpose: Store reusable SoW templates with variable substitution
-- =====================================================
CREATE TABLE IF NOT EXISTS sow_templates (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  
  -- Template details
  name TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL CHECK (category IN ('ai_development', 'web_development', 'mobile_development', 'consulting', 'general')),
  
  -- Template content
  content JSONB NOT NULL DEFAULT '{}'::jsonb,
  variables JSONB DEFAULT '{}'::jsonb,
  
  -- Template settings
  is_public BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  version TEXT DEFAULT '1.0.0',
  
  -- Usage tracking
  usage_count INTEGER DEFAULT 0,
  last_used_at TIMESTAMPTZ,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  
  -- Constraints
  CONSTRAINT sow_templates_name_not_empty CHECK (length(trim(name)) > 0)
);

-- =====================================================
-- TABLE: proposal_versions
-- Purpose: Track version history and changes for proposals
-- =====================================================
CREATE TABLE IF NOT EXISTS proposal_versions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  proposal_id UUID REFERENCES proposals(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  
  -- Version details
  version_number INTEGER NOT NULL,
  title TEXT NOT NULL,
  content JSONB NOT NULL DEFAULT '{}'::jsonb,
  changes_summary TEXT,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  
  -- Constraints
  CONSTRAINT proposal_versions_version_positive CHECK (version_number > 0),
  CONSTRAINT proposal_versions_title_not_empty CHECK (length(trim(title)) > 0),
  UNIQUE(proposal_id, version_number)
);

-- =====================================================
-- TABLE: esign_documents
-- Purpose: Track e-signature documents and their status
-- =====================================================
CREATE TABLE IF NOT EXISTS esign_documents (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  proposal_id UUID REFERENCES proposals(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  
  -- E-signature provider details
  provider TEXT NOT NULL CHECK (provider IN ('docusign', 'hellosign', 'adobe_sign')),
  document_id TEXT NOT NULL,
  envelope_id TEXT,
  
  -- Document details
  document_name TEXT NOT NULL,
  document_url TEXT,
  signed_document_url TEXT,
  
  -- Status and workflow
  status TEXT DEFAULT 'created' CHECK (status IN ('created', 'sent', 'delivered', 'viewed', 'signed', 'declined', 'expired', 'cancelled')),
  error_message TEXT,
  
  -- Recipients and signing
  recipients JSONB DEFAULT '[]'::jsonb,
  signed_by TEXT,
  signed_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  
  -- Constraints
  CONSTRAINT esign_documents_document_id_not_empty CHECK (length(trim(document_id)) > 0),
  CONSTRAINT esign_documents_document_name_not_empty CHECK (length(trim(document_name)) > 0)
);

-- =====================================================
-- Performance Indexes
-- =====================================================

-- Proposals indexes
CREATE INDEX IF NOT EXISTS proposals_user_id_idx ON proposals(user_id);
CREATE INDEX IF NOT EXISTS proposals_status_idx ON proposals(status);
CREATE INDEX IF NOT EXISTS proposals_created_at_idx ON proposals(created_at DESC);
CREATE INDEX IF NOT EXISTS proposals_client_email_idx ON proposals(client_email);
CREATE INDEX IF NOT EXISTS proposals_esign_status_idx ON proposals(esign_status);
CREATE INDEX IF NOT EXISTS proposals_template_id_idx ON proposals(template_id) WHERE template_id IS NOT NULL;

-- SoW Templates indexes
CREATE INDEX IF NOT EXISTS sow_templates_user_id_idx ON sow_templates(user_id);
CREATE INDEX IF NOT EXISTS sow_templates_category_idx ON sow_templates(category);
CREATE INDEX IF NOT EXISTS sow_templates_is_public_idx ON sow_templates(is_public) WHERE is_public = true;
CREATE INDEX IF NOT EXISTS sow_templates_is_active_idx ON sow_templates(is_active) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS sow_templates_usage_count_idx ON sow_templates(usage_count DESC);

-- Proposal Versions indexes
CREATE INDEX IF NOT EXISTS proposal_versions_proposal_id_idx ON proposal_versions(proposal_id);
CREATE INDEX IF NOT EXISTS proposal_versions_user_id_idx ON proposal_versions(user_id);
CREATE INDEX IF NOT EXISTS proposal_versions_created_at_idx ON proposal_versions(created_at DESC);

-- E-sign Documents indexes
CREATE INDEX IF NOT EXISTS esign_documents_proposal_id_idx ON esign_documents(proposal_id);
CREATE INDEX IF NOT EXISTS esign_documents_user_id_idx ON esign_documents(user_id);
CREATE INDEX IF NOT EXISTS esign_documents_status_idx ON esign_documents(status);
CREATE INDEX IF NOT EXISTS esign_documents_provider_idx ON esign_documents(provider);

-- =====================================================
-- Auto-update Triggers
-- =====================================================

-- Proposals trigger
DROP TRIGGER IF EXISTS update_proposals_updated_at ON proposals;
CREATE TRIGGER update_proposals_updated_at
  BEFORE UPDATE ON proposals
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- SoW Templates trigger
DROP TRIGGER IF EXISTS update_sow_templates_updated_at ON sow_templates;
CREATE TRIGGER update_sow_templates_updated_at
  BEFORE UPDATE ON sow_templates
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- E-sign Documents trigger
DROP TRIGGER IF EXISTS update_esign_documents_updated_at ON esign_documents;
CREATE TRIGGER update_esign_documents_updated_at
  BEFORE UPDATE ON esign_documents
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- Row Level Security (RLS)
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE proposals ENABLE ROW LEVEL SECURITY;
ALTER TABLE sow_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE proposal_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE esign_documents ENABLE ROW LEVEL SECURITY;

-- Proposals RLS Policies
CREATE POLICY "proposals_select_own"
  ON proposals FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "proposals_insert_own"
  ON proposals FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "proposals_update_own"
  ON proposals FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "proposals_delete_own"
  ON proposals FOR DELETE
  USING (auth.uid() = user_id);

-- SoW Templates RLS Policies
CREATE POLICY "sow_templates_select_own_or_public"
  ON sow_templates FOR SELECT
  USING (auth.uid() = user_id OR is_public = true);

CREATE POLICY "sow_templates_insert_own"
  ON sow_templates FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "sow_templates_update_own"
  ON sow_templates FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "sow_templates_delete_own"
  ON sow_templates FOR DELETE
  USING (auth.uid() = user_id);

-- Proposal Versions RLS Policies
CREATE POLICY "proposal_versions_select_own"
  ON proposal_versions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "proposal_versions_insert_own"
  ON proposal_versions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "proposal_versions_update_own"
  ON proposal_versions FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "proposal_versions_delete_own"
  ON proposal_versions FOR DELETE
  USING (auth.uid() = user_id);

-- E-sign Documents RLS Policies
CREATE POLICY "esign_documents_select_own"
  ON esign_documents FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "esign_documents_insert_own"
  ON esign_documents FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "esign_documents_update_own"
  ON esign_documents FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "esign_documents_delete_own"
  ON esign_documents FOR DELETE
  USING (auth.uid() = user_id);

-- =====================================================
-- Documentation
-- =====================================================

COMMENT ON TABLE proposals IS 'Stores generated proposals with AI integration and e-signature support';
COMMENT ON COLUMN proposals.id IS 'Primary key (UUID v4)';
COMMENT ON COLUMN proposals.user_id IS 'Owner of this proposal (references auth.users)';
COMMENT ON COLUMN proposals.title IS 'Proposal title';
COMMENT ON COLUMN proposals.client_name IS 'Client company or individual name';
COMMENT ON COLUMN proposals.client_email IS 'Client email address for sending';
COMMENT ON COLUMN proposals.total_value IS 'Total proposal value in specified currency';
COMMENT ON COLUMN proposals.status IS 'Current proposal status in workflow';
COMMENT ON COLUMN proposals.esign_status IS 'E-signature workflow status';
COMMENT ON COLUMN proposals.content IS 'Proposal content as JSONB for rich text and structured data';
COMMENT ON COLUMN proposals.metadata IS 'Additional metadata and AI generation parameters';

COMMENT ON TABLE sow_templates IS 'Reusable SoW templates with variable substitution';
COMMENT ON COLUMN sow_templates.id IS 'Primary key (UUID v4)';
COMMENT ON COLUMN sow_templates.user_id IS 'Owner of this template (references auth.users)';
COMMENT ON COLUMN sow_templates.name IS 'Template name';
COMMENT ON COLUMN sow_templates.content IS 'Template content with placeholders';
COMMENT ON COLUMN sow_templates.variables IS 'Available variables for substitution';
COMMENT ON COLUMN sow_templates.is_public IS 'Whether template is available to other users';

COMMENT ON TABLE proposal_versions IS 'Version history and changes for proposals';
COMMENT ON COLUMN proposal_versions.id IS 'Primary key (UUID v4)';
COMMENT ON COLUMN proposal_versions.proposal_id IS 'Parent proposal (references proposals)';
COMMENT ON COLUMN proposal_versions.version_number IS 'Sequential version number';
COMMENT ON COLUMN proposal_versions.content IS 'Version content as JSONB';
COMMENT ON COLUMN proposal_versions.changes_summary IS 'Human-readable summary of changes';

COMMENT ON TABLE esign_documents IS 'E-signature documents and their status';
COMMENT ON COLUMN esign_documents.id IS 'Primary key (UUID v4)';
COMMENT ON COLUMN esign_documents.proposal_id IS 'Parent proposal (references proposals)';
COMMENT ON COLUMN esign_documents.provider IS 'E-signature service provider';
COMMENT ON COLUMN esign_documents.document_id IS 'Provider-specific document identifier';
COMMENT ON COLUMN esign_documents.status IS 'Current e-signature status';
COMMENT ON COLUMN esign_documents.recipients IS 'Signing recipients as JSONB array';

-- =====================================================
-- ROLLBACK INSTRUCTIONS (for documentation only)
-- =====================================================
-- To rollback this migration, execute:
-- DROP TABLE IF EXISTS esign_documents CASCADE;
-- DROP TABLE IF EXISTS proposal_versions CASCADE;
-- DROP TABLE IF EXISTS sow_templates CASCADE;
-- DROP TABLE IF EXISTS proposals CASCADE;
