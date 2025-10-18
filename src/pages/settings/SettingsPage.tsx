import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Settings className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold gradient-text">Settings & Preferences</span>
          </div>
          <p className="text-muted-foreground">Manage account, workspace, branding, integrations, team, and notifications</p>
        </div>
        
        <Card className="card-hover">
          <CardHeader>
            <CardTitle>Settings Management</CardTitle>
            <CardDescription>Coming soon - Comprehensive settings and preferences system</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">This page will contain workspace settings, team management, integrations panel, and notification preferences.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}