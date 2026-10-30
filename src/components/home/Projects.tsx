"use client";

import { useState } from "react";
import Link from "next/link";
import { Folder, ArrowRight, ExternalLink, ChevronRight } from "lucide-react";
import styles from "./Projects.module.css";

interface FeaturedProjectItem {
  id: string;
  title: string;
  description: string;
  tags: string[];
  href: string;
  hasExternalIcon?: boolean;
  previewType: "allbase" | "monitoring" | "tasks" | "schedule" | "friendship";
}

const featuredProjects: FeaturedProjectItem[] = [
  {
    id: "allbase-hub",
    title: "ALLBASE Personal Hub",
    description: "Website portofolio dan pusat tools pribadi ini.",
    tags: ["Next.js", "Tailwind CSS", "Vercel"],
    href: "/",
    hasExternalIcon: true,
    previewType: "allbase",
  },
  {
    id: "network-monitoring",
    title: "Network Monitoring",
    description: "Sistem monitoring jaringan dengan tampilan real-time.",
    tags: ["MikroTik API", "Chart.js", "PHP"],
    href: "#contact",
    hasExternalIcon: false,
    previewType: "monitoring",
  },
  {
    id: "manajemen-tugas",
    title: "Manajemen Tugas",
    description: "Aplikasi manajemen tugas untuk produktivitas sehari-hari.",
    tags: ["Next.js", "PostgreSQL", "Tailwind CSS"],
    href: "/college-tasks",
    hasExternalIcon: true,
    previewType: "tasks",
  },
  {
    id: "jadwal-kuliah",
    title: "Jadwal Perkuliahan Interaktif",
    description: "Informasi jadwal perkuliahan mingguan, mata kuliah, dan ruang kelas.",
    tags: ["Next.js", "Schedule", "Responsive"],
    href: "/class-schedule",
    hasExternalIcon: true,
    previewType: "schedule",
  },
  {
    id: "galeri-persahabatan",
    title: "Galeri Persahabatan",
    description: "Dokumentasi momen kebersamaan sahabat dan kolaborasi tim.",
    tags: ["Gallery", "Personal", "Lightbox"],
    href: "/friendship-page",
    hasExternalIcon: true,
    previewType: "friendship",
  },
];

