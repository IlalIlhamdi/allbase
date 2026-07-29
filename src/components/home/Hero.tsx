import Image from "next/image";
import Link from "next/link";
import { Grid, Wrench, Send, GitBranch, MessageCircle, Mail } from "lucide-react";
import { socialLinks } from "@/data/social-links";

export default function Hero() {
  return (
    <section
      id="hero"
      className="section"
      style={{
        paddingTop: "48px",
        paddingBottom: "64px",
      }}
    >
      <div className="container">
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "48px",
            alignItems: "center",
          }}
        >
          {/* Left Column */}
          <div>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "6px 14px",
                borderRadius: "var(--radius-pill)",
                backgroundColor: "var(--color-primary-50)",
                color: "var(--color-primary-600)",
                fontSize: "0.85rem",
                fontWeight: 600,
                marginBottom: "20px",
                border: "1px solid var(--color-border)",
              }}
            >
              <span
                style={{
                  width: "8px",
                  height: "8px",
                  borderRadius: "50%",
                  backgroundColor: "var(--color-primary-600)",
                  display: "inline-block",
                }}
              />
              Network • Technology • Development
            </div>

            <h1
              style={{
                fontSize: "clamp(2rem, 5vw, 3.2rem)",
                fontWeight: 800,
                lineHeight: 1.15,
                marginBottom: "20px",
              }}
            >
              Semua Proyek dan Tool, <br />
              Dalam <span style={{ color: "var(--color-primary-600)" }}>Satu Base.</span>
            </h1>

            <p
              style={{
                fontSize: "1.05rem",
                color: "var(--color-text-secondary)",
                lineHeight: 1.6,
                marginBottom: "32px",
                maxWidth: "600px",
              }}
            >
              ALLBASE adalah pusat portofolio, proyek, dan berbagai tool yang saya bangun untuk pembelajaran jaringan telekomunikasi, teknologi, dan pengembangan aplikasi web modern.
            </p>

            <div style={{ display: "flex", flexWrap: "wrap", gap: "12px", marginBottom: "32px" }}>
              <Link
                href="#projects"
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
              >
                <Grid size={18} /> Lihat Proyek
              </Link>

              <Link
                href="#tools"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "12px 24px",
                  borderRadius: "var(--radius-sm)",
                  backgroundColor: "var(--color-surface-soft)",
                  border: "1px solid var(--color-border)",
                  color: "var(--color-text-primary)",
                  fontWeight: 600,
                  fontSize: "0.95rem",
                }}
              >
                <Wrench size={18} /> Buka Tools
              </Link>

              <Link
                href="#contact"
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
              >
                <Send size={18} /> Hubungi Saya
              </Link>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <a
                href={socialLinks.github}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  width: "44px",
                  height: "44px",
                  borderRadius: "var(--radius-sm)",
                  border: "1px solid var(--color-border)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "var(--color-text-primary)",
                }}
                title="Profil GitHub"
                aria-label="Profil GitHub"
              >
                <GitBranch size={20} />
              </a>

              <a
                href={socialLinks.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  width: "44px",
                  height: "44px",
                  borderRadius: "var(--radius-sm)",
                  border: "1px solid var(--color-border)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "var(--color-text-primary)",
                }}
                title="Chat WhatsApp"
                aria-label="Chat WhatsApp"
              >
                <MessageCircle size={20} />
              </a>

              <a
                href={socialLinks.email}
                style={{
                  width: "44px",
                  height: "44px",
                  borderRadius: "var(--radius-sm)",
                  border: "1px solid var(--color-border)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "var(--color-text-primary)",
                }}
                title="Kirim Email"
                aria-label="Kirim Email"
              >
                <Mail size={20} />
              </a>
            </div>
          </div>

          {/* Right Column: Visual Profile Frame */}
          <div style={{ display: "flex", justifyContent: "center" }}>
            <div
              style={{
                position: "relative",
                width: "100%",
                maxWidth: "320px",
                borderRadius: "var(--radius-lg)",
                overflow: "hidden",
                border: "4px solid var(--color-surface)",
                boxShadow: "var(--shadow-lg)",
                backgroundColor: "var(--color-surface)",
              }}
            >
              <Image
                src="/profile.jpg"
                alt="Ilal Ilhamdi"
                width={320}
                height={380}
                priority
                style={{
                  width: "100%",
                  height: "auto",
                  objectFit: "cover",
                  display: "block",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  right: 0,
                  background: "linear-gradient(to top, rgba(7, 19, 38, 0.9), transparent)",
                  padding: "20px 16px 16px",
                  color: "#ffffff",
                }}
              >
                <h3 style={{ fontSize: "1.2rem", color: "#ffffff", marginBottom: "2px" }}>Ilal Ilhamdi</h3>
                <p style={{ fontSize: "0.85rem", color: "var(--color-primary-200)" }}>
                  Network &amp; Technology Enthusiast
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
