import { Award } from "lucide-react";
import { certificatesData } from "@/data/certificates";
import CertificateCard from "@/components/cards/CertificateCard";

export default function Certifications() {
  return (
    <section id="certifications" className="section" aria-labelledby="certs-title">
      <div className="container">
        <div className="sectionHeader">
          <span className="sectionBadge">
            <Award size={14} /> Kredensial Resmi
          </span>
          <h2 id="certs-title" className="sectionTitle">
            Sertifikasi &amp; Pencapaian
          </h2>
          <p className="sectionDescription">
            Sertifikasi resmi dan pendidikan teknis bidang jaringan komputer &amp; telekomunikasi yang telah saya selesaikan.
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
