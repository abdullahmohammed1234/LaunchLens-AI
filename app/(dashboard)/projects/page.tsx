import Link from "next/link";
import { Plus } from "lucide-react";
import { auth } from "@/auth";
import { getProjectsForUser } from "@/lib/auth-utils";
import { PageContainer } from "@/components/layout/page-container";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { ProjectList } from "@/components/projects/project-list";
import { ProjectsEmptyState } from "@/components/projects/projects-empty-state";

export default async function ProjectsPage() {
  const session = await auth();
  const projects = await getProjectsForUser(session!.user.id);

  return (
    <PageContainer>
      <PageHeader
        title="Projects"
        description="Manage and track all your project ideas"
        action={
          <Button asChild>
            <Link href="/projects/new">
              <Plus className="h-4 w-4" />
              New Project
            </Link>
          </Button>
        }
      />

      {projects.length === 0 ? (
        <ProjectsEmptyState />
      ) : (
        <ProjectList projects={projects} />
      )}
    </PageContainer>
  );
}
