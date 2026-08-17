"use client";

import dynamic from "next/dynamic";
import { Gauge } from "lucide-react";

const InternetSpeedTestClient = dynamic(
  () => import("@/components/tools/InternetSpeedTest"),
  {
    ssr: false,
    loading: () => (
      <div
        style={{
          maxWidth: "720px",
          margin: "40px auto",
          padding: "48px 24px",
          textAlign: "center",
          backgroundColor: "var(--color-surface)",
          borderRadius: "var(--radius-xl)",
          border: "1px solid var(--color-border)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "12px",
        }}
      >
        <Gauge size={32} color="var(--color-primary-600)" style={{ animation: "spin 3s linear infinite" }} />
        <div style={{ fontWeight: 700, fontSize: "1rem", color: "var(--color-text-primary)" }}>
          Memuat Engine Speed Test...
        </div>
        <div style={{ fontSize: "0.82rem", color: "var(--color-text-secondary)" }}>
          Menyiapkan modul Cloudflare Edge Network
        </div>
      </div>
    ),
  }
);

export default function InternetSpeedTestWrapper() {
  return <InternetSpeedTestClient />;
}
