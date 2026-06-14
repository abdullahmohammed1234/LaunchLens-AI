import { notFound } from "next/navigation";
import { getDemoProject } from "@/lib/demo/demo-data";
import { DemoProjectExplorer } from "@/components/demo/demo-project-explorer";
import { MarketingHeader } from "@/components/layout/marketing-header";
import { MarketingFooter } from "@/components/layout/marketing-footer";

interface DemoProjectPageProps {
  params: Promise<{ slug: string }>;
}

export default async function DemoProjectPage({ params }: DemoProjectPageProps) {
  const { slug } = await params;
  const project = getDemoProject(slug);

  if (!project) {
    notFound();
  }

  return (
    <>
      <MarketingHeader />
      <main className="min-h-screen pt-20 pb-16">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <DemoProjectExplorer project={project} />
        </div>
      </main>
      <MarketingFooter />
    </>
  );
}
