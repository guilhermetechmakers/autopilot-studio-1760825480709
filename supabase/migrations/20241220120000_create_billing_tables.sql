-- =====================================================
-- Migration: Create Billing & Invoicing Tables
-- Created: 2024-12-20T12:00:00Z
-- Tables: invoices, payments, billing_milestones, time_entries, quickbooks_sync
-- Purpose: Enable comprehensive billing and invoicing system
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
-- TABLE: invoices
-- Purpose: Store invoice information and status
-- =====================================================
CREATE TABLE IF NOT EXISTS invoices (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  
  -- Invoice details
  invoice_number TEXT NOT NULL UNIQUE,
  client_name TEXT NOT NULL,
  client_email TEXT NOT NULL,
  client_address JSONB DEFAULT '{}'::jsonb,
  
  -- Financial details
  subtotal DECIMAL(12,2) NOT NULL DEFAULT 0,
  tax_rate DECIMAL(5,4) DEFAULT 0,
  tax_amount DECIMAL(12,2) DEFAULT 0,
  total_amount DECIMAL(12,2) NOT NULL DEFAULT 0,
  currency TEXT DEFAULT 'USD' CHECK (currency IN ('USD', 'EUR', 'GBP', 'CAD')),
  
  -- Status and dates
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'paid', 'overdue', 'cancelled')),
  issue_date DATE NOT NULL DEFAULT CURRENT_DATE,
  due_date DATE NOT NULL,
  paid_date DATE,
  
  -- Payment details
  payment_terms TEXT DEFAULT 'Net 30',
  payment_method TEXT,
  stripe_payment_intent_id TEXT,
  
  -- Additional info
  notes TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  
  -- Constraints
  CONSTRAINT invoices_invoice_number_not_empty CHECK (length(trim(invoice_number)) > 0),
  CONSTRAINT invoices_client_name_not_empty CHECK (length(trim(client_name)) > 0),
  CONSTRAINT invoices_total_amount_positive CHECK (total_amount >= 0),
  CONSTRAINT invoices_due_date_after_issue CHECK (due_date >= issue_date)
);

-- =====================================================
-- TABLE: payments
-- Purpose: Track payment transactions
-- =====================================================
CREATE TABLE IF NOT EXISTS payments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  invoice_id UUID REFERENCES invoices(id) ON DELETE CASCADE NOT NULL,
  
  -- Payment details
  amount DECIMAL(12,2) NOT NULL,
  currency TEXT DEFAULT 'USD' CHECK (currency IN ('USD', 'EUR', 'GBP', 'CAD')),
  payment_method TEXT NOT NULL,
  payment_reference TEXT,
  stripe_payment_intent_id TEXT,
  
  -- Status and dates
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
  processed_at TIMESTAMPTZ,
  
  -- Additional info
  notes TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  
  -- Constraints
  CONSTRAINT payments_amount_positive CHECK (amount > 0)
);

-- =====================================================
-- TABLE: billing_milestones
-- Purpose: Link project milestones to billing
-- =====================================================
CREATE TABLE IF NOT EXISTS billing_milestones (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE NOT NULL,
  milestone_id UUID REFERENCES project_milestones(id) ON DELETE CASCADE,
  invoice_id UUID REFERENCES invoices(id) ON DELETE SET NULL,
  
  -- Billing details
  name TEXT NOT NULL,
  description TEXT,
  amount DECIMAL(12,2) NOT NULL,
  currency TEXT DEFAULT 'USD' CHECK (currency IN ('USD', 'EUR', 'GBP', 'CAD')),
  
  -- Status and triggers
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'billed', 'paid', 'cancelled')),
  trigger_type TEXT DEFAULT 'manual' CHECK (trigger_type IN ('manual', 'milestone_completion', 'date', 'deliverable')),
  trigger_date DATE,
  trigger_condition JSONB DEFAULT '{}'::jsonb,
  
  -- Billing dates
  billed_at TIMESTAMPTZ,
  paid_at TIMESTAMPTZ,
  
  -- Additional info
  notes TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  
  -- Constraints
  CONSTRAINT billing_milestones_name_not_empty CHECK (length(trim(name)) > 0),
  CONSTRAINT billing_milestones_amount_positive CHECK (amount > 0)
);

-- =====================================================
-- TABLE: time_entries
-- Purpose: Track billable time for projects
-- =====================================================
CREATE TABLE IF NOT EXISTS time_entries (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE NOT NULL,
  task_id UUID REFERENCES project_tasks(id) ON DELETE SET NULL,
  invoice_id UUID REFERENCES invoices(id) ON DELETE SET NULL,
  
  -- Time tracking
  description TEXT NOT NULL,
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ,
  duration_minutes INTEGER,
  billable_hours DECIMAL(8,2),
  
  -- Billing details
  hourly_rate DECIMAL(8,2),
  total_amount DECIMAL(12,2),
  currency TEXT DEFAULT 'USD' CHECK (currency IN ('USD', 'EUR', 'GBP', 'CAD')),
  
  -- Status
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'billed', 'paid', 'cancelled')),
  
  -- Additional info
  notes TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  
  -- Constraints
  CONSTRAINT time_entries_description_not_empty CHECK (length(trim(description)) > 0),
  CONSTRAINT time_entries_end_after_start CHECK (end_time IS NULL OR end_time > start_time),
  CONSTRAINT time_entries_duration_positive CHECK (duration_minutes IS NULL OR duration_minutes > 0),
  CONSTRAINT time_entries_billable_hours_positive CHECK (billable_hours IS NULL OR billable_hours > 0)
);

