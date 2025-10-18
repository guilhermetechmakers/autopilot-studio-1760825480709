-- =====================================================
-- Migration: Create Notifications System
-- Created: 2024-12-20T13:00:00Z
-- Tables: notifications, notification_preferences, notification_templates
-- Purpose: Support comprehensive notification system with multiple channels and user preferences
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
-- TABLE: notifications
-- Purpose: Store all notifications sent to users across different channels
-- =====================================================
CREATE TABLE IF NOT EXISTS notifications (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  
  -- Notification details
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('info', 'success', 'warning', 'error', 'proposal', 'approval', 'deployment', 'invoice', 'meeting', 'task', 'system')),
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  
  -- Channel and delivery
  channel TEXT NOT NULL CHECK (channel IN ('email', 'in_app', 'slack', 'webhook', 'sms')),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'delivered', 'failed', 'cancelled')),
  
  -- Content and context
  content JSONB DEFAULT '{}'::jsonb,
  metadata JSONB DEFAULT '{}'::jsonb,
  
  -- Related entities
  related_type TEXT, -- 'proposal', 'project', 'task', 'invoice', etc.
  related_id UUID,
  
  -- Delivery tracking
  delivery_attempts INTEGER DEFAULT 0,
  max_attempts INTEGER DEFAULT 3,
  last_attempt_at TIMESTAMPTZ,
  delivered_at TIMESTAMPTZ,
  failed_at TIMESTAMPTZ,
  error_message TEXT,
  
  -- Retry and backoff
  next_retry_at TIMESTAMPTZ,
  retry_count INTEGER DEFAULT 0,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  scheduled_for TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ,
  
  -- Constraints
  CONSTRAINT notifications_title_not_empty CHECK (length(trim(title)) > 0),
  CONSTRAINT notifications_message_not_empty CHECK (length(trim(message)) > 0),
  CONSTRAINT notifications_delivery_attempts_non_negative CHECK (delivery_attempts >= 0),
  CONSTRAINT notifications_max_attempts_positive CHECK (max_attempts > 0),
  CONSTRAINT notifications_retry_count_non_negative CHECK (retry_count >= 0)
);

-- =====================================================
-- TABLE: notification_preferences
-- Purpose: Store user preferences for notification channels and event types
-- =====================================================
CREATE TABLE IF NOT EXISTS notification_preferences (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  
  -- Channel preferences
  email_enabled BOOLEAN DEFAULT true,
  in_app_enabled BOOLEAN DEFAULT true,
  slack_enabled BOOLEAN DEFAULT false,
  webhook_enabled BOOLEAN DEFAULT false,
  sms_enabled BOOLEAN DEFAULT false,
  
  -- Event type preferences (JSONB for flexible configuration)
  event_preferences JSONB DEFAULT '{
    "proposal": {"email": true, "in_app": true, "slack": false},
    "approval": {"email": true, "in_app": true, "slack": true},
    "deployment": {"email": false, "in_app": true, "slack": true},
    "invoice": {"email": true, "in_app": true, "slack": false},
    "meeting": {"email": true, "in_app": true, "slack": false},
    "task": {"email": false, "in_app": true, "slack": false},
    "system": {"email": true, "in_app": true, "slack": true}
  }'::jsonb,
  
  -- Delivery preferences
  quiet_hours_start TIME DEFAULT '22:00:00',
  quiet_hours_end TIME DEFAULT '08:00:00',
  timezone TEXT DEFAULT 'UTC',
  digest_frequency TEXT DEFAULT 'daily' CHECK (digest_frequency IN ('immediate', 'hourly', 'daily', 'weekly', 'never')),
  
  -- Channel-specific settings
  slack_webhook_url TEXT,
  slack_channel TEXT,
  webhook_url TEXT,
  webhook_headers JSONB DEFAULT '{}'::jsonb,
  sms_phone_number TEXT,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  
  -- Constraints
  CONSTRAINT notification_preferences_user_id_unique UNIQUE(user_id),
  CONSTRAINT notification_preferences_slack_webhook_valid CHECK (
    (slack_enabled = false) OR 
    (slack_enabled = true AND slack_webhook_url IS NOT NULL AND length(trim(slack_webhook_url)) > 0)
  ),
  CONSTRAINT notification_preferences_webhook_valid CHECK (
    (webhook_enabled = false) OR 
    (webhook_enabled = true AND webhook_url IS NOT NULL AND length(trim(webhook_url)) > 0)
  ),
  CONSTRAINT notification_preferences_sms_phone_valid CHECK (
    (sms_enabled = false) OR 
    (sms_enabled = true AND sms_phone_number IS NOT NULL AND length(trim(sms_phone_number)) > 0)
  )
);

