import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign } from "lucide-react";

export default function BillingPage() {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <DollarSign className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold gradient-text">Billing & Invoicing</span>
          </div>
          <p className="text-muted-foreground">Manage milestone billing, time tracking, QuickBooks sync, and financials</p>
        </div>
        
        <Card className="card-hover">
          <CardHeader>
            <CardTitle>Billing Management</CardTitle>
            <CardDescription>Coming soon - Comprehensive billing and invoicing system</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">This page will contain milestone billing table, time tracking integration, invoice list, and QuickBooks sync.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}