function ProjectPreviewArtwork({ type }: { type: FeaturedProjectItem["previewType"] }) {
  if (type === "allbase") {
    return (
      <svg viewBox="0 0 320 175" className={styles.previewSvg} aria-hidden="true">
        <rect width="320" height="175" rx="8" fill="#e6f2ff" />
        <rect width="320" height="20" fill="#1860c2" />
        <circle cx="12" cy="10" r="3" fill="#ff5f56" />
        <circle cx="22" cy="10" r="3" fill="#ffbd2e" />
        <circle cx="32" cy="10" r="3" fill="#27c93f" />
        <rect x="48" y="5" width="140" height="10" rx="5" fill="#104999" />
        <polygon points="0,175 65,115 120,175" fill="#ffffff" opacity="0.85" />
        <polygon points="180,175 250,75 320,175" fill="#89bfff" opacity="0.6" />
        <polygon points="220,175 275,105 320,175" fill="#ffffff" opacity="0.9" />
        <image href="/logo.png" x="21" y="31" width="14" height="14" />
        <rect x="38" y="35" width="52" height="6" rx="3" fill="#0d264c" />
        <rect x="22" y="56" width="128" height="9" rx="3" fill="#0d264c" />
        <rect x="22" y="70" width="96" height="9" rx="3" fill="#1d6fd8" />
        <rect x="22" y="86" width="110" height="5" rx="2.5" fill="#5b708b" />
        <rect x="22" y="96" width="80" height="5" rx="2.5" fill="#5b708b" />
        <rect x="22" y="112" width="52" height="16" rx="4" fill="#1d6fd8" />
        <rect x="80" y="112" width="46" height="16" rx="4" fill="#ffffff" stroke="#bdd8f7" />
        <rect x="206" y="34" width="86" height="98" rx="8" fill="#1b314e" stroke="#ffffff" strokeWidth="3" />
        <circle cx="249" cy="68" r="16" fill="#eab68c" />
        <path d="M225 118 C225 96 273 96 273 118 Z" fill="#1e293b" />
        <rect x="22" y="140" width="276" height="24" rx="5" fill="#ffffff" opacity="0.95" />
      </svg>
    );
  }

  if (type === "monitoring") {
    return (
      <svg viewBox="0 0 320 175" className={styles.previewSvg} aria-hidden="true">
        <rect width="320" height="175" rx="8" fill="#0c1626" />
        <rect width="320" height="20" fill="#132238" />
        <circle cx="12" cy="10" r="3" fill="#ff5f56" />
        <circle cx="22" cy="10" r="3" fill="#ffbd2e" />
        <circle cx="32" cy="10" r="3" fill="#27c93f" />
        <rect x="50" y="6" width="85" height="8" rx="4" fill="#1e3454" />
        <rect x="14" y="28" width="68" height="28" rx="4" fill="#15263f" />
        <rect x="20" y="34" width="32" height="5" rx="2" fill="#38bdf8" />
        <rect x="20" y="43" width="46" height="7" rx="2" fill="#e2e8f0" />
        <rect x="88" y="28" width="68" height="28" rx="4" fill="#15263f" />
        <rect x="94" y="34" width="32" height="5" rx="2" fill="#22c55e" />
        <rect x="94" y="43" width="46" height="7" rx="2" fill="#e2e8f0" />
        <rect x="162" y="28" width="68" height="28" rx="4" fill="#15263f" />
        <rect x="168" y="34" width="32" height="5" rx="2" fill="#f59e0b" />
        <rect x="168" y="43" width="46" height="7" rx="2" fill="#e2e8f0" />
        <rect x="236" y="28" width="70" height="28" rx="4" fill="#15263f" />
        <rect x="242" y="34" width="32" height="5" rx="2" fill="#a855f7" />
        <rect x="242" y="43" width="46" height="7" rx="2" fill="#e2e8f0" />
        <rect x="14" y="62" width="185" height="64" rx="5" fill="#132238" />
        <path
          d="M22 116 L22 95 L36 88 L50 98 L64 78 L78 85 L92 72 L106 89 L120 75 L134 82 L148 69 L162 84 L176 74 L190 80 L190 116 Z"
          fill="#10b981"
          fillOpacity="0.28"
        />
        <polyline
          points="22,95 36,88 50,98 64,78 78,85 92,72 106,89 120,75 134,82 148,69 162,84 176,74 190,80"
          fill="none"
          stroke="#10b981"
          strokeWidth="2"
        />
        <polyline
          points="22,106 36,102 50,108 64,96 78,100 92,92 106,101 120,94 134,99 148,90 162,97 176,92 190,95"
          fill="none"
          stroke="#38bdf8"
          strokeWidth="1.6"
        />
        <rect x="205" y="62" width="101" height="64" rx="5" fill="#132238" />
        <circle cx="235" cy="94" r="18" stroke="#1e3a5f" strokeWidth="5" fill="none" />
        <path d="M235 76 A18 18 0 1 1 219 102" stroke="#38bdf8" strokeWidth="5" fill="none" strokeLinecap="round" />
        <rect x="262" y="78" width="34" height="5" rx="2" fill="#94a3b8" />
        <rect x="262" y="88" width="26" height="5" rx="2" fill="#22c55e" />
        <rect x="262" y="98" width="30" height="5" rx="2" fill="#38bdf8" />
        <rect x="14" y="132" width="292" height="32" rx="5" fill="#132238" />
        <rect x="24" y="141" width="90" height="5" rx="2" fill="#475569" />
        <rect x="24" y="151" width="140" height="5" rx="2" fill="#334155" />
        <circle cx="282" cy="148" r="8" stroke="#22c55e" strokeWidth="3" fill="none" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 320 175" className={styles.previewSvg} aria-hidden="true">
      <rect width="320" height="175" rx="8" fill="#f1f7fe" />
      <rect width="320" height="20" fill="#1d6fd8" />
      <circle cx="12" cy="10" r="3" fill="#ff5f56" />
      <circle cx="22" cy="10" r="3" fill="#ffbd2e" />
      <circle cx="32" cy="10" r="3" fill="#27c93f" />
      <rect x="48" y="6" width="110" height="8" rx="4" fill="#1452a6" />
      <rect x="10" y="28" width="58" height="137" rx="5" fill="#ffffff" stroke="#d8e7f8" />
      <rect x="18" y="38" width="36" height="6" rx="3" fill="#1d6fd8" />
      <rect x="18" y="52" width="42" height="5" rx="2.5" fill="#cbd5e1" />
      <rect x="18" y="63" width="38" height="5" rx="2.5" fill="#cbd5e1" />
      <rect x="18" y="74" width="40" height="5" rx="2.5" fill="#cbd5e1" />
      <rect x="18" y="85" width="32" height="5" rx="2.5" fill="#cbd5e1" />
      <rect x="76" y="28" width="154" height="72" rx="5" fill="#ffffff" stroke="#d8e7f8" />
      <rect x="86" y="37" width="75" height="7" rx="3" fill="#0d264c" />
      <rect x="86" y="50" width="130" height="10" rx="3" fill="#eff6ff" />
      <rect x="86" y="64" width="130" height="10" rx="3" fill="#eff6ff" />
      <rect x="86" y="78" width="95" height="10" rx="3" fill="#eff6ff" />
      <rect x="238" y="28" width="72" height="72" rx="5" fill="#ffffff" stroke="#d8e7f8" />
      <circle cx="274" cy="58" r="16" stroke="#e2e8f0" strokeWidth="5" fill="none" />
      <path d="M274 42 A16 16 0 1 1 259 64" stroke="#1d6fd8" strokeWidth="5" fill="none" strokeLinecap="round" />
      <rect x="252" y="82" width="44" height="6" rx="3" fill="#94a3b8" />
      <rect x="76" y="106" width="112" height="59" rx="5" fill="#ffffff" stroke="#d8e7f8" />
      <rect x="86" y="116" width="54" height="6" rx="3" fill="#1d6fd8" />
      <rect x="86" y="128" width="88" height="5" rx="2.5" fill="#94a3b8" />
      <rect x="86" y="138" width="70" height="5" rx="2.5" fill="#cbd5e1" />
      <rect x="196" y="106" width="114" height="59" rx="5" fill="#ffffff" stroke="#d8e7f8" />
      <polyline
        points="206,150 222,138 238,143 254,126 270,132 286,118 300,124"
        fill="none"
        stroke="#1d6fd8"
        strokeWidth="2.2"
      />
    </svg>
  );
}

export default function Projects() {
  const [showAll, setShowAll] = useState(false);
  const displayedProjects = showAll ? featuredProjects : featuredProjects.slice(0, 3);

  return (
    <section id="projects" className={styles.projectsSection} aria-labelledby="projects-title">
      {/* ====================================================================
          DESKTOP PROJECTS (>= 768px)
          ==================================================================== */}
      <div className={`container ${styles.desktopProjects}`}>
        <div className={styles.sectionCard}>
          <div className={styles.headerRow}>
            <div className={styles.headerLeft}>
              <div className={styles.iconBadge} aria-hidden="true">
                <Folder size={20} />
              </div>
              <div>
                <h2 id="projects-title" className={styles.title}>
                  Proyek Pilihan
                </h2>
                <p className={styles.subtitle}>
                  Beberapa proyek yang sedang saya kembangkan.
                </p>
              </div>
            </div>

            <button
              type="button"
              className={styles.viewAllBtn}
              onClick={() => setShowAll((prev) => !prev)}
            >
              <span>{showAll ? "Tampilkan Pilihan" : "Lihat Semua Proyek"}</span>
              <ArrowRight size={15} />
            </button>
          </div>

          <div className={styles.projectsGrid}>
            {displayedProjects.map((project) => (
              <Link
                key={project.id}
                href={project.href}
                className={styles.projectCard}
              >
                <div className={styles.thumbnailWrap}>
                  <ProjectPreviewArtwork type={project.previewType} />
                </div>

                <div className={styles.cardBody}>
                  <div className={styles.cardTitleRow}>
                    <h3 className={styles.cardTitle}>{project.title}</h3>
                    {project.hasExternalIcon && (
                      <ExternalLink size={14} className={styles.externalIcon} />
                    )}
                  </div>

                  <p className={styles.cardDesc}>{project.description}</p>

                  <div className={styles.tagsRow}>
                    {project.tags.map((tag) => (
                      <span key={tag} className={styles.tagPill}>
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* ====================================================================
          MOBILE & iOS "Karya pilihan" (<= 767px)
          ==================================================================== */}
      <div className={styles.mobileProjects}>
        <h2 className={styles.mobileSectionTitle}>Karya pilihan</h2>

        {/* Featured Card 1: ALLBASE Personal Hub Showcase */}
        <Link href="/" className={styles.mobileShowcaseCard}>
          <div className={styles.mobileShowcasePreview}>
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

          <div className={styles.mobileShowcaseBody}>
            <span className={styles.mobileCategoryPill}>WEB DEVELOPMENT</span>

            <div className={styles.mobileShowcaseBottom}>
              <div className={styles.mobileShowcaseText}>
                <h3 className={styles.mobileShowcaseTitle}>ALLBASE Personal Hub</h3>
                <p className={styles.mobileShowcaseDesc}>
                  Website portofolio dan kumpulan network tools pribadi.
                </p>
              </div>

              <span className={styles.mobileBlueCircleBtn} aria-hidden="true">
                <ArrowRight size={17} strokeWidth={2.4} />
              </span>
            </div>
          </div>
        </Link>

        {/* Featured Card 2: Network Monitoring Compact Horizontal Card */}
        <Link href="#contact" className={styles.mobileHorizontalCard}>
          <div className={styles.mobileDarkThumb}>
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

          <div className={styles.mobileHorizontalInfo}>
            <h3 className={styles.mobileHorizontalTitle}>Network Monitoring</h3>
            <p className={styles.mobileHorizontalSub}>Eksplorasi jaringan &amp; sistem</p>
          </div>

          <span className={styles.mobileGrayChevron} aria-hidden="true">
            <ChevronRight size={15} strokeWidth={2.3} />
          </span>
        </Link>
      </div>
    </section>
  );
}
