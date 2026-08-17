"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RotateCcw, Home } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error to monitoring service if needed
    console.error("ALLBASE Runtime Error:", error);
  }, [error]);

  return (
    <div
      className="container"
      style={{
        paddingBlock: "80px",
        textAlign: "center",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          width: "64px",
          height: "64px",
          borderRadius: "50%",
          backgroundColor: "var(--color-danger-soft)",
          color: "var(--color-danger)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: "20px",
        }}
      >
        <AlertTriangle size={32} />
      </div>

      <h1 style={{ fontSize: "2rem", marginBottom: "12px" }}>Terjadi Kendala Teknis</h1>
      <p style={{ color: "var(--color-text-secondary)", maxWidth: "480px", marginBottom: "32px" }}>
        Maaf, sistem mengalami kesalahan saat memuat komponen ini. Silakan coba muat ulang.
      </p>

      <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", justifyContent: "center" }}>
        <button
          onClick={() => reset()}
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
          <RotateCcw size={18} /> Coba Lagi
        </button>

        <Link
          href="/"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            padding: "12px 24px",
            borderRadius: "var(--radius-sm)",
            border: "1px solid var(--color-border)",
            color: "var(--color-text-primary)",
            fontWeight: 600,
          }}
        >
          <Home size={18} /> Kembali ke Beranda
        </Link>
      </div>
    </div>
  );
}
