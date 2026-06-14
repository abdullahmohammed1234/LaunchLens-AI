"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { motion } from "framer-motion";
import { ArrowLeft, Play, Sparkles, Users } from "lucide-react";
import { toast } from "sonner";
import type { StoredTeamPlan } from "@/types/team-plan";
import { teamPlanSchema } from "@/types/team-plan";
import { TeamLoading } from "@/components/team/team-loading";
import { TeamMetrics } from "@/components/team/team-metrics";
import { RoleRecommendations } from "@/components/team/role-recommendations";
import { SkillGapIntelligence } from "@/components/team/skill-gap-intelligence";
import { TeamRiskAnalysis } from "@/components/team/team-risk-analysis";
import { HiringRoadmap } from "@/components/team/hiring-roadmap";
import { FounderRecommendations } from "@/components/team/founder-recommendations";
import { TeamScenarioMode } from "@/components/team/team-scenario-mode";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";

interface TeamViewProps {
  projectId: string;
  projectTitle: string;
  hasAnalysis: boolean;
  hasSimulation: boolean;
  hasRoadmap: boolean;
  initialTeamPlan: StoredTeamPlan | null;
  showBackLink?: boolean;
}

export function TeamView({
  projectId,
  projectTitle,
  hasAnalysis,
  hasSimulation,
  hasRoadmap,
  initialTeamPlan,
  showBackLink = true,
}: TeamViewProps) {
  const router = useRouter();
  const [teamPlan, setTeamPlan] = useState<StoredTeamPlan | null>(
    initialTeamPlan
  );
  const [isLoading, setIsLoading] = useState(false);
  const [usedFallback, setUsedFallback] = useState(false);

  async function handleGenerate() {
    if (!hasAnalysis) {
      toast.error("Run project analysis before generating a team plan");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/team-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectId }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error ?? "Team plan generation failed");
      }

      const parsed = teamPlanSchema.safeParse(result);
      if (!parsed.success) {
        throw new Error("Invalid team plan response");
      }

      setTeamPlan(result as StoredTeamPlan);
      setUsedFallback(result.usedFallback ?? false);
      toast.success("Team plan generated");
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to generate team plan"
      );
    } finally {
      setIsLoading(false);
    }
  }

  if (isLoading) {
    return <TeamLoading fullPage />;
  }

  if (!hasAnalysis) {
    return (
      <EmptyState
        icon={Sparkles}
        title="Analysis required"
        description="Run AI analysis on this project first. The team builder uses your analysis, failure simulation, and roadmap to recommend roles and identify skill gaps."
        action={{
          label: "Go to Analysis",
          onClick: () => router.push(`/projects/${projectId}/analysis`),
        }}
      />
    );
  }

  if (!teamPlan) {
    return (
      <EmptyState
        icon={Users}
        title="No team plan yet"
        description={`Generate an AI team plan for ${projectTitle} — role recommendations, skill gaps, hiring order, and founder advice from a CTO perspective.`}
        action={{
          label: "Generate Team Plan",
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
            <Badge variant="secondary">
              No simulation — run for richer insights
            </Badge>
          )}
          {!hasRoadmap && (
            <Badge variant="secondary">
              No roadmap — generate for better hiring order
            </Badge>
          )}
          <span className="text-xs text-muted">
            Generated{" "}
            {formatDistanceToNow(new Date(teamPlan.createdAt), {
              addSuffix: true,
            })}
          </span>
          <Button onClick={handleGenerate} size="sm">
            <Play className="h-4 w-4" />
            Regenerate Team Plan
          </Button>
        </div>
      </div>

      <TeamMetrics teamPlan={teamPlan} />

      <RoleRecommendations roles={teamPlan.roles} />

      <SkillGapIntelligence teamPlan={teamPlan} />

      <TeamRiskAnalysis risks={teamPlan.teamRisks} />

      <HiringRoadmap items={teamPlan.hiringOrder} />

      <FounderRecommendations recommendations={teamPlan.founderRecommendations} />

      <TeamScenarioMode scenarios={teamPlan.teamScenarios} />
    </motion.div>
  );
}
