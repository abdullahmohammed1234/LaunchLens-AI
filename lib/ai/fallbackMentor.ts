import type { MentorContextPackage } from "@/lib/ai/contextBuilder";
import type { MentorRecommendedAction, MentorResponse } from "@/types/mentor";

export function createFallbackMentorResponse(
  context: MentorContextPackage,
  question: string
): MentorResponse {
  const pc = context.projectContext;
  const portfolio = context.portfolioContext;

  if (context.mode === "portfolio" && portfolio) {
    const top = portfolio.portfolio.highestPotential;
    const risky = portfolio.portfolio.mostAtRisk;

    return {
      answer: top
        ? `Based on your portfolio data, **${top.title}** shows the highest potential with a success score of ${top.successScore}. ${
            risky
              ? `However, **${risky.title}** carries ${risky.riskLevel} risk and may need attention before you scale other initiatives.`
              : ""
          } Focus your next sprint on the highest-scoring analyzed project while addressing any projects flagged for attention.`
        : "Your portfolio lacks sufficient analysis data. Run analysis on your top 2-3 projects first to enable meaningful portfolio-level guidance.",
      confidence: top ? 65 : 40,
      sources: ["portfolio_analytics"],
      recommendedActions: [
        {
          title: "Analyze unanalyzed projects",
          description:
            "Run LaunchLens analysis on projects without scores to enable portfolio comparisons.",
          priority: "high",
          impact: "Unlocks data-driven prioritization across your portfolio",
        },
        {
          title: top ? `Deep-dive on ${top.title}` : "Pick a flagship project",
          description:
            "Generate roadmap, team plan, and executive report for your top candidate.",
          priority: "high",
          impact: "Build execution clarity before committing resources",
        },
      ],
      relatedInsights: top
        ? [
            {
              title: "Highest potential project",
              insight: `${top.title} leads with success score ${top.successScore}`,
              source: "portfolio_analytics",
            },
          ]
        : [],
      reasoning:
        "Fallback response generated from portfolio analytics aggregates due to AI validation failure.",
    };
  }

  const score = pc?.analysis?.successScore ?? null;
  const risk = pc?.analysis?.riskLevel ?? "unknown";
  const projectTitle = pc?.project.title ?? "your project";

  return {
    answer: score !== null
      ? `For **${projectTitle}**, your current success score is **${score}/100** with **${risk}** risk. ${
          pc?.analysis?.blockers[0]
            ? `Your top blocker is "${pc.analysis.blockers[0].title}" — addressing this should be your immediate priority.`
            : "Review your analysis recommendations for the highest-impact next steps."
        } ${
          pc?.analysis?.recommendations[0]
            ? `The analysis engine recommends: ${pc.analysis.recommendations[0]}`
            : ""
        }`
      : `I don't have analysis data for **${projectTitle}** yet. Run the LaunchLens analyzer first — without it, strategic guidance will be limited to general project parameters.`,
    confidence: score !== null ? 60 : 35,
    sources: pc?.analysis
      ? ["analysis_engine"]
      : ["portfolio_analytics"],
    recommendedActions: [
      ...(score === null
        ? [
            {
              title: "Run project analysis",
              description:
                "Generate your first intelligence report to unlock mentor guidance.",
              priority: "critical" as const,
              impact: "Foundation for all strategic recommendations",
            },
          ]
        : []),
      ...(pc?.analysis?.skillGaps[0]
        ? [
            {
              title: `Address ${pc.analysis.skillGaps[0].skill} gap`,
              description:
                "This skill gap was flagged as high importance in your analysis.",
              priority: "high" as const,
              impact: "Reduces execution risk on critical path work",
            },
          ]
        : []),
      {
        title: "Generate failure simulation",
        description:
          "Model failure scenarios to identify preventable risks before they materialize.",
        priority: "medium" as const,
        impact: "Surfaces blind spots in your execution plan",
      },
    ].slice(0, 4) satisfies MentorRecommendedAction[],
    relatedInsights: pc?.analysis
      ? [
          {
            title: "Success score baseline",
            insight: `Current score: ${score}/100 with ${risk} risk level`,
            source: "analysis_engine",
          },
        ]
      : [],
    reasoning:
      "Fallback response synthesized from available LaunchLens intelligence due to AI validation failure.",
    improvementPlan:
      question.toLowerCase().includes("improve") && pc?.analysis
        ? [
            {
              step: 1,
              title: "Resolve top blocker",
              description:
                pc.analysis.blockers[0]?.description ??
                "Address the highest-severity blocker from analysis.",
              estimatedImpact: "+5-10 success score points",
              priority: "critical",
            },
            {
              step: 2,
              title: "Close critical skill gap",
              description: `Hire or upskill for ${pc.analysis.skillGaps[0]?.skill ?? "critical skills"}.`,
              estimatedImpact: "Reduces timeline slip risk by 15-20%",
              priority: "high",
            },
            {
              step: 3,
              title: "Validate MVP scope",
              description: `Focus on: ${pc.analysis.mvpScope.slice(0, 2).join(", ")}`,
              estimatedImpact: "Faster time-to-validation",
              priority: "high",
            },
          ]
        : undefined,
  };
}
