import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FolderOpen } from "lucide-react";

export default function ProjectSpacePage() {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <FolderOpen className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold gradient-text">Project Space</span>
          </div>
          <p className="text-muted-foreground">Project-specific workspace post-contract for execution</p>
        </div>
        
        <Card className="card-hover">
          <CardHeader>
            <CardTitle>Project Workspace</CardTitle>
            <CardDescription>Coming soon - Project management and execution tools</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">This page will contain project header, milestones timeline, task board, repo integrations, and AI copilot sidebar.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}