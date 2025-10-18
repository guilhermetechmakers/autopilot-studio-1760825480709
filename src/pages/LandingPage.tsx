import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowRight, 
  Bot, 
  FileText, 
  Zap, 
  DollarSign, 
  Users, 
  BarChart3, 
  CheckCircle,
  Github,
  Cloud,
  Server
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Bot className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold gradient-text">Autopilot Studio</span>
          </div>
          <nav className="hidden md:flex items-center space-x-6">
            <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors">Features</a>
            <a href="#pricing" className="text-muted-foreground hover:text-foreground transition-colors">Pricing</a>
            <a href="#about" className="text-muted-foreground hover:text-foreground transition-colors">About</a>
          </nav>
          <div className="flex items-center space-x-4">
            <Button variant="ghost">Sign In</Button>
            <Button className="btn-primary">Get Started</Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center max-w-4xl">
          <Badge variant="secondary" className="mb-6 animate-fade-in">
            🚀 Now in Beta
          </Badge>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-fade-in-up">
            The Unified Business OS for
            <span className="gradient-text block">AI Development Agencies</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto animate-fade-in-up">
            Automate your entire service pipeline from intake through project handover. 
            Streamline lead qualification, proposal generation, project setup, and billing—all with built-in AI copilots.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up">
            <Button size="lg" className="btn-primary text-lg px-8 py-6">
              Book AI Intake
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 py-6">
              Request Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-20 px-4 bg-card">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Everything You Need to Scale</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              From prospect intake to project handover, we've got your entire workflow covered.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* AI Intake */}
            <Card className="card-hover animate-fade-in-up">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Bot className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>AI-Assisted Intake</CardTitle>
                <CardDescription>
                  Conversational UI with branching questions and automatic qualification scoring.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-accent mr-2" />
                    Calendar integration
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-accent mr-2" />
                    File upload support
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-accent mr-2" />
                    Guest booking
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Proposal Generation */}
            <Card className="card-hover animate-fade-in-up">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <FileText className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Smart Proposals & SoW</CardTitle>
                <CardDescription>
                  AI-generated proposals with e-signature integration and version control.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-accent mr-2" />
                    Template engine
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-accent mr-2" />
                    E-signature flow
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-accent mr-2" />
                    Audit trail
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Project Scaffolding */}
            <Card className="card-hover animate-fade-in-up">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Zap className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Project Scaffolding</CardTitle>
                <CardDescription>
                  Automated project setup with milestone templates and repository integration.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-accent mr-2" />
                    Milestone templates
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-accent mr-2" />
                    Repo integration
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-accent mr-2" />
                    Background jobs
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* AI Copilot */}
            <Card className="card-hover animate-fade-in-up">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Bot className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>AI Copilot Workspace</CardTitle>
                <CardDescription>
                  Generate specs, acceptance criteria, and change requests with AI assistance.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-accent mr-2" />
                    Artifact generation
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-accent mr-2" />
                    Approval workflow
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-accent mr-2" />
                    Version control
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Billing & Invoicing */}
            <Card className="card-hover animate-fade-in-up">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <DollarSign className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Billing & Invoicing</CardTitle>
                <CardDescription>
                  Milestone billing, time tracking, and QuickBooks integration.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-accent mr-2" />
                    Time tracking
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-accent mr-2" />
                    QuickBooks sync
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-accent mr-2" />
                    Profit analytics
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Team Management */}
            <Card className="card-hover animate-fade-in-up">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Team & Collaboration</CardTitle>
                <CardDescription>
                  Standups, status reports, and team coordination tools.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-accent mr-2" />
                    Auto-standups
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-accent mr-2" />
                    Status reports
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-accent mr-2" />
                    Team analytics
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Integrations */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Seamless Integrations</h2>
          <p className="text-xl text-muted-foreground mb-12">
            Connect with your favorite tools and services
          </p>
          <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
            <Github className="h-12 w-12" />
            <Cloud className="h-12 w-12" />
            <Server className="h-12 w-12" />
            <BarChart3 className="h-12 w-12" />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-card">
        <div className="container mx-auto text-center max-w-2xl">
          <h2 className="text-4xl font-bold mb-6">Ready to Transform Your Agency?</h2>
          <p className="text-xl text-muted-foreground mb-8">
            Join leading AI development agencies who are already using Autopilot Studio to scale their operations.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="btn-primary text-lg px-8 py-6">
              Start Free Trial
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 py-6">
              Schedule Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Bot className="h-6 w-6 text-primary" />
                <span className="text-xl font-bold">Autopilot Studio</span>
              </div>
              <p className="text-muted-foreground">
                The unified business OS for AI development agencies.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Integrations</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">About</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Careers</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Status</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border mt-8 pt-8 text-center text-muted-foreground">
            <p>&copy; 2024 Autopilot Studio. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}