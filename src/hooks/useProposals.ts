import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { proposalsApi } from '@/api/proposals';
import type { 
  ProposalUpdate 
} from '@/types/database';

// Query keys
export const proposalKeys = {
  all: ['proposals'] as const,
  lists: () => [...proposalKeys.all, 'list'] as const,
  list: (filters: Record<string, any>) => [...proposalKeys.lists(), filters] as const,
  details: () => [...proposalKeys.all, 'detail'] as const,
  detail: (id: string) => [...proposalKeys.details(), id] as const,
  byStatus: (status: string) => [...proposalKeys.all, 'status', status] as const,
  byClient: (email: string) => [...proposalKeys.all, 'client', email] as const,
};

// =====================================================
// PROPOSALS HOOKS
// =====================================================

// Get all proposals
export function useProposals() {
  return useQuery({
    queryKey: proposalKeys.lists(),
    queryFn: proposalsApi.getAll,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

// Get proposal by ID
export function useProposal(id: string) {
  return useQuery({
    queryKey: proposalKeys.detail(id),
    queryFn: () => proposalsApi.getById(id),
    enabled: !!id,
  });
}

// Get proposals by status
export function useProposalsByStatus(status: string) {
  return useQuery({
    queryKey: proposalKeys.byStatus(status),
    queryFn: () => proposalsApi.getByStatus(status),
    enabled: !!status,
  });
}

// Get proposals by client email
export function useProposalsByClient(email: string) {
  return useQuery({
    queryKey: proposalKeys.byClient(email),
    queryFn: () => proposalsApi.getByClientEmail(email),
    enabled: !!email,
  });
}

// Create proposal mutation
export function useCreateProposal() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: proposalsApi.create,
    onSuccess: (newProposal) => {
      // Invalidate and refetch proposals list
      queryClient.invalidateQueries({ queryKey: proposalKeys.lists() });
      
      // Add the new proposal to the cache
      queryClient.setQueryData(
        proposalKeys.detail(newProposal.id),
        newProposal
      );
    },
  });
}

// Update proposal mutation
export function useUpdateProposal() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: ProposalUpdate }) =>
      proposalsApi.update(id, updates),
    onSuccess: (updatedProposal) => {
      // Update the specific proposal in cache
      queryClient.setQueryData(
        proposalKeys.detail(updatedProposal.id),
        updatedProposal
      );
      
      // Invalidate lists to ensure consistency
      queryClient.invalidateQueries({ queryKey: proposalKeys.lists() });
    },
  });
}

// Delete proposal mutation
export function useDeleteProposal() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: proposalsApi.delete,
    onSuccess: (_, deletedId) => {
      // Remove from cache
      queryClient.removeQueries({ queryKey: proposalKeys.detail(deletedId) });
      
      // Invalidate lists
      queryClient.invalidateQueries({ queryKey: proposalKeys.lists() });
    },
  });
}

// Update proposal status mutation
export function useUpdateProposalStatus() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      proposalsApi.updateStatus(id, status),
    onSuccess: (updatedProposal) => {
      // Update the specific proposal in cache
      queryClient.setQueryData(
        proposalKeys.detail(updatedProposal.id),
        updatedProposal
      );
      
      // Invalidate lists to ensure consistency
      queryClient.invalidateQueries({ queryKey: proposalKeys.lists() });
    },
  });
}

// Update e-signature status mutation
export function useUpdateESignStatus() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ 
      id, 
      esignStatus, 
      metadata 
    }: { 
      id: string; 
      esignStatus: string; 
      metadata?: Record<string, any> 
    }) => proposalsApi.updateESignStatus(id, esignStatus, metadata),
    onSuccess: (updatedProposal) => {
      // Update the specific proposal in cache
      queryClient.setQueryData(
        proposalKeys.detail(updatedProposal.id),
        updatedProposal
      );
      
      // Invalidate lists to ensure consistency
      queryClient.invalidateQueries({ queryKey: proposalKeys.lists() });
    },
  });
}
