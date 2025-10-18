import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { sowTemplatesApi } from '@/api/proposals';
import type { 
  SowTemplateUpdate 
} from '@/types/database';

// Query keys
export const templateKeys = {
  all: ['sow-templates'] as const,
  lists: () => [...templateKeys.all, 'list'] as const,
  list: (filters: Record<string, any>) => [...templateKeys.lists(), filters] as const,
  details: () => [...templateKeys.all, 'detail'] as const,
  detail: (id: string) => [...templateKeys.details(), id] as const,
  public: () => [...templateKeys.all, 'public'] as const,
  byCategory: (category: string) => [...templateKeys.all, 'category', category] as const,
};

// =====================================================
// SOW TEMPLATES HOOKS
// =====================================================

// Get all templates
export function useSowTemplates() {
  return useQuery({
    queryKey: templateKeys.lists(),
    queryFn: sowTemplatesApi.getAll,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

// Get public templates
export function usePublicTemplates() {
  return useQuery({
    queryKey: templateKeys.public(),
    queryFn: sowTemplatesApi.getPublic,
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
}

// Get templates by category
export function useTemplatesByCategory(category: string) {
  return useQuery({
    queryKey: templateKeys.byCategory(category),
    queryFn: () => sowTemplatesApi.getByCategory(category),
    enabled: !!category,
  });
}

// Get template by ID
export function useSowTemplate(id: string) {
  return useQuery({
    queryKey: templateKeys.detail(id),
    queryFn: () => sowTemplatesApi.getById(id),
    enabled: !!id,
  });
}

// Create template mutation
export function useCreateTemplate() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: sowTemplatesApi.create,
    onSuccess: (newTemplate) => {
      // Invalidate and refetch templates list
      queryClient.invalidateQueries({ queryKey: templateKeys.lists() });
      
      // Add the new template to the cache
      queryClient.setQueryData(
        templateKeys.detail(newTemplate.id),
        newTemplate
      );
    },
  });
}

// Update template mutation
export function useUpdateTemplate() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: SowTemplateUpdate }) =>
      sowTemplatesApi.update(id, updates),
    onSuccess: (updatedTemplate) => {
      // Update the specific template in cache
      queryClient.setQueryData(
        templateKeys.detail(updatedTemplate.id),
        updatedTemplate
      );
      
      // Invalidate lists to ensure consistency
      queryClient.invalidateQueries({ queryKey: templateKeys.lists() });
    },
  });
}

// Delete template mutation
export function useDeleteTemplate() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: sowTemplatesApi.delete,
    onSuccess: (_, deletedId) => {
      // Remove from cache
      queryClient.removeQueries({ queryKey: templateKeys.detail(deletedId) });
      
      // Invalidate lists
      queryClient.invalidateQueries({ queryKey: templateKeys.lists() });
    },
  });
}

// Increment usage count mutation
export function useIncrementTemplateUsage() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: sowTemplatesApi.incrementUsage,
    onSuccess: (updatedTemplate) => {
      // Update the specific template in cache
      queryClient.setQueryData(
        templateKeys.detail(updatedTemplate.id),
        updatedTemplate
      );
      
      // Invalidate lists to ensure consistency
      queryClient.invalidateQueries({ queryKey: templateKeys.lists() });
    },
  });
}
