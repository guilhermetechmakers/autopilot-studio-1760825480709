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
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Bot, 
  Sparkles, 
  FileText, 
  Wand2, 
  Loader2,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  Copy,
  Download
} from 'lucide-react';

interface AIGenerationProps {
  onGenerate?: (prompt: string, options: AIGenerationOptions) => void;
  onApply?: (content: string) => void;
  isLoading?: boolean;
  generatedContent?: string;
  error?: string;
}

interface AIGenerationOptions {
  model: string;
  tone: string;
  length: string;
  includeSections: string[];
}

const AI_MODELS = [
  { value: 'gpt-4', label: 'GPT-4', description: 'Most capable model' },
  { value: 'gpt-3.5-turbo', label: 'GPT-3.5 Turbo', description: 'Fast and efficient' },
  { value: 'claude-3', label: 'Claude 3', description: 'Anthropic\'s latest' },
];

const TONE_OPTIONS = [
  { value: 'professional', label: 'Professional' },
  { value: 'friendly', label: 'Friendly' },
  { value: 'formal', label: 'Formal' },
  { value: 'casual', label: 'Casual' },
  { value: 'technical', label: 'Technical' },
];

const LENGTH_OPTIONS = [
  { value: 'short', label: 'Short (1-2 pages)' },
  { value: 'medium', label: 'Medium (3-5 pages)' },
  { value: 'long', label: 'Long (6+ pages)' },
];

const SECTION_OPTIONS = [
  { value: 'executive_summary', label: 'Executive Summary' },
  { value: 'project_overview', label: 'Project Overview' },
  { value: 'scope_of_work', label: 'Scope of Work' },
  { value: 'timeline', label: 'Timeline' },
  { value: 'deliverables', label: 'Deliverables' },
  { value: 'pricing', label: 'Pricing' },
  { value: 'terms', label: 'Terms & Conditions' },
];

export default function AIGeneration({
  onGenerate,
  onApply,
  isLoading = false,
  generatedContent,
  error
}: AIGenerationProps) {
  const [prompt, setPrompt] = useState('');
  const [options, setOptions] = useState<AIGenerationOptions>({
    model: 'gpt-4',
    tone: 'professional',
    length: 'medium',
    includeSections: ['executive_summary', 'project_overview', 'scope_of_work', 'timeline', 'deliverables', 'pricing']
  });

  const handleGenerate = () => {
    if (prompt.trim() && onGenerate) {
      onGenerate(prompt, options);
    }
  };

  const handleApply = () => {
    if (generatedContent && onApply) {
      onApply(generatedContent);
    }
  };

  const handleCopy = () => {
    if (generatedContent) {
      navigator.clipboard.writeText(generatedContent);
    }
  };

  const toggleSection = (section: string) => {
    setOptions(prev => ({
      ...prev,
      includeSections: prev.includeSections.includes(section)
        ? prev.includeSections.filter(s => s !== section)
        : [...prev.includeSections, section]
    }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center space-x-3"
      >
        <Bot className="h-8 w-8 text-primary" />
        <div>
          <h2 className="text-2xl font-bold">AI Proposal Generation</h2>
          <p className="text-muted-foreground">
            Generate professional proposals using AI
          </p>
        </div>
      </motion.div>

      {/* Generation Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wand2 className="h-5 w-5" />
              Generate Proposal
            </CardTitle>
            <CardDescription>
              Describe your project and let AI create a professional proposal
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Prompt Input */}
            <div className="space-y-2">
              <Label htmlFor="prompt">Project Description</Label>
              <Textarea
                id="prompt"
                placeholder="Describe your project, client needs, scope, and any specific requirements..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                rows={4}
                className="resize-none"
              />
            </div>

            {/* Generation Options */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>AI Model</Label>
                <Select 
                  value={options.model} 
                  onValueChange={(value) => setOptions(prev => ({ ...prev, model: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {AI_MODELS.map((model) => (
                      <SelectItem key={model.value} value={model.value}>
                        <div>
                          <div className="font-medium">{model.label}</div>
                          <div className="text-sm text-muted-foreground">{model.description}</div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Tone</Label>
                <Select 
                  value={options.tone} 
                  onValueChange={(value) => setOptions(prev => ({ ...prev, tone: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {TONE_OPTIONS.map((tone) => (
                      <SelectItem key={tone.value} value={tone.value}>
                        {tone.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Length</Label>
                <Select 
                  value={options.length} 
                  onValueChange={(value) => setOptions(prev => ({ ...prev, length: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {LENGTH_OPTIONS.map((length) => (
                      <SelectItem key={length.value} value={length.value}>
                        {length.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Include Sections */}
            <div className="space-y-2">
              <Label>Include Sections</Label>
              <div className="flex flex-wrap gap-2">
                {SECTION_OPTIONS.map((section) => (
                  <Button
                    key={section.value}
                    variant={options.includeSections.includes(section.value) ? "default" : "outline"}
                    size="sm"
                    onClick={() => toggleSection(section.value)}
                    className="text-xs"
                  >
                    {section.label}
                  </Button>
                ))}
              </div>
            </div>

            {/* Generate Button */}
            <div className="flex gap-2 pt-4">
              <Button 
                onClick={handleGenerate}
                disabled={!prompt.trim() || isLoading}
                className="btn-primary"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 mr-2" />
                    Generate Proposal
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Generated Content */}
      {generatedContent && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Generated Proposal
              </CardTitle>
              <CardDescription>
                Review and apply the AI-generated content
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-muted/50 rounded-lg max-h-96 overflow-y-auto">
                <div className="prose prose-invert max-w-none">
                  <pre className="whitespace-pre-wrap text-sm">
                    {generatedContent}
                  </pre>
                </div>
              </div>

              <div className="flex gap-2">
                <Button onClick={handleApply} className="btn-primary">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Apply to Proposal
                </Button>
                <Button variant="outline" onClick={handleCopy}>
                  <Copy className="h-4 w-4 mr-2" />
                  Copy Content
                </Button>
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
                <Button variant="outline" onClick={handleGenerate}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Regenerate
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Error State */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="border-destructive/50">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 text-destructive">
                <AlertCircle className="h-4 w-4" />
                <span className="font-medium">Generation Failed</span>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                {error}
              </p>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleGenerate}
                className="mt-3"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Try Again
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* AI Tips */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bot className="h-5 w-5" />
              AI Generation Tips
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Badge variant="outline" className="mt-0.5">1</Badge>
                <div>
                  <p className="text-sm font-medium">Be Specific</p>
                  <p className="text-xs text-muted-foreground">
                    Include details about project scope, timeline, and deliverables
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Badge variant="outline" className="mt-0.5">2</Badge>
                <div>
                  <p className="text-sm font-medium">Mention Client Context</p>
                  <p className="text-xs text-muted-foreground">
                    Include information about the client's industry and needs
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Badge variant="outline" className="mt-0.5">3</Badge>
                <div>
                  <p className="text-sm font-medium">Specify Budget Range</p>
                  <p className="text-xs text-muted-foreground">
                    Mention budget expectations for better pricing sections
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
