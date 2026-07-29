import { Certificate } from "@/types/certificate";
import { Award, ExternalLink, ShieldCheck } from "lucide-react";

interface CertificateCardProps {
  certificate: Certificate;
}

export default function CertificateCard({ certificate }: CertificateCardProps) {
  const hasLink = Boolean(certificate.credentialUrl);

  return (
    <article
      style={{
        backgroundColor: "var(--color-surface)",
        border: "1px solid var(--color-border)",
        borderRadius: "var(--radius-md)",
        padding: "clamp(18px, 4vw, 24px)",
        display: "flex",
        flexDirection: "column",
        gap: "16px",
        boxShadow: "var(--shadow-sm)",
      }}
    >
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: "8px" }}>
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
            flexShrink: 0,
          }}
        >
          <Award size={22} />
        </div>
        <span
          style={{
            fontSize: "0.8rem",
            fontWeight: 700,
            fontFamily: "var(--font-mono)",
            padding: "4px 10px",
            borderRadius: "var(--radius-pill)",
            backgroundColor: "var(--color-surface-soft)",
            color: "var(--color-primary-600)",
            border: "1px solid var(--color-border)",
          }}
        >
          Tahun {certificate.year}
        </span>
      </div>

      <div>
        <div style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--color-primary-600)", marginBottom: "4px" }}>
          {certificate.issuer}
        </div>
        <h3 style={{ fontSize: "1.15rem", marginBottom: "8px" }}>{certificate.title}</h3>
        <p style={{ fontSize: "0.9rem", color: "var(--color-text-secondary)", lineHeight: 1.6 }}>{certificate.description}</p>
      </div>

      <div style={{ marginTop: "auto", paddingTop: "14px", borderTop: "1px solid var(--color-border)" }}>
        {hasLink ? (
          <a
            href={certificate.credentialUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              minHeight: "44px",
              padding: "8px 16px",
              borderRadius: "var(--radius-sm)",
              backgroundColor: "var(--color-primary-600)",
              color: "#ffffff",
              fontSize: "0.88rem",
              fontWeight: 600,
              width: "100%",
              justifyContent: "center",
            }}
          >
            <ShieldCheck size={16} /> {certificate.verifyText || certificate.verificationLabel || "Verifikasi Sertifikat"} <ExternalLink size={14} />
          </a>
        ) : (
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              fontSize: "0.85rem",
              color: "var(--color-text-muted)",
              fontWeight: 500,
              minHeight: "44px",
            }}
          >
            <ShieldCheck size={16} /> Kredensial Resmi MikroTik
          </span>
        )}
      </div>
    </article>
  );
}
