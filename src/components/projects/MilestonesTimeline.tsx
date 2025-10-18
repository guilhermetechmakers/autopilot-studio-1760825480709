import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, Circle, Clock, DollarSign, Calendar, Plus } from 'lucide-react';
import type { ProjectMilestone } from '@/types/database';

interface MilestonesTimelineProps {
  milestones: ProjectMilestone[];
  isLoading?: boolean;
  onEditMilestone?: (milestone: ProjectMilestone) => void;
  onAddMilestone?: () => void;
}

export function MilestonesTimeline({ 
  milestones, 
  isLoading = false, 
  onEditMilestone,
  onAddMilestone 
}: MilestonesTimelineProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Project Milestones</CardTitle>
          <CardDescription>Track project progress through key milestones</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-20 bg-muted rounded-lg"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const completedCount = milestones.filter(m => m.status === 'completed').length;
  const totalCount = milestones.length;
  const progressPercentage = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  const getStatusIcon = (status: ProjectMilestone['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'in_progress':
        return <Clock className="h-5 w-5 text-blue-500" />;
      case 'cancelled':
        return <Circle className="h-5 w-5 text-gray-400" />;
      default:
        return <Circle className="h-5 w-5 text-muted-foreground" />;
    }
  };

  const getStatusColor = (status: ProjectMilestone['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500/10 text-green-700 border-green-200';
      case 'in_progress':
        return 'bg-blue-500/10 text-blue-700 border-blue-200';
      case 'cancelled':
        return 'bg-gray-500/10 text-gray-700 border-gray-200';
      default:
        return 'bg-gray-500/10 text-gray-700 border-gray-200';
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Project Milestones</CardTitle>
            <CardDescription>Track project progress through key milestones</CardDescription>
          </div>
          {onAddMilestone && (
            <Button onClick={onAddMilestone} size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Milestone
            </Button>
          )}
        </div>
        
        {/* Progress Overview */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Overall Progress</span>
            <span>{Math.round(progressPercentage)}%</span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{completedCount} of {totalCount} milestones completed</span>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        {milestones.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No milestones created yet</p>
            {onAddMilestone && (
              <Button onClick={onAddMilestone} className="mt-4" variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Create First Milestone
              </Button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {milestones.map((milestone, _index) => (
              <div 
                key={milestone.id} 
                className="border rounded-lg p-4 hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3 flex-1">
                    <div className="flex-shrink-0 mt-1">
                      {getStatusIcon(milestone.status)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="font-semibold text-lg">{milestone.name}</h3>
                        <Badge 
                          variant="outline" 
                          className={`text-xs ${getStatusColor(milestone.status)}`}
                        >
                          {milestone.status.replace('_', ' ')}
                        </Badge>
                      </div>
                      
                      {milestone.description && (
                        <p className="text-sm text-muted-foreground mb-3">
                          {milestone.description}
                        </p>
                      )}
                      
                      {/* Milestone Details */}
                      <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                        {milestone.due_date && (
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-3 w-3" />
                            <span>Due: {new Date(milestone.due_date).toLocaleDateString()}</span>
                          </div>
                        )}
                        
                        {milestone.billing_amount && (
                          <div className="flex items-center space-x-1">
                            <DollarSign className="h-3 w-3" />
                            <span>${milestone.billing_amount.toLocaleString()}</span>
                          </div>
                        )}
                        
                        {milestone.billing_trigger && (
                          <div className="flex items-center space-x-1">
                            <span>Billing: {milestone.billing_trigger.replace('_', ' ')}</span>
                          </div>
                        )}
                      </div>
                      
                      {/* Acceptance Criteria */}
                      {milestone.acceptance_criteria && milestone.acceptance_criteria.length > 0 && (
                        <div className="mt-3">
                          <h4 className="text-sm font-medium mb-2">Acceptance Criteria:</h4>
                          <ul className="space-y-1">
                            {milestone.acceptance_criteria.map((criteria, criteriaIndex) => (
                              <li key={criteriaIndex} className="text-xs text-muted-foreground flex items-start space-x-2">
                                <span className="text-primary mt-1">•</span>
                                <span>{criteria}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 ml-4">
                    {onEditMilestone && (
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => onEditMilestone(milestone)}
                      >
                        Edit
                      </Button>
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
