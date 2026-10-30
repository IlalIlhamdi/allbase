import Link from "next/link";
import { Calendar, Image as ImageIcon, ArrowRight, ChevronRight } from "lucide-react";
import styles from "./Certifications.module.css";

export default function Certifications() {
  return (
    <section className={styles.quickLinksSection} aria-label="Pintasan Cepat">
      {/* ====================================================================
          DESKTOP QUICK LINKS (>= 768px)
          ==================================================================== */}
      <div className={`container ${styles.desktopQuickLinks}`}>
        <div className={styles.quickLinksGrid}>
          <Link href="/class-schedule" className={styles.quickCard}>
            <div className={styles.cardLeft}>
              <div className={styles.iconBox} aria-hidden="true">
                <Calendar size={20} />
              </div>

              <div className={styles.textGroup}>
                <h3 className={styles.cardTitle}>Jadwal Kuliah</h3>
                <p className={styles.cardDesc}>Lihat jadwal, mata kuliah, dan tugas.</p>
                <span className={styles.actionPill}>
                  <span>Buka Jadwal</span>
                  <ArrowRight size={14} />
                </span>
              </div>
            </div>

            <svg
              className={styles.artworkWrap}
              viewBox="0 0 170 125"
              fill="none"
              aria-hidden="true"
            >
              <polygon points="10,125 55,68 95,125" fill="#e1effe" />
              <polygon points="55,68 95,125 125,88" fill="#c3dffc" />
              <polygon points="110,125 148,55 180,125" fill="#d9ebfe" />
              <g transform="translate(62, 18) rotate(-8)">
                <rect
                  x="0"
                  y="8"
                  width="82"
                  height="72"
                  rx="8"
                  fill="#ffffff"
                  stroke="#b7d5f7"
                  strokeWidth="2"
                />
                <path
                  d="M0 16 C0 11.5 3.5 8 8 8 H74 C78.5 8 82 11.5 82 16 V26 H0 V16 Z"
                  fill="#2577e3"
                />
                <rect x="14" y="2" width="5" height="11" rx="2.5" fill="#9bc5f9" />
                <rect x="29" y="2" width="5" height="11" rx="2.5" fill="#9bc5f9" />
                <rect x="48" y="2" width="5" height="11" rx="2.5" fill="#9bc5f9" />
                <rect x="63" y="2" width="5" height="11" rx="2.5" fill="#9bc5f9" />
                <rect x="10" y="34" width="12" height="9" rx="2" fill="#dcebff" />
                <rect x="26" y="34" width="12" height="9" rx="2" fill="#dcebff" />
                <rect x="42" y="34" width="12" height="9" rx="2" fill="#2577e3" />
                <rect x="58" y="34" width="12" height="9" rx="2" fill="#dcebff" />
                <rect x="10" y="47" width="12" height="9" rx="2" fill="#dcebff" />
                <rect x="26" y="47" width="12" height="9" rx="2" fill="#98c5fa" />
                <rect x="42" y="47" width="12" height="9" rx="2" fill="#dcebff" />
                <rect x="58" y="47" width="12" height="9" rx="2" fill="#dcebff" />
                <rect x="10" y="60" width="12" height="9" rx="2" fill="#dcebff" />
                <rect x="26" y="60" width="12" height="9" rx="2" fill="#dcebff" />
                <rect x="42" y="60" width="12" height="9" rx="2" fill="#98c5fa" />
                <rect x="58" y="60" width="12" height="9" rx="2" fill="#dcebff" />
              </g>
            </svg>
          </Link>

          <Link href="/friendship-page" className={styles.quickCard}>
            <div className={styles.cardLeft}>
              <div className={styles.iconBox} aria-hidden="true">
                <ImageIcon size={20} />
              </div>

              <div className={styles.textGroup}>
                <h3 className={styles.cardTitle}>Galeri Persahabatan</h3>
                <p className={styles.cardDesc}>
                  Dokumentasi momen bersama teman-teman.
                </p>
                <span className={styles.actionPill}>
                  <span>Buka Galeri</span>
                  <ArrowRight size={14} />
                </span>
              </div>
            </div>

            <svg
              className={styles.artworkWrap}
              viewBox="0 0 170 125"
              fill="none"
              aria-hidden="true"
            >
              <polygon points="8,125 52,72 92,125" fill="#e1effe" />
              <polygon points="52,72 92,125 122,90" fill="#c3dffc" />
              <polygon points="108,125 148,58 178,125" fill="#d9ebfe" />
              <g transform="translate(64, 16) rotate(6)">
                <rect
                  x="0"
                  y="0"
                  width="86"
                  height="68"
                  rx="7"
                  fill="#ffffff"
                  stroke="#bdd8f8"
                  strokeWidth="2.5"
                />
                <rect x="6" y="6" width="74" height="50" rx="4" fill="#80bfff" />
                <circle cx="62" cy="20" r="7" fill="#fef08a" />
                <polygon points="6,56 32,28 58,56" fill="#2d82f0" />
                <polygon points="36,56 58,34 80,56" fill="#1762c6" />
              </g>
            </svg>
          </Link>
        </div>
      </div>

      {/* ====================================================================
          MOBILE & iOS "Ruang lainnya" (<= 767px)
          ==================================================================== */}
      <div className={styles.mobileRuang}>
        <h2 className={styles.mobileRuangTitle}>Ruang lainnya</h2>

        <div className={styles.mobileRuangList}>
          <Link href="/class-schedule" className={styles.mobileRuangRow}>
            <div className={`${styles.mobileSquircle} ${styles.squircleBlue}`} aria-hidden="true">
              <Calendar size={21} strokeWidth={2.1} />
            </div>

            <div className={styles.mobileRowBody}>
              <div className={styles.mobileRowText}>
                <h3 className={styles.mobileRowHeading}>Jadwal Kuliah</h3>
                <p className={styles.mobileRowSub}>
                  Lihat jadwal dan aktivitas perkuliahan saya
                </p>
              </div>
              <ChevronRight size={17} strokeWidth={2.2} className={styles.mobileRowArrow} />
            </div>
          </Link>

          <Link href="/friendship-page" className={styles.mobileRuangRow}>
            <div className={`${styles.mobileSquircle} ${styles.squirclePurple}`} aria-hidden="true">
              <ImageIcon size={21} strokeWidth={2.1} />
            </div>

            <div className={styles.mobileRowBody}>
              <div className={styles.mobileRowText}>
                <h3 className={styles.mobileRowHeading}>Galeri Persahabatan</h3>
                <p className={styles.mobileRowSub}>
                  Kumpulan momen bersama teman-teman
                </p>
              </div>
              <ChevronRight size={17} strokeWidth={2.2} className={styles.mobileRowArrow} />
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
}
