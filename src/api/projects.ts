/**
 * API functions for projects
 * Generated: 2024-12-20T12:00:00Z
 */

import { supabase } from '@/lib/supabase';
import type { Project, ProjectInsert, ProjectUpdate } from '@/types/database';

export const projectsApi = {
  // Get all projects for the current user
  async getProjects() {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data as Project[];
  },

  // Get a single project by ID
  async getProject(id: string) {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data as Project;
  },

  // Create a new project
  async createProject(project: ProjectInsert) {
    const { data, error } = await supabase
      .from('projects')
      .insert(project)
      .select()
      .single();

    if (error) throw error;
    return data as Project;
  },

  // Update a project
  async updateProject(id: string, updates: ProjectUpdate) {
    const { data, error } = await supabase
      .from('projects')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data as Project;
  },

  // Delete a project
  async deleteProject(id: string) {
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  // Get projects by status
  async getProjectsByStatus(status: Project['status']) {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('status', status)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data as Project[];
  },

  // Search projects by name or client
  async searchProjects(query: string) {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .or(`name.ilike.%${query}%,client_name.ilike.%${query}%`)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data as Project[];
  }
};
