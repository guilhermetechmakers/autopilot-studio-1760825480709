import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  Bell, 
  Plus, 
  Bot, 
  FileText, 
  Zap, 
  DollarSign,
  Users,
  Calendar,
  BarChart3,
  TrendingUp,
  Clock,
  ArrowRight,
  Settings,
  User
} from "lucide-react";

export default function DashboardPage() {
  const [searchQuery, setSearchQuery] = useState("");

  // Mock data - in real app this would come from API
  const pipelineData = [
    { stage: "Leads", count: 12, value: "$45,000", trend: "+15%" },
    { stage: "Proposals", count: 8, value: "$32,000", trend: "+8%" },
    { stage: "Projects", count: 15, value: "$120,000", trend: "+22%" },
    { stage: "Completed", count: 6, value: "$85,000", trend: "+5%" },
  ];

  const activeProjects = [
    {
      id: 1,
      name: "AI Chatbot for E-commerce",
      client: "TechCorp Inc.",
      progress: 75,
      nextMilestone: "API Integration",
      assignees: ["John D.", "Sarah M."],
      status: "active",
      dueDate: "2024-02-15"
    },
    {
      id: 2,
      name: "ML Model Optimization",
      client: "DataFlow Systems",
      progress: 45,
      nextMilestone: "Model Training",
      assignees: ["Mike R.", "Lisa K."],
      status: "active",
      dueDate: "2024-02-28"
    },
    {
      id: 3,
      name: "Computer Vision App",
      client: "VisionTech",
      progress: 90,
      nextMilestone: "Final Testing",
      assignees: ["Alex P.", "Emma W."],
      status: "review",
      dueDate: "2024-02-10"
    }
  ];

  const recentActivity = [
    { action: "New proposal created", project: "AI Chatbot for E-commerce", time: "2 hours ago" },
    { action: "Milestone completed", project: "ML Model Optimization", time: "4 hours ago" },
    { action: "Client feedback received", project: "Computer Vision App", time: "6 hours ago" },
    { action: "Repository synced", project: "AI Chatbot for E-commerce", time: "8 hours ago" },
  ];

  const aiSuggestions = [
    "Generate acceptance criteria for API Integration milestone",
    "Create project status report for TechCorp Inc.",
    "Draft change request for scope modification",
    "Schedule team standup for tomorrow"
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Bot className="h-8 w-8 text-primary" />
                <span className="text-2xl font-bold gradient-text">Autopilot Studio</span>
              </div>
              <div className="hidden md:flex items-center space-x-1">
                <Button variant="ghost" size="sm">Dashboard</Button>
                <Button variant="ghost" size="sm">Projects</Button>
                <Button variant="ghost" size="sm">Proposals</Button>
                <Button variant="ghost" size="sm">Billing</Button>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search projects, clients..."
                  value={searchQuery}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              <Button variant="ghost" size="icon">
                <Bell className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <Settings className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <User className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Welcome back, John!</h1>
          <p className="text-muted-foreground">Here's what's happening with your projects today.</p>
        </div>

        {/* Pipeline Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {pipelineData.map((stage, index) => (
            <Card key={stage.stage} className="card-hover animate-fade-in-up" style={{ animationDelay: `${index * 100}ms` }}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stage.stage}
                </CardTitle>
                <div className="flex items-center space-x-1">
                  <TrendingUp className="h-4 w-4 text-accent" />
                  <span className="text-sm text-accent">{stage.trend}</span>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stage.count}</div>
                <p className="text-xs text-muted-foreground">{stage.value} in pipeline</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Active Projects */}
          <div className="lg:col-span-2">
            <Card className="card-hover">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Active Projects</CardTitle>
                    <CardDescription>Your current projects and their progress</CardDescription>
                  </div>
                  <Button variant="outline" size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    New Project
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {activeProjects.map((project, index) => (
                  <div key={project.id} className="border border-border rounded-lg p-4 animate-fade-in-up" style={{ animationDelay: `${index * 100}ms` }}>
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-semibold">{project.name}</h3>
                        <p className="text-sm text-muted-foreground">{project.client}</p>
                      </div>
                      <Badge variant={project.status === 'active' ? 'default' : 'secondary'}>
                        {project.status}
                      </Badge>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>Progress</span>
                        <span>{project.progress}%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div 
                          className="bg-primary h-2 rounded-full transition-all duration-300"
                          style={{ width: `${project.progress}%` }}
                        />
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between mt-3 text-sm text-muted-foreground">
                      <div className="flex items-center space-x-4">
                        <span>Next: {project.nextMilestone}</span>
                        <div className="flex items-center space-x-1">
                          <Users className="h-3 w-3" />
                          <span>{project.assignees.join(", ")}</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="h-3 w-3" />
                        <span>{project.dueDate}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* AI Copilot Panel */}
            <Card className="card-hover">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Bot className="h-5 w-5 text-primary" />
                  <span>AI Copilot</span>
                </CardTitle>
                <CardDescription>Suggested actions and insights</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {aiSuggestions.map((suggestion, index) => (
                  <div key={index} className="p-3 bg-muted/50 rounded-lg text-sm animate-fade-in-up" style={{ animationDelay: `${index * 100}ms` }}>
                    <p className="mb-2">{suggestion}</p>
                    <Button variant="ghost" size="sm" className="h-8 px-2">
                      Execute
                      <ArrowRight className="h-3 w-3 ml-1" />
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Calendar Widget */}
            <Card className="card-hover">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calendar className="h-5 w-5 text-primary" />
                  <span>Today's Schedule</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-sm">
                    <div className="w-2 h-2 bg-primary rounded-full" />
                    <span>9:00 AM - Client Call</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <div className="w-2 h-2 bg-accent rounded-full" />
                    <span>2:00 PM - Team Standup</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <div className="w-2 h-2 bg-secondary rounded-full" />
                    <span>4:00 PM - Project Review</span>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="w-full">
                  View Full Calendar
                </Button>
              </CardContent>
            </Card>

            {/* Financial Snapshot */}
            <Card className="card-hover">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <DollarSign className="h-5 w-5 text-primary" />
                  <span>Financial Snapshot</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Monthly Recurring Revenue</span>
                    <span className="font-semibold">$45,000</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Outstanding Invoices</span>
                    <span className="font-semibold">$12,500</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>This Month's Revenue</span>
                    <span className="font-semibold text-accent">$38,000</span>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="w-full">
                  View Billing Details
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Recent Activity */}
        <Card className="mt-8 card-hover">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest updates across your workspace</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start space-x-3 animate-fade-in-up" style={{ animationDelay: `${index * 100}ms` }}>
                  <div className="w-2 h-2 bg-primary rounded-full mt-2" />
                  <div className="flex-1">
                    <p className="text-sm">{activity.action}</p>
                    <p className="text-xs text-muted-foreground">{activity.project}</p>
                  </div>
                  <span className="text-xs text-muted-foreground">{activity.time}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Button className="btn-primary h-20 flex-col space-y-2">
            <Bot className="h-6 w-6" />
            <span>New Intake</span>
          </Button>
          <Button variant="outline" className="h-20 flex-col space-y-2">
            <FileText className="h-6 w-6" />
            <span>Create Proposal</span>
          </Button>
          <Button variant="outline" className="h-20 flex-col space-y-2">
            <Zap className="h-6 w-6" />
            <span>Spin Up Project</span>
          </Button>
          <Button variant="outline" className="h-20 flex-col space-y-2">
            <BarChart3 className="h-6 w-6" />
            <span>Launch Project</span>
          </Button>
        </div>
      </div>
    </div>
  );
}