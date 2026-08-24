"use client";

import { useState, useEffect, useCallback } from "react";
import { toolsData } from "@/data/tools";
import { Tool } from "@/types/tool";

const STORAGE_KEY = "allbase_recent_tools";
const MAX_RECENT = 5;

export interface RecentToolItem {
  id: string;
  title: string;
  href: string;
  icon: string;
  category: string;
  visitedAt: number;
}

export function useRecentTools() {
  const [recentTools, setRecentTools] = useState<RecentToolItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setRecentTools(parsed.slice(0, MAX_RECENT));
        }
      }
    } catch {
      // Ignore localStorage read errors (e.g. disabled in iframe or private mode)
    } finally {
      setIsLoaded(true);
    }
  }, []);

  const addRecentTool = useCallback((toolOrId: Tool | string) => {
    let tool: Tool | undefined;
    if (typeof toolOrId === "string") {
      tool = toolsData.find((t) => t.id === toolOrId || t.href === toolOrId);
    } else {
      tool = toolOrId;
    }

    if (!tool || tool.href.startsWith("http")) return;

    setRecentTools((prev) => {
      const filtered = prev.filter((item) => item.id !== tool!.id && item.href !== tool!.href);
      const updated: RecentToolItem[] = [
        {
          id: tool!.id,
          title: tool!.title,
          href: tool!.href,
          icon: tool!.icon,
          category: tool!.category,
          visitedAt: Date.now(),
        },
        ...filtered,
      ].slice(0, MAX_RECENT);

      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch {
        // Ignore write failures
      }

      return updated;
    });
  }, []);

  const clearRecentTools = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Ignore
    }
    setRecentTools([]);
  }, []);

  return {
    recentTools,
    isLoaded,
    addRecentTool,
    clearRecentTools,
  };
}
