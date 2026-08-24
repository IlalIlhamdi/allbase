"use client";

import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  X,
  Gauge,
  Calculator,
  Cpu,
  Binary,
  Calendar,
  CheckSquare,
  Users,
  MapPin,
  Award,
  ExternalLink,
  Sun,
  Moon,
  Copy,
  Clock,
  Trash2,
  Home,
  Briefcase,
  Layers,
  Sparkles,
} from "lucide-react";
import { toolsData } from "@/data/tools";
import { projectsData } from "@/data/projects";
import { certificatesData } from "@/data/certificates";
import { useRecentTools } from "@/hooks/useRecentTools";
import { useTheme } from "@/components/providers/ThemeProvider";
import { useToast } from "@/components/providers/ToastProvider";
import styles from "./CommandMenu.module.css";

interface CommandMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

interface SearchItem {
  id: string;
  title: string;
  subtitle?: string;
  category: "Halaman" | "Tools" | "Proyek" | "Sertifikasi" | "Aksi";
  href?: string;
  icon: React.ReactNode;
  action?: () => void;
  isExternal?: boolean;
}

export default function CommandMenu({ isOpen, onClose }: CommandMenuProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const { theme, toggleTheme } = useTheme();
  const { recentTools, clearRecentTools } = useRecentTools();
  const { success } = useToast();

  const handleCopyUrl = useCallback(() => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      success("Tautan halaman berhasil disalin!");
    }
  }, [success]);

  const allItems = useMemo<SearchItem[]>(() => {
    const items: SearchItem[] = [
      // Navigation Pages
      {
        id: "nav-home",
        title: "Beranda Utama",
        subtitle: "Halaman depan portofolio & overview ALLBASE",
        category: "Halaman",
        href: "/",
        icon: <Home size={18} />,
      },
      {
        id: "nav-about",
        title: "Tentang & Profil",
        subtitle: "Profil, keahlian, dan latar belakang teknologi",
        category: "Halaman",
        href: "/#about",
        icon: <Layers size={18} />,
      },
      {
        id: "nav-skills",
        title: "Keahlian & Tech Stack",
        subtitle: "Jaringan komputer, routing, switching, dan web stack",
        category: "Halaman",
        href: "/#skills",
        icon: <Sparkles size={18} />,
      },
      {
        id: "nav-projects",
        title: "Daftar Proyek",
        subtitle: "Perpustakaan seluruh portofolio proyek",
        category: "Halaman",
        href: "/#projects",
        icon: <Briefcase size={18} />,
      },
      {
        id: "nav-certs",
        title: "Sertifikasi & Kredensial",
        subtitle: "MikroTik, CCNA: Introduction to Networks 2026, dsb.",
        category: "Halaman",
        href: "/#certifications",
        icon: <Award size={18} />,
      },
      {
        id: "nav-schedule",
        title: "Jadwal Kuliah TRJT 2A",
        subtitle: "Roster perkuliahan mingguan dan daftar mahasiswa",
        category: "Halaman",
        href: "/class-schedule",
        icon: <Calendar size={18} />,
      },
      {
        id: "nav-tasks",
        title: "Pengelola Tugas Kuliah",
        subtitle: "Pencatatan tugas dan reminder deadline",
        category: "Halaman",
        href: "/college-tasks",
        icon: <CheckSquare size={18} />,
      },
      {
        id: "nav-friendship",
        title: "Duo Cees — Galeri Sahabat",
        subtitle: "Dokumentasi momen persahabatan & kolaborasi",
        category: "Halaman",
        href: "/friendship-page",
        icon: <Users size={18} />,
      },
      {
        id: "nav-gps",
        title: "Deteksi Lokasi GPS",
        subtitle: "Pelacak koordinat geolokasi real-time",
        category: "Halaman",
        href: "/ilal-gps",
        icon: <MapPin size={18} />,
      },

      // Tools
      {
        id: "tool-speed",
        title: "Internet Speed Test",
        subtitle: "Pengukuran throughput download, upload, ping, & jitter M-Lab",
        category: "Tools",
        href: "/tools/internet-speed-test",
        icon: <Gauge size={18} />,
      },
      {
        id: "tool-subnet",
        title: "Subnet Calculator IPv4",
        subtitle: "Kalkulator pembagian subnet, wildcard, network & host range",
        category: "Tools",
        href: "/tools/subnet-calculator",
        icon: <Calculator size={18} />,
      },
      {
        id: "tool-ip",
        title: "IP & Mask Calculator",
        subtitle: "Analisis alokasi blok IP, prefix CIDR, dan biner 32-bit",
        category: "Tools",
        href: "/tools/ip-calculator",
        icon: <Cpu size={18} />,
      },
      {
        id: "tool-converter",
        title: "Konversi Satuan Jaringan",
        subtitle: "Konverter Mbps <-> MB/s, biner, desimal, hex, & bandwidth",
        category: "Tools",
        href: "/tools/network-converter",
        icon: <Binary size={18} />,
      },

      // Projects
      ...projectsData.map((p) => ({
        id: `proj-${p.id}`,
        title: p.title,
        subtitle: p.description,
        category: "Proyek" as const,
        href: p.href || "/#projects",
        isExternal: p.openMode === "new-tab" || p.href?.startsWith("http"),
        icon: <Briefcase size={18} />,
      })),

      // Certificates
      ...certificatesData.map((c) => ({
        id: `cert-${c.id}`,
        title: c.title,
        subtitle: `${c.issuer} (${c.year})`,
        category: "Sertifikasi" as const,
        href: c.credentialUrl || "/#certifications",
        isExternal: !!c.credentialUrl,
        icon: <Award size={18} />,
      })),

      // Actions
      {
        id: "action-theme",
        title: `Ganti ke Mode ${theme === "dark" ? "Terang (Light)" : "Gelap (Dark)"}`,
        subtitle: "Alihkan tampilan tema warna antarmuka",
        category: "Aksi",
        action: toggleTheme,
        icon: theme === "dark" ? <Sun size={18} /> : <Moon size={18} />,
      },
      {
        id: "action-copy-link",
        title: "Salin URL Halaman Saat Ini",
        subtitle: "Salin tautan web ke clipboard",
        category: "Aksi",
        action: handleCopyUrl,
        icon: <Copy size={18} />,
      },
    ];

    return items;
  }, [theme, toggleTheme, handleCopyUrl]);

  const filteredItems = useMemo(() => {
    if (!query.trim()) return allItems.slice(0, 8);
    const q = query.toLowerCase().trim();
    return allItems.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        (item.subtitle && item.subtitle.toLowerCase().includes(q)) ||
        item.category.toLowerCase().includes(q)
    );
  }, [allItems, query]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [filteredItems]);

  useEffect(() => {
    if (!isOpen) {
      setQuery("");
      return;
    }

    // Auto-focus search input
    const timer = setTimeout(() => {
      inputRef.current?.focus();
    }, 50);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev < filteredItems.length - 1 ? prev + 1 : 0));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : filteredItems.length - 1));
      } else if (e.key === "Enter") {
        e.preventDefault();
        const selected = filteredItems[selectedIndex];
        if (selected) {
          executeItem(selected);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose, filteredItems, selectedIndex]);

  const executeItem = (item: SearchItem) => {
    onClose();
    if (item.action) {
      item.action();
      return;
    }

    if (item.href) {
      if (item.isExternal) {
        window.open(item.href, "_blank", "noopener,noreferrer");
      } else {
        router.push(item.href);
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose} aria-modal="true" role="dialog">
      <div
        className={styles.modal}
        onClick={(e) => e.stopPropagation()}
        aria-label="Pencarian Cepat ALLBASE"
      >
        {/* Search Bar Input */}
        <div className={styles.inputWrapper}>
          <Search size={20} className={styles.searchIcon} />
          <input
            ref={inputRef}
            type="text"
            className={styles.searchInput}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari halaman, tools, proyek, sertifikasi, atau aksi..."
            aria-label="Ketik untuk mencari"
          />
          {query && (
            <button
              type="button"
              className={styles.clearBtn}
              onClick={() => setQuery("")}
              aria-label="Hapus teks pencarian"
            >
              <X size={16} />
            </button>
          )}
          <span className={styles.kbdShortcut}>ESC</span>
        </div>

        {/* Recent Tools History (If query is empty and recent exists) */}
        {!query.trim() && recentTools.length > 0 && (
          <div className={styles.recentSection}>
            <div className={styles.recentHeader}>
              <span className={styles.recentTitle}>
                <Clock size={13} /> Terakhir Digunakan
              </span>
              <button
                type="button"
                className={styles.clearRecentBtn}
                onClick={clearRecentTools}
                title="Hapus riwayat tools"
              >
                <Trash2 size={12} /> Hapus
              </button>
            </div>
            <div className={styles.recentGrid}>
              {recentTools.map((rt) => (
                <button
                  key={rt.id}
                  type="button"
                  className={styles.recentChip}
                  onClick={() => {
                    onClose();
                    router.push(rt.href);
                  }}
                >
                  <span>{rt.title}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Results List */}
        <div className={styles.resultsList} ref={listRef}>
          {filteredItems.length === 0 ? (
            <div className={styles.emptyState}>
              <p>Tidak ada hasil untuk &ldquo;{query}&rdquo;</p>
              <span>Coba kata kunci lain seperti &ldquo;subnet&rdquo;, &ldquo;speed&rdquo;, &ldquo;proyek&rdquo;, atau &ldquo;jadwal&rdquo;</span>
            </div>
          ) : (
            filteredItems.map((item, index) => {
              const isSelected = index === selectedIndex;
              return (
                <button
                  key={item.id}
                  type="button"
                  className={`${styles.resultItem} ${isSelected ? styles.selectedItem : ""}`}
                  onClick={() => executeItem(item)}
                  onMouseEnter={() => setSelectedIndex(index)}
                >
                  <div className={styles.itemIcon}>{item.icon}</div>
                  <div className={styles.itemContent}>
                    <div className={styles.itemTitleGroup}>
                      <span className={styles.itemTitle}>{item.title}</span>
                      <span className={styles.itemCategory}>{item.category}</span>
                    </div>
                    {item.subtitle && (
                      <p className={styles.itemSubtitle}>{item.subtitle}</p>
                    )}
                  </div>
                  {item.isExternal && <ExternalLink size={14} className={styles.externalIcon} />}
                </button>
              );
            })
          )}
        </div>

        {/* Footer shortcuts */}
        <div className={styles.footer}>
          <div className={styles.footerShortcuts}>
            <span><kbd className={styles.kbd}>↑</kbd><kbd className={styles.kbd}>↓</kbd> Navigasi</span>
            <span><kbd className={styles.kbd}>↵</kbd> Buka</span>
            <span><kbd className={styles.kbd}>ESC</kbd> Tutup</span>
          </div>
          <span className={styles.footerBrand}>ALLBASE Hub</span>
        </div>
      </div>
    </div>
  );
}
