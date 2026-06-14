import type { ImprovementInsights } from "@/types/portfolio";

export function createFallbackImprovementInsights(
  evolution: {
    scoreImprovements: string[];
    scoreDeclines: string[];
    currentAnalysis: { successScore: number; riskLevel: string } | null;
  }
): ImprovementInsights {
  const improvements =
    evolution.scoreImprovements.length > 0
      ? evolution.scoreImprovements
      : [
          "Project has baseline analysis — continue iterating with simulations and roadmaps to build history.",
        ];

  const regressions =
    evolution.scoreDeclines.length > 0
      ? evolution.scoreDeclines
      : [];

  const health = evolution.currentAnalysis
    ? Math.min(
        100,
        Math.max(
          0,
          evolution.currentAnalysis.successScore -
            (evolution.currentAnalysis.riskLevel === "high"
              ? 20
              : evolution.currentAnalysis.riskLevel === "medium"
                ? 10
                : 0)
        )
      )
    : 40;

  return {
    improvements,
    regressions,
    recommendedActions: [
      "Re-run AI analysis after significant project changes",
      "Generate an executive report to assess investment readiness",
      "Save a snapshot before major strategy pivots",
      "Set a readiness goal and track progress weekly",
    ],
    projectHealth: health,
  };
}
