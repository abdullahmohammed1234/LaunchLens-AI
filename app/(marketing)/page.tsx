"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BarChart3,
  CheckCircle2,
  FlaskConical,
  GitCompare,
  Map,
  Quote,
  Shield,
  Sparkles,
  Target,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FeatureCard } from "@/components/dashboard/feature-card";
import { SectionHeader } from "@/components/dashboard/section-header";
import { SITE_CONFIG } from "@/lib/constants/site";

const features = [
  {
    icon: Target,
    title: "Success Prediction",
    description:
      "AI-powered analysis estimates your project's probability of success before you invest time and resources.",
  },
  {
    icon: Shield,
    title: "Risk Detection",
    description:
      "Identify potential risks, market gaps, and competitive threats early in your planning process.",
  },
  {
    icon: TrendingUp,
    title: "Timeline Estimation",
    description:
      "Get realistic timeline projections based on project complexity, team size, and market conditions.",
  },
  {
    icon: Users,
    title: "Skill Gap Analysis",
    description:
      "Discover missing skills and competencies needed to execute your vision successfully.",
  },
  {
    icon: Zap,
    title: "Execution Insights",
    description:
      "Receive actionable recommendations to improve your project's chances of success.",
  },
  {
    icon: GitCompare,
    title: "Project Comparison",
    description:
      "Compare multiple ideas side-by-side to prioritize the most promising opportunities.",
  },
];

const steps = [
  {
    step: "01",
    title: "Describe Your Idea",
    description:
      "Enter your project details, target market, and goals into our intuitive analyzer.",
  },
  {
    step: "02",
    title: "AI Analysis",
    description:
      "Our engine evaluates market fit, competition, feasibility, and execution requirements.",
  },
  {
    step: "03",
    title: "Get Insights",
    description:
      "Receive a comprehensive report with success probability, risks, and actionable recommendations.",
  },
];

const testimonials = [
  {
    quote:
      "LaunchLens helped us avoid a costly mistake. The risk analysis revealed market saturation we hadn't considered.",
    author: "Sarah Chen",
    role: "Founder, TechFlow",
    avatar: "SC",
  },
  {
    quote:
      "The skill gap analysis was eye-opening. We knew exactly what to hire for before starting development.",
    author: "Marcus Johnson",
    role: "CTO, BuildRight",
    avatar: "MJ",
  },
  {
    quote:
      "Comparing three product ideas side-by-side saved us months of deliberation. Clear winner emerged.",
    author: "Elena Rodriguez",
    role: "Product Lead, InnovateLab",
    avatar: "ER",
  },
];

const previewStats = [
  { label: "Success Score", value: "78%", color: "text-success" },
  { label: "Risk Level", value: "Medium", color: "text-warning" },
  { label: "Timeline", value: "4-6 mo", color: "text-primary" },
  { label: "Market Fit", value: "Strong", color: "text-success" },
];

