import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://allbase.my.id";
  const lastMod = "2026-07-29";

  const routes = [
    "",
    "/tools/internet-speed-test",
    "/tools/subnet-calculator",
    "/tools/ip-calculator",
    "/tools/network-converter",
    "/class-schedule",
    "/college-tasks",
    "/friendship-page",
    "/ilal-gps",
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: lastMod,
    changeFrequency: route === "" ? "daily" : "weekly",
    priority: route === "" ? 1.0 : route.includes("internet-speed-test") ? 0.9 : 0.8,
  }));
}
