import { useParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  FolderOpen, 
  Calendar, 
  CheckCircle, 
  Clock, 
  FileText, 
  MessageSquare
} from 'lucide-react';
import { useProject } from '@/hooks/useProjects';
import { useProjectMilestones } from '@/hooks/useProjectMilestones';
import { Skeleton } from '@/components/ui/skeleton';

export default function ClientPortalPage() {
  const { id } = useParams<{ id: string }>();
  
  // Fetch project data
  const { data: project, isLoading: projectLoading, error: projectError } = useProject(id || '');
  const { data: milestones, isLoading: milestonesLoading } = useProjectMilestones(id || '');

  if (projectLoading) {
    return (
      <div className="min-h-screen bg-background p-8">
        <div className="container mx-auto max-w-4xl">
          <div className="space-y-6">
            <Skeleton className="h-32 w-full" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Skeleton className="h-64 w-full" />
              <Skeleton className="h-64 w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (projectError || !project) {
    return (
      <div className="min-h-screen bg-background p-8">
        <div className="container mx-auto max-w-4xl">
          <Card>
            <CardContent className="p-8 text-center">
              <h2 className="text-2xl font-bold text-destructive mb-4">Project Not Found</h2>
              <p className="text-muted-foreground mb-4">
                The project you're looking for doesn't exist or you don't have permission to view it.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Calculate project progress
  const completedMilestones = milestones?.filter(m => m.status === 'completed').length || 0;
  const totalMilestones = milestones?.length || 0;
  const progressPercentage = totalMilestones > 0 ? (completedMilestones / totalMilestones) * 100 : 0;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="container mx-auto max-w-4xl p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <FolderOpen className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-3xl font-bold gradient-text">{project.name}</h1>
                <p className="text-muted-foreground">Client Portal</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Badge 
                variant={project.status === 'active' ? 'default' : 'secondary'}
                className="text-sm"
              >
                {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
              </Badge>
              <Button variant="outline" size="sm">
                <MessageSquare className="h-4 w-4 mr-2" />
                Contact Team
              </Button>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-6 space-y-2">
            <div className="flex justify-between text-sm">
              <span>Project Progress</span>
              <span>{Math.round(progressPercentage)}%</span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{completedMilestones} of {totalMilestones} milestones completed</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto max-w-4xl p-6 space-y-6">
        {/* Project Overview */}
        <Card>
          <CardHeader>
            <CardTitle>Project Overview</CardTitle>
            <CardDescription>Current status and key information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium mb-2">Project Description</h4>
                <p className="text-sm text-muted-foreground">
                  {project.description || 'No description provided'}
                </p>
              </div>
              <div>
                <h4 className="font-medium mb-2">Timeline</h4>
                <div className="text-sm text-muted-foreground space-y-1">
                  <div>Start: {project.start_date ? new Date(project.start_date).toLocaleDateString() : 'TBD'}</div>
                  <div>End: {project.end_date ? new Date(project.end_date).toLocaleDateString() : 'TBD'}</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Milestones */}
        <Card>
          <CardHeader>
            <CardTitle>Project Milestones</CardTitle>
            <CardDescription>Track progress through key milestones</CardDescription>
          </CardHeader>
          <CardContent>
            {milestonesLoading ? (
              <div className="space-y-4">
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-20 w-full" />
              </div>
            ) : milestones && milestones.length > 0 ? (
              <div className="space-y-4">
                {milestones.map((milestone) => (
                  <div key={milestone.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        {milestone.status === 'completed' ? (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        ) : milestone.status === 'in_progress' ? (
                          <Clock className="h-5 w-5 text-blue-500" />
                        ) : (
                          <Clock className="h-5 w-5 text-muted-foreground" />
                        )}
                        <div>
                          <h3 className="font-semibold">{milestone.name}</h3>
                          <p className="text-sm text-muted-foreground">{milestone.description}</p>
                        </div>
                      </div>
                      <Badge 
                        variant={milestone.status === 'completed' ? 'default' : 'secondary'}
                        className="text-xs"
                      >
                        {milestone.status.replace('_', ' ')}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No milestones available</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Deliverables */}
        <Card>
          <CardHeader>
            <CardTitle>Deliverables</CardTitle>
            <CardDescription>Files and assets shared with you</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-muted-foreground">
              <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No deliverables available yet</p>
              <p className="text-sm">Files and documents will appear here as they're shared</p>
            </div>
          </CardContent>
        </Card>

        {/* Feedback */}
        <Card>
          <CardHeader>
            <CardTitle>Feedback & Communication</CardTitle>
            <CardDescription>Share feedback and communicate with the team</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center py-8 text-muted-foreground">
              <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No feedback requests at this time</p>
              <p className="text-sm">You'll be notified when feedback is needed</p>
            </div>
            
            <div className="flex justify-center">
              <Button variant="outline">
                <MessageSquare className="h-4 w-4 mr-2" />
                Send Feedback
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
