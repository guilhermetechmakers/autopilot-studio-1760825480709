/**
 * API functions for project milestones
 * Generated: 2024-12-20T12:00:00Z
 */

import { supabase } from '@/lib/supabase';
import type { ProjectMilestone, ProjectMilestoneInsert, ProjectMilestoneUpdate } from '@/types/database';

export const projectMilestonesApi = {
  // Get all milestones for a project
  async getMilestones(projectId: string) {
    const { data, error } = await supabase
      .from('project_milestones')
      .select('*')
      .eq('project_id', projectId)
      .order('sort_order', { ascending: true });

    if (error) throw error;
    return data as ProjectMilestone[];
  },

  // Get a single milestone by ID
  async getMilestone(id: string) {
    const { data, error } = await supabase
      .from('project_milestones')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data as ProjectMilestone;
  },

  // Create a new milestone
  async createMilestone(milestone: ProjectMilestoneInsert) {
    const { data, error } = await supabase
      .from('project_milestones')
      .insert(milestone)
      .select()
      .single();

    if (error) throw error;
    return data as ProjectMilestone;
  },

  // Update a milestone
  async updateMilestone(id: string, updates: ProjectMilestoneUpdate) {
    const { data, error } = await supabase
      .from('project_milestones')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data as ProjectMilestone;
  },

  // Delete a milestone
  async deleteMilestone(id: string) {
    const { error } = await supabase
      .from('project_milestones')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  // Update milestone status
  async updateMilestoneStatus(id: string, status: ProjectMilestone['status']) {
    const { data, error } = await supabase
      .from('project_milestones')
      .update({ status })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data as ProjectMilestone;
  },

  // Reorder milestones
  async reorderMilestones(_projectId: string, milestoneIds: string[]) {
    const updates = milestoneIds.map((id, index) => ({
      id,
      sort_order: index
    }));

    const { error } = await supabase
      .from('project_milestones')
      .upsert(updates);

    if (error) throw error;
  }
};
