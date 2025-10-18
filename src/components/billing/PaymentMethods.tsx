import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  CreditCard, 
  Plus, 
  Edit, 
  Trash2, 
  CheckCircle,
  AlertCircle,
  Shield,
  Calendar,
  Settings,
  ExternalLink
} from 'lucide-react';

interface PaymentMethod {
  id: string;
  type: 'card' | 'bank' | 'paypal' | 'stripe';
  name: string;
  last4: string;
  brand?: string;
  expiry?: string;
  isDefault: boolean;
  status: 'active' | 'inactive' | 'expired';
}

// Sample payment methods data
const samplePaymentMethods: PaymentMethod[] = [
  {
    id: '1',
    type: 'card',
    name: 'Visa ending in 4242',
    last4: '4242',
    brand: 'Visa',
    expiry: '12/25',
    isDefault: true,
    status: 'active',
  },
  {
    id: '2',
    type: 'card',
    name: 'Mastercard ending in 5555',
    last4: '5555',
    brand: 'Mastercard',
    expiry: '08/26',
    isDefault: false,
    status: 'active',
  },
  {
    id: '3',
    type: 'bank',
    name: 'Bank Account ending in 1234',
    last4: '1234',
    isDefault: false,
    status: 'active',
  },
];

const statusColors = {
  active: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
  inactive: 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400',
  expired: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400',
};

const typeIcons = {
  card: <CreditCard className="h-4 w-4" />,
  bank: <Shield className="h-4 w-4" />,
  paypal: <ExternalLink className="h-4 w-4" />,
  stripe: <CreditCard className="h-4 w-4" />,
};

export const PaymentMethods: React.FC = () => {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>(samplePaymentMethods);
  const [isAddingMethod, setIsAddingMethod] = useState(false);
  const [newMethod, setNewMethod] = useState({
    type: 'card' as PaymentMethod['type'],
    name: '',
    last4: '',
    brand: '',
    expiry: '',
  });

  const handleAddMethod = () => {
    if (newMethod.name && newMethod.last4) {
      const method: PaymentMethod = {
        id: Date.now().toString(),
        type: newMethod.type,
        name: newMethod.name,
        last4: newMethod.last4,
        brand: newMethod.brand,
        expiry: newMethod.expiry,
        isDefault: paymentMethods.length === 0,
        status: 'active',
      };
      setPaymentMethods([...paymentMethods, method]);
      setNewMethod({ type: 'card', name: '', last4: '', brand: '', expiry: '' });
      setIsAddingMethod(false);
    }
  };

  const handleSetDefault = (id: string) => {
    setPaymentMethods(methods =>
      methods.map(method => ({
        ...method,
        isDefault: method.id === id,
      }))
    );
  };

  const handleDeleteMethod = (id: string) => {
    if (window.confirm('Are you sure you want to delete this payment method?')) {
      setPaymentMethods(methods => methods.filter(method => method.id !== id));
    }
  };

  const handleToggleStatus = (id: string) => {
    setPaymentMethods(methods =>
      methods.map(method =>
        method.id === id
          ? { ...method, status: method.status === 'active' ? 'inactive' : 'active' }
          : method
      )
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      {/* Payment Methods Overview */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Payment Methods
              </CardTitle>
              <CardDescription>
                Manage payment methods and billing settings
              </CardDescription>
            </div>
            <Button onClick={() => setIsAddingMethod(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Method
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="text-center">
              <div className="text-2xl font-bold">{paymentMethods.length}</div>
              <div className="text-sm text-muted-foreground">Total Methods</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {paymentMethods.filter(m => m.status === 'active').length}
              </div>
              <div className="text-sm text-muted-foreground">Active</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">
                {paymentMethods.filter(m => m.isDefault).length}
              </div>
              <div className="text-sm text-muted-foreground">Default</div>
            </div>
          </div>

          {/* Payment Methods Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Method</TableHead>
                  <TableHead>Details</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Default</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paymentMethods.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                      No payment methods found
                    </TableCell>
                  </TableRow>
                ) : (
                  paymentMethods.map((method) => (
                    <motion.tr
                      key={method.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.2 }}
                      className="hover:bg-muted/50 transition-colors"
                    >
                      <TableCell>
                        <div className="flex items-center gap-3">
                          {typeIcons[method.type]}
                          <div>
                            <div className="font-medium">{method.name}</div>
                            <div className="text-sm text-muted-foreground">
                              {method.brand && `${method.brand} • `}
                              ****{method.last4}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {method.expiry && (
                            <div className="flex items-center gap-1 text-muted-foreground">
                              <Calendar className="h-3 w-3" />
                              Expires {method.expiry}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={statusColors[method.status]}>
                          <span className="flex items-center gap-1">
                            {method.status === 'active' ? (
                              <CheckCircle className="h-3 w-3" />
                            ) : (
                              <AlertCircle className="h-3 w-3" />
                            )}
                            {method.status.charAt(0).toUpperCase() + method.status.slice(1)}
                          </span>
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Switch
                          checked={method.isDefault}
                          onCheckedChange={() => handleSetDefault(method.id)}
                        />
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleToggleStatus(method.id)}
                          >
                            <Settings className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {/* TODO: Implement edit */}}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteMethod(method.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </motion.tr>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Add Payment Method Form */}
      {isAddingMethod && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Add Payment Method</CardTitle>
              <CardDescription>
                Add a new payment method to your account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="type">Payment Type</Label>
                    <Select
                      value={newMethod.type}
                      onValueChange={(value: PaymentMethod['type']) =>
                        setNewMethod({ ...newMethod, type: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="card">Credit/Debit Card</SelectItem>
                        <SelectItem value="bank">Bank Account</SelectItem>
                        <SelectItem value="paypal">PayPal</SelectItem>
                        <SelectItem value="stripe">Stripe</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="name">Display Name</Label>
                    <Input
                      id="name"
                      placeholder="e.g., My Visa Card"
                      value={newMethod.name}
                      onChange={(e) => setNewMethod({ ...newMethod, name: e.target.value })}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="last4">Last 4 Digits</Label>
                    <Input
                      id="last4"
                      placeholder="1234"
                      value={newMethod.last4}
                      onChange={(e) => setNewMethod({ ...newMethod, last4: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="brand">Card Brand</Label>
                    <Input
                      id="brand"
                      placeholder="Visa, Mastercard, etc."
                      value={newMethod.brand}
                      onChange={(e) => setNewMethod({ ...newMethod, brand: e.target.value })}
                    />
                  </div>
                </div>
                {newMethod.type === 'card' && (
                  <div>
                    <Label htmlFor="expiry">Expiry Date</Label>
                    <Input
                      id="expiry"
                      placeholder="MM/YY"
                      value={newMethod.expiry}
                      onChange={(e) => setNewMethod({ ...newMethod, expiry: e.target.value })}
                    />
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Button onClick={handleAddMethod}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Method
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setIsAddingMethod(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Billing Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Billing Settings</CardTitle>
          <CardDescription>
            Configure billing preferences and payment processing
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Auto-pay</div>
                <div className="text-sm text-muted-foreground">
                  Automatically charge the default payment method
                </div>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Email receipts</div>
                <div className="text-sm text-muted-foreground">
                  Send email receipts for all payments
                </div>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Payment reminders</div>
                <div className="text-sm text-muted-foreground">
                  Send reminders for overdue payments
                </div>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Stripe integration</div>
                <div className="text-sm text-muted-foreground">
                  Process payments through Stripe
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Connected
                </Badge>
                <Button variant="ghost" size="sm">
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};