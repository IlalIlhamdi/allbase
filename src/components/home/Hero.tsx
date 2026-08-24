import Link from "next/link";
import {
  Grid,
  Wrench,
  Activity,
  Radio,
  Server,
  Zap,
} from "lucide-react";
import styles from "./Hero.module.css";

export default function Hero() {
  return (
    <section id="hero" className={styles.heroSection}>
      <div className="container">
        <div className={styles.heroGrid}>
          {/* Left Column: Hero Content & CTAs */}
          <div className={styles.heroContent}>
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

            {/* Hero CTAs */}
            <div className={styles.heroActions}>
              <Link href="/#projects" className={styles.btnPrimary}>
                <Grid size={18} /> Lihat Proyek
              </Link>

              <Link href="/#tools" className={styles.btnSecondary}>
                <Wrench size={18} /> Buka Tools
              </Link>
            </div>

            {/* Quick Tech Highlights */}
            <div className={styles.heroHighlights}>
              <div className={styles.highlightItem}>
                <Radio size={15} className={styles.highlightIcon} />
                <span>MikroTik &amp; Cisco Networking</span>
              </div>
              <div className={styles.highlightItem}>
                <Activity size={15} className={styles.highlightIcon} />
                <span>IPv4 Subnetting &amp; Speed Test</span>
              </div>
            </div>
          </div>

          {/* Right Column: Lightweight Abstract Tech Visual */}
          <div className={styles.techVisualContainer} aria-hidden="true">
            <div className={styles.techVisualCard}>
              {/* Abstract Topology Grid SVG */}
              <svg
                viewBox="0 0 400 360"
                className={styles.networkSvg}
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <defs>
                  <linearGradient id="lineGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#2F80ED" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#06B6D4" stopOpacity="0.3" />
                  </linearGradient>
                  <linearGradient id="lineGrad2" x1="100%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#0F3D91" stopOpacity="0.6" />
                    <stop offset="100%" stopColor="#2F80ED" stopOpacity="0.8" />
                  </linearGradient>
                  <filter id="nodeGlow" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="4" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                  </filter>
                </defs>

                {/* Grid Connection Lines */}
                <path d="M60 70 L200 40 L340 90 L300 240 L200 310 L80 270 Z" stroke="var(--color-border)" strokeWidth="1.5" strokeDasharray="4 4" opacity="0.6" />
                <path d="M200 40 L200 180 L80 270" stroke="url(#lineGrad1)" strokeWidth="2" />
                <path d="M340 90 L200 180 L300 240" stroke="url(#lineGrad2)" strokeWidth="2" />
                <path d="M60 70 L200 180 L200 310" stroke="url(#lineGrad1)" strokeWidth="2" />

                {/* Animated Data Packets */}
                <circle cx="200" cy="180" r="42" fill="var(--color-primary-50)" opacity="0.5" />
                <circle cx="200" cy="180" r="30" fill="var(--color-primary-100)" opacity="0.8" />
                <circle cx="200" cy="180" r="18" fill="var(--color-primary-blue)" filter="url(#nodeGlow)" />

                {/* Satellite Nodes */}
                <g className={styles.nodeItem}>
                  <circle cx="60" cy="70" r="12" fill="var(--color-surface)" stroke="var(--color-primary-blue)" strokeWidth="2.5" />
                  <circle cx="60" cy="70" r="5" fill="var(--color-primary-blue)" />
                </g>

                <g className={styles.nodeItem}>
                  <circle cx="200" cy="40" r="14" fill="var(--color-surface)" stroke="#06B6D4" strokeWidth="2.5" />
                  <circle cx="200" cy="40" r="6" fill="#06B6D4" />
                </g>

                <g className={styles.nodeItem}>
                  <circle cx="340" cy="90" r="13" fill="var(--color-surface)" stroke="var(--color-primary-blue)" strokeWidth="2.5" />
                  <circle cx="340" cy="90" r="5" fill="var(--color-primary-blue)" />
                </g>

                <g className={styles.nodeItem}>
                  <circle cx="300" cy="240" r="14" fill="var(--color-surface)" stroke="#10B981" strokeWidth="2.5" />
                  <circle cx="300" cy="240" r="6" fill="#10B981" />
                </g>

                <g className={styles.nodeItem}>
                  <circle cx="80" cy="270" r="12" fill="var(--color-surface)" stroke="#8B5CF6" strokeWidth="2.5" />
                  <circle cx="80" cy="270" r="5" fill="#8B5CF6" />
                </g>

                <g className={styles.nodeItem}>
                  <circle cx="200" cy="310" r="13" fill="var(--color-surface)" stroke="var(--color-primary-blue)" strokeWidth="2.5" />
                  <circle cx="200" cy="310" r="5" fill="var(--color-primary-blue)" />
                </g>
              </svg>

              {/* Floating Metric Badges */}
              <div className={`${styles.floatingBadge} ${styles.badgeTop}`}>
                <Zap size={14} className={styles.badgeIconBlue} />
                <div>
                  <span className={styles.badgeLabel}>Core Base</span>
                  <span className={styles.badgeValue}>Online &amp; Active</span>
                </div>
              </div>

              <div className={`${styles.floatingBadge} ${styles.badgeBottom}`}>
                <Server size={14} className={styles.badgeIconGreen} />
                <div>
                  <span className={styles.badgeLabel}>Network Stack</span>
                  <span className={styles.badgeValue}>IPv4 · CIDR · NDT7</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
