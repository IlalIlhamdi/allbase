"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Network,
  Gauge,
  MapPin,
  Search,
  ChevronRight,
  Server,
  ArrowLeftRight,
} from "lucide-react";
import styles from "./Tools.module.css";

interface ToolItem {
  id: string;
  title: string;
  subtitle: string;
  searchKeywords: string;
  href: string;
  iconType: "ip" | "subnet" | "converter" | "speedtest" | "gps";
  pastelTheme: "blue" | "green" | "orange" | "purple" | "cyan";
}

const mainTools: ToolItem[] = [
  {
    id: "ip-calculator",
    title: "IP Calculator",
    subtitle: "Informasi alamat IP",
    searchKeywords: "Hitung informasi IP address dengan mudah dan cepat.",
    href: "/tools/ip-calculator",
    iconType: "ip",
    pastelTheme: "blue",
  },
  {
    id: "subnet-calculator",
    title: "Subnet Calculator",
    subtitle: "Hitung subnet & host",
    searchKeywords: "Hitung subnet, range IP, jumlah host dan informasi lainnya.",
    href: "/tools/subnet-calculator",
    iconType: "subnet",
    pastelTheme: "green",
  },
  {
    id: "network-converter",
    title: "Network Converter",
    subtitle: "Konversi format jaringan",
    searchKeywords: "Konversi berbagai format jaringan seperti IP, CIDR, netmask, dan wildcard.",
    href: "/tools/network-converter",
    iconType: "converter",
    pastelTheme: "orange",
  },
  {
    id: "internet-speed-test",
    title: "Speed Test",
    subtitle: "Uji koneksi internet",
    searchKeywords: "Internet Speed Test Uji kecepatan internet download upload dan latensi secara real-time.",
    href: "/tools/internet-speed-test",
    iconType: "speedtest",
    pastelTheme: "purple",
  },
  {
    id: "ilal-gps",
    title: "GPS Tracker",
    subtitle: "Lacak koordinat GPS",
    searchKeywords: "Koordinat GPS Tracker Alat pelacak lokasi geolokasi real-time dan pemetaan koordinat GPS perangkat.",
    href: "/ilal-gps",
    iconType: "gps",
    pastelTheme: "cyan",
  },
];

function ToolIcon({ type }: { type: ToolItem["iconType"] }) {
  if (type === "ip") return <Server size={20} strokeWidth={2.1} />;
  if (type === "subnet") return <Network size={20} strokeWidth={2.1} />;
  if (type === "converter") return <ArrowLeftRight size={20} strokeWidth={2.1} />;
  if (type === "speedtest") return <Gauge size={20} strokeWidth={2.1} />;
  return <MapPin size={20} strokeWidth={2.1} />;
}

export default function Tools() {
  const [showAll, setShowAll] = useState(false);
  const [searchFilter, setSearchFilter] = useState("");

  useEffect(() => {
    const onSearch = (e: Event) => {
      const customEvent = e as CustomEvent<{ query: string }>;
      setSearchFilter(customEvent.detail?.query || "");
    };
    window.addEventListener("allbase-search-change", onSearch);
    return () => window.removeEventListener("allbase-search-change", onSearch);
  }, []);

  const filtered = mainTools.filter((tool) => {
    if (!searchFilter.trim()) return true;
    const q = searchFilter.toLowerCase();
    return (
      tool.title.toLowerCase().includes(q) ||
      tool.subtitle.toLowerCase().includes(q) ||
      tool.searchKeywords.toLowerCase().includes(q)
    );
  });

  const displayedTools =
    searchFilter.trim() || showAll ? filtered : filtered.slice(0, 4);

  return (
    <section id="tools" className={styles.toolsSection} aria-labelledby="tools-title">
      <div className={styles.toolsContainer}>
        <div className={styles.headerRow}>
          <h2 id="tools-title" className={styles.heading}>
            Tools untuk{" "}
            <br />
            <span>kerja lebih mudah.</span>
          </h2>

          <button
            type="button"
            className={styles.viewAll}
            onClick={() => setShowAll((prev) => !prev)}
          >
            <span>{showAll ? "Ringkas" : "Lihat semua"}</span>
            <ArrowRight size={14} strokeWidth={2.3} />
          </button>
        </div>

        {/* Pill Search Input (16px font on mobile prevents iOS Safari auto-zoom) */}
        <div className={styles.searchPill}>
          <Search size={17} className={styles.searchIcon} />
          <input
            type="search"
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            placeholder="Cari tool yang kamu butuhkan"
            className={styles.searchInput}
            aria-label="Cari tool yang kamu butuhkan"
          />
        </div>

        {/* Responsive Pastel Bento Tool Cards Grid */}
        {displayedTools.length > 0 ? (
          <div className={styles.bentoGrid}>
            {displayedTools.map((tool) => (
              <Link
                key={tool.id}
                href={tool.href}
                className={styles.bentoCard}
              >
                <div className={styles.cardTop}>
                  <div
                    className={`${styles.pastelIcon} ${styles[`pastel_${tool.pastelTheme}`]}`}
                    aria-hidden="true"
                  >
                    <ToolIcon type={tool.iconType} />
                  </div>

                  <span className={styles.chevronCircle} aria-hidden="true">
                    <ChevronRight size={15} strokeWidth={2.3} />
                  </span>
                </div>

                <h3 className={styles.cardTitle}>{tool.title}</h3>
                <p className={styles.cardSub}>{tool.subtitle}</p>
              </Link>
            ))}
          </div>
        ) : (
          <div className={styles.emptyState}>
            <p className={styles.emptyText}>
              Tool tidak ditemukan untuk &ldquo;{searchFilter}&rdquo;.
            </p>
            <button
              type="button"
              className={styles.resetBtn}
              onClick={() => setSearchFilter("")}
            >
              Reset pencarian
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
