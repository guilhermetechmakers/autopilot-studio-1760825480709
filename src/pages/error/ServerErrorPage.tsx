import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RefreshCw, Home, HelpCircle } from "lucide-react";

export default function ServerErrorPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md text-center">
        <div className="mb-8">
          <h1 className="text-6xl font-bold text-destructive mb-4">500</h1>
          <h2 className="text-2xl font-semibold mb-2">Server Error</h2>
          <p className="text-muted-foreground mb-8">
            Something went wrong on our end. We're working to fix it.
          </p>
        </div>

        <Card className="card-hover">
          <CardHeader>
            <CardTitle>Let's get you back on track</CardTitle>
            <CardDescription>Try these options to resolve the issue</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button className="w-full btn-primary">
              <RefreshCw className="mr-2 h-4 w-4" />
              Try Again
            </Button>
            <Button variant="outline" className="w-full">
              <Home className="mr-2 h-4 w-4" />
              Go to Dashboard
            </Button>
            <Button variant="ghost" className="w-full">
              <HelpCircle className="mr-2 h-4 w-4" />
              Contact Support
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}