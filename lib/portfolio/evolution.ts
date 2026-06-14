import { prisma } from "@/lib/prisma";
import { getProjectForUser } from "@/lib/auth-utils";
import type { ExecutiveReportData } from "@/types/executive-report";
import type { ProjectEvolution, RiskLevel } from "@/types/portfolio";
import { calculateReadinessScore } from "@/lib/portfolio/utils";

export async function getProjectEvolution(
  userId: string,
  projectId: string
): Promise<ProjectEvolution> {
  const project = await getProjectForUser(projectId, userId);

  const [analyses, simulations, roadmaps, teamPlans, reports, snapshots] =
    await Promise.all([
      prisma.analysis.findMany({
        where: { projectId },
        orderBy: { createdAt: "asc" },
      }),
      prisma.failureSimulation.findMany({
        where: { projectId },
        orderBy: { createdAt: "asc" },
        take: 10,
      }),
      prisma.roadmap.findMany({
        where: { projectId },
        orderBy: { createdAt: "asc" },
        take: 10,
      }),
      prisma.teamPlan.findMany({
        where: { projectId },
        orderBy: { createdAt: "asc" },
        take: 10,
      }),
      prisma.executiveReport.findMany({
        where: { projectId },
        orderBy: { createdAt: "asc" },
      }),
      prisma.projectSnapshot.findMany({
        where: { projectId, userId },
        orderBy: { createdAt: "asc" },
        take: 10,
      }),
    ]);

  const events: ProjectEvolution["events"] = [];

  for (const analysis of analyses) {
    events.push({
      id: analysis.id,
      type: "analysis",
      title: "AI Analysis",
      description: `Success score: ${analysis.successScore}, Risk: ${analysis.riskLevel}`,
      createdAt: analysis.createdAt.toISOString(),
      scores: {
        successScore: analysis.successScore,
        riskLevel: analysis.riskLevel as RiskLevel,
        readinessScore: null,
      },
    });
  }

  for (const sim of simulations) {
    events.push({
      id: sim.id,
      type: "simulation",
      title: "Failure Simulation",
      description: "Failure scenarios and root causes generated",
      createdAt: sim.createdAt.toISOString(),
    });
  }

  for (const roadmap of roadmaps) {
    events.push({
      id: roadmap.id,
      type: "roadmap",
      title: "Roadmap Updated",
      description: `Estimated duration: ${roadmap.estimatedDurationMonths} months`,
      createdAt: roadmap.createdAt.toISOString(),
    });
  }

  for (const team of teamPlans) {
    events.push({
      id: team.id,
      type: "team_plan",
      title: "Team Plan Created",
      description: `Recommended team size: ${team.recommendedTeamSize}`,
      createdAt: team.createdAt.toISOString(),
    });
  }

  for (const report of reports) {
    const data = report.reportData as ExecutiveReportData;
    const readiness = calculateReadinessScore({
      investmentReadinessScore: report.investmentReadinessScore,
      projectReadinessScore: data.projectReadinessScore,
      executionReadinessScore: data.executionReadinessScore,
      teamReadinessScore: data.teamReadinessScore,
      launchReadinessScore: data.launchReadinessScore,
    });
    events.push({
      id: report.id,
      type: "report",
      title: "Executive Report",
      description: `Investment readiness: ${report.investmentReadinessScore}`,
      createdAt: report.createdAt.toISOString(),
      scores: {
        successScore: null,
        riskLevel: null,
        readinessScore: readiness,
      },
    });
  }

  for (const snapshot of snapshots) {
    events.push({
      id: snapshot.id,
      type: "snapshot",
      title: snapshot.label ?? "Snapshot",
      description: "Project state saved",
      createdAt: snapshot.createdAt.toISOString(),
    });
  }

  events.sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );

  const analysisEvents = events.filter((e) => e.type === "analysis");
  for (let i = 1; i < analysisEvents.length; i++) {
    const prev = analysisEvents[i - 1].scores;
    const curr = analysisEvents[i].scores;
    if (prev && curr) {
      analysisEvents[i].changes = {
        successScoreDelta:
          curr.successScore !== null && prev.successScore !== null
            ? curr.successScore - prev.successScore
            : null,
        riskLevelChange:
          prev.riskLevel && curr.riskLevel && prev.riskLevel !== curr.riskLevel
            ? `${prev.riskLevel} → ${curr.riskLevel}`
            : null,
        readinessScoreDelta: null,
      };
    }
  }

  const currentAnalysis = analyses.length
    ? {
        successScore: analyses[analyses.length - 1].successScore,
        riskLevel: analyses[analyses.length - 1].riskLevel as RiskLevel,
        complexity: analyses[analyses.length - 1].complexity as RiskLevel,
      }
    : null;

  const previousAnalysis =
    analyses.length > 1
      ? {
          successScore: analyses[analyses.length - 2].successScore,
          riskLevel: analyses[analyses.length - 2].riskLevel as RiskLevel,
          complexity: analyses[analyses.length - 2].complexity as RiskLevel,
        }
      : null;

  const scoreImprovements: string[] = [];
  const scoreDeclines: string[] = [];

  if (currentAnalysis && previousAnalysis) {
    const delta = currentAnalysis.successScore - previousAnalysis.successScore;
    if (delta > 0) {
      scoreImprovements.push(
        `Success score improved by ${delta} points (${previousAnalysis.successScore} → ${currentAnalysis.successScore})`
      );
    } else if (delta < 0) {
      scoreDeclines.push(
        `Success score declined by ${Math.abs(delta)} points (${previousAnalysis.successScore} → ${currentAnalysis.successScore})`
      );
    }
    if (currentAnalysis.riskLevel !== previousAnalysis.riskLevel) {
      const msg = `Risk level changed from ${previousAnalysis.riskLevel} to ${currentAnalysis.riskLevel}`;
      if (
        ["low", "medium", "high"].indexOf(currentAnalysis.riskLevel) <
        ["low", "medium", "high"].indexOf(previousAnalysis.riskLevel)
      ) {
        scoreImprovements.push(msg);
      } else {
        scoreDeclines.push(msg);
      }
    }
  }

  if (roadmaps.length > 1) {
    const prev = roadmaps[roadmaps.length - 2];
    const curr = roadmaps[roadmaps.length - 1];
    if (curr.estimatedDurationMonths < prev.estimatedDurationMonths) {
      scoreImprovements.push(
        `Roadmap timeline shortened by ${prev.estimatedDurationMonths - curr.estimatedDurationMonths} months`
      );
    } else if (curr.estimatedDurationMonths > prev.estimatedDurationMonths) {
      scoreDeclines.push(
        `Roadmap timeline extended by ${curr.estimatedDurationMonths - prev.estimatedDurationMonths} months`
      );
    }
  }

  if (teamPlans.length > 1) {
    const prev = teamPlans[teamPlans.length - 2];
    const curr = teamPlans[teamPlans.length - 1];
    if (curr.recommendedTeamSize !== prev.recommendedTeamSize) {
      scoreImprovements.push(
        `Team plan updated: recommended size ${prev.recommendedTeamSize} → ${curr.recommendedTeamSize}`
      );
    }
  }

  return {
    projectId,
    projectTitle: project.title,
    events,
    currentAnalysis,
    previousAnalysis,
    scoreImprovements,
    scoreDeclines,
  };
}
