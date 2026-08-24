"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Layers, Moon, Sun, Menu, X, Search } from "lucide-react";
import { useTheme } from "@/components/providers/ThemeProvider";
import { mainNavItems } from "@/data/navigation";
import MobileNavigation from "./MobileNavigation";
import CommandMenu from "@/components/common/CommandMenu";
import styles from "./Header.module.css";

export default function Header() {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Global Ctrl+K / Cmd+K shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <>
      <header className={styles.header}>
        <div className={`container ${styles.inner}`}>
          <Link href="/" className={styles.brand} aria-label="ALLBASE Hub Beranda">
            <div className={styles.brandIcon}>
              <Layers size={20} />
            </div>
            <div className={styles.brandName}>
              ALLBASE <span>HUB</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className={styles.nav} aria-label="Navigasi Utama">
            {mainNavItems.map((item) => {
              const isActive =
                item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href) || (item.href.startsWith("/#") && pathname === "/");

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`${styles.navLink} ${isActive ? styles.navLinkActive : ""}`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Header Controls */}
          <div className={styles.controls}>
            {/* Desktop Quick Search Trigger */}
            <button
              type="button"
              className={styles.searchTriggerBtn}
              onClick={() => setIsSearchOpen(true)}
              aria-label="Cari di ALLBASE (Tekan Ctrl+K)"
              title="Pencarian Global (Ctrl+K)"
            >
              <Search size={15} className={styles.searchTriggerIcon} />
              <span className={styles.searchTriggerText}>Cari...</span>
              <kbd className={styles.searchKbd}>⌘K</kbd>
            </button>

            {/* Mobile Search Icon Button */}
            <button
              type="button"
              className={`${styles.iconBtn} ${styles.mobileSearchBtn}`}
              onClick={() => setIsSearchOpen(true)}
              aria-label="Buka Pencarian"
              title="Cari"
            >
              <Search size={18} />
            </button>

            {/* Theme Switcher Button */}
            <button
              type="button"
              className={styles.iconBtn}
              onClick={toggleTheme}
              title={`Ganti ke Mode ${theme === "dark" ? "Terang" : "Gelap"}`}
              aria-label="Ganti Mode Terang atau Gelap"
            >
              {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {/* Hamburger Button for Mobile */}
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

        <MobileNavigation
          isOpen={isMenuOpen}
          onClose={() => setIsMenuOpen(false)}
          onOpenSearch={() => {
            setIsMenuOpen(false);
            setIsSearchOpen(true);
          }}
        />
      </header>

      {/* Global Command Palette Modal */}
      <CommandMenu isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}
