import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Card, 
  CardContent
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ArrowLeft, 
  Edit, 
  Send, 
  Download, 
  Share2,
  FileText,
  Bot,
  Settings,
  History,
} from 'lucide-react';
import { useProposal } from '@/hooks/useProposals';
import { 
  ProposalEditor, 
  ESignIntegration, 
  TemplateManager, 
  VersionHistory, 
  AIGeneration 
} from '@/components/proposals';

export default function ProposalDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('editor');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<string>('');

  const { data: proposal, isLoading, error } = useProposal(id || '');

  const handleGenerateAI = async (prompt: string) => {
    setIsGenerating(true);
    try {
      // Simulate AI generation
      await new Promise(resolve => setTimeout(resolve, 3000));
      setGeneratedContent(`
# AI Generated Proposal

## Executive Summary
${prompt}

## Project Overview
Based on your requirements, this project will deliver a comprehensive solution that addresses your specific needs.

## Scope of Work
- Analysis and planning
- Implementation and development
- Testing and quality assurance
- Deployment and handover

## Timeline
- Phase 1: 2 weeks
- Phase 2: 4 weeks
- Phase 3: 2 weeks

## Deliverables
- Complete project documentation
- Source code and assets
- User training materials
- Ongoing support plan

## Pricing
- Total Project Cost: $50,000
- Payment Terms: 50% upfront, 50% on completion
- Additional costs: As discussed

## Terms & Conditions
Standard terms apply as per our service agreement.
      `);
    } catch (error) {
      console.error('AI generation failed:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleApplyContent = (content: string) => {
    console.log('Applying content:', content);
    // In a real implementation, this would update the proposal content
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background p-8">
        <div className="container mx-auto max-w-6xl">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-muted rounded w-1/3"></div>
            <div className="h-64 bg-muted rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !proposal) {
    return (
      <div className="min-h-screen bg-background p-8">
        <div className="container mx-auto max-w-6xl">
          <Card className="border-destructive/50">
            <CardContent className="p-8 text-center">
              <h3 className="text-lg font-semibold mb-2">Proposal Not Found</h3>
              <p className="text-muted-foreground mb-4">
                The proposal you're looking for doesn't exist or you don't have access to it.
              </p>
              <Button onClick={() => navigate('/proposals')}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Proposals
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-between mb-8"
        >
          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => navigate('/proposals')}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-3xl font-bold gradient-text">{proposal.title}</h1>
              <p className="text-muted-foreground">
                {proposal.client_name} • {proposal.project_type.replace('_', ' ')} • ${proposal.total_value.toLocaleString()}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="outline">
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
            <Button className="btn-primary">
              <Send className="h-4 w-4 mr-2" />
              Send for Review
            </Button>
          </div>
        </motion.div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5 mb-8">
            <TabsTrigger value="editor" className="flex items-center gap-2">
              <Edit className="h-4 w-4" />
              Editor
            </TabsTrigger>
            <TabsTrigger value="ai" className="flex items-center gap-2">
              <Bot className="h-4 w-4" />
              AI Generate
            </TabsTrigger>
            <TabsTrigger value="esign" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              E-Sign
            </TabsTrigger>
            <TabsTrigger value="templates" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Templates
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center gap-2">
              <History className="h-4 w-4" />
              History
            </TabsTrigger>
          </TabsList>

          {/* Editor Tab */}
          <TabsContent value="editor">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <ProposalEditor
                proposalId={proposal.id}
                initialData={{
                  title: proposal.title,
                  description: proposal.description || undefined,
                  client_name: proposal.client_name,
                  client_email: proposal.client_email,
                  project_type: proposal.project_type,
                  total_value: proposal.total_value,
                  currency: proposal.currency,
                  payment_terms: proposal.payment_terms,
                  priority: proposal.priority,
                }}
                mode="edit"
                onSave={(updatedProposal) => {
                  console.log('Proposal saved:', updatedProposal);
                }}
                onCancel={() => navigate('/proposals')}
              />
            </motion.div>
          </TabsContent>

          {/* AI Generation Tab */}
          <TabsContent value="ai">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <AIGeneration
                onGenerate={handleGenerateAI}
                onApply={handleApplyContent}
                isLoading={isGenerating}
                generatedContent={generatedContent}
              />
            </motion.div>
          </TabsContent>

          {/* E-Sign Tab */}
          <TabsContent value="esign">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <ESignIntegration
                proposalId={proposal.id}
                currentStatus={proposal.esign_status as any}
                provider="docusign"
                documentId={proposal.esign_document_id || undefined}
                envelopeId={proposal.esign_envelope_id || undefined}
                signedAt={proposal.esign_signed_at || undefined}
                signedBy={proposal.client_name || undefined}
                onStatusUpdate={(status) => {
                  console.log('E-sign status updated:', status);
                }}
              />
            </motion.div>
          </TabsContent>

          {/* Templates Tab */}
          <TabsContent value="templates">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <TemplateManager
                mode="select"
                onTemplateSelect={(template) => {
                  console.log('Template selected:', template);
                }}
              />
            </motion.div>
          </TabsContent>

          {/* History Tab */}
          <TabsContent value="history">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <VersionHistory
                proposalId={proposal.id}
                versions={[]} // This would come from the API
                currentVersion={1}
                onVersionSelect={(version) => {
                  console.log('Version selected:', version);
                }}
                onRestoreVersion={(version) => {
                  console.log('Restore version:', version);
                }}
              />
            </motion.div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
