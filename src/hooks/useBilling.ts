import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  getInvoices,
  getInvoice,
  createInvoice,
  updateInvoice,
  deleteInvoice,
  getPayments,
  getPayment,
  createPayment,
  updatePayment,
  getBillingMilestones,
  getBillingMilestone,
  createBillingMilestone,
  updateBillingMilestone,
  deleteBillingMilestone,
  getTimeEntries,
  getTimeEntry,
  createTimeEntry,
  updateTimeEntry,
  deleteTimeEntry,
  getQuickBooksSync,
  createQuickBooksSync,
  updateQuickBooksSync,
  getProfitAnalytics,
  createProfitAnalytics,
  updateProfitAnalytics,
  getBillingSummary,
} from '@/api/billing';
import type {
  InvoiceUpdate,
  PaymentUpdate,
  BillingMilestoneUpdate,
  TimeEntryUpdate,
  QuickBooksSyncUpdate,
  ProfitAnalyticsUpdate,
} from '@/types/database';

// =====================================================
// INVOICE HOOKS
// =====================================================

export const useInvoices = (filters?: {
  status?: string;
  project_id?: string;
  date_from?: string;
  date_to?: string;
}) => {
  return useQuery({
    queryKey: ['invoices', filters],
    queryFn: () => getInvoices(filters),
  });
};

export const useInvoice = (id: string) => {
  return useQuery({
    queryKey: ['invoice', id],
    queryFn: () => getInvoice(id),
    enabled: !!id,
  });
};

export const useCreateInvoice = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createInvoice,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
      queryClient.invalidateQueries({ queryKey: ['billing-summary'] });
      toast.success('Invoice created successfully');
    },
    onError: (error) => {
      toast.error(`Failed to create invoice: ${error.message}`);
    },
  });
};

export const useUpdateInvoice = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: InvoiceUpdate }) =>
      updateInvoice(id, updates),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
      queryClient.invalidateQueries({ queryKey: ['invoice', data.id] });
      queryClient.invalidateQueries({ queryKey: ['billing-summary'] });
      toast.success('Invoice updated successfully');
    },
    onError: (error) => {
      toast.error(`Failed to update invoice: ${error.message}`);
    },
  });
};

export const useDeleteInvoice = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteInvoice,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
      queryClient.invalidateQueries({ queryKey: ['billing-summary'] });
      toast.success('Invoice deleted successfully');
    },
    onError: (error) => {
      toast.error(`Failed to delete invoice: ${error.message}`);
    },
  });
};

// =====================================================
// PAYMENT HOOKS
// =====================================================

export const usePayments = (invoice_id?: string) => {
  return useQuery({
    queryKey: ['payments', invoice_id],
    queryFn: () => getPayments(invoice_id),
  });
};

export const usePayment = (id: string) => {
  return useQuery({
    queryKey: ['payment', id],
    queryFn: () => getPayment(id),
    enabled: !!id,
  });
};

export const useCreatePayment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createPayment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payments'] });
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
      queryClient.invalidateQueries({ queryKey: ['billing-summary'] });
      toast.success('Payment recorded successfully');
    },
    onError: (error) => {
      toast.error(`Failed to record payment: ${error.message}`);
    },
  });
};

export const useUpdatePayment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: PaymentUpdate }) =>
      updatePayment(id, updates),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['payments'] });
      queryClient.invalidateQueries({ queryKey: ['payment', data.id] });
      queryClient.invalidateQueries({ queryKey: ['billing-summary'] });
      toast.success('Payment updated successfully');
    },
    onError: (error) => {
      toast.error(`Failed to update payment: ${error.message}`);
    },
  });
};

// =====================================================
// BILLING MILESTONE HOOKS
// =====================================================

export const useBillingMilestones = (project_id?: string) => {
  return useQuery({
    queryKey: ['billing-milestones', project_id],
    queryFn: () => getBillingMilestones(project_id),
  });
};

export const useBillingMilestone = (id: string) => {
  return useQuery({
    queryKey: ['billing-milestone', id],
    queryFn: () => getBillingMilestone(id),
    enabled: !!id,
  });
};

export const useCreateBillingMilestone = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createBillingMilestone,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['billing-milestones'] });
      queryClient.invalidateQueries({ queryKey: ['billing-summary'] });
      toast.success('Billing milestone created successfully');
    },
    onError: (error) => {
      toast.error(`Failed to create billing milestone: ${error.message}`);
    },
  });
};

