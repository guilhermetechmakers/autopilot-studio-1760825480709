import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Activity, 
  User, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Edit, 
  Plus, 
  Trash2,
  Eye,
  Download,
  Filter,
  Search
} from 'lucide-react';
import type { ProjectAuditLog } from '@/types/database';

interface AuditLogProps {
  logs: ProjectAuditLog[];
  isLoading?: boolean;
  onFilterChange?: (filters: AuditLogFilters) => void;
  onExportLogs?: () => void;
}

interface AuditLogFilters {
  action?: string;
  entityType?: string;
  dateRange?: {
    start: string;
    end: string;
  };
}

export function AuditLog({ 
  logs, 
  isLoading = false, 
  onFilterChange: _onFilterChange,
  onExportLogs
}: AuditLogProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Audit Log</CardTitle>
          <CardDescription>Track all project actions and changes</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-16 bg-muted rounded-lg"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const getActionIcon = (action: string) => {
    const actionLower = action.toLowerCase();
    if (actionLower.includes('create') || actionLower.includes('add')) {
      return <Plus className="h-4 w-4 text-green-500" />;
    } else if (actionLower.includes('update') || actionLower.includes('edit')) {
      return <Edit className="h-4 w-4 text-blue-500" />;
    } else if (actionLower.includes('delete') || actionLower.includes('remove')) {
      return <Trash2 className="h-4 w-4 text-red-500" />;
    } else if (actionLower.includes('approve') || actionLower.includes('complete')) {
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    } else if (actionLower.includes('reject') || actionLower.includes('cancel')) {
      return <XCircle className="h-4 w-4 text-red-500" />;
    } else {
      return <Activity className="h-4 w-4 text-gray-500" />;
    }
  };

  const getActionColor = (action: string) => {
    const actionLower = action.toLowerCase();
    if (actionLower.includes('create') || actionLower.includes('add')) {
      return 'bg-green-500/10 text-green-700 border-green-200';
    } else if (actionLower.includes('update') || actionLower.includes('edit')) {
      return 'bg-blue-500/10 text-blue-700 border-blue-200';
    } else if (actionLower.includes('delete') || actionLower.includes('remove')) {
      return 'bg-red-500/10 text-red-700 border-red-200';
    } else if (actionLower.includes('approve') || actionLower.includes('complete')) {
      return 'bg-green-500/10 text-green-700 border-green-200';
    } else if (actionLower.includes('reject') || actionLower.includes('cancel')) {
      return 'bg-red-500/10 text-red-700 border-red-200';
    } else {
      return 'bg-gray-500/10 text-gray-700 border-gray-200';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatRelativeTime = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    
    return formatDate(dateString);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Audit Log</CardTitle>
            <CardDescription>Track all project actions and changes</CardDescription>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              <Search className="h-4 w-4 mr-2" />
              Search
            </Button>
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
            {onExportLogs && (
              <Button onClick={onExportLogs} size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        {logs.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <Activity className="h-16 w-16 mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-semibold mb-2">No audit logs available</h3>
            <p className="text-sm">
              Project actions and changes will appear here
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {logs.map((log) => (
              <div 
                key={log.id} 
                className="border rounded-lg p-4 hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 mt-1">
                    {getActionIcon(log.action)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <h4 className="font-medium text-sm">
                          {log.action.charAt(0).toUpperCase() + log.action.slice(1).replace('_', ' ')}
                        </h4>
                        <Badge 
                          variant="outline" 
                          className={`text-xs ${getActionColor(log.action)}`}
                        >
                          {log.entity_type}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        <span>{formatRelativeTime(log.created_at)}</span>
                      </div>
                    </div>
                    
                    {log.description && (
                      <p className="text-sm text-muted-foreground mb-2">
                        {log.description}
                      </p>
                    )}
                    
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <div className="flex items-center space-x-4">
                        {log.user_id && (
                          <div className="flex items-center space-x-1">
                            <User className="h-3 w-3" />
                            <span>User {log.user_id.slice(0, 8)}...</span>
                          </div>
                        )}
                        
                        {log.entity_id && (
                          <div className="flex items-center space-x-1">
                            <Eye className="h-3 w-3" />
                            <span>Entity {log.entity_id.slice(0, 8)}...</span>
                          </div>
                        )}
                        
                        <span>{formatDate(log.created_at)}</span>
                      </div>
                      
                      {log.ip_address && (
                        <span className="font-mono text-xs">
                          {log.ip_address}
                        </span>
                      )}
                    </div>
                    
                    {/* Change Details */}
                    {(log.old_values || log.new_values) && (
                      <div className="mt-3 p-3 bg-muted/50 rounded-lg">
                        <h5 className="text-xs font-medium mb-2">Changes:</h5>
                        <div className="space-y-1 text-xs">
                          {log.old_values && Object.keys(log.old_values).length > 0 && (
                            <div>
                              <span className="text-red-600">- </span>
                              <span className="font-mono">
                                {JSON.stringify(log.old_values, null, 2)}
                              </span>
                            </div>
                          )}
                          {log.new_values && Object.keys(log.new_values).length > 0 && (
                            <div>
                              <span className="text-green-600">+ </span>
                              <span className="font-mono">
                                {JSON.stringify(log.new_values, null, 2)}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
