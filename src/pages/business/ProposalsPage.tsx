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
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  FileText, 
  Plus, 
  Search, 
  Filter, 
  MoreHorizontal,
  Send,
  Edit,
  Trash2,
  Eye,
  Download,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';
import { useProposals } from '@/hooks/useProposals';
import { useSowTemplates } from '@/hooks/useSowTemplates';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

export default function ProposalsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedTab, setSelectedTab] = useState('proposals');
  
  const { data: proposals, isLoading: proposalsLoading, error: proposalsError } = useProposals();
  const { data: templates, isLoading: templatesLoading } = useSowTemplates();

  // Filter proposals based on search and status
  const filteredProposals = proposals?.filter(proposal => {
    const matchesSearch = proposal.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         proposal.client_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         proposal.client_email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = selectedStatus === 'all' || proposal.status === selectedStatus;
    
    return matchesSearch && matchesStatus;
  }) || [];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
      case 'sent': return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      case 'under_review': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
      case 'approved': return 'bg-green-500/20 text-green-300 border-green-500/30';
      case 'signed': return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
      case 'rejected': return 'bg-red-500/20 text-red-300 border-red-500/30';
      case 'cancelled': return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
      default: return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    }
  };

  const getESignStatusColor = (esignStatus: string) => {
    switch (esignStatus) {
      case 'not_sent': return 'bg-gray-500/20 text-gray-300';
      case 'sent': return 'bg-blue-500/20 text-blue-300';
      case 'viewed': return 'bg-yellow-500/20 text-yellow-300';
      case 'signed': return 'bg-green-500/20 text-green-300';
      case 'declined': return 'bg-red-500/20 text-red-300';
      case 'expired': return 'bg-orange-500/20 text-orange-300';
      default: return 'bg-gray-500/20 text-gray-300';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'draft': return <Edit className="h-3 w-3" />;
      case 'sent': return <Send className="h-3 w-3" />;
      case 'under_review': return <Clock className="h-3 w-3" />;
      case 'approved': return <CheckCircle className="h-3 w-3" />;
      case 'signed': return <CheckCircle className="h-3 w-3" />;
      case 'rejected': return <XCircle className="h-3 w-3" />;
      case 'cancelled': return <AlertCircle className="h-3 w-3" />;
      default: return <Edit className="h-3 w-3" />;
    }
  };

  if (proposalsError) {
    return (
      <div className="min-h-screen bg-background p-8">
        <div className="container mx-auto max-w-6xl">
          <Card className="border-destructive/50">
            <CardContent className="p-8 text-center">
              <XCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Error Loading Proposals</h3>
              <p className="text-muted-foreground">
                There was an error loading your proposals. Please try again.
              </p>
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
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center space-x-2 mb-4">
            <FileText className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold gradient-text">Proposals & SoW</span>
          </div>
          <p className="text-muted-foreground">
            Manage your proposals, SoW templates, and e-signature workflows
          </p>
        </motion.div>

        {/* Tabs */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="proposals">Proposals</TabsTrigger>
            <TabsTrigger value="templates">SoW Templates</TabsTrigger>
          </TabsList>

          {/* Proposals Tab */}
          <TabsContent value="proposals" className="space-y-6">
            {/* Search and Filters */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="flex flex-col sm:flex-row gap-4 items-center justify-between"
            >
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search proposals..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <div className="flex gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Filter className="h-4 w-4 mr-2" />
                      Status: {selectedStatus === 'all' ? 'All' : selectedStatus.replace('_', ' ')}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => setSelectedStatus('all')}>
                      All Status
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => setSelectedStatus('draft')}>
                      Draft
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSelectedStatus('sent')}>
                      Sent
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSelectedStatus('under_review')}>
                      Under Review
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSelectedStatus('approved')}>
                      Approved
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSelectedStatus('signed')}>
                      Signed
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSelectedStatus('rejected')}>
                      Rejected
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <Button className="btn-primary">
                  <Plus className="h-4 w-4 mr-2" />
                  New Proposal
                </Button>
              </div>
            </motion.div>

            {/* Proposals List */}
            {proposalsLoading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <Card key={i} className="animate-pulse">
                    <CardContent className="p-6">
                      <div className="h-4 bg-muted rounded w-1/4 mb-2"></div>
                      <div className="h-3 bg-muted rounded w-1/2 mb-4"></div>
                      <div className="flex justify-between items-center">
                        <div className="h-3 bg-muted rounded w-1/3"></div>
                        <div className="h-6 bg-muted rounded w-16"></div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : filteredProposals.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="border-dashed">
                  <CardContent className="p-12 text-center">
                    <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No Proposals Found</h3>
                    <p className="text-muted-foreground mb-4">
                      {searchTerm || selectedStatus !== 'all' 
                        ? 'No proposals match your current filters.' 
                        : 'Get started by creating your first proposal.'
                      }
                    </p>
                    <Button className="btn-primary">
                      <Plus className="h-4 w-4 mr-2" />
                      Create First Proposal
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ) : (
              <div className="space-y-4">
                {filteredProposals.map((proposal, index) => (
                  <motion.div
                    key={proposal.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <Card className="card-hover group">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-lg font-semibold truncate">
                                {proposal.title}
                              </h3>
                              <Badge className={cn("text-xs", getStatusColor(proposal.status))}>
                                {getStatusIcon(proposal.status)}
                                <span className="ml-1 capitalize">
                                  {proposal.status.replace('_', ' ')}
                                </span>
                              </Badge>
                              {proposal.esign_status !== 'not_sent' && (
                                <Badge className={cn("text-xs", getESignStatusColor(proposal.esign_status))}>
                                  E-Sign: {proposal.esign_status.replace('_', ' ')}
                                </Badge>
                              )}
                            </div>
                            
                            <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
                              {proposal.description || 'No description provided'}
                            </p>
                            
                            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <span className="font-medium">Client:</span>
                                <span>{proposal.client_name}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <span className="font-medium">Value:</span>
                                <span className="font-semibold text-foreground">
                                  {proposal.currency} {proposal.total_value.toLocaleString()}
                                </span>
                              </div>
                              <div className="flex items-center gap-1">
                                <span className="font-medium">Created:</span>
                                <span>{format(new Date(proposal.created_at), 'MMM d, yyyy')}</span>
                              </div>
                              {proposal.sent_at && (
                                <div className="flex items-center gap-1">
                                  <span className="font-medium">Sent:</span>
                                  <span>{format(new Date(proposal.sent_at), 'MMM d, yyyy')}</span>
                                </div>
                              )}
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2 ml-4">
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem>
                                  <Send className="h-4 w-4 mr-2" />
                                  Send for Review
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Download className="h-4 w-4 mr-2" />
                                  Download PDF
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="text-destructive">
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Templates Tab */}
          <TabsContent value="templates" className="space-y-6">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="flex flex-col sm:flex-row gap-4 items-center justify-between"
            >
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search templates..."
                  className="pl-10"
                />
              </div>
              
              <Button className="btn-primary">
                <Plus className="h-4 w-4 mr-2" />
                New Template
              </Button>
            </motion.div>

            {templatesLoading ? (
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
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {templates?.map((template, index) => (
                  <motion.div
                    key={template.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <Card className="card-hover group">
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
                          <Badge variant="outline" className="ml-2">
                            {template.category.replace('_', ' ')}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                          <span>Used {template.usage_count} times</span>
                          <span>v{template.version}</span>
                        </div>
                        <div className="flex gap-2 mt-4">
                          <Button variant="outline" size="sm" className="flex-1">
                            <Eye className="h-4 w-4 mr-2" />
                            View
                          </Button>
                          <Button variant="outline" size="sm" className="flex-1">
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