-- =====================================================
-- TABLE: quickbooks_sync
-- Purpose: Track QuickBooks synchronization status
-- =====================================================
CREATE TABLE IF NOT EXISTS quickbooks_sync (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  
  -- Sync details
  entity_type TEXT NOT NULL CHECK (entity_type IN ('invoice', 'payment', 'customer', 'item')),
  entity_id UUID NOT NULL,
  quickbooks_id TEXT,
  
  -- Sync status
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'synced', 'failed', 'skipped')),
  last_sync_at TIMESTAMPTZ,
  sync_attempts INTEGER DEFAULT 0,
  error_message TEXT,
  
  -- Sync data
  sync_data JSONB DEFAULT '{}'::jsonb,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  
  -- Constraints
  CONSTRAINT quickbooks_sync_entity_id_not_empty CHECK (entity_id IS NOT NULL)
);

-- =====================================================
-- TABLE: profit_analytics
-- Purpose: Store calculated profit analytics
-- =====================================================
CREATE TABLE IF NOT EXISTS profit_analytics (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE NOT NULL,
  
  -- Analytics period
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  
  -- Financial metrics
  total_revenue DECIMAL(12,2) NOT NULL DEFAULT 0,
  total_costs DECIMAL(12,2) NOT NULL DEFAULT 0,
  gross_profit DECIMAL(12,2) NOT NULL DEFAULT 0,
  profit_margin DECIMAL(5,4) NOT NULL DEFAULT 0,
  
  -- Breakdown
  labor_costs DECIMAL(12,2) DEFAULT 0,
  overhead_costs DECIMAL(12,2) DEFAULT 0,
  other_costs DECIMAL(12,2) DEFAULT 0,
  
  -- Additional metrics
  billable_hours DECIMAL(8,2) DEFAULT 0,
  effective_hourly_rate DECIMAL(8,2) DEFAULT 0,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  
  -- Constraints
  CONSTRAINT profit_analytics_period_valid CHECK (period_end >= period_start),
  CONSTRAINT profit_analytics_revenue_positive CHECK (total_revenue >= 0),
  CONSTRAINT profit_analytics_costs_positive CHECK (total_costs >= 0)
);

-- Performance indexes
CREATE INDEX IF NOT EXISTS invoices_user_id_idx ON invoices(user_id);
CREATE INDEX IF NOT EXISTS invoices_project_id_idx ON invoices(project_id);
CREATE INDEX IF NOT EXISTS invoices_status_idx ON invoices(status);
CREATE INDEX IF NOT EXISTS invoices_due_date_idx ON invoices(due_date);
CREATE INDEX IF NOT EXISTS invoices_created_at_idx ON invoices(created_at DESC);

CREATE INDEX IF NOT EXISTS payments_user_id_idx ON payments(user_id);
CREATE INDEX IF NOT EXISTS payments_invoice_id_idx ON payments(invoice_id);
CREATE INDEX IF NOT EXISTS payments_status_idx ON payments(status);
CREATE INDEX IF NOT EXISTS payments_created_at_idx ON payments(created_at DESC);

CREATE INDEX IF NOT EXISTS billing_milestones_user_id_idx ON billing_milestones(user_id);
CREATE INDEX IF NOT EXISTS billing_milestones_project_id_idx ON billing_milestones(project_id);
CREATE INDEX IF NOT EXISTS billing_milestones_milestone_id_idx ON billing_milestones(milestone_id);
CREATE INDEX IF NOT EXISTS billing_milestones_invoice_id_idx ON billing_milestones(invoice_id);
CREATE INDEX IF NOT EXISTS billing_milestones_status_idx ON billing_milestones(status);

CREATE INDEX IF NOT EXISTS time_entries_user_id_idx ON time_entries(user_id);
CREATE INDEX IF NOT EXISTS time_entries_project_id_idx ON time_entries(project_id);
CREATE INDEX IF NOT EXISTS time_entries_task_id_idx ON time_entries(task_id);
CREATE INDEX IF NOT EXISTS time_entries_invoice_id_idx ON time_entries(invoice_id);
CREATE INDEX IF NOT EXISTS time_entries_start_time_idx ON time_entries(start_time);
CREATE INDEX IF NOT EXISTS time_entries_status_idx ON time_entries(status);

