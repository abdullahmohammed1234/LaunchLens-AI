import type { ProjectAnalysis } from "@/lib/validations/analysis";
import type { ProjectComparisonResult } from "@/types/project-comparison";
import type { ProjectComparisonContext } from "@/lib/ai/prompts/compareProjectsPrompt";
import {
  computeFailureRiskScore,
  getMostLikelyScenario,
} from "@/lib/utils/failure-simulation";

const LEVEL_SCORE: Record<string, number> = {
  low: 80,
  medium: 55,
  high: 30,
};

function levelFromScore(score: number): "low" | "medium" | "high" {
  if (score >= 70) return "low";
  if (score >= 45) return "medium";
  return "high";
}

function computeOverallScore(
  analysis: ProjectAnalysis,
  teamSize: number,
  hasRoadmap: boolean,
  hasSimulation: boolean
): number {
  const riskScore = LEVEL_SCORE[analysis.riskLevel] ?? 50;
  const complexityScore = LEVEL_SCORE[analysis.complexity] ?? 50;
  const timelineScore = Math.max(
    20,
    100 - analysis.estimatedTimeline.maxMonths * 4
  );
  const skillGapPenalty = Math.min(20, analysis.skillGaps.length * 3);
  const blockerPenalty = Math.min(15, analysis.blockers.length * 4);
  const artifactBonus = (hasRoadmap ? 5 : 0) + (hasSimulation ? 5 : 0);
  const teamPenalty = Math.min(10, Math.max(0, teamSize - 3) * 2);

  const raw =
    analysis.successScore * 0.35 +
    riskScore * 0.2 +
    complexityScore * 0.15 +
    timelineScore * 0.15 +
    artifactBonus -
    skillGapPenalty -
    blockerPenalty -
    teamPenalty;

  return Math.round(Math.min(100, Math.max(0, raw)));
}

