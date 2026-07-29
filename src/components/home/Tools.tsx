import { toolsData } from "@/data/tools";
import ToolCard from "@/components/cards/ToolCard";

export default function Tools() {
  return (
    <section id="tools" className="section section-alt" aria-labelledby="tools-title">
      <div className="container">
        <div style={{ textAlign: "center", marginBottom: "clamp(32px, 5vw, 48px)" }}>
          <span
            style={{
              padding: "4px 12px",
              borderRadius: "var(--radius-pill)",
              backgroundColor: "var(--color-primary-50)",
              color: "var(--color-primary-600)",
              fontSize: "0.82rem",
              fontWeight: 600,
              display: "inline-block",
              marginBottom: "12px",
              border: "1px solid var(--color-border)",
            }}
          >
            Produktivitas
          </span>
          <h2 id="tools-title" className="sectionTitle">
            Web Tools &amp; Utility
          </h2>
          <p className="sectionDescription">
            Alat praktis berbasis web untuk kalkulasi subnet, uji kecepatan jaringan, dan utilitas teknis.
          </p>
        </div>

        <div className="cardsGrid">
          {toolsData.map((tool) => (
            <ToolCard key={tool.id} tool={tool} />
          ))}
        </div>
      </div>
    </section>
  );
}
