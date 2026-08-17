import Link from "next/link";
import { Project } from "@/types/project";
import { ExternalLink, GitBranch, Layers, CheckSquare, Calendar, Heart, BarChart3 } from "lucide-react";

const iconMap: Record<string, React.ReactNode> = {
  layers: <Layers size={20} />,
  "check-square": <CheckSquare size={20} />,
  calendar: <Calendar size={20} />,
  heart: <Heart size={20} />,
  "bar-chart-3": <BarChart3 size={20} />,
};

interface ProjectCardProps {
  project: Project;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  const isExternal = project.href.startsWith("http");

  return (
    <article
      style={{
        backgroundColor: "var(--color-surface)",
        border: "1px solid var(--color-border)",
        borderRadius: "var(--radius-md)",
        padding: "clamp(18px, 4vw, 24px)",
        display: "flex",
        flexDirection: "column",
        gap: "16px",
        boxShadow: "var(--shadow-sm)",
        transition: "transform var(--transition-normal), box-shadow var(--transition-normal), border-color var(--transition-normal)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "8px" }}>
        <div
          style={{
            width: "44px",
            height: "44px",
            borderRadius: "var(--radius-sm)",
            backgroundColor: "var(--color-primary-50)",
            color: "var(--color-primary-600)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {iconMap[project.icon] || <Layers size={20} />}
        </div>
        <span
          style={{
            padding: "4px 10px",
            borderRadius: "var(--radius-pill)",
            fontSize: "0.75rem",
            fontWeight: 600,
            backgroundColor: project.status === "completed" ? "var(--color-success-soft)" : "var(--color-warning-soft)",
            color: project.status === "completed" ? "var(--color-success)" : "var(--color-warning)",
          }}
        >
          {project.status === "completed" ? "Selesai" : "Pengembangan"}
        </span>
      </div>

      <div>
        <h3 style={{ fontSize: "1.15rem", marginBottom: "6px" }}>{project.title}</h3>
        <p style={{ fontSize: "0.9rem", color: "var(--color-text-secondary)", lineHeight: 1.6 }}>{project.description}</p>
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginTop: "auto" }}>
        {project.tags.map((tag) => (
          <span
            key={tag}
            style={{
              fontSize: "0.75rem",
              fontFamily: "var(--font-mono)",
              padding: "3px 9px",
              borderRadius: "var(--radius-sm)",
              backgroundColor: "var(--color-surface-soft)",
              border: "1px solid var(--color-border)",
              color: "var(--color-text-secondary)",
            }}
          >
            {tag}
          </span>
        ))}
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", paddingTop: "12px", borderTop: "1px solid var(--color-border)" }}>
        {project.href && (
          <Link
            href={project.href}
            target={isExternal || project.openMode === "new-tab" ? "_blank" : undefined}
            rel={isExternal || project.openMode === "new-tab" ? "noopener noreferrer" : undefined}
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "6px",
              minHeight: "44px",
              padding: "8px 16px",
              borderRadius: "var(--radius-sm)",
              backgroundColor: "var(--color-primary-600)",
              color: "#ffffff",
              fontSize: "0.88rem",
              fontWeight: 600,
              flex: 1,
            }}
          >
            Lihat Proyek <ExternalLink size={14} />
          </Link>
        )}
        {project.repositoryUrl && (
          <a
            href={project.repositoryUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "6px",
              minHeight: "44px",
              padding: "8px 16px",
              borderRadius: "var(--radius-sm)",
              border: "1px solid var(--color-border)",
              color: "var(--color-text-primary)",
              fontSize: "0.88rem",
              fontWeight: 600,
            }}
            title="Repository Kode GitHub"
            aria-label="Repository Kode GitHub"
          >
            <GitBranch size={14} /> GitHub
          </a>
        )}
      </div>
    </article>
  );
}
