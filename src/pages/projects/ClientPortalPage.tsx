import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users } from "lucide-react";

export default function ClientPortalPage() {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Users className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold gradient-text">Client Portal</span>
          </div>
          <p className="text-muted-foreground">Client-facing view for updates, approvals, and shared resources</p>
        </div>
        
        <Card className="card-hover">
          <CardHeader>
            <CardTitle>Client Portal</CardTitle>
            <CardDescription>Coming soon - Client collaboration and approval system</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">This page will contain project summary, deliverables feed, feedback capture, and shared assets.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}