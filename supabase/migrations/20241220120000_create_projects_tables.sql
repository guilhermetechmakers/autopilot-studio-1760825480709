-- =====================================================
-- Migration: Create Projects Tables
-- Created: 2024-12-20T12:00:00Z
-- Tables: projects, project_milestones, project_tasks, project_repos, project_files, project_audit_logs
-- Purpose: Support project-specific workspaces with milestones, tasks, and audit tracking
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
-- TABLE: projects
-- Purpose: Main project records with client info and status
-- =====================================================
CREATE TABLE IF NOT EXISTS projects (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  
  -- Core project fields
  name TEXT NOT NULL,
  description TEXT,
  client_name TEXT NOT NULL,
  client_email TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'paused', 'completed', 'cancelled')),
  
  -- Project metadata
  budget DECIMAL(12,2),
  start_date DATE,
  end_date DATE,
  estimated_hours INTEGER,
  
  -- Flexible metadata for project-specific data
  metadata JSONB DEFAULT '{}'::jsonb,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  
  -- Constraints
  CONSTRAINT projects_name_not_empty CHECK (length(trim(name)) > 0),
  CONSTRAINT projects_client_name_not_empty CHECK (length(trim(client_name)) > 0),
  CONSTRAINT projects_budget_positive CHECK (budget IS NULL OR budget > 0),
  CONSTRAINT projects_estimated_hours_positive CHECK (estimated_hours IS NULL OR estimated_hours > 0)
);

-- =====================================================
-- TABLE: project_milestones
-- Purpose: Project milestones with acceptance criteria and billing triggers
-- =====================================================
CREATE TABLE IF NOT EXISTS project_milestones (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE NOT NULL,
  
  -- Core milestone fields
  name TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'cancelled')),
  
  -- Timeline and billing
  due_date DATE,
  billing_amount DECIMAL(12,2),
  billing_trigger TEXT CHECK (billing_trigger IN ('on_start', 'on_completion', 'on_approval')),
  
  -- Acceptance criteria
  acceptance_criteria TEXT[],
  
  -- Ordering and dependencies
  sort_order INTEGER DEFAULT 0,
  depends_on_milestone_id UUID REFERENCES project_milestones(id) ON DELETE SET NULL,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  
  -- Constraints
  CONSTRAINT project_milestones_name_not_empty CHECK (length(trim(name)) > 0),
  CONSTRAINT project_milestones_billing_amount_positive CHECK (billing_amount IS NULL OR billing_amount > 0)
);

-- =====================================================
-- TABLE: project_tasks
-- Purpose: Individual tasks within projects with assignments and labels
-- =====================================================
CREATE TABLE IF NOT EXISTS project_tasks (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE NOT NULL,
  milestone_id UUID REFERENCES project_milestones(id) ON DELETE SET NULL,
  
  -- Core task fields
  title TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'todo' CHECK (status IN ('todo', 'in_progress', 'review', 'completed', 'cancelled')),
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  
  -- Assignment and tracking
  assigned_to UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  due_date DATE,
  estimated_hours DECIMAL(5,2),
  actual_hours DECIMAL(5,2),
  
  -- Labels and categorization
  labels TEXT[],
  task_type TEXT CHECK (task_type IN ('development', 'design', 'testing', 'documentation', 'review', 'other')),
  
  -- Ordering
  sort_order INTEGER DEFAULT 0,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  
  -- Constraints
  CONSTRAINT project_tasks_title_not_empty CHECK (length(trim(title)) > 0),
  CONSTRAINT project_tasks_estimated_hours_positive CHECK (estimated_hours IS NULL OR estimated_hours > 0),
  CONSTRAINT project_tasks_actual_hours_positive CHECK (actual_hours IS NULL OR actual_hours > 0)
);

