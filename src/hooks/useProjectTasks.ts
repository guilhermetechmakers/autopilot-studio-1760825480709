/**
 * React Query hooks for project tasks
 * Generated: 2024-12-20T12:00:00Z
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { projectTasksApi } from '@/api/project-tasks';
import type { ProjectTask, ProjectTaskUpdate } from '@/types/database';

// Query keys
export const projectTaskKeys = {
  all: ['project-tasks'] as const,
  lists: () => [...projectTaskKeys.all, 'list'] as const,
  list: (projectId: string) => [...projectTaskKeys.lists(), projectId] as const,
  byMilestone: (milestoneId: string) => [...projectTaskKeys.lists(), 'milestone', milestoneId] as const,
  byStatus: (projectId: string, status: string) => [...projectTaskKeys.lists(), projectId, 'status', status] as const,
  details: () => [...projectTaskKeys.all, 'detail'] as const,
  detail: (id: string) => [...projectTaskKeys.details(), id] as const,
};

// Get tasks for a project
export function useProjectTasks(projectId: string) {
  return useQuery({
    queryKey: projectTaskKeys.list(projectId),
    queryFn: () => projectTasksApi.getTasks(projectId),
    enabled: !!projectId,
  });
}

// Get tasks by milestone
export function useProjectTasksByMilestone(milestoneId: string) {
  return useQuery({
    queryKey: projectTaskKeys.byMilestone(milestoneId),
    queryFn: () => projectTasksApi.getTasksByMilestone(milestoneId),
    enabled: !!milestoneId,
  });
}

// Get tasks by status
export function useProjectTasksByStatus(projectId: string, status: ProjectTask['status']) {
  return useQuery({
    queryKey: projectTaskKeys.byStatus(projectId, status),
    queryFn: () => projectTasksApi.getTasksByStatus(projectId, status),
    enabled: !!projectId,
  });
}

// Get a single task
export function useProjectTask(id: string) {
  return useQuery({
    queryKey: projectTaskKeys.detail(id),
    queryFn: () => projectTasksApi.getTask(id),
    enabled: !!id,
  });
}

// Create task mutation
export function useCreateProjectTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: projectTasksApi.createTask,
    onSuccess: (newTask) => {
      queryClient.invalidateQueries({ queryKey: projectTaskKeys.list(newTask.project_id) });
      if (newTask.milestone_id) {
        queryClient.invalidateQueries({ queryKey: projectTaskKeys.byMilestone(newTask.milestone_id) });
      }
      queryClient.setQueryData(projectTaskKeys.detail(newTask.id), newTask);
    },
  });
}

// Update task mutation
export function useUpdateProjectTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: ProjectTaskUpdate }) =>
      projectTasksApi.updateTask(id, updates),
    onSuccess: (updatedTask) => {
      queryClient.invalidateQueries({ queryKey: projectTaskKeys.list(updatedTask.project_id) });
      if (updatedTask.milestone_id) {
        queryClient.invalidateQueries({ queryKey: projectTaskKeys.byMilestone(updatedTask.milestone_id) });
      }
      queryClient.setQueryData(projectTaskKeys.detail(updatedTask.id), updatedTask);
    },
  });
}

// Delete task mutation
export function useDeleteProjectTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: projectTasksApi.deleteTask,
    onSuccess: (_, taskId) => {
      queryClient.invalidateQueries({ queryKey: projectTaskKeys.lists() });
      queryClient.removeQueries({ queryKey: projectTaskKeys.detail(taskId) });
    },
  });
}

// Update task status mutation
export function useUpdateProjectTaskStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: ProjectTask['status'] }) =>
      projectTasksApi.updateTaskStatus(id, status),
    onSuccess: (updatedTask) => {
      queryClient.invalidateQueries({ queryKey: projectTaskKeys.list(updatedTask.project_id) });
      if (updatedTask.milestone_id) {
        queryClient.invalidateQueries({ queryKey: projectTaskKeys.byMilestone(updatedTask.milestone_id) });
      }
      queryClient.setQueryData(projectTaskKeys.detail(updatedTask.id), updatedTask);
    },
  });
}

// Assign task mutation
export function useAssignProjectTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, userId }: { id: string; userId: string }) =>
      projectTasksApi.assignTask(id, userId),
    onSuccess: (updatedTask) => {
      queryClient.invalidateQueries({ queryKey: projectTaskKeys.list(updatedTask.project_id) });
      queryClient.setQueryData(projectTaskKeys.detail(updatedTask.id), updatedTask);
    },
  });
}

// Reorder tasks mutation
export function useReorderProjectTasks() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ projectId, taskIds }: { projectId: string; taskIds: string[] }) =>
      projectTasksApi.reorderTasks(projectId, taskIds),
    onSuccess: (_, { projectId }) => {
      queryClient.invalidateQueries({ queryKey: projectTaskKeys.list(projectId) });
    },
  });
}
