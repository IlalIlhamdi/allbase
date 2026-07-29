import { skillsData } from "@/data/skills";
import SkillCard from "@/components/cards/SkillCard";

export default function Skills() {
  return (
    <section id="skills" className="section" aria-labelledby="skills-title">
      <div className="container">
        <div style={{ textAlign: "center", marginBottom: "48px" }}>
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
            Tech Stack
          </span>
          <h2 id="skills-title" style={{ fontSize: "2rem", marginBottom: "12px" }}>
            Keahlian &amp; Teknologi
          </h2>
          <p style={{ color: "var(--color-text-secondary)", maxWidth: "600px", marginInline: "auto" }}>
            Perangkat lunak, hardware jaringan, dan bahasa pemrosesan yang saya gunakan.
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "24px",
          }}
        >
          {skillsData.map((category) => (
            <SkillCard key={category.category} category={category} />
          ))}
        </div>
      </div>
    </section>
  );
}
