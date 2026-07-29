import Image from "next/image";
import Link from "next/link";
import { Grid, Wrench, Send, GitBranch, MessageCircle, Mail } from "lucide-react";
import { socialLinks } from "@/data/social-links";
import styles from "./Hero.module.css";

export default function Hero() {
  return (
    <section id="hero" className={styles.heroSection}>
      <div className="container">
        <div className={styles.heroGrid}>
          {/* Left Column */}
          <div>
            <div className={styles.badge}>
              <span className={styles.dot} />
              Network • Technology • Development
            </div>

            <h1 className={styles.title}>
              Semua Proyek dan Tool, <br />
              Dalam <span className={styles.titleHighlight}>Satu Base.</span>
            </h1>

            <p className={styles.description}>
              ALLBASE adalah pusat portofolio, proyek, dan berbagai tool yang saya bangun untuk pembelajaran jaringan telekomunikasi, teknologi, dan pengembangan aplikasi web modern.
            </p>

            <div className={styles.actions}>
              <Link href="#projects" className={styles.btnPrimary}>
                <Grid size={18} /> Lihat Proyek
              </Link>

              <Link href="#tools" className={styles.btnSecondary}>
                <Wrench size={18} /> Buka Tools
              </Link>

              <Link href="#contact" className={styles.btnOutline}>
                <Send size={18} /> Hubungi Saya
              </Link>
            </div>

            <div className={styles.socials}>
              <a
                href={socialLinks.github}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.socialBtn}
                title="Profil GitHub"
                aria-label="Profil GitHub"
              >
                <GitBranch size={20} />
              </a>

              <a
                href={socialLinks.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.socialBtn}
                title="Chat WhatsApp"
                aria-label="Chat WhatsApp"
              >
                <MessageCircle size={20} />
              </a>

              <a
                href={socialLinks.email}
                className={styles.socialBtn}
                title="Kirim Email"
                aria-label="Kirim Email"
              >
                <Mail size={20} />
              </a>
            </div>
          </div>

          {/* Right Column: Visual Profile Frame */}
          <div className={styles.profileVisual}>
            <div className={styles.profileImageWrapper}>
              <Image
                src="/profile.jpg"
                alt="Ilal Ilhamdi"
                fill
                priority
                sizes="(max-width: 640px) 88vw, (max-width: 1024px) 42vw, 340px"
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
          </div>
        </div>
      </div>
    </section>
  );
}
