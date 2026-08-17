"use client";

import { useState } from "react";
import Image from "next/image";
import { Users, Search, X, ChevronLeft, ChevronRight } from "lucide-react";

interface GalleryItem {
  id: number;
  caption: string;
  src: string;
}

const galleryItems: GalleryItem[] = [
  { id: 1, caption: "Duo Cees Rahmat & Ilal", src: "/rahmat_ilal.jpg" },
  { id: 2, caption: "Dokumentasi Proyek 1", src: "/images/friendship/img/foto (2).jpg" },
  { id: 3, caption: "Dokumentasi Proyek 2", src: "/images/friendship/img/foto (3).jpg" },
  { id: 4, caption: "Dokumentasi Proyek 3", src: "/images/friendship/img/foto (4).jpg" },
  { id: 5, caption: "Dokumentasi Proyek 4", src: "/images/friendship/img/foto (5).jpg" },
  { id: 6, caption: "Dokumentasi Kebersamaan 5", src: "/images/friendship/img/foto (6).jpg" },
  { id: 7, caption: "Dokumentasi Kebersamaan 6", src: "/images/friendship/img/foto (6).jpg" },
  { id: 8, caption: "Dokumentasi Kebersamaan 7", src: "/images/friendship/img/foto (7).jpg" },
  { id: 9, caption: "Dokumentasi Kebersamaan 8", src: "/images/friendship/img/foto (8).jpg" },
  { id: 10, caption: "Dokumentasi Kebersamaan 9", src: "/images/friendship/img/foto (9).jpg" },
];

export default function FriendshipGallery() {
  const [search, setSearch] = useState("");
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);

  const filteredItems = galleryItems.filter((item) =>
    item.caption.toLowerCase().includes(search.toLowerCase().trim())
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
      {/* Banner Card */}
      <div
        style={{
          backgroundColor: "var(--color-surface)",
          border: "1px solid var(--color-border)",
          borderRadius: "var(--radius-md)",
          padding: "clamp(18px, 4vw, 32px)",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 260px), 1fr))",
            gap: "24px",
            alignItems: "center",
          }}
        >
          <div>
            <span
              style={{
                padding: "4px 10px",
                borderRadius: "var(--radius-pill)",
                fontSize: "0.75rem",
                fontWeight: 600,
                backgroundColor: "var(--color-primary-50)",
                color: "var(--color-primary-600)",
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                marginBottom: "12px",
              }}
            >
              <Users size={14} /> Personal Gallery
            </span>
            <h1 style={{ fontSize: "clamp(1.5rem, 4vw, 2rem)", marginBottom: "8px" }}>Duo Cees</h1>
            <div style={{ fontSize: "1.05rem", color: "var(--color-primary-600)", fontWeight: 700, marginBottom: "12px" }}>
              Rahmat Haikal &amp; Ilal Ilhamdi
            </div>
            <p style={{ fontSize: "0.92rem", color: "var(--color-text-secondary)", lineHeight: 1.6 }}>
              Kumpulan momen kebersamaan, cerita perjalanan, dan dokumentasi kolaborasi dalam memecahkan berbagai proyek teknologi dan jaringan.
            </p>
          </div>

          <div style={{ textAlign: "center" }}>
            <Image
              src="/rahmat_ilal.jpg"
              alt="Rahmat Haikal & Ilal Ilhamdi"
              width={340}
              height={260}
              style={{
                width: "100%",
                maxWidth: "340px",
                height: "auto",
                borderRadius: "var(--radius-md)",
                objectFit: "cover",
                border: "3px solid var(--color-border)",
                boxShadow: "var(--shadow-md)",
                marginInline: "auto",
              }}
            />
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "12px" }}>
        <h2 style={{ fontSize: "1.3rem" }}>Galeri Momen Kebersamaan ({filteredItems.length})</h2>
        <div style={{ position: "relative", width: "100%", maxWidth: "300px" }}>
          <Search size={18} style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "var(--color-text-muted)" }} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari momen..."
            style={{
              width: "100%",
              padding: "12px 14px 12px 42px",
              borderRadius: "var(--radius-sm)",
              border: "1px solid var(--color-border)",
              backgroundColor: "var(--color-surface)",
              fontSize: "1rem",
            }}
          />
        </div>
      </div>

      {/* Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 160px), 1fr))",
          gap: "16px",
        }}
      >
        {filteredItems.map((item, idx) => (
          <div
            key={item.id}
            onClick={() => setLightboxIdx(idx)}
            style={{
              backgroundColor: "var(--color-surface)",
              border: "1px solid var(--color-border)",
              borderRadius: "var(--radius-md)",
              overflow: "hidden",
              cursor: "pointer",
              boxShadow: "var(--shadow-sm)",
              transition: "transform var(--transition-fast)",
            }}
          >
            <div style={{ position: "relative", width: "100%", aspectRatio: "4/3" }}>
              <Image
                src={item.src}
                alt={item.caption}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 250px"
                style={{ objectFit: "cover" }}
              />
            </div>
            <div style={{ padding: "10px", fontSize: "0.85rem", fontWeight: 600, textAlign: "center" }}>
              {item.caption}
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {lightboxIdx !== null && filteredItems[lightboxIdx] && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(7, 19, 38, 0.92)",
            backdropFilter: "blur(8px)",
            zIndex: 1000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "16px",
          }}
          onClick={() => setLightboxIdx(null)}
        >
          <button
            onClick={() => setLightboxIdx(null)}
            style={{
              position: "absolute",
              top: "16px",
              right: "16px",
              color: "#ffffff",
              backgroundColor: "rgba(255,255,255,0.2)",
              width: "44px",
              height: "44px",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 1001,
            }}
            aria-label="Tutup Preview Foto"
          >
            <X size={24} />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              setLightboxIdx((prev) => (prev !== null ? (prev - 1 + filteredItems.length) % filteredItems.length : 0));
            }}
            style={{
              position: "absolute",
              left: "12px",
              top: "50%",
              transform: "translateY(-50%)",
              color: "#ffffff",
              backgroundColor: "rgba(255,255,255,0.2)",
              width: "44px",
              height: "44px",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 1001,
            }}
            aria-label="Foto Sebelumnya"
          >
            <ChevronLeft size={24} />
          </button>

          <div onClick={(e) => e.stopPropagation()} style={{ textAlign: "center", maxWidth: "90vw", maxHeight: "80dvh" }}>
            <Image
              src={filteredItems[lightboxIdx].src}
              alt={filteredItems[lightboxIdx].caption}
              width={800}
              height={600}
              style={{
                maxWidth: "100%",
                maxHeight: "70dvh",
                objectFit: "contain",
                borderRadius: "var(--radius-md)",
              }}
            />
            <div style={{ color: "#ffffff", marginTop: "12px", fontSize: "0.95rem", fontWeight: 600 }}>
              {filteredItems[lightboxIdx].caption}
            </div>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              setLightboxIdx((prev) => (prev !== null ? (prev + 1) % filteredItems.length : 0));
            }}
            style={{
              position: "absolute",
              right: "12px",
              top: "50%",
              transform: "translateY(-50%)",
              color: "#ffffff",
              backgroundColor: "rgba(255,255,255,0.2)",
              width: "44px",
              height: "44px",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 1001,
            }}
            aria-label="Foto Selanjutnya"
          >
            <ChevronRight size={24} />
          </button>
        </div>
      )}
    </div>
  );
}