-- =====================================================
-- TABLE: project_repos
-- Purpose: Repository integrations for projects
-- =====================================================
CREATE TABLE IF NOT EXISTS project_repos (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE NOT NULL,
  
  -- Repository info
  provider TEXT NOT NULL CHECK (provider IN ('github', 'gitlab', 'bitbucket')),
  repo_id TEXT NOT NULL,
  repo_name TEXT NOT NULL,
  repo_url TEXT NOT NULL,
  default_branch TEXT DEFAULT 'main',
  
  -- Integration status
  is_connected BOOLEAN DEFAULT true,
  last_sync_at TIMESTAMPTZ,
  webhook_id TEXT,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  
  -- Constraints
  CONSTRAINT project_repos_repo_name_not_empty CHECK (length(trim(repo_name)) > 0),
  CONSTRAINT project_repos_repo_url_not_empty CHECK (length(trim(repo_url)) > 0),
  UNIQUE(project_id, provider, repo_id)
);

-- =====================================================
-- TABLE: project_files
-- Purpose: File and asset management for projects
-- =====================================================
CREATE TABLE IF NOT EXISTS project_files (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE NOT NULL,
  
  -- File info
  name TEXT NOT NULL,
  file_type TEXT NOT NULL CHECK (file_type IN ('document', 'image', 'video', 'audio', 'archive', 'other')),
  file_size BIGINT,
  file_url TEXT NOT NULL,
  
  -- Organization
  folder_path TEXT DEFAULT '/',
  description TEXT,
  tags TEXT[],
  
  -- Access control
  is_public BOOLEAN DEFAULT false,
  is_client_visible BOOLEAN DEFAULT true,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  
  -- Constraints
  CONSTRAINT project_files_name_not_empty CHECK (length(trim(name)) > 0),
  CONSTRAINT project_files_file_url_not_empty CHECK (length(trim(file_url)) > 0),
  CONSTRAINT project_files_file_size_positive CHECK (file_size IS NULL OR file_size > 0)
);

-- =====================================================
-- TABLE: project_audit_logs
-- Purpose: Audit trail for all project actions and approvals
-- =====================================================
CREATE TABLE IF NOT EXISTS project_audit_logs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  
  -- Action details
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id UUID,
  description TEXT,
  
  -- Change tracking
  old_values JSONB,
  new_values JSONB,
  
  -- Context
  ip_address INET,
  user_agent TEXT,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  
  -- Constraints
  CONSTRAINT project_audit_logs_action_not_empty CHECK (length(trim(action)) > 0),
  CONSTRAINT project_audit_logs_entity_type_not_empty CHECK (length(trim(entity_type)) > 0)
);

-- =====================================================
-- PERFORMANCE INDEXES
-- =====================================================

-- Projects indexes
CREATE INDEX IF NOT EXISTS projects_user_id_idx ON projects(user_id);
CREATE INDEX IF NOT EXISTS projects_created_at_idx ON projects(created_at DESC);
CREATE INDEX IF NOT EXISTS projects_status_idx ON projects(status) WHERE status != 'cancelled';
CREATE INDEX IF NOT EXISTS projects_client_name_idx ON projects(client_name);

-- Project milestones indexes
CREATE INDEX IF NOT EXISTS project_milestones_project_id_idx ON project_milestones(project_id);
CREATE INDEX IF NOT EXISTS project_milestones_status_idx ON project_milestones(status);
CREATE INDEX IF NOT EXISTS project_milestones_due_date_idx ON project_milestones(due_date);
CREATE INDEX IF NOT EXISTS project_milestones_sort_order_idx ON project_milestones(project_id, sort_order);

-- Project tasks indexes
CREATE INDEX IF NOT EXISTS project_tasks_project_id_idx ON project_tasks(project_id);
CREATE INDEX IF NOT EXISTS project_tasks_milestone_id_idx ON project_tasks(milestone_id);
CREATE INDEX IF NOT EXISTS project_tasks_assigned_to_idx ON project_tasks(assigned_to);
CREATE INDEX IF NOT EXISTS project_tasks_status_idx ON project_tasks(status);
CREATE INDEX IF NOT EXISTS project_tasks_priority_idx ON project_tasks(priority);
CREATE INDEX IF NOT EXISTS project_tasks_due_date_idx ON project_tasks(due_date);
CREATE INDEX IF NOT EXISTS project_tasks_sort_order_idx ON project_tasks(project_id, sort_order);

