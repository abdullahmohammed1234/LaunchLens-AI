"use client";

import { useCallback, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { formatDistanceToNow } from "date-fns";
import { toast } from "sonner";
import type { StoredProjectComparison, WhatIfParameters } from "@/types/project-comparison";
import { projectComparisonSchema } from "@/types/project-comparison";
import { CompareLoading } from "@/components/compare/compare-loading";
import {
  CompareProjectSelector,
  type CompareProjectOption,
} from "@/components/compare/compare-project-selector";
import { ComparisonMetrics } from "@/components/compare/comparison-metrics";
import { ComparisonDecision } from "@/components/compare/comparison-decision";
import { CategoryBreakdown } from "@/components/compare/category-breakdown";
import { ComparisonTable } from "@/components/compare/comparison-table";
import { ComparisonRadarChart } from "@/components/compare/comparison-radar-chart";
import { ComparisonBarCharts } from "@/components/compare/comparison-bar-charts";
import { ScenarioComparison } from "@/components/compare/scenario-comparison";
import { RoadmapComparison } from "@/components/compare/roadmap-comparison";
import { TeamComparison } from "@/components/compare/team-comparison";
import { WhatIfMode } from "@/components/compare/what-if-mode";
import { Badge } from "@/components/ui/badge";

interface CompareViewProps {
  projects: CompareProjectOption[];
}

export function CompareView({ projects }: CompareViewProps) {
  const analyzableIds = useMemo(
    () => projects.filter((p) => p.hasAnalysis).map((p) => p.id),
    [projects]
  );

  const [selectedIds, setSelectedIds] = useState<string[]>(() =>
    analyzableIds.slice(0, Math.min(3, analyzableIds.length))
  );
  const [comparison, setComparison] = useState<StoredProjectComparison | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);
  const [usedFallback, setUsedFallback] = useState(false);
  const [activeWhatIf, setActiveWhatIf] = useState<WhatIfParameters | undefined>();

  const projectTitles = useMemo(
    () => Object.fromEntries(projects.map((p) => [p.id, p.title])),
    [projects]
  );

  const runComparison = useCallback(
    async (projectIds: string[], whatIf?: WhatIfParameters) => {
      if (projectIds.length < 2) {
        toast.error("Select at least 2 projects to compare");
        return;
      }

      setIsLoading(true);
      setComparison(null);

      try {
        const response = await fetch("/api/compare-projects", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ projectIds, whatIf }),
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.error ?? "Comparison failed");
        }

        const parsed = projectComparisonSchema.safeParse(result);
        if (!parsed.success) {
          throw new Error("Invalid comparison response");
        }

        setComparison(result as StoredProjectComparison);
        setUsedFallback(result.usedFallback ?? false);
        setActiveWhatIf(whatIf);
        toast.success("Project comparison complete");
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Failed to compare projects"
        );
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  function handleCompare() {
    runComparison(selectedIds);
  }

  function handleWhatIfApply(params: WhatIfParameters) {
    runComparison(selectedIds, params);
  }

  function handleWhatIfReset() {
    setActiveWhatIf(undefined);
    runComparison(selectedIds);
  }

  const displayProjectIds = comparison?.projectIds ?? selectedIds;

  return (
    <div className="space-y-6">
      <CompareProjectSelector
        projects={projects}
        selectedIds={selectedIds}
        onSelectionChange={setSelectedIds}
        onCompare={handleCompare}
        isLoading={isLoading}
      />

      {isLoading && <CompareLoading fullPage />}

      <AnimatePresence mode="wait">
        {comparison && !isLoading && (
          <motion.div
            key={comparison.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="space-y-6"
          >
            <div className="flex flex-wrap items-center gap-2">
              {usedFallback && (
                <Badge variant="warning">Used fallback analysis</Badge>
              )}
              <Badge variant="secondary">
                Compared {formatDistanceToNow(new Date(comparison.createdAt), {
                  addSuffix: true,
                })}
              </Badge>
              {activeWhatIf && (
                <Badge variant="default">What-if scenario active</Badge>
              )}
            </div>

            <ComparisonMetrics
              highlights={comparison.highlights}
              projectScores={comparison.projectScores}
              projectTitles={projectTitles}
            />

            <ComparisonDecision
              decision={comparison.decision}
              projectTitles={projectTitles}
              comparisonSummary={comparison.comparisonSummary}
              recommendations={comparison.recommendations}
            />

            <CategoryBreakdown
              categories={comparison.categories}
              projectTitles={projectTitles}
            />

            <ComparisonTable
              headToHead={comparison.headToHead}
              projectTitles={projectTitles}
              selectedProjectIds={displayProjectIds}
            />

            <div className="grid gap-4 lg:grid-cols-2">
              <ComparisonRadarChart
                radarData={comparison.radarData}
                projectTitles={projectTitles}
              />
              <ComparisonBarCharts
                barChartData={comparison.barChartData}
                projectTitles={projectTitles}
              />
            </div>

            <ScenarioComparison
              scenarios={comparison.scenarioComparison}
              projectTitles={projectTitles}
            />

            <RoadmapComparison
              roadmaps={comparison.roadmapComparison}
              projectTitles={projectTitles}
            />

            <TeamComparison
              teams={comparison.teamComparison}
              projectTitles={projectTitles}
            />

            <WhatIfMode
              onApply={handleWhatIfApply}
              onReset={handleWhatIfReset}
              isLoading={isLoading}
              whatIfImpact={comparison.whatIfImpact}
              projectTitles={projectTitles}
              hasActiveWhatIf={!!activeWhatIf}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
