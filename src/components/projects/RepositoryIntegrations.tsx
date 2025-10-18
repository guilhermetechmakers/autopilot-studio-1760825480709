import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  GitBranch, 
  Github, 
  Gitlab, 
  ExternalLink, 
  CheckCircle, 
  XCircle, 
  Clock,
  Settings,
  RefreshCw,
  Trash2
} from 'lucide-react';
import type { ProjectRepo } from '@/types/database';

interface RepositoryIntegrationsProps {
  repos: ProjectRepo[];
  isLoading?: boolean;
  onConnectRepo?: (provider: ProjectRepo['provider']) => void;
  onDisconnectRepo?: (repoId: string) => void;
  onRefreshRepo?: (repoId: string) => void;
  onConfigureRepo?: (repo: ProjectRepo) => void;
}

export function RepositoryIntegrations({ 
  repos, 
  isLoading = false, 
  onConnectRepo,
  onDisconnectRepo,
  onRefreshRepo,
  onConfigureRepo
}: RepositoryIntegrationsProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <GitBranch className="h-5 w-5" />
            <span>Repository Integrations</span>
          </CardTitle>
          <CardDescription>Connect and manage code repositories</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-24 bg-muted rounded-lg"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const getProviderIcon = (provider: ProjectRepo['provider']) => {
    switch (provider) {
      case 'github':
        return <Github className="h-5 w-5" />;
      case 'gitlab':
        return <Gitlab className="h-5 w-5" />;
      case 'bitbucket':
        return <GitBranch className="h-5 w-5" />;
      default:
        return <GitBranch className="h-5 w-5" />;
    }
  };

  const getProviderColor = (provider: ProjectRepo['provider']) => {
    switch (provider) {
      case 'github':
        return 'text-gray-900 dark:text-gray-100';
      case 'gitlab':
        return 'text-orange-500';
      case 'bitbucket':
        return 'text-blue-500';
      default:
        return 'text-gray-500';
    }
  };

  const getStatusIcon = (isConnected: boolean, lastSyncAt: string | null) => {
    if (!isConnected) {
      return <XCircle className="h-4 w-4 text-red-500" />;
    }
    
    if (!lastSyncAt) {
      return <Clock className="h-4 w-4 text-yellow-500" />;
    }
    
    const lastSync = new Date(lastSyncAt);
    const now = new Date();
    const diffInHours = (now.getTime() - lastSync.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours > 24) {
      return <Clock className="h-4 w-4 text-yellow-500" />;
    }
    
    return <CheckCircle className="h-4 w-4 text-green-500" />;
  };

  const getStatusText = (isConnected: boolean, lastSyncAt: string | null) => {
    if (!isConnected) {
      return 'Disconnected';
    }
    
    if (!lastSyncAt) {
      return 'Never synced';
    }
    
    const lastSync = new Date(lastSyncAt);
    const now = new Date();
    const diffInHours = (now.getTime() - lastSync.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 1) {
      return 'Synced just now';
    } else if (diffInHours < 24) {
      return `Synced ${Math.floor(diffInHours)}h ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `Synced ${diffInDays}d ago`;
    }
  };

  const getStatusColor = (isConnected: boolean, lastSyncAt: string | null) => {
    if (!isConnected) {
      return 'bg-red-500/10 text-red-700 border-red-200';
    }
    
    if (!lastSyncAt) {
      return 'bg-yellow-500/10 text-yellow-700 border-yellow-200';
    }
    
    const lastSync = new Date(lastSyncAt);
    const now = new Date();
    const diffInHours = (now.getTime() - lastSync.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours > 24) {
      return 'bg-yellow-500/10 text-yellow-700 border-yellow-200';
    }
    
    return 'bg-green-500/10 text-green-700 border-green-200';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const providers = [
    { id: 'github', name: 'GitHub', icon: <Github className="h-5 w-5" />, color: 'text-gray-900 dark:text-gray-100' },
    { id: 'gitlab', name: 'GitLab', icon: <Gitlab className="h-5 w-5" />, color: 'text-orange-500' },
    { id: 'bitbucket', name: 'Bitbucket', icon: <GitBranch className="h-5 w-5" />, color: 'text-blue-500' },
  ] as const;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <GitBranch className="h-5 w-5" />
            <div>
              <CardTitle>Repository Integrations</CardTitle>
              <CardDescription>Connect and manage code repositories</CardDescription>
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Available Providers */}
        <div>
          <h3 className="text-sm font-medium mb-3">Connect New Repository</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {providers.map((provider) => (
              <Button
                key={provider.id}
                variant="outline"
                className="h-auto p-4 flex flex-col items-center space-y-2"
                onClick={() => onConnectRepo?.(provider.id as ProjectRepo['provider'])}
              >
                <div className={provider.color}>
                  {provider.icon}
                </div>
                <span className="font-medium">{provider.name}</span>
                <span className="text-xs text-muted-foreground">
                  Connect your {provider.name} repository
                </span>
              </Button>
            ))}
          </div>
        </div>

        {/* Connected Repositories */}
        <div>
          <h3 className="text-sm font-medium mb-3">Connected Repositories</h3>
          {repos.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <GitBranch className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No repositories connected yet</p>
              <p className="text-sm">Connect a repository to start tracking commits and PRs</p>
            </div>
          ) : (
            <div className="space-y-4">
              {repos.map((repo) => (
                <div 
                  key={repo.id} 
                  className="border rounded-lg p-4 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3 flex-1">
                      <div className={`flex-shrink-0 mt-1 ${getProviderColor(repo.provider)}`}>
                        {getProviderIcon(repo.provider)}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-1">
                          <h4 className="font-medium text-sm truncate">
                            {repo.repo_name}
                          </h4>
                          <Badge 
                            variant="outline" 
                            className={`text-xs ${getStatusColor(repo.is_connected, repo.last_sync_at)}`}
                          >
                            {getStatusText(repo.is_connected, repo.last_sync_at)}
                          </Badge>
                        </div>
                        
                        <div className="flex items-center space-x-4 text-xs text-muted-foreground mb-2">
                          <span>Provider: {repo.provider}</span>
                          <span>Branch: {repo.default_branch}</span>
                          {repo.last_sync_at && (
                            <span>Last sync: {formatDate(repo.last_sync_at)}</span>
                          )}
                        </div>
                        
                        <a 
                          href={repo.repo_url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-xs text-primary hover:underline flex items-center space-x-1"
                        >
                          <ExternalLink className="h-3 w-3" />
                          <span>View on {repo.provider}</span>
                        </a>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-1 ml-4">
                      {getStatusIcon(repo.is_connected, repo.last_sync_at)}
                      
                      {onRefreshRepo && (
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-6 w-6 p-0"
                          onClick={() => onRefreshRepo(repo.id)}
                        >
                          <RefreshCw className="h-3 w-3" />
                        </Button>
                      )}
                      
                      {onConfigureRepo && (
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-6 w-6 p-0"
                          onClick={() => onConfigureRepo(repo)}
                        >
                          <Settings className="h-3 w-3" />
                        </Button>
                      )}
                      
                      {onDisconnectRepo && (
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-6 w-6 p-0 text-destructive hover:text-destructive"
                          onClick={() => onDisconnectRepo(repo.id)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
