import Link from "next/link";
import { notFound } from "next/navigation";
import { formatDistanceToNow, format } from "date-fns";
import { Pencil, Users, DollarSign, Clock, Briefcase } from "lucide-react";
import { auth } from "@/auth";
import { analysisToResponse } from "@/lib/ai/serialize";
import {
  getLatestAnalysisForProject,
  getProjectForUser,
  NotFoundError,
} from "@/lib/auth-utils";
import { PageContainer } from "@/components/layout/page-container";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DeleteProjectButton } from "@/components/projects/delete-project-button";
import { ProjectAnalysisSection } from "@/components/projects/project-analysis-section";
import { ProjectStatusBadge } from "@/components/projects/project-status-badge";
import { formatExperienceLevel } from "@/lib/utils/project";

interface ProjectDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function ProjectDetailPage({
  params,
}: ProjectDetailPageProps) {
  const { id } = await params;
  const session = await auth();

  let project;
  let latestAnalysis = null;
  try {
    project = await getProjectForUser(id, session!.user.id);
    const analysisRecord = await getLatestAnalysisForProject(project.id);
    latestAnalysis = analysisRecord
      ? analysisToResponse(analysisRecord)
      : null;
  } catch (error) {
    if (error instanceof NotFoundError) {
      notFound();
    }
    throw error;
  }

  const details = [
    { label: "Budget", value: project.budget, icon: DollarSign },
    { label: "Timeline", value: project.timeline, icon: Clock },
    { label: "Team Size", value: `${project.teamSize} members`, icon: Users },
    {
      label: "Experience",
      value: formatExperienceLevel(project.experienceLevel),
      icon: Briefcase,
    },
  ];

  return (
    <PageContainer>
      <PageHeader
        title={project.title}
        description={`Created ${format(new Date(project.createdAt), "MMM d, yyyy")}`}
        action={
          <div className="flex items-center gap-2">
            <DeleteProjectButton
              projectId={project.id}
              projectTitle={project.title}
            />
            <Button asChild size="sm">
              <Link href={`/projects/${project.id}/edit`}>
                <Pencil className="h-4 w-4" />
                Edit
              </Link>
            </Button>
          </div>
        }
      />

      <div className="mb-6 flex items-center gap-3">
        <ProjectStatusBadge status={project.status} />
        <span className="text-sm text-muted">
          Updated{" "}
          {formatDistanceToNow(new Date(project.updatedAt), {
            addSuffix: true,
          })}
        </span>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="border-border bg-card lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">Description</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="whitespace-pre-wrap text-sm leading-relaxed text-muted">
              {project.description}
            </p>
          </CardContent>
        </Card>

        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="text-lg">Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {details.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.label} className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                    <Icon className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted">{item.label}</p>
                    <p className="text-sm font-medium text-foreground">
                      {item.value}
                    </p>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>

      <div className="mt-6">
        <ProjectAnalysisSection
          projectId={project.id}
          initialAnalysis={latestAnalysis}
        />
      </div>
    </PageContainer>
  );
}
