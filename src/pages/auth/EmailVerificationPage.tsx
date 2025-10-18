import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Bot, Mail } from "lucide-react";

export default function EmailVerificationPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Bot className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold gradient-text">Autopilot Studio</span>
          </div>
          <p className="text-muted-foreground">Verify your email address</p>
        </div>

        <Card className="card-hover">
          <CardHeader className="space-y-1 text-center">
            <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <Mail className="h-6 w-6 text-primary" />
            </div>
            <CardTitle className="text-2xl">Check your email</CardTitle>
            <CardDescription>
              We've sent a verification link to your email address. Please check your inbox and click the link to verify your account.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button className="w-full btn-primary">
              Resend Verification Email
            </Button>
            <div className="text-center text-sm text-muted-foreground">
              Didn't receive the email? Check your spam folder or{" "}
              <a href="/support" className="text-primary hover:underline">
                contact support
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}