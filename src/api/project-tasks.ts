/**
 * API functions for project tasks
 * Generated: 2024-12-20T12:00:00Z
 */

import { supabase } from '@/lib/supabase';
import type { ProjectTask, ProjectTaskInsert, ProjectTaskUpdate } from '@/types/database';

export const projectTasksApi = {
  // Get all tasks for a project
  async getTasks(projectId: string) {
    const { data, error } = await supabase
      .from('project_tasks')
      .select('*')
      .eq('project_id', projectId)
      .order('sort_order', { ascending: true });

    if (error) throw error;
    return data as ProjectTask[];
  },

  // Get tasks by milestone
  async getTasksByMilestone(milestoneId: string) {
    const { data, error } = await supabase
      .from('project_tasks')
      .select('*')
      .eq('milestone_id', milestoneId)
      .order('sort_order', { ascending: true });

    if (error) throw error;
    return data as ProjectTask[];
  },

  // Get tasks by status
  async getTasksByStatus(projectId: string, status: ProjectTask['status']) {
    const { data, error } = await supabase
      .from('project_tasks')
      .select('*')
      .eq('project_id', projectId)
      .eq('status', status)
      .order('sort_order', { ascending: true });

    if (error) throw error;
    return data as ProjectTask[];
  },

  // Get a single task by ID
  async getTask(id: string) {
    const { data, error } = await supabase
      .from('project_tasks')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data as ProjectTask;
  },

  // Create a new task
  async createTask(task: ProjectTaskInsert) {
    const { data, error } = await supabase
      .from('project_tasks')
      .insert(task)
      .select()
      .single();

    if (error) throw error;
    return data as ProjectTask;
  },

  // Update a task
  async updateTask(id: string, updates: ProjectTaskUpdate) {
    const { data, error } = await supabase
      .from('project_tasks')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data as ProjectTask;
  },

  // Delete a task
  async deleteTask(id: string) {
    const { error } = await supabase
      .from('project_tasks')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  // Update task status
  async updateTaskStatus(id: string, status: ProjectTask['status']) {
    const { data, error } = await supabase
      .from('project_tasks')
      .update({ status })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data as ProjectTask;
  },

  // Assign task to user
  async assignTask(id: string, userId: string) {
    const { data, error } = await supabase
      .from('project_tasks')
      .update({ assigned_to: userId })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data as ProjectTask;
  },

  // Reorder tasks
  async reorderTasks(_projectId: string, taskIds: string[]) {
    const updates = taskIds.map((id, index) => ({
      id,
      sort_order: index
    }));

    const { error } = await supabase
      .from('project_tasks')
      .upsert(updates);

    if (error) throw error;
  }
};
