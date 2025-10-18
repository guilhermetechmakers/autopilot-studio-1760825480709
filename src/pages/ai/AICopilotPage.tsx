import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Bot } from "lucide-react";

export default function AICopilotPage() {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Bot className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold gradient-text">AI Copilot Workspace</span>
          </div>
          <p className="text-muted-foreground">Dedicated AI artifact generation and workflow</p>
        </div>
        
        <Card className="card-hover">
          <CardHeader>
            <CardTitle>AI Copilot</CardTitle>
            <CardDescription>Coming soon - AI artifact generation and workflow management</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">This page will contain the copilot prompt console, drafts list, approval workflow, and usage tracking.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}