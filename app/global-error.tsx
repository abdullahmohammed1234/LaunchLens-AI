"use client";

import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-[#0A0A0A] font-sans text-[#FAFAFA] antialiased">
        <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-500/10">
            <AlertTriangle className="h-8 w-8 text-red-500" />
          </div>
          <h1 className="mb-2 text-2xl font-bold">Critical Error</h1>
          <p className="mb-8 max-w-md text-gray-400">
            LaunchLens encountered a critical error. Please refresh the page.
          </p>
          <Button onClick={reset}>
            <RefreshCw className="h-4 w-4" />
            Refresh Application
          </Button>
        </div>
      </body>
    </html>
  );
}
