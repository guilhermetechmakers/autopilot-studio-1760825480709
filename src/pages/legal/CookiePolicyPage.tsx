import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Cookie } from "lucide-react";

export default function CookiePolicyPage() {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Cookie className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold gradient-text">Cookie Policy</span>
          </div>
          <p className="text-muted-foreground">Cookie usage and consent management</p>
        </div>
        
        <Card className="card-hover">
          <CardHeader>
            <CardTitle>Cookie Policy</CardTitle>
            <CardDescription>Coming soon - Cookie usage and consent management information</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">This page will contain policy details and consent manager link.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}