-- =====================================================
-- TABLE: notification_templates
-- Purpose: Store reusable notification templates with variable substitution
-- =====================================================
CREATE TABLE IF NOT EXISTS notification_templates (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  
  -- Template details
  name TEXT NOT NULL,
  description TEXT,
  event_type TEXT NOT NULL CHECK (event_type IN ('proposal', 'approval', 'deployment', 'invoice', 'meeting', 'task', 'system')),
  channel TEXT NOT NULL CHECK (channel IN ('email', 'in_app', 'slack', 'webhook', 'sms')),
  
  -- Template content
  subject_template TEXT, -- For email
  title_template TEXT NOT NULL,
  message_template TEXT NOT NULL,
  html_template TEXT, -- For email HTML
  slack_template TEXT, -- For Slack formatting
  
  -- Template variables and settings
  variables JSONB DEFAULT '{}'::jsonb,
  is_active BOOLEAN DEFAULT true,
  is_public BOOLEAN DEFAULT false,
  version TEXT DEFAULT '1.0.0',
  
  -- Usage tracking
  usage_count INTEGER DEFAULT 0,
  last_used_at TIMESTAMPTZ,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  
  -- Constraints
  CONSTRAINT notification_templates_name_not_empty CHECK (length(trim(name)) > 0),
  CONSTRAINT notification_templates_title_template_not_empty CHECK (length(trim(title_template)) > 0),
  CONSTRAINT notification_templates_message_template_not_empty CHECK (length(trim(message_template)) > 0)
);

-- =====================================================
-- TABLE: notification_delivery_logs
-- Purpose: Track delivery attempts and results for debugging
-- =====================================================
CREATE TABLE IF NOT EXISTS notification_delivery_logs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  notification_id UUID REFERENCES notifications(id) ON DELETE CASCADE NOT NULL,
  
  -- Delivery attempt details
  attempt_number INTEGER NOT NULL,
  channel TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('attempting', 'sent', 'delivered', 'failed', 'bounced', 'opened', 'clicked')),
  
  -- Provider details
  provider TEXT, -- 'sendgrid', 'slack', 'webhook', etc.
  provider_message_id TEXT,
  provider_response JSONB DEFAULT '{}'::jsonb,
  
  -- Error details
  error_code TEXT,
  error_message TEXT,
  error_details JSONB DEFAULT '{}'::jsonb,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  
  -- Constraints
  CONSTRAINT notification_delivery_logs_attempt_positive CHECK (attempt_number > 0)
);

-- =====================================================
-- Performance Indexes
-- =====================================================

-- Notifications indexes
CREATE INDEX IF NOT EXISTS notifications_user_id_idx ON notifications(user_id);
CREATE INDEX IF NOT EXISTS notifications_status_idx ON notifications(status);
CREATE INDEX IF NOT EXISTS notifications_type_idx ON notifications(type);
CREATE INDEX IF NOT EXISTS notifications_channel_idx ON notifications(channel);
CREATE INDEX IF NOT EXISTS notifications_created_at_idx ON notifications(created_at DESC);
CREATE INDEX IF NOT EXISTS notifications_scheduled_for_idx ON notifications(scheduled_for);
CREATE INDEX IF NOT EXISTS notifications_next_retry_at_idx ON notifications(next_retry_at) WHERE next_retry_at IS NOT NULL;
CREATE INDEX IF NOT EXISTS notifications_related_idx ON notifications(related_type, related_id) WHERE related_type IS NOT NULL;
CREATE INDEX IF NOT EXISTS notifications_pending_retry_idx ON notifications(status, next_retry_at) WHERE status = 'pending' AND next_retry_at <= NOW();

-- Notification Preferences indexes
CREATE INDEX IF NOT EXISTS notification_preferences_user_id_idx ON notification_preferences(user_id);

