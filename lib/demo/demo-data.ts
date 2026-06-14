import type { ExperienceLevel, ProjectStatus } from "@prisma/client";
import type { ProjectAnalysis } from "@/lib/validations/analysis";
import type { FailureSimulation } from "@/types/failure-simulation";
import type { Roadmap } from "@/types/roadmap";
import type { TeamPlan } from "@/types/team-plan";
import type { ExecutiveReportData } from "@/types/executive-report";
import { createFallbackRoadmap } from "@/lib/ai/fallbackRoadmap";
import { createFallbackFailureSimulation } from "@/lib/ai/fallbackFailure";
import { createFallbackExecutiveReport } from "@/lib/ai/fallbackExecutiveReport";
import { createFallbackTeamPlan } from "@/lib/ai/fallbackTeamPlan";

export interface DemoProjectMeta {
  slug: string;
  title: string;
  tagline: string;
  description: string;
  budget: string;
  timeline: string;
  teamSize: number;
  experienceLevel: ExperienceLevel;
  status: ProjectStatus;
  isStarred: boolean;
  isPinned: boolean;
  successScore: number;
  riskLevel: "low" | "medium" | "high";
  complexity: "low" | "medium" | "high";
  timelineMin: number;
  timelineMax: number;
  color: string;
}

export interface DemoProjectFull extends DemoProjectMeta {
  id: string;
  analysis: ProjectAnalysis;
  simulation: FailureSimulation;
  roadmap: Roadmap;
  teamPlan: TeamPlan;
  report: ExecutiveReportData;
  createdAt: string;
}

const DEMO_PROJECTS_META: DemoProjectMeta[] = [
  {
    slug: "launchlens-ai",
    title: "LaunchLens AI",
    tagline: "AI-powered project intelligence platform",
    description:
      "A SaaS platform that helps founders and product teams validate startup ideas before investing time and capital. Uses AI to analyze feasibility, simulate failure scenarios, generate roadmaps, and produce investor-ready reports.",
    budget: "$35,000",
    timeline: "6 months",
    teamSize: 3,
    experienceLevel: "intermediate",
    status: "active",
    isStarred: true,
    isPinned: true,
    successScore: 82,
    riskLevel: "medium",
    complexity: "high",
    timelineMin: 5,
    timelineMax: 8,
    color: "#6366F1",
  },
  {
    slug: "studysync",
    title: "StudySync",
    tagline: "Collaborative study platform for students",
    description:
      "A mobile-first study companion that syncs notes, flashcards, and study schedules across classmates. Features AI-generated quiz questions, spaced repetition, and group study rooms with real-time collaboration.",
    budget: "$20,000",
    timeline: "5 months",
    teamSize: 2,
    experienceLevel: "beginner",
    status: "active",
    isStarred: true,
    isPinned: false,
    successScore: 71,
    riskLevel: "medium",
    complexity: "medium",
    timelineMin: 4,
    timelineMax: 7,
    color: "#22C55E",
  },
  {
    slug: "fittrack",
    title: "FitTrack",
    tagline: "AI workout companion for beginners",
    description:
      "Mobile fitness app with personalized workout plans, form correction via camera, progress tracking, and social accountability. Freemium model targeting fitness newcomers aged 25-40.",
    budget: "$15,000",
    timeline: "4 months",
    teamSize: 2,
    experienceLevel: "beginner",
    status: "active",
    isStarred: false,
    isPinned: false,
    successScore: 68,
    riskLevel: "high",
    complexity: "medium",
    timelineMin: 3,
    timelineMax: 6,
    color: "#F59E0B",
  },
  {
    slug: "ecoroute",
    title: "EcoRoute",
    tagline: "Sustainable logistics optimization",
    description:
      "B2B platform helping delivery companies optimize routes for carbon reduction and fuel savings. Integrates with existing fleet management systems and provides ESG compliance reporting.",
    budget: "$60,000",
    timeline: "10 months",
    teamSize: 5,
    experienceLevel: "advanced",
    status: "active",
    isStarred: true,
    isPinned: false,
    successScore: 76,
    riskLevel: "low",
    complexity: "high",
    timelineMin: 8,
    timelineMax: 12,
    color: "#10B981",
  },
];

