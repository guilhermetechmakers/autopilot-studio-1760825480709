import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Plus, 
  Search, 
  Filter, 
  Eye, 
  Edit, 
  Trash2, 
  Send,
  Download,
  DollarSign,
  Calendar,
  User,
  Mail,
  CheckCircle,
  Clock,
  XCircle,
  AlertCircle
} from 'lucide-react';

import { useInvoices, useUpdateInvoice, useDeleteInvoice } from '@/hooks/useBilling';
import type { Invoice } from '@/types/database';

interface InvoiceListProps {
  projectId?: string;
}

const statusColors = {
  draft: 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400',
  sent: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
  paid: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
  overdue: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400',
  cancelled: 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400',
};

const statusIcons = {
  draft: <Edit className="h-4 w-4" />,
  sent: <Send className="h-4 w-4" />,
  paid: <CheckCircle className="h-4 w-4" />,
  overdue: <AlertCircle className="h-4 w-4" />,
  cancelled: <XCircle className="h-4 w-4" />,
};

export const InvoiceList: React.FC<InvoiceListProps> = ({ projectId }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<string>('all');

  const { data: invoices, isLoading } = useInvoices({ 
    project_id: projectId,
    status: statusFilter !== 'all' ? statusFilter : undefined
  });
  const updateInvoice = useUpdateInvoice();
  const deleteInvoice = useDeleteInvoice();

  const filteredInvoices = invoices?.filter(invoice => {
    const matchesSearch = 
      invoice.invoice_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.client_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.client_email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDate = (() => {
      if (dateFilter === 'all') return true;
      const now = new Date();
      const invoiceDate = new Date(invoice.issue_date);
      
      switch (dateFilter) {
        case 'today':
          return invoiceDate.toDateString() === now.toDateString();
        case 'this_week':
          const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          return invoiceDate >= weekAgo;
        case 'this_month':
          return invoiceDate.getMonth() === now.getMonth() && 
                 invoiceDate.getFullYear() === now.getFullYear();
        case 'overdue':
          return invoice.status === 'overdue' || 
                 (invoice.status === 'sent' && new Date(invoice.due_date) < now);
        default:
          return true;
      }
    })();

    return matchesSearch && matchesDate;
  }) || [];

  const handleStatusChange = async (id: string, status: Invoice['status']) => {
    try {
      await updateInvoice.mutateAsync({ id, updates: { status } });
    } catch (error) {
      console.error('Failed to update invoice status:', error);
    }
  };

  const handleDeleteInvoice = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this invoice?')) {
      try {
        await deleteInvoice.mutateAsync(id);
      } catch (error) {
        console.error('Failed to delete invoice:', error);
      }
    }
  };

  const handleSendInvoice = async (id: string) => {
    try {
      await updateInvoice.mutateAsync({ 
        id, 
        updates: { 
          status: 'sent',
          // In a real app, this would trigger email sending
        } 
      });
    } catch (error) {
      console.error('Failed to send invoice:', error);
    }
  };

  const getDaysOverdue = (dueDate: string) => {
    const now = new Date();
    const due = new Date(dueDate);
    const diffTime = now.getTime() - due.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Invoices</CardTitle>
          <CardDescription>Manage and track invoice status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-muted rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Invoices</CardTitle>
              <CardDescription>
                Manage and track invoice status for {projectId ? 'this project' : 'all projects'}
              </CardDescription>
            </div>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Invoice
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex items-center gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search invoices, clients..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="sent">Sent</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="overdue">Overdue</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
            <Select value={dateFilter} onValueChange={setDateFilter}>
              <SelectTrigger className="w-48">
                <Calendar className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter by date" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Time</SelectItem>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="this_week">This Week</SelectItem>
                <SelectItem value="this_month">This Month</SelectItem>
                <SelectItem value="overdue">Overdue</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Invoice</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Dates</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInvoices.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      No invoices found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredInvoices.map((invoice) => (
                    <motion.tr
                      key={invoice.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.2 }}
                      className="hover:bg-muted/50 transition-colors"
                    >
                      <TableCell>
                        <div>
                          <div className="font-medium">{invoice.invoice_number}</div>
                          <div className="text-sm text-muted-foreground">
                            #{invoice.id.slice(0, 8)}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">{invoice.client_name}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Mail className="h-3 w-3" />
                            {invoice.client_email}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <DollarSign className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">
                            {invoice.total_amount.toLocaleString()}
                          </span>
                          <span className="text-sm text-muted-foreground">
                            {invoice.currency}
                          </span>
                        </div>
                        {invoice.tax_amount > 0 && (
                          <div className="text-xs text-muted-foreground">
                            +{invoice.tax_amount.toLocaleString()} tax
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge className={statusColors[invoice.status]}>
                          <span className="flex items-center gap-1">
                            {statusIcons[invoice.status]}
                            {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                          </span>
                        </Badge>
                        {invoice.status === 'overdue' && (
                          <div className="text-xs text-red-600 mt-1">
                            {getDaysOverdue(invoice.due_date)} days overdue
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <Calendar className="h-3 w-3" />
                            Issued: {new Date(invoice.issue_date).toLocaleDateString()}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3 text-muted-foreground" />
                            Due: {new Date(invoice.due_date).toLocaleDateString()}
                          </div>
                          {invoice.paid_date && (
                            <div className="flex items-center gap-1 text-green-600">
                              <CheckCircle className="h-3 w-3" />
                              Paid: {new Date(invoice.paid_date).toLocaleDateString()}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Download className="h-4 w-4" />
                          </Button>
                          {invoice.status === 'draft' && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleSendInvoice(invoice.id)}
                            >
                              <Send className="h-4 w-4" />
                            </Button>
                          )}
                          <Select
                            value={invoice.status}
                            onValueChange={(value: Invoice['status']) =>
                              handleStatusChange(invoice.id, value)
                            }
                          >
                            <SelectTrigger className="w-32 h-8">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="draft">Draft</SelectItem>
                              <SelectItem value="sent">Sent</SelectItem>
                              <SelectItem value="paid">Paid</SelectItem>
                              <SelectItem value="overdue">Overdue</SelectItem>
                              <SelectItem value="cancelled">Cancelled</SelectItem>
                            </SelectContent>
                          </Select>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteInvoice(invoice.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </motion.tr>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};