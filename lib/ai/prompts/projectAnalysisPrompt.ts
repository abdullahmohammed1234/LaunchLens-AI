import type { AnalyzeProjectInput } from "@/lib/validations/analysis";

const OUTPUT_SCHEMA = `{
  "successScore": number (0-100),
  "riskLevel": "low" | "medium" | "high",
  "complexity": "low" | "medium" | "high",
  "estimatedTimeline": {
    "minMonths": number,
    "maxMonths": number
  },
  "skillGaps": [
    { "skill": string, "importance": "low" | "medium" | "high" }
  ],
  "blockers": [
    { "title": string, "description": string, "severity": "low" | "medium" | "high" }
  ],
  "recommendations": [string],
  "mvpScope": [string]
}`;

export function buildProjectAnalysisPrompt(
  input: AnalyzeProjectInput,
  retryAttempt = 0
): string {
  const retryNote =
    retryAttempt > 0
      ? `\n\nIMPORTANT: Your previous response was invalid JSON or missing required fields. Return ONLY valid JSON matching the exact schema. No markdown, no code fences, no extra keys.`
      : "";

  return `You are a senior software engineering advisor evaluating a project idea for a builder with ${input.experienceLevel} experience.

Analyze this project realistically. Assume execution risks matter more than market hype. Focus on software engineering constraints, team capacity, and delivery feasibility — not generic startup advice.

PROJECT INPUT:
- Title: ${input.title}
- Description: ${input.description}
- Stated Timeline: ${input.timeline}
- Budget: ${input.budget}
- Team Size: ${input.teamSize}
- Experience Level: ${input.experienceLevel}

ANALYSIS RULES:
1. Be realistic — do not be overly optimistic. Penalize vague scope, unrealistic timelines, and skill mismatches.
2. successScore (0-100): likelihood of shipping a viable MVP given constraints. Below 40 = major feasibility concerns.
3. riskLevel: overall execution risk considering team size, experience, budget, and scope clarity.
4. complexity: technical and organizational complexity to build and maintain the product.
5. estimatedTimeline: realistic months to ship MVP — may differ from stated timeline. minMonths <= maxMonths.
6. skillGaps: specific technical or domain skills the team likely lacks. Be concrete (e.g. "PostgreSQL query optimization", not "backend skills").
7. blockers: concrete execution blockers with severity. Focus on what will actually stop progress.
8. recommendations: 3-6 actionable, project-specific steps. No fluff like "do market research" unless tied to a specific gap.
9. mvpScope: 4-8 minimal features for a shippable MVP. Cut scope aggressively.

OUTPUT FORMAT:
Return ONLY a single JSON object. No markdown. No explanation. No extra fields.
Exact schema:
${OUTPUT_SCHEMA}${retryNote}`;
}
