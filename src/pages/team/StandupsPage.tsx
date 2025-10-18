import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users } from "lucide-react";

export default function StandupsPage() {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Users className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold gradient-text">Standups & Status Reports</span>
          </div>
          <p className="text-muted-foreground">Automate standups/status, distribute to teams</p>
        </div>
        
        <Card className="card-hover">
          <CardHeader>
            <CardTitle>Team Standups</CardTitle>
            <CardDescription>Coming soon - Automated standup and status report system</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">This page will contain standup settings, auto-summary feed, report builder, and send controls.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}