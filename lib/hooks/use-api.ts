"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { monitor } from "@/lib/monitoring";

interface FetchOptions extends RequestInit {
  successMessage?: string;
  errorMessage?: string;
}

export async function fetchWithHandling<T = unknown>(
  url: string,
  options?: FetchOptions
): Promise<{ data: T | null; error: string | null }> {
  try {
    const response = await fetch(url, options);
    const result = await response.json().catch(() => ({}));

    if (!response.ok) {
      const message =
        (result as { error?: string }).error ??
        options?.errorMessage ??
        "Request failed";
      monitor.warn("API request failed", { url, status: response.status, message });
      toast.error(message);
      return { data: null, error: message };
    }

    if (options?.successMessage) {
      toast.success(options.successMessage);
    }

    return { data: result as T, error: null };
  } catch (error) {
    const message = options?.errorMessage ?? "Network error. Please try again.";
    monitor.error("API network error", error, { url });
    toast.error(message);
    return { data: null, error: message };
  }
}

export function useProductHealth() {
  const [metrics, setMetrics] = useState<ReturnType<typeof monitor.getRecentMetrics>>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(monitor.getRecentMetrics());
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return { metrics };
}
