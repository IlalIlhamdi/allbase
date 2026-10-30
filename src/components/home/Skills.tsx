"use client";

import { useState } from "react";
import {
  Briefcase,
  Globe,
  Share2,
  Code2,
  Database,
  Activity,
  ShieldAlert,
  ArrowRight,
  Award,
} from "lucide-react";
import styles from "./Skills.module.css";

interface CertItem {
  id: string;
  desktopTitle: string;
  desktopSub: string;
  mobileTitle: string;
  mobileSub: string;
  issuer: string;
  year: string;
  badgeType: "mikrotik" | "cisco" | "dts";
  href?: string;
}

const certsList: CertItem[] = [
  {
    id: "mtcna",
    desktopTitle: "MikroTik Certified Network Associate",
    desktopSub: "MTCNA",
    mobileTitle: "MTCNA",
    mobileSub: "MikroTik Certified Network Associate",
    issuer: "MikroTik",
    year: "2024",
    badgeType: "mikrotik",
  },
  {
    id: "cybersecurity",
    desktopTitle: "Introduction to Cybersecurity",
    desktopSub: "Cisco Networking Academy",
    mobileTitle: "Introduction to Cybersecurity",
    mobileSub: "Cisco Networking Academy",
    issuer: "Cisco",
    year: "2023",
    badgeType: "cisco",
    href: "https://www.credly.com/badges/ddefb255-6d2c-488f-a53e-c4ad6f84c327/public_url",
  },
  {
    id: "dts-network",
    desktopTitle: "Associate Network Administrator",
    desktopSub: "Digital Talent Scholarship",
    mobileTitle: "Associate Network Admin",
    mobileSub: "Digital Talent Scholarship",
    issuer: "Kominfo DTS",
    year: "2026",
    badgeType: "dts",
    href: "https://mapi.sdmdigital.id/get-file?path=output_signed/212-1322-12087/3568e731-34e6-4f2c-a0a2-4a3eae5bd068.pdf&disk=dts-storage-sertifikat",
  },
];

export default function Skills() {
  const [showAllCerts, setShowAllCerts] = useState(false);
  const visibleCerts = showAllCerts ? certsList : certsList.slice(0, 2);

  return (
    <section id="skills" className={styles.skillsSection} aria-labelledby="skills-title">
      <div className="container">
        <div id="certifications" className={styles.sectionCard}>
          {/* Header Row */}
          <div className={styles.headerRow}>
            <div className={styles.iconBadge} aria-hidden="true">
              <Briefcase size={20} />
            </div>
            <div>
              <h2 id="skills-title" className={styles.title}>
                Keahlian &amp; Sertifikasi
              </h2>
              <p className={styles.subtitle}>
                Beberapa keahlian utama dan sertifikasi yang telah saya miliki.
              </p>
            </div>
          </div>

          {/* 2-Column Content Grid */}
          <div className={styles.contentGrid}>
            {/* Left Column: Keahlian Utama */}
            <div className={styles.skillsCol}>
              <h3 className={styles.colHeading}>Keahlian Utama</h3>

              <div className={styles.skillsPillGrid}>
                {/* 1. Jaringan Komputer / Networking */}
                <div className={styles.skillPill}>
                  <Globe size={15} className={styles.blueIcon} />
                  <span className={styles.desktopLabel}>Jaringan Komputer</span>
                  <span className={styles.mobileLabel}>Networking</span>
                </div>

                {/* 2. MikroTik */}
                <div className={styles.skillPill}>
                  <Share2 size={15} className={styles.blueIcon} />
                  <span>MikroTik</span>
                </div>

                {/* 3. Linux */}
                <div className={styles.skillPill}>
                  <span className={styles.linuxBadge} aria-hidden="true">
                    🐧
                  </span>
                  <span>Linux</span>
                </div>

                {/* 4. Web Development */}
                <div className={styles.skillPill}>
                  <Globe size={15} className={styles.blueIcon} />
                  <span>Web Development</span>
                </div>

                {/* 5. HTML & CSS (Desktop) */}
                <div className={`${styles.skillPill} ${styles.desktopOnlyPill}`}>
                  <Code2 size={15} className={styles.blueIcon} />
                  <span>HTML &amp; CSS</span>
                </div>

                {/* 6. JavaScript */}
                <div className={styles.skillPill}>
                  <span className={styles.jsBadge} aria-hidden="true">
                    JS
                  </span>
                  <span>JavaScript</span>
                </div>

                {/* 7. PHP (Desktop) */}
                <div className={`${styles.skillPill} ${styles.desktopOnlyPill}`}>
                  <span className={styles.phpBadge} aria-hidden="true">
                    php
                  </span>
                  <span>PHP</span>
                </div>

                {/* 8. Database (Desktop) */}
                <div className={`${styles.skillPill} ${styles.desktopOnlyPill}`}>
                  <Database size={15} className={styles.blueIcon} />
                  <span>Database</span>
                </div>

                {/* 9. System Monitoring (Desktop) */}
                <div className={`${styles.skillPill} ${styles.desktopOnlyPill}`}>
                  <Activity size={15} className={styles.blueIcon} />
                  <span>System Monitoring</span>
                </div>
              </div>
            </div>

            {/* Right Column: Sertifikasi */}
            <div className={styles.certsCol}>
              <div className={styles.certsHeaderRow}>
                <h3 className={styles.colHeading}>Sertifikasi</h3>
                <button
                  type="button"
                  className={styles.viewAllBtn}
                  onClick={() => setShowAllCerts((prev) => !prev)}
                >
                  <span>{showAllCerts ? "Ringkas" : "Lihat Semua"}</span>
                  <ArrowRight size={14} />
                </button>
              </div>

              <div className={styles.certsGrid}>
                {visibleCerts.map((cert) => {
                  const CardTag = cert.href ? "a" : "div";
                  const linkProps = cert.href
                    ? { href: cert.href, target: "_blank", rel: "noopener noreferrer" }
                    : {};

                  return (
                    <CardTag key={cert.id} className={styles.certCard} {...linkProps}>
                      <div className={styles.certTop}>
                        {cert.badgeType === "mikrotik" && (
                          <div className={styles.mikrotikCircle} aria-hidden="true">
                            <span>MikroTik</span>
                          </div>
                        )}
                        {cert.badgeType === "cisco" && (
                          <div className={styles.ciscoHex} aria-hidden="true">
                            <ShieldAlert size={22} />
                          </div>
                        )}
                        {cert.badgeType === "dts" && (
                          <div className={styles.dtsCircle} aria-hidden="true">
                            <Award size={22} />
                          </div>
                        )}

                        <div className={styles.certInfo}>
                          <h4 className={styles.certTitleDesktop}>{cert.desktopTitle}</h4>
                          <p className={styles.certSubDesktop}>{cert.desktopSub}</p>

                          <h4 className={styles.certTitleMobile}>{cert.mobileTitle}</h4>
                          <p className={styles.certSubMobile}>{cert.mobileSub}</p>
                        </div>
                      </div>

                      <div className={styles.certFooter}>
                        <span className={styles.certIssuer}>
                          {cert.badgeType === "cisco" && (
                            <Share2 size={12} className={styles.issuerIcon} />
                          )}
                          {cert.issuer}
                        </span>
                        <span className={styles.certYear}>{cert.year}</span>
                      </div>
                    </CardTag>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
