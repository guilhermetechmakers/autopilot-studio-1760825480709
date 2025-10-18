import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Bot, Github, Mail, CheckCircle } from "lucide-react";

export default function SignupPage() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    company: "",
    role: "",
    teamSize: "",
  });
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [isIndividual, setIsIndividual] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle signup logic
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Bot className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold gradient-text">Autopilot Studio</span>
          </div>
          <p className="text-muted-foreground">Create your account</p>
        </div>

        <Card className="card-hover">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">Get started</CardTitle>
            <CardDescription className="text-center">
              Choose your account type and fill in your details
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Account Type Toggle */}
            <div className="flex space-x-4">
              <Button
                type="button"
                variant={isIndividual ? "default" : "outline"}
                className="flex-1"
                onClick={() => setIsIndividual(true)}
              >
                Individual
              </Button>
              <Button
                type="button"
                variant={!isIndividual ? "default" : "outline"}
                className="flex-1"
                onClick={() => setIsIndividual(false)}
              >
                Team
              </Button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  type="text"
                  placeholder="Enter your full name"
                  value={formData.fullName}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange("fullName", e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange("email", e.target.value)}
                  required
                />
              </div>

              {!isIndividual && (
                <div className="space-y-2">
                  <Label htmlFor="company">Company Name</Label>
                  <Input
                    id="company"
                    type="text"
                    placeholder="Enter your company name"
                    value={formData.company}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange("company", e.target.value)}
                    required={!isIndividual}
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Select onValueChange={(value: string) => handleInputChange("role", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="founder">Founder/CEO</SelectItem>
                    <SelectItem value="cto">CTO</SelectItem>
                    <SelectItem value="pm">Project Manager</SelectItem>
                    <SelectItem value="developer">Developer</SelectItem>
                    <SelectItem value="designer">Designer</SelectItem>
                    <SelectItem value="consultant">Consultant</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {!isIndividual && (
                <div className="space-y-2">
                  <Label htmlFor="teamSize">Team Size</Label>
                  <Select onValueChange={(value: string) => handleInputChange("teamSize", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select team size" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2-5">2-5 people</SelectItem>
                      <SelectItem value="6-10">6-10 people</SelectItem>
                      <SelectItem value="11-25">11-25 people</SelectItem>
                      <SelectItem value="26-50">26-50 people</SelectItem>
                      <SelectItem value="50+">50+ people</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Create a password"
                  value={formData.password}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange("password", e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange("confirmPassword", e.target.value)}
                  required
                />
              </div>

              <div className="space-y-4">
                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="terms"
                    checked={agreeToTerms}
                    onCheckedChange={(checked: boolean) => setAgreeToTerms(checked)}
                  />
                  <div className="grid gap-1.5 leading-none">
                    <Label
                      htmlFor="terms"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      I agree to the{" "}
                      <Link to="/terms" className="text-primary hover:underline">
                        Terms of Service
                      </Link>{" "}
                      and{" "}
                      <Link to="/privacy" className="text-primary hover:underline">
                        Privacy Policy
                      </Link>
                    </Label>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <CheckCircle className="h-4 w-4 text-accent" />
                    <span>2FA will be enabled for security</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <CheckCircle className="h-4 w-4 text-accent" />
                    <span>Email verification required</span>
                  </div>
                </div>
              </div>

              <Button type="submit" className="w-full btn-primary" disabled={!agreeToTerms}>
                Create Account
              </Button>
            </form>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator className="w-full" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Or continue with
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Button variant="outline" className="w-full">
                <Github className="mr-2 h-4 w-4" />
                GitHub
              </Button>
              <Button variant="outline" className="w-full">
                <Mail className="mr-2 h-4 w-4" />
                Google
              </Button>
            </div>

            <div className="text-center text-sm">
              Already have an account?{" "}
              <Link to="/login" className="text-primary hover:underline">
                Sign in
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}