-- Project repos indexes
CREATE INDEX IF NOT EXISTS project_repos_project_id_idx ON project_repos(project_id);
CREATE INDEX IF NOT EXISTS project_repos_provider_idx ON project_repos(provider);
CREATE INDEX IF NOT EXISTS project_repos_is_connected_idx ON project_repos(is_connected);

-- Project files indexes
CREATE INDEX IF NOT EXISTS project_files_project_id_idx ON project_files(project_id);
CREATE INDEX IF NOT EXISTS project_files_file_type_idx ON project_files(file_type);
CREATE INDEX IF NOT EXISTS project_files_is_client_visible_idx ON project_files(is_client_visible);
CREATE INDEX IF NOT EXISTS project_files_folder_path_idx ON project_files(project_id, folder_path);

-- Project audit logs indexes
CREATE INDEX IF NOT EXISTS project_audit_logs_project_id_idx ON project_audit_logs(project_id);
CREATE INDEX IF NOT EXISTS project_audit_logs_user_id_idx ON project_audit_logs(user_id);
CREATE INDEX IF NOT EXISTS project_audit_logs_action_idx ON project_audit_logs(action);
CREATE INDEX IF NOT EXISTS project_audit_logs_entity_type_idx ON project_audit_logs(entity_type);
CREATE INDEX IF NOT EXISTS project_audit_logs_created_at_idx ON project_audit_logs(created_at DESC);

-- =====================================================
-- AUTO-UPDATE TRIGGERS
-- =====================================================

-- Projects trigger
DROP TRIGGER IF EXISTS update_projects_updated_at ON projects;
CREATE TRIGGER update_projects_updated_at
  BEFORE UPDATE ON projects
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Project milestones trigger
DROP TRIGGER IF EXISTS update_project_milestones_updated_at ON project_milestones;
CREATE TRIGGER update_project_milestones_updated_at
  BEFORE UPDATE ON project_milestones
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Project tasks trigger
DROP TRIGGER IF EXISTS update_project_tasks_updated_at ON project_tasks;
CREATE TRIGGER update_project_tasks_updated_at
  BEFORE UPDATE ON project_tasks
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Project repos trigger
DROP TRIGGER IF EXISTS update_project_repos_updated_at ON project_repos;
CREATE TRIGGER update_project_repos_updated_at
  BEFORE UPDATE ON project_repos
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Project files trigger
DROP TRIGGER IF EXISTS update_project_files_updated_at ON project_files;
CREATE TRIGGER update_project_files_updated_at
  BEFORE UPDATE ON project_files
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- ROW LEVEL SECURITY
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_repos ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_audit_logs ENABLE ROW LEVEL SECURITY;

-- Projects RLS policies
CREATE POLICY "projects_select_own"
  ON projects FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "projects_insert_own"
  ON projects FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "projects_update_own"
  ON projects FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "projects_delete_own"
  ON projects FOR DELETE
  USING (auth.uid() = user_id);

-- Project milestones RLS policies
CREATE POLICY "project_milestones_select_project_owner"
  ON project_milestones FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM projects 
    WHERE projects.id = project_milestones.project_id 
    AND projects.user_id = auth.uid()
  ));

CREATE POLICY "project_milestones_insert_project_owner"
  ON project_milestones FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM projects 
    WHERE projects.id = project_milestones.project_id 
    AND projects.user_id = auth.uid()
  ));

CREATE POLICY "project_milestones_update_project_owner"
  ON project_milestones FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM projects 
    WHERE projects.id = project_milestones.project_id 
    AND projects.user_id = auth.uid()
  ))
  WITH CHECK (EXISTS (
    SELECT 1 FROM projects 
    WHERE projects.id = project_milestones.project_id 
    AND projects.user_id = auth.uid()
  ));

