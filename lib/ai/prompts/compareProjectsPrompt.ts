import type { AnalyzeProjectInput } from "@/lib/validations/analysis";
import type { ProjectAnalysis } from "@/lib/validations/analysis";
import type { FailureSimulation } from "@/types/failure-simulation";
import type { WhatIfParameters } from "@/types/project-comparison";
import type { Roadmap } from "@/types/roadmap";
import type { TeamPlan } from "@/types/team-plan";

const OUTPUT_SCHEMA = `{
  "winner": "projectId of the best overall project",
  "comparisonSummary": "2-3 sentence executive summary of the comparison",
  "categories": [
    {
      "name": "Success Probability | Risk | Complexity | Timeline | Team Requirements | Skill Fit | Execution Feasibility",
      "winner": "projectId",
      "reason": "objective reasoning citing specific data points"
    }
  ],
  "projectScores": [
    { "projectId": "string", "overallScore": number (0-100, derived from evidence not arbitrary) }
  ],
  "recommendations": ["actionable strategic recommendation strings"],
  "highlights": {
    "bestOverall": "projectId",
    "highestSuccess": "projectId",
    "lowestRisk": "projectId",
    "fastestLaunch": "projectId",
    "lowestComplexity": "projectId",
    "bestSkillFit": "projectId"
  },
  "headToHead": [
    {
      "name": "Success Probability" | "Risk" | "Complexity" | "Timeline" | "Team Size" | "Skill Gap Severity" | "Failure Risk" | "Execution Difficulty",
      "values": [
        { "projectId": "string", "score": number (0-100, higher is better except Risk/Complexity/Failure Risk where lower raw risk = higher score), "label": "human readable e.g. 72% or Medium", "level": "low" | "medium" | "high" (optional) }
      ]
    }
  ],
  "radarData": [
    { "projectId": "string", "risk": 0-100 (higher = lower risk/better), "complexity": 0-100 (higher = simpler/better), "execution": 0-100, "teamNeeds": 0-100 (higher = fewer needs/better), "readiness": 0-100 }
  ],
  "barChartData": [
    { "projectId": "string", "timelineMonths": number, "teamSize": number, "successScore": number }
  ],
  "scenarioComparison": [
    { "projectId": "string", "mostLikelyFailure": "string", "probability": 0-100, "severity": "low"|"medium"|"high", "summary": "string" }
  ],
  "roadmapComparison": [
    { "projectId": "string", "durationMonths": number, "milestoneCount": number, "taskCount": number, "launchReadiness": 0-100, "executionDifficulty": "low"|"medium"|"high" }
  ],
  "teamComparison": [
    { "projectId": "string", "teamSize": number, "criticalRoles": ["string"], "skillGapCount": number, "skillGapSeverity": "low"|"medium"|"high", "hiringDifficulty": "low"|"medium"|"high" }
  ],
  "decision": {
    "recommendedProjectId": "projectId",
    "whyItWins": "string",
    "tradeoffs": ["string"],
    "strategicAdvice": "string"
  },
  "whatIfImpact": [
    { "projectId": "string", "previousScore": number, "newScore": number, "rankChange": number (positive = moved up in ranking) }
  ]
}`;

export interface ProjectComparisonContext {
  projectId: string;
  project: AnalyzeProjectInput;
  analysis: ProjectAnalysis;
  simulation: FailureSimulation | null;
  roadmap: Roadmap | null;
  teamPlan: TeamPlan | null;
}

export interface CompareProjectsPromptInput {
  projects: ProjectComparisonContext[];
  whatIf?: WhatIfParameters;
}

