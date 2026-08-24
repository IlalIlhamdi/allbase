import type { Metadata } from "next";
import NetworkConverter from "@/components/tools/NetworkConverter";
import { constructMetadata } from "@/lib/metadata";

export const metadata: Metadata = constructMetadata({
  title: "Konversi Satuan Jaringan — ALLBASE",
  description: "Alat konversi kecepatan internet dua arah (Mbps ke MB/s) serta format bilangan desimal, biner, dan heksadesimal.",
  canonical: "/tools/network-converter",
});

export default function NetworkConverterPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Konversi Satuan Jaringan — ALLBASE",
    "url": "https://allbase.my.id/tools/network-converter",
    "applicationCategory": "UtilitiesApplication",
    "operatingSystem": "All",
    "description": "Utilitas konversi kecepatan internet Mbps ke MB/s, biner, desimal, heksadesimal, dan prefix CIDR.",
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
      <NetworkConverter />
    </div>
  );
}
