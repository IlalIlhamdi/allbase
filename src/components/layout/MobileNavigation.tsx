"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Grid, Wrench, Home, User, Code, Folder, Award, Mail } from "lucide-react";
import { mainNavItems } from "@/data/navigation";
import styles from "./MobileNavigation.module.css";

interface MobileNavigationProps {
  isOpen: boolean;
  onClose: () => void;
}

const iconMap: Record<string, React.ReactNode> = {
  home: <Home size={18} />,
  user: <User size={18} />,
  code: <Code size={18} />,
  folder: <Folder size={18} />,
  wrench: <Wrench size={18} />,
  award: <Award size={18} />,
  mail: <Mail size={18} />,
};

export default function MobileNavigation({ isOpen, onClose }: MobileNavigationProps) {
  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
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
      >
        <ul className={styles.navList}>
          {mainNavItems.map((item) => (
            <li key={item.href} className={styles.navItem}>
              <Link
                href={item.href}
                className={styles.mobileNavLink}
                onClick={onClose}
              >
                {item.icon && iconMap[item.icon]}
                <span>{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>

        {/* Mobile Quick Action Buttons */}
        <div className={styles.mobileQuickActions}>
          <Link
            href="/#projects"
            className={styles.btnLihatProyek}
            onClick={onClose}
          >
            <Grid size={18} />
            <span>Lihat Proyek</span>
          </Link>

          <Link
            href="/#tools"
            className={styles.btnBukaTools}
            onClick={onClose}
          >
            <Wrench size={18} />
            <span>Buka Tools</span>
          </Link>
        </div>
      </nav>
    </>
  );
}
