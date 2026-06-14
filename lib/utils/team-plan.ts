import type {
  RolePriority,
  Severity,
  SkillCategory,
  StoredTeamPlan,
  TeamPlan,
} from "@/types/team-plan";

const SEVERITY_WEIGHT: Record<Severity, number> = {
  low: 1,
  medium: 2,
  high: 3,
};

const PRIORITY_WEIGHT: Record<RolePriority, number> = {
  critical: 4,
  high: 3,
  medium: 2,
  low: 1,
};

export function severityToBadgeVariant(
  severity: Severity
): "success" | "warning" | "danger" {
  switch (severity) {
    case "low":
      return "success";
    case "medium":
      return "warning";
    case "high":
      return "danger";
  }
}

export function severityAccentClass(severity: Severity): string {
  switch (severity) {
    case "high":
      return "text-danger";
    case "medium":
      return "text-warning";
    case "low":
      return "text-success";
  }
}

export function severityBorderClass(severity: Severity): string {
  switch (severity) {
    case "high":
      return "border-danger/40 hover:border-danger/60";
    case "medium":
      return "border-warning/40 hover:border-warning/60";
    case "low":
      return "border-success/40 hover:border-success/60";
  }
}

export function priorityToBadgeVariant(
  priority: RolePriority
): "danger" | "warning" | "secondary" | "default" {
  switch (priority) {
    case "critical":
      return "danger";
    case "high":
      return "warning";
    case "medium":
      return "secondary";
    case "low":
      return "secondary";
  }
}

export function priorityAccentClass(priority: RolePriority): string {
  switch (priority) {
    case "critical":
      return "text-danger";
    case "high":
      return "text-warning";
    case "medium":
      return "text-primary";
    case "low":
      return "text-muted";
  }
}

export function categoryAccentClass(category: SkillCategory): string {
  switch (category) {
    case "critical":
      return "text-danger";
    case "important":
      return "text-warning";
    case "optional":
      return "text-success";
  }
}

export function categoryLabel(category: SkillCategory): string {
  switch (category) {
    case "critical":
      return "Critical";
    case "important":
      return "Important";
    case "optional":
      return "Optional";
  }
}

export function countCriticalRoles(plan: TeamPlan): number {
  return plan.roles.filter(
    (role) => role.priority === "critical" || role.priority === "high"
  ).length;
}

export function computeTeamRiskScore(plan: TeamPlan): number {
  if (plan.teamRisks.length === 0) return 0;
  const scores = plan.teamRisks.map(
    (risk) => (SEVERITY_WEIGHT[risk.severity] / 3) * 100
  );
  return Math.round(
    scores.reduce((sum, score) => sum + score, 0) / scores.length
  );
}

export function computeFounderReadiness(plan: TeamPlan): number {
  if (plan.skillReadiness.length === 0) return 0;
  const gaps = plan.skillReadiness.map((skill) => {
    const deficit = Math.max(0, skill.requiredLevel - skill.currentLevel);
    return Math.max(0, 100 - deficit);
  });
  return Math.round(
    gaps.reduce((sum, value) => sum + value, 0) / gaps.length
  );
}

export function countHighSeverityGaps(plan: TeamPlan): number {
  return plan.skillGaps.filter((gap) => gap.severity === "high").length;
}

export function sortRolesByPriority(roles: TeamPlan["roles"]) {
  return [...roles].sort(
    (a, b) => PRIORITY_WEIGHT[b.priority] - PRIORITY_WEIGHT[a.priority]
  );
}

export function groupSkillGapsByCategory(plan: TeamPlan) {
  const groups: Record<SkillCategory, typeof plan.skillGaps> = {
    critical: [],
    important: [],
    optional: [],
  };

  for (const gap of plan.skillGaps) {
    groups[gap.category].push(gap);
  }

  return groups;
}

export function getTeamPlanSummary(plan: StoredTeamPlan) {
  return {
    recommendedTeamSize: plan.recommendedTeamSize,
    criticalRoles: countCriticalRoles(plan),
    skillGapCount: plan.skillGaps.length,
    teamRiskScore: computeTeamRiskScore(plan),
    founderReadiness: computeFounderReadiness(plan),
  };
}
