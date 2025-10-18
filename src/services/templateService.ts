/**
 * Notification Template Service
 * Handles template rendering with variable substitution
 */

import { supabase } from '@/lib/supabase';
import type { 
  NotificationTemplate, 
  NotificationTemplateInsert, 
  NotificationTemplateUpdate,
  NotificationType,
  NotificationChannel
} from '@/types/database';

export interface TemplateVariables {
  [key: string]: any;
}

export interface RenderedTemplate {
  subject?: string;
  title: string;
  message: string;
  html?: string;
  slack?: string;
}

class TemplateService {
  /**
   * Render a template with variables
   */
  renderTemplate(template: NotificationTemplate, variables: TemplateVariables): RenderedTemplate {
    const processedVariables = this.processVariables(variables);
    
    return {
      subject: template.subject_template ? this.substituteVariables(template.subject_template, processedVariables) : undefined,
      title: this.substituteVariables(template.title_template, processedVariables),
      message: this.substituteVariables(template.message_template, processedVariables),
      html: template.html_template ? this.substituteVariables(template.html_template, processedVariables) : undefined,
      slack: template.slack_template ? this.substituteVariables(template.slack_template, processedVariables) : undefined
    };
  }

  /**
   * Substitute variables in template string
   */
  private substituteVariables(template: string, variables: TemplateVariables): string {
    return template.replace(/\{\{(\w+)\}\}/g, (match, key) => {
      return variables[key] !== undefined ? String(variables[key]) : match;
    });
  }

  /**
   * Process and validate variables
   */
  private processVariables(variables: TemplateVariables): TemplateVariables {
    const processed: TemplateVariables = {};

    // Add common variables
    processed.timestamp = new Date().toISOString();
    processed.date = new Date().toLocaleDateString();
    processed.time = new Date().toLocaleTimeString();

    // Add user-provided variables
    Object.assign(processed, variables);

    return processed;
  }

  /**
   * Get template by event type and channel
   */
  async getTemplate(
    eventType: NotificationType, 
    channel: NotificationChannel, 
    userId?: string
  ): Promise<NotificationTemplate | null> {
    let query = supabase
      .from('notification_templates')
      .select('*')
      .eq('event_type', eventType)
      .eq('channel', channel)
      .eq('is_active', true)
      .order('usage_count', { ascending: false });

    if (userId) {
      // First try to find user's own template
      query = query.eq('user_id', userId);
    } else {
      // Find public template
      query = query.eq('is_public', true);
    }

    const { data, error } = await query.single();

    if (error) {
      console.error('Failed to get template:', error);
      return null;
    }

    return data;
  }