-- Notification Templates indexes
CREATE INDEX IF NOT EXISTS notification_templates_user_id_idx ON notification_templates(user_id);
CREATE INDEX IF NOT EXISTS notification_templates_event_type_idx ON notification_templates(event_type);
CREATE INDEX IF NOT EXISTS notification_templates_channel_idx ON notification_templates(channel);
CREATE INDEX IF NOT EXISTS notification_templates_is_active_idx ON notification_templates(is_active) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS notification_templates_is_public_idx ON notification_templates(is_public) WHERE is_public = true;

-- Delivery Logs indexes
CREATE INDEX IF NOT EXISTS notification_delivery_logs_notification_id_idx ON notification_delivery_logs(notification_id);
CREATE INDEX IF NOT EXISTS notification_delivery_logs_created_at_idx ON notification_delivery_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS notification_delivery_logs_status_idx ON notification_delivery_logs(status);

-- =====================================================
-- Auto-update Triggers
-- =====================================================

-- Notifications trigger
DROP TRIGGER IF EXISTS update_notifications_updated_at ON notifications;
CREATE TRIGGER update_notifications_updated_at
  BEFORE UPDATE ON notifications
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Notification Preferences trigger
DROP TRIGGER IF EXISTS update_notification_preferences_updated_at ON notification_preferences;
CREATE TRIGGER update_notification_preferences_updated_at
  BEFORE UPDATE ON notification_preferences
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Notification Templates trigger
DROP TRIGGER IF EXISTS update_notification_templates_updated_at ON notification_templates;
CREATE TRIGGER update_notification_templates_updated_at
  BEFORE UPDATE ON notification_templates
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- Row Level Security (RLS)
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_delivery_logs ENABLE ROW LEVEL SECURITY;

-- Notifications RLS Policies
CREATE POLICY "notifications_select_own"
  ON notifications FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "notifications_insert_own"
  ON notifications FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "notifications_update_own"
  ON notifications FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "notifications_delete_own"
  ON notifications FOR DELETE
  USING (auth.uid() = user_id);

-- Notification Preferences RLS Policies
CREATE POLICY "notification_preferences_select_own"
  ON notification_preferences FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "notification_preferences_insert_own"
  ON notification_preferences FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "notification_preferences_update_own"
  ON notification_preferences FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "notification_preferences_delete_own"
  ON notification_preferences FOR DELETE
  USING (auth.uid() = user_id);

-- Notification Templates RLS Policies
CREATE POLICY "notification_templates_select_own_or_public"
  ON notification_templates FOR SELECT
  USING (auth.uid() = user_id OR is_public = true);

CREATE POLICY "notification_templates_insert_own"
  ON notification_templates FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "notification_templates_update_own"
  ON notification_templates FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "notification_templates_delete_own"
  ON notification_templates FOR DELETE
  USING (auth.uid() = user_id);

-- Delivery Logs RLS Policies (users can only see logs for their notifications)
CREATE POLICY "notification_delivery_logs_select_own"
  ON notification_delivery_logs FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM notifications 
      WHERE notifications.id = notification_delivery_logs.notification_id 
      AND notifications.user_id = auth.uid()
    )
  );

-- =====================================================
-- Helper Functions
-- =====================================================

