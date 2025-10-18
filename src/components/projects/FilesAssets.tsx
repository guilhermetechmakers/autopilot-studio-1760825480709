import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Upload, 
  FileText, 
  Image, 
  Video, 
  Music, 
  Archive, 
  File,
  Download,
  Eye,
  Trash2,
  Folder,
  Search,
  Filter
} from 'lucide-react';
import type { ProjectFile } from '@/types/database';

interface FilesAssetsProps {
  files: ProjectFile[];
  isLoading?: boolean;
  onUploadFile?: () => void;
  onDeleteFile?: (fileId: string) => void;
  onViewFile?: (file: ProjectFile) => void;
  onDownloadFile?: (file: ProjectFile) => void;
}

export function FilesAssets({ 
  files, 
  isLoading = false, 
  onUploadFile,
  onDeleteFile,
  onViewFile,
  onDownloadFile
}: FilesAssetsProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Files & Assets</CardTitle>
          <CardDescription>Manage project files, documents, and shared assets</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-32 bg-muted rounded-lg"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const getFileIcon = (fileType: ProjectFile['file_type']) => {
    switch (fileType) {
      case 'document':
        return <FileText className="h-8 w-8 text-blue-500" />;
      case 'image':
        return <Image className="h-8 w-8 text-green-500" />;
      case 'video':
        return <Video className="h-8 w-8 text-purple-500" />;
      case 'audio':
        return <Music className="h-8 w-8 text-orange-500" />;
      case 'archive':
        return <Archive className="h-8 w-8 text-yellow-500" />;
      default:
        return <File className="h-8 w-8 text-gray-500" />;
    }
  };

  const getFileTypeColor = (fileType: ProjectFile['file_type']) => {
    switch (fileType) {
      case 'document':
        return 'bg-blue-500/10 text-blue-700 border-blue-200';
      case 'image':
        return 'bg-green-500/10 text-green-700 border-green-200';
      case 'video':
        return 'bg-purple-500/10 text-purple-700 border-purple-200';
      case 'audio':
        return 'bg-orange-500/10 text-orange-700 border-orange-200';
      case 'archive':
        return 'bg-yellow-500/10 text-yellow-700 border-yellow-200';
      default:
        return 'bg-gray-500/10 text-gray-700 border-gray-200';
    }
  };

  const formatFileSize = (bytes: number | null) => {
    if (!bytes) return 'Unknown size';
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Group files by folder
  const filesByFolder = files.reduce((acc, file) => {
    const folder = file.folder_path || '/';
    if (!acc[folder]) {
      acc[folder] = [];
    }
    acc[folder].push(file);
    return acc;
  }, {} as Record<string, ProjectFile[]>);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Files & Assets</CardTitle>
            <CardDescription>Manage project files, documents, and shared assets</CardDescription>
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
            {onUploadFile && (
              <Button onClick={onUploadFile} size="sm">
                <Upload className="h-4 w-4 mr-2" />
                Upload
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        {files.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <FileText className="h-16 w-16 mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-semibold mb-2">No files uploaded yet</h3>
            <p className="text-sm mb-4">
              Upload files, documents, and assets to share with your team and clients
            </p>
            {onUploadFile && (
              <Button onClick={onUploadFile} variant="outline">
                <Upload className="h-4 w-4 mr-2" />
                Upload Your First File
              </Button>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(filesByFolder).map(([folder, folderFiles]) => (
              <div key={folder}>
                <div className="flex items-center space-x-2 mb-3">
                  <Folder className="h-4 w-4 text-muted-foreground" />
                  <h3 className="font-medium">{folder === '/' ? 'Root' : folder}</h3>
                  <Badge variant="secondary" className="text-xs">
                    {folderFiles.length} files
                  </Badge>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {folderFiles.map((file) => (
                    <div 
                      key={file.id} 
                      className="border rounded-lg p-4 hover:bg-muted/50 transition-colors"
                    >
                      <div className="space-y-3">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center space-x-3">
                            {getFileIcon(file.file_type)}
                            <div className="flex-1 min-w-0">
                              <h4 className="font-medium text-sm truncate">
                                {file.name}
                              </h4>
                              <p className="text-xs text-muted-foreground">
                                {formatFileSize(file.file_size)}
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-1">
                            {file.is_client_visible && (
                              <Badge variant="outline" className="text-xs">
                                Client
                              </Badge>
                            )}
                            <Badge 
                              variant="outline" 
                              className={`text-xs ${getFileTypeColor(file.file_type)}`}
                            >
                              {file.file_type}
                            </Badge>
                          </div>
                        </div>
                        
                        {file.description && (
                          <p className="text-xs text-muted-foreground line-clamp-2">
                            {file.description}
                          </p>
                        )}
                        
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span>Uploaded {formatDate(file.created_at)}</span>
                          <div className="flex items-center space-x-1">
                            {onViewFile && (
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="h-6 w-6 p-0"
                                onClick={() => onViewFile(file)}
                              >
                                <Eye className="h-3 w-3" />
                              </Button>
                            )}
                            {onDownloadFile && (
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="h-6 w-6 p-0"
                                onClick={() => onDownloadFile(file)}
                              >
                                <Download className="h-3 w-3" />
                              </Button>
                            )}
                            {onDeleteFile && (
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="h-6 w-6 p-0 text-destructive hover:text-destructive"
                                onClick={() => onDeleteFile(file.id)}
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            )}
                          </div>
                        </div>
                        
                        {/* Tags */}
                        {file.tags && file.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {file.tags.slice(0, 3).map((tag, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                            {file.tags.length > 3 && (
                              <Badge variant="outline" className="text-xs">
                                +{file.tags.length - 3}
                              </Badge>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
