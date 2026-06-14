"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { motion } from "framer-motion";
import { ArrowLeft, Map, Play, Sparkles } from "lucide-react";
import { toast } from "sonner";
import type { StoredRoadmap } from "@/types/roadmap";
import { roadmapSchema } from "@/types/roadmap";
import { RoadmapLoading } from "@/components/roadmap/roadmap-loading";
import { RoadmapMetrics } from "@/components/roadmap/roadmap-metrics";
import { RoadmapPhaseCards } from "@/components/roadmap/roadmap-phase-cards";
import { RoadmapKanban } from "@/components/roadmap/roadmap-kanban";
import { MilestoneTracker } from "@/components/roadmap/milestone-tracker";
import { BuildOrderSection } from "@/components/roadmap/build-order-section";
import { CriticalSuccessFactors } from "@/components/roadmap/critical-success-factors";
import { LaunchChecklist } from "@/components/roadmap/launch-checklist";
import { PlanComparisonSection } from "@/components/roadmap/plan-comparison";
import { RoadmapExportPanel } from "@/components/roadmap/roadmap-export";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";

interface RoadmapViewProps {
  projectId: string;
  projectTitle: string;
  projectTimeline?: string;
  hasAnalysis: boolean;
  hasSimulation: boolean;
  initialRoadmap: StoredRoadmap | null;
  showBackLink?: boolean;
}

export function RoadmapView({
  projectId,
  projectTitle,
  projectTimeline,
  hasAnalysis,
  hasSimulation,
  initialRoadmap,
  showBackLink = true,
}: RoadmapViewProps) {
  const router = useRouter();
  const [roadmap, setRoadmap] = useState<StoredRoadmap | null>(initialRoadmap);
  const [isLoading, setIsLoading] = useState(false);
  const [usedFallback, setUsedFallback] = useState(false);

  async function handleGenerate() {
    if (!hasAnalysis) {
      toast.error("Run project analysis before generating a roadmap");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/roadmap", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectId }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error ?? "Roadmap generation failed");
      }

      const parsed = roadmapSchema.safeParse(result);
      if (!parsed.success) {
        throw new Error("Invalid roadmap response");
      }

      setRoadmap(result as StoredRoadmap);
      setUsedFallback(result.usedFallback ?? false);
      toast.success("Execution roadmap generated");
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to generate roadmap"
      );
    } finally {
      setIsLoading(false);
    }
  }

  if (isLoading) {
    return <RoadmapLoading fullPage />;
  }

  if (!hasAnalysis) {
    return (
      <EmptyState
        icon={Sparkles}
        title="Analysis required"
        description="Run AI analysis on this project first. The roadmap generator uses your analysis and failure simulation to build an execution plan."
        action={{
          label: "Go to Analysis",
          onClick: () => router.push(`/projects/${projectId}/analysis`),
        }}
      />
    );
  }

  if (!roadmap) {
    return (
      <EmptyState
        icon={Map}
        title="No roadmap yet"
        description={`Generate an AI execution roadmap for ${projectTitle} — phased milestones, tasks, and launch guidance from a CTO perspective.`}
        action={{
          label: "Generate Roadmap",
          onClick: handleGenerate,
        }}
      />
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="space-y-8"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        {showBackLink && (
          <Button asChild variant="outline" size="sm">
            <Link href={`/projects/${projectId}`}>
              <ArrowLeft className="h-4 w-4" />
              Back to Project
            </Link>
          </Button>
        )}
        <div className="flex flex-wrap items-center gap-2">
          {usedFallback && (
            <Badge variant="warning">Fallback data used</Badge>
          )}
          {!hasSimulation && (
            <Badge variant="secondary">No simulation — run for richer plan</Badge>
          )}
          <span className="text-xs text-muted">
            Generated{" "}
            {formatDistanceToNow(new Date(roadmap.createdAt), {
              addSuffix: true,
            })}
          </span>
          <Button onClick={handleGenerate} size="sm">
            <Play className="h-4 w-4" />
            Regenerate Roadmap
          </Button>
        </div>
      </div>

      <RoadmapMetrics roadmap={roadmap} />

      <RoadmapPhaseCards phases={roadmap.phases} />

      <RoadmapKanban roadmap={roadmap} />

      <div className="grid gap-8 lg:grid-cols-2">
        <MilestoneTracker phases={roadmap.phases} />
        <BuildOrderSection items={roadmap.recommendedBuildOrder} />
      </div>

      <CriticalSuccessFactors factors={roadmap.criticalSuccessFactors} />

      <LaunchChecklist items={roadmap.launchChecklist} />

      <PlanComparisonSection
        comparison={roadmap.planComparison}
        currentDurationLabel={projectTimeline}
        optimizedDurationMonths={roadmap.estimatedDurationMonths}
      />

      <RoadmapExportPanel roadmap={roadmap} projectTitle={projectTitle} />
    </motion.div>
  );
}
