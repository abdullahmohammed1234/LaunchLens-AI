import type {
  FailureScenario,
  FailureSimulation,
  Level,
} from "@/types/failure-simulation";

const SEVERITY_WEIGHT: Record<Level, number> = {
  low: 1,
  medium: 2,
  high: 3,
};

export function severityToBadgeVariant(
  severity: Level
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

export function severityAccentClass(severity: Level): string {
  switch (severity) {
    case "high":
      return "text-danger";
    case "medium":
      return "text-warning";
    case "low":
      return "text-success";
  }
}

export function severityBorderClass(severity: Level): string {
  switch (severity) {
    case "high":
      return "border-danger/40 hover:border-danger/60";
    case "medium":
      return "border-warning/40 hover:border-warning/60";
    case "low":
      return "border-success/40 hover:border-success/60";
  }
}

export function probabilityColor(probability: number): string {
  if (probability >= 70) return "text-danger";
  if (probability >= 45) return "text-warning";
  return "text-success";
}

export function computeFailureRiskScore(simulation: FailureSimulation): number {
  const scores = simulation.scenarios.map(
    (s) => (s.probability * SEVERITY_WEIGHT[s.severity]) / 3
  );
  const average = scores.reduce((sum, score) => sum + score, 0) / scores.length;
  return Math.round(Math.min(100, average));
}

export function getMostLikelyScenario(
  simulation: FailureSimulation
): FailureScenario {
  return [...simulation.scenarios].sort(
    (a, b) => b.probability - a.probability
  )[0];
}

export function getHighestSeverityScenario(
  simulation: FailureSimulation
): FailureScenario {
  return [...simulation.scenarios].sort((a, b) => {
    const severityDiff =
      SEVERITY_WEIGHT[b.severity] - SEVERITY_WEIGHT[a.severity];
    if (severityDiff !== 0) return severityDiff;
    return b.probability - a.probability;
  })[0];
}

export function getRecommendedPriority(
  simulation: FailureSimulation
): string {
  const critical = getHighestSeverityScenario(simulation);
  return critical.preventionStrategies[0] ?? "Review project scope and constraints";
}

export function inferTimelineSeverity(
  event: { event: string; impact: string },
  index: number,
  total: number
): "neutral" | "warning" | "critical" {
  const text = `${event.event} ${event.impact}`.toLowerCase();
  const criticalKeywords = [
    "abandon",
    "fail",
    "collapse",
    "shutdown",
    "bankrupt",
    "postpone",
    "cancel",
    "burnout",
    "breakdown",
  ];
  const warningKeywords = [
    "delay",
    "scope",
    "debt",
    "overrun",
    "stress",
    "conflict",
    "miss",
    "slip",
    "warning",
  ];

  if (criticalKeywords.some((k) => text.includes(k)) || index >= total - 2) {
    return "critical";
  }
  if (warningKeywords.some((k) => text.includes(k)) || index >= total / 2) {
    return "warning";
  }
  return "neutral";
}

export function failureRiskLabel(score: number): string {
  if (score >= 70) return "Critical exposure";
  if (score >= 45) return "Elevated risk";
  return "Manageable risk";
}
