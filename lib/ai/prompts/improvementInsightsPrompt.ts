import type { ProjectEvolution } from "@/types/portfolio";

export type ImprovementInsightsPromptInput = {
  projectTitle: string;
  evolution: ProjectEvolution;
  historicalSummary: string;
};

export function buildImprovementInsightsPrompt(
  input: ImprovementInsightsPromptInput,
  attempt: number
): string {
  const strictness =
    attempt === 0
      ? "Provide specific, actionable insights grounded in the data."
      : "Be concise. Return valid JSON only. Every field must be populated.";

  return `You are a venture intelligence advisor for LaunchLens AI. Analyze how a founder's project has evolved over time and explain score changes.

${strictness}

Project: ${input.projectTitle}

Historical Summary:
${input.historicalSummary}

Current Analysis:
${input.evolution.currentAnalysis ? JSON.stringify(input.evolution.currentAnalysis) : "None"}

Previous Analysis:
${input.evolution.previousAnalysis ? JSON.stringify(input.evolution.previousAnalysis) : "None"}

Score Improvements:
${input.evolution.scoreImprovements.join("\n") || "None"}

Score Declines:
${input.evolution.scoreDeclines.join("\n") || "None"}

Timeline Events (${input.evolution.events.length} total):
${input.evolution.events
  .slice(-8)
  .map((e) => `- ${e.createdAt}: ${e.title} — ${e.description}`)
  .join("\n")}

Return JSON matching this exact schema:
{
  "improvements": ["string array of positive changes and why they matter"],
  "regressions": ["string array of negative changes and their impact"],
  "recommendedActions": ["string array of 3-6 specific next steps"],
  "projectHealth": 0-100 integer representing overall project health trajectory
}`;
}