CREATE POLICY "project_milestones_delete_project_owner"
  ON project_milestones FOR DELETE
  USING (EXISTS (
    SELECT 1 FROM projects 
    WHERE projects.id = project_milestones.project_id 
    AND projects.user_id = auth.uid()
  ));

-- Project tasks RLS policies
CREATE POLICY "project_tasks_select_project_owner"
  ON project_tasks FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM projects 
    WHERE projects.id = project_tasks.project_id 
    AND projects.user_id = auth.uid()
  ));

CREATE POLICY "project_tasks_insert_project_owner"
  ON project_tasks FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM projects 
    WHERE projects.id = project_tasks.project_id 
    AND projects.user_id = auth.uid()
  ));

CREATE POLICY "project_tasks_update_project_owner"
  ON project_tasks FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM projects 
    WHERE projects.id = project_tasks.project_id 
    AND projects.user_id = auth.uid()
  ))
  WITH CHECK (EXISTS (
    SELECT 1 FROM projects 
    WHERE projects.id = project_tasks.project_id 
    AND projects.user_id = auth.uid()
  ));

CREATE POLICY "project_tasks_delete_project_owner"
  ON project_tasks FOR DELETE
  USING (EXISTS (
    SELECT 1 FROM projects 
    WHERE projects.id = project_tasks.project_id 
    AND projects.user_id = auth.uid()
  ));

-- Project repos RLS policies
CREATE POLICY "project_repos_select_project_owner"
  ON project_repos FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM projects 
    WHERE projects.id = project_repos.project_id 
    AND projects.user_id = auth.uid()
  ));

CREATE POLICY "project_repos_insert_project_owner"
  ON project_repos FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM projects 
    WHERE projects.id = project_repos.project_id 
    AND projects.user_id = auth.uid()
  ));

CREATE POLICY "project_repos_update_project_owner"
  ON project_repos FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM projects 
    WHERE projects.id = project_repos.project_id 
    AND projects.user_id = auth.uid()
  ))
  WITH CHECK (EXISTS (
    SELECT 1 FROM projects 
    WHERE projects.id = project_repos.project_id 
    AND projects.user_id = auth.uid()
  ));

CREATE POLICY "project_repos_delete_project_owner"
  ON project_repos FOR DELETE
  USING (EXISTS (
    SELECT 1 FROM projects 
    WHERE projects.id = project_repos.project_id 
    AND projects.user_id = auth.uid()
  ));

-- Project files RLS policies
CREATE POLICY "project_files_select_project_owner"
  ON project_files FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM projects 
    WHERE projects.id = project_files.project_id 
    AND projects.user_id = auth.uid()
  ));

CREATE POLICY "project_files_insert_project_owner"
  ON project_files FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM projects 
    WHERE projects.id = project_files.project_id 
    AND projects.user_id = auth.uid()
  ));

CREATE POLICY "project_files_update_project_owner"
  ON project_files FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM projects 
    WHERE projects.id = project_files.project_id 
    AND projects.user_id = auth.uid()
  ))
  WITH CHECK (EXISTS (
    SELECT 1 FROM projects 
    WHERE projects.id = project_files.project_id 
    AND projects.user_id = auth.uid()
  ));

CREATE POLICY "project_files_delete_project_owner"
  ON project_files FOR DELETE
  USING (EXISTS (
    SELECT 1 FROM projects 
    WHERE projects.id = project_files.project_id 
    AND projects.user_id = auth.uid()
  ));

-- Project audit logs RLS policies
CREATE POLICY "project_audit_logs_select_project_owner"
  ON project_audit_logs FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM projects 
    WHERE projects.id = project_audit_logs.project_id 
    AND projects.user_id = auth.uid()
  ));

