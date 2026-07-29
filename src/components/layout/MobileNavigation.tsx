"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Layers, X, Home, User, Code, Folder, Wrench, Award, Mail } from "lucide-react";
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
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  return (
    <>
      <div
        className={`${styles.drawerOverlay} ${isOpen ? styles.open : ""}`}
        onClick={onClose}
        aria-hidden="true"
      />
      <aside
        className={`${styles.drawer} ${isOpen ? styles.open : ""}`}
        aria-label="Mobile Navigation"
        role="dialog"
        aria-modal="true"
      >
        <div className={styles.drawerHeader}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, fontWeight: 700 }}>
            <Layers size={20} color="var(--color-primary-600)" />
            <span>ALLBASE HUB</span>
          </div>
          <button
            className={styles.closeBtn}
            onClick={onClose}
            aria-label="Tutup Menu Mobile"
          >
            <X size={20} />
          </button>
        </div>

        <ul className={styles.navList}>
          {mainNavItems.map((item) => (
            <li key={item.href} className={styles.navItem}>
              <Link href={item.href} onClick={onClose}>
                {item.icon && iconMap[item.icon]}
                <span>{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </aside>
    </>
  );
}
