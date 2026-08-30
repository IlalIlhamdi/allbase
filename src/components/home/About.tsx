import { BookOpen, Activity, Code2, Sparkles, MapPin, GraduationCap } from "lucide-react";

export default function About() {
  return (
    <section id="about" className="section section-alt" aria-labelledby="about-title">
      <div className="container">
        <div className="sectionHeader">
          <span className="sectionBadge">
            <Sparkles size={14} /> Profil Singkat
          </span>
          <h2 id="about-title" className="sectionTitle">
            Tentang Saya
          </h2>
          <p className="sectionDescription">
            Dedikasi dalam rekayasa jaringan telekomunikasi, infrastruktur switching &amp; routing, serta pengembangan perangkat lunak web modern.
          </p>
        </div>

        {/* Profile Intro Banner */}
        <div
          className="baseCard"
          style={{
            padding: "clamp(20px, 4vw, 32px)",
            marginBottom: "24px",
          }}
        >
          <div style={{ textAlign: "left" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap", marginBottom: "8px" }}>
              <h3 style={{ fontSize: "1.35rem", fontWeight: 800 }}>Ilal Ilhamdi</h3>
            </div>
            <p style={{ fontSize: "0.98rem", color: "var(--color-text-secondary)", lineHeight: 1.65, marginBottom: "16px" }}>
              Network &amp; Technology Enthusiast yang aktif mendalami konfigurasi perangkat jaringan Cisco &amp; MikroTik, analisis pengalamatan IPv4/IPv6, serta pembuatan alat bantu utilitas teknis berbasis web yang presisi.
            </p>
            <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", fontSize: "0.86rem", color: "var(--color-text-muted)" }}>
              <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                <GraduationCap size={16} color="var(--color-primary-500)" /> Teknik Telekomunikasi &amp; Jaringan
              </span>
              <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                <MapPin size={16} color="var(--color-primary-500)" /> Padang, Indonesia
              </span>
            </div>
          </div>
        </div>

        {/* 3 Core Focus Cards */}
        <div className="cardsGrid">
          <div
            className="baseCard"
            style={{
              padding: "clamp(20px, 4vw, 28px)",
              display: "flex",
              flexDirection: "column",
              gap: "12px",
            }}
          >
            <div
              style={{
                width: "44px",
                height: "44px",
                borderRadius: "var(--radius-sm)",
                backgroundColor: "var(--color-primary-50)",
                color: "var(--color-primary-600)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <BookOpen size={22} />
            </div>
            <h3 style={{ fontSize: "1.18rem", fontWeight: 700 }}>Bidang Studi</h3>
            <p style={{ fontSize: "0.9rem", color: "var(--color-text-secondary)", lineHeight: 1.65 }}>
              Mahasiswa Teknik Telekomunikasi &amp; Jaringan yang berfokus pada desain infrastruktur jaringan, IP routing, switching, dan pemantauan sistem telekomunikasi.
            </p>
          </div>

          <div
            className="baseCard"
            style={{
              padding: "clamp(20px, 4vw, 28px)",
              display: "flex",
              flexDirection: "column",
              gap: "12px",
            }}
          >
            <div
              style={{
                width: "44px",
                height: "44px",
                borderRadius: "var(--radius-sm)",
                backgroundColor: "rgba(6, 182, 212, 0.1)",
                color: "#06b6d4",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Activity size={22} />
            </div>
            <h3 style={{ fontSize: "1.18rem", fontWeight: 700 }}>Fokus Pembelajaran</h3>
            <p style={{ fontSize: "0.9rem", color: "var(--color-text-secondary)", lineHeight: 1.65 }}>
              Eksplorasi alat pemindai jaringan (Network Scanner), subnet calculator IPv4 presisi, analisis latency &amp; jitter, serta otomatisasi monitoring sistem.
            </p>
          </div>

          <div
            className="baseCard"
            style={{
              padding: "clamp(20px, 4vw, 28px)",
              display: "flex",
              flexDirection: "column",
              gap: "12px",
            }}
          >
            <div
              style={{
                width: "44px",
                height: "44px",
                borderRadius: "var(--radius-sm)",
                backgroundColor: "rgba(16, 185, 129, 0.1)",
                color: "#10b981",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Code2 size={22} />
            </div>
            <h3 style={{ fontSize: "1.18rem", fontWeight: 700 }}>Web &amp; Software</h3>
            <p style={{ fontSize: "0.9rem", color: "var(--color-text-secondary)", lineHeight: 1.65 }}>
              Mengembangkan aplikasi web modern berbasis Next.js App Router, React, dan TypeScript yang responsif, cepat, serta mudah dipelihara di berbagai perangkat.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
