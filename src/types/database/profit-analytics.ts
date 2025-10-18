/**
 * Database types for profit_analytics table
 * Generated: 2024-12-20T12:00:00Z
 */

export interface ProfitAnalytics {
  id: string;
  user_id: string;
  project_id: string;
  period_start: string;
  period_end: string;
  total_revenue: number;
  total_costs: number;
  gross_profit: number;
  profit_margin: number;
  labor_costs: number;
  overhead_costs: number;
  other_costs: number;
  billable_hours: number;
  effective_hourly_rate: number;
  created_at: string;
  updated_at: string;
}

export interface ProfitAnalyticsInsert {
  id?: string;
  user_id: string;
  project_id: string;
  period_start: string;
  period_end: string;
  total_revenue?: number;
  total_costs?: number;
  gross_profit?: number;
  profit_margin?: number;
  labor_costs?: number;
  overhead_costs?: number;
  other_costs?: number;
  billable_hours?: number;
  effective_hourly_rate?: number;
}

export interface ProfitAnalyticsUpdate {
  total_revenue?: number;
  total_costs?: number;
  gross_profit?: number;
  profit_margin?: number;
  labor_costs?: number;
  overhead_costs?: number;
  other_costs?: number;
  billable_hours?: number;
  effective_hourly_rate?: number;
}

// Supabase query result type
export type ProfitAnalyticsRow = ProfitAnalytics;