-- Function to get user notification preferences
CREATE OR REPLACE FUNCTION get_user_notification_preferences(p_user_id UUID)
RETURNS notification_preferences AS $$
BEGIN
  RETURN (
    SELECT * FROM notification_preferences 
    WHERE user_id = p_user_id 
    LIMIT 1
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if user wants notifications for event type and channel
CREATE OR REPLACE FUNCTION should_send_notification(
  p_user_id UUID,
  p_event_type TEXT,
  p_channel TEXT
) RETURNS BOOLEAN AS $$
DECLARE
  prefs notification_preferences;
  channel_enabled BOOLEAN;
  event_enabled BOOLEAN;
BEGIN
  -- Get user preferences
  SELECT * INTO prefs FROM notification_preferences WHERE user_id = p_user_id LIMIT 1;
  
  -- If no preferences found, use defaults
  IF prefs IS NULL THEN
    RETURN p_channel IN ('email', 'in_app');
  END IF;
  
  -- Check if channel is enabled
  CASE p_channel
    WHEN 'email' THEN channel_enabled := prefs.email_enabled;
    WHEN 'in_app' THEN channel_enabled := prefs.in_app_enabled;
    WHEN 'slack' THEN channel_enabled := prefs.slack_enabled;
    WHEN 'webhook' THEN channel_enabled := prefs.webhook_enabled;
    WHEN 'sms' THEN channel_enabled := prefs.sms_enabled;
    ELSE channel_enabled := FALSE;
  END CASE;
  
  -- Check if event type is enabled for this channel
  event_enabled := COALESCE(
    (prefs.event_preferences->p_event_type->>p_channel)::BOOLEAN,
    FALSE
  );
  
  RETURN channel_enabled AND event_enabled;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- Documentation
-- =====================================================

COMMENT ON TABLE notifications IS 'Stores all notifications sent to users across different channels';
COMMENT ON COLUMN notifications.id IS 'Primary key (UUID v4)';
COMMENT ON COLUMN notifications.user_id IS 'Recipient user (references auth.users)';
COMMENT ON COLUMN notifications.title IS 'Notification title';
COMMENT ON COLUMN notifications.message IS 'Notification message content';
COMMENT ON COLUMN notifications.type IS 'Notification type for categorization';
COMMENT ON COLUMN notifications.channel IS 'Delivery channel (email, in_app, slack, webhook, sms)';
COMMENT ON COLUMN notifications.status IS 'Current delivery status';
COMMENT ON COLUMN notifications.content IS 'Rich content and attachments as JSONB';
COMMENT ON COLUMN notifications.related_type IS 'Type of related entity (proposal, project, etc.)';
COMMENT ON COLUMN notifications.related_id IS 'ID of related entity';
COMMENT ON COLUMN notifications.delivery_attempts IS 'Number of delivery attempts made';
COMMENT ON COLUMN notifications.next_retry_at IS 'When to retry delivery if failed';

COMMENT ON TABLE notification_preferences IS 'User preferences for notification channels and event types';
COMMENT ON COLUMN notification_preferences.id IS 'Primary key (UUID v4)';
COMMENT ON COLUMN notification_preferences.user_id IS 'User (references auth.users)';
COMMENT ON COLUMN notification_preferences.event_preferences IS 'Per-event-type channel preferences as JSONB';
COMMENT ON COLUMN notification_preferences.quiet_hours_start IS 'Start of quiet hours (no notifications)';
COMMENT ON COLUMN notification_preferences.quiet_hours_end IS 'End of quiet hours (no notifications)';
COMMENT ON COLUMN notification_preferences.digest_frequency IS 'How often to send digest notifications';

COMMENT ON TABLE notification_templates IS 'Reusable notification templates with variable substitution';
COMMENT ON COLUMN notification_templates.id IS 'Primary key (UUID v4)';
COMMENT ON COLUMN notification_templates.user_id IS 'Owner of this template (references auth.users)';
COMMENT ON COLUMN notification_templates.name IS 'Template name';
COMMENT ON COLUMN notification_templates.event_type IS 'Event type this template is for';
COMMENT ON COLUMN notification_templates.channel IS 'Channel this template is for';
COMMENT ON COLUMN notification_templates.title_template IS 'Title template with variables';
COMMENT ON COLUMN notification_templates.message_template IS 'Message template with variables';
COMMENT ON COLUMN notification_templates.variables IS 'Available variables for substitution';

COMMENT ON TABLE notification_delivery_logs IS 'Track delivery attempts and results for debugging';
COMMENT ON COLUMN notification_delivery_logs.id IS 'Primary key (UUID v4)';
COMMENT ON COLUMN notification_delivery_logs.notification_id IS 'Parent notification (references notifications)';
COMMENT ON COLUMN notification_delivery_logs.attempt_number IS 'Sequential attempt number';
COMMENT ON COLUMN notification_delivery_logs.status IS 'Result of this delivery attempt';
COMMENT ON COLUMN notification_delivery_logs.provider_message_id IS 'Provider-specific message ID';
COMMENT ON COLUMN notification_delivery_logs.provider_response IS 'Full provider response as JSONB';

-- =====================================================
-- ROLLBACK INSTRUCTIONS (for documentation only)
-- =====================================================
-- To rollback this migration, execute:
-- DROP TABLE IF EXISTS notification_delivery_logs CASCADE;
-- DROP TABLE IF EXISTS notification_templates CASCADE;
-- DROP TABLE IF EXISTS notification_preferences CASCADE;
-- DROP TABLE IF EXISTS notifications CASCADE;
