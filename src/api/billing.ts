import { supabase } from '@/lib/supabase';
import type {
  Invoice,
  InvoiceInsert,
  InvoiceUpdate,
  Payment,
  PaymentInsert,
  PaymentUpdate,
  BillingMilestone,
  BillingMilestoneInsert,
  BillingMilestoneUpdate,
  TimeEntry,
  TimeEntryInsert,
  TimeEntryUpdate,
  QuickBooksSync,
  QuickBooksSyncInsert,
  QuickBooksSyncUpdate,
  ProfitAnalytics,
  ProfitAnalyticsInsert,
  ProfitAnalyticsUpdate,
} from '@/types/database';

// =====================================================
// INVOICE OPERATIONS
// =====================================================

export const getInvoices = async (filters?: {
  status?: string;
  project_id?: string;
  date_from?: string;
  date_to?: string;
}): Promise<Invoice[]> => {
  let query = supabase
    .from('invoices')
    .select('*')
    .order('created_at', { ascending: false });

  if (filters?.status) {
    query = query.eq('status', filters.status);
  }
  if (filters?.project_id) {
    query = query.eq('project_id', filters.project_id);
  }
  if (filters?.date_from) {
    query = query.gte('issue_date', filters.date_from);
  }
  if (filters?.date_to) {
    query = query.lte('issue_date', filters.date_to);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data || [];
};

export const getInvoice = async (id: string): Promise<Invoice | null> => {
  const { data, error } = await supabase
    .from('invoices')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
};

export const createInvoice = async (invoice: InvoiceInsert): Promise<Invoice> => {
  const { data, error } = await supabase
    .from('invoices')
    .insert(invoice)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const updateInvoice = async (id: string, updates: InvoiceUpdate): Promise<Invoice> => {
  const { data, error } = await supabase
    .from('invoices')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const deleteInvoice = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('invoices')
    .delete()
    .eq('id', id);

  if (error) throw error;
};

// =====================================================
// PAYMENT OPERATIONS
// =====================================================

export const getPayments = async (invoice_id?: string): Promise<Payment[]> => {
  let query = supabase
    .from('payments')
    .select('*')
    .order('created_at', { ascending: false });

  if (invoice_id) {
    query = query.eq('invoice_id', invoice_id);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data || [];
};

export const getPayment = async (id: string): Promise<Payment | null> => {
  const { data, error } = await supabase
    .from('payments')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
};

export const createPayment = async (payment: PaymentInsert): Promise<Payment> => {
  const { data, error } = await supabase
    .from('payments')
    .insert(payment)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const updatePayment = async (id: string, updates: PaymentUpdate): Promise<Payment> => {
  const { data, error } = await supabase
    .from('payments')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
};

// =====================================================
// BILLING MILESTONE OPERATIONS
// =====================================================

export const getBillingMilestones = async (project_id?: string): Promise<BillingMilestone[]> => {
  let query = supabase
    .from('billing_milestones')
    .select('*')
    .order('created_at', { ascending: false });

  if (project_id) {
    query = query.eq('project_id', project_id);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data || [];
};

export const getBillingMilestone = async (id: string): Promise<BillingMilestone | null> => {
  const { data, error } = await supabase
    .from('billing_milestones')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
};

export const createBillingMilestone = async (milestone: BillingMilestoneInsert): Promise<BillingMilestone> => {
  const { data, error } = await supabase
    .from('billing_milestones')
    .insert(milestone)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const updateBillingMilestone = async (id: string, updates: BillingMilestoneUpdate): Promise<BillingMilestone> => {
  const { data, error } = await supabase
    .from('billing_milestones')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const deleteBillingMilestone = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('billing_milestones')
    .delete()
    .eq('id', id);

  if (error) throw error;
};

// =====================================================
// TIME ENTRY OPERATIONS
// =====================================================

export const getTimeEntries = async (filters?: {
  project_id?: string;
  task_id?: string;
  invoice_id?: string;
  status?: string;
  date_from?: string;
  date_to?: string;
}): Promise<TimeEntry[]> => {
  let query = supabase
    .from('time_entries')
    .select('*')
    .order('start_time', { ascending: false });

  if (filters?.project_id) {
    query = query.eq('project_id', filters.project_id);
  }
  if (filters?.task_id) {
    query = query.eq('task_id', filters.task_id);
  }
  if (filters?.invoice_id) {
    query = query.eq('invoice_id', filters.invoice_id);
  }
  if (filters?.status) {
    query = query.eq('status', filters.status);
  }
  if (filters?.date_from) {
    query = query.gte('start_time', filters.date_from);
  }
  if (filters?.date_to) {
    query = query.lte('start_time', filters.date_to);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data || [];
};

export const getTimeEntry = async (id: string): Promise<TimeEntry | null> => {
  const { data, error } = await supabase
    .from('time_entries')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
};

export const createTimeEntry = async (entry: TimeEntryInsert): Promise<TimeEntry> => {
  const { data, error } = await supabase
    .from('time_entries')
    .insert(entry)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const updateTimeEntry = async (id: string, updates: TimeEntryUpdate): Promise<TimeEntry> => {
  const { data, error } = await supabase
    .from('time_entries')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const deleteTimeEntry = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('time_entries')
    .delete()
    .eq('id', id);

  if (error) throw error;
};

// =====================================================
// QUICKBOOKS SYNC OPERATIONS
// =====================================================

export const getQuickBooksSync = async (entity_type?: string): Promise<QuickBooksSync[]> => {
  let query = supabase
    .from('quickbooks_sync')
    .select('*')
    .order('created_at', { ascending: false });

  if (entity_type) {
    query = query.eq('entity_type', entity_type);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data || [];
};

export const createQuickBooksSync = async (sync: QuickBooksSyncInsert): Promise<QuickBooksSync> => {
  const { data, error } = await supabase
    .from('quickbooks_sync')
    .insert(sync)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const updateQuickBooksSync = async (id: string, updates: QuickBooksSyncUpdate): Promise<QuickBooksSync> => {
  const { data, error } = await supabase
    .from('quickbooks_sync')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
};

// =====================================================
// PROFIT ANALYTICS OPERATIONS
// =====================================================

export const getProfitAnalytics = async (project_id?: string): Promise<ProfitAnalytics[]> => {
  let query = supabase
    .from('profit_analytics')
    .select('*')
    .order('period_start', { ascending: false });

  if (project_id) {
    query = query.eq('project_id', project_id);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data || [];
};

export const createProfitAnalytics = async (analytics: ProfitAnalyticsInsert): Promise<ProfitAnalytics> => {
  const { data, error } = await supabase
    .from('profit_analytics')
    .insert(analytics)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const updateProfitAnalytics = async (id: string, updates: ProfitAnalyticsUpdate): Promise<ProfitAnalytics> => {
  const { data, error } = await supabase
    .from('profit_analytics')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
};

// =====================================================
// BILLING SUMMARY OPERATIONS
// =====================================================

export const getBillingSummary = async (project_id?: string) => {
  const [invoices, payments, milestones, timeEntries] = await Promise.all([
    getInvoices(project_id ? { project_id } : undefined),
    getPayments(),
    getBillingMilestones(project_id),
    getTimeEntries(project_id ? { project_id } : undefined),
  ]);

  const totalInvoiced = invoices.reduce((sum, invoice) => sum + invoice.total_amount, 0);
  const totalPaid = payments
    .filter(payment => payment.status === 'completed')
    .reduce((sum, payment) => sum + payment.amount, 0);
  const totalOutstanding = totalInvoiced - totalPaid;
  const totalBillableHours = timeEntries
    .filter(entry => entry.billable_hours)
    .reduce((sum, entry) => sum + (entry.billable_hours || 0), 0);

  return {
    totalInvoiced,
    totalPaid,
    totalOutstanding,
    totalBillableHours,
    invoiceCount: invoices.length,
    paymentCount: payments.length,
    milestoneCount: milestones.length,
    timeEntryCount: timeEntries.length,
  };
};