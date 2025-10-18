/**
 * React Query hooks for project milestones
 * Generated: 2024-12-20T12:00:00Z
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { projectMilestonesApi } from '@/api/project-milestones';
import type { ProjectMilestone, ProjectMilestoneUpdate } from '@/types/database';

// Query keys
export const projectMilestoneKeys = {
  all: ['project-milestones'] as const,
  lists: () => [...projectMilestoneKeys.all, 'list'] as const,
  list: (projectId: string) => [...projectMilestoneKeys.lists(), projectId] as const,
  details: () => [...projectMilestoneKeys.all, 'detail'] as const,
  detail: (id: string) => [...projectMilestoneKeys.details(), id] as const,
};

// Get milestones for a project
export function useProjectMilestones(projectId: string) {
  return useQuery({
    queryKey: projectMilestoneKeys.list(projectId),
    queryFn: () => projectMilestonesApi.getMilestones(projectId),
    enabled: !!projectId,
  });
}

// Get a single milestone
export function useProjectMilestone(id: string) {
  return useQuery({
    queryKey: projectMilestoneKeys.detail(id),
    queryFn: () => projectMilestonesApi.getMilestone(id),
    enabled: !!id,
  });
}

// Create milestone mutation
export function useCreateProjectMilestone() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: projectMilestonesApi.createMilestone,
    onSuccess: (newMilestone) => {
      queryClient.invalidateQueries({ queryKey: projectMilestoneKeys.list(newMilestone.project_id) });
      queryClient.setQueryData(projectMilestoneKeys.detail(newMilestone.id), newMilestone);
    },
  });
}

// Update milestone mutation
export function useUpdateProjectMilestone() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: ProjectMilestoneUpdate }) =>
      projectMilestonesApi.updateMilestone(id, updates),
    onSuccess: (updatedMilestone) => {
      queryClient.invalidateQueries({ queryKey: projectMilestoneKeys.list(updatedMilestone.project_id) });
      queryClient.setQueryData(projectMilestoneKeys.detail(updatedMilestone.id), updatedMilestone);
    },
  });
}

// Delete milestone mutation
export function useDeleteProjectMilestone() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: projectMilestonesApi.deleteMilestone,
    onSuccess: (_, milestoneId) => {
      queryClient.invalidateQueries({ queryKey: projectMilestoneKeys.lists() });
      queryClient.removeQueries({ queryKey: projectMilestoneKeys.detail(milestoneId) });
    },
  });
}

// Update milestone status mutation
export function useUpdateProjectMilestoneStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: ProjectMilestone['status'] }) =>
      projectMilestonesApi.updateMilestoneStatus(id, status),
    onSuccess: (updatedMilestone) => {
      queryClient.invalidateQueries({ queryKey: projectMilestoneKeys.list(updatedMilestone.project_id) });
      queryClient.setQueryData(projectMilestoneKeys.detail(updatedMilestone.id), updatedMilestone);
    },
  });
}

// Reorder milestones mutation
export function useReorderProjectMilestones() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ projectId, milestoneIds }: { projectId: string; milestoneIds: string[] }) =>
      projectMilestonesApi.reorderMilestones(projectId, milestoneIds),
    onSuccess: (_, { projectId }) => {
      queryClient.invalidateQueries({ queryKey: projectMilestoneKeys.list(projectId) });
    },
  });
}
