"use client";

import { useEffect } from "react";
import Link from "next/link";
import {
  Home,
  User,
  Code,
  Folder,
  Wrench,
  Award,
  Mail,
  Search,
  Sun,
  Moon,
  ChevronRight,
} from "lucide-react";
import { mainNavItems } from "@/data/navigation";
import { useTheme } from "@/components/providers/ThemeProvider";
import styles from "./MobileNavigation.module.css";

interface MobileNavigationProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenSearch?: () => void;
}

const iconMap: Record<string, React.ReactNode> = {
  home: <Home size={17} />,
  user: <User size={17} />,
  code: <Code size={17} />,
  folder: <Folder size={17} />,
  wrench: <Wrench size={17} />,
  award: <Award size={17} />,
  mail: <Mail size={17} />,
};

export default function MobileNavigation({
  isOpen,
  onClose,
  onOpenSearch,
}: MobileNavigationProps) {
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const closeWithEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", closeWithEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeWithEscape);
    };
  }, [isOpen, onClose]);

  return (
    <>
      {/* Subtle Backdrop Overlay */}
      <div
        className={`${styles.mobileMenuOverlay} ${
          isOpen ? styles.mobileMenuOverlayOpen : ""
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Clean Floating Panel (Dropdown directly under navbar) */}
      <nav
        id="mobile-navigation"
        className={`${styles.mobilePanel} ${
          isOpen ? styles.mobilePanelOpen : ""
        }`}
        aria-label="Navigasi Menu Mobile"
        aria-hidden={!isOpen}
      >
        <div className={styles.panelContent}>
          {/* Main Navigation Links */}
          <ul className={styles.navList}>
            {mainNavItems.map((item) => (
              <li key={item.href} className={styles.navItem}>
                <Link
                  href={item.href}
                  className={styles.mobileNavLink}
                  onClick={onClose}
                >
                  <div className={styles.navIcon}>
                    {item.icon && iconMap[item.icon]}
                  </div>
                  <span className={styles.navLabel}>{item.label}</span>
                  <ChevronRight size={15} className={styles.navArrow} />
                </Link>
              </li>
            ))}
          </ul>

          <div className={styles.divider} />

          {/* Quick Actions: Search & Theme Toggle */}
          <div className={styles.actionsContainer}>
            {/* 1. Global Search Trigger */}
            {onOpenSearch && (
              <button
                type="button"
                className={styles.actionBtn}
                onClick={onOpenSearch}
                aria-label="Buka Pencarian Global (Ctrl+K)"
              >
                <div className={styles.actionIcon}>
                  <Search size={16} />
                </div>
                <div className={styles.actionText}>
                  <span className={styles.actionTitle}>Cari di ALLBASE</span>
                  <span className={styles.actionSubtitle}>Halaman, tools, &amp; proyek</span>
                </div>
                <kbd className={styles.kbdBadge}>⌘K</kbd>
              </button>
            )}

            {/* 2. Dark / Light Mode Switcher */}
            <button
              type="button"
              className={styles.actionBtn}
              onClick={toggleTheme}
              aria-label={`Ganti ke mode ${theme === "dark" ? "terang" : "gelap"}`}
            >
              <div className={styles.actionIcon}>
                {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
              </div>
              <div className={styles.actionText}>
                <span className={styles.actionTitle}>Tampilan</span>
                <span className={styles.actionSubtitle}>
                  {theme === "dark" ? "Mode Gelap aktif" : "Mode Terang aktif"}
                </span>
              </div>
              <span className={styles.themePill}>
                {theme === "dark" ? "Gelap" : "Terang"}
              </span>
            </button>
          </div>
        </div>
      </nav>
    </>
  );
}
