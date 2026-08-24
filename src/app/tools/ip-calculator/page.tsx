import type { Metadata } from "next";
import IpCalculator from "@/components/tools/IpCalculator";
import { constructMetadata } from "@/lib/metadata";

export const metadata: Metadata = constructMetadata({
  title: "IP & Mask Calculator — ALLBASE",
  description: "Alat pembagi alokasi blok IP address dan perincian wildcard mask untuk analisis jaringan telekomunikasi.",
  canonical: "/tools/ip-calculator",
});

export default function IpCalculatorPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "IP & Mask Calculator — ALLBASE",
    "url": "https://allbase.my.id/tools/ip-calculator",
    "applicationCategory": "UtilitiesApplication",
    "operatingSystem": "All",
    "description": "Alat analisis pengalamatan IPv4, kelas IP, wildcard mask, dan 32-bit binary breakdown.",
    "author": {
      "@type": "Person",
      "name": "Ilal Ilhamdi",
    },
  };

  return (
    <div className="container" style={{ paddingBlock: "48px" }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <IpCalculator />
    </div>
  );
}
