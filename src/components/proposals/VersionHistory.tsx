import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Clock, 
  User, 
  FileText, 
  Eye, 
  Download, 
  RotateCcw,
  GitBranch,
  History,
  CheckCircle,
} from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface VersionHistoryProps {
  proposalId: string;
  versions: Array<{
    id: string;
    version_number: number;
    title: string;
    content: Record<string, any>;
    changes_summary: string | null;
    created_at: string;
    user_id: string;
  }>;
  currentVersion: number;
  onVersionSelect?: (version: any) => void;
  onRestoreVersion?: (version: any) => void;
}

export default function VersionHistory({
  versions,
  currentVersion,
  onVersionSelect,
  onRestoreVersion
}: VersionHistoryProps) {
  const [selectedVersion, setSelectedVersion] = useState<string>('');

  const handleVersionSelect = (version: any) => {
    setSelectedVersion(version.id);
    onVersionSelect?.(version);
  };

  const handleRestore = (version: any) => {
    if (confirm(`Are you sure you want to restore version ${version.version_number}? This will create a new version with the selected content.`)) {
      onRestoreVersion?.(version);
    }
  };

  const getVersionStatus = (versionNumber: number) => {
    if (versionNumber === currentVersion) {
      return {
        label: 'Current',
        color: 'bg-green-500/20 text-green-300 border-green-500/30',
        icon: <CheckCircle className="h-3 w-3" />
      };
    }
    return {
      label: 'Previous',
      color: 'bg-gray-500/20 text-gray-300 border-gray-500/30',
      icon: <History className="h-3 w-3" />
    };
  };

  const getChangesSummary = (summary: string | null) => {
    if (!summary) return 'No changes summary available';
    if (summary.length > 100) return `${summary.substring(0, 100)}...`;
    return summary;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center justify-between"
      >
        <div className="flex items-center space-x-3">
          <GitBranch className="h-8 w-8 text-primary" />
          <div>
            <h2 className="text-2xl font-bold">Version History</h2>
            <p className="text-muted-foreground">
              Track changes and manage proposal versions
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="flex items-center gap-1">
            <FileText className="h-3 w-3" />
            {versions.length} versions
          </Badge>
        </div>
      </motion.div>

      {/* Version List */}
      <div className="space-y-4">
        {versions.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="border-dashed">
              <CardContent className="p-12 text-center">
                <History className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Version History</h3>
                <p className="text-muted-foreground">
                  This proposal doesn't have any version history yet.
                </p>
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          versions.map((version, index) => {
            const status = getVersionStatus(version.version_number);
            const isSelected = selectedVersion === version.id;
            
            return (
              <motion.div
                key={version.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Card 
                  className={cn(
                    "card-hover group transition-all duration-200",
                    isSelected && "ring-2 ring-primary/50 bg-primary/5",
                    version.version_number === currentVersion && "border-primary/30"
                  )}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold truncate">
                            {version.title}
                          </h3>
                          <Badge className={status.color}>
                            {status.icon}
                            <span className="ml-1">{status.label}</span>
                          </Badge>
                          <Badge variant="outline">
                            v{version.version_number}
                          </Badge>
                        </div>
                        
                        <p className="text-muted-foreground text-sm mb-3">
                          {getChangesSummary(version.changes_summary)}
                        </p>
                        
                        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            <span>{format(new Date(version.created_at), 'MMM d, yyyy HH:mm')}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            <span>User {version.user_id.slice(0, 8)}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 ml-4">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleVersionSelect(version)}
                          className={isSelected ? "bg-primary/10" : ""}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        
                        {version.version_number !== currentVersion && (
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleRestore(version)}
                            className="text-orange-300 hover:text-orange-200 hover:bg-orange-500/10"
                          >
                            <RotateCcw className="h-4 w-4" />
                          </Button>
                        )}
                        
                        <Button variant="ghost" size="sm">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })
        )}
      </div>

      {/* Version Comparison */}
      {selectedVersion && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                Version Preview
              </CardTitle>
              <CardDescription>
                Preview the selected version content
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-muted/50 rounded-lg">
                  <h4 className="font-medium mb-2">Content Preview</h4>
                  <p className="text-sm text-muted-foreground">
                    This is where the version content would be displayed. 
                    In a real implementation, this would show the actual proposal content 
                    with syntax highlighting and diff visualization.
                  </p>
                </div>
                
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      const version = versions.find(v => v.id === selectedVersion);
                      if (version) handleRestore(version);
                    }}
                  >
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Restore This Version
                  </Button>
                  <Button variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Download Version
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Version Statistics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <History className="h-5 w-5" />
              Version Statistics
            </CardTitle>
            <CardDescription>
              Overview of proposal version history
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">
                  {versions.length}
                </div>
                <div className="text-sm text-muted-foreground">
                  Total Versions
                </div>
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold text-green-300">
                  {versions.filter(v => v.version_number === currentVersion).length}
                </div>
                <div className="text-sm text-muted-foreground">
                  Current Version
                </div>
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-300">
                  {versions.length > 0 ? 
                    Math.round((Date.now() - new Date(versions[0].created_at).getTime()) / (1000 * 60 * 60 * 24)) : 0
                  }
                </div>
                <div className="text-sm text-muted-foreground">
                  Days Active
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