export function createFallbackComparison(
  projects: ProjectComparisonContext[]
): ProjectComparisonResult {
  const scored = projects.map((ctx) => ({
    projectId: ctx.projectId,
    title: ctx.project.title,
    overallScore: computeOverallScore(
      ctx.analysis,
      ctx.teamPlan?.recommendedTeamSize ?? ctx.project.teamSize,
      !!ctx.roadmap,
      !!ctx.simulation
    ),
    analysis: ctx.analysis,
    ctx,
  }));

  scored.sort((a, b) => b.overallScore - a.overallScore);
  const winner = scored[0];

  const lowestRisk = [...scored].sort(
    (a, b) =>
      LEVEL_SCORE[b.analysis.riskLevel] - LEVEL_SCORE[a.analysis.riskLevel]
  )[0];
  const lowestComplexity = [...scored].sort(
    (a, b) =>
      LEVEL_SCORE[b.analysis.complexity] -
      LEVEL_SCORE[a.analysis.complexity]
  )[0];
  const fastestLaunch = [...scored].sort(
    (a, b) =>
      a.analysis.estimatedTimeline.maxMonths -
      b.analysis.estimatedTimeline.maxMonths
  )[0];
  const highestSuccess = [...scored].sort(
    (a, b) => b.analysis.successScore - a.analysis.successScore
  )[0];
  const smallestTeam = [...scored].sort(
    (a, b) =>
      (a.ctx.teamPlan?.recommendedTeamSize ?? a.ctx.project.teamSize) -
      (b.ctx.teamPlan?.recommendedTeamSize ?? b.ctx.project.teamSize)
  )[0];

  const categories = [
    {
      name: "Success Probability",
      winner: highestSuccess.projectId,
      reason: `${highestSuccess.title} leads with a ${highestSuccess.analysis.successScore}% success score based on market fit and feasibility analysis.`,
    },
    {
      name: "Risk",
      winner: lowestRisk.projectId,
      reason: `${lowestRisk.title} has the lowest assessed risk level (${lowestRisk.analysis.riskLevel}).`,
    },
    {
      name: "Complexity",
      winner: lowestComplexity.projectId,
      reason: `${lowestComplexity.title} shows ${lowestComplexity.analysis.complexity} complexity, making it more manageable to execute.`,
    },
    {
      name: "Timeline",
      winner: fastestLaunch.projectId,
      reason: `${fastestLaunch.title} has the shortest estimated timeline at ${fastestLaunch.analysis.estimatedTimeline.minMonths}-${fastestLaunch.analysis.estimatedTimeline.maxMonths} months.`,
    },
    {
      name: "Team Requirements",
      winner: smallestTeam.projectId,
      reason: `${smallestTeam.title} requires the smallest team (${smallestTeam.ctx.teamPlan?.recommendedTeamSize ?? smallestTeam.ctx.project.teamSize} members).`,
    },
    {
      name: "Skill Fit",
      winner: winner.projectId,
      reason: `${winner.title} aligns best with the founder's ${winner.ctx.project.experienceLevel} experience level given its skill gap profile.`,
    },
    {
      name: "Execution Feasibility",
      winner: winner.projectId,
      reason: `${winner.title} combines manageable scope, fewer blockers, and the strongest overall execution indicators.`,
    },
  ];

  const headToHeadNames = [
    "Success Probability",
    "Risk",
    "Complexity",
    "Timeline",
    "Team Size",
    "Skill Gap Severity",
    "Failure Risk",
    "Execution Difficulty",
  ] as const;

  const headToHead = headToHeadNames.map((name) => ({
    name,
    values: scored.map(({ projectId, analysis, ctx }) => {
      switch (name) {
        case "Success Probability":
          return {
            projectId,
            score: analysis.successScore,
            label: `${analysis.successScore}%`,
          };
        case "Risk":
          return {
            projectId,
            score: LEVEL_SCORE[analysis.riskLevel] ?? 50,
            label: analysis.riskLevel,
            level: analysis.riskLevel,
          };
        case "Complexity":
          return {
            projectId,
            score: LEVEL_SCORE[analysis.complexity] ?? 50,
            label: analysis.complexity,
            level: analysis.complexity,
          };
        case "Timeline": {
          const months = analysis.estimatedTimeline.maxMonths;
          const score = Math.max(20, 100 - months * 4);
          return {
            projectId,
            score,
            label: `${analysis.estimatedTimeline.minMonths}-${months} mo`,
          };
        }
        case "Team Size": {
          const size =
            ctx.teamPlan?.recommendedTeamSize ?? ctx.project.teamSize;
          const score = Math.max(20, 100 - size * 8);
          return { projectId, score, label: `${size} people` };
        }
        case "Skill Gap Severity": {
          const highGaps = analysis.skillGaps.filter(
            (g) => g.importance === "high"
          ).length;
          const score = Math.max(20, 100 - highGaps * 15);
          return {
            projectId,
            score,
            label: highGaps > 2 ? "high" : highGaps > 0 ? "medium" : "low",
            level: levelFromScore(score),
          };
        }
        case "Failure Risk": {
          const risk = ctx.simulation
            ? computeFailureRiskScore(ctx.simulation)
            : LEVEL_SCORE[analysis.riskLevel]
              ? 100 - (LEVEL_SCORE[analysis.riskLevel] ?? 50)
              : 50;
          return {
            projectId,
            score: 100 - risk,
            label: `${risk}/100`,
            level: levelFromScore(100 - risk),
          };
        }
        case "Execution Difficulty": {
          const blockers = analysis.blockers.filter(
            (b) => b.severity === "high"
          ).length;
          const score = Math.max(
            20,
            100 - blockers * 12 - (analysis.complexity === "high" ? 20 : 0)
          );
          return {
            projectId,
            score,
            label: levelFromScore(score),
            level: levelFromScore(score),
          };
        }
        default:
          return { projectId, score: 50, label: "N/A" };
      }
    }),
  }));

  const radarData = scored.map(({ projectId, analysis, ctx }) => ({
    projectId,
    risk: LEVEL_SCORE[analysis.riskLevel] ?? 50,
    complexity: LEVEL_SCORE[analysis.complexity] ?? 50,
    execution: Math.round(
      (analysis.successScore +
        (LEVEL_SCORE[analysis.riskLevel] ?? 50) +
        (LEVEL_SCORE[analysis.complexity] ?? 50)) /
        3
    ),
    teamNeeds: Math.max(
      20,
      100 -
        (ctx.teamPlan?.recommendedTeamSize ?? ctx.project.teamSize) * 8
    ),
    readiness: ctx.roadmap
      ? Math.min(95, 60 + ctx.roadmap.phases.length * 5)
      : 45,
  }));

  const barChartData = scored.map(({ projectId, analysis, ctx }) => ({
    projectId,
    timelineMonths: analysis.estimatedTimeline.maxMonths,
    teamSize: ctx.teamPlan?.recommendedTeamSize ?? ctx.project.teamSize,
    successScore: analysis.successScore,
  }));

  const scenarioComparison = scored.map(({ projectId, analysis, ctx }) => {
    if (ctx.simulation) {
      const mostLikely = getMostLikelyScenario(ctx.simulation);
      return {
        projectId,
        mostLikelyFailure: mostLikely.title,
        probability: mostLikely.probability,
        severity: mostLikely.severity,
        summary: mostLikely.summary,
      };
    }
    return {
      projectId,
      mostLikelyFailure: analysis.blockers[0]?.title ?? "Market validation failure",
      probability: analysis.riskLevel === "high" ? 65 : analysis.riskLevel === "medium" ? 45 : 25,
      severity: analysis.riskLevel,
      summary: `Based on analysis risk level (${analysis.riskLevel}). Run failure simulation for detailed scenarios.`,
    };
  });

  const roadmapComparison = scored.map(({ projectId, analysis, ctx }) => {
    if (ctx.roadmap) {
      const taskCount = ctx.roadmap.phases.reduce(
        (sum, p) => sum + p.tasks.length,
        0
      );
      const milestoneCount = ctx.roadmap.phases.reduce(
        (sum, p) => sum + p.milestones.length,
        0
      );
      return {
        projectId,
        durationMonths: ctx.roadmap.estimatedDurationMonths,
        milestoneCount,
        taskCount,
        launchReadiness: Math.min(
          90,
          50 + milestoneCount * 3 + ctx.roadmap.launchChecklist.length * 2
        ),
        executionDifficulty: analysis.complexity,
      };
    }
    return {
      projectId,
      durationMonths: analysis.estimatedTimeline.maxMonths,
      milestoneCount: 0,
      taskCount: analysis.mvpScope.length * 3,
      launchReadiness: 35,
      executionDifficulty: analysis.complexity,
    };
  });

  const teamComparison = scored.map(({ projectId, analysis, ctx }) => {
    const teamSize =
      ctx.teamPlan?.recommendedTeamSize ?? ctx.project.teamSize;
    const criticalRoles = ctx.teamPlan
      ? ctx.teamPlan.roles
          .filter((r) => r.priority === "critical")
          .map((r) => r.title)
      : ["Founder", "Developer"];
    const skillGapCount = ctx.teamPlan
      ? ctx.teamPlan.skillGaps.length
      : analysis.skillGaps.length;
    const highGaps = ctx.teamPlan
      ? ctx.teamPlan.skillGaps.filter((g) => g.severity === "high").length
      : analysis.skillGaps.filter((g) => g.importance === "high").length;

    return {
      projectId,
      teamSize,
      criticalRoles,
      skillGapCount,
      skillGapSeverity: levelFromScore(Math.max(20, 100 - highGaps * 20)),
      hiringDifficulty: (teamSize > 5
        ? "high"
        : teamSize > 3
          ? "medium"
          : "low") as "low" | "medium" | "high",
    };
  });

  const runnerUp = scored[1];

  return {
    winner: winner.projectId,
    comparisonSummary: `${winner.title} ranks highest overall (${winner.overallScore}/100) based on success probability, execution feasibility, and resource requirements. ${runnerUp ? `${runnerUp.title} (${runnerUp.overallScore}/100) is a viable alternative but requires more ${runnerUp.analysis.complexity === "high" ? "complex execution" : "resources"}.` : ""}`,
    categories,
    projectScores: scored.map(({ projectId, overallScore }) => ({
      projectId,
      overallScore,
    })),
    recommendations: [
      `Prioritize ${winner.title} for immediate validation and MVP development.`,
      `Run failure simulation on all finalists before committing full resources.`,
      `Address critical skill gaps early — ${winner.title} has ${winner.analysis.skillGaps.filter((g) => g.importance === "high").length} high-priority gaps.`,
      runnerUp
        ? `Keep ${runnerUp.title} as a backup if ${winner.title} fails initial user validation.`
        : "Document learnings from the chosen project to inform future ideas.",
    ],
    highlights: {
      bestOverall: winner.projectId,
      highestSuccess: highestSuccess.projectId,
      lowestRisk: lowestRisk.projectId,
      fastestLaunch: fastestLaunch.projectId,
      lowestComplexity: lowestComplexity.projectId,
      bestSkillFit: winner.projectId,
    },
    headToHead,
    radarData,
    barChartData,
    scenarioComparison,
    roadmapComparison,
    teamComparison,
    decision: {
      recommendedProjectId: winner.projectId,
      whyItWins: `${winner.title} offers the best balance of success probability (${winner.analysis.successScore}%), manageable ${winner.analysis.complexity} complexity, and ${winner.analysis.riskLevel} risk profile.`,
      tradeoffs: runnerUp
        ? [
            `${runnerUp.title} may offer larger market opportunity but requires more resources.`,
            `Faster alternatives exist but with higher execution risk.`,
          ]
        : [
            "Limited comparison set — consider analyzing more ideas before committing.",
          ],
      strategicAdvice: `Start with a focused MVP for ${winner.title}. Validate core assumptions within ${winner.analysis.estimatedTimeline.minMonths} months before scaling team or scope.`,
    },
  };
}
