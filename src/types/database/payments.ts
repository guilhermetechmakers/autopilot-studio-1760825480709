/**
 * Database types for payments table
 * Generated: 2024-12-20T12:00:00Z
 */

export interface Payment {
  id: string;
  user_id: string;
  invoice_id: string;
  amount: number;
  currency: 'USD' | 'EUR' | 'GBP' | 'CAD';
  payment_method: string;
  payment_reference: string | null;
  stripe_payment_intent_id: string | null;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  processed_at: string | null;
  notes: string | null;
  metadata: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface PaymentInsert {
  id?: string;
  user_id: string;
  invoice_id: string;
  amount: number;
  currency?: 'USD' | 'EUR' | 'GBP' | 'CAD';
  payment_method: string;
  payment_reference?: string | null;
  stripe_payment_intent_id?: string | null;
  status?: 'pending' | 'completed' | 'failed' | 'refunded';
  processed_at?: string | null;
  notes?: string | null;
  metadata?: Record<string, any>;
}

export interface PaymentUpdate {
  amount?: number;
  currency?: 'USD' | 'EUR' | 'GBP' | 'CAD';
  payment_method?: string;
  payment_reference?: string | null;
  stripe_payment_intent_id?: string | null;
  status?: 'pending' | 'completed' | 'failed' | 'refunded';
  processed_at?: string | null;
  notes?: string | null;
  metadata?: Record<string, any>;
}

// Supabase query result type
export type PaymentRow = Payment;