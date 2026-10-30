"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Mail, Menu, X } from "lucide-react";
import { mainNavItems } from "@/data/navigation";
import MobileNavigation from "./MobileNavigation";
import CommandMenu from "@/components/common/CommandMenu";
import styles from "./Header.module.css";

export default function Header() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [activeHash, setActiveHash] = useState("/#hero");

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

  useEffect(() => {
    if (pathname !== "/") return;

    const handleScroll = () => {
      const sections = ["hero", "about", "projects", "tools", "contact"];
      const scrollPos = window.scrollY + 140;

      for (let i = sections.length - 1; i >= 0; i--) {
        const secId = sections[i];
        if (!secId) continue;
        const el = document.getElementById(secId);
        if (el && el.offsetTop <= scrollPos) {
          setActiveHash(`/#${secId}`);
          return;
        }
      }
      setActiveHash("/#hero");
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [pathname]);

  return (
    <>
      <header className={styles.header}>
        <div className={styles.inner}>
          {/* Left: Brand Logo & Name */}
          <Link
            href="/"
            className={styles.brand}
            aria-label="ALLBASE HUB Beranda"
            onClick={() => setActiveHash("/#hero")}
          >
            <div className={styles.brandLogoWrap}>
              <Image
                src="/logo.png"
                alt="Logo ALLBASE HUB"
                width={38}
                height={38}
                priority
                className={styles.brandLogo}
              />
            </div>
            <div className={styles.brandName}>
              ALLBASE <span>HUB</span>
            </div>
          </Link>

          {/* Center: Desktop Navigation */}
          <nav className={styles.nav} aria-label="Navigasi Utama">
            {mainNavItems.map((item) => {
              const isActive =
                pathname === "/"
                  ? activeHash === item.href
                  : item.href !== "/#hero" && pathname.startsWith(item.href.replace("/#", "/"));

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setActiveHash(item.href)}
                  className={`${styles.navLink} ${isActive ? styles.navLinkActive : ""}`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Right: CTA Button on Desktop & Hamburger Menu on Mobile */}
          <div className={styles.controls}>
            <Link href="/#contact" className={styles.ctaButton}>
              <Mail size={16} />
              <span>Hubungi Saya</span>
            </Link>

            <button
              type="button"
              className={`${styles.menuBtn} ${isMenuOpen ? styles.menuBtnActive : ""}`}
              aria-label={isMenuOpen ? "Tutup menu navigasi" : "Buka menu navigasi"}
              aria-expanded={isMenuOpen}
              aria-controls="mobile-navigation"
              onClick={() => setIsMenuOpen((prev) => !prev)}
            >
              {isMenuOpen ? <X size={19} /> : <Menu size={19} />}
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

      <CommandMenu isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}
