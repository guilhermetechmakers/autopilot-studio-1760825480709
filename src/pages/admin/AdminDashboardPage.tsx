import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield } from "lucide-react";

export default function AdminDashboardPage() {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Shield className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold gradient-text">Admin Dashboard</span>
          </div>
          <p className="text-muted-foreground">Workspace/multi-tenant admin controls and analytics</p>
        </div>
        
        <Card className="card-hover">
          <CardHeader>
            <CardTitle>Admin Controls</CardTitle>
            <CardDescription>Coming soon - Administrative dashboard and controls</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">This page will contain user management, workspace metrics, integration health, and audit logs.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}