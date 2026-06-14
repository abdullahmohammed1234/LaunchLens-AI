import type { AnalyzeProjectInput } from "@/lib/validations/analysis";
import type { ProjectAnalysis } from "@/lib/validations/analysis";
import type { FailureSimulation } from "@/types/failure-simulation";
import type { Roadmap } from "@/types/roadmap";
import type { TeamPlan } from "@/types/team-plan";
import type { ProjectComparisonResult } from "@/types/project-comparison";

const OUTPUT_SCHEMA = `{
  "executiveSummary": string,
  "overallAssessment": string,
  "strengths": [string],
  "weaknesses": [string],
  "criticalRisks": [
    {
      "title": string,
      "severity": "low" | "medium" | "high",
      "impact": string,
      "likelihood": "low" | "medium" | "high",
      "mitigation": string,
      "source": "analysis" | "simulation" | "roadmap" | "team"
    }
  ],
  "successFactors": [string],
  "investmentReadinessScore": number (0-100),
  "projectReadinessScore": number (0-100),
  "executionReadinessScore": number (0-100),
  "teamReadinessScore": number (0-100),
  "launchReadinessScore": number (0-100),
  "recommendedNextSteps": [
    {
      "title": string,
      "priority": "critical" | "high" | "medium",
      "impact": string,
      "order": number
    }
  ],
  "finalRecommendation": string
}`;

export interface ExecutiveReportPromptInput {
  project: AnalyzeProjectInput;
  analysis: ProjectAnalysis;
  simulation: FailureSimulation | null;
  roadmap: Roadmap | null;
  teamPlan: TeamPlan | null;
  comparison: ProjectComparisonResult | null;
}

export function buildExecutiveReportPrompt(
  input: ExecutiveReportPromptInput,
  retryAttempt = 0
): string {
  const retryNote =
    retryAttempt > 0
      ? `\n\nIMPORTANT: Your previous response was invalid JSON or missing required fields. Return ONLY valid JSON matching the exact schema. No markdown, no code fences, no extra keys.`
      : "";

  const blockersSummary = input.analysis.blockers
    .map((b) => `- ${b.title} (${b.severity}): ${b.description}`)
    .join("\n");

  const simulationSummary = input.simulation
    ? input.simulation.scenarios
        .map(
          (s) =>
            `- ${s.title} (${s.probability}% probability, ${s.severity} severity): ${s.summary}`
        )
        .join("\n")
    : "No failure simulation available.";

  const roadmapSummary = input.roadmap
    ? `- Duration: ${input.roadmap.estimatedDurationMonths} months
- Phases: ${input.roadmap.phases.map((p) => p.title).join(", ")}
- Critical success factors: ${input.roadmap.criticalSuccessFactors
        .map((f) => f.title)
        .join(", ")}
- Launch checklist items: ${input.roadmap.launchChecklist.length}`
    : "No roadmap available.";

  const teamSummary = input.teamPlan
    ? `- Recommended team size: ${input.teamPlan.recommendedTeamSize}
- Key roles: ${input.teamPlan.roles
        .slice(0, 5)
        .map((r) => r.title)
        .join(", ")}
- Skill gaps: ${input.teamPlan.skillGaps
        .slice(0, 5)
        .map((g) => `${g.skill} (${g.severity})`)
        .join(", ")}
- Team risks: ${input.teamPlan.teamRisks
        .slice(0, 3)
        .map((r) => r.title)
        .join(", ")}`
    : "No team plan available.";

  const comparisonSummary = input.comparison
    ? `- Comparison summary: ${input.comparison.comparisonSummary}
- Winner: ${input.comparison.winner}
- Strategic advice: ${input.comparison.decision.strategicAdvice}`
    : "No comparison data available.";

  return `You are a senior strategy consultant, startup advisor, and CTO preparing an executive intelligence report for decision makers — investors, accelerators, and founding teams.

Synthesize ALL available project intelligence into a professional executive report. Write like McKinsey or a top-tier startup advisory firm: concise, realistic, actionable. Avoid hype and generic startup platitudes.

PROJECT:
- Title: ${input.project.title}
- Description: ${input.project.description}
- Budget: ${input.project.budget}
- Timeline: ${input.project.timeline}
- Team Size: ${input.project.teamSize}
- Experience Level: ${input.project.experienceLevel}

ANALYSIS:
- Success Score: ${input.analysis.successScore}/100
- Risk Level: ${input.analysis.riskLevel}
- Complexity: ${input.analysis.complexity}
- Timeline: ${input.analysis.estimatedTimeline.minMonths}-${input.analysis.estimatedTimeline.maxMonths} months
- Blockers:
${blockersSummary}
- Recommendations: ${input.analysis.recommendations.slice(0, 5).join("; ")}

FAILURE SIMULATION:
${simulationSummary}

ROADMAP:
${roadmapSummary}

TEAM PLAN:
${teamSummary}

COMPARISON (optional):
${comparisonSummary}

SCORING GUIDANCE:
- investmentReadinessScore: investor readiness — market clarity, traction potential, defensibility
- projectReadinessScore: idea validation, problem-solution fit, MVP clarity
- executionReadinessScore: roadmap feasibility, technical complexity, resource alignment
- teamReadinessScore: skill coverage, hiring feasibility, founder gaps
- launchReadinessScore: go-to-market readiness, launch checklist completion potential

RISK AGGREGATION:
Unify risks from analysis blockers, simulation scenarios, roadmap challenges, and team gaps into criticalRisks with severity, impact, likelihood, mitigation, and source.

NEXT STEPS:
Provide 4-8 prioritized recommendedNextSteps with clear execution order (order field), priority level, and expected impact.

Return ONLY valid JSON matching this exact schema:
${OUTPUT_SCHEMA}${retryNote}`;
}
