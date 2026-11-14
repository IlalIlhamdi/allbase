import styles from "./About.module.css";

export default function About() {
  return (
    <section id="about" className={styles.aboutSection} aria-labelledby="about-title">
      <div className={styles.aboutContainer}>
        <div className={styles.aboutCard}>
          <div className={styles.aboutContent}>
            <span className={styles.aboutBadge}>DI BALIK ALLBASE</span>

            <h2 id="about-title" className={styles.aboutTitle}>
              Belajar. Membangun. Berbagi.
            </h2>

            <p className={styles.aboutDesc}>
              Seorang mahasiswa yang tertarik pada jaringan komputer, pengembangan
              web, dan teknologi terbuka.
            </p>
          </div>

          <div className={styles.tagGroup}>
            <span className={styles.tagPill}>Networking</span>
            <span className={styles.tagPill}>Web Development</span>
            <span className={styles.tagPill}>MikroTik</span>
          </div>
        </div>
      </div>
    </section>
  );
}
