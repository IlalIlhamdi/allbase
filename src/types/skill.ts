export interface SkillItem {
  name: string;
  icon: string;
  level?: "basic" | "intermediate" | "advanced" | "expert" | "Basic" | "Intermediate" | "Advanced" | "Expert";
}

export interface SkillCategory {
  category: string;
  icon: string;
  description: string;
  items: readonly SkillItem[];
}
