import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Package } from "lucide-react";

export default function HandoverPackPage() {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Package className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold gradient-text">Handover Pack</span>
          </div>
          <p className="text-muted-foreground">One-click generation of project deliverables and post-launch plans</p>
        </div>
        
        <Card className="card-hover">
          <CardHeader>
            <CardTitle>Handover Pack Generator</CardTitle>
            <CardDescription>Coming soon - Automated handover pack generation system</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">This page will contain handover generator, asset selection, one-click export, and SLA management.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}