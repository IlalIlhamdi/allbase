import { MessageCircle, Mail, GitBranch } from "lucide-react";
import { socialLinks } from "@/data/social-links";

export default function Contact() {
  return (
    <section id="contact" className="section section-alt" aria-labelledby="contact-title">
      <div className="container" style={{ textAlign: "center" }}>
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
          Hubungi Saya
        </span>
        <h2 id="contact-title" style={{ fontSize: "2rem", marginBottom: "12px" }}>
          Mari Berdiskusi
        </h2>
        <p
          style={{
            color: "var(--color-text-secondary)",
            maxWidth: "560px",
            marginInline: "auto",
            marginBottom: "32px",
          }}
        >
          Tertarik untuk berkolaborasi dalam proyek jaringan atau pengembangan web? Kontak saya secara langsung.
        </p>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "16px",
            flexWrap: "wrap",
          }}
        >
          <a
            href={socialLinks.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "12px 24px",
              borderRadius: "var(--radius-sm)",
              backgroundColor: "var(--color-primary-600)",
              color: "#ffffff",
              fontWeight: 600,
              fontSize: "0.95rem",
            }}
            aria-label="Hubungi via WhatsApp Chat"
          >
            <MessageCircle size={18} /> Hubungi via WhatsApp
          </a>

          <a
            href={socialLinks.email}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "12px 24px",
              borderRadius: "var(--radius-sm)",
              backgroundColor: "var(--color-surface)",
              border: "1px solid var(--color-border)",
              color: "var(--color-text-primary)",
              fontWeight: 600,
              fontSize: "0.95rem",
            }}
            aria-label="Kirim Email Direct"
          >
            <Mail size={18} /> Kirim Email Direct
          </a>

          <a
            href={socialLinks.github}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "12px 24px",
              borderRadius: "var(--radius-sm)",
              border: "1px solid var(--color-border)",
              color: "var(--color-text-primary)",
              fontWeight: 600,
              fontSize: "0.95rem",
            }}
            aria-label="Kunjungi Profil GitHub"
          >
            <GitBranch size={18} /> GitHub Profile
          </a>
        </div>
      </div>
    </section>
  );
}
