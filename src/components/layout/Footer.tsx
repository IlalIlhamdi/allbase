import Image from "next/image";
import Link from "next/link";
import { mainNavItems } from "@/data/navigation";
import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        {/* Left (Desktop) / Top Centered (Mobile): Brand & Tagline */}
        <div className={styles.leftGroup}>
          <Link href="/" className={styles.brand}>
            <div className={styles.brandLogoWrap}>
              <Image
                src="/logo.png"
                alt="Logo ALLBASE"
                width={28}
                height={28}
                className={styles.brandLogo}
              />
            </div>
            <div>
              ALLBASE <span className={styles.brandHub}>HUB</span>
            </div>
          </Link>

          <span className={styles.tagline}>
            Portofolio, proyek, dan tools jaringan oleh Ilal Ilhamdi.
          </span>
        </div>

        {/* Center: Footer Navigation (Desktop) */}
        <nav className={styles.footerNav} aria-label="Navigasi Footer">
          {mainNavItems.map((item, idx) => (
            <Link
              key={item.href}
              href={item.href}
              className={`${styles.footerLink} ${idx === 0 ? styles.footerLinkActive : ""}`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Right (Desktop) / Bottom Centered (Mobile): Copyright */}
        <div className={styles.copyright}>
          <span className={styles.desktopCopy}>
            &copy; 2025 ALLBASE HUB. All rights reserved.
          </span>
          <span className={styles.mobileCopy}>
            &copy; 2026 Ilal Ilhamdi
          </span>
        </div>
      </div>
    </footer>
  );
}
