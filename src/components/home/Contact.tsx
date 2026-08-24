import { MessageCircle, Mail, GitBranch } from "lucide-react";
import { socialLinks } from "@/data/social-links";

export default function Contact() {
  return (
    <section id="contact" className="section section-alt" aria-labelledby="contact-title">
      <div className="container" style={{ textAlign: "center" }}>
        <div className="sectionHeader">
          <span className="sectionBadge">
            Hubungi Saya
          </span>
          <h2 id="contact-title" className="sectionTitle">
            Mari Terhubung &amp; Berkolaborasi
          </h2>
          <p className="sectionDescription">
            Tertarik untuk berkolaborasi dalam proyek jaringan komputer, infrastruktur, atau pengembangan web modern? Silakan hubungi saya melalui channel berikut.
          </p>
        </div>

        {/* 4 Centered Contact Cards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 220px), 1fr))",
            gap: "16px",
            maxWidth: "960px",
            marginInline: "auto",
          }}
        >
          {/* WhatsApp */}
          <a
            href={socialLinks.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="baseCard"
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: "10px",
              minHeight: "110px",
              padding: "20px 16px",
              textDecoration: "none",
              color: "var(--color-text-primary)",
            }}
            aria-label="Hubungi Ilal via WhatsApp"
          >
            <div
              style={{
                width: "44px",
                height: "44px",
                borderRadius: "var(--radius-sm)",
                backgroundColor: "rgba(22, 163, 74, 0.12)",
                color: "var(--color-success)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <MessageCircle size={22} />
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: "0.95rem" }}>WhatsApp</div>
              <div style={{ fontSize: "0.78rem", color: "var(--color-text-secondary)" }}>Chat Langsung</div>
            </div>
          </a>

          {/* Email */}
          <a
            href={socialLinks.email}
            className="baseCard"
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: "10px",
              minHeight: "110px",
              padding: "20px 16px",
              textDecoration: "none",
              color: "var(--color-text-primary)",
            }}
            aria-label="Kirim Email ke Ilal"
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
              <Mail size={22} />
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: "0.95rem" }}>Email / Gmail</div>
              <div style={{ fontSize: "0.78rem", color: "var(--color-text-secondary)" }}>Kirim Pesan Resmi</div>
            </div>
          </a>

          {/* GitHub */}
          <a
            href={socialLinks.github}
            target="_blank"
            rel="noopener noreferrer"
            className="baseCard"
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: "10px",
              minHeight: "110px",
              padding: "20px 16px",
              textDecoration: "none",
              color: "var(--color-text-primary)",
            }}
            aria-label="Kunjungi Profil GitHub Ilal"
          >
            <div
              style={{
                width: "44px",
                height: "44px",
                borderRadius: "var(--radius-sm)",
                backgroundColor: "var(--color-surface-soft)",
                color: "var(--color-text-primary)",
                border: "1px solid var(--color-border)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <GitBranch size={22} />
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: "0.95rem" }}>GitHub</div>
              <div style={{ fontSize: "0.78rem", color: "var(--color-text-secondary)" }}>@IlalIlhamdi</div>
            </div>
          </a>

          {/* TikTok */}
          <a
            href={socialLinks.tiktok}
            target="_blank"
            rel="noopener noreferrer"
            className="baseCard"
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: "10px",
              minHeight: "110px",
              padding: "20px 16px",
              textDecoration: "none",
              color: "var(--color-text-primary)",
            }}
            aria-label="Kunjungi Akun TikTok @raxil424"
          >
            <div
              style={{
                width: "44px",
                height: "44px",
                borderRadius: "var(--radius-sm)",
                backgroundColor: "rgba(225, 29, 72, 0.1)",
                color: "#e11d48",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.29 0 .58.05.85.14V9.41a6.33 6.33 0 0 0-.85-.06 6.33 6.33 0 0 0-6.33 6.33 6.33 6.33 0 0 0 6.33-6.33V9.01a8.16 8.16 0 0 0 4.78 1.52V7.1a4.85 4.85 0 0 1-1.005-.41z" />
              </svg>
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: "0.95rem" }}>TikTok</div>
              <div style={{ fontSize: "0.78rem", color: "var(--color-text-secondary)" }}>@raxil424</div>
            </div>
          </a>
        </div>
      </div>
    </section>
  );
}
