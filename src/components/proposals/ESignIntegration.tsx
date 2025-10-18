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
import { Label } from '@/components/ui/label';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { 
  Send, 
  Clock, 
  CheckCircle, 
  XCircle,
  FileText,
  Mail,
  Eye,
  ExternalLink,
  RefreshCw
} from 'lucide-react';
import { useUpdateESignStatus } from '@/hooks/useProposals';
import type { ESignProvider, ESignDocumentStatus } from '@/types/database';

interface ESignIntegrationProps {
  proposalId: string;
  currentStatus: ESignDocumentStatus;
  provider?: ESignProvider;
  documentId?: string;
  envelopeId?: string;
  recipients?: any[];
  expiresAt?: string;
  signedAt?: string;
  signedBy?: string;
  onStatusUpdate?: (status: ESignDocumentStatus) => void;
}

export default function ESignIntegration({
  proposalId,
  currentStatus,
  provider = 'docusign',
  documentId,
  envelopeId,
  recipients = [],
  expiresAt,
  signedAt,
  signedBy,
  onStatusUpdate
}: ESignIntegrationProps) {
  const [isSending, setIsSending] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [newRecipients, setNewRecipients] = useState(recipients);
  
  const updateESignStatus = useUpdateESignStatus();

  const getStatusColor = (status: ESignDocumentStatus) => {
    switch (status) {
      case 'created': return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
      case 'sent': return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      case 'delivered': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
      case 'viewed': return 'bg-orange-500/20 text-orange-300 border-orange-500/30';
      case 'signed': return 'bg-green-500/20 text-green-300 border-green-500/30';
      case 'declined': return 'bg-red-500/20 text-red-300 border-red-500/30';
      case 'expired': return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
      case 'cancelled': return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
      default: return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    }
  };

  const getStatusIcon = (status: ESignDocumentStatus) => {
    switch (status) {
      case 'created': return <FileText className="h-3 w-3" />;
      case 'sent': return <Send className="h-3 w-3" />;
      case 'delivered': return <Mail className="h-3 w-3" />;
      case 'viewed': return <Eye className="h-3 w-3" />;
      case 'signed': return <CheckCircle className="h-3 w-3" />;
      case 'declined': return <XCircle className="h-3 w-3" />;
      case 'expired': return <Clock className="h-3 w-3" />;
      case 'cancelled': return <XCircle className="h-3 w-3" />;
      default: return <FileText className="h-3 w-3" />;
    }
  };

  const handleSendForSignature = async () => {
    setIsSending(true);
    try {
      // Simulate API call to send for signature
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      await updateESignStatus.mutateAsync({
        id: proposalId,
        esignStatus: 'sent',
        metadata: {
          sent_at: new Date().toISOString(),
          recipients: newRecipients
        }
      });
      
      onStatusUpdate?.('sent');
    } catch (error) {
      console.error('Error sending for signature:', error);
    } finally {
      setIsSending(false);
    }
  };

  const handleRefreshStatus = async () => {
    setIsRefreshing(true);
    try {
      // Simulate API call to refresh status
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real implementation, this would fetch the latest status from the e-sign provider
      console.log('Refreshing e-sign status...');
    } catch (error) {
      console.error('Error refreshing status:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleCancelSignature = async () => {
    try {
      await updateESignStatus.mutateAsync({
        id: proposalId,
        esignStatus: 'cancelled',
        metadata: {
          cancelled_at: new Date().toISOString()
        }
      });
      
      onStatusUpdate?.('cancelled');
    } catch (error) {
      console.error('Error cancelling signature:', error);
    }
  };

  const addRecipient = () => {
    setNewRecipients([...newRecipients, { email: '', name: '', role: 'signer' }]);
  };

  const removeRecipient = (index: number) => {
    setNewRecipients(newRecipients.filter((_, i) => i !== index));
  };

  const updateRecipient = (index: number, field: string, value: string) => {
    const updated = [...newRecipients];
    updated[index] = { ...updated[index], [field]: value };
    setNewRecipients(updated);
  };

  const providerOptions = [
    { value: 'docusign', label: 'DocuSign', description: 'Most popular e-signature platform' },
    { value: 'hellosign', label: 'HelloSign', description: 'Simple and user-friendly' },
    { value: 'adobe_sign', label: 'Adobe Sign', description: 'Enterprise-grade solution' },
  ];

  return (
    <div className="space-y-6">
      {/* Status Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              E-Signature Status
            </CardTitle>
            <CardDescription>
              Current status of the e-signature process
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Badge className={getStatusColor(currentStatus)}>
                  {getStatusIcon(currentStatus)}
                  <span className="ml-1 capitalize">
                    {currentStatus.replace('_', ' ')}
                  </span>
                </Badge>
                {provider && (
                  <Badge variant="outline">
                    {providerOptions.find(p => p.value === provider)?.label}
                  </Badge>
                )}
              </div>
              
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefreshStatus}
                disabled={isRefreshing}
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>

            {currentStatus === 'signed' && signedAt && (
              <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                <div className="flex items-center gap-2 text-green-300">
                  <CheckCircle className="h-4 w-4" />
                  <span className="font-medium">Document Signed Successfully</span>
                </div>
                <p className="text-sm text-green-200 mt-1">
                  Signed by {signedBy} on {new Date(signedAt).toLocaleDateString()}
                </p>
              </div>
            )}

            {currentStatus === 'expired' && expiresAt && (
              <div className="p-3 bg-orange-500/10 border border-orange-500/20 rounded-lg">
                <div className="flex items-center gap-2 text-orange-300">
                  <Clock className="h-4 w-4" />
                  <span className="font-medium">Signature Expired</span>
                </div>
                <p className="text-sm text-orange-200 mt-1">
                  Expired on {new Date(expiresAt).toLocaleDateString()}
                </p>
              </div>
            )}

            {currentStatus === 'declined' && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                <div className="flex items-center gap-2 text-red-300">
                  <XCircle className="h-4 w-4" />
                  <span className="font-medium">Signature Declined</span>
                </div>
                <p className="text-sm text-red-200 mt-1">
                  The recipient declined to sign the document
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* E-Signature Actions */}
      {currentStatus === 'created' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Send for Signature</CardTitle>
              <CardDescription>
                Configure recipients and send the document for e-signature
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Provider Selection */}
              <div className="space-y-2">
                <Label>E-Signature Provider</Label>
                <Select defaultValue={provider}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select provider" />
                  </SelectTrigger>
                  <SelectContent>
                    {providerOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        <div>
                          <div className="font-medium">{option.label}</div>
                          <div className="text-sm text-muted-foreground">{option.description}</div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Recipients */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>Recipients</Label>
                  <Button variant="outline" size="sm" onClick={addRecipient}>
                    Add Recipient
                  </Button>
                </div>
                
                {newRecipients.map((recipient, index) => (
                  <div key={index} className="flex gap-2 items-end">
                    <div className="flex-1 grid grid-cols-2 gap-2">
                      <Input
                        placeholder="Name"
                        value={recipient.name}
                        onChange={(e) => updateRecipient(index, 'name', e.target.value)}
                      />
                      <Input
                        placeholder="Email"
                        type="email"
                        value={recipient.email}
                        onChange={(e) => updateRecipient(index, 'email', e.target.value)}
                      />
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => removeRecipient(index)}
                    >
                      Remove
                    </Button>
                  </div>
                ))}
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-4">
                <Button
                  onClick={handleSendForSignature}
                  disabled={isSending || newRecipients.length === 0}
                  className="btn-primary"
                >
                  <Send className="h-4 w-4 mr-2" />
                  {isSending ? 'Sending...' : 'Send for Signature'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Active Signature Process */}
      {(currentStatus === 'sent' || currentStatus === 'delivered' || currentStatus === 'viewed') && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Signature in Progress</CardTitle>
              <CardDescription>
                The document has been sent and is awaiting signature
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Document ID:</span>
                  <span className="font-mono">{documentId || 'N/A'}</span>
                </div>
                {envelopeId && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Envelope ID:</span>
                    <span className="font-mono">{envelopeId}</span>
                  </div>
                )}
                {expiresAt && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Expires:</span>
                    <span>{new Date(expiresAt).toLocaleDateString()}</span>
                  </div>
                )}
              </div>

              <div className="flex gap-2">
                <Button variant="outline" onClick={handleRefreshStatus}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh Status
                </Button>
                <Button variant="outline" onClick={handleCancelSignature}>
                  <XCircle className="h-4 w-4 mr-2" />
                  Cancel Signature
                </Button>
                {documentId && (
                  <Button variant="outline">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    View in {providerOptions.find(p => p.value === provider)?.label}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Completed Signature */}
      {currentStatus === 'signed' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-300">
                <CheckCircle className="h-5 w-5" />
                Signature Complete
              </CardTitle>
              <CardDescription>
                The document has been successfully signed
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Signed by:</span>
                  <span>{signedBy || 'Unknown'}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Signed on:</span>
                  <span>{signedAt ? new Date(signedAt).toLocaleDateString() : 'Unknown'}</span>
                </div>
              </div>

              <div className="flex gap-2">
                <Button variant="outline">
                  <FileText className="h-4 w-4 mr-2" />
                  Download Signed Document
                </Button>
                <Button variant="outline">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  View in {providerOptions.find(p => p.value === provider)?.label}
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}
