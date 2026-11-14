import Image from "next/image";
import Link from "next/link";
import { mainNavItems } from "@/data/navigation";
import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.leftGroup}>
          <Link href="/" className={styles.brand}>
            <div className={styles.brandLogoWrap}>
              <Image
                src="/logo.png"
                alt="Logo ALLBASE"
                width={26}
                height={26}
                className={styles.brandLogo}
              />
            </div>
            <span>ALLBASE</span>
          </Link>
        </div>

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

        <div className={styles.copyright}>
          <span>&copy; 2026 Ilal Ilhamdi</span>
        </div>
      </div>
    </footer>
  );
}
