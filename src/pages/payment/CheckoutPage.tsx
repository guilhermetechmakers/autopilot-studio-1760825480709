import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CreditCard } from "lucide-react";

export default function CheckoutPage() {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <CreditCard className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold gradient-text">Checkout & Payment</span>
          </div>
          <p className="text-muted-foreground">Subscription/add-on purchase and payment</p>
        </div>
        
        <Card className="card-hover">
          <CardHeader>
            <CardTitle>Payment Processing</CardTitle>
            <CardDescription>Coming soon - Secure payment and subscription management</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">This page will contain plan selector, add-on selector, payment form, and invoice preview.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}