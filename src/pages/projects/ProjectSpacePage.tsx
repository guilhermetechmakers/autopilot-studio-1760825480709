import { useParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  FolderOpen, 
  Calendar, 
  Users, 
  Clock, 
  DollarSign, 
  FileText, 
  Activity,
  Settings,
  ExternalLink,
  Plus
} from 'lucide-react';
import { useProject } from '@/hooks/useProjects';
import { useProjectMilestones } from '@/hooks/useProjectMilestones';
import { useProjectTasks } from '@/hooks/useProjectTasks';
import { Skeleton } from '@/components/ui/skeleton';
import { MilestonesTimeline } from '@/components/projects/MilestonesTimeline';
import { TaskBoard } from '@/components/projects/TaskBoard';
import { AICopilotSidebar } from '@/components/projects/AICopilotSidebar';
import { FilesAssets } from '@/components/projects/FilesAssets';
import { AuditLog } from '@/components/projects/AuditLog';
import { RepositoryIntegrations } from '@/components/projects/RepositoryIntegrations';
import { useState } from 'react';

export default function ProjectSpacePage() {
  const { id } = useParams<{ id: string }>();
  const [isAICopilotOpen, setIsAICopilotOpen] = useState(false);
  
  // Fetch project data
  const { data: project, isLoading: projectLoading, error: projectError } = useProject(id || '');
  const { data: milestones, isLoading: milestonesLoading } = useProjectMilestones(id || '');
  const { data: tasks, isLoading: tasksLoading } = useProjectTasks(id || '');

  if (projectLoading) {
    return (
      <div className="min-h-screen bg-background p-8">
        <div className="container mx-auto max-w-7xl">
          <div className="space-y-6">
            <Skeleton className="h-32 w-full" />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Skeleton className="h-96 w-full" />
              <Skeleton className="h-96 w-full" />
              <Skeleton className="h-96 w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (projectError || !project) {
    return (
      <div className="min-h-screen bg-background p-8">
        <div className="container mx-auto max-w-7xl">
          <Card>
            <CardContent className="p-8 text-center">
              <h2 className="text-2xl font-bold text-destructive mb-4">Project Not Found</h2>
              <p className="text-muted-foreground mb-4">
                The project you're looking for doesn't exist or you don't have permission to view it.
              </p>
              <Button onClick={() => window.history.back()}>
                Go Back
              </Button>
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

  // Calculate task statistics
  const completedTasks = tasks?.filter(t => t.status === 'completed').length || 0;
  const totalTasks = tasks?.length || 0;
  const inProgressTasks = tasks?.filter(t => t.status === 'in_progress').length || 0;

  return (
    <div className="min-h-screen bg-background">
      {/* Project Header */}
      <div className="border-b bg-card">
        <div className="container mx-auto max-w-7xl p-6">
          <div className="flex items-start justify-between">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <FolderOpen className="h-8 w-8 text-primary" />
                <div>
                  <h1 className="text-3xl font-bold gradient-text">{project.name}</h1>
                  <p className="text-muted-foreground">{project.description}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-6 text-sm text-muted-foreground">
                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4" />
                  <span>{project.client_name}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4" />
                  <span>
                    {project.start_date && new Date(project.start_date).toLocaleDateString()} - 
                    {project.end_date && new Date(project.end_date).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <DollarSign className="h-4 w-4" />
                  <span>{project.budget ? `$${project.budget.toLocaleString()}` : 'No budget set'}</span>
                </div>
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
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => window.open(`/client-portal/${id}`, '_blank')}
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Client Portal
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
              <span>{completedTasks} of {totalTasks} tasks completed</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto max-w-7xl p-6">
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="milestones">Milestones</TabsTrigger>
            <TabsTrigger value="tasks">Tasks</TabsTrigger>
            <TabsTrigger value="repos">Repositories</TabsTrigger>
            <TabsTrigger value="files">Files & Assets</TabsTrigger>
            <TabsTrigger value="audit">Audit Log</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Quick Stats */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Activity className="h-5 w-5" />
                    <span>Quick Stats</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Milestones</span>
                    <span className="font-semibold">{completedMilestones}/{totalMilestones}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Tasks</span>
                    <span className="font-semibold">{completedTasks}/{totalTasks}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">In Progress</span>
                    <span className="font-semibold text-primary">{inProgressTasks}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Estimated Hours</span>
                    <span className="font-semibold">{project.estimated_hours || 'N/A'}</span>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Clock className="h-5 w-5" />
                    <span>Recent Activity</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="text-sm text-muted-foreground">
                      No recent activity to show
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* AI Copilot */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <FileText className="h-5 w-5" />
                    <span>AI Copilot</span>
                  </CardTitle>
                  <CardDescription>
                    Generate specs, notes, and documentation
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button 
                    className="w-full" 
                    variant="outline"
                    onClick={() => setIsAICopilotOpen(true)}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Generate Specs
                  </Button>
                  <Button 
                    className="w-full" 
                    variant="outline"
                    onClick={() => setIsAICopilotOpen(true)}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Create Meeting Notes
                  </Button>
                  <Button 
                    className="w-full" 
                    variant="outline"
                    onClick={() => setIsAICopilotOpen(true)}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Draft Change Request
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Milestones Tab */}
          <TabsContent value="milestones" className="space-y-6">
            <MilestonesTimeline 
              milestones={milestones || []} 
              isLoading={milestonesLoading}
              onAddMilestone={() => console.log('Add milestone')}
              onEditMilestone={(milestone) => console.log('Edit milestone', milestone)}
            />
          </TabsContent>

          {/* Tasks Tab */}
          <TabsContent value="tasks" className="space-y-6">
            <TaskBoard 
              tasks={tasks || []} 
              isLoading={tasksLoading}
              onAddTask={() => console.log('Add task')}
              onEditTask={(task) => console.log('Edit task', task)}
              onUpdateTaskStatus={(taskId, status) => console.log('Update task status', taskId, status)}
            />
          </TabsContent>

          {/* Repositories Tab */}
          <TabsContent value="repos" className="space-y-6">
            <RepositoryIntegrations 
              repos={[]} 
              isLoading={false}
              onConnectRepo={(provider) => console.log('Connect repo', provider)}
              onDisconnectRepo={(repoId) => console.log('Disconnect repo', repoId)}
              onRefreshRepo={(repoId) => console.log('Refresh repo', repoId)}
              onConfigureRepo={(repo) => console.log('Configure repo', repo)}
            />
          </TabsContent>

          {/* Files & Assets Tab */}
          <TabsContent value="files" className="space-y-6">
            <FilesAssets 
              files={[]} 
              isLoading={false}
              onUploadFile={() => console.log('Upload file')}
              onDeleteFile={(fileId) => console.log('Delete file', fileId)}
              onViewFile={(file) => console.log('View file', file)}
              onDownloadFile={(file) => console.log('Download file', file)}
            />
          </TabsContent>

          {/* Audit Log Tab */}
          <TabsContent value="audit" className="space-y-6">
            <AuditLog 
              logs={[]} 
              isLoading={false}
              onFilterChange={(filters) => console.log('Filter change', filters)}
              onExportLogs={() => console.log('Export logs')}
            />
          </TabsContent>
        </Tabs>
      </div>

      {/* AI Copilot Sidebar */}
      <AICopilotSidebar 
        isOpen={isAICopilotOpen}
        onClose={() => setIsAICopilotOpen(false)}
        projectId={id || ''}
      />
    </div>
  );
}
