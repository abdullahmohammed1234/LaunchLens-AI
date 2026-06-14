import type { AnalyzeProjectInput } from "@/lib/validations/analysis";
import type { ProjectAnalysis } from "@/lib/validations/analysis";

const OUTPUT_SCHEMA = `{
  "scenarios": [
    {
      "title": string,
      "summary": string,
      "probability": number (0-100),
      "severity": "low" | "medium" | "high",
      "timeline": [
        { "month": number, "event": string, "impact": string }
      ],
      "rootCauses": [
        { "title": string, "description": string, "severity": "low" | "medium" | "high" }
      ],
      "preventionStrategies": [string]
    }
  ]
}`;

export interface FailureSimulationPromptInput {
  project: AnalyzeProjectInput;
  analysis: ProjectAnalysis;
}

export function buildFailureSimulationPrompt(
  input: FailureSimulationPromptInput,
  retryAttempt = 0
): string {
  const retryNote =
    retryAttempt > 0
      ? `\n\nIMPORTANT: Your previous response was invalid JSON or missing required fields. Return ONLY valid JSON matching the exact schema with exactly 3 scenarios. No markdown, no code fences, no extra keys.`
      : "";

  const blockersSummary = input.analysis.blockers
    .map((b) => `- ${b.title} (${b.severity}): ${b.description}`)
    .join("\n");

  const skillGapsSummary = input.analysis.skillGaps
    .map((g) => `- ${g.skill} (${g.importance} importance)`)
    .join("\n");

  return `You are a senior product strategist and engineering advisor specializing in project failure analysis.

Given a project and its feasibility analysis, simulate realistic failure paths — not generic startup advice. Each scenario must be specific to THIS project's constraints, team, budget, and scope.

PROJECT:
- Title: ${input.project.title}
- Description: ${input.project.description}
- Stated Timeline: ${input.project.timeline}
- Budget: ${input.project.budget}
- Team Size: ${input.project.teamSize}
- Experience Level: ${input.project.experienceLevel}

EXISTING ANALYSIS:
- Success Score: ${input.analysis.successScore}/100
- Risk Level: ${input.analysis.riskLevel}
- Complexity: ${input.analysis.complexity}
- Estimated MVP Timeline: ${input.analysis.estimatedTimeline.minMonths}-${input.analysis.estimatedTimeline.maxMonths} months
- Blockers:
${blockersSummary}
- Skill Gaps:
${skillGapsSummary}
- Recommendations: ${input.analysis.recommendations.join("; ")}

SIMULATION RULES:
1. Generate EXACTLY 3 distinct, realistic failure scenarios (e.g. Scope Creep Collapse, Technical Debt Spiral, Burnout & Abandonment, Marketing Failure, Team Dependency Failure, Budget Overrun — pick the most relevant for this project).
2. Each scenario must tell a coherent story: what goes wrong, when, and why.
3. probability (0-100): likelihood this failure path occurs given the project constraints. Scenarios should have different probabilities.
4. severity: impact if this failure path fully plays out.
5. timeline: 4-8 monthly events showing progressive deterioration. month values must increase. Start neutral, escalate to critical. Be specific to the project — not generic.
6. rootCauses: 2-5 underlying causes with title, description, and severity. Reference actual project constraints.
7. preventionStrategies: 3-6 concrete, actionable steps — not fluff like "plan better". Each should be a specific task the team can act on this week.
8. Avoid repeating the same failure across scenarios. Each scenario explores a different failure mode.
9. Tie every detail to the project's actual scope, team size, budget, and experience level.

OUTPUT FORMAT:
Return ONLY a single JSON object. No markdown. No explanation. No extra fields.
Exact schema:
${OUTPUT_SCHEMA}${retryNote}`;
}
