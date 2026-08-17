import Link from "next/link";
import { Tool } from "@/types/tool";
import { Gauge, Calculator, Cpu, Binary, MapPin, MessageCircle, ArrowRight } from "lucide-react";

const toolIconMap: Record<string, React.ReactNode> = {
  gauge: <Gauge size={20} />,
  calculator: <Calculator size={20} />,
  cpu: <Cpu size={20} />,
  binary: <Binary size={20} />,
  "map-pin": <MapPin size={20} />,
  "message-circle": <MessageCircle size={20} />,
};

interface ToolCardProps {
  tool: Tool;
}

export default function ToolCard({ tool }: ToolCardProps) {
  const isExternal = tool.href.startsWith("http");

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
        transition: "transform var(--transition-normal), border-color var(--transition-normal)",
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
          {toolIconMap[tool.icon] || <Cpu size={20} />}
        </div>
        <span
          style={{
            padding: "4px 10px",
            borderRadius: "var(--radius-pill)",
            fontSize: "0.75rem",
            fontWeight: 600,
            backgroundColor: "var(--color-surface-soft)",
            color: "var(--color-primary-600)",
            border: "1px solid var(--color-border)",
          }}
        >
          {tool.category}
        </span>
      </div>

      <div>
        <h3 style={{ fontSize: "1.15rem", marginBottom: "6px" }}>{tool.title}</h3>
        <p style={{ fontSize: "0.9rem", color: "var(--color-text-secondary)", lineHeight: 1.6 }}>{tool.description}</p>
      </div>

      <div style={{ marginTop: "auto", paddingTop: "12px", borderTop: "1px solid var(--color-border)" }}>
        <Link
          href={tool.href}
          target={isExternal || tool.openMode === "new-tab" ? "_blank" : undefined}
          rel={isExternal || tool.openMode === "new-tab" ? "noopener noreferrer" : undefined}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            minHeight: "44px",
            fontWeight: 600,
            fontSize: "0.9rem",
            color: "var(--color-primary-600)",
          }}
        >
          Buka Tool <ArrowRight size={16} />
        </Link>
      </div>
    </article>
  );
}
