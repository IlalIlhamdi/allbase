export type ProjectStatus = "completed" | "development" | "planned";

export interface Project {
  id: string;
  title: string;
  description: string;
  category: string;
  type?: "project" | "tool";
  icon: string;
  tags: readonly string[];
  status: ProjectStatus;
  href: string;
  repositoryUrl?: string;
  featured: boolean;
  year?: number;
  openMode?: "same-tab" | "new-tab";
  thumbnail?: string;
}
