import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield } from "lucide-react";

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Shield className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold gradient-text">Privacy Policy</span>
          </div>
          <p className="text-muted-foreground">Legal data handling and user rights</p>
        </div>
        
        <Card className="card-hover">
          <CardHeader>
            <CardTitle>Privacy Policy</CardTitle>
            <CardDescription>Coming soon - Comprehensive privacy policy and data handling information</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">This page will contain policy text, data subject rights, and contact forms.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}