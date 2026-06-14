"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Briefcase, Plus } from "lucide-react";
import type { PortfolioAnalytics, PortfolioProject } from "@/types/portfolio";
import type { PortfolioFilter } from "@/types/portfolio";
import { filterPortfolioProjects } from "@/lib/portfolio/filterProjects";
import { PageContainer } from "@/components/layout/page-container";
import { PageHeader } from "@/components/layout/page-header";
import { SectionHeader } from "@/components/dashboard/section-header";
import { PortfolioCharts } from "@/components/portfolio/portfolio-charts";
import { PortfolioFilters } from "@/components/portfolio/portfolio-filters";
import { PortfolioGroupComparison } from "@/components/portfolio/portfolio-group-comparison";
import { PortfolioProjectCard } from "@/components/portfolio/portfolio-project-card";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";

interface PortfolioOverviewContentProps {
  projects: PortfolioProject[];
  analytics: PortfolioAnalytics;
}

export function PortfolioOverviewContent({
  projects,
  analytics,
}: PortfolioOverviewContentProps) {
  const [filter, setFilter] = useState<PortfolioFilter>({
    sortBy: "updatedAt",
    sortOrder: "desc",
  });

  const filtered = useMemo(
    () => filterPortfolioProjects(projects, filter),
    [projects, filter]
  );

  return (
    <PageContainer>
      <PageHeader
        title="Portfolio"
        description="Manage and track all your projects in one command center"
        action={
          <div className="flex gap-2">
            <Button variant="outline" asChild>
              <Link href="/portfolio/boardroom">Boardroom View</Link>
            </Button>
            <Button asChild>
              <Link href="/projects/new">
                <Plus className="h-4 w-4" />
                New Project
              </Link>
            </Button>
          </div>
        }
      />

      <PortfolioFilters filter={filter} onChange={setFilter} />

      {filtered.length === 0 ? (
        <EmptyState
          icon={Briefcase}
          title="No projects match your filters"
          description="Adjust filters or create a new project to get started."
          action={{ label: "Create Project", href: "/projects/new" }}
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((project, index) => (
            <PortfolioProjectCard
              key={project.id}
              project={project}
              index={index}
            />
          ))}
        </div>
      )}

      <SectionHeader
        title="Portfolio Analytics"
        description="Distribution and trends across your project portfolio"
      />
      <PortfolioCharts analytics={analytics} />

      <SectionHeader
        title="Group Comparison"
        description="Compare project groups side by side"
      />
      <PortfolioGroupComparison projects={projects} />
    </PageContainer>
  );
}
