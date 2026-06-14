import type { AnalyzeProjectInput } from "@/lib/validations/analysis";
import type { ProjectAnalysis } from "@/lib/validations/analysis";
import type { FailureSimulation } from "@/types/failure-simulation";

const OUTPUT_SCHEMA = `{
  "estimatedDurationMonths": number (1-36),
  "phases": [
    {
      "title": string,
      "description": string,
      "durationWeeks": number (1-52),
      "milestones": [
        { "title": string, "description": string }
      ],
      "tasks": [
        { "title": string, "priority": "low" | "medium" | "high", "estimatedHours": number }
      ]
    }
  ],
  "launchChecklist": [
    { "title": string, "description": string }
  ],
  "criticalSuccessFactors": [
    { "title": string, "description": string }
  ],
  "recommendedBuildOrder": [
    { "title": string, "rationale": string, "dependsOn": [string] }
  ],
  "planComparison": {
    "currentPlanSummary": string,
    "optimizedPlanSummary": string,
    "durationDifference": string,
    "scopeChanges": [string],
    "riskMitigations": [string]
  }
}`;

export interface RoadmapPromptInput {
  project: AnalyzeProjectInput;
  analysis: ProjectAnalysis;
  simulation: FailureSimulation | null;
}

export function buildRoadmapPrompt(
  input: RoadmapPromptInput,
  retryAttempt = 0
): string {
  const retryNote =
    retryAttempt > 0
      ? `\n\nIMPORTANT: Your previous response was invalid JSON or missing required fields. Return ONLY valid JSON matching the exact schema with 3-5 phases. No markdown, no code fences, no extra keys.`
      : "";

  const blockersSummary = input.analysis.blockers
    .map((b) => `- ${b.title} (${b.severity}): ${b.description}`)
    .join("\n");

  const mvpScopeSummary = input.analysis.mvpScope
    .map((item) => `- ${item}`)
    .join("\n");

  const simulationSummary = input.simulation
    ? input.simulation.scenarios
        .map(
          (s) =>
            `- ${s.title} (${s.probability}% probability, ${s.severity} severity): ${s.summary}`
        )
        .join("\n")
    : "No failure simulation available — infer risks from analysis.";

  const preventionSummary = input.simulation
    ? input.simulation.scenarios
        .flatMap((s) => s.preventionStrategies.slice(0, 2))
        .slice(0, 6)
        .map((s) => `- ${s}`)
        .join("\n")
    : "";

  return `You are a senior CTO and startup execution advisor. Your job is to turn project intelligence into a realistic, actionable execution roadmap — not generic startup advice.

Given a project, its feasibility analysis, and failure simulation insights, generate a phased execution plan that answers:
- What should be built first?
- What should be delayed?
- What milestones should exist?
- What tasks should be completed?
- How should the project be launched?

PROJECT:
- Title: ${input.project.title}
- Description: ${input.project.description}
- Stated Timeline: ${input.project.timeline}
- Budget: ${input.project.budget}
- Team Size: ${input.project.teamSize}
- Experience Level: ${input.project.experienceLevel}

ANALYSIS:
- Success Score: ${input.analysis.successScore}/100
- Risk Level: ${input.analysis.riskLevel}
- Complexity: ${input.analysis.complexity}
- Estimated MVP Timeline: ${input.analysis.estimatedTimeline.minMonths}-${input.analysis.estimatedTimeline.maxMonths} months
- Blockers:
${blockersSummary}
- MVP Scope:
${mvpScopeSummary}
- Recommendations: ${input.analysis.recommendations.join("; ")}

FAILURE SCENARIOS:
${simulationSummary}
${preventionSummary ? `\nKey Prevention Strategies:\n${preventionSummary}` : ""}

ROADMAP RULES:
1. Generate 3-5 phases (e.g. Research, Planning, MVP Development, Testing, Launch — or equivalents tailored to THIS project).
2. Each phase must have 2-5 milestones and 3-10 tasks with realistic estimatedHours.
3. Prioritize MVP delivery — defer nice-to-have features explicitly in phase ordering and build order.
4. Tasks must be specific to this project — reference actual features, tech choices, and constraints. No fluff like "build the app".
5. recommendedBuildOrder: 4-8 sequenced items with clear rationale and dependsOn references to earlier items.
6. criticalSuccessFactors: 3-6 non-obvious, project-specific success criteria (not generic "work hard").
7. launchChecklist: 5-10 concrete pre-launch items with descriptions.
8. planComparison: contrast the user's CURRENT stated plan (timeline, scope, approach) vs your OPTIMIZED roadmap — be specific about duration, scope cuts, and risk reductions.
9. estimatedDurationMonths must be realistic given team size, experience, and complexity.
10. Address identified blockers and failure scenarios in phase ordering and task priorities.
11. High-priority tasks should appear in early phases; defer advanced analytics, scaling, and polish.

OUTPUT FORMAT:
Return ONLY a single JSON object. No markdown. No explanation. No extra fields.
Exact schema:
${OUTPUT_SCHEMA}${retryNote}`;
}
