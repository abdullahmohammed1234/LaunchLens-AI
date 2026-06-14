import {
  BarChart3,
  Briefcase,
  FileText,
  FlaskConical,
  FolderKanban,
  GitCompare,
  Map,
  Target,
  Users,
  type LucideIcon,
} from "lucide-react";

export interface EmptyStateConfig {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel: string;
  actionHref: string;
  secondaryAction?: { label: string; href: string };
}

export const EMPTY_STATES = {
  projects: {
    icon: FolderKanban,
    title: "Analyze your first project idea",
    description:
      "Discover its success potential with AI-powered feasibility analysis, risk detection, and strategic insights.",
    actionLabel: "Analyze a Project",
    actionHref: "/analyzer",
    secondaryAction: { label: "Explore Demo", href: "/demo" },
  },
  dashboard: {
    icon: Briefcase,
    title: "Your founder workspace awaits",
    description:
      "Create a project and run AI analysis to unlock portfolio intelligence, goals tracking, and executive insights.",
    actionLabel: "Start with Analyzer",
    actionHref: "/analyzer",
    secondaryAction: { label: "Load Demo Data", href: "/demo" },
  },
  portfolio: {
    icon: Briefcase,
    title: "Build your portfolio intelligence",
    description:
      "Add projects and run analyses to see success scores, risk distribution, and readiness metrics across your ventures.",
    actionLabel: "Create Project",
    actionHref: "/projects/new",
    secondaryAction: { label: "Try Demo", href: "/demo" },
  },
  analyzer: {
    icon: BarChart3,
    title: "Ready to validate your idea?",
    description:
      "Describe your project concept and our AI will evaluate market fit, feasibility, risks, and execution requirements.",
    actionLabel: "Use Sample Project",
    actionHref: "/analyzer",
  },
  simulator: {
    icon: FlaskConical,
    title: "No simulations yet",
    description:
      "Run an analysis first, then simulate failure scenarios to identify risks before they become reality.",
    actionLabel: "Go to Analyzer",
    actionHref: "/analyzer",
  },
  roadmap: {
    icon: Map,
    title: "No roadmaps generated",
    description:
      "Complete project analysis to unlock AI-generated execution roadmaps with phases, milestones, and launch checklists.",
    actionLabel: "Analyze a Project",
    actionHref: "/analyzer",
  },
  team: {
    icon: Users,
    title: "No team plans yet",
    description:
      "After analyzing a project, generate team recommendations with skill gaps, hiring priorities, and role definitions.",
    actionLabel: "Start Analysis",
    actionHref: "/analyzer",
  },
  reports: {
    icon: FileText,
    title: "No executive reports",
    description:
      "Generate investor-ready intelligence reports combining analysis, simulation, roadmap, and team insights.",
    actionLabel: "Create Project",
    actionHref: "/projects/new",
  },
  compare: {
    icon: GitCompare,
    title: "Compare your best ideas",
    description:
      "Add at least two analyzed projects to compare success scores, risks, and strategic fit side-by-side.",
    actionLabel: "View Projects",
    actionHref: "/projects",
  },
  activity: {
    icon: Target,
    title: "Your activity feed is empty",
    description:
      "Create projects, run analyses, and generate insights — your portfolio activity will appear here.",
    actionLabel: "Get Started",
    actionHref: "/analyzer",
  },
  notifications: {
    icon: Target,
    title: "All caught up",
    description:
      "You'll receive alerts when analyses complete, risks change, or projects need attention.",
    actionLabel: "Run Analysis",
    actionHref: "/analyzer",
  },
} as const satisfies Record<string, EmptyStateConfig>;
