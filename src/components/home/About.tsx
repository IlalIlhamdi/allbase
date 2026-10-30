import Link from "next/link";
import { User, ArrowRight, Network, Monitor, Router } from "lucide-react";
import styles from "./About.module.css";

export default function About() {
  return (
    <section id="about" className={styles.aboutSection} aria-labelledby="about-title">
      {/* ====================================================================
          DESKTOP ABOUT (>= 768px)
          ==================================================================== */}
      <div className={`container ${styles.desktopAbout}`}>
        <div className={styles.aboutCard}>
          <div className={styles.leftCol}>
            <div className={styles.headerRow}>
              <div className={styles.userBadge} aria-hidden="true">
                <User size={19} />
              </div>
              <h2 id="about-title" className={styles.title}>
                Tentang Saya
              </h2>
            </div>

            <p className={styles.bioText}>
              Halo! Saya <strong>Ilal Ilhamdi</strong>, seorang Network &amp; Technology
              Enthusiast yang tertarik pada jaringan telekomunikasi, teknologi, dan
              pengembangan aplikasi web modern. Melalui ALLBASE HUB, saya membagikan
              proyek, catatan pembelajaran, dan berbagai tools yang saya bangun untuk
              mempermudah proses belajar dan bekerja.
            </p>

            <Link href="#skills" className={styles.moreBtn}>
              <span>Lihat Selengkapnya</span>
              <ArrowRight size={15} />
            </Link>
          </div>

          <div className={styles.rightCol}>
            <h3 className={styles.interestTitle}>Bidang Minat</h3>

            <div className={styles.interestList}>
              <div className={styles.interestPill}>
                <Network size={16} className={styles.pillIcon} />
                <span>Networking</span>
              </div>

              <div className={styles.interestPill}>
                <Monitor size={16} className={styles.pillIcon} />
                <span>Web Development</span>
              </div>

              <div className={styles.interestPill}>
                <Router size={16} className={styles.pillIcon} />
                <span>MikroTik</span>
              </div>
            </div>

            <svg
              className={styles.laptopArtwork}
              viewBox="0 0 240 180"
              fill="none"
              aria-hidden="true"
            >
              <polygon points="20,165 75,95 115,165" fill="#dcecff" />
              <polygon points="75,95 115,165 145,125" fill="#b7d8ff" />
              <polygon points="150,165 195,80 235,165" fill="#e4f1ff" />
              <polygon points="195,80 235,165 245,115" fill="#bfdcf9" />
              <ellipse cx="145" cy="154" rx="72" ry="10" fill="#bfd9f8" opacity="0.55" />
              <rect
                x="92"
                y="48"
                width="98"
                height="66"
                rx="6"
                transform="skewX(-8)"
                fill="#1d6fd8"
                stroke="#ffffff"
                strokeWidth="2.5"
              />
              <rect
                x="97"
                y="53"
                width="88"
                height="56"
                rx="3"
                transform="skewX(-8)"
                fill="#5aa6ff"
              />
              <rect
                x="105"
                y="62"
                width="42"
                height="6"
                rx="3"
                transform="skewX(-8)"
                fill="#ffffff"
                opacity="0.85"
              />
              <rect
                x="105"
                y="73"
                width="64"
                height="4"
                rx="2"
                transform="skewX(-8)"
                fill="#d8ebff"
                opacity="0.8"
              />
              <rect
                x="105"
                y="82"
                width="52"
                height="4"
                rx="2"
                transform="skewX(-8)"
                fill="#d8ebff"
                opacity="0.8"
              />
              <polygon
                points="62,138 86,114 186,114 164,138"
                fill="#e8f2ff"
                stroke="#9ec5f5"
                strokeWidth="1.5"
              />
              <polygon points="62,138 164,138 168,143 58,143" fill="#b5d4f8" />
            </svg>
          </div>
        </div>
      </div>

      {/* ====================================================================
          MOBILE & iOS "DI BALIK ALLBASE" (<= 767px)
          ==================================================================== */}
      <div className={styles.mobileAbout}>
        <div className={styles.mobileAboutCard}>
          <span className={styles.mobileAboutBadge}>DI BALIK ALLBASE</span>

          <h2 className={styles.mobileAboutTitle}>
            Belajar. Membangun. Berbagi.
          </h2>

          <div className={styles.mobileAboutBottom}>
            <p className={styles.mobileAboutDesc}>
              Seorang mahasiswa yang tertarik pada jaringan komputer, pengembangan
              web, dan teknologi terbuka.
            </p>

            <div className={styles.mobileTagGroup}>
              <span className={styles.mobileTagPill}>Networking</span>
              <span className={styles.mobileTagPill}>Web Development</span>
              <span className={styles.mobileTagPill}>MikroTik</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