function formatProjectBlock(ctx: ProjectComparisonContext): string {
  const { projectId, project, analysis, simulation, roadmap, teamPlan } = ctx;

  let block = `
### Project ID: ${projectId}
Title: ${project.title}
Description: ${project.description}
Budget: ${project.budget}
Timeline: ${project.timeline}
Team Size: ${project.teamSize}
Experience Level: ${project.experienceLevel}

#### Analysis
Success Score: ${analysis.successScore}/100
Risk Level: ${analysis.riskLevel}
Complexity: ${analysis.complexity}
Estimated Timeline: ${analysis.estimatedTimeline.minMonths}-${analysis.estimatedTimeline.maxMonths} months
Skill Gaps: ${JSON.stringify(analysis.skillGaps)}
Blockers: ${JSON.stringify(analysis.blockers)}
Recommendations: ${analysis.recommendations.join("; ")}
MVP Scope: ${analysis.mvpScope.join("; ")}`;

  if (simulation) {
    block += `\n\n#### Failure Simulation\n${JSON.stringify(simulation.scenarios.map((s) => ({ title: s.title, probability: s.probability, severity: s.severity, summary: s.summary })))}`;
  } else {
    block += `\n\n#### Failure Simulation: Not available`;
  }

  if (roadmap) {
    const taskCount = roadmap.phases.reduce((sum, p) => sum + p.tasks.length, 0);
    const milestoneCount = roadmap.phases.reduce(
      (sum, p) => sum + p.milestones.length,
      0
    );
    block += `\n\n#### Roadmap
Duration: ${roadmap.estimatedDurationMonths} months
Phases: ${roadmap.phases.length}
Milestones: ${milestoneCount}
Tasks: ${taskCount}
Critical Success Factors: ${roadmap.criticalSuccessFactors.map((f) => f.title).join("; ")}`;
  } else {
    block += `\n\n#### Roadmap: Not available`;
  }

  if (teamPlan) {
    block += `\n\n#### Team Plan
Recommended Team Size: ${teamPlan.recommendedTeamSize}
Critical Roles: ${teamPlan.roles.filter((r) => r.priority === "critical").map((r) => r.title).join(", ")}
Skill Gaps: ${teamPlan.skillGaps.map((g) => `${g.skill} (${g.severity})`).join("; ")}
Hiring Order: ${teamPlan.hiringOrder.map((h) => h.title).join(" → ")}`;
  } else {
    block += `\n\n#### Team Plan: Not available`;
  }

  return block;
}

function formatWhatIfBlock(whatIf: WhatIfParameters): string {
  if (!whatIf) return "";

  const parts: string[] = [];
  if (whatIf.budgetIncreasePercent) {
    parts.push(`Budget increased by ${whatIf.budgetIncreasePercent}%`);
  }
  if (whatIf.timelineExtensionMonths) {
    parts.push(`Timeline extended by ${whatIf.timelineExtensionMonths} months`);
  }
  if (whatIf.additionalTeamMembers) {
    parts.push(`${whatIf.additionalTeamMembers} additional team member(s) added`);
  }

  if (parts.length === 0) return "";

  return `
## What-If Scenario
The user is simulating the following changes across all projects:
${parts.map((p) => `- ${p}`).join("\n")}

Recalculate scores and rankings reflecting these adjustments. Include whatIfImpact showing previousScore, newScore, and rankChange for each project.`;
}

export function buildCompareProjectsPrompt(
  input: CompareProjectsPromptInput,
  retryAttempt = 0
): string {
  const projectIds = input.projects.map((p) => p.projectId);
  const retryNote =
    retryAttempt > 0
      ? `\n\nIMPORTANT: Your previous response was invalid JSON or missing required fields. Return ONLY valid JSON matching the exact schema. Include exactly 8 headToHead metrics. Include exactly 7+ categories. All winner/recommendedProjectId/highlights values MUST be one of: ${projectIds.join(", ")}. No markdown, no code fences, no extra keys.`
      : "";

  const projectBlocks = input.projects.map(formatProjectBlock).join("\n---\n");

  return `You are a senior startup advisor and venture intelligence analyst. Compare the following ${input.projects.length} project ideas objectively to help the founder decide where to invest their time.

Compare based on:
- Success probability (from analysis scores and market feasibility)
- Risk (from analysis, failure simulation, blockers)
- Complexity (technical and operational)
- Timeline (estimated duration, roadmap if available)
- Team requirements (size, critical roles, hiring difficulty)
- Skill fit (alignment with founder experience level and skill gaps)
- Execution feasibility (roadmap readiness, blockers, MVP scope)

Rules:
- Use ONLY the project IDs provided: ${projectIds.join(", ")}
- Scores must be derived from the data — never arbitrary or random
- Lower risk/complexity should result in higher comparative scores where appropriate
- If simulation/roadmap/team data is missing for a project, note reduced confidence but still compare using available data
- winner and decision.recommendedProjectId should typically align unless there's a strategic reason
- headToHead must contain exactly 8 metrics with all ${input.projects.length} projects in each values array
- projectScores must include all ${input.projects.length} projects
${formatWhatIfBlock(input.whatIf ?? undefined)}

## Projects
${projectBlocks}

Return ONLY valid JSON matching this schema:
${OUTPUT_SCHEMA}
${retryNote}`;
}
