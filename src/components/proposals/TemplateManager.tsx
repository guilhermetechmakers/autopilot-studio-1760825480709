import { useState } from 'react';
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
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Copy, 
  Eye, 
  FileText,
  Globe,
  Lock
} from 'lucide-react';
import { 
  useSowTemplates, 
  useCreateTemplate, 
  useUpdateTemplate, 
  useDeleteTemplate 
} from '@/hooks/useSowTemplates';
import type { SowTemplateInsert, TemplateCategory } from '@/types/database';

// Form validation schema
const templateSchema = z.object({
  name: z.string().min(1, 'Template name is required').max(100, 'Name must be less than 100 characters'),
  description: z.string().optional(),
  category: z.enum(['ai_development', 'web_development', 'mobile_development', 'consulting', 'general']),
  is_public: z.boolean().optional(),
  is_active: z.boolean().optional(),
  version: z.string().optional(),
});

type TemplateFormData = z.infer<typeof templateSchema>;

interface TemplateManagerProps {
  onTemplateSelect?: (template: any) => void;
  mode?: 'manage' | 'select';
}

export default function TemplateManager({ 
  onTemplateSelect, 
  mode = 'manage' 
}: TemplateManagerProps) {
  const [isCreating, setIsCreating] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const { data: templates, isLoading } = useSowTemplates();
  const createTemplate = useCreateTemplate();
  const updateTemplate = useUpdateTemplate();
  const deleteTemplate = useDeleteTemplate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch
  } = useForm<TemplateFormData>({
    resolver: zodResolver(templateSchema),
    defaultValues: {
      name: '',
      description: '',
      category: 'general',
      is_public: false,
      is_active: true,
      version: '1.0.0',
    }
  });

  const watchedValues = watch();

  // Filter templates based on search and category
  const filteredTemplates = templates?.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  }) || [];

  const categoryOptions: { value: TemplateCategory; label: string }[] = [
    { value: 'ai_development', label: 'AI Development' },
    { value: 'web_development', label: 'Web Development' },
    { value: 'mobile_development', label: 'Mobile Development' },
    { value: 'consulting', label: 'Consulting' },
    { value: 'general', label: 'General' },
  ];

  const onSubmit = async (data: TemplateFormData) => {
    try {
      if (editingTemplate) {
        await updateTemplate.mutateAsync({
          id: editingTemplate.id,
          updates: data
        });
        setEditingTemplate(null);
      } else {
        const templateData: SowTemplateInsert = {
          ...data,
          user_id: 'current-user-id', // This should come from auth context
          content: {},
          variables: {},
        };
        
        await createTemplate.mutateAsync(templateData);
      }
      
      reset();
      setIsCreating(false);
    } catch (error) {
      console.error('Error saving template:', error);
    }
  };

  const handleEdit = (template: any) => {
    setEditingTemplate(template);
    setValue('name', template.name);
    setValue('description', template.description || '');
    setValue('category', template.category);
    setValue('is_public', template.is_public);
    setValue('is_active', template.is_active);
    setValue('version', template.version);
    setIsCreating(true);
  };

  const handleDelete = async (templateId: string) => {
    if (confirm('Are you sure you want to delete this template?')) {
      try {
        await deleteTemplate.mutateAsync(templateId);
      } catch (error) {
        console.error('Error deleting template:', error);
      }
    }
  };

  const handleDuplicate = (template: any) => {
    setValue('name', `${template.name} (Copy)`);
    setValue('description', template.description);
    setValue('category', template.category);
    setValue('is_public', false);
    setValue('is_active', true);
    setValue('version', '1.0.0');
    setEditingTemplate(null);
    setIsCreating(true);
  };

  const handleSelect = (template: any) => {
    if (mode === 'select') {
      onTemplateSelect?.(template);
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'ai_development': return 'bg-purple-500/20 text-purple-300 border-purple-500/30';
      case 'web_development': return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      case 'mobile_development': return 'bg-green-500/20 text-green-300 border-green-500/30';
      case 'consulting': return 'bg-orange-500/20 text-orange-300 border-orange-500/30';
      case 'general': return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
      default: return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    }
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
          <FileText className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-2xl font-bold">
              {mode === 'manage' ? 'Template Manager' : 'Select Template'}
            </h1>
            <p className="text-muted-foreground">
              {mode === 'manage' 
                ? 'Create and manage your SoW templates' 
                : 'Choose a template to use for your proposal'
              }
            </p>
          </div>
        </div>
        
        {mode === 'manage' && (
          <Button 
            onClick={() => setIsCreating(true)}
            className="btn-primary"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Template
          </Button>
        )}
      </motion.div>

      {/* Search and Filters */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="flex flex-col sm:flex-row gap-4"
      >
        <div className="relative flex-1 max-w-md">
          <Input
            placeholder="Search templates..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
          <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        </div>
        
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categoryOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </motion.div>

      {/* Template Creation/Edit Form */}
      {isCreating && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>
                {editingTemplate ? 'Edit Template' : 'Create New Template'}
              </CardTitle>
              <CardDescription>
                {editingTemplate 
                  ? 'Update the template details' 
                  : 'Fill in the details to create a new template'
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Template Name *</Label>
                    <Input
                      id="name"
                      {...register('name')}
                      placeholder="Enter template name"
                    />
                    {errors.name && (
                      <p className="text-sm text-destructive">{errors.name.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category">Category *</Label>
                    <Select 
                      value={watchedValues.category} 
                      onValueChange={(value) => setValue('category', value as TemplateCategory)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categoryOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.category && (
                      <p className="text-sm text-destructive">{errors.category.message}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    {...register('description')}
                    placeholder="Describe what this template is for"
                    rows={3}
                  />
                  {errors.description && (
                    <p className="text-sm text-destructive">{errors.description.message}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="version">Version</Label>
                    <Input
                      id="version"
                      {...register('version')}
                      placeholder="1.0.0"
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="is_public"
                      checked={watchedValues.is_public}
                      onCheckedChange={(checked) => setValue('is_public', checked)}
                    />
                    <Label htmlFor="is_public">Public Template</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="is_active"
                      checked={watchedValues.is_active}
                      onCheckedChange={(checked) => setValue('is_active', checked)}
                    />
                    <Label htmlFor="is_active">Active</Label>
                  </div>
                </div>

                <div className="flex gap-2 pt-4">
                  <Button type="submit" className="btn-primary">
                    {editingTemplate ? 'Update Template' : 'Create Template'}
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => {
                      setIsCreating(false);
                      setEditingTemplate(null);
                      reset();
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Templates Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-muted rounded w-1/2 mb-4"></div>
                <div className="h-6 bg-muted rounded w-20"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filteredTemplates.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="border-dashed">
            <CardContent className="p-12 text-center">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Templates Found</h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm || selectedCategory !== 'all' 
                  ? 'No templates match your current filters.' 
                  : 'Get started by creating your first template.'
                }
              </p>
              {mode === 'manage' && (
                <Button onClick={() => setIsCreating(true)} className="btn-primary">
                  <Plus className="h-4 w-4 mr-2" />
                  Create First Template
                </Button>
              )}
            </CardContent>
          </Card>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTemplates.map((template, index) => (
            <motion.div
              key={template.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Card 
                className={`card-hover group ${mode === 'select' ? 'cursor-pointer' : ''}`}
                onClick={() => handleSelect(template)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-lg truncate">
                        {template.name}
                      </CardTitle>
                      <CardDescription className="mt-1">
                        {template.description || 'No description'}
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-1 ml-2">
                      <Badge className={getCategoryColor(template.category)}>
                        {template.category.replace('_', ' ')}
                      </Badge>
                      {template.is_public && (
                        <Globe className="h-4 w-4 text-blue-300" />
                      )}
                      {!template.is_public && (
                        <Lock className="h-4 w-4 text-gray-400" />
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                    <span>Used {template.usage_count} times</span>
                    <span>v{template.version}</span>
                  </div>
                  
                  {mode === 'manage' ? (
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEdit(template);
                        }}
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDuplicate(template);
                        }}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(template.id);
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="flex-1">
                        <Eye className="h-4 w-4 mr-2" />
                        Preview
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSelect(template);
                        }}
                      >
                        Select
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