export const useUpdateBillingMilestone = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: BillingMilestoneUpdate }) =>
      updateBillingMilestone(id, updates),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['billing-milestones'] });
      queryClient.invalidateQueries({ queryKey: ['billing-milestone', data.id] });
      queryClient.invalidateQueries({ queryKey: ['billing-summary'] });
      toast.success('Billing milestone updated successfully');
    },
    onError: (error) => {
      toast.error(`Failed to update billing milestone: ${error.message}`);
    },
  });
};

export const useDeleteBillingMilestone = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteBillingMilestone,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['billing-milestones'] });
      queryClient.invalidateQueries({ queryKey: ['billing-summary'] });
      toast.success('Billing milestone deleted successfully');
    },
    onError: (error) => {
      toast.error(`Failed to delete billing milestone: ${error.message}`);
    },
  });
};

// =====================================================
// TIME ENTRY HOOKS
// =====================================================

export const useTimeEntries = (filters?: {
  project_id?: string;
  task_id?: string;
  invoice_id?: string;
  status?: string;
  date_from?: string;
  date_to?: string;
}) => {
  return useQuery({
    queryKey: ['time-entries', filters],
    queryFn: () => getTimeEntries(filters),
  });
};

export const useTimeEntry = (id: string) => {
  return useQuery({
    queryKey: ['time-entry', id],
    queryFn: () => getTimeEntry(id),
    enabled: !!id,
  });
};

export const useCreateTimeEntry = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createTimeEntry,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['time-entries'] });
      queryClient.invalidateQueries({ queryKey: ['billing-summary'] });
      toast.success('Time entry created successfully');
    },
    onError: (error) => {
      toast.error(`Failed to create time entry: ${error.message}`);
    },
  });
};

export const useUpdateTimeEntry = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: TimeEntryUpdate }) =>
      updateTimeEntry(id, updates),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['time-entries'] });
      queryClient.invalidateQueries({ queryKey: ['time-entry', data.id] });
      queryClient.invalidateQueries({ queryKey: ['billing-summary'] });
      toast.success('Time entry updated successfully');
    },
    onError: (error) => {
      toast.error(`Failed to update time entry: ${error.message}`);
    },
  });
};

export const useDeleteTimeEntry = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteTimeEntry,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['time-entries'] });
      queryClient.invalidateQueries({ queryKey: ['billing-summary'] });
      toast.success('Time entry deleted successfully');
    },
    onError: (error) => {
      toast.error(`Failed to delete time entry: ${error.message}`);
    },
  });
};

// =====================================================
// QUICKBOOKS SYNC HOOKS
// =====================================================

export const useQuickBooksSync = (entity_type?: string) => {
  return useQuery({
    queryKey: ['quickbooks-sync', entity_type],
    queryFn: () => getQuickBooksSync(entity_type),
  });
};

export const useCreateQuickBooksSync = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createQuickBooksSync,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quickbooks-sync'] });
      toast.success('QuickBooks sync initiated');
    },
    onError: (error) => {
      toast.error(`Failed to initiate QuickBooks sync: ${error.message}`);
    },
  });
};

export const useUpdateQuickBooksSync = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: QuickBooksSyncUpdate }) =>
      updateQuickBooksSync(id, updates),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['quickbooks-sync'] });
      queryClient.invalidateQueries({ queryKey: ['quickbooks-sync', data.id] });
      toast.success('QuickBooks sync updated');
    },
    onError: (error) => {
      toast.error(`Failed to update QuickBooks sync: ${error.message}`);
    },
  });
};

// =====================================================
// PROFIT ANALYTICS HOOKS
// =====================================================

export const useProfitAnalytics = (project_id?: string) => {
  return useQuery({
    queryKey: ['profit-analytics', project_id],
    queryFn: () => getProfitAnalytics(project_id),
  });
};

export const useCreateProfitAnalytics = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createProfitAnalytics,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profit-analytics'] });
      toast.success('Profit analytics created');
    },
    onError: (error) => {
      toast.error(`Failed to create profit analytics: ${error.message}`);
    },
  });
};

export const useUpdateProfitAnalytics = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: ProfitAnalyticsUpdate }) =>
      updateProfitAnalytics(id, updates),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['profit-analytics'] });
      queryClient.invalidateQueries({ queryKey: ['profit-analytics', data.id] });
      toast.success('Profit analytics updated');
    },
    onError: (error) => {
      toast.error(`Failed to update profit analytics: ${error.message}`);
    },
  });
};

// =====================================================
// BILLING SUMMARY HOOK
// =====================================================

export const useBillingSummary = (project_id?: string) => {
  return useQuery({
    queryKey: ['billing-summary', project_id],
    queryFn: () => getBillingSummary(project_id),
  });
};