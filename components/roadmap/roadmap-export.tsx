"use client";

import { useState } from "react";
import { Download, Printer } from "lucide-react";
import type { StoredRoadmap } from "@/types/roadmap";
import {
  buildRoadmapExportData,
  roadmapExportToPrintHtml,
} from "@/lib/export/roadmap-export";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface RoadmapExportPanelProps {
  roadmap: StoredRoadmap;
  projectTitle: string;
}

export function RoadmapExportPanel({
  roadmap,
  projectTitle,
}: RoadmapExportPanelProps) {
  const [isExporting, setIsExporting] = useState(false);

  function getExportData() {
    return buildRoadmapExportData(roadmap, projectTitle);
  }

  function handlePrint() {
    const html = roadmapExportToPrintHtml(getExportData());
    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      toast.error("Pop-up blocked. Allow pop-ups to print the roadmap.");
      return;
    }
    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  }

  async function handleDownloadHtml() {
    setIsExporting(true);
    try {
      const html = roadmapExportToPrintHtml(getExportData());
      const blob = new Blob([html], { type: "text/html" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${projectTitle.replace(/\s+/g, "-").toLowerCase()}-roadmap.html`;
      link.click();
      URL.revokeObjectURL(url);
      toast.success("Roadmap exported as HTML (PDF-ready structure)");
    } catch {
      toast.error("Export failed");
    } finally {
      setIsExporting(false);
    }
  }

  return (
    <div className="flex flex-wrap items-center justify-center gap-3 rounded-xl border border-dashed border-border bg-surface/30 p-6">
      <p className="w-full text-center text-sm text-muted">
        Export your execution roadmap for sharing or printing
      </p>
      <Button variant="outline" onClick={handlePrint}>
        <Printer className="h-4 w-4" />
        Print Roadmap
      </Button>
      <Button
        variant="secondary"
        onClick={handleDownloadHtml}
        disabled={isExporting}
      >
        <Download className="h-4 w-4" />
        {isExporting ? "Exporting..." : "Download HTML Report"}
      </Button>
    </div>
  );
}
