import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import styles from "./Hero.module.css";

export default function Hero() {
  return (
    <section id="hero" className={styles.heroSection}>
      {/* Subtle 3D Faceted Ice-Blue Prism Triangle on Top-Right */}
      <svg
        className={styles.prismSvg}
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

      <div className={styles.heroContainer}>
        {/* Left / Top Column: Badge, Headline, Subtitle, CTAs */}
        <div className={styles.heroTextCol}>
          <span className={styles.heroBadge}>PORTOFOLIO &amp; NETWORK TOOLS</span>

          <h1 className={styles.heroTitle}>
            Ide, karya,{" "}
            <br />
            dan <span>koneksi.</span>
          </h1>

          <p className={styles.heroSubtitle}>
            Saya Ilal Ilhamdi. Membangun web
            <br className={styles.mobileLineBreak} /> dan menjelajahi dunia jaringan.
          </p>

          <div className={styles.ctaRow}>
            <Link href="#tools" className={styles.primaryPill}>
              <span>Jelajahi Tools</span>
              <ArrowRight size={16} strokeWidth={2.3} />
            </Link>

            <Link href="#about" className={styles.secondaryLink}>
              <span>Tentang Saya</span>
              <ArrowRight size={15} strokeWidth={2.3} />
            </Link>
          </div>
        </div>

        {/* Right / Bottom Column: Profile Card with White Caption Bar & Verified Checkmark */}
        <div className={styles.heroProfileCol}>
          <div className={styles.profileCard}>
            <div className={styles.photoWrap}>
              <Image
                src="/profile.jpg"
                alt="Ilal Ilhamdi"
                fill
                priority
                sizes="(max-width: 767px) 92vw, (max-width: 1023px) 480px, 420px"
                className={styles.profilePhoto}
              />
            </div>

            <div className={styles.profileCaption}>
              <div className={styles.nameRow}>
                <span className={styles.profileName}>Ilal Ilhamdi</span>
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
              <p className={styles.profileRole}>Network &amp; Technology Enthusiast</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
