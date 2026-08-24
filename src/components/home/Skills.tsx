import { Cpu } from "lucide-react";
import { skillsData } from "@/data/skills";
import SkillCard from "@/components/cards/SkillCard";

export default function Skills() {
  return (
    <section id="skills" className="section" aria-labelledby="skills-title">
      <div className="container">
        <div className="sectionHeader">
          <span className="sectionBadge">
            <Cpu size={14} /> Tech Stack &amp; Tools
          </span>
          <h2 id="skills-title" className="sectionTitle">
            Keahlian &amp; Penguasaan Teknologi
          </h2>
          <p className="sectionDescription">
            Perangkat lunak simulasi, hardware jaringan Cisco &amp; MikroTik, dan bahasa pemrograman modern yang saya kuasai.
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