  /**
   * Create a new template
   */
  async createTemplate(template: NotificationTemplateInsert): Promise<NotificationTemplate> {
    const { data, error } = await supabase
      .from('notification_templates')
      .insert(template)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create template: ${error.message}`);
    }

    return data;
  }

  /**
   * Update template
   */
  async updateTemplate(id: string, updates: NotificationTemplateUpdate): Promise<NotificationTemplate> {
    const { data, error } = await supabase
      .from('notification_templates')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update template: ${error.message}`);
    }

    return data;
  }

  /**
   * Delete template
   */
  async deleteTemplate(id: string): Promise<void> {
    const { error } = await supabase
      .from('notification_templates')
      .delete()
      .eq('id', id);

    if (error) {
      throw new Error(`Failed to delete template: ${error.message}`);
    }
  }

  /**
   * Get user templates
   */
  async getUserTemplates(userId: string): Promise<NotificationTemplate[]> {
    const { data, error } = await supabase
      .from('notification_templates')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Failed to get user templates:', error);
      return [];
    }

    return data || [];
  }

  /**
   * Get public templates
   */
  async getPublicTemplates(): Promise<NotificationTemplate[]> {
    const { data, error } = await supabase
      .from('notification_templates')
      .select('*')
      .eq('is_public', true)
      .eq('is_active', true)
      .order('usage_count', { ascending: false });

    if (error) {
      console.error('Failed to get public templates:', error);
      return [];
    }

    return data || [];
  }

  /**
   * Increment template usage count
   */
  async incrementUsage(templateId: string): Promise<void> {
    // First get the current usage count
    const { data: template, error: fetchError } = await supabase
      .from('notification_templates')
      .select('usage_count')
      .eq('id', templateId)
      .single();

    if (fetchError) {
      throw new Error(`Failed to fetch template: ${fetchError.message}`);
    }

    const { error } = await supabase
      .from('notification_templates')
      .update({
        usage_count: (template?.usage_count || 0) + 1,
        last_used_at: new Date().toISOString()
      })
      .eq('id', templateId);

    if (error) {
      console.error('Failed to increment template usage:', error);
    }
  }

  /**
   * Create default templates for common event types
   */
  async createDefaultTemplates(userId: string): Promise<void> {
    const defaultTemplates: NotificationTemplateInsert[] = [
      // Proposal templates
      {
        user_id: userId,
        name: 'Proposal Created - Email',
        description: 'Email notification when a new proposal is created',
        event_type: 'proposal',
        channel: 'email',
        subject_template: 'New Proposal: {{proposal_title}}',
        title_template: 'Proposal Created',
        message_template: 'A new proposal "{{proposal_title}}" has been created for {{client_name}} with a value of {{total_value}} {{currency}}.',
        html_template: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #2563EB;">New Proposal Created</h2>
            <p><strong>Proposal:</strong> {{proposal_title}}</p>
            <p><strong>Client:</strong> {{client_name}}</p>
            <p><strong>Value:</strong> {{total_value}} {{currency}}</p>
            <p><strong>Status:</strong> {{status}}</p>
            <a href="{{proposal_url}}" style="background-color: #2563EB; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">View Proposal</a>
          </div>
        `,
        variables: {
          proposal_title: 'string',
          client_name: 'string',
          total_value: 'number',
          currency: 'string',
          status: 'string',
          proposal_url: 'string'
        },
        is_public: true
      },
      {
        user_id: userId,
        name: 'Proposal Created - In-App',
        description: 'In-app notification when a new proposal is created',
        event_type: 'proposal',
        channel: 'in_app',
        title_template: 'New Proposal: {{proposal_title}}',
        message_template: 'A new proposal has been created for {{client_name}} with a value of {{total_value}} {{currency}}.',
        variables: {
          proposal_title: 'string',
          client_name: 'string',
          total_value: 'number',
          currency: 'string'
        },
        is_public: true
      },
      {
        user_id: userId,
        name: 'Proposal Created - Slack',
        description: 'Slack notification when a new proposal is created',
        event_type: 'proposal',
        channel: 'slack',
        title_template: 'New Proposal: {{proposal_title}}',
        message_template: 'A new proposal has been created for {{client_name}} with a value of {{total_value}} {{currency}}.',
        slack_template: `
          *New Proposal Created* 🚀
          *Proposal:* {{proposal_title}}
          *Client:* {{client_name}}
          *Value:* {{total_value}} {{currency}}
          *Status:* {{status}}
          <{{proposal_url}}|View Proposal>
        `,
        variables: {
          proposal_title: 'string',
          client_name: 'string',
          total_value: 'number',
          currency: 'string',
          status: 'string',
          proposal_url: 'string'
        },
        is_public: true
      },
      // Approval templates
      {
        user_id: userId,
        name: 'Approval Required - Email',
        description: 'Email notification when approval is required',
        event_type: 'approval',
        channel: 'email',
        subject_template: 'Approval Required: {{item_title}}',
        title_template: 'Approval Required',
        message_template: '{{item_title}} requires your approval. Please review and approve or request changes.',
        html_template: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #F59E0B;">Approval Required</h2>
            <p><strong>Item:</strong> {{item_title}}</p>
            <p><strong>Type:</strong> {{item_type}}</p>
            <p><strong>Description:</strong> {{description}}</p>
            <div style="margin: 20px 0;">
              <a href="{{approve_url}}" style="background-color: #22C55E; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin-right: 10px;">Approve</a>
              <a href="{{reject_url}}" style="background-color: #EF4444; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Request Changes</a>
            </div>
          </div>
        `,
        variables: {
          item_title: 'string',
          item_type: 'string',
          description: 'string',
          approve_url: 'string',
          reject_url: 'string'
        },
        is_public: true
      },
      // Deployment templates
      {
        user_id: userId,
        name: 'Deployment Success - Slack',
        description: 'Slack notification for successful deployment',
        event_type: 'deployment',
        channel: 'slack',
        title_template: 'Deployment Successful',
        message_template: 'Deployment to {{environment}} completed successfully.',
        slack_template: `
          *Deployment Successful* ✅
          *Project:* {{project_name}}
          *Environment:* {{environment}}
          *Version:* {{version}}
          *Duration:* {{duration}}
          <{{deployment_url}}|View Deployment>
        `,
        variables: {
          project_name: 'string',
          environment: 'string',
          version: 'string',
          duration: 'string',
          deployment_url: 'string'
        },
        is_public: true
      },
      // Invoice templates
      {
        user_id: userId,
        name: 'Invoice Generated - Email',
        description: 'Email notification when invoice is generated',
        event_type: 'invoice',
        channel: 'email',
        subject_template: 'Invoice #{{invoice_number}} Generated',
        title_template: 'Invoice Generated',
        message_template: 'Invoice #{{invoice_number}} for {{client_name}} has been generated with a total of {{total_amount}} {{currency}}.',
        html_template: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #2563EB;">Invoice Generated</h2>
            <p><strong>Invoice #:</strong> {{invoice_number}}</p>
            <p><strong>Client:</strong> {{client_name}}</p>
            <p><strong>Amount:</strong> {{total_amount}} {{currency}}</p>
            <p><strong>Due Date:</strong> {{due_date}}</p>
            <a href="{{invoice_url}}" style="background-color: #2563EB; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">View Invoice</a>
          </div>
        `,
        variables: {
          invoice_number: 'string',
          client_name: 'string',
          total_amount: 'number',
          currency: 'string',
          due_date: 'string',
          invoice_url: 'string'
        },
        is_public: true
      }
    ];

    for (const template of defaultTemplates) {
      try {
        await this.createTemplate(template);
      } catch (error) {
        console.error('Failed to create default template:', error);
      }
    }
  }
}

// Export singleton instance
export const templateService = new TemplateService();
export default templateService;
