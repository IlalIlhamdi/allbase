import { skillsData } from "@/data/skills";
import SkillCard from "@/components/cards/SkillCard";

export default function Skills() {
  return (
    <section id="skills" className="section" aria-labelledby="skills-title">
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
            Tech Stack
          </span>
          <h2 id="skills-title" className="sectionTitle">
            Keahlian &amp; Teknologi
          </h2>
          <p className="sectionDescription">
            Perangkat lunak, hardware jaringan, dan bahasa pemrosesan yang saya gunakan.
          </p>
        </div>

        <div className="cardsGrid">
          {skillsData.map((category) => (
            <SkillCard key={category.category} category={category} />
          ))}
        </div>
      </div>
    </section>
  );
}
