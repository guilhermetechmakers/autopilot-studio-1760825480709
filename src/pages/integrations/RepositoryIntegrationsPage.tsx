import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Github } from "lucide-react";

export default function RepositoryIntegrationsPage() {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Github className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold gradient-text">Repository Integrations</span>
          </div>
          <p className="text-muted-foreground">Connect and manage code repositories and deployments</p>
        </div>
        
        <Card className="card-hover">
          <CardHeader>
            <CardTitle>Repository Integrations</CardTitle>
            <CardDescription>Coming soon - Repository connection and management system</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">This page will contain integration list, OAuth connections, repo mapping, and webhook status.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}