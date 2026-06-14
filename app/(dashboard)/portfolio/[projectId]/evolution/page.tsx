import { auth } from "@/auth";
import { getProjectEvolution } from "@/lib/portfolio/evolution";
import { getProjectSnapshots } from "@/lib/portfolio/snapshots";
import { ProjectEvolutionContent } from "@/components/portfolio/project-evolution-content";

interface PageProps {
  params: Promise<{ projectId: string }>;
}

export default async function ProjectEvolutionPage({ params }: PageProps) {
  const session = await auth();
  const { projectId } = await params;

  const [evolution, snapshots] = await Promise.all([
    getProjectEvolution(session!.user.id, projectId),
    getProjectSnapshots(session!.user.id, projectId),
  ]);

  return (
    <ProjectEvolutionContent evolution={evolution} snapshots={snapshots} />
  );
}
