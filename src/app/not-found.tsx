import Link from "next/link";
import { AlertCircle, Home, Wrench } from "lucide-react";

export default function NotFound() {
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
          backgroundColor: "var(--color-primary-50)",
          color: "var(--color-primary-600)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: "20px",
        }}
      >
        <AlertCircle size={32} />
      </div>

      <h1 style={{ fontSize: "2rem", marginBottom: "12px" }}>Halaman Tidak Ditemukan (404)</h1>
      <p style={{ color: "var(--color-text-secondary)", maxWidth: "480px", marginBottom: "32px" }}>
        Maaf, halaman yang Anda tuju tidak ditemukan atau telah dipindahkan ke alamat lain.
      </p>

      <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", justifyContent: "center" }}>
        <Link
          href="/"
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
          <Home size={18} /> Kembali ke Beranda
        </Link>

        <Link
          href="/#tools"
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
          <Wrench size={18} /> Buka Daftar Tools
        </Link>
      </div>
    </div>
  );
}
