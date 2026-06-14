import type { RiskLevel } from "@/types/portfolio";

export function riskLevelToScore(level: RiskLevel | null | undefined): number {
  if (!level) return 50;
  switch (level) {
    case "low":
      return 25;
    case "medium":
      return 50;
    case "high":
      return 85;
  }
}

export function scoreToRiskLevel(score: number): RiskLevel {
  if (score <= 35) return "low";
  if (score <= 65) return "medium";
  return "high";
}

export function calculateReadinessScore(report: {
  investmentReadinessScore: number;
  projectReadinessScore?: number;
  executionReadinessScore?: number;
  teamReadinessScore?: number;
  launchReadinessScore?: number;
}): number {
  const scores = [
    report.investmentReadinessScore,
    report.projectReadinessScore,
    report.executionReadinessScore,
    report.teamReadinessScore,
    report.launchReadinessScore,
  ].filter((s): s is number => typeof s === "number");

  if (scores.length === 0) return report.investmentReadinessScore;
  return Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
}

export function calculatePortfolioHealth(
  avgSuccess: number,
  avgRisk: number,
  avgReadiness: number,
  analyzedRatio: number
): number {
  const successComponent = avgSuccess * 0.35;
  const riskComponent = (100 - avgRisk) * 0.25;
  const readinessComponent = avgReadiness * 0.25;
  const coverageComponent = analyzedRatio * 100 * 0.15;
  return Math.round(
    successComponent + riskComponent + readinessComponent + coverageComponent
  );
}

export function getAttentionReason(
  successScore: number | null,
  riskLevel: RiskLevel | null,
  readinessScore: number | null,
  hasAnalysis: boolean
): string | null {
  if (!hasAnalysis) return "No analysis yet — run AI analysis to assess viability";
  if (riskLevel === "high") return "High risk level detected";
  if (successScore !== null && successScore < 40) return "Low success score";
  if (readinessScore !== null && readinessScore < 50)
    return "Below-average readiness";
  return null;
}

export const SUCCESS_BUCKETS = [
  { range: "0-20", min: 0, max: 20 },
  { range: "21-40", min: 21, max: 40 },
  { range: "41-60", min: 41, max: 60 },
  { range: "61-80", min: 61, max: 80 },
  { range: "81-100", min: 81, max: 100 },
] as const;

export const PORTFOLIO_CHART_COLORS = [
  "#6366F1",
  "#8B5CF6",
  "#06B6D4",
  "#10B981",
  "#F59E0B",
  "#EF4444",
];
