import { PageContainer } from "@/components/layout/page-container";
import { PageHeader } from "@/components/layout/page-header";
import { ProjectForm } from "@/components/projects/project-form";
import { Card, CardContent } from "@/components/ui/card";

export default function NewProjectPage() {
  return (
    <PageContainer>
      <PageHeader
        title="New Project"
        description="Add a new project idea to track and validate"
      />
      <Card className="border-border bg-card">
        <CardContent className="p-6">
          <ProjectForm mode="create" />
        </CardContent>
      </Card>
    </PageContainer>
  );
}
