"use client";

import Link from "next/link";
import { Cpu, ArrowRight } from "lucide-react";

export default function IpCalculator() {
  return (
    <div
      style={{
        backgroundColor: "var(--color-surface)",
        border: "1px solid var(--color-border)",
        borderRadius: "var(--radius-md)",
        padding: "32px",
        maxWidth: "800px",
        marginInline: "auto",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
        <Cpu size={28} color="var(--color-primary-600)" />
        <h1 style={{ fontSize: "1.6rem" }}>IP &amp; Mask Calculator</h1>
      </div>
      <p style={{ color: "var(--color-text-secondary)", marginBottom: "24px", lineHeight: 1.6 }}>
        Alat cepat untuk menganalisis alokasi blok IP address, kelas IP, subnet mask, dan rentang alamat host.
      </p>
      <Link
        href="/tools/subnet-calculator/"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "8px",
          padding: "12px 24px",
          borderRadius: "var(--radius-sm)",
          backgroundColor: "var(--color-primary-600)",
          color: "#ffffff",
          fontWeight: 600,
        }}
      >
        Buka Subnet Calculator Lengkap <ArrowRight size={18} />
      </Link>
    </div>
  );
}
