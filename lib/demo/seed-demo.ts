"use server";

import { revalidatePath } from "next/cache";
import { requireAuth } from "@/lib/auth-utils";
import { prisma } from "@/lib/prisma";
import { DEMO_PROJECTS } from "@/lib/demo/demo-data";
import { createNotification } from "@/lib/portfolio/notifications";
import { monitor } from "@/lib/monitoring";

const DEMO_MARKER = "[DEMO]";

export async function seedDemoDataAction() {
  const session = await requireAuth();
  const userId = session.user.id;

  const existing = await prisma.project.findFirst({
    where: {
      userId,
      title: { startsWith: DEMO_MARKER },
    },
  });

  if (existing) {
    return { success: true, message: "Demo data already loaded", count: 0 };
  }

  let count = 0;

  for (const demo of DEMO_PROJECTS) {
    const project = await prisma.project.create({
      data: {
        userId,
        title: `${DEMO_MARKER} ${demo.title}`,
        description: demo.description,
        budget: demo.budget,
        timeline: demo.timeline,
        teamSize: demo.teamSize,
        experienceLevel: demo.experienceLevel,
        status: demo.status,
        isStarred: demo.isStarred,
        isPinned: demo.isPinned,
      },
    });

    await prisma.analysis.create({
      data: {
        projectId: project.id,
        successScore: demo.analysis.successScore,
        riskLevel: demo.analysis.riskLevel,
        complexity: demo.analysis.complexity,
        estimatedTimelineMin: demo.analysis.estimatedTimeline.minMonths,
        estimatedTimelineMax: demo.analysis.estimatedTimeline.maxMonths,
        skillGaps: demo.analysis.skillGaps,
        blockers: demo.analysis.blockers,
        recommendations: demo.analysis.recommendations,
        mvpScope: demo.analysis.mvpScope,
      },
    });

    await prisma.failureSimulation.create({
      data: {
        projectId: project.id,
        simulationData: demo.simulation,
      },
    });

    await prisma.roadmap.create({
      data: {
        projectId: project.id,
        estimatedDurationMonths: demo.roadmap.estimatedDurationMonths,
        roadmapData: {
          phases: demo.roadmap.phases,
          launchChecklist: demo.roadmap.launchChecklist,
          criticalSuccessFactors: demo.roadmap.criticalSuccessFactors,
          recommendedBuildOrder: demo.roadmap.recommendedBuildOrder,
          planComparison: demo.roadmap.planComparison,
        },
      },
    });

    await prisma.teamPlan.create({
      data: {
        projectId: project.id,
        recommendedTeamSize: demo.teamPlan.recommendedTeamSize,
        teamData: {
          roles: demo.teamPlan.roles,
          skillGaps: demo.teamPlan.skillGaps,
          skillReadiness: demo.teamPlan.skillReadiness,
          teamRisks: demo.teamPlan.teamRisks,
          hiringOrder: demo.teamPlan.hiringOrder,
          founderRecommendations: demo.teamPlan.founderRecommendations,
          teamScenarios: demo.teamPlan.teamScenarios,
        },
      },
    });

    await prisma.executiveReport.create({
      data: {
        projectId: project.id,
        investmentReadinessScore: demo.report.investmentReadinessScore,
        reportData: demo.report,
      },
    });

    await prisma.activityLog.createMany({
      data: [
        {
          userId,
          projectId: project.id,
          type: "project_created",
          title: "Demo project created",
          description: demo.title,
        },
        {
          userId,
          projectId: project.id,
          type: "project_analyzed",
          title: "Analysis completed",
          description: `${demo.successScore}% success score`,
        },
        {
          userId,
          projectId: project.id,
          type: "simulation_generated",
          title: "Failure simulation generated",
          description: "3 scenarios modeled",
        },
        {
          userId,
          projectId: project.id,
          type: "roadmap_updated",
          title: "Roadmap generated",
          description: `${demo.roadmap.estimatedDurationMonths}-month plan`,
        },
        {
          userId,
          projectId: project.id,
          type: "team_plan_created",
          title: "Team plan created",
          description: `${demo.teamPlan.recommendedTeamSize} roles recommended`,
        },
        {
          userId,
          projectId: project.id,
          type: "report_generated",
          title: "Executive report generated",
          description: `${demo.report.investmentReadinessScore}% investment readiness`,
        },
      ],
    });

    await createNotification({
      userId,
      projectId: project.id,
      type: "project_more_viable",
      title: "Demo project loaded",
      message: `${demo.title} is ready to explore with full AI intelligence.`,
    });

    count++;
  }

  monitor.log("Demo data seeded", { userId, count });
  revalidatePath("/dashboard");
  revalidatePath("/projects");
  revalidatePath("/portfolio");

  return { success: true, message: `Loaded ${count} demo projects`, count };
}

export async function resetDemoDataAction() {
  const session = await requireAuth();
  const userId = session.user.id;

  const demoProjects = await prisma.project.findMany({
    where: {
      userId,
      title: { startsWith: DEMO_MARKER },
    },
    select: { id: true },
  });

  if (demoProjects.length === 0) {
    return { success: true, message: "No demo data to reset", count: 0 };
  }

  await prisma.project.deleteMany({
    where: {
      userId,
      title: { startsWith: DEMO_MARKER },
    },
  });

  monitor.log("Demo data reset", { userId, count: demoProjects.length });
  revalidatePath("/dashboard");
  revalidatePath("/projects");
  revalidatePath("/portfolio");

  return {
    success: true,
    message: `Removed ${demoProjects.length} demo projects`,
    count: demoProjects.length,
  };
}
