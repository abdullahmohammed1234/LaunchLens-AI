import type { Level } from "@/types/failure-simulation";

export function scoreColor(score: number): string {
  if (score >= 75) return "text-success";
  if (score >= 55) return "text-warning";
  return "text-danger";
}

export function scoreBgColor(score: number): string {
  if (score >= 75) return "bg-success";
  if (score >= 55) return "bg-warning";
  return "bg-danger";
}

export function levelToBadgeVariant(
  level: Level | string
): "success" | "warning" | "danger" | "secondary" {
  switch (level) {
    case "low":
      return "success";
    case "medium":
      return "warning";
    case "high":
      return "danger";
    default:
      return "secondary";
  }
}

export function levelAccentClass(level: Level | string): string {
  switch (level) {
    case "low":
      return "text-success";
    case "medium":
      return "text-warning";
    case "high":
      return "text-danger";
    default:
      return "text-muted";
  }
}

export function getProjectTitle(
  projectId: string,
  titles: Record<string, string>
): string {
  return titles[projectId] ?? "Unknown Project";
}

export const CHART_COLORS = [
  "#6366F1",
  "#8B5CF6",
  "#EC4899",
  "#14B8A6",
  "#F59E0B",
];

export const RADAR_AXES = [
  { key: "risk", label: "Risk" },
  { key: "complexity", label: "Complexity" },
  { key: "execution", label: "Execution" },
  { key: "teamNeeds", label: "Team Needs" },
  { key: "readiness", label: "Readiness" },
] as const;
