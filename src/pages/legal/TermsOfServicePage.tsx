import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText } from "lucide-react";

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <FileText className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold gradient-text">Terms of Service</span>
          </div>
          <p className="text-muted-foreground">Legal terms for service use</p>
        </div>
        
        <Card className="card-hover">
          <CardHeader>
            <CardTitle>Terms of Service</CardTitle>
            <CardDescription>Coming soon - Complete terms of service and legal agreements</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">This page will contain TOS text and accept CTA.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}