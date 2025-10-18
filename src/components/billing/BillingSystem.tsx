import React from 'react';
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  DollarSign, 
  CreditCard, 
  Clock, 
  TrendingUp, 
  FileText, 
  Settings,
  Plus,
  Download,
  RefreshCw
} from 'lucide-react';

import { MilestoneBillingTable } from './MilestoneBillingTable';
import { InvoiceList } from './InvoiceList';
import { TimeTrackingIntegration } from './TimeTrackingIntegration';
import { QuickBooksSyncPanel } from './QuickBooksSyncPanel';
import { ProfitAnalytics } from './ProfitAnalytics';
import { PaymentMethods } from './PaymentMethods';
import { useBillingSummary } from '@/hooks/useBilling';

interface BillingSystemProps {
  projectId?: string;
}

export const BillingSystem: React.FC<BillingSystemProps> = ({ projectId }) => {
  const { data: summary, isLoading: summaryLoading } = useBillingSummary(projectId);

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 },
    },
  };

  if (summaryLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="pb-2">
                <div className="h-4 bg-muted rounded w-3/4"></div>
                <div className="h-8 bg-muted rounded w-1/2"></div>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Billing & Invoicing</h1>
          <p className="text-muted-foreground">
            Manage invoices, payments, and financial analytics
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            New Invoice
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <motion.div 
        variants={cardVariants}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        <Card className="hover:shadow-lg transition-shadow duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Invoiced</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${summary?.totalInvoiced?.toLocaleString() || '0'}
            </div>
            <p className="text-xs text-muted-foreground">
              {summary?.invoiceCount || 0} invoices
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Paid</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              ${summary?.totalPaid?.toLocaleString() || '0'}
            </div>
            <p className="text-xs text-muted-foreground">
              {summary?.paymentCount || 0} payments
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Outstanding</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              ${summary?.totalOutstanding?.toLocaleString() || '0'}
            </div>
            <p className="text-xs text-muted-foreground">
              Pending payments
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Billable Hours</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {summary?.totalBillableHours?.toFixed(1) || '0'}h
            </div>
            <p className="text-xs text-muted-foreground">
              {summary?.timeEntryCount || 0} entries
            </p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Main Content Tabs */}
      <motion.div variants={cardVariants}>
        <Tabs defaultValue="invoices" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="invoices" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Invoices
            </TabsTrigger>
            <TabsTrigger value="milestones" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Milestones
            </TabsTrigger>
            <TabsTrigger value="time-tracking" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Time Tracking
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="quickbooks" className="flex items-center gap-2">
              <RefreshCw className="h-4 w-4" />
              QuickBooks
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="invoices" className="space-y-6">
            <InvoiceList projectId={projectId} />
          </TabsContent>

          <TabsContent value="milestones" className="space-y-6">
            <MilestoneBillingTable projectId={projectId} />
          </TabsContent>

          <TabsContent value="time-tracking" className="space-y-6">
            <TimeTrackingIntegration projectId={projectId} />
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <ProfitAnalytics projectId={projectId} />
          </TabsContent>

          <TabsContent value="quickbooks" className="space-y-6">
            <QuickBooksSyncPanel />
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <PaymentMethods />
          </TabsContent>
        </Tabs>
      </motion.div>
    </motion.div>
  );
};