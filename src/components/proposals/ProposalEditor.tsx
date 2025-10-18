import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { 
  Save, 
  Send, 
  Eye, 
  Download, 
  FileText,
  DollarSign,
  User,
  AlertCircle
} from 'lucide-react';
import { useCreateProposal, useUpdateProposal } from '@/hooks/useProposals';
import { useSowTemplates } from '@/hooks/useSowTemplates';
import type { ProposalInsert, ProjectType } from '@/types/database';

// Form validation schema
const proposalSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title must be less than 200 characters'),
  description: z.string().optional(),
  client_name: z.string().min(1, 'Client name is required'),
  client_email: z.string().email('Invalid email address'),
  project_type: z.enum(['ai_development', 'web_development', 'mobile_development', 'consulting', 'other']),
  total_value: z.number().min(0, 'Value must be positive'),
  currency: z.string().min(1, 'Currency is required'),
  payment_terms: z.string().optional(),
  priority: z.enum(['low', 'medium', 'high', 'urgent']).optional(),
});

type ProposalFormData = z.infer<typeof proposalSchema>;

interface ProposalEditorProps {
  proposalId?: string;
  initialData?: Partial<ProposalFormData>;
  onSave?: (proposal: any) => void;
  onCancel?: () => void;
  mode?: 'create' | 'edit' | 'view';
}

