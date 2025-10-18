import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  CheckCircle, 
  Circle, 
  Clock, 
  AlertCircle, 
  Plus, 
  MoreHorizontal,
  User,
  Calendar,
  Tag,
  Clock as ClockIcon
} from 'lucide-react';
import type { ProjectTask } from '@/types/database';

interface TaskBoardProps {
  tasks: ProjectTask[];
  isLoading?: boolean;
  onEditTask?: (task: ProjectTask) => void;
  onAddTask?: () => void;
  onUpdateTaskStatus?: (taskId: string, status: ProjectTask['status']) => void;
}

export function TaskBoard({ 
  tasks, 
  isLoading = false, 
  onEditTask,
  onAddTask,
  onUpdateTaskStatus: _onUpdateTaskStatus
}: TaskBoardProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Project Tasks</CardTitle>
          <CardDescription>Manage and track individual tasks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="space-y-3">
                <div className="h-6 bg-muted rounded animate-pulse"></div>
                <div className="space-y-2">
                  <div className="h-16 bg-muted rounded animate-pulse"></div>
                  <div className="h-16 bg-muted rounded animate-pulse"></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const getStatusIcon = (status: ProjectTask['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'in_progress':
        return <Clock className="h-4 w-4 text-blue-500" />;
      case 'review':
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      case 'cancelled':
        return <Circle className="h-4 w-4 text-gray-400" />;
      default:
        return <Circle className="h-4 w-4 text-muted-foreground" />;
    }
  };


  const getPriorityColor = (priority: ProjectTask['priority']) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-500/10 text-red-700 border-red-200';
      case 'high':
        return 'bg-orange-500/10 text-orange-700 border-orange-200';
      case 'medium':
        return 'bg-blue-500/10 text-blue-700 border-blue-200';
      case 'low':
        return 'bg-gray-500/10 text-gray-700 border-gray-200';
      default:
        return 'bg-gray-500/10 text-gray-700 border-gray-200';
    }
  };

  // Group tasks by status
  const tasksByStatus = {
    todo: tasks.filter(t => t.status === 'todo'),
    in_progress: tasks.filter(t => t.status === 'in_progress'),
    review: tasks.filter(t => t.status === 'review'),
    completed: tasks.filter(t => t.status === 'completed'),
  };

  const statusConfig = [
    { key: 'todo', label: 'To Do', color: 'text-gray-600' },
    { key: 'in_progress', label: 'In Progress', color: 'text-blue-600' },
    { key: 'review', label: 'Review', color: 'text-yellow-600' },
    { key: 'completed', label: 'Completed', color: 'text-green-600' },
  ] as const;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Project Tasks</CardTitle>
            <CardDescription>Manage and track individual tasks</CardDescription>
          </div>
          {onAddTask && (
            <Button onClick={onAddTask} size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Task
            </Button>
          )}
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {statusConfig.map((status) => {
            const statusTasks = tasksByStatus[status.key];
            
            return (
              <div key={status.key} className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className={`font-semibold ${status.color}`}>
                    {status.label}
                  </h3>
                  <Badge variant="secondary" className="text-xs">
                    {statusTasks.length}
                  </Badge>
                </div>
                
                <div className="space-y-2 min-h-[200px]">
                  {statusTasks.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground text-sm">
                      No tasks
                    </div>
                  ) : (
                    statusTasks.map((task) => (
                      <div 
                        key={task.id} 
                        className="border rounded-lg p-3 bg-card hover:bg-muted/50 transition-colors cursor-pointer"
                        onClick={() => onEditTask?.(task)}
                      >
                        <div className="space-y-2">
                          <div className="flex items-start justify-between">
                            <h4 className="font-medium text-sm line-clamp-2">
                              {task.title}
                            </h4>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-6 w-6 p-0"
                              onClick={(e) => {
                                e.stopPropagation();
                                onEditTask?.(task);
                              }}
                            >
                              <MoreHorizontal className="h-3 w-3" />
                            </Button>
                          </div>
                          
                          {task.description && (
                            <p className="text-xs text-muted-foreground line-clamp-2">
                              {task.description}
                            </p>
                          )}
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-1">
                              <Badge 
                                variant="outline" 
                                className={`text-xs ${getPriorityColor(task.priority)}`}
                              >
                                {task.priority}
                              </Badge>
                              {task.task_type && (
                                <Badge variant="outline" className="text-xs">
                                  {task.task_type}
                                </Badge>
                              )}
                            </div>
                            
                            <div className="flex items-center space-x-1">
                              {getStatusIcon(task.status)}
                            </div>
                          </div>
                          
                          {/* Task Details */}
                          <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <div className="flex items-center space-x-2">
                              {task.assigned_to && (
                                <div className="flex items-center space-x-1">
                                  <User className="h-3 w-3" />
                                  <span>Assigned</span>
                                </div>
                              )}
                              {task.due_date && (
                                <div className="flex items-center space-x-1">
                                  <Calendar className="h-3 w-3" />
                                  <span>{new Date(task.due_date).toLocaleDateString()}</span>
                                </div>
                              )}
                            </div>
                            
                            {task.estimated_hours && (
                              <div className="flex items-center space-x-1">
                                <ClockIcon className="h-3 w-3" />
                                <span>{task.estimated_hours}h</span>
                              </div>
                            )}
                          </div>
                          
                          {/* Labels */}
                          {task.labels && task.labels.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                              {task.labels.slice(0, 3).map((label, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  <Tag className="h-2 w-2 mr-1" />
                                  {label}
                                </Badge>
                              ))}
                              {task.labels.length > 3 && (
                                <Badge variant="outline" className="text-xs">
                                  +{task.labels.length - 3}
                                </Badge>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
