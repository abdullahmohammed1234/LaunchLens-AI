import type { MentorContextPackage } from "@/lib/ai/contextBuilder";
import type { MentorMode } from "@/types/mentor";

const OUTPUT_SCHEMA = `{
  "answer": string (detailed markdown-friendly response referencing specific project data),
  "confidence": number (0-100),
  "sources": ["analysis_engine" | "failure_simulator" | "roadmap_generator" | "team_builder" | "executive_reports" | "portfolio_analytics"],
  "recommendedActions": [
    {
      "title": string,
      "description": string,
      "priority": "critical" | "high" | "medium",
      "impact": string
    }
  ],
  "relatedInsights": [
    {
      "title": string,
      "insight": string,
      "source": "analysis_engine" | "failure_simulator" | "roadmap_generator" | "team_builder" | "executive_reports" | "portfolio_analytics"
    }
  ],
  "reasoning": string (explain how you arrived at this answer using the data),
  "whatIfComparisons": [
    {
      "scenario": string,
      "currentState": string,
      "projectedState": string,
      "impact": string,
      "recommendation": string
    }
  ] (optional, include for what-if questions),
  "improvementPlan": [
    {
      "step": number,
      "title": string,
      "description": string,
      "estimatedImpact": string,
      "priority": "critical" | "high" | "medium"
    }
  ] (optional, include for health/improvement questions)
}`;

function formatProjectContext(ctx: MentorContextPackage): string {
  const pc = ctx.projectContext;
  if (!pc) return "No project context available.";

  const lines: string[] = [
    `## Project: ${pc.project.title}`,
    `- Status: ${pc.project.status}`,
    `- Description: ${pc.project.description}`,
    `- Budget: ${pc.project.budget}`,
    `- Timeline: ${pc.project.timeline}`,
    `- Team Size: ${pc.project.teamSize}`,
    `- Experience Level: ${pc.project.experienceLevel}`,
  ];

  if (pc.analysis) {
    lines.push(
      "",
      "## Latest Analysis",
      `- Success Score: ${pc.analysis.successScore}/100`,
      `- Risk Level: ${pc.analysis.riskLevel}`,
      `- Complexity: ${pc.analysis.complexity}`,
      `- Estimated Timeline: ${pc.analysis.estimatedTimeline.minMonths}-${pc.analysis.estimatedTimeline.maxMonths} months`,
      `- Skill Gaps: ${pc.analysis.skillGaps.map((g) => `${g.skill} (${g.importance})`).join(", ")}`,
      `- Blockers: ${pc.analysis.blockers.map((b) => `${b.title} (${b.severity})`).join(", ")}`,
      `- MVP Scope: ${pc.analysis.mvpScope.join("; ")}`,
      `- Recommendations: ${pc.analysis.recommendations.join("; ")}`
    );
  } else {
    lines.push("", "## Latest Analysis", "Not available — user should run analysis first.");
  }

  if (pc.simulation) {
    lines.push(
      "",
      "## Failure Simulation",
      ...pc.simulation.scenarios.map(
        (s) =>
          `- ${s.title}: ${s.probability}% probability, ${s.severity} severity — ${s.summary}`
      )
    );
  }

  if (pc.roadmap) {
    lines.push(
      "",
      "## Roadmap",
      `- Duration: ${pc.roadmap.estimatedDurationMonths} months`,
      `- Phases: ${pc.roadmap.phases.map((p) => p.title).join(", ")}`,
      `- Critical Success Factors: ${pc.roadmap.criticalSuccessFactors.map((f) => f.title).join(", ")}`
    );
  }

  if (pc.teamPlan) {
    lines.push(
      "",
      "## Team Plan",
      `- Recommended Team Size: ${pc.teamPlan.recommendedTeamSize}`,
      `- Critical Roles: ${pc.teamPlan.roles.filter((r) => r.priority === "critical" || r.priority === "high").map((r) => r.title).join(", ")}`,
      `- Skill Gaps: ${pc.teamPlan.skillGaps.map((g) => `${g.skill} (${g.severity})`).join(", ")}`
    );
  }

  if (pc.executiveReport) {
    lines.push(
      "",
      "## Executive Report",
      `- Investment Readiness: ${pc.investmentReadinessScore}/100`,
      `- Executive Summary: ${pc.executiveReport.executiveSummary}`,
      `- Strengths: ${pc.executiveReport.strengths.join("; ")}`,
      `- Weaknesses: ${pc.executiveReport.weaknesses.join("; ")}`,
      `- Final Recommendation: ${pc.executiveReport.finalRecommendation}`
    );
  }

  if (pc.comparison) {
    lines.push(
      "",
      "## Project Comparison",
      `- Winner: ${pc.comparison.winner}`,
      `- Recommended: ${pc.comparison.decision.recommendedProjectId}`,
      `- Summary: ${pc.comparison.comparisonSummary}`
    );
  }

  lines.push("", `Available data sources: ${pc.availableSources.join(", ")}`);

  return lines.join("\n");
}

