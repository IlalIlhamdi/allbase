"use client";

import { useState } from "react";
import Link from "next/link";
import { Layers, Moon, Sun, Menu, X } from "lucide-react";
import { useTheme } from "@/components/providers/ThemeProvider";
import { mainNavItems } from "@/data/navigation";
import MobileNavigation from "./MobileNavigation";
import styles from "./Header.module.css";

export default function Header() {
  const { theme, toggleTheme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className={styles.header}>
      <div className={`container ${styles.inner}`}>
        <Link href="/#hero" className={styles.brand} aria-label="ALLBASE Hub Beranda">
          <div className={styles.brandIcon}>
            <Layers size={20} />
          </div>
          <div className={styles.brandName}>
            ALLBASE <span>HUB</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className={styles.nav} aria-label="Navigasi Utama">
          {mainNavItems.map((item) => (
            <Link key={item.href} href={item.href} className={styles.navLink}>
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Header Controls */}
        <div className={styles.controls}>
          <button
            type="button"
            className={styles.iconBtn}
            onClick={toggleTheme}
            title="Ganti Mode Terang/Gelap"
            aria-label="Ganti Mode Terang atau Gelap"
          >
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          <button
            type="button"
            className={`${styles.iconBtn} ${styles.menuBtn}`}
            aria-label={isMenuOpen ? "Tutup menu navigasi" : "Buka menu navigasi"}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-navigation"
            onClick={() => setIsMenuOpen((previous) => !previous)}
          >
            {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      <MobileNavigation isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
    </header>
  );
}
