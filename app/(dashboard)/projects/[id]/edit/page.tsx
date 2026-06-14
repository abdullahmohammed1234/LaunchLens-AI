import { notFound } from "next/navigation";
import { auth } from "@/auth";
import { getProjectForUser, NotFoundError } from "@/lib/auth-utils";
import { PageContainer } from "@/components/layout/page-container";
import { PageHeader } from "@/components/layout/page-header";
import { ProjectForm } from "@/components/projects/project-form";
import { Card, CardContent } from "@/components/ui/card";

interface EditProjectPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditProjectPage({ params }: EditProjectPageProps) {
  const { id } = await params;
  const session = await auth();

  let project;
  try {
    project = await getProjectForUser(id, session!.user.id);
  } catch (error) {
    if (error instanceof NotFoundError) {
      notFound();
    }
    throw error;
  }

  return (
    <PageContainer>
      <PageHeader
        title="Edit Project"
        description={`Update details for "${project.title}"`}
      />
      <Card className="border-border bg-card">
        <CardContent className="p-6">
          <ProjectForm mode="edit" project={project} />
        </CardContent>
      </Card>
    </PageContainer>
  );
}