CREATE INDEX IF NOT EXISTS quickbooks_sync_user_id_idx ON quickbooks_sync(user_id);
CREATE INDEX IF NOT EXISTS quickbooks_sync_entity_type_idx ON quickbooks_sync(entity_type);
CREATE INDEX IF NOT EXISTS quickbooks_sync_status_idx ON quickbooks_sync(status);
CREATE INDEX IF NOT EXISTS quickbooks_sync_last_sync_idx ON quickbooks_sync(last_sync_at);

CREATE INDEX IF NOT EXISTS profit_analytics_user_id_idx ON profit_analytics(user_id);
CREATE INDEX IF NOT EXISTS profit_analytics_project_id_idx ON profit_analytics(project_id);
CREATE INDEX IF NOT EXISTS profit_analytics_period_idx ON profit_analytics(period_start, period_end);

-- Auto-update triggers
DROP TRIGGER IF EXISTS update_invoices_updated_at ON invoices;
CREATE TRIGGER update_invoices_updated_at
  BEFORE UPDATE ON invoices
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_payments_updated_at ON payments;
CREATE TRIGGER update_payments_updated_at
  BEFORE UPDATE ON payments
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_billing_milestones_updated_at ON billing_milestones;
CREATE TRIGGER update_billing_milestones_updated_at
  BEFORE UPDATE ON billing_milestones
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_time_entries_updated_at ON time_entries;
CREATE TRIGGER update_time_entries_updated_at
  BEFORE UPDATE ON time_entries
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_quickbooks_sync_updated_at ON quickbooks_sync;
CREATE TRIGGER update_quickbooks_sync_updated_at
  BEFORE UPDATE ON quickbooks_sync
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_profit_analytics_updated_at ON profit_analytics;
CREATE TRIGGER update_profit_analytics_updated_at
  BEFORE UPDATE ON profit_analytics
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE billing_milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE time_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE quickbooks_sync ENABLE ROW LEVEL SECURITY;
ALTER TABLE profit_analytics ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Users can only access their own data
-- Invoices
CREATE POLICY "invoices_select_own"
  ON invoices FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "invoices_insert_own"
  ON invoices FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "invoices_update_own"
  ON invoices FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "invoices_delete_own"
  ON invoices FOR DELETE
  USING (auth.uid() = user_id);

-- Payments
CREATE POLICY "payments_select_own"
  ON payments FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "payments_insert_own"
  ON payments FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "payments_update_own"
  ON payments FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "payments_delete_own"
  ON payments FOR DELETE
  USING (auth.uid() = user_id);

-- Billing Milestones
CREATE POLICY "billing_milestones_select_own"
  ON billing_milestones FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "billing_milestones_insert_own"
  ON billing_milestones FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "billing_milestones_update_own"
  ON billing_milestones FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "billing_milestones_delete_own"
  ON billing_milestones FOR DELETE
  USING (auth.uid() = user_id);

-- Time Entries
CREATE POLICY "time_entries_select_own"
  ON time_entries FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "time_entries_insert_own"
  ON time_entries FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "time_entries_update_own"
  ON time_entries FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "time_entries_delete_own"
  ON time_entries FOR DELETE
  USING (auth.uid() = user_id);

-- QuickBooks Sync
CREATE POLICY "quickbooks_sync_select_own"
  ON quickbooks_sync FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "quickbooks_sync_insert_own"
  ON quickbooks_sync FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "quickbooks_sync_update_own"
  ON quickbooks_sync FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "quickbooks_sync_delete_own"
  ON quickbooks_sync FOR DELETE
  USING (auth.uid() = user_id);

-- Profit Analytics
CREATE POLICY "profit_analytics_select_own"
  ON profit_analytics FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "profit_analytics_insert_own"
  ON profit_analytics FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "profit_analytics_update_own"
  ON profit_analytics FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "profit_analytics_delete_own"
  ON profit_analytics FOR DELETE
  USING (auth.uid() = user_id);

-- Documentation
COMMENT ON TABLE invoices IS 'Invoice records with client and financial details';
COMMENT ON TABLE payments IS 'Payment transactions linked to invoices';
COMMENT ON TABLE billing_milestones IS 'Project milestones linked to billing amounts';
COMMENT ON TABLE time_entries IS 'Billable time tracking for projects';
COMMENT ON TABLE quickbooks_sync IS 'QuickBooks synchronization tracking';
COMMENT ON TABLE profit_analytics IS 'Calculated profit and margin analytics';

-- =====================================================
-- ROLLBACK INSTRUCTIONS (for documentation only)
-- =====================================================
-- To rollback this migration, execute:
-- DROP TABLE IF EXISTS profit_analytics CASCADE;
-- DROP TABLE IF EXISTS quickbooks_sync CASCADE;
-- DROP TABLE IF EXISTS time_entries CASCADE;
-- DROP TABLE IF EXISTS billing_milestones CASCADE;
-- DROP TABLE IF EXISTS payments CASCADE;
-- DROP TABLE IF EXISTS invoices CASCADE;