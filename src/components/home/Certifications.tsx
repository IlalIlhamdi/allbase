import { certificatesData } from "@/data/certificates";
import CertificateCard from "@/components/cards/CertificateCard";

export default function Certifications() {
  return (
    <section id="certifications" className="section" aria-labelledby="certs-title">
      <div className="container">
        <div style={{ textAlign: "center", marginBottom: "48px" }}>
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
            Kredensial
          </span>
          <h2 id="certs-title" style={{ fontSize: "2rem", marginBottom: "12px" }}>
            Sertifikasi &amp; Pencapaian
          </h2>
          <p style={{ color: "var(--color-text-secondary)", maxWidth: "600px", marginInline: "auto" }}>
            Sertifikasi resmi dan pendidikan teknis yang saya selesaikan.
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "24px",
          }}
        >
          {certificatesData.map((cert) => (
            <CertificateCard key={cert.id} certificate={cert} />
          ))}
        </div>
      </div>
    </section>
  );
}
