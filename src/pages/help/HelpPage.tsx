import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { HelpCircle } from "lucide-react";

export default function HelpPage() {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <HelpCircle className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold gradient-text">Help & Support</span>
          </div>
          <p className="text-muted-foreground">Product docs, API, tutorials, support</p>
        </div>
        
        <Card className="card-hover">
          <CardHeader>
            <CardTitle>Help Center</CardTitle>
            <CardDescription>Coming soon - Comprehensive help and documentation system</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">This page will contain docs index, tutorials, API docs, FAQ, and contact support.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}