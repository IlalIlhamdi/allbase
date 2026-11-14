import Link from "next/link";
import { ArrowRight, ChevronRight } from "lucide-react";
import styles from "./Projects.module.css";

export default function Projects() {
  return (
    <section id="projects" className={styles.projectsSection} aria-labelledby="projects-title">
      <div className={styles.projectsContainer}>
        <h2 id="projects-title" className={styles.sectionTitle}>
          Karya pilihan
        </h2>

        <div className={styles.projectsGrid}>
          {/* Featured Card 1: ALLBASE Personal Hub Showcase */}
          <Link href="/" className={styles.showcaseCard}>
            <div className={styles.showcasePreview}>
              <svg viewBox="0 0 360 185" className={styles.previewSvg} aria-hidden="true">
                <defs>
                  <linearGradient id="mockBg" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#e2effe" />
                    <stop offset="100%" stopColor="#cde3fd" />
                  </linearGradient>
                  <linearGradient id="triLeft" x1="0" y1="1" x2="1" y2="0">
                    <stop offset="0%" stopColor="#3898ff" />
                    <stop offset="100%" stopColor="#0d74e7" />
                  </linearGradient>
                  <linearGradient id="triRight" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#0b53b5" />
                    <stop offset="100%" stopColor="#063175" />
                  </linearGradient>
                  <linearGradient id="triBot" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#72b8ff" />
                    <stop offset="100%" stopColor="#1b84f9" />
                  </linearGradient>
                </defs>

                {/* Soft Blue Backdrop */}
                <rect width="360" height="185" fill="url(#mockBg)" />

                {/* Inner Floating White App Window */}
                <rect
                  x="18"
                  y="14"
                  width="324"
                  height="171"
                  rx="12"
                  fill="#ffffff"
                  stroke="#d6e6fa"
                  strokeWidth="1.5"
                />

                {/* Top App Bar */}
                <image href="/logo.png" x="30" y="23" width="14" height="14" />
                <text x="48" y="34" fill="#0a192f" fontSize="9.5" fontWeight="800" fontFamily="sans-serif">
                  ALLBASE
                </text>
                <rect x="206" y="24" width="48" height="12" rx="6" fill="#f1f5f9" />
                <rect x="259" y="24" width="26" height="12" rx="6" fill="#f1f5f9" />
                <rect x="289" y="24" width="28" height="12" rx="6" fill="#eff6ff" />
                <circle cx="326" cy="30" r="5.5" fill="#1e293b" />

                {/* Left Sidebar Menu */}
                <rect x="28" y="48" width="58" height="15" rx="6" fill="#e6f1ff" />
                <circle cx="36" cy="55.5" r="2.8" fill="#1577ea" />
                <rect x="43" y="53.5" width="30" height="4" rx="2" fill="#1577ea" />

                <circle cx="36" cy="72" r="2.5" fill="#94a3b8" />
                <rect x="43" y="70" width="24" height="4" rx="2" fill="#64748b" />

                <circle cx="36" cy="87" r="2.5" fill="#94a3b8" />
                <rect x="43" y="85" width="27" height="4" rx="2" fill="#64748b" />

                <circle cx="36" cy="102" r="2.5" fill="#94a3b8" />
                <rect x="43" y="100" width="29" height="4" rx="2" fill="#64748b" />

                <circle cx="36" cy="117" r="2.5" fill="#94a3b8" />
                <rect x="43" y="115" width="25" height="4" rx="2" fill="#64748b" />

                {/* Center Hero Area inside App Window */}
                <rect x="94" y="46" width="236" height="132" rx="9" fill="#f7faff" />
                <text x="108" y="76" fill="#0a192f" fontSize="13.5" fontWeight="800" fontFamily="sans-serif">
                  Ide, karya,
                </text>
                <text x="108" y="92" fill="#0a192f" fontSize="13.5" fontWeight="800" fontFamily="sans-serif">
                  dan <tspan fill="#0d7bf2">koneksi.</tspan>
                </text>
                <rect x="108" y="101" width="95" height="4.5" rx="2.2" fill="#94a3b8" />
                <rect x="108" y="110" width="74" height="4.5" rx="2.2" fill="#94a3b8" />

                {/* Mini Blue Pill CTA */}
                <rect x="108" y="124" width="66" height="18" rx="9" fill="#0d7bf2" />
                <rect x="117" y="131" width="40" height="4" rx="2" fill="#ffffff" />

                {/* 3D Vibrant Faceted Blue Prism on Right */}
                <polygon points="222,134 294,58 272,118" fill="url(#triLeft)" />
                <polygon points="294,58 318,148 272,118" fill="url(#triRight)" />
                <polygon points="222,134 272,118 318,148" fill="url(#triBot)" />
              </svg>
            </div>

            <div className={styles.showcaseBody}>
              <span className={styles.categoryPill}>WEB DEVELOPMENT</span>

              <div className={styles.showcaseBottom}>
                <div className={styles.showcaseText}>
                  <h3 className={styles.showcaseTitle}>ALLBASE Personal Hub</h3>
                  <p className={styles.showcaseDesc}>
                    Website portofolio dan kumpulan network tools pribadi.
                  </p>
                </div>

                <span className={styles.blueCircleBtn} aria-hidden="true">
                  <ArrowRight size={17} strokeWidth={2.4} />
                </span>
              </div>
            </div>
          </Link>

          {/* Featured Card 2: Network Monitoring Card */}
          <Link href="#contact" className={styles.horizontalCard}>
            <div className={styles.darkThumb}>
              <svg viewBox="0 0 180 96" className={styles.previewSvg} aria-hidden="true">
                <rect width="180" height="96" rx="12" fill="#081223" />
                {/* Mini Dark Sidebar */}
                <rect x="6" y="6" width="38" height="84" rx="7" fill="#0d1b33" />
                <rect x="10" y="14" width="24" height="4" rx="2" fill="#475569" />
                <rect x="9" y="24" width="32" height="11" rx="4" fill="#132c52" />
                <rect x="13" y="28" width="20" height="3.5" rx="1.7" fill="#38bdf8" />
                <rect x="10" y="41" width="22" height="3.5" rx="1.7" fill="#334155" />
                <rect x="10" y="51" width="25" height="3.5" rx="1.7" fill="#334155" />

                {/* Center Area Wave Chart */}
                <rect x="48" y="6" width="82" height="84" rx="7" fill="#0c192e" />
                <rect x="54" y="13" width="34" height="5" rx="2.5" fill="#cbd5e1" />
                <path
                  d="M52 80 L52 60 L64 50 L76 64 L88 44 L100 56 L112 40 L124 54 L124 80 Z"
                  fill="#1d74e8"
                  fillOpacity="0.32"
                />
                <polyline
                  points="52,60 64,50 76,64 88,44 100,56 112,40 124,54"
                  fill="none"
                  stroke="#3898ff"
                  strokeWidth="2"
                />

                {/* Right Metrics Column */}
                <rect x="134" y="6" width="40" height="25" rx="5" fill="#0d1b33" />
                <circle cx="141" cy="15" r="2.5" fill="#22c55e" />
                <rect x="147" y="13.5" width="20" height="3.5" rx="1.7" fill="#22c55e" />
                <rect x="139" y="22" width="28" height="3" rx="1.5" fill="#475569" />

                <rect x="134" y="35" width="40" height="25" rx="5" fill="#0d1b33" />
                <circle cx="141" cy="44" r="2.5" fill="#38bdf8" />
                <rect x="147" y="42.5" width="20" height="3.5" rx="1.7" fill="#38bdf8" />
                <rect x="139" y="51" width="28" height="3" rx="1.5" fill="#475569" />

                <rect x="134" y="64" width="40" height="26" rx="5" fill="#0d1b33" />
                <circle cx="141" cy="73" r="2.5" fill="#f59e0b" />
                <rect x="147" y="71.5" width="20" height="3.5" rx="1.7" fill="#f59e0b" />
                <rect x="139" y="80" width="28" height="3" rx="1.5" fill="#475569" />
              </svg>
            </div>

            <div className={styles.horizontalBody}>
              <span className={styles.desktopCategoryPill}>NETWORKING &amp; SYSTEM</span>

              <div className={styles.horizontalBottom}>
                <div className={styles.horizontalInfo}>
                  <h3 className={styles.horizontalTitle}>Network Monitoring</h3>
                  <p className={styles.horizontalSub}>Eksplorasi jaringan &amp; sistem</p>
                </div>

                <span className={styles.grayChevron} aria-hidden="true">
                  <ChevronRight size={15} strokeWidth={2.3} />
                </span>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
}
