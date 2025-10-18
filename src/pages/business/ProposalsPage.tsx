import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText } from "lucide-react";

export default function ProposalsPage() {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <FileText className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold gradient-text">Proposals & SoW</span>
          </div>
          <p className="text-muted-foreground">Central area for proposal/SoW generation, signature, and approval</p>
        </div>
        
        <Card className="card-hover">
          <CardHeader>
            <CardTitle>Proposals Management</CardTitle>
            <CardDescription>Coming soon - Proposal generation and e-signature system</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">This page will contain the proposal list, editor, SoW templates, and e-signature workflow.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}