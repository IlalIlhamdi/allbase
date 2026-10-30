import Hero from "@/components/home/Hero";
import About from "@/components/home/About";
import Projects from "@/components/home/Projects";
import Tools from "@/components/home/Tools";
import Skills from "@/components/home/Skills";
import Certifications from "@/components/home/Certifications";
import Contact from "@/components/home/Contact";
import styles from "./page.module.css";

export default function HomePage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "name": "ALLBASE",
        "alternateName": "ALLBASE HUB",
        "url": "https://allbase.my.id",
      },
      {
        "@type": "Person",
        "name": "Ilal Ilhamdi",
        "url": "https://allbase.my.id",
        "image": "https://allbase.my.id/profile.jpg",
        "jobTitle": "Network & Technology Enthusiast",
        "sameAs": [
          "https://github.com/IlalIlhamdi/allbase",
          "https://www.tiktok.com/@raxil424?_r=1&_t=ZS-98RAfFICARl",
        ],
      },
    ],
  };

  return (
    <div className={styles.homeFlow}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className={styles.slotHero}>
        <Hero />
      </div>
      <div className={styles.slotAbout}>
        <About />
      </div>
      <div className={styles.slotProjects}>
        <Projects />
      </div>
      <div className={styles.slotTools}>
        <Tools />
      </div>
      <div className={styles.slotSkills}>
        <Skills />
      </div>
      <div className={styles.slotQuickLinks}>
        <Certifications />
      </div>
      <div className={styles.slotContact}>
        <Contact />
      </div>
    </div>
  );
}
