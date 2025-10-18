import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock } from "lucide-react";

export default function TimeTrackingPage() {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Clock className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold gradient-text">Time Tracking</span>
          </div>
          <p className="text-muted-foreground">Time entry, reporting, and billing integration</p>
        </div>
        
        <Card className="card-hover">
          <CardHeader>
            <CardTitle>Time Tracking</CardTitle>
            <CardDescription>Coming soon - Comprehensive time tracking and reporting system</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">This page will contain timer controls, timesheet view, billable rates, and export functionality.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}