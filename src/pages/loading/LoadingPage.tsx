import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

export default function LoadingPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md text-center">
        <Card className="card-hover">
          <CardHeader>
            <div className="flex justify-center mb-4">
              <Loader2 className="h-12 w-12 text-primary animate-spin" />
            </div>
            <CardTitle>Loading...</CardTitle>
            <CardDescription>Please wait while we process your request</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="w-full bg-muted rounded-full h-2 mb-4">
              <div className="bg-primary h-2 rounded-full animate-pulse" style={{ width: '60%' }} />
            </div>
            <p className="text-sm text-muted-foreground">
              This may take a few moments
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}