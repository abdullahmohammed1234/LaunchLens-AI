import { PageContainer } from "@/components/layout/page-container";
import { PageHeader } from "@/components/layout/page-header";
import { MentorPageClient } from "@/components/mentor/mentor-page-client";
import { auth } from "@/auth";
import { getProjectsForUser } from "@/lib/auth-utils";

export default async function MentorPage() {
  const session = await auth();
  const projects = await getProjectsForUser(session!.user.id);

  return (
    <PageContainer>
      <PageHeader
        title="AI Mentor"
        description="Ask questions about your projects and receive strategic guidance."
      />

      <MentorPageClient
        projects={projects.map((p) => ({ id: p.id, title: p.title }))}
      />
    </PageContainer>
  );
}
