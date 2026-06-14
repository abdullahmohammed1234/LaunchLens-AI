import type { ProjectAnalysis } from "@/lib/validations/analysis";

export function createFallbackAnalysis(): ProjectAnalysis {
  return {
    successScore: 50,
    riskLevel: "medium",
    complexity: "medium",
    estimatedTimeline: { minMonths: 3, maxMonths: 12 },
    skillGaps: [
      {
        skill: "Full-stack development fundamentals",
        importance: "high",
      },
    ],
    blockers: [
      {
        title: "Analysis could not be completed",
        description:
          "The AI analysis service returned an invalid response. Please retry the analysis.",
        severity: "medium",
      },
    ],
    recommendations: [
      "Retry the analysis to get project-specific insights",
      "Clearly define your MVP scope before starting development",
      "Validate core assumptions with 5-10 target users",
    ],
    mvpScope: [
      "Define the single core problem you are solving",
      "Build a minimal working prototype",
      "Gather user feedback before adding features",
    ],
  };
}
