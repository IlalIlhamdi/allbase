import { SkillCategory } from "@/types/skill";
import { Network, Activity, Code, Cloud, Cpu, Server, Calculator, Database, BarChart2, Bell, Share2, FileCode, Palette, Code2, Layers, Monitor, GitBranch, Zap } from "lucide-react";

const skillIconMap: Record<string, React.ReactNode> = {
  network: <Network size={20} />,
  activity: <Activity size={20} />,
  code: <Code size={20} />,
  cloud: <Cloud size={20} />,
  cpu: <Cpu size={16} />,
  server: <Server size={16} />,
  calculator: <Calculator size={16} />,
  database: <Database size={16} />,
  "bar-chart-2": <BarChart2 size={16} />,
  bell: <Bell size={16} />,
  "share-2": <Share2 size={16} />,
  "file-code": <FileCode size={16} />,
  palette: <Palette size={16} />,
  "code-2": <Code2 size={16} />,
  layers: <Layers size={16} />,
  monitor: <Monitor size={16} />,
  "git-branch": <GitBranch size={16} />,
  zap: <Zap size={16} />,
};

interface SkillCardProps {
  category: SkillCategory;
}

export default function SkillCard({ category }: SkillCardProps) {
  return (
    <article
      style={{
        backgroundColor: "var(--color-surface)",
        border: "1px solid var(--color-border)",
        borderRadius: "var(--radius-md)",
        padding: "24px",
        boxShadow: "var(--shadow-sm)",
        display: "flex",
        flexDirection: "column",
        gap: "16px",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <div
          style={{
            width: "40px",
            height: "40px",
            borderRadius: "var(--radius-sm)",
            backgroundColor: "var(--color-primary-50)",
            color: "var(--color-primary-600)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {skillIconMap[category.icon] || <Code size={20} />}
        </div>
        <div>
          <h3 style={{ fontSize: "1.1rem" }}>{category.category}</h3>
          <p style={{ fontSize: "0.85rem", color: "var(--color-text-secondary)" }}>{category.description}</p>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "10px" }}>
        {category.items.map((item) => (
          <div
            key={item.name}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "10px 14px",
              borderRadius: "var(--radius-sm)",
              backgroundColor: "var(--color-surface-soft)",
              border: "1px solid var(--color-border)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <span style={{ color: "var(--color-primary-600)" }}>{skillIconMap[item.icon] || <Code2 size={16} />}</span>
              <span style={{ fontSize: "0.9rem", fontWeight: 600 }}>{item.name}</span>
            </div>
            {item.level && (
              <span
                style={{
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  color: "var(--color-text-muted)",
                  fontFamily: "var(--font-mono)",
                }}
              >
                {item.level}
              </span>
            )}
          </div>
        ))}
      </div>
    </article>
  );
}
