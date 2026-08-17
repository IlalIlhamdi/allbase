import { certificatesData } from "@/data/certificates";
import CertificateCard from "@/components/cards/CertificateCard";

export default function Certifications() {
  return (
    <section id="certifications" className="section" aria-labelledby="certs-title">
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
            Kredensial
          </span>
          <h2 id="certs-title" className="sectionTitle">
            Sertifikasi &amp; Pencapaian
          </h2>
          <p className="sectionDescription">
            Sertifikasi resmi dan pendidikan teknis yang saya selesaikan.
          </p>
        </div>

        <div className="cardsGrid">
          {certificatesData.map((cert) => (
            <CertificateCard key={cert.id} certificate={cert} />
          ))}
        </div>
      </div>
    </section>
  );
}
