import type { Roadmap } from "@/types/roadmap";

export function createFallbackRoadmap(): Roadmap {
  return {
    estimatedDurationMonths: 4,
    phases: [
      {
        title: "Research & Validation",
        description:
          "Validate problem-solution fit and lock MVP scope before writing production code.",
        durationWeeks: 3,
        milestones: [
          {
            title: "Problem Validation Complete",
            description:
              "10+ target user conversations documented with clear pain points.",
          },
          {
            title: "MVP Scope Locked",
            description:
              "Written scope document with explicit out-of-scope features.",
          },
        ],
        tasks: [
          {
            title: "Conduct 10 user discovery interviews",
            priority: "high",
            estimatedHours: 20,
          },
          {
            title: "Document competitor landscape and differentiation",
            priority: "medium",
            estimatedHours: 8,
          },
          {
            title: "Define and freeze MVP feature list (max 5 features)",
            priority: "high",
            estimatedHours: 6,
          },
          {
            title: "Create landing page with waitlist signup",
            priority: "medium",
            estimatedHours: 12,
          },
        ],
      },
      {
        title: "Foundation & Architecture",
        description:
          "Set up core infrastructure, auth, and database before feature development.",
        durationWeeks: 2,
        milestones: [
          {
            title: "Development Environment Ready",
            description:
              "Repo, CI, staging environment, and deployment pipeline configured.",
          },
          {
            title: "Authentication Complete",
            description: "User registration, login, and session management working.",
          },
        ],
        tasks: [
          {
            title: "Initialize project with TypeScript and linting",
            priority: "high",
            estimatedHours: 4,
          },
          {
            title: "Set up database schema and migrations",
            priority: "high",
            estimatedHours: 10,
          },
          {
            title: "Implement authentication flow",
            priority: "high",
            estimatedHours: 16,
          },
          {
            title: "Configure staging deployment",
            priority: "medium",
            estimatedHours: 8,
          },
        ],
      },
      {
        title: "MVP Development",
        description:
          "Build only core features that deliver the primary user value proposition.",
        durationWeeks: 6,
        milestones: [
          {
            title: "Core Feature Complete",
            description:
              "Primary user workflow functional end-to-end in staging.",
          },
          {
            title: "Internal Alpha Ready",
            description:
              "Team can dogfood the product with real data flows.",
          },
        ],
        tasks: [
          {
            title: "Build primary user workflow (happy path)",
            priority: "high",
            estimatedHours: 40,
          },
          {
            title: "Implement essential API endpoints",
            priority: "high",
            estimatedHours: 24,
          },
          {
            title: "Create responsive UI with design system",
            priority: "medium",
            estimatedHours: 20,
          },
          {
            title: "Add error handling and loading states",
            priority: "medium",
            estimatedHours: 12,
          },
          {
            title: "Write integration tests for critical paths",
            priority: "medium",
            estimatedHours: 16,
          },
        ],
      },
      {
        title: "Testing & Beta",
        description:
          "Validate with real users, fix critical issues, and prepare for launch.",
        durationWeeks: 3,
        milestones: [
          {
            title: "Beta Testing Complete",
            description: "20 beta users onboarded with feedback collected.",
          },
          {
            title: "Launch Blockers Resolved",
            description: "All P0 bugs fixed and performance acceptable.",
          },
        ],
        tasks: [
          {
            title: "Recruit and onboard 20 beta testers",
            priority: "high",
            estimatedHours: 10,
          },
          {
            title: "Fix critical bugs from beta feedback",
            priority: "high",
            estimatedHours: 24,
          },
          {
            title: "Set up monitoring and error tracking",
            priority: "medium",
            estimatedHours: 6,
          },
          {
            title: "Configure database backups",
            priority: "high",
            estimatedHours: 4,
          },
        ],
      },
      {
        title: "Launch",
        description:
          "Execute public launch with marketing, legal, and operational readiness.",
        durationWeeks: 2,
        milestones: [
          {
            title: "Production Deployment Live",
            description: "App accessible to public users with SSL and domain.",
          },
          {
            title: "Public Launch Complete",
            description: "Launch channels activated and first users acquired.",
          },
        ],
        tasks: [
          {
            title: "Deploy to production environment",
            priority: "high",
            estimatedHours: 8,
          },
          {
            title: "Publish privacy policy and terms of service",
            priority: "high",
            estimatedHours: 4,
          },
          {
            title: "Execute launch campaign (Product Hunt, social, email)",
            priority: "medium",
            estimatedHours: 12,
          },
          {
            title: "Monitor launch metrics and respond to issues",
            priority: "high",
            estimatedHours: 16,
          },
        ],
      },
    ],
    launchChecklist: [
      {
        title: "Landing Page Ready",
        description: "Public-facing page with clear value proposition and CTA.",
      },
      {
        title: "Authentication Tested",
        description: "Sign up, login, password reset flows verified in production.",
      },
      {
        title: "Database Backups Configured",
        description: "Automated daily backups with tested restore procedure.",
      },
      {
        title: "Deployment Complete",
        description: "Production environment live with SSL certificate.",
      },
      {
        title: "Privacy Policy Added",
        description: "Legal pages published and linked in footer.",
      },
      {
        title: "Error Monitoring Active",
        description: "Sentry or equivalent capturing production errors.",
      },
      {
        title: "Analytics Configured",
        description: "Basic event tracking for signups and core actions.",
      },
    ],
    criticalSuccessFactors: [
      {
        title: "Keep MVP under 5 features",
        description:
          "Resist scope creep — every feature beyond core value delays launch and increases failure risk.",
      },
      {
        title: "Validate users before scaling",
        description:
          "Get 20 paying or committed beta users before investing in infrastructure scaling.",
      },
      {
        title: "Avoid advanced analytics initially",
        description:
          "Basic usage metrics are sufficient at launch; defer complex dashboards until product-market fit.",
      },
      {
        title: "Ship weekly milestones",
        description:
          "Visible progress every week prevents burnout and maintains stakeholder confidence.",
      },
    ],
    recommendedBuildOrder: [
      {
        title: "Authentication",
        rationale:
          "Required foundation for any user-specific features; blocks all downstream work.",
        dependsOn: [],
      },
      {
        title: "Database & Core Models",
        rationale:
          "Data layer must exist before building features that persist state.",
        dependsOn: ["Authentication"],
      },
      {
        title: "Primary User Workflow",
        rationale:
          "The single feature that delivers core value — build this before anything else.",
        dependsOn: ["Database & Core Models"],
      },
      {
        title: "Secondary Features",
        rationale:
          "Only after primary workflow is validated with real users.",
        dependsOn: ["Primary User Workflow"],
      },
      {
        title: "Testing & QA",
        rationale:
          "Automated tests for critical paths before beta launch.",
        dependsOn: ["Primary User Workflow"],
      },
      {
        title: "Deployment & Launch",
        rationale:
          "Production infrastructure and launch execution after beta validation.",
        dependsOn: ["Testing & QA", "Secondary Features"],
      },
    ],
    planComparison: {
      currentPlanSummary:
        "Original plan follows stated timeline with full feature scope and no explicit phasing or scope cuts.",
      optimizedPlanSummary:
        "Phased approach prioritizing validation, MVP core features, and deferred nice-to-haves over 4 months.",
      durationDifference:
        "Optimized plan adds 2-4 weeks upfront for validation but reduces total time-to-launch by cutting scope 30%.",
      scopeChanges: [
        "Defer advanced analytics until post-launch",
        "Limit MVP to 5 core features maximum",
        "Postpone mobile app until web MVP validated",
        "Skip custom admin dashboard initially — use direct DB access",
      ],
      riskMitigations: [
        "Validation phase prevents building unwanted features",
        "Weekly milestones reduce burnout risk",
        "Explicit scope freeze addresses scope creep failure mode",
        "Beta testing phase catches issues before public launch",
      ],
    },
  };
}
