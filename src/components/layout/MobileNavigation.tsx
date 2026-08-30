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
} from "lucide-react";
import { mainNavItems } from "@/data/navigation";
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
  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    const previousTouchAction = document.body.style.touchAction;

    document.body.style.overflow = "hidden";
    document.body.style.touchAction = "none";

    const closeWithEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", closeWithEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.body.style.touchAction = previousTouchAction;
      window.removeEventListener("keydown", closeWithEscape);
    };
  }, [isOpen, onClose]);

  return (
    <>
      {/* Mobile Menu Overlay */}
      <div
        className={`${styles.mobileMenuOverlay} ${
          isOpen ? styles.mobileMenuOverlayOpen : ""
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Mobile Navigation Drawer */}
      <nav
        id="mobile-navigation"
        className={`${styles.mobileMenu} ${
          isOpen ? styles.mobileMenuOpen : ""
        }`}
        aria-label="Navigasi Mobile"
        aria-hidden={!isOpen}
      >
        <div className={styles.mobileMenuInner}>
          {/* Quick Search Trigger */}
          {onOpenSearch && (
            <button
              type="button"
              className={styles.mobileSearchTrigger}
              onClick={onOpenSearch}
              aria-label="Buka Pencarian Global"
            >
              <Search size={16} className={styles.searchIcon} />
              <span className={styles.searchPlaceholder}>
                Cari halaman, tools, proyek...
              </span>
              <kbd className={styles.searchKbd}>⌘K</kbd>
            </button>
          )}

          {/* Navigation Links */}
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
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </>
  );
}