export default function ProposalEditor({ 
  proposalId, 
  initialData, 
  onSave, 
  onCancel, 
  mode = 'create' 
}: ProposalEditorProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  
  const createProposal = useCreateProposal();
  const updateProposal = useUpdateProposal();
  const { data: templates } = useSowTemplates();

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    watch,
    setValue,
  } = useForm<ProposalFormData>({
    resolver: zodResolver(proposalSchema),
    defaultValues: {
      title: initialData?.title || '',
      description: initialData?.description || '',
      client_name: initialData?.client_name || '',
      client_email: initialData?.client_email || '',
      project_type: initialData?.project_type || 'ai_development',
      total_value: initialData?.total_value || 0,
      currency: initialData?.currency || 'USD',
      payment_terms: initialData?.payment_terms || 'Net 30',
      priority: initialData?.priority || 'medium',
    }
  });

  const watchedValues = watch();

  // Auto-save functionality
  useEffect(() => {
    if (isDirty && mode === 'edit') {
      const timeoutId = setTimeout(() => {
        // Auto-save logic here
        console.log('Auto-saving...', watchedValues);
      }, 2000);
      
      return () => clearTimeout(timeoutId);
    }
  }, [watchedValues, isDirty, mode]);

  const onSubmit = async (data: ProposalFormData) => {
    try {
      if (mode === 'create') {
        const proposalData: ProposalInsert = {
          ...data,
          user_id: 'current-user-id', // This should come from auth context
          status: 'draft',
          esign_status: 'not_sent',
          content: {},
          metadata: {},
        };
        
        const newProposal = await createProposal.mutateAsync(proposalData);
        onSave?.(newProposal);
      } else if (mode === 'edit' && proposalId) {
        const updatedProposal = await updateProposal.mutateAsync({
          id: proposalId,
          updates: data
        });
        onSave?.(updatedProposal);
      }
    } catch (error) {
      console.error('Error saving proposal:', error);
    }
  };

  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplate(templateId);
    const template = templates?.find(t => t.id === templateId);
    if (template) {
      // Apply template variables to form
      // This would be more sophisticated in a real implementation
      console.log('Applying template:', template);
    }
  };

  const generateWithAI = async () => {
    setIsGenerating(true);
    try {
      // AI generation logic would go here
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API call
      console.log('AI generation completed');
    } catch (error) {
      console.error('AI generation failed:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const projectTypeOptions: { value: ProjectType; label: string }[] = [
    { value: 'ai_development', label: 'AI Development' },
    { value: 'web_development', label: 'Web Development' },
    { value: 'mobile_development', label: 'Mobile Development' },
    { value: 'consulting', label: 'Consulting' },
    { value: 'other', label: 'Other' },
  ];

  const priorityOptions = [
    { value: 'low', label: 'Low', color: 'bg-gray-500/20 text-gray-300' },
    { value: 'medium', label: 'Medium', color: 'bg-blue-500/20 text-blue-300' },
    { value: 'high', label: 'High', color: 'bg-orange-500/20 text-orange-300' },
    { value: 'urgent', label: 'Urgent', color: 'bg-red-500/20 text-red-300' },
  ];

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center justify-between"
      >
        <div className="flex items-center space-x-3">
          <FileText className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-2xl font-bold">
              {mode === 'create' ? 'Create New Proposal' : 
               mode === 'edit' ? 'Edit Proposal' : 'View Proposal'}
            </h1>
            <p className="text-muted-foreground">
              {mode === 'create' ? 'Fill in the details to create a new proposal' :
               mode === 'edit' ? 'Make changes to your proposal' : 
               'Review proposal details'}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {mode !== 'view' && (
            <>
              <Button variant="outline" onClick={onCancel}>
                Cancel
              </Button>
              <Button 
                onClick={handleSubmit(onSubmit)}
                disabled={createProposal.isPending || updateProposal.isPending}
                className="btn-primary"
              >
                <Save className="h-4 w-4 mr-2" />
                {mode === 'create' ? 'Create' : 'Save'}
              </Button>
            </>
          )}
          {mode === 'view' && (
            <>
              <Button variant="outline">
                <Eye className="h-4 w-4 mr-2" />
                Preview
              </Button>
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
              <Button className="btn-primary">
                <Send className="h-4 w-4 mr-2" />
                Send for Review
              </Button>
            </>
          )}
        </div>
      </motion.div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Basic Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Basic Information
              </CardTitle>
              <CardDescription>
                Essential details about your proposal
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Proposal Title *</Label>
                  <Input
                    id="title"
                    {...register('title')}
                    placeholder="Enter proposal title"
                    disabled={mode === 'view'}
                  />
                  {errors.title && (
                    <p className="text-sm text-destructive flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.title.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="project_type">Project Type *</Label>
                  <Select 
                    value={watchedValues.project_type} 
                    onValueChange={(value) => setValue('project_type', value as ProjectType)}
                    disabled={mode === 'view'}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select project type" />
                    </SelectTrigger>
                    <SelectContent>
                      {projectTypeOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.project_type && (
                    <p className="text-sm text-destructive flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.project_type.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  {...register('description')}
                  placeholder="Describe the project and scope of work"
                  rows={4}
                  disabled={mode === 'view'}
                />
                {errors.description && (
                  <p className="text-sm text-destructive flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.description.message}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Client Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Client Information
              </CardTitle>
              <CardDescription>
                Details about the client and contact information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="client_name">Client Name *</Label>
                  <Input
                    id="client_name"
                    {...register('client_name')}
                    placeholder="Enter client name or company"
                    disabled={mode === 'view'}
                  />
                  {errors.client_name && (
                    <p className="text-sm text-destructive flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.client_name.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="client_email">Client Email *</Label>
                  <Input
                    id="client_email"
                    type="email"
                    {...register('client_email')}
                    placeholder="client@company.com"
                    disabled={mode === 'view'}
                  />
                  {errors.client_email && (
                    <p className="text-sm text-destructive flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.client_email.message}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Financial Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Financial Information
              </CardTitle>
              <CardDescription>
                Project value and payment terms
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="total_value">Total Value *</Label>
                  <Input
                    id="total_value"
                    type="number"
                    step="0.01"
                    {...register('total_value', { valueAsNumber: true })}
                    placeholder="0.00"
                    disabled={mode === 'view'}
                  />
                  {errors.total_value && (
                    <p className="text-sm text-destructive flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.total_value.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="currency">Currency *</Label>
                  <Select 
                    value={watchedValues.currency} 
                    onValueChange={(value) => setValue('currency', value)}
                    disabled={mode === 'view'}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select currency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USD">USD - US Dollar</SelectItem>
                      <SelectItem value="EUR">EUR - Euro</SelectItem>
                      <SelectItem value="GBP">GBP - British Pound</SelectItem>
                      <SelectItem value="CAD">CAD - Canadian Dollar</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.currency && (
                    <p className="text-sm text-destructive flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.currency.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="payment_terms">Payment Terms</Label>
                  <Input
                    id="payment_terms"
                    {...register('payment_terms')}
                    placeholder="Net 30"
                    disabled={mode === 'view'}
                  />
                  {errors.payment_terms && (
                    <p className="text-sm text-destructive flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.payment_terms.message}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Template and AI Generation */}
        {mode !== 'view' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Template & AI Generation</CardTitle>
                <CardDescription>
                  Use templates or AI to help generate your proposal content
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="template">SoW Template</Label>
                    <Select 
                      value={selectedTemplate} 
                      onValueChange={handleTemplateSelect}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a template (optional)" />
                      </SelectTrigger>
                      <SelectContent>
                        {templates?.map((template) => (
                          <SelectItem key={template.id} value={template.id}>
                            {template.name} ({template.category})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>AI Generation</Label>
                    <Button 
                      type="button"
                      variant="outline" 
                      onClick={generateWithAI}
                      disabled={isGenerating}
                      className="w-full"
                    >
                      {isGenerating ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary mr-2" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <FileText className="h-4 w-4 mr-2" />
                          Generate with AI
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Status and Priority */}
        {mode !== 'view' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Status & Priority</CardTitle>
                <CardDescription>
                  Set the priority level for this proposal
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Label>Priority Level</Label>
                  <div className="flex gap-2">
                    {priorityOptions.map((option) => (
                      <Button
                        key={option.value}
                        type="button"
                        variant={watchedValues.priority === option.value ? "default" : "outline"}
                        size="sm"
                        onClick={() => setValue('priority', option.value as any)}
                        className={watchedValues.priority === option.value ? option.color : ''}
                      >
                        {option.label}
                      </Button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </form>
    </div>
  );
}
