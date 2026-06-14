import {
  BarChart3,
  Brain,
  Briefcase,
  FileText,
  FlaskConical,
  FolderKanban,
  GitCompare,
  LayoutDashboard,
  Map,
  Settings,
  Users,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  description?: string;
  tourId?: string;
}

export const SIDEBAR_NAV_ITEMS: NavItem[] = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    description: "Founder command center",
    tourId: "nav-dashboard",
  },
  {
    label: "Portfolio",
    href: "/portfolio",
    icon: Briefcase,
    description: "Portfolio intelligence",
    tourId: "nav-portfolio",
  },
  {
    label: "Projects",
    href: "/projects",
    icon: FolderKanban,
    description: "Manage your projects",
    tourId: "nav-projects",
  },
  {
    label: "Analyzer",
    href: "/analyzer",
    icon: BarChart3,
    description: "Analyze project ideas",
    tourId: "nav-analyzer",
  },
  {
    label: "Simulator",
    href: "/simulator",
    icon: FlaskConical,
    description: "Simulate failure paths",
    tourId: "nav-simulator",
  },
  {
    label: "Roadmap",
    href: "/roadmap",
    icon: Map,
    description: "Execution roadmap",
    tourId: "nav-roadmap",
  },
  {
    label: "Team Builder",
    href: "/team",
    icon: Users,
    description: "Team & skill gaps",
    tourId: "nav-team",
  },
  {
    label: "Compare",
    href: "/compare",
    icon: GitCompare,
    description: "Choose your best idea",
    tourId: "nav-compare",
  },
  {
    label: "Reports",
    href: "/reports",
    icon: FileText,
    description: "Executive intelligence reports",
    tourId: "nav-reports",
  },
  {
    label: "AI Mentor",
    href: "/mentor",
    icon: Brain,
    description: "Strategic advisor & co-founder",
    tourId: "nav-mentor",
  },
  {
    label: "Settings",
    href: "/settings",
    icon: Settings,
    description: "Account preferences",
    tourId: "nav-settings",
  },
];
