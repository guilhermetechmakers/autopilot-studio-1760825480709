import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { History } from "lucide-react";

export default function OrderHistoryPage() {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <History className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold gradient-text">Order & Transaction History</span>
          </div>
          <p className="text-muted-foreground">View and manage all payment/subscription events</p>
        </div>
        
        <Card className="card-hover">
          <CardHeader>
            <CardTitle>Transaction History</CardTitle>
            <CardDescription>Coming soon - Complete transaction and order management</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">This page will contain transactions table, filters, invoice viewer, and export functionality.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}