CREATE POLICY "project_audit_logs_insert_project_owner"
  ON project_audit_logs FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM projects 
    WHERE projects.id = project_audit_logs.project_id 
    AND projects.user_id = auth.uid()
  ));

-- =====================================================
-- DOCUMENTATION
-- =====================================================

COMMENT ON TABLE projects IS 'Main project records with client information and status tracking';
COMMENT ON COLUMN projects.id IS 'Primary key (UUID v4)';
COMMENT ON COLUMN projects.user_id IS 'Owner of this project (references auth.users)';
COMMENT ON COLUMN projects.name IS 'Project name/title';
COMMENT ON COLUMN projects.client_name IS 'Client company or individual name';
COMMENT ON COLUMN projects.status IS 'Current project status (active, paused, completed, cancelled)';
COMMENT ON COLUMN projects.budget IS 'Total project budget in decimal format';
COMMENT ON COLUMN projects.metadata IS 'Flexible JSONB field for project-specific data';

COMMENT ON TABLE project_milestones IS 'Project milestones with acceptance criteria and billing triggers';
COMMENT ON COLUMN project_milestones.id IS 'Primary key (UUID v4)';
COMMENT ON COLUMN project_milestones.project_id IS 'Parent project (references projects)';
COMMENT ON COLUMN project_milestones.acceptance_criteria IS 'Array of acceptance criteria for this milestone';
COMMENT ON COLUMN project_milestones.billing_trigger IS 'When to trigger billing for this milestone';

COMMENT ON TABLE project_tasks IS 'Individual tasks within projects with assignments and tracking';
COMMENT ON COLUMN project_tasks.id IS 'Primary key (UUID v4)';
COMMENT ON COLUMN project_tasks.project_id IS 'Parent project (references projects)';
COMMENT ON COLUMN project_tasks.milestone_id IS 'Associated milestone (references project_milestones)';
COMMENT ON COLUMN project_tasks.assigned_to IS 'User assigned to this task (references auth.users)';

COMMENT ON TABLE project_repos IS 'Repository integrations for projects';
COMMENT ON COLUMN project_repos.id IS 'Primary key (UUID v4)';
COMMENT ON COLUMN project_repos.project_id IS 'Parent project (references projects)';
COMMENT ON COLUMN project_repos.provider IS 'Repository provider (github, gitlab, bitbucket)';
COMMENT ON COLUMN project_repos.repo_id IS 'Repository ID from the provider';

COMMENT ON TABLE project_files IS 'File and asset management for projects';
COMMENT ON COLUMN project_files.id IS 'Primary key (UUID v4)';
COMMENT ON COLUMN project_files.project_id IS 'Parent project (references projects)';
COMMENT ON COLUMN project_files.file_type IS 'Type of file (document, image, video, etc.)';
COMMENT ON COLUMN project_files.is_client_visible IS 'Whether client can see this file';

COMMENT ON TABLE project_audit_logs IS 'Audit trail for all project actions and approvals';
COMMENT ON COLUMN project_audit_logs.id IS 'Primary key (UUID v4)';
COMMENT ON COLUMN project_audit_logs.project_id IS 'Parent project (references projects)';
COMMENT ON COLUMN project_audit_logs.action IS 'Action performed (create, update, delete, approve, etc.)';
COMMENT ON COLUMN project_audit_logs.entity_type IS 'Type of entity affected (project, milestone, task, etc.)';

-- =====================================================
-- ROLLBACK INSTRUCTIONS (for documentation only)
-- =====================================================
-- To rollback this migration, execute:
-- DROP TABLE IF EXISTS project_audit_logs CASCADE;
-- DROP TABLE IF EXISTS project_files CASCADE;
-- DROP TABLE IF EXISTS project_repos CASCADE;
-- DROP TABLE IF EXISTS project_tasks CASCADE;
-- DROP TABLE IF EXISTS project_milestones CASCADE;
-- DROP TABLE IF EXISTS projects CASCADE;
