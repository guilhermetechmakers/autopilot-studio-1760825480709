/**
 * Database types for invoices table
 * Generated: 2024-12-20T12:00:00Z
 */

export interface Invoice {
  id: string;
  user_id: string;
  project_id: string | null;
  invoice_number: string;
  client_name: string;
  client_email: string;
  client_address: Record<string, any>;
  subtotal: number;
  tax_rate: number;
  tax_amount: number;
  total_amount: number;
  currency: 'USD' | 'EUR' | 'GBP' | 'CAD';
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
  issue_date: string;
  due_date: string;
  paid_date: string | null;
  payment_terms: string;
  payment_method: string | null;
  stripe_payment_intent_id: string | null;
  notes: string | null;
  metadata: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface InvoiceInsert {
  id?: string;
  user_id: string;
  project_id?: string | null;
  invoice_number: string;
  client_name: string;
  client_email: string;
  client_address?: Record<string, any>;
  subtotal?: number;
  tax_rate?: number;
  tax_amount?: number;
  total_amount?: number;
  currency?: 'USD' | 'EUR' | 'GBP' | 'CAD';
  status?: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
  issue_date?: string;
  due_date: string;
  paid_date?: string | null;
  payment_terms?: string;
  payment_method?: string | null;
  stripe_payment_intent_id?: string | null;
  notes?: string | null;
  metadata?: Record<string, any>;
}

export interface InvoiceUpdate {
  project_id?: string | null;
  invoice_number?: string;
  client_name?: string;
  client_email?: string;
  client_address?: Record<string, any>;
  subtotal?: number;
  tax_rate?: number;
  tax_amount?: number;
  total_amount?: number;
  currency?: 'USD' | 'EUR' | 'GBP' | 'CAD';
  status?: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
  issue_date?: string;
  due_date?: string;
  paid_date?: string | null;
  payment_terms?: string;
  payment_method?: string | null;
  stripe_payment_intent_id?: string | null;
  notes?: string | null;
  metadata?: Record<string, any>;
}

// Supabase query result type
export type InvoiceRow = Invoice;