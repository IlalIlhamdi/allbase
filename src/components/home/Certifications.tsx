import Link from "next/link";
import { Calendar, Image as ImageIcon, ChevronRight } from "lucide-react";
import styles from "./Certifications.module.css";

export default function Certifications() {
  return (
    <section className={styles.quickLinksSection} aria-labelledby="ruang-lainnya-title">
      <div className={styles.ruangContainer}>
        <h2 id="ruang-lainnya-title" className={styles.ruangTitle}>
          Ruang lainnya
        </h2>

        <div className={styles.ruangList}>
          <Link href="/class-schedule" className={styles.ruangRow}>
            <div className={`${styles.squircle} ${styles.squircleBlue}`} aria-hidden="true">
              <Calendar size={21} strokeWidth={2.1} />
            </div>

            <div className={styles.rowBody}>
              <div className={styles.rowText}>
                <h3 className={styles.rowHeading}>Jadwal Kuliah</h3>
                <p className={styles.rowSub}>
                  Lihat jadwal dan aktivitas perkuliahan saya
                </p>
              </div>
              <ChevronRight size={17} strokeWidth={2.2} className={styles.rowArrow} />
            </div>
          </Link>

          <Link href="/friendship-page" className={styles.ruangRow}>
            <div className={`${styles.squircle} ${styles.squirclePurple}`} aria-hidden="true">
              <ImageIcon size={21} strokeWidth={2.1} />
            </div>

            <div className={styles.rowBody}>
              <div className={styles.rowText}>
                <h3 className={styles.rowHeading}>Galeri Persahabatan</h3>
                <p className={styles.rowSub}>
                  Kumpulan momen bersama teman-teman
                </p>
              </div>
              <ChevronRight size={17} strokeWidth={2.2} className={styles.rowArrow} />
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
}
