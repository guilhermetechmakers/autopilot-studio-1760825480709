import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Edit } from "lucide-react";

export default function ContentEditorPage() {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Edit className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold gradient-text">Content Editor</span>
          </div>
          <p className="text-muted-foreground">CMS/editor for templates (SoW, email, onboarding)</p>
        </div>
        
        <Card className="card-hover">
          <CardHeader>
            <CardTitle>Content Management</CardTitle>
            <CardDescription>Coming soon - Rich text editor and template management</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">This page will contain rich text editor, template library, preview & test, and versioning.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}