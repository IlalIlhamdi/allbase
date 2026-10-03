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
        <div className={styles.inner}>
          {/* Sebelah Kiri: Logo & Nama ALLBASE HUB */}
          <Link href="/" className={styles.brand} aria-label="ALLBASE Hub Beranda">
            <div className={styles.brandIcon}>
              <Layers size={18} />
            </div>
            <div className={styles.brandName}>
              ALLBASE <span>HUB</span>
            </div>
          </Link>

          {/* Desktop Navigation (Preserved semantically, hidden in capsule mode) */}
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

          {/* Sebelah Kanan: Kontrol (Desktop: Search, Theme, Hamburger; Mobile: Hamburger only) */}
          <div className={styles.controls}>
            {/* 1. Tombol Search (Desktop only) */}
            <button
              type="button"
              className={`${styles.controlBtn} ${styles.desktopOnlyControl}`}
              onClick={() => setIsSearchOpen(true)}
              aria-label="Cari di ALLBASE (Ctrl+K)"
              title="Pencarian Global (Ctrl+K)"
            >
              <Search size={17} />
            </button>

            {/* 2. Tombol Dark/Light Mode (Desktop only) */}
            <button
              type="button"
              className={`${styles.controlBtn} ${styles.desktopOnlyControl}`}
              onClick={toggleTheme}
              title={`Ganti ke Mode ${theme === "dark" ? "Terang" : "Gelap"}`}
              aria-label="Ganti Mode Terang atau Gelap"
            >
              {theme === "dark" ? <Sun size={17} /> : <Moon size={17} />}
            </button>

            {/* 3. Tombol Hamburger Menu (Paling Kanan) */}
            <button
              type="button"
              className={`${styles.controlBtn} ${styles.menuBtn} ${isMenuOpen ? styles.menuBtnActive : ""}`}
              aria-label={isMenuOpen ? "Tutup menu navigasi" : "Buka menu navigasi"}
              aria-expanded={isMenuOpen}
              aria-controls="mobile-navigation"
              title={isMenuOpen ? "Tutup Menu Navigasi" : "Buka Menu Navigasi"}
              onClick={() => setIsMenuOpen((prev) => !prev)}
            >
              {isMenuOpen ? <X size={18} /> : <Menu size={18} />}
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
