import type { TeamPlan } from "@/types/team-plan";

export function createFallbackTeamPlan(): TeamPlan {
  return {
    recommendedTeamSize: 3,
    roles: [
      {
        title: "Full-Stack Developer",
        priority: "critical",
        reason:
          "Core MVP features require end-to-end development across frontend, backend, and database.",
        responsibilities: [
          "Build and ship MVP features",
          "Implement authentication and core API",
          "Set up database schema and migrations",
          "Deploy to staging and production",
        ],
        skills: ["TypeScript", "React", "Node.js", "SQL", "Git"],
      },
      {
        title: "Product Designer (UI/UX)",
        priority: "high",
        reason:
          "User-facing quality directly impacts adoption and validation — design cannot be an afterthought.",
        responsibilities: [
          "Design core user flows and wireframes",
          "Create responsive UI components",
          "Conduct usability testing with beta users",
          "Maintain design system consistency",
        ],
        skills: ["Figma", "User Research", "Responsive Design", "Prototyping"],
      },
      {
        title: "Founder / Product Lead",
        priority: "critical",
        reason:
          "Someone must own vision, scope decisions, user validation, and prevent feature creep.",
        responsibilities: [
          "Define and protect MVP scope",
          "Conduct user discovery interviews",
          "Prioritize roadmap and make trade-offs",
          "Handle early customer support and feedback",
        ],
        skills: [
          "Product Strategy",
          "User Validation",
          "Scope Management",
          "Communication",
        ],
      },
      {
        title: "DevOps / Infrastructure (Part-time)",
        priority: "medium",
        reason:
          "Reliable deployment and monitoring prevent launch-day failures without full-time overhead.",
        responsibilities: [
          "Configure CI/CD pipeline",
          "Set up error monitoring and alerts",
          "Manage production environment and SSL",
          "Configure database backups",
        ],
        skills: ["Docker", "CI/CD", "Cloud Hosting", "Monitoring"],
      },
    ],
    skillGaps: [
      {
        skill: "Backend API Development",
        severity: "high",
        reason:
          "MVP requires persistent data, authentication, and business logic that cannot be mocked long-term.",
        category: "critical",
      },
      {
        skill: "User Interface Design",
        severity: "high",
        reason:
          "Poor UX will invalidate user testing results and reduce early adoption.",
        category: "critical",
      },
      {
        skill: "Database Design",
        severity: "medium",
        reason:
          "Data model decisions made early are expensive to change after launch.",
        category: "important",
      },
      {
        skill: "User Validation",
        severity: "medium",
        reason:
          "Building without validated demand is the #1 startup failure mode.",
        category: "important",
      },
      {
        skill: "Marketing & Launch",
        severity: "low",
        reason:
          "Can be handled by founder initially; becomes important post-MVP.",
        category: "optional",
      },
    ],
    skillReadiness: [
      {
        skill: "Frontend Development",
        currentLevel: 40,
        requiredLevel: 75,
        category: "critical",
      },
      {
        skill: "Backend Development",
        currentLevel: 30,
        requiredLevel: 80,
        category: "critical",
      },
      {
        skill: "UI/UX Design",
        currentLevel: 25,
        requiredLevel: 70,
        category: "critical",
      },
      {
        skill: "Product Management",
        currentLevel: 50,
        requiredLevel: 75,
        category: "important",
      },
      {
        skill: "DevOps",
        currentLevel: 20,
        requiredLevel: 60,
        category: "important",
      },
      {
        skill: "Marketing",
        currentLevel: 35,
        requiredLevel: 50,
        category: "optional",
      },
    ],
    teamRisks: [
      {
        title: "Single Point of Failure",
        description:
          "One developer owns all technical decisions and implementation — illness or burnout halts progress entirely.",
        severity: "high",
        mitigation:
          "Document architecture decisions, use pair programming sessions, and cross-train on critical systems.",
      },
      {
        title: "Missing Technical Leadership",
        description:
          "No senior engineer to review architecture, security, and scalability decisions before they become debt.",
        severity: "high",
        mitigation:
          "Engage a part-time technical advisor or senior contractor for monthly architecture reviews.",
      },
      {
        title: "Overloaded Founder",
        description:
          "Founder handles product, sales, support, and strategy simultaneously — context switching kills velocity.",
        severity: "medium",
        mitigation:
          "Ruthlessly defer non-MVP work. Block focused build time. Hire first technical co-founder or contractor.",
      },
      {
        title: "No Design Expertise",
        description:
          "Engineering-led UI results in poor usability that undermines user validation efforts.",
        severity: "medium",
        mitigation:
          "Use a design system (shadcn/ui), hire a freelance designer for 2-week sprint, or use high-quality templates.",
      },
    ],
    hiringOrder: [
      {
        title: "Full-Stack Developer",
        priority: "critical",
        timing: "Week 1-2",
        rationale:
          "Unblocks all MVP development immediately — highest leverage hire for technical projects.",
      },
      {
        title: "UI/UX Designer",
        priority: "high",
        timing: "Week 2-4",
        rationale:
          "Design core flows before building UI to avoid costly rework during development.",
      },
      {
        title: "Part-time DevOps Consultant",
        priority: "medium",
        timing: "Before beta launch",
        rationale:
          "Production readiness requires deployment pipeline and monitoring — defer until MVP is feature-complete.",
      },
      {
        title: "Marketing Generalist",
        priority: "low",
        timing: "After MVP validation",
        rationale:
          "Only invest in marketing after confirming product-market fit with beta users.",
      },
    ],
    founderRecommendations: [
      {
        title: "Validate user demand before hiring",
        description:
          "Run 10+ discovery interviews and get waitlist signups before committing to a full team.",
      },
      {
        title: "Learn authentication basics yourself",
        description:
          "Understanding auth flows helps you evaluate contractor work and make faster scope decisions.",
      },
      {
        title: "Avoid hiring too early",
        description:
          "Premature hires burn runway without validated direction. Contract for specific deliverables first.",
      },
      {
        title: "Reduce scope aggressively",
        description:
          "Cut MVP to 3-5 core features. Every additional feature delays launch and increases team requirements.",
      },
      {
        title: "Ship weekly, not perfectly",
        description:
          "Visible progress every week prevents team morale issues and maintains stakeholder confidence.",
      },
    ],
    teamScenarios: [
      {
        name: "Solo Founder",
        successImpact: "Low (25%)",
        costImpact: "Minimal ($0-2K/mo)",
        timelineImpact: "+4-6 months",
        riskImpact: "Very High",
        summary:
          "Solo execution maximizes runway but dramatically increases timeline and burnout risk. Viable only for simple MVPs with strong technical founder.",
      },
      {
        name: "Small Team",
        successImpact: "High (70%)",
        costImpact: "Moderate ($5-15K/mo)",
        timelineImpact: "On target",
        riskImpact: "Medium",
        summary:
          "2-4 focused contributors covering dev, design, and product is the optimal MVP configuration for most startups.",
      },
      {
        name: "Expanded Team",
        successImpact: "Medium (55%)",
        costImpact: "High ($25-50K/mo)",
        timelineImpact: "-1 month (with coordination overhead)",
        riskImpact: "Medium-High",
        summary:
          "Larger teams add communication overhead and burn rate without proportional MVP velocity gains pre-product-market fit.",
      },
    ],
  };
}