function createAnalysis(meta: DemoProjectMeta): ProjectAnalysis {
  const skillSets: Record<string, ProjectAnalysis["skillGaps"]> = {
    "launchlens-ai": [
      { skill: "LLM prompt engineering & evaluation", importance: "high" },
      { skill: "Full-stack SaaS architecture", importance: "high" },
      { skill: "Product design & UX research", importance: "medium" },
    ],
    studysync: [
      { skill: "Mobile development (React Native)", importance: "high" },
      { skill: "Real-time collaboration infrastructure", importance: "high" },
      { skill: "EdTech compliance (FERPA)", importance: "medium" },
    ],
    fittrack: [
      { skill: "Computer vision / pose estimation", importance: "high" },
      { skill: "Mobile app development", importance: "high" },
      { skill: "Health & fitness domain expertise", importance: "medium" },
    ],
    ecoroute: [
      { skill: "Route optimization algorithms", importance: "high" },
      { skill: "Enterprise API integrations", importance: "high" },
      { skill: "ESG reporting & compliance", importance: "medium" },
    ],
  };

  return {
    successScore: meta.successScore,
    riskLevel: meta.riskLevel,
    complexity: meta.complexity,
    estimatedTimeline: {
      minMonths: meta.timelineMin,
      maxMonths: meta.timelineMax,
    },
    skillGaps: skillSets[meta.slug] ?? [],
    blockers: [
      {
        title: "Market validation incomplete",
        description: `Early traction signals needed for ${meta.title} before scaling development.`,
        severity: meta.riskLevel === "high" ? "high" : "medium",
      },
      {
        title: "Technical scope risk",
        description:
          "Core AI/technical features require proof-of-concept before full build commitment.",
        severity: "medium",
      },
    ],
    recommendations: [
      `Conduct 15+ user interviews for ${meta.title} target market`,
      "Build and ship MVP within 8 weeks with single core workflow",
      "Establish weekly metrics review cadence from day one",
      "Secure design partner customers before public launch",
    ],
    mvpScope: [
      "Core user workflow delivering primary value proposition",
      "Authentication and basic user management",
      "Single integration or data source (expand post-validation)",
      "Analytics dashboard with 3-5 key metrics",
    ],
  };
}

function createReport(meta: DemoProjectMeta): ExecutiveReportData {
  const base = createFallbackExecutiveReport();
  const readinessBoost = Math.floor(meta.successScore * 0.85);
  return {
    ...base,
    executiveSummary: `${meta.title} demonstrates ${meta.successScore >= 75 ? "strong" : "moderate"} viability with a success score of ${meta.successScore}%. ${meta.tagline}. Key risks center around ${meta.riskLevel} market and execution factors that are addressable with the recommended mitigation strategies.`,
    overallAssessment: `The venture is ${meta.successScore >= 75 ? "well-positioned" : "cautiously positioned"} for a phased launch. ${meta.title} benefits from clear problem definition and structured execution planning. Investment readiness is ${readinessBoost >= 60 ? "approaching threshold" : "developing"} with focused execution on identified gaps.`,
    investmentReadinessScore: readinessBoost,
    projectReadinessScore: meta.successScore,
    executionReadinessScore: Math.max(40, meta.successScore - 12),
    teamReadinessScore: Math.max(35, meta.successScore - 18),
    launchReadinessScore: Math.max(30, meta.successScore - 22),
    strengths: [
      `Clear value proposition: ${meta.tagline}`,
      `${meta.complexity} complexity manageable with ${meta.teamSize}-person team`,
      "Structured roadmap with validation milestones",
      "Failure scenarios identified with prevention strategies",
      `Budget of ${meta.budget} aligns with MVP scope`,
    ],
    finalRecommendation: meta.successScore >= 75
      ? `Proceed with phased launch for ${meta.title}. Focus on user validation in first 30 days, then accelerate based on traction signals.`
      : `Proceed cautiously with ${meta.title}. Complete validation milestones before scaling team or budget.`,
  };
}

