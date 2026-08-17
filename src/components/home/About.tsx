import { BookOpen, Activity, Code2 } from "lucide-react";

export default function About() {
  return (
    <section id="about" className="section section-alt" aria-labelledby="about-title">
      <div className="container">
        <div style={{ textAlign: "center", marginBottom: "clamp(32px, 5vw, 48px)" }}>
          <span
            style={{
              padding: "4px 12px",
              borderRadius: "var(--radius-pill)",
              backgroundColor: "var(--color-primary-50)",
              color: "var(--color-primary-600)",
              fontSize: "0.82rem",
              fontWeight: 600,
              display: "inline-block",
              marginBottom: "12px",
              border: "1px solid var(--color-border)",
            }}
          >
            Profil Singkat
          </span>
          <h2 id="about-title" className="sectionTitle">
            Tentang Saya
          </h2>
          <p className="sectionDescription">
            Dedikasi dalam rekayasa jaringan telekomunikasi dan pengembangan perangkat lunak terpadu.
          </p>
        </div>

        <div className="cardsGrid">
          <div
            style={{
              backgroundColor: "var(--color-surface)",
              border: "1px solid var(--color-border)",
              borderRadius: "var(--radius-md)",
              padding: "clamp(20px, 4vw, 28px)",
              boxShadow: "var(--shadow-sm)",
            }}
          >
            <h3 style={{ fontSize: "1.2rem", marginBottom: "12px", display: "flex", alignItems: "center", gap: "10px" }}>
              <BookOpen size={22} color="var(--color-primary-600)" /> Bidang Studi
            </h3>
            <p style={{ fontSize: "0.92rem", color: "var(--color-text-secondary)", lineHeight: 1.6 }}>
              Mahasiswa Teknik Telekomunikasi &amp; Jaringan yang berfokus pada desain infrastruktur jaringan, IP routing, switching, dan pemantauan sistem.
            </p>
          </div>

          <div
            style={{
              backgroundColor: "var(--color-surface)",
              border: "1px solid var(--color-border)",
              borderRadius: "var(--radius-md)",
              padding: "clamp(20px, 4vw, 28px)",
              boxShadow: "var(--shadow-sm)",
            }}
          >
            <h3 style={{ fontSize: "1.2rem", marginBottom: "12px", display: "flex", alignItems: "center", gap: "10px" }}>
              <Activity size={22} color="var(--color-primary-600)" /> Fokus Pembelajaran
            </h3>
            <p style={{ fontSize: "0.92rem", color: "var(--color-text-secondary)", lineHeight: 1.6 }}>
              Pengembangan alat pemindai jaringan (Network Scanner), subnet calculator IPv4, serta otomatisasi monitoring dengan Prometheus &amp; Grafana.
            </p>
          </div>

          <div
            style={{
              backgroundColor: "var(--color-surface)",
              border: "1px solid var(--color-border)",
              borderRadius: "var(--radius-md)",
              padding: "clamp(20px, 4vw, 28px)",
              boxShadow: "var(--shadow-sm)",
            }}
          >
            <h3 style={{ fontSize: "1.2rem", marginBottom: "12px", display: "flex", alignItems: "center", gap: "10px" }}>
              <Code2 size={22} color="var(--color-primary-600)" /> Web &amp; Software
            </h3>
            <p style={{ fontSize: "0.92rem", color: "var(--color-text-secondary)", lineHeight: 1.6 }}>
              Mengembangkan aplikasi web modern berbasis Next.js App Router, React, dan TypeScript yang responsif, cepat, serta mudah dipelihara.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
