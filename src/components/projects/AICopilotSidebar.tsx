import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  Bot, 
  FileText, 
  MessageSquare, 
  Edit3, 
  CheckCircle, 
  Clock,
  Sparkles,
  Send,
  X
} from 'lucide-react';
import { useState } from 'react';

interface AICopilotSidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
  projectId: string;
}

interface AICopilotAction {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  prompt: string;
  status: 'available' | 'generating' | 'completed' | 'error';
}

export function AICopilotSidebar({ 
  isOpen = false, 
  onClose,
  projectId: _projectId 
}: AICopilotSidebarProps) {
  const [customPrompt, setCustomPrompt] = useState('');
  const [_selectedAction, setSelectedAction] = useState<string | null>(null);

  const actions: AICopilotAction[] = [
    {
      id: 'generate-specs',
      title: 'Generate Technical Specs',
      description: 'Create detailed technical specifications for features',
      icon: <FileText className="h-4 w-4" />,
      prompt: 'Generate technical specifications for the following requirements:',
      status: 'available'
    },
    {
      id: 'meeting-notes',
      title: 'Create Meeting Notes',
      description: 'Summarize meeting discussions and action items',
      icon: <MessageSquare className="h-4 w-4" />,
      prompt: 'Create meeting notes from the following discussion:',
      status: 'available'
    },
    {
      id: 'change-request',
      title: 'Draft Change Request',
      description: 'Generate a formal change request document',
      icon: <Edit3 className="h-4 w-4" />,
      prompt: 'Draft a change request for the following modifications:',
      status: 'available'
    },
    {
      id: 'acceptance-criteria',
      title: 'Define Acceptance Criteria',
      description: 'Create clear acceptance criteria for user stories',
      icon: <CheckCircle className="h-4 w-4" />,
      prompt: 'Define acceptance criteria for the following user story:',
      status: 'available'
    }
  ];

  const handleActionClick = (action: AICopilotAction) => {
    setSelectedAction(action.id);
    setCustomPrompt(action.prompt);
  };

  const handleGenerate = () => {
    if (!customPrompt.trim()) return;
    
    // TODO: Implement AI generation logic
    console.log('Generating with prompt:', customPrompt);
  };

  const getStatusIcon = (status: AICopilotAction['status']) => {
    switch (status) {
      case 'generating':
        return <Clock className="h-4 w-4 text-blue-500 animate-spin" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'error':
        return <X className="h-4 w-4 text-red-500" />;
      default:
        return <Sparkles className="h-4 w-4 text-primary" />;
    }
  };

  const getStatusColor = (status: AICopilotAction['status']) => {
    switch (status) {
      case 'generating':
        return 'bg-blue-500/10 text-blue-700 border-blue-200';
      case 'completed':
        return 'bg-green-500/10 text-green-700 border-green-200';
      case 'error':
        return 'bg-red-500/10 text-red-700 border-red-200';
      default:
        return 'bg-primary/10 text-primary border-primary/20';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 w-96 bg-background border-l shadow-lg z-50 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Bot className="h-5 w-5 text-primary" />
            <h2 className="font-semibold">AI Copilot</h2>
          </div>
          {onClose && (
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
        <p className="text-sm text-muted-foreground mt-1">
          Generate specs, notes, and documentation
        </p>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Quick Actions</CardTitle>
            <CardDescription className="text-xs">
              Choose from common AI tasks
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {actions.map((action) => (
              <Button
                key={action.id}
                variant="outline"
                className="w-full justify-start h-auto p-3"
                onClick={() => handleActionClick(action)}
              >
                <div className="flex items-center space-x-3 w-full">
                  {action.icon}
                  <div className="flex-1 text-left">
                    <div className="font-medium text-sm">{action.title}</div>
                    <div className="text-xs text-muted-foreground">
                      {action.description}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(action.status)}
                    <Badge 
                      variant="outline" 
                      className={`text-xs ${getStatusColor(action.status)}`}
                    >
                      {action.status}
                    </Badge>
                  </div>
                </div>
              </Button>
            ))}
          </CardContent>
        </Card>

        {/* Custom Prompt */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Custom Prompt</CardTitle>
            <CardDescription className="text-xs">
              Enter your own prompt for AI generation
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Textarea
              placeholder="Describe what you want the AI to generate..."
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              className="min-h-[100px]"
            />
            <Button 
              onClick={handleGenerate} 
              className="w-full"
              disabled={!customPrompt.trim()}
            >
              <Send className="h-4 w-4 mr-2" />
              Generate
            </Button>
          </CardContent>
        </Card>

        {/* Recent Generations */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Recent Generations</CardTitle>
            <CardDescription className="text-xs">
              Your recent AI-generated content
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-4 text-muted-foreground text-sm">
              No recent generations
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Footer */}
      <div className="p-4 border-t bg-muted/50">
        <div className="text-xs text-muted-foreground text-center">
          AI Copilot powered by advanced language models
        </div>
      </div>
    </div>
  );
}
