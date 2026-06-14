"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { BarChart3, Sparkles, Zap } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  analyzeProjectInputSchema,
  projectAnalysisSchema,
  type AnalyzeProjectInput,
  type ProjectAnalysis,
} from "@/lib/validations/analysis";
import { SAMPLE_PROJECTS } from "@/lib/constants/sample-projects";
import { EXPERIENCE_LEVELS } from "@/lib/validations/project";
import { saveAnalysisResult } from "@/lib/utils/analysis-storage";
import { AnalysisLoading } from "@/components/analysis/AnalysisLoading";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils/cn";

interface AnalysisFormProps {
  onAnalysisComplete?: (analysis: ProjectAnalysis) => void;
  redirectToResults?: boolean;
}

export function AnalysisForm({
  onAnalysisComplete,
  redirectToResults = true,
}: AnalysisFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<AnalyzeProjectInput>({
    resolver: zodResolver(analyzeProjectInputSchema),
    defaultValues: {
      title: "",
      description: "",
      budget: "",
      timeline: "",
      teamSize: 1,
      experienceLevel: "intermediate",
    },
  });

  const experienceLevel = form.watch("experienceLevel");

  function fillSample(sample: (typeof SAMPLE_PROJECTS)[number]) {
    form.reset(sample.data);
    toast.success(`Loaded "${sample.label}" example`);
  }

  async function onSubmit(data: AnalyzeProjectInput) {
    setIsLoading(true);

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error ?? "Analysis failed");
      }

      const parsed = projectAnalysisSchema.safeParse(result);
      if (!parsed.success) {
        throw new Error("Invalid analysis response");
      }

      const payload = {
        analysis: parsed.data,
        usedFallback: result.usedFallback ?? false,
        projectTitle: data.title,
        timestamp: new Date().toISOString(),
      };

      saveAnalysisResult(payload);
      onAnalysisComplete?.(parsed.data);

      if (redirectToResults) {
        router.push("/analyzer/results");
      }
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to analyze project"
      );
    } finally {
      setIsLoading(false);
    }
  }

  if (isLoading) {
    return <AnalysisLoading fullPage />;
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="mb-3 text-xs font-medium uppercase tracking-wide text-muted">
          Try an example
        </p>
        <div className="flex flex-wrap gap-2">
          {SAMPLE_PROJECTS.map((sample) => (
            <Button
              key={sample.id}
              type="button"
              variant="outline"
              size="sm"
              onClick={() => fillSample(sample)}
              className="gap-1.5"
            >
              <Zap className="h-3.5 w-3.5 text-primary" />
              {sample.label}
            </Button>
          ))}
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Project Title</FormLabel>
                <FormControl>
                  <Input
                    placeholder="e.g., SaaS Project Management Tool"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Describe your project idea, target audience, and key features..."
                    className="min-h-[160px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid gap-4 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="budget"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Budget</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., $5,000" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="timeline"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Timeline</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., 3 months" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="teamSize"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Team Size</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={1}
                      {...field}
                      onChange={(e) =>
                        field.onChange(parseInt(e.target.value, 10) || 1)
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormItem>
              <FormLabel>Experience Level</FormLabel>
              <Select
                value={experienceLevel}
                onValueChange={(value) =>
                  form.setValue(
                    "experienceLevel",
                    value as AnalyzeProjectInput["experienceLevel"]
                  )
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select level" />
                </SelectTrigger>
                <SelectContent>
                  {EXPERIENCE_LEVELS.map((level) => (
                    <SelectItem key={level.value} value={level.value}>
                      {level.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <input
                type="hidden"
                {...form.register("experienceLevel")}
                value={experienceLevel}
              />
            </FormItem>
          </div>

          <Button className="w-full" size="lg" type="submit">
            <BarChart3 className="h-4 w-4" />
            Run Analysis
          </Button>
        </form>
      </Form>

      <div
        className={cn(
          "flex items-center gap-3 rounded-lg border border-dashed border-border bg-surface/30 px-4 py-3"
        )}
      >
        <Sparkles className="h-4 w-4 shrink-0 text-primary" />
        <p className="text-xs text-muted">
          Analysis runs through our AI engine and opens a full dashboard with
          scores, risks, skill gaps, and an MVP build plan.
        </p>
      </div>
    </div>
  );
}