function formatPortfolioContext(ctx: MentorContextPackage): string {
  const portfolio = ctx.portfolioContext;
  if (!portfolio) return "";

  const { portfolio: metrics, projects } = portfolio;

  return [
    "## Portfolio Overview",
    `- Portfolio Health Score: ${metrics.portfolioHealthScore}/100`,
    `- Total Projects: ${metrics.totalProjects}`,
    `- Analyzed Projects: ${metrics.analyzedProjects}`,
    `- Average Success Score: ${metrics.averageSuccessScore.toFixed(1)}`,
    `- Average Readiness: ${metrics.averageReadiness.toFixed(1)}`,
    metrics.highestPotential
      ? `- Highest Potential: ${metrics.highestPotential.title} (score ${metrics.highestPotential.successScore})`
      : "",
    metrics.mostAtRisk
      ? `- Most At Risk: ${metrics.mostAtRisk.title} (${metrics.mostAtRisk.riskLevel} risk)`
      : "",
    metrics.weakestProject
      ? `- Weakest Project: ${metrics.weakestProject.title} (score ${metrics.weakestProject.successScore})`
      : "",
    metrics.projectsRequiringAttention.length
      ? `- Projects Requiring Attention: ${metrics.projectsRequiringAttention.map((p) => `${p.title} (${p.reason})`).join("; ")}`
      : "",
    "",
    "## All Projects",
    ...projects.map(
      (p) =>
        `- ${p.title}: success=${p.successScore ?? "N/A"}, risk=${p.riskLevel ?? "N/A"}, readiness=${p.readinessScore ?? "N/A"}`
    ),
  ]
    .filter(Boolean)
    .join("\n");
}

function getModeInstructions(mode: MentorMode): string {
  switch (mode) {
    case "portfolio":
      return `You are a portfolio strategist advising a founder with multiple projects.
Focus on prioritization, resource allocation, and cross-project tradeoffs.
Reference specific project names and scores from the portfolio data.
Answer questions like which project to prioritize, highest potential, and most risky.`;
    case "founder_coach":
      return `You are a founder coach focused on productivity, prioritization, scope management, and execution discipline.
Be direct and actionable. Help the founder focus on what matters this week.
Reference their project data but emphasize execution habits, saying no, and shipping.`;
    default:
      return `You are a startup mentor, CTO, product strategist, and execution coach.
Provide strategic guidance grounded in the project's LaunchLens intelligence data.
Never give generic startup advice — always cite specific scores, risks, gaps, or roadmap items from the data.`;
  }
}

export interface MentorPromptInput {
  context: MentorContextPackage;
  question: string;
  topic: string;
}

export function buildMentorPrompt(
  input: MentorPromptInput,
  retryAttempt = 0
): string {
  const retryNote =
    retryAttempt > 0
      ? `\n\nIMPORTANT: Your previous response was invalid JSON. Return ONLY valid JSON matching the exact schema. No markdown fences, no extra keys.`
      : "";

  const historyBlock =
    input.context.conversationHistory.length > 0
      ? `\n## Previous Conversation\n${input.context.conversationHistory
          .map((m) => `${m.role.toUpperCase()}: ${m.content}`)
          .join("\n")}\n`
      : "";

  const topicInstructions =
    input.topic === "what_if"
      ? "\nThis is a WHAT-IF question. Include whatIfComparisons with current vs projected states."
      : input.topic === "health"
        ? "\nThis is a project health question. Include improvementPlan with prioritized steps and estimated impact."
        : input.topic === "portfolio"
          ? "\nThis is a portfolio-level question. Compare projects using portfolio metrics."
          : "";

  return `You are LaunchLens AI Mentor — an expert startup advisor integrated with a decision intelligence platform.

${getModeInstructions(input.context.mode)}

RULES:
1. Reference specific data from the context (scores, risks, skill gaps, roadmap phases, simulation scenarios).
2. Never give generic advice that could apply to any startup without citing project data.
3. Be realistic and honest about risks and constraints.
4. Include 2-5 recommendedActions with clear impact statements.
5. Only list sources that actually informed your answer from the available data sources.
6. Set confidence based on how much relevant data is available (lower if analysis is missing).
7. Explain your reasoning in the reasoning field.

${formatProjectContext(input.context)}

${formatPortfolioContext(input.context)}
${historyBlock}

## User Question
${input.question}
${topicInstructions}

Return JSON matching this schema:
${OUTPUT_SCHEMA}
${retryNote}`;
}
