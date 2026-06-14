import type { AnalyzeProjectInput } from "@/lib/validations/analysis";
import type { ProjectAnalysis } from "@/lib/validations/analysis";
import type { FailureSimulation } from "@/types/failure-simulation";
import type { Roadmap } from "@/types/roadmap";

const OUTPUT_SCHEMA = `{
  "recommendedTeamSize": number (1-50),
  "roles": [
    {
      "title": string,
      "priority": "critical" | "high" | "medium" | "low",
      "reason": string,
      "responsibilities": [string],
      "skills": [string]
    }
  ],
  "skillGaps": [
    {
      "skill": string,
      "severity": "low" | "medium" | "high",
      "reason": string,
      "category": "critical" | "important" | "optional"
    }
  ],
  "skillReadiness": [
    {
      "skill": string,
      "currentLevel": number (0-100),
      "requiredLevel": number (0-100),
      "category": "critical" | "important" | "optional"
    }
  ],
  "teamRisks": [
    {
      "title": string,
      "description": string,
      "severity": "low" | "medium" | "high",
      "mitigation": string
    }
  ],
  "hiringOrder": [
    {
      "title": string,
      "priority": "critical" | "high" | "medium" | "low",
      "timing": string,
      "rationale": string
    }
  ],
  "founderRecommendations": [
    {
      "title": string,
      "description": string
    }
  ],
  "teamScenarios": [
    {
      "name": "Solo Founder" | "Small Team" | "Expanded Team",
      "successImpact": string,
      "costImpact": string,
      "timelineImpact": string,
      "riskImpact": string,
      "summary": string
    }
  ]
}`;

export interface TeamPlanPromptInput {
  project: AnalyzeProjectInput;
  analysis: ProjectAnalysis;
  simulation: FailureSimulation | null;
  roadmap: Roadmap | null;
}

export function buildTeamPlanPrompt(
  input: TeamPlanPromptInput,
  retryAttempt = 0
): string {
  const retryNote =
    retryAttempt > 0
      ? `\n\nIMPORTANT: Your previous response was invalid JSON or missing required fields. Return ONLY valid JSON matching the exact schema. Include exactly 3 teamScenarios. No markdown, no code fences, no extra keys.`
      : "";

  const blockersSummary = input.analysis.blockers
    .map((b) => `- ${b.title} (${b.severity}): ${b.description}`)
    .join("\n");

  const skillGapsSummary = input.analysis.skillGaps
    .map((g) => `- ${g.skill} (${g.importance})`)
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
    : "No failure simulation available — infer team risks from analysis.";

  const roadmapSummary = input.roadmap
    ? input.roadmap.phases
        .map(
          (p) =>
            `- ${p.title} (${p.durationWeeks} weeks): ${p.description.slice(0, 120)}`
        )
        .join("\n")
    : "No roadmap available — infer execution needs from analysis.";

  const roadmapTasks = input.roadmap
    ? input.roadmap.phases
        .flatMap((p) => p.tasks.filter((t) => t.priority === "high"))
        .slice(0, 8)
        .map((t) => `- ${t.title}`)
        .join("\n")
    : "";

  return `You are a senior CTO and startup founder advising on team composition. Your job is to determine the ideal team structure and identify skill gaps required for MVP success — not generic HR advice.

Given a project, its analysis, failure simulation, and execution roadmap, recommend:
- What roles are needed (realistic for startups and student projects)
- What skills are missing
- What expertise is required
- Which hires are highest priority
- Where the team is vulnerable

Speak like a founder who has shipped products with limited resources. Be direct, practical, and MVP-focused.

PROJECT:
- Title: ${input.project.title}
- Description: ${input.project.description}
- Stated Timeline: ${input.project.timeline}
- Budget: ${input.project.budget}
- Current Team Size: ${input.project.teamSize}
- Experience Level: ${input.project.experienceLevel}

ANALYSIS:
- Success Score: ${input.analysis.successScore}/100
- Risk Level: ${input.analysis.riskLevel}
- Complexity: ${input.analysis.complexity}
- Estimated MVP Timeline: ${input.analysis.estimatedTimeline.minMonths}-${input.analysis.estimatedTimeline.maxMonths} months
- Blockers:
${blockersSummary}
- Existing Skill Gaps:
${skillGapsSummary}
- MVP Scope:
${mvpScopeSummary}
- Recommendations: ${input.analysis.recommendations.join("; ")}

FAILURE SCENARIOS:
${simulationSummary}

EXECUTION ROADMAP:
${roadmapSummary}
${roadmapTasks ? `\nHigh-Priority Roadmap Tasks:\n${roadmapTasks}` : ""}

TEAM PLANNING RULES:
1. recommendedTeamSize must be realistic for MVP delivery — avoid overstaffing. For student/solo projects, 1-3 is common; for funded startups, 3-6 max for MVP.
2. roles: 3-8 roles tailored to THIS project. Include only roles essential for MVP — defer growth, ops, and scale roles.
3. Prioritize with critical|high|medium|low based on MVP blockers, not nice-to-haves.
4. skillGaps: 4-12 gaps referencing actual project needs. category maps to critical (blocks MVP), important (slows delivery), optional (post-launch).
5. skillReadiness: 4-10 skills with currentLevel (based on stated experienceLevel and teamSize) vs requiredLevel for MVP success.
6. teamRisks: 3-8 risks like single point of failure, missing technical leadership, no design expertise, overloaded founder — each with actionable mitigation.
7. hiringOrder: 3-6 sequenced hires with timing (e.g. "Week 1-2", "After MVP validation", "Month 3") and rationale tied to roadmap phases.
8. founderRecommendations: 4-8 direct founder advice items — learn skills, validate demand, avoid premature hiring, reduce scope.
9. teamScenarios: exactly 3 scenarios comparing Solo Founder vs Small Team (2-4) vs Expanded Team (5+). Include success, cost, timeline, and risk impact as concise labels (e.g. "Low", "Medium", "High" or "+3 months").
10. Do NOT recommend large teams, VPs, or enterprise roles for early-stage MVPs.
11. Address identified blockers, failure scenarios, and roadmap complexity in role priorities.
12. For beginner experience level, recommend learning over hiring where feasible.

OUTPUT FORMAT:
Return ONLY a single JSON object. No markdown. No explanation. No extra fields.
Exact schema:
${OUTPUT_SCHEMA}${retryNote}`;
}
