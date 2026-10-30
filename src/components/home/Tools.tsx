"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Share2,
  ArrowRight,
  Network,
  RefreshCw,
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
  mobileTitle: string;
  description: string;
  mobileSubtitle: string;
  href: string;
  iconType: "ip" | "subnet" | "converter" | "speedtest" | "gps";
  pastelTheme: "blue" | "green" | "orange" | "purple" | "cyan";
}

const mainTools: ToolItem[] = [
  {
    id: "ip-calculator",
    title: "IP Calculator",
    mobileTitle: "IP Calculator",
    description: "Hitung informasi IP address dengan mudah dan cepat.",
    mobileSubtitle: "Informasi alamat IP",
    href: "/tools/ip-calculator",
    iconType: "ip",
    pastelTheme: "blue",
  },
  {
    id: "subnet-calculator",
    title: "Subnet Calculator",
    mobileTitle: "Subnet Calculator",
    description: "Hitung subnet, range IP, jumlah host dan informasi lainnya.",
    mobileSubtitle: "Hitung subnet & host",
    href: "/tools/subnet-calculator",
    iconType: "subnet",
    pastelTheme: "green",
  },
  {
    id: "network-converter",
    title: "Network Converter",
    mobileTitle: "Network Converter",
    description: "Konversi berbagai format jaringan seperti IP, CIDR, netmask, dan wildcard.",
    mobileSubtitle: "Konversi format jaringan",
    href: "/tools/network-converter",
    iconType: "converter",
    pastelTheme: "orange",
  },
  {
    id: "internet-speed-test",
    title: "Internet Speed Test",
    mobileTitle: "Speed Test",
    description: "Uji kecepatan internet (download, upload) dan latensi secara real-time.",
    mobileSubtitle: "Uji koneksi internet",
    href: "/tools/internet-speed-test",
    iconType: "speedtest",
    pastelTheme: "purple",
  },
  {
    id: "ilal-gps",
    title: "Koordinat GPS Tracker",
    mobileTitle: "GPS Tracker",
    description: "Alat pelacak lokasi geolokasi real-time dan pemetaan koordinat GPS perangkat.",
    mobileSubtitle: "Lacak koordinat GPS",
    href: "/ilal-gps",
    iconType: "gps",
    pastelTheme: "cyan",
  },
];

function DesktopToolIcon({ type }: { type: ToolItem["iconType"] }) {
  if (type === "ip") return <span className={styles.ipBadgeText}>IP</span>;
  if (type === "subnet") return <Network size={26} strokeWidth={2.1} />;
  if (type === "converter") return <RefreshCw size={25} strokeWidth={2.1} />;
  if (type === "speedtest") return <Gauge size={26} strokeWidth={2.1} />;
  return <MapPin size={25} strokeWidth={2.1} />;
}

function MobileToolIcon({ type }: { type: ToolItem["iconType"] }) {
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
      tool.mobileTitle.toLowerCase().includes(q) ||
      tool.description.toLowerCase().includes(q) ||
      tool.mobileSubtitle.toLowerCase().includes(q)
    );
  });

  const displayedTools =
    searchFilter.trim() || showAll ? filtered : filtered.slice(0, 4);

  return (
    <section id="tools" className={styles.toolsSection} aria-labelledby="tools-title">
      {/* ====================================================================
          DESKTOP TOOLS (>= 768px)
          ==================================================================== */}
      <div className={`container ${styles.desktopTools}`}>
        <div className={styles.sectionCard}>
          <div className={styles.headerRow}>
            <div className={styles.headerLeft}>
              <div className={styles.iconBadge} aria-hidden="true">
                <Share2 size={20} />
              </div>
              <div>
                <h2 id="tools-title" className={styles.title}>
                  Tools Jaringan
                </h2>
                <p className={styles.subtitle}>
                  Kumpulan tools jaringan yang bisa langsung kamu gunakan.
                </p>
              </div>
            </div>

            <button
              type="button"
              className={styles.viewAllBtn}
              onClick={() => setShowAll((prev) => !prev)}
            >
              <span>{showAll ? "Tampilkan Utama" : "Lihat Semua Tools"}</span>
              <ArrowRight size={15} />
            </button>
          </div>

          <div className={styles.toolsGrid}>
            {displayedTools.map((tool) => (
              <Link key={tool.id} href={tool.href} className={styles.toolCard}>
                <div className={styles.toolIconWrap} aria-hidden="true">
                  <DesktopToolIcon type={tool.iconType} />
                </div>

                <div className={styles.toolContent}>
                  <h3 className={styles.toolTitle}>{tool.title}</h3>
                  <p className={styles.toolDescDesktop}>{tool.description}</p>
                </div>

                <span className={styles.openToolBtn}>
                  <span>Buka Tool</span>
                  <ArrowRight size={15} />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* ====================================================================
          MOBILE & iOS TOOLS (<= 767px)
          ==================================================================== */}
      <div className={styles.mobileTools}>
        <div className={styles.mobileHeaderRow}>
          <h2 className={styles.mobileHeading}>
            Tools untuk
            <br />
            <span>kerja lebih mudah.</span>
          </h2>

          <button
            type="button"
            className={styles.mobileViewAll}
            onClick={() => setShowAll((prev) => !prev)}
          >
            <span>{showAll ? "Ringkas" : "Lihat semua"}</span>
            <ArrowRight size={14} strokeWidth={2.3} />
          </button>
        </div>

        {/* iOS Pill Search Input (16px font prevents iOS Safari auto-zoom) */}
        <div className={styles.mobileSearchPill}>
          <Search size={17} className={styles.mobileSearchIcon} />
          <input
            type="search"
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            placeholder="Cari tool yang kamu butuhkan"
            className={styles.mobileSearchInput}
            aria-label="Cari tool yang kamu butuhkan"
          />
        </div>

        {/* 2x2 Pastel Bento Tool Cards */}
        <div className={styles.mobileBentoGrid}>
          {displayedTools.map((tool) => (
            <Link
              key={tool.id}
              href={tool.href}
              className={styles.mobileBentoCard}
            >
              <div className={styles.mobileCardTop}>
                <div
                  className={`${styles.mobilePastelIcon} ${styles[`pastel_${tool.pastelTheme}`]}`}
                  aria-hidden="true"
                >
                  <MobileToolIcon type={tool.iconType} />
                </div>

                <span className={styles.mobileChevronCircle} aria-hidden="true">
                  <ChevronRight size={15} strokeWidth={2.3} />
                </span>
              </div>

              <h3 className={styles.mobileCardTitle}>{tool.mobileTitle}</h3>
              <p className={styles.mobileCardSub}>{tool.mobileSubtitle}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
