import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
  Play, 
  Square, 
  Edit, 
  Trash2, 
  Clock,
  DollarSign,
  CheckCircle,
  XCircle,
  Timer
} from 'lucide-react';

import { useTimeEntries, useCreateTimeEntry, useUpdateTimeEntry, useDeleteTimeEntry } from '@/hooks/useBilling';
import type { TimeEntry, TimeEntryInsert } from '@/types/database';

interface TimeTrackingIntegrationProps {
  projectId?: string;
}

const statusColors = {
  active: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
  billed: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
  paid: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
  cancelled: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400',
};

export const TimeTrackingIntegration: React.FC<TimeTrackingIntegrationProps> = ({ projectId }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [currentEntry, setCurrentEntry] = useState<Partial<TimeEntryInsert>>({
    description: '',
    hourly_rate: 0,
  });

  const { data: timeEntries, isLoading } = useTimeEntries({ 
    project_id: projectId,
    status: statusFilter !== 'all' ? statusFilter : undefined
  });
  const createTimeEntry = useCreateTimeEntry();
  const updateTimeEntry = useUpdateTimeEntry();
  const deleteTimeEntry = useDeleteTimeEntry();

  const filteredEntries = timeEntries?.filter(entry => {
    const matchesSearch = entry.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  }) || [];

  const handleStartTimer = () => {
    setIsTimerRunning(true);
    setCurrentEntry({
      ...currentEntry,
      start_time: new Date().toISOString(),
    });
  };

  const handleStopTimer = async () => {
    if (!currentEntry.start_time) return;

    const endTime = new Date();
    const startTime = new Date(currentEntry.start_time);
    const durationMinutes = Math.floor((endTime.getTime() - startTime.getTime()) / (1000 * 60));
    const billableHours = durationMinutes / 60;
    const totalAmount = billableHours * (currentEntry.hourly_rate || 0);

    try {
      await createTimeEntry.mutateAsync({
        user_id: 'current-user', // In real app, get from auth
        project_id: projectId || 'default-project',
        description: currentEntry.description || 'Timer Entry',
        start_time: currentEntry.start_time,
        end_time: endTime.toISOString(),
        duration_minutes: durationMinutes,
        billable_hours: billableHours,
        hourly_rate: currentEntry.hourly_rate,
        total_amount: totalAmount,
        status: 'active',
      });
      
      setIsTimerRunning(false);
      setCurrentEntry({ description: '', hourly_rate: 0 });
    } catch (error) {
      console.error('Failed to create time entry:', error);
    }
  };


  const handleUpdateStatus = async (id: string, status: TimeEntry['status']) => {
    try {
      await updateTimeEntry.mutateAsync({ id, updates: { status } });
    } catch (error) {
      console.error('Failed to update time entry:', error);
    }
  };

  const handleDeleteEntry = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this time entry?')) {
      try {
        await deleteTimeEntry.mutateAsync(id);
      } catch (error) {
        console.error('Failed to delete time entry:', error);
      }
    }
  };

  const formatDuration = (minutes: number | null) => {
    if (!minutes) return '0h 0m';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const getStatusIcon = (status: TimeEntry['status']) => {
    switch (status) {
      case 'active':
        return <Play className="h-4 w-4" />;
      case 'billed':
        return <CheckCircle className="h-4 w-4" />;
      case 'paid':
        return <CheckCircle className="h-4 w-4" />;
      case 'cancelled':
        return <XCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Time Tracking</CardTitle>
          <CardDescription>Track billable hours and time entries</CardDescription>
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
      {/* Timer Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Timer className="h-5 w-5" />
            Time Tracker
          </CardTitle>
          <CardDescription>
            Start and stop timer for billable work
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  placeholder="What are you working on?"
                  value={currentEntry.description || ''}
                  onChange={(e) => setCurrentEntry({ ...currentEntry, description: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="hourly-rate">Hourly Rate ($)</Label>
                <Input
                  id="hourly-rate"
                  type="number"
                  placeholder="0.00"
                  value={currentEntry.hourly_rate || ''}
                  onChange={(e) => setCurrentEntry({ ...currentEntry, hourly_rate: parseFloat(e.target.value) || 0 })}
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              {!isTimerRunning ? (
                <Button onClick={handleStartTimer} disabled={!currentEntry.description}>
                  <Play className="h-4 w-4 mr-2" />
                  Start Timer
                </Button>
              ) : (
                <Button onClick={handleStopTimer} variant="destructive">
                  <Square className="h-4 w-4 mr-2" />
                  Stop Timer
                </Button>
              )}
              <Button variant="outline" onClick={() => {/* TODO: Implement manual entry */}}>
                <Plus className="h-4 w-4 mr-2" />
                Manual Entry
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Time Entries Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Time Entries</CardTitle>
              <CardDescription>
                Manage and track billable time for {projectId ? 'this project' : 'all projects'}
              </CardDescription>
            </div>
            <Button onClick={() => {/* TODO: Implement add entry */}}>
              <Plus className="h-4 w-4 mr-2" />
              Add Entry
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex items-center gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search time entries..."
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
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="billed">Billed</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Description</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Rate</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEntries.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      No time entries found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredEntries.map((entry) => (
                    <motion.tr
                      key={entry.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.2 }}
                      className="hover:bg-muted/50 transition-colors"
                    >
                      <TableCell>
                        <div>
                          <div className="font-medium">{entry.description}</div>
                          {entry.notes && (
                            <div className="text-sm text-muted-foreground">
                              {entry.notes}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">
                            {formatDuration(entry.duration_minutes)}
                          </span>
                        </div>
                        {entry.billable_hours && (
                          <div className="text-sm text-muted-foreground">
                            {entry.billable_hours.toFixed(2)}h billable
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        {entry.hourly_rate && (
                          <div className="flex items-center gap-1">
                            <DollarSign className="h-4 w-4 text-muted-foreground" />
                            <span>{entry.hourly_rate.toFixed(2)}</span>
                            <span className="text-sm text-muted-foreground">/hr</span>
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        {entry.total_amount && (
                          <div className="flex items-center gap-1">
                            <DollarSign className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">
                              {entry.total_amount.toFixed(2)}
                            </span>
                            <span className="text-sm text-muted-foreground">
                              {entry.currency}
                            </span>
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge className={statusColors[entry.status]}>
                          <span className="flex items-center gap-1">
                            {getStatusIcon(entry.status)}
                            {entry.status.charAt(0).toUpperCase() + entry.status.slice(1)}
                          </span>
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div className="text-muted-foreground">
                            {new Date(entry.start_time).toLocaleDateString()}
                          </div>
                          <div className="text-muted-foreground">
                            {new Date(entry.start_time).toLocaleTimeString()} - 
                            {entry.end_time ? new Date(entry.end_time).toLocaleTimeString() : 'Running'}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Select
                            value={entry.status}
                            onValueChange={(value: TimeEntry['status']) =>
                              handleUpdateStatus(entry.id, value)
                            }
                          >
                            <SelectTrigger className="w-32 h-8">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="active">Active</SelectItem>
                              <SelectItem value="billed">Billed</SelectItem>
                              <SelectItem value="paid">Paid</SelectItem>
                              <SelectItem value="cancelled">Cancelled</SelectItem>
                            </SelectContent>
                          </Select>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {/* TODO: Implement edit */}}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteEntry(entry.id)}
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