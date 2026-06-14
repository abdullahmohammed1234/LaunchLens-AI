import { analysisToResponse } from "@/lib/ai/serialize";
import {
  getLatestAnalysisForProject,
  getLatestComparisonForProject,
  getLatestExecutiveReportForProject,
  getLatestFailureSimulationForProject,
  getLatestRoadmapForProject,
  getLatestTeamPlanForProject,
  getProjectForUser,
  getProjectsForUser,
} from "@/lib/auth-utils";
import { analyzePortfolio } from "@/lib/portfolio/analyzePortfolio";
import type { AnalyzeProjectInput } from "@/lib/validations/analysis";
import type { ProjectAnalysis } from "@/lib/validations/analysis";
import { executiveReportSchema } from "@/types/executive-report";
import { failureSimulationSchema } from "@/types/failure-simulation";
import type { FailureSimulation } from "@/types/failure-simulation";
import type { ExecutiveReportData } from "@/types/executive-report";
import type { MentorMode } from "@/types/mentor";
import type { ProjectComparisonResult } from "@/types/project-comparison";
import { projectComparisonSchema } from "@/types/project-comparison";
import type { PortfolioAnalytics } from "@/types/portfolio";
import type { Roadmap } from "@/types/roadmap";
import { roadmapSchema } from "@/types/roadmap";
import type { TeamPlan } from "@/types/team-plan";
import { teamPlanSchema } from "@/types/team-plan";
import type { Project } from "@prisma/client";

export interface ProjectIntelligenceContext {
  project: AnalyzeProjectInput & { id: string; status: Project["status"] };
  analysis: (ProjectAnalysis & { id: string; createdAt: string }) | null;
  simulation: FailureSimulation | null;
  roadmap: Roadmap | null;
  teamPlan: TeamPlan | null;
  executiveReport: ExecutiveReportData | null;
  investmentReadinessScore: number | null;
  comparison: ProjectComparisonResult | null;
  availableSources: string[];
}

export interface PortfolioIntelligenceContext {
  portfolio: PortfolioAnalytics;
  projects: Array<{
    id: string;
    title: string;
    status: Project["status"];
    successScore: number | null;
    riskLevel: string | null;
    readinessScore: number | null;
  }>;
}

export interface MentorContextPackage {
  mode: MentorMode;
  projectContext: ProjectIntelligenceContext | null;
  portfolioContext: PortfolioIntelligenceContext | null;
  conversationHistory: Array<{ role: "user" | "assistant"; content: string }>;
}

function buildAvailableSources(ctx: {
  analysis: unknown;
  simulation: unknown;
  roadmap: unknown;
  teamPlan: unknown;
  executiveReport: unknown;
  comparison: unknown;
}): string[] {
  const sources: string[] = [];
  if (ctx.analysis) sources.push("analysis_engine");
  if (ctx.simulation) sources.push("failure_simulator");
  if (ctx.roadmap) sources.push("roadmap_generator");
  if (ctx.teamPlan) sources.push("team_builder");
  if (ctx.executiveReport) sources.push("executive_reports");
  if (ctx.comparison) sources.push("portfolio_analytics");
  return sources;
}

export async function buildProjectContext(
  userId: string,
  projectId: string
): Promise<ProjectIntelligenceContext> {
  const project = await getProjectForUser(projectId, userId);

  const analysisRecord = await getLatestAnalysisForProject(project.id);
  const analysis = analysisRecord
    ? { ...analysisToResponse(analysisRecord) }
    : null;

  const simulationRecord = await getLatestFailureSimulationForProject(
    project.id
  );
  const simulation = simulationRecord
    ? failureSimulationSchema.parse(simulationRecord.simulationData)
    : null;

  const roadmapRecord = await getLatestRoadmapForProject(project.id);
  const roadmap = roadmapRecord
    ? roadmapSchema.parse({
        estimatedDurationMonths: roadmapRecord.estimatedDurationMonths,
        ...(roadmapRecord.roadmapData as object),
      })
    : null;

  const teamPlanRecord = await getLatestTeamPlanForProject(project.id);
  const teamPlan = teamPlanRecord
    ? teamPlanSchema.parse({
        recommendedTeamSize: teamPlanRecord.recommendedTeamSize,
        ...(teamPlanRecord.teamData as object),
      })
    : null;

  const reportRecord = await getLatestExecutiveReportForProject(project.id);
  const executiveReport = reportRecord
    ? executiveReportSchema.parse(reportRecord.reportData)
    : null;

  const comparisonRecord = await getLatestComparisonForProject(
    userId,
    project.id
  );
  const comparison = comparisonRecord
    ? projectComparisonSchema.parse(comparisonRecord.comparisonData)
    : null;

  const availableSources = buildAvailableSources({
    analysis,
    simulation,
    roadmap,
    teamPlan,
    executiveReport,
    comparison,
  });

  return {
    project: {
      id: project.id,
      title: project.title,
      description: project.description,
      budget: project.budget,
      timeline: project.timeline,
      teamSize: project.teamSize,
      experienceLevel: project.experienceLevel,
      status: project.status,
    },
    analysis,
    simulation,
    roadmap,
    teamPlan,
    executiveReport,
    investmentReadinessScore: reportRecord?.investmentReadinessScore ?? null,
    comparison,
    availableSources,
  };
}

export async function buildPortfolioContext(
  userId: string
): Promise<PortfolioIntelligenceContext> {
  const [portfolio, projects] = await Promise.all([
    analyzePortfolio(userId),
    getProjectsForUser(userId),
  ]);

  const projectSummaries = await Promise.all(
    projects.map(async (p) => {
      const analysis = await getLatestAnalysisForProject(p.id);
      const report = await getLatestExecutiveReportForProject(p.id);
      return {
        id: p.id,
        title: p.title,
        status: p.status,
        successScore: analysis?.successScore ?? null,
        riskLevel: analysis?.riskLevel ?? null,
        readinessScore: report?.investmentReadinessScore ?? null,
      };
    })
  );

  return {
    portfolio,
    projects: projectSummaries,
  };
}

export async function buildMentorContext(
  userId: string,
  options: {
    mode: MentorMode;
    projectId?: string;
    conversationHistory?: Array<{ role: "user" | "assistant"; content: string }>;
  }
): Promise<MentorContextPackage> {
  const { mode, projectId, conversationHistory = [] } = options;

  if (mode === "portfolio") {
    const portfolioContext = await buildPortfolioContext(userId);
    return {
      mode,
      projectContext: null,
      portfolioContext,
      conversationHistory,
    };
  }

  if (!projectId) {
    throw new Error("Project ID required for project and founder_coach modes");
  }

  const projectContext = await buildProjectContext(userId, projectId);
  let portfolioContext: PortfolioIntelligenceContext | null = null;

  if (mode === "founder_coach") {
    portfolioContext = await buildPortfolioContext(userId);
  }

  return {
    mode,
    projectContext,
    portfolioContext,
    conversationHistory,
  };
}
