import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { DEMO_PROJECTS } from "@/lib/demo/demo-data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MarketingHeader } from "@/components/layout/marketing-header";
import { MarketingFooter } from "@/components/layout/marketing-footer";

export default function DemoPage() {
  return (
    <>
      <MarketingHeader />
      <main className="min-h-screen pt-24 pb-16">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <div className="mb-12 text-center">
            <Badge variant="default" className="mb-4">
              <Sparkles className="mr-1 h-3 w-3" />
              Interactive Demo
            </Badge>
            <h1 className="text-3xl font-bold tracking-tight text-foreground md:text-5xl">
              Explore LaunchLens{" "}
              <span className="text-gradient-primary">Instantly</span>
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-muted">
              Four fully-loaded demo projects with analysis, simulations, roadmaps,
              team plans, and executive reports. No signup required.
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <Button size="lg" asChild className="glow-primary">
                <Link href="/demo/projects/launchlens-ai">
                  Start Exploring
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="secondary" asChild>
                <Link href="/auth/register">Create Free Account</Link>
              </Button>
            </div>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            {DEMO_PROJECTS.map((project) => (
              <Link
                key={project.slug}
                href={`/demo/projects/${project.slug}`}
                className="group rounded-xl border border-border bg-card p-6 transition-all hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5"
              >
                <div className="mb-4 flex items-start justify-between">
                  <div
                    className="flex h-10 w-10 items-center justify-center rounded-lg text-sm font-bold text-white"
                    style={{ backgroundColor: project.color }}
                  >
                    {project.title.charAt(0)}
                  </div>
                  <Badge
                    variant={
                      project.successScore >= 75
                        ? "success"
                        : project.successScore >= 60
                          ? "warning"
                          : "default"
                    }
                  >
                    {project.successScore}% Success
                  </Badge>
                </div>
                <h2 className="mb-1 text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                  {project.title}
                </h2>
                <p className="mb-3 text-sm text-primary">{project.tagline}</p>
                <p className="mb-4 text-sm text-muted line-clamp-2">
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-2 text-xs text-muted">
                  <span className="rounded-full bg-surface px-2 py-1">
                    Analysis ✓
                  </span>
                  <span className="rounded-full bg-surface px-2 py-1">
                    Simulation ✓
                  </span>
                  <span className="rounded-full bg-surface px-2 py-1">
                    Roadmap ✓
                  </span>
                  <span className="rounded-full bg-surface px-2 py-1">
                    Team Plan ✓
                  </span>
                  <span className="rounded-full bg-surface px-2 py-1">
                    Report ✓
                  </span>
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-12 rounded-xl border border-border bg-surface p-6 text-center md:p-8">
            <h3 className="text-lg font-semibold text-foreground">
              Want this data in your account?
            </h3>
            <p className="mt-2 text-sm text-muted">
              Sign up and load demo projects into your workspace with one click.
            </p>
            <Button className="mt-4" asChild>
              <Link href="/auth/register">
                Get Started Free
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </main>
      <MarketingFooter />
    </>
  );
}
