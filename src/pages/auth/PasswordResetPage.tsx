import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Bot } from "lucide-react";

export default function PasswordResetPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Bot className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold gradient-text">Autopilot Studio</span>
          </div>
          <p className="text-muted-foreground">Reset your password</p>
        </div>

        <Card className="card-hover">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">Forgot Password?</CardTitle>
            <CardDescription className="text-center">
              Enter your email address and we'll send you a reset link
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                required
              />
            </div>
            <Button className="w-full btn-primary">
              Send Reset Link
            </Button>
            <div className="text-center text-sm">
              Remember your password?{" "}
              <a href="/login" className="text-primary hover:underline">
                Sign in
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}