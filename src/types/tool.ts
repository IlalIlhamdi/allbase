import { ProjectStatus } from "./project";

export interface Tool {
  id: string;
  title: string;
  description: string;
  category: "Networking" | "Productivity" | "Academic" | "Utility" | "Tools" | "Sosial";
  icon: string;
  tags: readonly string[];
  status: ProjectStatus;
  href: string;
  featured: boolean;
  openMode?: "same-tab" | "new-tab";
  thumbnail?: string;
}
