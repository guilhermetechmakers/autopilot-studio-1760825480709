import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Bot } from "lucide-react";

export default function AIIntakePage() {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Bot className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold gradient-text">AI Intake</span>
          </div>
          <p className="text-muted-foreground">AI-assisted prospect qualification and project capture</p>
        </div>
        
        <Card className="card-hover">
          <CardHeader>
            <CardTitle>AI Intake System</CardTitle>
            <CardDescription>Coming soon - AI-powered intake process</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">This page will contain the AI intake chat interface, calendar integration, and qualification scoring system.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}