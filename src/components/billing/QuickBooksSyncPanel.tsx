import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
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
  RefreshCw, 
  CheckCircle, 
  XCircle, 
  Clock, 
  AlertTriangle,
  Settings,
  Download,
  Upload,
  ExternalLink
} from 'lucide-react';

import { useQuickBooksSync, useCreateQuickBooksSync, useUpdateQuickBooksSync } from '@/hooks/useBilling';

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400',
  synced: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
  failed: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400',
  skipped: 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400',
};

const statusIcons = {
  pending: <Clock className="h-4 w-4" />,
  synced: <CheckCircle className="h-4 w-4" />,
  failed: <XCircle className="h-4 w-4" />,
  skipped: <AlertTriangle className="h-4 w-4" />,
};

const entityTypeLabels = {
  invoice: 'Invoice',
  payment: 'Payment',
  customer: 'Customer',
  item: 'Item',
};

export const QuickBooksSyncPanel: React.FC = () => {
  const [entityTypeFilter, setEntityTypeFilter] = useState<string>('all');
  const [isSyncing, setIsSyncing] = useState(false);

  const { data: syncRecords, isLoading } = useQuickBooksSync(
    entityTypeFilter !== 'all' ? entityTypeFilter : undefined
  );
  const createSync = useCreateQuickBooksSync();
  const updateSync = useUpdateQuickBooksSync();

  const filteredRecords = syncRecords || [];

  const handleSyncAll = async () => {
    setIsSyncing(true);
    try {
      // In a real app, this would trigger a bulk sync
      await new Promise(resolve => setTimeout(resolve, 2000));
      // Simulate creating sync records for different entity types
      const entityTypes = ['invoice', 'payment', 'customer', 'item'];
      for (const type of entityTypes) {
        await createSync.mutateAsync({
          user_id: 'current-user', // In real app, get from auth
          entity_type: type as any,
          entity_id: `sample-${type}-${Date.now()}`,
          status: 'pending',
        });
      }
    } catch (error) {
      console.error('Failed to sync:', error);
    } finally {
      setIsSyncing(false);
    }
  };

  const handleRetrySync = async (id: string) => {
    try {
      await updateSync.mutateAsync({
        id,
        updates: {
          status: 'pending',
          sync_attempts: 0,
          error_message: null,
        },
      });
    } catch (error) {
      console.error('Failed to retry sync:', error);
    }
  };

  const getSyncStats = () => {
    const total = filteredRecords.length;
    const synced = filteredRecords.filter(r => r.status === 'synced').length;
    const failed = filteredRecords.filter(r => r.status === 'failed').length;
    const pending = filteredRecords.filter(r => r.status === 'pending').length;
    
    return { total, synced, failed, pending };
  };

  const stats = getSyncStats();

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>QuickBooks Sync</CardTitle>
          <CardDescription>Synchronize data with QuickBooks Online</CardDescription>
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
      {/* Sync Status Overview */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <RefreshCw className="h-5 w-5" />
                QuickBooks Sync Status
              </CardTitle>
              <CardDescription>
                Synchronize invoices, payments, and customer data with QuickBooks Online
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
              <Button 
                onClick={handleSyncAll} 
                disabled={isSyncing}
                className="min-w-[120px]"
              >
                {isSyncing ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Syncing...
                  </>
                ) : (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Sync All
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="text-center">
              <div className="text-2xl font-bold">{stats.total}</div>
              <div className="text-sm text-muted-foreground">Total Records</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{stats.synced}</div>
              <div className="text-sm text-muted-foreground">Synced</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
              <div className="text-sm text-muted-foreground">Pending</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{stats.failed}</div>
              <div className="text-sm text-muted-foreground">Failed</div>
            </div>
          </div>
          
          {stats.total > 0 && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Sync Progress</span>
                <span>{Math.round((stats.synced / stats.total) * 100)}%</span>
              </div>
              <Progress value={(stats.synced / stats.total) * 100} className="h-2" />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Sync Records Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Sync Records</CardTitle>
              <CardDescription>
                Track synchronization status for each record
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Select value={entityTypeFilter} onValueChange={setEntityTypeFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="invoice">Invoices</SelectItem>
                  <SelectItem value="payment">Payments</SelectItem>
                  <SelectItem value="customer">Customers</SelectItem>
                  <SelectItem value="item">Items</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Entity</TableHead>
                  <TableHead>QuickBooks ID</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Sync</TableHead>
                  <TableHead>Attempts</TableHead>
                  <TableHead>Error</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRecords.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      No sync records found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredRecords.map((record) => (
                    <motion.tr
                      key={record.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.2 }}
                      className="hover:bg-muted/50 transition-colors"
                    >
                      <TableCell>
                        <div>
                          <div className="font-medium">
                            {entityTypeLabels[record.entity_type]}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {record.entity_id}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {record.quickbooks_id ? (
                          <div className="flex items-center gap-1">
                            <ExternalLink className="h-3 w-3 text-muted-foreground" />
                            <span className="font-mono text-sm">
                              {record.quickbooks_id}
                            </span>
                          </div>
                        ) : (
                          <span className="text-muted-foreground">Not synced</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge className={statusColors[record.status]}>
                          <span className="flex items-center gap-1">
                            {statusIcons[record.status]}
                            {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                          </span>
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {record.last_sync_at ? (
                          <div className="text-sm">
                            <div>{new Date(record.last_sync_at).toLocaleDateString()}</div>
                            <div className="text-muted-foreground">
                              {new Date(record.last_sync_at).toLocaleTimeString()}
                            </div>
                          </div>
                        ) : (
                          <span className="text-muted-foreground">Never</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <RefreshCw className="h-3 w-3 text-muted-foreground" />
                          <span>{record.sync_attempts}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {record.error_message ? (
                          <div className="max-w-xs">
                            <div className="text-sm text-red-600 truncate">
                              {record.error_message}
                            </div>
                          </div>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          {record.status === 'failed' && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRetrySync(record.id)}
                            >
                              <RefreshCw className="h-4 w-4" />
                            </Button>
                          )}
                          {record.quickbooks_id && (
                            <Button variant="ghost" size="sm">
                              <ExternalLink className="h-4 w-4" />
                            </Button>
                          )}
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

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>
            Common synchronization tasks
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" className="h-20 flex flex-col gap-2">
              <Upload className="h-6 w-6" />
              <span>Export to QuickBooks</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col gap-2">
              <Download className="h-6 w-6" />
              <span>Import from QuickBooks</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col gap-2">
              <Settings className="h-6 w-6" />
              <span>Sync Settings</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};