"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Folder,
  Search,
  Zap,
  Smartphone,
  Gift,
  UserCheck,
  Boxes,
  Network,
  Briefcase,
} from "lucide-react";
import styles from "./Hero.module.css";

export default function Hero() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"semua" | "jaringan" | "produktivitas">("semua");
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = searchQuery.trim().toLowerCase();
    if (q.includes("subnet")) {
      router.push("/tools/subnet-calculator");
      return;
    }
    if (q.includes("ip")) {
      router.push("/tools/ip-calculator");
      return;
    }
    if (q.includes("convert") || q.includes("konversi")) {
      router.push("/tools/network-converter");
      return;
    }
    if (q.includes("speed") || q.includes("kecepatan")) {
      router.push("/tools/internet-speed-test");
      return;
    }
    if (q.includes("jadwal") || q.includes("schedule")) {
      router.push("/class-schedule");
      return;
    }
    if (q.includes("tugas") || q.includes("task")) {
      router.push("/college-tasks");
      return;
    }

    const targetId = activeTab === "produktivitas" ? "projects" : "tools";
    const el = document.getElementById(targetId);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleTabClick = (tab: "semua" | "jaringan" | "produktivitas") => {
    setActiveTab(tab);
    window.dispatchEvent(new CustomEvent("allbase-filter-change", { detail: { category: tab } }));
  };

  return (
    <section id="hero" className={styles.heroSection}>
      {/* ====================================================================
          DESKTOP HERO (>= 768px)
          ==================================================================== */}
      <div className={styles.desktopHero}>
        {/* Sky-Blue Geometric Low-Poly & Paper Airplane Background Artwork */}
        <div className={styles.heroBackdrop} aria-hidden="true">
          <svg
            className={styles.backdropSvg}
            viewBox="0 0 1440 620"
            fill="none"
            preserveAspectRatio="xMidYMax slice"
          >
            <defs>
              <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#d9ecff" />
                <stop offset="55%" stopColor="#eaf4ff" />
                <stop offset="100%" stopColor="#eaf3fc" />
              </linearGradient>
              <linearGradient id="polyBlue1" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#6eb0ff" />
                <stop offset="100%" stopColor="#2b7de9" />
              </linearGradient>
              <linearGradient id="polyBlue2" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#a9d2ff" />
                <stop offset="100%" stopColor="#589ff5" />
              </linearGradient>
              <linearGradient id="polyIce1" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="100%" stopColor="#d7ebff" />
              </linearGradient>
              <linearGradient id="polyIce2" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#e8f3ff" />
                <stop offset="100%" stopColor="#badbff" />
              </linearGradient>
            </defs>

            <rect width="1440" height="620" fill="url(#skyGrad)" />
            <circle cx="250" cy="140" r="220" fill="#ffffff" fillOpacity="0.55" />
            <circle cx="720" cy="110" r="180" fill="#ffffff" fillOpacity="0.45" />
            <circle cx="1150" cy="180" r="260" fill="#bde0ff" fillOpacity="0.4" />

            <g stroke="#8fc2ff" strokeWidth="1.2" strokeOpacity="0.55">
              <line x1="610" y1="70" x2="690" y2="40" />
              <line x1="690" y1="40" x2="760" y2="85" />
              <line x1="760" y1="85" x2="680" y2="130" />
              <line x1="610" y1="70" x2="680" y2="130" />
              <line x1="540" y1="150" x2="610" y2="70" />
              <line x1="1260" y1="80" x2="1340" y2="130" />
              <line x1="1340" y1="130" x2="1290" y2="210" />
            </g>
            <g fill="#5ca4ff" fillOpacity="0.65">
              <circle cx="610" cy="70" r="3.5" />
              <circle cx="690" cy="40" r="3" />
              <circle cx="760" cy="85" r="4" />
              <circle cx="680" cy="130" r="3" />
              <circle cx="540" cy="150" r="3.5" />
              <circle cx="1260" cy="80" r="4" />
              <circle cx="1340" cy="130" r="3" />
            </g>

            <polygon points="-20,560 95,430 165,560" fill="url(#polyIce1)" opacity="0.75" />
            <polygon points="95,430 165,560 220,490" fill="url(#polyIce2)" opacity="0.75" />
            <polygon points="30,560 110,485 185,560" fill="#ffffff" opacity="0.85" />

            <polygon points="620,480 830,130 960,480" fill="url(#polyBlue2)" opacity="0.55" />
            <polygon points="830,130 960,480 1090,340" fill="url(#polyBlue1)" opacity="0.65" />
            <polygon points="980,460 1220,110 1390,460" fill="url(#polyBlue2)" opacity="0.5" />
            <polygon points="1220,110 1390,460 1480,290" fill="url(#polyBlue1)" opacity="0.6" />

            <polygon points="560,520 675,365 755,520" fill="url(#polyIce1)" />
            <polygon points="675,365 755,520 815,435" fill="url(#polyIce2)" />
            <polygon points="710,535 805,405 895,535" fill="#ffffff" opacity="0.92" />
            <polygon points="805,405 895,535 945,455" fill="#cbe4ff" opacity="0.9" />
            <polygon points="1120,530 1245,355 1345,530" fill="url(#polyIce1)" />
            <polygon points="1245,355 1345,530 1420,430" fill="url(#polyIce2)" />

            <polygon points="715,185 748,145 772,192" fill="#ffffff" opacity="0.9" />
            <polygon points="748,145 772,192 790,165" fill="#b5d8ff" opacity="0.9" />
            <polygon points="670,290 725,245 745,310" fill="url(#polyIce1)" opacity="0.95" />
            <polygon points="725,245 745,310 780,275" fill="#9bc8ff" opacity="0.9" />

            <g transform="translate(650, 72) rotate(-12)">
              <polygon points="0,38 92,0 44,52" fill="#ffffff" />
              <polygon points="44,52 92,0 56,68" fill="#bddbff" />
              <polygon points="44,52 56,68 36,60" fill="#8abaf7" />
            </g>

            <g transform="translate(465, 375) rotate(-18) scale(0.85)">
              <polygon points="0,38 92,0 44,52" fill="#ffffff" />
              <polygon points="44,52 92,0 56,68" fill="#c5e0ff" />
              <polygon points="44,52 56,68 36,60" fill="#90bef8" />
            </g>
          </svg>
        </div>

        <div className="container">
          <div className={styles.heroGrid}>
            <div className={styles.heroContent}>
              <h1 className={styles.title}>
                Semua Proyek dan Tool,
                <br />
                Dalam <span className={styles.titleHighlight}>Satu Base.</span>
              </h1>

              <p className={styles.description}>
                Portofolio, proyek, dan tools jaringan
                <br /> oleh <strong>Ilal Ilhamdi.</strong>
              </p>

              <div className={styles.ctaGroup}>
                <Link href="#tools" className={styles.primaryBtn}>
                  <Network size={17} />
                  <span>Jelajahi Tools</span>
                  <ArrowRight size={16} />
                </Link>

                <Link href="#projects" className={styles.secondaryBtn}>
                  <Folder size={17} className={styles.folderIcon} />
                  <span>Lihat Proyek</span>
                </Link>
              </div>
            </div>

            <div className={styles.profileVisual}>
              <div className={styles.profileFrame}>
                <div className={styles.profileImageWrapper}>
                  <Image
                    src="/profile.jpg"
                    alt="Ilal Ilhamdi"
                    fill
                    priority
                    sizes="380px"
                    className={styles.desktopProfilePhoto}
                  />
                  <div className={styles.profileOverlay}>
                    <h2 className={styles.profileName}>Ilal Ilhamdi</h2>
                    <p className={styles.profileRole}>Network &amp; Technology Enthusiast</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Filter & Search Bar Card */}
          <div className={styles.searchFilterCard}>
            <div className={styles.categoryTabs} role="tablist" aria-label="Kategori Filter">
              <button
                type="button"
                role="tab"
                aria-selected={activeTab === "semua"}
                className={`${styles.categoryTab} ${activeTab === "semua" ? styles.categoryTabActive : ""}`}
                onClick={() => handleTabClick("semua")}
              >
                <Boxes size={16} className={styles.tabIcon} />
                <span>Semua</span>
              </button>

              <button
                type="button"
                role="tab"
                aria-selected={activeTab === "jaringan"}
                className={`${styles.categoryTab} ${activeTab === "jaringan" ? styles.categoryTabActive : ""}`}
                onClick={() => handleTabClick("jaringan")}
              >
                <Network size={16} className={styles.tabIcon} />
                <span>Jaringan</span>
              </button>

              <button
                type="button"
                role="tab"
                aria-selected={activeTab === "produktivitas"}
                className={`${styles.categoryTab} ${activeTab === "produktivitas" ? styles.categoryTabActive : ""}`}
                onClick={() => handleTabClick("produktivitas")}
              >
                <Briefcase size={16} className={styles.tabIcon} />
                <span>Produktivitas</span>
              </button>
            </div>

            <form className={styles.searchForm} onSubmit={handleSearchSubmit}>
              <div className={styles.searchInputWrap}>
                <Search size={17} className={styles.searchIcon} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    window.dispatchEvent(
                      new CustomEvent("allbase-search-change", { detail: { query: e.target.value } })
                    );
                  }}
                  placeholder="Cari tools, misalnya IP Calculator..."
                  className={styles.searchInput}
                  aria-label="Cari tools"
                />
              </div>

              <button type="submit" className={styles.searchSubmitBtn}>
                <span>Jelajahi</span>
                <ArrowRight size={15} />
              </button>
            </form>
          </div>

          {/* 4 Value Proposition Feature Cards */}
          <div className={styles.featuresGrid}>
            <div className={styles.featureCard}>
              <div className={styles.featureIconBox}>
                <Zap size={20} />
              </div>
              <div className={styles.featureText}>
                <h3 className={styles.featureTitle}>Praktis</h3>
                <p className={styles.featureDesc}>Semua kebutuhan dalam satu platform.</p>
              </div>
            </div>

            <div className={styles.featureCard}>
              <div className={styles.featureIconBox}>
                <Smartphone size={20} />
              </div>
              <div className={styles.featureText}>
                <h3 className={styles.featureTitle}>Responsif</h3>
                <p className={styles.featureDesc}>Nyaman di semua perangkat.</p>
              </div>
            </div>

            <div className={styles.featureCard}>
              <div className={styles.featureIconBox}>
                <Gift size={20} />
              </div>
              <div className={styles.featureText}>
                <h3 className={styles.featureTitle}>Gratis</h3>
                <p className={styles.featureDesc}>Banyak tools gratis yang bisa digunakan.</p>
              </div>
            </div>

            <div className={styles.featureCard}>
              <div className={styles.featureIconBox}>
                <UserCheck size={20} />
              </div>
              <div className={styles.featureText}>
                <h3 className={styles.featureTitle}>Mudah Digunakan</h3>
                <p className={styles.featureDesc}>Antarmuka sederhana dan ramah pengguna.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ====================================================================
          MOBILE & iOS HERO (<= 767px)
          ==================================================================== */}
      <div className={styles.mobileHero}>
        {/* 3D Faceted Ice-Blue Prism Triangle on Top-Right */}
        <svg
          className={styles.mobilePrismSvg}
          viewBox="0 0 220 230"
          fill="none"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="prismTop" x1="0" y1="1" x2="1" y2="0">
              <stop offset="0%" stopColor="#e6f2ff" />
              <stop offset="100%" stopColor="#cce4ff" />
            </linearGradient>
            <linearGradient id="prismRight" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#a7cefc" />
              <stop offset="100%" stopColor="#eaf4ff" stopOpacity="0.35" />
            </linearGradient>
            <linearGradient id="prismBottom" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#cfe5ff" />
              <stop offset="100%" stopColor="#f5f9fe" stopOpacity="0.2" />
            </linearGradient>
          </defs>
          {/* Left-pointing top facet */}
          <polygon points="14,118 205,12 138,118" fill="url(#prismTop)" />
          {/* Right-tilted facet */}
          <polygon points="205,12 216,212 138,118" fill="url(#prismRight)" />
          {/* Bottom facet */}
          <polygon points="14,118 138,118 216,212" fill="url(#prismBottom)" />
          {/* Crisp highlight crease lines */}
          <line x1="14" y1="118" x2="138" y2="118" stroke="#b6d6fc" strokeWidth="1.2" />
          <line x1="205" y1="12" x2="138" y2="118" stroke="#96c2fa" strokeWidth="1.2" />
          <line x1="138" y1="118" x2="216" y2="212" stroke="#b6d6fc" strokeWidth="1.2" />
        </svg>

        <div className={styles.mobileContainer}>
          {/* Top Pill Badge */}
          <span className={styles.mobileBadge}>PORTOFOLIO &amp; NETWORK TOOLS</span>

          {/* Bold iOS Headline */}
          <h2 className={styles.mobileTitle}>
            Ide, karya,
            <br />
            dan <span>koneksi.</span>
          </h2>

          {/* Subtitle */}
          <p className={styles.mobileSubtitle}>
            Saya Ilal Ilhamdi. Membangun web
            <br />
            dan menjelajahi dunia jaringan.
          </p>

          {/* CTA Pill + Text Link */}
          <div className={styles.mobileCtaRow}>
            <Link href="#tools" className={styles.mobilePrimaryPill}>
              <span>Jelajahi Tools</span>
              <ArrowRight size={16} strokeWidth={2.3} />
            </Link>

            <Link href="#about" className={styles.mobileSecondaryLink}>
              <span>Tentang Saya</span>
              <ArrowRight size={15} strokeWidth={2.3} />
            </Link>
          </div>

          {/* Profile Card with White Caption Bar & Verified Checkmark */}
          <div className={styles.mobileProfileCard}>
            <div className={styles.mobilePhotoWrap}>
              <Image
                src="/profile.jpg"
                alt="Ilal Ilhamdi"
                fill
                priority
                sizes="(max-width: 767px) 92vw, 360px"
                className={styles.mobileProfilePhoto}
              />
            </div>

            <div className={styles.mobileProfileCaption}>
              <div className={styles.mobileNameRow}>
                <span className={styles.mobileProfileName}>Ilal Ilhamdi</span>
                {/* Blue Verified Checkmark Badge */}
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  className={styles.verifiedBadge}
                  aria-label="Verified"
                >
                  <circle cx="12" cy="12" r="10" fill="#1882f8" />
                  <path
                    d="M8.2 12.3L10.7 14.8L16 9.5"
                    stroke="#ffffff"
                    strokeWidth="2.3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <p className={styles.mobileProfileRole}>Network &amp; Technology Enthusiast</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