function buildDemoProject(meta: DemoProjectMeta): DemoProjectFull {
  return {
    ...meta,
    id: `demo-${meta.slug}`,
    analysis: createAnalysis(meta),
    simulation: createFallbackFailureSimulation(),
    roadmap: createFallbackRoadmap(),
    teamPlan: createFallbackTeamPlan(),
    report: createReport(meta),
    createdAt: new Date(Date.now() - Math.random() * 30 * 86400000).toISOString(),
  };
}

export const DEMO_PROJECTS: DemoProjectFull[] =
  DEMO_PROJECTS_META.map(buildDemoProject);

export function getDemoProject(slug: string): DemoProjectFull | undefined {
  return DEMO_PROJECTS.find((p) => p.slug === slug);
}

export function getDemoProjectById(id: string): DemoProjectFull | undefined {
  return DEMO_PROJECTS.find((p) => p.id === id);
}

export const DEMO_PORTFOLIO_ANALYTICS = {
  totalProjects: DEMO_PROJECTS.length,
  analyzedProjects: DEMO_PROJECTS.length,
  averageSuccessScore:
    DEMO_PROJECTS.reduce((s, p) => s + p.successScore, 0) /
    DEMO_PROJECTS.length,
  averageReadiness: 68,
  highRiskProjects: DEMO_PROJECTS.filter((p) => p.riskLevel === "high").length,
  starredProjects: DEMO_PROJECTS.filter((p) => p.isStarred).length,
};

export const DEMO_NOTIFICATIONS = [
  {
    id: "demo-notif-1",
    type: "project_more_viable" as const,
    title: "Analysis Complete",
    message: "LaunchLens AI analysis finished with 82% success score.",
    isRead: false,
    projectId: "demo-launchlens-ai",
    projectTitle: "LaunchLens AI",
    createdAt: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: "demo-notif-2",
    type: "launch_readiness_improved" as const,
    title: "Roadmap Generated",
    message: "StudySync execution roadmap ready with 4 phases.",
    isRead: false,
    projectId: "demo-studysync",
    projectTitle: "StudySync",
    createdAt: new Date(Date.now() - 7200000).toISOString(),
  },
  {
    id: "demo-notif-3",
    type: "goal_progress" as const,
    title: "Simulation Ready",
    message: "FitTrack failure simulation identified 3 critical scenarios.",
    isRead: true,
    projectId: "demo-fittrack",
    projectTitle: "FitTrack",
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: "demo-notif-4",
    type: "launch_readiness_improved" as const,
    title: "Report Created",
    message: "EcoRoute executive report generated — 65% investment readiness.",
    isRead: true,
    projectId: "demo-ecoroute",
    projectTitle: "EcoRoute",
    createdAt: new Date(Date.now() - 172800000).toISOString(),
  },
];

export const DEMO_ACTIVITIES = [
  {
    id: "demo-act-1",
    type: "report_generated" as const,
    title: "Executive report generated",
    description: "EcoRoute — Investment readiness: 65%",
    projectId: "demo-ecoroute",
    createdAt: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: "demo-act-2",
    type: "simulation_generated" as const,
    title: "Failure simulation completed",
    description: "FitTrack — 3 scenarios modeled",
    projectId: "demo-fittrack",
    createdAt: new Date(Date.now() - 7200000).toISOString(),
  },
  {
    id: "demo-act-3",
    type: "roadmap_updated" as const,
    title: "Roadmap generated",
    description: "StudySync — 4-phase execution plan",
    projectId: "demo-studysync",
    createdAt: new Date(Date.now() - 14400000).toISOString(),
  },
  {
    id: "demo-act-4",
    type: "team_plan_created" as const,
    title: "Team plan created",
    description: "LaunchLens AI — 5 roles recommended",
    projectId: "demo-launchlens-ai",
    createdAt: new Date(Date.now() - 28800000).toISOString(),
  },
  {
    id: "demo-act-5",
    type: "project_analyzed" as const,
    title: "Project analyzed",
    description: "LaunchLens AI — 82% success score",
    projectId: "demo-launchlens-ai",
    createdAt: new Date(Date.now() - 43200000).toISOString(),
  },
];
