import Image from "next/image";
import { GitBranch, MessageCircle, Mail } from "lucide-react";
import { socialLinks } from "@/data/social-links";
import styles from "./Hero.module.css";

export default function Hero() {
  return (
    <section id="hero" className={styles.heroSection}>
      {/* Subtle Animated Ambient Background */}
      <div className={styles.ambientContainer} aria-hidden="true">
        <div className={styles.gridPattern} />
        <div className={`${styles.glowOrb} ${styles.glowOrb1}`} />
        <div className={`${styles.glowOrb} ${styles.glowOrb2}`} />
        <div className={`${styles.glowOrb} ${styles.glowOrb3}`} />
      </div>

      <div className="container">
        <div className={styles.heroGrid}>
          {/* Left Column: Hero Content */}
          <div className={styles.heroContent}>
            <div className={styles.badge}>
              <span className={styles.dot} />
              <span className={styles.badgeText}>Network • Technology • Development</span>
            </div>

            <h1 className={styles.title}>
              Semua Proyek dan Tool, Dalam <span className={styles.titleHighlight}>Satu Base.</span>
            </h1>

            <p className={styles.description}>
              ALLBASE adalah pusat portofolio, proyek, dan berbagai tool yang saya bangun untuk pembelajaran jaringan telekomunikasi, teknologi, dan pengembangan aplikasi web modern.
            </p>
          </div>

          {/* Right Column: Visual Profile Frame */}
          <div className={styles.profileVisual}>
            <div className={styles.profileCard}>
              <div className={styles.profileImageWrapper}>
                <Image
                  src="/profile.jpg"
                  alt="Ilal Ilhamdi"
                  fill
                  priority
                  sizes="(max-width: 430px) 86vw, (max-width: 768px) 330px, 380px"
                  style={{
                    objectFit: "cover",
                    objectPosition: "center 35%",
                  }}
                />

                <div className={styles.profileOverlay}>
                  <h3 className={styles.profileName}>Ilal Ilhamdi</h3>
                  <p className={styles.profileRole}>Network &amp; Technology Enthusiast</p>
                </div>
              </div>

              {/* Social Links under Profile Photo */}
              <div className={styles.profileSocialLinks}>
                <a
                  href={socialLinks.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.profileSocialLink}
                  title="Profil GitHub"
                  aria-label="Profil GitHub"
                >
                  <GitBranch size={20} />
                </a>

                <a
                  href={socialLinks.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.profileSocialLink}
                  title="Chat WhatsApp"
                  aria-label="Chat WhatsApp"
                >
                  <MessageCircle size={20} />
                </a>

                <a
                  href={socialLinks.email}
                  className={styles.profileSocialLink}
                  title="Kirim Email"
                  aria-label="Kirim Email"
                >
                  <Mail size={20} />
                </a>

                <a
                  href={socialLinks.tiktok}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.profileSocialLink}
                  title="TikTok RAXIL"
                  aria-label="TikTok RAXIL"
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.29 0 .58.05.85.14V9.41a6.33 6.33 0 0 0-.85-.06 6.33 6.33 0 0 0-6.33 6.33 6.33 0 0 0 6.33-6.33V9.01a8.16 8.16 0 0 0 4.78 1.52V7.1a4.85 4.85 0 0 1-1.005-.41z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
