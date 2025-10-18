import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Rocket } from "lucide-react";

export default function LaunchChecklistPage() {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Rocket className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold gradient-text">Launch Checklist & Deployment</span>
          </div>
          <p className="text-muted-foreground">QA, security, deployment management for launches</p>
        </div>
        
        <Card className="card-hover">
          <CardHeader>
            <CardTitle>Launch Management</CardTitle>
            <CardDescription>Coming soon - Launch checklist and deployment automation</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">This page will contain checklist items, deployment integrations, automated tests, and launch controls.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}