export default function LandingPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden pt-32 pb-20 md:pt-40 md:pb-32">
        <div className="absolute inset-0 grid-pattern opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />

        <div className="relative mx-auto max-w-7xl px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mx-auto max-w-4xl text-center"
          >
            <Badge variant="default" className="mb-6">
              <Sparkles className="mr-1 h-3 w-3" />
              AI-Powered Project Intelligence
            </Badge>

            <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl md:text-6xl lg:text-7xl">
              Predict Project Success{" "}
              <span className="text-gradient-primary">
                Before You Build
              </span>
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-lg text-muted md:text-xl">
              {SITE_CONFIG.description}
            </p>

            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button size="lg" asChild className="glow-primary">
                <Link href="/analyzer">
                  Analyze a Project
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="secondary" asChild>
                <Link href="/demo">View Demo</Link>
              </Button>
            </div>

            <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-sm text-muted">
              {["No credit card required", "Free analysis", "Instant insights"].map(
                (item) => (
                  <div key={item} className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-success" />
                    <span>{item}</span>
                  </div>
                )
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Problem Statement */}
      <section id="problem" className="border-b border-border bg-surface py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <SectionHeader
            title="The problem every founder faces"
            description="Most startup failures are preventable — if you had the intelligence before you built"
            className="mb-12 text-center [&>div]:mx-auto [&>div]:max-w-2xl"
          />
          <div className="mx-auto grid max-w-4xl gap-6 md:grid-cols-3">
            {[
              {
                stat: "90%",
                label: "of startups fail",
                detail: "Often due to preventable execution and market risks",
              },
              {
                stat: "$50K+",
                label: "average wasted",
                detail: "Before founders realize their idea won't work",
              },
              {
                stat: "6 months",
                label: "typical delay",
                detail: "Spent building before validating assumptions",
              },
            ].map((item, index) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="rounded-xl border border-border bg-card p-6 text-center"
              >
                <p className="text-3xl font-bold text-primary">{item.stat}</p>
                <p className="mt-1 font-medium text-foreground">{item.label}</p>
                <p className="mt-2 text-sm text-muted">{item.detail}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 md:py-32">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <SectionHeader
            title="Everything you need to validate ideas"
            description="Comprehensive analysis tools to de-risk your next venture"
            className="mb-12 text-center [&>div]:mx-auto [&>div]:max-w-2xl"
          />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <FeatureCard key={feature.title} {...feature} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="border-y border-border bg-surface py-20 md:py-32">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <SectionHeader
            title="How it works"
            description="From idea to insights in three simple steps"
            className="mb-16 text-center [&>div]:mx-auto [&>div]:max-w-2xl"
          />
          <div className="grid gap-8 md:grid-cols-3">
            {steps.map((step, index) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                className="relative text-center"
              >
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-2xl font-bold text-primary">
                  {step.step}
                </div>
                <h3 className="mb-3 text-xl font-semibold text-foreground">
                  {step.title}
                </h3>
                <p className="text-sm leading-relaxed text-muted">
                  {step.description}
                </p>
                {index < steps.length - 1 && (
                  <div className="absolute right-0 top-8 hidden h-0.5 w-full translate-x-1/2 bg-border md:block" />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Product Preview */}
      <section id="preview" className="py-20 md:py-32">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <SectionHeader
            title="See it in action"
            description="A glimpse of the insights you'll receive"
            className="mb-12 text-center [&>div]:mx-auto [&>div]:max-w-2xl"
          />
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mx-auto max-w-4xl overflow-hidden rounded-2xl border border-border bg-card shadow-2xl shadow-primary/10"
          >
            <div className="flex items-center gap-2 border-b border-border bg-surface px-4 py-3">
              <div className="flex gap-1.5">
                <div className="h-3 w-3 rounded-full bg-danger/60" />
                <div className="h-3 w-3 rounded-full bg-warning/60" />
                <div className="h-3 w-3 rounded-full bg-success/60" />
              </div>
              <span className="ml-2 text-xs text-muted">
                LaunchLens Analyzer — Project Analysis
              </span>
            </div>
            <div className="p-6 md:p-8">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h4 className="text-lg font-semibold text-foreground">
                    SaaS Project Management Tool
                  </h4>
                  <p className="text-sm text-muted">Analysis completed</p>
                </div>
                <Badge variant="success">78% Success</Badge>
              </div>
              <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                {previewStats.map((stat) => (
                  <div
                    key={stat.label}
                    className="rounded-lg border border-border bg-surface p-4"
                  >
                    <p className="text-xs text-muted">{stat.label}</p>
                    <p className={`mt-1 text-xl font-bold ${stat.color}`}>
                      {stat.value}
                    </p>
                  </div>
                ))}
              </div>
              <div className="mt-6 space-y-3">
                <div className="flex items-center gap-3 rounded-lg border border-border bg-surface p-3">
                  <BarChart3 className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      Strong market demand detected
                    </p>
                    <p className="text-xs text-muted">
                      Growing segment with 23% YoY increase
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 rounded-lg border border-border bg-surface p-3">
                  <FlaskConical className="h-5 w-5 text-warning" />
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      Technical complexity: Moderate
                    </p>
                    <p className="text-xs text-muted">
                      Requires full-stack team with API expertise
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 rounded-lg border border-border bg-surface p-3">
                  <Map className="h-5 w-5 text-success" />
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      Recommended roadmap generated
                    </p>
                    <p className="text-xs text-muted">
                      4-phase execution plan with milestones
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Architecture */}
      <section id="architecture" className="border-y border-border bg-surface py-20 md:py-32">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <SectionHeader
            title="Built for scale"
            description="Modern architecture powering real-time AI intelligence"
            className="mb-12 text-center [&>div]:mx-auto [&>div]:max-w-2xl"
          />
          <div className="mx-auto grid max-w-5xl gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { layer: "Frontend", tech: "Next.js 15 + React 19", desc: "App Router, SSR, Turbopack" },
              { layer: "AI Engine", tech: "Google Gemini", desc: "Structured output + fallbacks" },
              { layer: "Database", tech: "Prisma + MySQL", desc: "Type-safe data layer" },
              { layer: "Auth", tech: "NextAuth v5", desc: "Secure JWT sessions" },
            ].map((item, index) => (
              <motion.div
                key={item.layer}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08 }}
                className="rounded-xl border border-border bg-card p-5"
              >
                <p className="text-xs font-medium uppercase tracking-wider text-primary">
                  {item.layer}
                </p>
                <p className="mt-2 font-semibold text-foreground">{item.tech}</p>
                <p className="mt-1 text-xs text-muted">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Impact Metrics */}
      <section id="impact" className="py-20 md:py-32">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <SectionHeader
            title="Measurable impact"
            description="LaunchLens transforms how founders make go/no-go decisions"
            className="mb-12 text-center [&>div]:mx-auto [&>div]:max-w-2xl"
          />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { value: "10x", label: "Faster validation", desc: "Minutes vs months of research" },
              { value: "8", label: "AI modules", desc: "Analysis through executive reports" },
              { value: "4", label: "Demo projects", desc: "Fully loaded sample portfolio" },
              { value: "100%", label: "Data ownership", desc: "Your projects, your insights" },
            ].map((metric, index) => (
              <motion.div
                key={metric.label}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="rounded-xl border border-border bg-card p-6 text-center"
              >
                <p className="text-3xl font-bold text-gradient-primary">{metric.value}</p>
                <p className="mt-2 font-medium text-foreground">{metric.label}</p>
                <p className="mt-1 text-xs text-muted">{metric.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="border-t border-border bg-surface py-20 md:py-32">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <SectionHeader
            title="Trusted by builders"
            description="See what founders and product teams are saying"
            className="mb-12 text-center [&>div]:mx-auto [&>div]:max-w-2xl"
          />
          <div className="grid gap-6 md:grid-cols-3">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.author}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="rounded-xl border border-border bg-card p-6"
              >
                <Quote className="mb-4 h-8 w-8 text-primary/40" />
                <p className="mb-6 text-sm leading-relaxed text-muted">
                  &ldquo;{testimonial.quote}&rdquo;
                </p>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      {testimonial.author}
                    </p>
                    <p className="text-xs text-muted">{testimonial.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 md:py-32">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="relative overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-primary/10 via-card to-card p-8 text-center md:p-16"
          >
            <div className="absolute inset-0 grid-pattern opacity-20" />
            <div className="relative">
              <h2 className="text-3xl font-bold text-foreground md:text-4xl">
                Ready to validate your next idea?
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-muted">
                Join thousands of founders who use LaunchLens to make smarter
                decisions before they build.
              </p>
              <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Button size="lg" asChild className="glow-primary">
                  <Link href="/analyzer">
                    Get Started Free
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </Button>
                <Button size="lg" variant="secondary" asChild>
                  <Link href="/demo">Explore Demo</Link>
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
