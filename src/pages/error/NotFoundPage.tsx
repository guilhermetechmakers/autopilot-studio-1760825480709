import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Home, Search } from "lucide-react";

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md text-center">
        <div className="mb-8">
          <h1 className="text-6xl font-bold text-primary mb-4">404</h1>
          <h2 className="text-2xl font-semibold mb-2">Page Not Found</h2>
          <p className="text-muted-foreground mb-8">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>

        <Card className="card-hover">
          <CardHeader>
            <CardTitle>What would you like to do?</CardTitle>
            <CardDescription>Here are some helpful options</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button className="w-full btn-primary">
              <Home className="mr-2 h-4 w-4" />
              Go to Dashboard
            </Button>
            <Button variant="outline" className="w-full">
              <Search className="mr-2 h-4 w-4" />
              Search
            </Button>
            <Button variant="ghost" className="w-full">
              Contact Support
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}