import type {
  Blocker,
  ProjectAnalysis,
  SkillGap,
} from "@/lib/validations/analysis";

type Level = "low" | "medium" | "high";

export const ANALYSIS_STORAGE_KEY = "launchlens-analysis-result";

export function levelToBadgeVariant(
  level: Level
): "success" | "warning" | "danger" {
  switch (level) {
    case "low":
      return "success";
    case "medium":
      return "warning";
    case "high":
      return "danger";
  }
}

export function successScoreColor(score: number): string {
  if (score >= 70) return "text-success";
  if (score >= 40) return "text-warning";
  return "text-danger";
}

export function successScoreLabel(score: number): string {
  if (score >= 70) return "Strong feasibility";
  if (score >= 40) return "Moderate feasibility";
  return "Low feasibility";
}

export function formatTimeline(analysis: ProjectAnalysis): string {
  const { minMonths, maxMonths } = analysis.estimatedTimeline;
  if (minMonths === maxMonths) {
    return `${minMonths} month${minMonths === 1 ? "" : "s"}`;
  }
  return `${minMonths}–${maxMonths} months`;
}

export function importanceToValue(level: Level): number {
  switch (level) {
    case "high":
      return 100;
    case "medium":
      return 65;
    case "low":
      return 35;
  }
}

export function levelBorderClass(level: Level): string {
  switch (level) {
    case "high":
      return "border-danger/40 hover:border-danger/60";
    case "medium":
      return "border-warning/40 hover:border-warning/60";
    case "low":
      return "border-success/40 hover:border-success/60";
  }
}

export function levelAccentClass(level: Level): string {
  switch (level) {
    case "high":
      return "text-danger";
    case "medium":
      return "text-warning";
    case "low":
      return "text-success";
  }
}

export function groupByLevel<T extends { importance?: Level; severity?: Level }>(
  items: T[],
  key: "importance" | "severity" = "importance"
): Record<Level, T[]> {
  const groups: Record<Level, T[]> = { high: [], medium: [], low: [] };
  for (const item of items) {
    const level = (key === "importance" ? item.importance : item.severity) ?? "medium";
    groups[level].push(item);
  }
  return groups;
}

export function sortBlockersBySeverity(blockers: Blocker[]): Blocker[] {
  const order: Record<Level, number> = { high: 0, medium: 1, low: 2 };
  return [...blockers].sort((a, b) => order[a.severity] - order[b.severity]);
}

export function sortSkillGapsByImportance(gaps: SkillGap[]): SkillGap[] {
  const order: Record<Level, number> = { high: 0, medium: 1, low: 2 };
  return [...gaps].sort((a, b) => order[a.importance] - order[b.importance]);
}
